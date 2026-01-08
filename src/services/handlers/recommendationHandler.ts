/**
 * Recommendation Handler
 * Handles recommendation click queries
 */

import { CanvasSection } from '@/hooks/useSimulation';
import { FlexibleQueryParser } from '@/services/flexibleQueryParser';
import { DataLookupService } from '@/services/dataLookupService';
import { generatePlannerActionsFromQuery } from '@/utils/plannerHelpers';
import { createSection, createPlannerSection } from '@/services/sectionManager';

export interface RecommendationResult {
    handled: boolean;
    response?: string;
    sections?: CanvasSection[];
    needsAsyncProcessing?: boolean; // For complex async operations
}

/**
 * Handle recommendation queries
 * Note: Some recommendation handling requires async operations that should be done in the hook
 */
export function handleRecommendation(query: string): RecommendationResult {
    const lowercaseQuery = query.toLowerCase();

    // Simple recommendation responses (no canvas update)
    if (lowercaseQuery.includes('parking')) {
        return {
            handled: true,
            response: "Yes, the main factory entrance parking area has been reserved and secured. Safety personnel will be stationed there 30 minutes prior to arrival."
        };
    } else if (lowercaseQuery.includes('escort') || lowercaseQuery.includes('who should escort')) {
        return {
            handled: true,
            response: "The Operations Manager will be the lead escort for the supplier. Two additional quality control staff have been assigned for the inspection team."
        };
    } else if (lowercaseQuery.includes('safety briefing')) {
        return {
            handled: true,
            response: "The safety briefing document is ready. It covers the entry protocols, production area access limits, and emergency exit routes."
        };
    } else if (lowercaseQuery.includes('inventory') || lowercaseQuery.includes('product')) {
        return {
            handled: true,
            response: "Based on the delegation size, 20 special product samples have been prepared and are currently being held in the quality control lab."
        };
    } else if (lowercaseQuery.includes('approval workflow')) {
        return {
            handled: true,
            response: "The approval workflow is currently at the 'Executive Review' stage. 2 of 3 required signatures have been obtained."
        };
    } else if (lowercaseQuery.includes('notified')) {
        return {
            handled: true,
            response: "The Departments of Production, Quality Control, and Inventory have been notified. The local compliance office has also received the inspection notice."
        };
    } else if (lowercaseQuery.includes('budget') || lowercaseQuery.includes('financial report')) {
        return {
            handled: true,
            response: "The financial summary shows all allocations are within the production season budget. Revenue collections are being processed as scheduled."
        };
    } else if (lowercaseQuery.includes('when should') || lowercaseQuery.includes('deadline')) {
        return {
            handled: true,
            response: "High-priority items should be completed by 6 PM tonight. Secondary tasks can be finalized by 7 AM tomorrow morning."
        };
    }

    // Check for flexible query parsing (planning, actions, inventory)
    const planningQuery = FlexibleQueryParser.parsePlanningQuery(query);
    const actionQuery = FlexibleQueryParser.parseActionQuery(query);
    const inventoryQuery = FlexibleQueryParser.parseKitchenQuery(query); // Reusing kitchen parser for inventory

    // These require async processing in the hook
    if (planningQuery || actionQuery || inventoryQuery) {
        return {
            handled: true,
            needsAsyncProcessing: true,
            response: "I've noted this requirement. I'll flag any potential conflicts with the existing schedule."
        };
    }

    // Default recommendation response
    return {
        handled: true,
        response: "I've noted this requirement. I'll flag any potential conflicts with the existing schedule."
    };
}

