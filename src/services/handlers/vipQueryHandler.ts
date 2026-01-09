/**
 * VIP Query Handler
 * Handles VIP visit queries
 */

import { CanvasSection } from '@/hooks/useSimulation';
import { ParsedVIPVisit } from '@/types/vip';
import { QueryParserService } from '@/services/queryParserService';
import { VIPPlannerService } from '@/services/vipPlannerService';
import { createSection, createPlannerSection } from '@/services/sectionManager';
import { generateInfoCardContent } from '@/services/infoCardContentGenerator';
import { generateCEOActions, formatActionsForPlanner } from '@/services/ceoActionGenerator';

export interface VIPQueryResult {
    handled: boolean;
    sections?: CanvasSection[];
    message?: string;
    vipVisit?: ParsedVIPVisit;
}

/**
 * Handle VIP query
 */
export function handleVIPQuery(
    query: string,
    options?: { onVIPVisitParsed?: (vip: ParsedVIPVisit) => void }
): VIPQueryResult {
    const lowercaseQuery = query.toLowerCase();

    // Skip if this is a "Show VIP visits" query (handled by QuickActionHandler)
    const isShowVIPVisitsQuery = lowercaseQuery.startsWith('show') &&
        (lowercaseQuery.includes('vip') && (lowercaseQuery.includes('visit') || lowercaseQuery.includes('visits')));

    if (isShowVIPVisitsQuery) {
        return { handled: false };
    }

    // Only handle if query contains VIP-related keywords
    if (!lowercaseQuery.includes('vip') && !lowercaseQuery.includes('minister') && !lowercaseQuery.includes('visit')) {
        return { handled: false };
    }

    // Try to parse VIP visit using NLP
    const parseResult = QueryParserService.parseQuery(query);
    let focusContent = '';
    let plannerActions = '';

    if (parseResult.intent === 'vip-visit' && parseResult.data) {
        const parsedVisit = parseResult.data as ParsedVIPVisit;
        if (options?.onVIPVisitParsed) {
            options.onVIPVisitParsed(parsedVisit);
        }

        // Use temple response format: Generate info card from calendar aggregation
        const infoCardContent = generateInfoCardContent(query);
        focusContent = JSON.stringify(infoCardContent);

        // Generate CEO-level actions (8-10 items)
        const ceoActions = generateCEOActions(query);
        plannerActions = formatActionsForPlanner(ceoActions);
    } else {
        // Fallback: Use temple response format
        const infoCardContent = generateInfoCardContent(query);
        focusContent = JSON.stringify(infoCardContent);
        
        const ceoActions = generateCEOActions(query);
        plannerActions = formatActionsForPlanner(ceoActions);
    }

    const sections: CanvasSection[] = [
        createSection('focus-vip', 'VIP Protocol Brief', focusContent, 'text')
    ];

    // Always add planner for VIP queries
    if (plannerActions) {
        sections.push(createPlannerSection(plannerActions, 'VIP Plan', 'vip-checklist'));
    }

    let message = "I've prepared the VIP protocol briefing and planner actions.";
    if (lowercaseQuery.includes('show') && lowercaseQuery.includes('vip')) {
        message = "Here are the VIP visits and related planning actions.";
    }

    return {
        handled: true,
        sections,
        message
    };
}

