/**
 * Temple Response Formatter Service
 * 
 * Formats response according to specification:
 * PART 1: Information Card (4-5 chronological items)
 * PART 2: Plan/Action Items (8-10 CEO-level actions)
 */

import { CalendarItem } from './calendarAggregator';
import { ActionItem } from './ceoActionGenerator';

export interface TempleResponse {
    infoCard: {
        highlightTitle: string;
        todayHighlights: Array<{
            time: string;
            description: string;
        }>;
    };
    plannerActions: string; // Formatted action items
}

/**
 * Format temple response with info card and planner actions
 */
export function formatTempleResponse(
    infoItems: CalendarItem[],
    actionItems: ActionItem[],
    queryType: string = 'INFORMATION'
): TempleResponse {
    // PART 1: Format Information Card
    const todayHighlights = infoItems.map(item => ({
        time: item.time,
        description: item.description
    }));

    const infoCard = {
        highlightTitle: `${queryType} | INFORMATION`,
        todayHighlights
    };

    // PART 2: Format Planner Actions
    const plannerActions = actionItems.map(item => item.action).join('\n');

    return {
        infoCard,
        plannerActions
    };
}

/**
 * Get query type for title formatting
 */
export function getQueryType(query: string): string {
    const lowercaseQuery = query.toLowerCase();

    if (lowercaseQuery.includes('vip') || lowercaseQuery.includes('minister') || lowercaseQuery.includes('visit')) {
        return 'VIP VISIT';
    }
    if (lowercaseQuery.includes('plan') || lowercaseQuery.includes('planning')) {
        return 'PLAN';
    }
    if (lowercaseQuery.includes('summary') || lowercaseQuery.includes('status')) {
        return 'SUMMARY';
    }
    if (lowercaseQuery.includes('approval') || lowercaseQuery.includes('approve')) {
        return 'APPROVAL';
    }
    if (lowercaseQuery.includes('schedule') || lowercaseQuery.includes('when') || lowercaseQuery.includes('time')) {
        return 'SCHEDULE';
    }

    return 'TEMPLE';
}

