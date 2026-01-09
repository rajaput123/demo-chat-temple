/**
 * Query Helper Functions
 * Utilities for detecting query intent and normalizing queries
 */

/**
 * Detect if query is an information request
 */
export function isInfoQuery(query: string): boolean {
    const lowercaseQuery = query.toLowerCase();
    
    // Check for information-seeking patterns (not action-oriented)
    const isInformationSeeking = lowercaseQuery.includes('what') ||
        lowercaseQuery.includes('who') ||
        lowercaseQuery.includes('when') ||
        lowercaseQuery.includes('where') ||
        lowercaseQuery.includes('how') ||
        lowercaseQuery.includes('tell me') ||
        lowercaseQuery.includes('show') ||
        lowercaseQuery.includes('list') ||
        lowercaseQuery.includes('display') ||
        lowercaseQuery.includes('get') ||
        lowercaseQuery.includes('find') ||
        lowercaseQuery.includes('about') ||
        lowercaseQuery.includes('information') ||
        lowercaseQuery.includes('details') ||
        lowercaseQuery.includes('look like') ||
        lowercaseQuery.includes('looks like');
    
    // Schedule information queries (not creating schedules)
    const isScheduleInfo = (lowercaseQuery.includes('schedule') || lowercaseQuery.includes('timetable')) &&
        (lowercaseQuery.includes('what') || lowercaseQuery.includes('show') || lowercaseQuery.includes('look like') || lowercaseQuery.includes('information'));
    
    // Temple-related info queries
    const isTempleInfo = (lowercaseQuery.includes('temple') || 
        lowercaseQuery.includes('jagadguru') || 
        lowercaseQuery.includes('ceo') || 
        lowercaseQuery.includes('sringeri') || 
        lowercaseQuery.includes('peetham') ||
        lowercaseQuery.includes('ekadashi')) &&
        !lowercaseQuery.includes('plan') &&
        !lowercaseQuery.startsWith('schedule') && // Not "schedule X" (action)
        !lowercaseQuery.startsWith('create') &&
        !lowercaseQuery.startsWith('add');
    
    return isInformationSeeking || isScheduleInfo || isTempleInfo;
}

/**
 * Detect if query is a summary/progress request
 */
export function isSummaryQuery(query: string): boolean {
    const lowercaseQuery = query.toLowerCase();
    return lowercaseQuery.includes('progress') ||
        lowercaseQuery.includes('summary') ||
        lowercaseQuery.includes('status') ||
        lowercaseQuery.includes('update') ||
        (lowercaseQuery.includes('how') && lowercaseQuery.includes('is') && (lowercaseQuery.includes('preparation') || lowercaseQuery.includes('preparation')));
}

/**
 * Detect if query is a planner/action request
 */
export function isPlannerRequest(query: string): boolean {
    const lowercaseQuery = query.toLowerCase();
    return lowercaseQuery.includes('plan') ||
        lowercaseQuery.includes('planner') ||
        lowercaseQuery.includes('action') ||
        lowercaseQuery.includes('task') ||
        lowercaseQuery.includes('todo') ||
        lowercaseQuery.includes('step') ||
        (lowercaseQuery.includes('add') && (lowercaseQuery.includes('to') || lowercaseQuery.includes('in'))) ||
        (lowercaseQuery.includes('create') && (lowercaseQuery.includes('plan') || lowercaseQuery.includes('action') || lowercaseQuery.includes('step'))) ||
        lowercaseQuery.includes('schedule');
}

/**
 * Normalize query by removing recommendation prefix
 */
export function normalizeQuery(query: string): { cleanQuery: string; isRecommendation: boolean } {
    const isRecommendation = query.startsWith('[REC] ');
    const cleanQuery = isRecommendation ? query.replace('[REC] ', '') : query;
    return { cleanQuery, isRecommendation };
}

/**
 * Check if query is an informational query (who, what, when, how, is, should, ?)
 */
export function isInformationalQuery(query: string): boolean {
    const lowercaseQuery = query.toLowerCase();
    return lowercaseQuery.startsWith('who ') ||
        lowercaseQuery.startsWith('what ') ||
        lowercaseQuery.startsWith('when ') ||
        lowercaseQuery.startsWith('how ') ||
        lowercaseQuery.startsWith('is ') ||
        lowercaseQuery.startsWith('should ') ||
        query.includes('?');
}

