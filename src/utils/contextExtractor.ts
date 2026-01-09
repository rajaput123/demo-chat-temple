/**
 * Context Extractor
 * 
 * Utility functions to extract context from current sections
 */

import { CanvasSection } from '@/hooks/useSimulation';

export interface ExtractedContext {
    focusSection: CanvasSection | undefined;
    plannerSection: CanvasSection | undefined;
    allSections: CanvasSection[];
    hasFocus: boolean;
    hasPlanner: boolean;
    otherSections: CanvasSection[];
}

/**
 * Extract context from current sections
 */
export function extractContext(sections: CanvasSection[]): ExtractedContext {
    const focusSection = sections.find(s => s.id.startsWith('focus-'));
    const plannerSection = sections.find(s => s.title === 'Your Planner Actions');
    const otherSections = sections.filter(s => 
        !s.id.startsWith('focus-') && s.title !== 'Your Planner Actions'
    );

    return {
        focusSection,
        plannerSection,
        allSections: sections,
        hasFocus: !!focusSection,
        hasPlanner: !!plannerSection,
        otherSections
    };
}

