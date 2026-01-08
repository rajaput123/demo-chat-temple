/**
 * Planner Helper Functions
 * Utilities for generating and parsing planner actions from queries
 */

/**
 * Generate planner actions based on query context
 */
export function generatePlannerActionsFromQuery(
    query: string,
    queryType: 'info' | 'summary' | 'kitchen' | 'general' = 'general'
): string {
    const lowerQuery = query.toLowerCase();
    let actions: string[] = [];

    // Generate actions based on query type and content
    if (queryType === 'info') {
        if (lowerQuery.includes('employee') || lowerQuery.includes('staff') || lowerQuery.includes('who')) {
            actions.push('Review employee assignments and availability');
            actions.push('Update employee records if needed');
        } else if (lowerQuery.includes('inventory') || lowerQuery.includes('stock')) {
            actions.push('Review inventory levels and reorder if needed');
            actions.push('Update inventory records');
        } else if (lowerQuery.includes('location') || lowerQuery.includes('where')) {
            actions.push('Verify location availability');
            actions.push('Coordinate location access if needed');
        } else if (lowerQuery.includes('devotee')) {
            actions.push('Review devotee records');
            actions.push('Update devotee information if needed');
        } else {
            actions.push('Review the information provided');
            actions.push('Take necessary follow-up actions');
        }
    } else if (queryType === 'summary' || queryType === 'general') {
        if (lowerQuery.includes('progress') || lowerQuery.includes('status')) {
            actions.push('Review current progress and status');
            actions.push('Identify any blockers or issues');
            actions.push('Update progress tracking');
        } else if (lowerQuery.includes('festival') || lowerQuery.includes('navaratri')) {
            actions.push('Review festival preparation status');
            actions.push('Address any pending items');
            actions.push('Coordinate with relevant departments');
        } else {
            actions.push('Review the information');
            actions.push('Plan next steps based on the data');
        }
    } else if (queryType === 'kitchen') {
        actions.push('Review kitchen menu and requirements');
        actions.push('Coordinate with kitchen department');
        actions.push('Update menu planning if needed');
    }

    // Add general follow-up actions if query contains specific keywords
    if (lowerQuery.includes('check') || lowerQuery.includes('verify')) {
        actions.push('Verify the information is accurate');
        actions.push('Update records if discrepancies found');
    }

    if (lowerQuery.includes('show') || lowerQuery.includes('display') || lowerQuery.includes('list')) {
        actions.push('Review the displayed information');
        actions.push('Take action based on the findings');
    }

    // If no specific actions generated, add generic ones
    if (actions.length === 0) {
        actions.push('Review the query and information provided');
        actions.push('Plan appropriate follow-up actions');
    }

    // Format as planner actions
    return actions.map(action => `[·] ${action}`).join('\n');
}

/**
 * Parse action items from query string
 * Supports various formats: numbered lists, bullet points, comma-separated, etc.
 */
export function parseActionsFromQuery(query: string): string[] {
    const actions: string[] = [];

    // Try to extract actions from various formats:
    // 1. Numbered list: "1. Action 1, 2. Action 2"
    // 2. Bullet points: "- Action 1, - Action 2"
    // 3. Comma-separated: "Action 1, Action 2, Action 3"
    // 4. Line-separated (if query contains newlines)

    // Remove common prefixes
    let cleanQuery = query
        .replace(/^(add|create|make|plan|schedule|set)\s+(plan|planner|action|task|item|todo|step)/i, '')
        .replace(/^(add|create|make|plan|schedule|set)\s+(to|in)\s+(plan|planner)/i, '')
        .trim();

    // Try numbered list first
    const numberedMatches = cleanQuery.match(/\d+[\.\)]\s*([^\d,]+)/g);
    if (numberedMatches && numberedMatches.length > 0) {
        return numberedMatches.map(m => m.replace(/^\d+[\.\)]\s*/, '').trim());
    }

    // Try bullet points
    const bulletMatches = cleanQuery.match(/[-•*]\s*([^-,]+)/g);
    if (bulletMatches && bulletMatches.length > 0) {
        return bulletMatches.map(m => m.replace(/^[-•*]\s*/, '').trim());
    }

    // Try comma-separated
    if (cleanQuery.includes(',')) {
        const parts = cleanQuery.split(',').map(p => p.trim()).filter(p => p.length > 0);
        if (parts.length > 1) {
            return parts;
        }
    }

    // If no structured format, treat the whole query as a single action
    // But try to split on common conjunctions
    const conjunctions = [' and ', ' then ', ' also ', ' plus '];
    for (const conj of conjunctions) {
        if (cleanQuery.toLowerCase().includes(conj)) {
            return cleanQuery.split(new RegExp(conj, 'i')).map(a => a.trim()).filter(a => a.length > 0);
        }
    }

    // Single action
    if (cleanQuery.length > 0) {
        return [cleanQuery];
    }

    return [];
}

