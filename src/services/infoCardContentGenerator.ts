/**
 * Info Card Content Generator Service
 * 
 * Generates PART 1 content for info cards using calendar aggregation.
 * Format: RichCard with highlights (4-5 chronological items)
 */

import { aggregateCalendars } from './calendarAggregator';
import { getQueryType } from './templeResponseFormatter';

export interface InfoCardContent {
    highlightTitle: string;
    todayHighlights: Array<{
        time: string;
        description: string;
    }>;
}

/**
 * Generate info card content for PART 1
 */
export function generateInfoCardContent(query: string, date?: Date): InfoCardContent {
    // Aggregate calendars to get 4-5 chronological items
    const calendarItems = aggregateCalendars(query, date);

    // Get query type for title
    const queryType = getQueryType(query);

    // Format highlights
    const todayHighlights = calendarItems.map(item => ({
        time: item.time,
        description: item.description
    }));

    return {
        highlightTitle: `${queryType} | INFORMATION`,
        todayHighlights
    };
}

