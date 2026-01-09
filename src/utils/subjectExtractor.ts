/**
 * Subject Extractor
 * 
 * Extracts the subject from queries like "plan for X", "summary of Y", etc.
 */

/**
 * Extract subject from query based on intent
 */
export function extractSubject(query: string, intent: 'plan' | 'summary' | 'complete' | 'next'): string | null {
    const patterns = {
        plan: [
            /plan\s+for\s+(.+)/i,
            /planning\s+for\s+(.+)/i,
            /create\s+plan\s+for\s+(.+)/i,
            /show\s+plan\s+for\s+(.+)/i
        ],
        summary: [
            /summary\s+of\s+(.+)/i,
            /summarize\s+(.+)/i,
            /give\s+me\s+summary\s+of\s+(.+)/i,
            /show\s+summary\s+of\s+(.+)/i
        ],
        complete: [
            /complete\s+information\s+about\s+(.+)/i,
            /full\s+information\s+about\s+(.+)/i,
            /all\s+information\s+about\s+(.+)/i,
            /complete\s+details?\s+about\s+(.+)/i,
            /full\s+details?\s+about\s+(.+)/i
        ],
        next: [
            /next\s+information\s+for\s+(.+)/i,
            /what'?s\s+next\s+for\s+(.+)/i,
            /next\s+steps?\s+for\s+(.+)/i
        ]
    };

    const intentPatterns = patterns[intent];
    for (const pattern of intentPatterns) {
        const match = query.match(pattern);
        if (match && match[1]) {
            return match[1].trim();
        }
    }

    return null;
}

