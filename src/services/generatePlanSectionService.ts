/**
 * PlanSection Generation Service
 * 
 * Generates PlanSection data for ALL queries
 * Actions are based on existing system state
 */

import { PlanSectionData, PlannerAction } from '@/types/planner';
import { SearchResult } from './systemDataSearch';

/**
 * Generate PlanSection data (ALWAYS for every query)
 */
export function generatePlanSection(query: string, searchResult?: SearchResult): PlanSectionData {
    // Generate actions based on system state
    const actions: string[] = [];
    const lowerQuery = query.toLowerCase();
    
    // If search result exists, generate actions based on record state
    if (searchResult && searchResult.record) {
        const record = searchResult.record;
        
        // If unassigned, suggest assignment
        if (!record.assignedTo && (record.type === 'task' || record.type === 'activity')) {
            actions.push('[·] Assign responsible person or department');
        }
        
        // If pending, suggest confirmation
        if (record.status === 'pending' || record.status === 'pending-approval') {
            actions.push('[·] Confirm and approve this record');
        }
        
        // If missing time, suggest scheduling
        if (!record.time && (record.type === 'activity' || record.type === 'seva-booking')) {
            actions.push('[·] Schedule appropriate time slot');
        }
        
        // If missing location, suggest location assignment
        if (!record.location && record.type === 'activity') {
            actions.push('[·] Assign location for this activity');
        }
        
        // General follow-up actions
        actions.push('[·] Review and verify all details');
        actions.push('[·] Notify relevant stakeholders');
    } else {
        // No match found - suggest creation actions
        actions.push('[·] Create new record in system');
        actions.push('[·] Gather required information');
        actions.push('[·] Assign to appropriate department');
        actions.push('[·] Set up tracking and notifications');
    }
    
    // Add query-specific actions
    if (lowerQuery.includes('visit') || lowerQuery.includes('visiting')) {
        actions.push('[·] Coordinate protocol arrangements');
        actions.push('[·] Prepare security and logistics');
    }
    
    if (lowerQuery.includes('meeting') || lowerQuery.includes('appointment')) {
        actions.push('[·] Confirm participants availability');
        actions.push('[·] Reserve required resources');
    }
    
    if (lowerQuery.includes('task') || lowerQuery.includes('work')) {
        actions.push('[·] Break down into actionable steps');
        actions.push('[·] Set deadlines and milestones');
    }
    
    const plannerActions: PlannerAction[] = actions.map((action, idx) => ({
        id: `action-${Date.now()}-${idx}`,
        content: action.replace(/^\[·\]\s*/, '').trim(),
        isCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        updatedBy: 'system'
    }));
    
    return {
        id: `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: 'Planner Actions',
        content: actions.join('\n'),
        visibleContent: '', // Will stream in
        type: 'list',
        isVisible: false,
        actions: plannerActions,
        visibleActions: [],
    };
}

