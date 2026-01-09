/**
 * Simple Query Detector
 * 
 * Detects simple standalone queries like "plan", "summary", "complete information", "next information"
 */

/**
 * Check if query is a plan query
 */
export function isPlanQuery(query: string): boolean {
    const trimmed = query.toLowerCase().trim();
    const patterns = [
        /^plan$/i,
        /^show\s+plan$/i,
        /^my\s+plan$/i,
        /^planner$/i,
        /^planner\s+actions?$/i,
        // Patterns with subjects
        /^plan\s+for\s+/i,
        /^planning\s+for\s+/i,
        /^create\s+plan\s+for\s+/i,
        /^show\s+plan\s+for\s+/i
    ];
    return patterns.some(p => p.test(trimmed));
}

/**
 * Check if query is a summary query
 */
export function isSummaryQuery(query: string): boolean {
    const trimmed = query.toLowerCase().trim();
    const patterns = [
        /^summary$/i,
        /^show\s+summary$/i,
        /^give\s+me\s+summary$/i,
        /^brief\s+summary$/i,
        // Patterns with subjects
        /^summary\s+of\s+/i,
        /^summarize\s+/i,
        /^give\s+me\s+summary\s+of\s+/i,
        /^show\s+summary\s+of\s+/i
    ];
    return patterns.some(p => p.test(trimmed));
}

/**
 * Check if query is a complete information query
 */
export function isCompleteInfoQuery(query: string): boolean {
    const trimmed = query.toLowerCase().trim();
    const patterns = [
        /^complete\s+information$/i,
        /^full\s+information$/i,
        /^all\s+information$/i,
        /^complete\s+details?$/i,
        /^full\s+details?$/i,
        // Patterns with subjects
        /^complete\s+information\s+about\s+/i,
        /^full\s+information\s+about\s+/i,
        /^all\s+information\s+about\s+/i,
        /^complete\s+details?\s+about\s+/i,
        /^full\s+details?\s+about\s+/i
    ];
    return patterns.some(p => p.test(trimmed));
}

/**
 * Check if query is a next information query
 */
export function isNextInfoQuery(query: string): boolean {
    const trimmed = query.toLowerCase().trim();
    const patterns = [
        /^next\s+information$/i,
        /^what'?s\s+next$/i,
        /^next$/i,
        /^upcoming$/i,
        /^next\s+steps?$/i,
        /^what\s+comes\s+next$/i,
        // Patterns with subjects
        /^next\s+information\s+for\s+/i,
        /^what'?s\s+next\s+for\s+/i,
        /^next\s+steps?\s+for\s+/i
    ];
    return patterns.some(p => p.test(trimmed));
}

