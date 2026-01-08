/**
 * Planner Add Handler
 * Handles queries that add items to the planner (e.g., "add X to plan")
 */

export interface PlannerAddResult {
    handled: boolean;
    itemToAdd?: string;
}

/**
 * Handle "add to plan" queries
 * Extracts the item to add from various patterns
 */
export function handlePlannerAdd(query: string): PlannerAddResult {
    const lowercaseQuery = query.toLowerCase();

    // Match patterns like: "add X to plan", "add X in plan", "X is missing add that", etc.
    const addToPlanPatterns = [
        // 0. "add this/that to plan [actual task]" - must come first!
        /\badd\s+(?:this|that)\s+(?:to|in)\s+(?:the\s+)?plan(?:ner)?\s+(.+)/i,

        // 1. Prefix: "add (item) to/in plan"
        /\badd\s+(.+?)\s+(?:to|in)\s+(?:the\s+)?plan(?:ner)?/i,

        // 2. Infix: "add to/in plan (item)"
        /\badd\s+(?:to|in)\s+(?:the\s+)?plan(?:ner)?\s+(.+)/i,

        // 3. Suffix: "(item) add to/in plan" - robust punctuation handling
        /(.+?)(?:[-–—,.]+)?\s*\b(?:please\s+)?add\s+(?:to|in)\s+(?:the\s+)?plan(?:ner)?/i,

        // 4. Suffix: "(item) added to/in plan"
        /(.+?)(?:[-–—,.]+)?\s*\b(?:should\s+be\s+)?added\s+(?:to|in)\s+(?:the\s+)?plan(?:ner)?/i,

        // 5. Specific Context: "X is missing add that in plan"
        /(.+?)\s+is\s+missing\s+add\s+that\s+(?:to|in)\s+plan/i,

        // 6. Fallback: "add that to plan" (no task specified)
        /add\s+that\s+(?:to|in)\s+plan/i,

        // 7. "add step: [task]" or "new step [task]"
        /\b(?:add|new|create|include)\b\s+step(?::|\s+)?\s+(.+)/i,

        // 8. "[task] add as step"
        /(.+?)\s+add\s+(?:it\s+)?as\s+(?:a\s+)?step/i,
    ];

    let itemToAdd: string | null = null;

    for (let i = 0; i < addToPlanPatterns.length; i++) {
        const pattern = addToPlanPatterns[i];
        const match = lowercaseQuery.match(pattern);
        if (match) {
            // Pattern 0: "add this/that to plan [task]" - extract task from after "plan"
            if (i === 0) {
                if (match[1]) {
                    itemToAdd = match[1].trim();
                }
            }
            // Pattern 6: "add that to plan" (no task) - try to extract from context
            else if (i === 6 && !match[1]) {
                // Extract item from before "add that" if it exists
                const beforeMatch = query.match(/(.+?)\s+(is\s+missing|add\s+that)/i);
                if (beforeMatch) {
                    itemToAdd = beforeMatch[1].replace(/^(ok\s+|please\s+|can\s+you\s+)/i, '').trim();
                }
            }
            // Pattern 5: "X is missing add that in plan"
            else if (i === 5) {
                if (match[1]) {
                    itemToAdd = match[1].trim();
                }
            }
            // All other patterns: use captured group
            else if (match[1]) {
                // Check if captured item is "this" or "that" - if so, look for task after "plan"
                const captured = match[1].trim().toLowerCase();
                if (captured === 'this' || captured === 'that') {
                    // Try to extract task from after "to the plan"
                    const afterPlanMatch = query.match(/\b(?:to|in)\s+(?:the\s+)?plan(?:ner)?\s+(.+)/i);
                    if (afterPlanMatch && afterPlanMatch[1]) {
                        itemToAdd = afterPlanMatch[1].trim();
                    }
                } else {
                    itemToAdd = match[1].trim();
                }
            }
            break;
        }
    }

    if (itemToAdd) {
        // Capitalize first letter
        itemToAdd = itemToAdd.charAt(0).toUpperCase() + itemToAdd.slice(1);
        return {
            handled: true,
            itemToAdd
        };
    }

    return { handled: false };
}

