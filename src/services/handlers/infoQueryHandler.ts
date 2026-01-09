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
import { generateInfoCardContent } from '@/services/infoCardContentGenerator';
import { generateCEOActions, formatActionsForPlanner } from '@/services/ceoActionGenerator';

export interface InfoQueryResult {
    handled: boolean;
    response?: string;
    sections?: CanvasSection[];
    needsAsyncProcessing?: boolean;
}

/**
 * Handle info/summary queries
 * Always generates canvas sections using temple response format:
 * PART 1: Info card (4-5 chronological items from combined calendars)
 * PART 2: Planner actions (8-10 CEO-level actions)
 */
export function handleInfoQuery(query: string): InfoQueryResult {
    const lowercaseQuery = query.toLowerCase();

    // Only handle if it's an info or summary query
    if (!isInfoQuery(query) && !isSummaryQuery(query)) {
        return { handled: false };
    }

    // Always generate info card using calendar aggregation (PART 1)
    const infoCardContent = generateInfoCardContent(query);
    
    // Always generate CEO actions (PART 2)
    const ceoActions = generateCEOActions(query);
    const plannerActions = formatActionsForPlanner(ceoActions);

    // Create sections for canvas display
    const sections: CanvasSection[] = [];

    // PART 1: Info card section (set as visible immediately for focus sections)
    const infoSection: CanvasSection = {
        id: `focus-info-${Date.now()}`,
        title: infoCardContent.highlightTitle,
        content: JSON.stringify(infoCardContent),
        type: 'text',
        visibleContent: JSON.stringify(infoCardContent), // Set full content immediately for focus sections
        isVisible: true // Set as visible immediately
    };
    sections.push(infoSection);

    // PART 2: Planner actions section
    const plannerSection: CanvasSection = {
        id: `planner-${Date.now()}`,
        title: 'Your Planner Actions',
        subTitle: 'Query Follow-up',
        content: plannerActions,
        type: 'list',
        visibleContent: plannerActions, // Set actions as visible content
        isVisible: true // Set as visible immediately
    };
    sections.push(plannerSection);

    // Chat message (simple header)
    const response = `I've retrieved information about "${query}".`;

    return {
        handled: true,
        response,
        sections: sections.length > 0 ? sections : undefined,
        needsAsyncProcessing: true // Requires async processing for state updates
    };
}

