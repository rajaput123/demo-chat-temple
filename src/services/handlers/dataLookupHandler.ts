/**
 * Data Lookup Handler
 * 
 * Fallback handler that searches real data instead of returning generic/hallucinated responses.
 * This ensures all queries either match a specific handler OR search actual data.
 */

import { DataLookupService } from '@/services/dataLookupService';
import { CanvasSection } from '@/hooks/useSimulation';
import { createSection, createPlannerSection } from '@/services/sectionManager';
import { generatePlannerActionsFromQuery } from '@/utils/plannerHelpers';
import { generateInfoCardContent } from '@/services/infoCardContentGenerator';
import { generateCEOActions, formatActionsForPlanner } from '@/services/ceoActionGenerator';

export interface DataLookupHandlerResult {
    handled: boolean;
    response?: string;
    sections?: CanvasSection[];
    hasData: boolean;
}

/**
 * Handle data lookup for queries that don't match any specific handler
 * Generates canvas sections when data is found
 */
export function handleDataLookup(query: string): DataLookupHandlerResult {
    const lookupResult = DataLookupService.lookupData(query);
    
    if (lookupResult.type === 'none' || lookupResult.data.length === 0) {
        return {
            handled: true,
            response: generateNotFoundResponse(query),
            sections: [],
            hasData: false
        };
    }
    
    // Use temple response format: Generate info card from calendar aggregation
    const infoCardContent = generateInfoCardContent(query);
    
    // Generate CEO-level actions
    const ceoActions = generateCEOActions(query);
    const plannerActions = formatActionsForPlanner(ceoActions);
    
    // Generate info section (top) with RichCard format
    const infoSection: CanvasSection = createSection(
        `focus-info-lookup-${Date.now()}`,
        infoCardContent.highlightTitle,
        JSON.stringify(infoCardContent),
        'text'
    );

    // Generate planner section with CEO actions
    const sections: CanvasSection[] = [infoSection];
    sections.push(createPlannerSection(plannerActions, 'Query Follow-up'));

    return {
        handled: true,
        response: `I found information about "${query}".`,
        sections,
        hasData: true
    };
}

/**
 * Generate a helpful "not found" response instead of hallucinating
 */
function generateNotFoundResponse(query: string): string {
    return `I couldn't find information about "${query}" in the available data.\n\nI can help you with:\n- Employee and department information\n- Inventory and kitchen data\n- Operations and events\n- VIP visits and appointments\n- Financial information\n\nTry asking about specific items, people, or departments.`;
}

