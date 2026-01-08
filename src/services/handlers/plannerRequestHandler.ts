/**
 * Planner Request Handler
 * Handles planner/action/task requests
 */

import { CanvasSection } from '@/hooks/useSimulation';
import { parseActionsFromQuery } from '@/utils/plannerHelpers';
import { isPlannerRequest } from '@/utils/queryHelpers';
import { createPlannerSection } from '@/services/sectionManager';

export interface PlannerRequestResult {
    handled: boolean;
    sections?: CanvasSection[];
    message?: string;
}

/**
 * Handle planner request queries
 */
export function handlePlannerRequest(query: string): PlannerRequestResult {
    if (!isPlannerRequest(query)) {
        return { handled: false };
    }

    // Parse actions from query
    const actions = parseActionsFromQuery(query);

    if (actions.length > 0) {
        // Format actions with [·] prefix for planner
        const formattedActions = actions.map(action => `[·] ${action}`).join('\n');

        const sections: CanvasSection[] = [
            createPlannerSection(formattedActions, 'Factory Operations Plan', `planner-actions-${Date.now()}`)
        ];

        return {
            handled: true,
            sections,
            message: "I've added these actions to your planner. You can edit, assign, or add more items."
        };
    } else {
        // Fallback: use the query as a single action
        const sections: CanvasSection[] = [
            createPlannerSection(`[·] ${query}`, undefined, `planner-actions-${Date.now()}`)
        ];

        return {
            handled: true,
            sections,
            message: "I've added this action to your planner."
        };
    }
}

