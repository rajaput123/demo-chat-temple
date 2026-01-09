/**
 * Recommendations Hook
 * 
 * Generates smart recommendations based on planner actions.
 * Memoized for performance - only recalculates when sections or status change.
 */

import { useMemo } from 'react';
import { CanvasSection, SimulationStatus } from './useSimulation';

export interface Recommendation {
    text: string;
    query: string;
}

export function useRecommendations(sections: CanvasSection[], status: SimulationStatus): Recommendation[] {
    return useMemo(() => {
        const plannerSections = sections.filter(s => s.title === 'Your Planner Actions' && s.isVisible);

        if (plannerSections.length === 0 || !plannerSections[0].content) {
            // Only show recommendations when there are actual planner actions
            return [];
        }

        // Wait for streaming to complete before showing recommendations
        const plannerSection = plannerSections[0];
        const isStreamingComplete = status === 'complete' || plannerSection.visibleContent === plannerSection.content;

        if (!isStreamingComplete) {
            return [];
        }

        // Parse planner actions
        const plannerContent = plannerSections[0].content;
        const actions = plannerContent.split('\n').filter(line => line.trim().startsWith('[·]')).map(line => line.replace('[·]', '').trim());

        const recommendations: Recommendation[] = [];

        // Generate contextual recommendations based on action keywords
        if (actions.some(a => a.toLowerCase().includes('security') || a.toLowerCase().includes('protocol'))) {
            recommendations.push({ text: 'Review security briefing document', query: 'Show security briefing for upcoming visit' });
        }

        if (actions.some(a => a.toLowerCase().includes('vip') || a.toLowerCase().includes('visit') || a.toLowerCase().includes('escort'))) {
            recommendations.push({ text: 'Assign escort personnel', query: 'Who should escort the VIP visitor?' });
            recommendations.push({ text: 'Check VIP parking availability', query: 'Is VIP parking reserved?' });
        }

        if (actions.some(a => a.toLowerCase().includes('prasadam') || a.toLowerCase().includes('arrange'))) {
            recommendations.push({ text: 'Confirm prasadam quantity', query: 'How much prasadam is needed?' });
        }

        if (actions.some(a => a.toLowerCase().includes('approval') || a.toLowerCase().includes('verify') || a.toLowerCase().includes('review'))) {
            recommendations.push({ text: 'Check approval workflow status', query: 'Show approval workflow' });
            recommendations.push({ text: 'Notify relevant departments', query: 'Who needs to be notified about pending approvals?' });
        }

        if (actions.some(a => a.toLowerCase().includes('finance') || a.toLowerCase().includes('fund') || a.toLowerCase().includes('₹') || a.toLowerCase().includes('donation'))) {
            recommendations.push({ text: 'Review budget allocation', query: 'Show current budget status' });
            recommendations.push({ text: 'Generate financial report', query: 'Create financial summary report' });
        }

        // If no specific recommendations, suggest completing planner actions
        if (recommendations.length === 0 && actions.length > 0) {
            const firstAction = actions[0];
            recommendations.push({ text: `Start: ${firstAction.substring(0, 40)}...`, query: `Help me with: ${firstAction}` });
            if (actions.length > 1) {
                recommendations.push({ text: 'Assign all actions to team', query: 'Assign these planner actions to team members' });
            }
        }

        // Add generic helpful suggestions
        recommendations.push({ text: 'Set deadlines for all actions', query: 'When should these actions be completed?' });

        return recommendations.slice(0, 4); // Limit to 4 recommendations
    }, [sections, status]);
}

