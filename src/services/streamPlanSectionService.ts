/**
 * PlanSection Streaming Service
 * 
 * Handles progressive streaming of PlanSection content
 */

import { PlanSectionData } from '@/types/planner';

export interface StreamPlanSectionCallbacks {
    onUpdate: (planData: PlanSectionData) => void;
    onComplete: () => void;
}

/**
 * Stream PlanSection content progressively
 */
export function streamPlanSection(
    planData: PlanSectionData,
    callbacks: StreamPlanSectionCallbacks
): () => void {
    const actions = planData.content.split('\n').filter(line => line.trim());
    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout | null = null;
    
    const streamNext = () => {
        if (currentIndex < actions.length) {
            const currentContent = actions.slice(0, currentIndex + 1).join('\n');
            const currentActions = planData.actions?.slice(0, currentIndex + 1) || [];
            
            callbacks.onUpdate({
                ...planData,
                visibleContent: currentContent,
                visibleActions: currentActions,
                isVisible: true,
            });
            
            currentIndex++;
            timeoutId = setTimeout(streamNext, 200); // Delay between items
        } else {
            // Streaming complete
            callbacks.onComplete();
        }
    };
    
    // Start streaming after a brief delay
    timeoutId = setTimeout(streamNext, 300);
    
    // Return cleanup function
    return () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
    };
}

