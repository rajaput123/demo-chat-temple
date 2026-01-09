/**
 * Planner Helper Functions
 * Utilities for generating and parsing planner actions from queries
 */

import { generateCEOActions, formatActionsForPlanner } from '@/services/ceoActionGenerator';

/**
 * Generate planner actions based on query context
 * Uses CEO Action Generator to produce 8-10 CEO-level actions
 */
export function generatePlannerActionsFromQuery(
    query: string,
    queryType: 'info' | 'summary' | 'kitchen' | 'general' | string = 'general',
    context?: any
): string {
    // Use CEO Action Generator for temple queries
    const ceoActions = generateCEOActions(query, context);
    return formatActionsForPlanner(ceoActions);
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

