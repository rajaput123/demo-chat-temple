/**
 * Info Query Handler
 * Handles information and summary queries
 */

import { CanvasSection } from '@/hooks/useSimulation';
import { DataLookupService } from '@/services/dataLookupService';
import { FlexibleQueryParser } from '@/services/flexibleQueryParser';
import { generatePlannerActionsFromQuery } from '@/utils/plannerHelpers';
import { isInfoQuery, isSummaryQuery } from '@/utils/queryHelpers';
import { createSection, createPlannerSection } from '@/services/sectionManager';

export interface InfoQueryResult {
    handled: boolean;
    response?: string;
    sections?: CanvasSection[];
    needsAsyncProcessing?: boolean;
}

/**
 * Handle info/summary queries
 */
export function handleInfoQuery(query: string): InfoQueryResult {
    const lowercaseQuery = query.toLowerCase();

    // Only handle if it's an info or summary query
    if (!isInfoQuery(query) && !isSummaryQuery(query)) {
        return { handled: false };
    }

    // Try flexible query parsing for progress queries first
    const progressQuery = FlexibleQueryParser.parseProgressQuery(query);
    let summaryCardData: any = null;
    let response = '';

    if (isSummaryQuery(query) && progressQuery && progressQuery.seasonName) {
        // Get season data for summary card
        const seasonData = DataLookupService.searchFestivals(query); // Reusing festivals service for seasons
        if (seasonData.data.length > 0) {
            const season = seasonData.data[0];

            // Create rich summary card data
            summaryCardData = {
                title: `${season.seasonName || 'Production Season'} Preparation Status`,
                progress: season.progress || 0,
                status: season.status || "in-progress",
                todayHighlights: [
                    { time: 'Status', description: `Overall: ${season.progress || 0}% complete` },
                    { time: 'Actions', description: `${season.actions?.filter((a: any) => a.status === 'completed').length || 0} of ${season.actions?.length || 0} actions completed` },
                    ...(season.actions?.slice(0, 2).map((action: any) => ({
                        time: action.status === 'completed' ? '✓' : action.status === 'in-progress' ? '⟳' : '○',
                        description: action.description
                    })) || [])
                ],
                highlightTitle: "PROGRESS | HIGHLIGHTS"
            };

            response = `**${season.seasonName || 'Production Season'} Preparation Progress:**\n\n`;
            response += `Status: ${season.status}\n`;
            response += `Progress: ${season.progress}%\n\n`;
            response += `**Actions:**\n`;
            fest.actions.forEach((action: any) => {
                const statusIcon = action.status === 'completed' ? '✓' : action.status === 'in-progress' ? '⟳' : '○';
                response += `${statusIcon} ${action.description} [${action.status}]\n`;
            });
        } else {
            response = `I couldn't find specific data for "${progressQuery.festivalName}". The system is checking available information.`;
        }
    } else {
        const lookupResult = DataLookupService.lookupData(query);
        if (lookupResult.data.length > 0) {
            if (isSummaryQuery(query)) {
                response = `**Summary:**\n\n${DataLookupService.formatDataForDisplay(lookupResult)}`;
            } else {
                response = `**Information:**\n\n${DataLookupService.formatDataForDisplay(lookupResult)}`;
            }
        } else {
            response = "I couldn't find specific data matching your query. Please try rephrasing or be more specific.";
        }
    }

    // Generate planner actions
    const plannerActions = generatePlannerActionsFromQuery(query, isSummaryQuery(query) ? 'summary' : 'info');

    const sections: CanvasSection[] = [];

    // Create summary card section if we have summary data
    if (summaryCardData) {
        sections.push(createSection(`focus-summary-${Date.now()}`, 'Summary Status', JSON.stringify(summaryCardData), 'text'));
    }

    // Always add planner actions
    if (plannerActions) {
        sections.push(createPlannerSection(plannerActions, 'Query Follow-up'));
    }

    return {
        handled: true,
        response,
        sections: sections.length > 0 ? sections : undefined,
        needsAsyncProcessing: true // Requires async processing for state updates
    };
}

