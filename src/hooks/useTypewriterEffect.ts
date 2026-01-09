/**
 * Typewriter Effect Hook
 * 
 * Handles the typewriter effect for canvas sections and chat messages.
 * Extracted from useSimulation for better separation of concerns.
 */

import { useEffect, useState } from 'react';
import { CanvasSection, SimulationStatus } from './useSimulation';

export interface UseTypewriterEffectOptions {
    sections: CanvasSection[];
    status: SimulationStatus;
    onSectionUpdate: (index: number, updates: Partial<CanvasSection>) => void;
    onComplete: () => void;
    onPlanningMessage?: () => void;
}

export function useTypewriterEffect({
    sections,
    status,
    onSectionUpdate,
    onComplete,
    onPlanningMessage
}: UseTypewriterEffectOptions) {
    const [currentSectionIndex, setCurrentSectionIndex] = useState(-1);
    const [typingIndex, setTypingIndex] = useState(0);
    const planningMessageShownRef = { current: false };

    // Reset when sections change
    useEffect(() => {
        if (status === 'idle') {
            setCurrentSectionIndex(-1);
            setTypingIndex(0);
            planningMessageShownRef.current = false;
        }
    }, [status, sections.length]);

    // The Typewriter Effect Loop for Canvas Sections
    useEffect(() => {
        if (status !== 'generating' || currentSectionIndex === -1) return;

        if (currentSectionIndex >= sections.length) {
            onComplete();
            return;
        }

        const currentSection = sections[currentSectionIndex];
        const contentToType = currentSection.content;

        // Skip typewriter for focus- components and component type sections
        const isFocusSection = currentSection.id.startsWith('focus-');
        const isComponentSection = currentSection.type === 'components';

        if (!currentSection.isVisible) {
            onSectionUpdate(currentSectionIndex, { isVisible: true });
            // Show planning message only once per query
            if (!planningMessageShownRef.current && onPlanningMessage) {
                planningMessageShownRef.current = true;
                onPlanningMessage();
            }
        }

        if (isFocusSection || isComponentSection) {
            // Immediate display for dashboard sections and component sections
            onSectionUpdate(currentSectionIndex, { visibleContent: contentToType || currentSection.content });
            const nextIndex = currentSectionIndex + 1;
            setCurrentSectionIndex(nextIndex);
            setTypingIndex(0);
            
            // If this was the last section, set status to complete
            if (nextIndex >= sections.length) {
                onComplete();
            }
        } else if (typingIndex < contentToType.length) {
            const timeoutId = setTimeout(() => {
                onSectionUpdate(currentSectionIndex, { 
                    visibleContent: contentToType.slice(0, typingIndex + 1) 
                });
                setTypingIndex(prev => prev + 1);
            }, 20);
            return () => clearTimeout(timeoutId);
        } else {
            const delay = setTimeout(() => {
                const nextIndex = currentSectionIndex + 1;
                setCurrentSectionIndex(nextIndex);
                setTypingIndex(0);
                
                // If this was the last section, set status to complete
                if (nextIndex >= sections.length) {
                    onComplete();
                }
            }, 400);
            return () => clearTimeout(delay);
        }
    }, [status, currentSectionIndex, typingIndex, sections, onSectionUpdate, onComplete, onPlanningMessage]);

    return {
        currentSectionIndex,
        typingIndex,
        setCurrentSectionIndex,
        setTypingIndex,
        planningMessageShownRef
    };
}

