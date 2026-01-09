/**
 * CEO Action Generator Service
 * 
 * Generates CEO-level action items (8-10 items) for temple queries.
 * Actions must be delegative, approval-oriented, and CEO-level decisions only.
 */

export interface ActionItem {
    action: string; // Formatted as "[·] [Action verb] [description]"
}

/**
 * Generate CEO-level action items based on query and context
 */
export function generateCEOActions(query: string, context?: any): ActionItem[] {
    const lowercaseQuery = query.toLowerCase();
    const actions: ActionItem[] = [];

    // VIP Visit queries
    if (lowercaseQuery.includes('vip') || lowercaseQuery.includes('minister') || lowercaseQuery.includes('visit')) {
        actions.push({ action: '[·] Approve VIP protocol arrangements' });
        actions.push({ action: '[·] Assign security team for Prime Minister visit' });
        actions.push({ action: '[·] Review sanctum access permissions' });
        actions.push({ action: '[·] Direct protocol team coordination' });
        actions.push({ action: '[·] Confirm prasadam arrangements' });
        actions.push({ action: '[·] Request police coordination' });
        actions.push({ action: '[·] Decide on media coverage scope' });
        actions.push({ action: '[·] Escalate to Jagadguru for blessings' });
        actions.push({ action: '[·] Approve special darshan timing' });
        actions.push({ action: '[·] Review executive schedule conflicts' });
    }
    // Plan queries
    else if (lowercaseQuery.includes('plan') || lowercaseQuery.includes('planning')) {
        actions.push({ action: '[·] Approve strategic plan priorities' });
        actions.push({ action: '[·] Assign department heads to key initiatives' });
        actions.push({ action: '[·] Review resource allocation decisions' });
        actions.push({ action: '[·] Direct coordination between departments' });
        actions.push({ action: '[·] Confirm timeline and milestones' });
        actions.push({ action: '[·] Request status updates from teams' });
        actions.push({ action: '[·] Decide on budget approvals' });
        actions.push({ action: '[·] Escalate critical blockers' });
        actions.push({ action: '[·] Approve delegation of operational tasks' });
        actions.push({ action: '[·] Review risk mitigation strategies' });
    }
    // Summary queries
    else if (lowercaseQuery.includes('summary') || lowercaseQuery.includes('status')) {
        actions.push({ action: '[·] Review current operational status' });
        actions.push({ action: '[·] Approve recommended next steps' });
        actions.push({ action: '[·] Assign follow-up responsibilities' });
        actions.push({ action: '[·] Direct priority adjustments' });
        actions.push({ action: '[·] Confirm key decisions' });
        actions.push({ action: '[·] Request detailed reports' });
        actions.push({ action: '[·] Decide on resource reallocation' });
        actions.push({ action: '[·] Escalate critical issues' });
        actions.push({ action: '[·] Approve action plan' });
        actions.push({ action: '[·] Review stakeholder communications' });
    }
    // Approval queries
    else if (lowercaseQuery.includes('approval') || lowercaseQuery.includes('approve')) {
        actions.push({ action: '[·] Approve pending payment requests' });
        actions.push({ action: '[·] Review approval workflow status' });
        actions.push({ action: '[·] Assign approval authority' });
        actions.push({ action: '[·] Direct approval process improvements' });
        actions.push({ action: '[·] Confirm approval criteria' });
        actions.push({ action: '[·] Request additional documentation' });
        actions.push({ action: '[·] Decide on exception approvals' });
        actions.push({ action: '[·] Escalate high-value approvals' });
        actions.push({ action: '[·] Approve delegation of routine approvals' });
        actions.push({ action: '[·] Review approval audit trail' });
    }
    // Schedule queries
    else if (lowercaseQuery.includes('schedule') || lowercaseQuery.includes('when') || lowercaseQuery.includes('time')) {
        actions.push({ action: '[·] Approve schedule adjustments' });
        actions.push({ action: '[·] Assign scheduling coordination' });
        actions.push({ action: '[·] Review calendar conflicts' });
        actions.push({ action: '[·] Direct schedule optimization' });
        actions.push({ action: '[·] Confirm priority scheduling' });
        actions.push({ action: '[·] Request availability updates' });
        actions.push({ action: '[·] Decide on schedule changes' });
        actions.push({ action: '[·] Escalate scheduling conflicts' });
        actions.push({ action: '[·] Approve special event scheduling' });
        actions.push({ action: '[·] Review resource scheduling' });
    }
    // General temple queries
    else {
        actions.push({ action: '[·] Approve strategic initiatives' });
        actions.push({ action: '[·] Assign key responsibilities' });
        actions.push({ action: '[·] Review operational priorities' });
        actions.push({ action: '[·] Direct team coordination' });
        actions.push({ action: '[·] Confirm resource allocation' });
        actions.push({ action: '[·] Request status updates' });
        actions.push({ action: '[·] Decide on critical matters' });
        actions.push({ action: '[·] Escalate important decisions' });
        actions.push({ action: '[·] Approve delegation of tasks' });
        actions.push({ action: '[·] Review overall temple operations' });
    }

    // Return 8-10 items
    return actions.slice(0, 10);
}

/**
 * Format actions as planner content string
 */
export function formatActionsForPlanner(actions: ActionItem[]): string {
    return actions.map(a => a.action).join('\n');
}

