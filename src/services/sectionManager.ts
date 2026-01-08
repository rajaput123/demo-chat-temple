/**
 * Section Manager Service
 * Handles creation, merging, and filtering of canvas sections
 */

import { CanvasSection } from '@/hooks/useSimulation';

/**
 * Check if a section is a focus card
 */
export function isFocusCard(section: CanvasSection): boolean {
    return section.id.startsWith('focus-') ||
        section.id === 'objective' ||
        section.title.includes('Protocol Brief') ||
        section.title.includes('Appointments') ||
        section.title.includes('Appointment') ||
        section.title.includes('Approvals') ||
        section.title.includes('Approval') ||
        section.title.includes('Alerts') ||
        section.title.includes('Alert') ||
        section.title.includes('Reminder') ||
        section.title.includes('Notification') ||
        section.title.includes('Finance Summary') ||
        section.title.includes('Finance') ||
        section.title.includes('Revenue Analysis') ||
        section.title.includes('Revenue') ||
        section.title.includes('Morning Revenue') ||
        section.title.includes('Event Protocol Brief') ||
        section.title.includes('Visit Protocol Brief') ||
        section.title.includes('VIP') ||
        section.title.includes('VIP Visits') ||
        section.title.includes('Calendar') ||
        section.title.includes('Schedule') ||
        section.title.includes('Today\'s') ||
        section.title.includes('Tomorrow\'s');
}

/**
 * Filter out focus cards from sections array
 */
export function filterFocusCards(sections: CanvasSection[]): CanvasSection[] {
    return sections.filter(s => {
        // Always keep planner actions
        if (s.title === 'Your Planner Actions') return true;
        // Remove focus cards
        return !isFocusCard(s);
    });
}

/**
 * Find focus section in sections array
 */
export function findFocusSection(sections: CanvasSection[]): CanvasSection | undefined {
    return sections.find(s => s.id.startsWith('focus-')) ||
        sections.find(s => isFocusCard(s));
}

/**
 * Find planner section in sections array
 */
export function findPlannerSection(sections: CanvasSection[]): CanvasSection | undefined {
    return sections.find(s => s.title === 'Your Planner Actions');
}

/**
 * Merge planner sections - combines content from existing and new planner
 */
export function mergePlannerSections(
    existingPlanner: CanvasSection | undefined,
    newPlanner: CanvasSection | undefined
): CanvasSection | undefined {
    if (!existingPlanner && !newPlanner) return undefined;
    if (!existingPlanner) return newPlanner;
    if (!newPlanner) return existingPlanner;

    const mergedContent = existingPlanner.content
        ? `${existingPlanner.content}\n${newPlanner.content}`
        : newPlanner.content;

    return {
        ...existingPlanner,
        content: mergedContent,
        subTitle: newPlanner.subTitle || existingPlanner.subTitle,
        visibleContent: existingPlanner.visibleContent, // Preserve existing visible content
        isVisible: existingPlanner.isVisible
    };
}

/**
 * Replace focus cards in sections array with new focus sections
 */
export function replaceFocusCards(
    existingSections: CanvasSection[],
    newSections: CanvasSection[]
): CanvasSection[] {
    // Separate planner and non-planner new sections
    const newPlanner = newSections.find(s => s.title === 'Your Planner Actions');
    const newFocusSections = newSections.filter(s => s.title !== 'Your Planner Actions' && isFocusCard(s));
    const newOtherSections = newSections.filter(s => s.title !== 'Your Planner Actions' && !isFocusCard(s));

    // Filter out old focus cards, keep planner and other sections
    const nonFocusPrevSections = filterFocusCards(existingSections);

    // Build updated sections: new focus sections first, then other sections, then planner
    const updatedSections: CanvasSection[] = [
        ...newFocusSections,
        ...newOtherSections,
        ...nonFocusPrevSections
    ];

    // Handle planner merging
    const existingPlanner = findPlannerSection(existingSections);
    if (existingPlanner || newPlanner) {
        const mergedPlanner = mergePlannerSections(existingPlanner, newPlanner);
        if (mergedPlanner) {
            const plannerIndex = updatedSections.findIndex(s => s.title === 'Your Planner Actions');
            if (plannerIndex >= 0) {
                updatedSections[plannerIndex] = mergedPlanner;
            } else {
                updatedSections.push(mergedPlanner);
            }
        }
    }

    return updatedSections;
}

/**
 * Add sections to existing sections array (for non-quick-action queries)
 */
export function addSections(
    existingSections: CanvasSection[],
    newSections: CanvasSection[]
): CanvasSection[] {
    // Separate planner and non-planner new sections
    const newPlanner = newSections.find(s => s.title === 'Your Planner Actions');
    const newNonPlannerSections = newSections.filter(s => s.title !== 'Your Planner Actions');

    // Start with existing sections, add new non-planner sections
    const updatedSections: CanvasSection[] = [
        ...existingSections,
        ...newNonPlannerSections
    ];

    // Handle planner merging
    const existingPlanner = findPlannerSection(existingSections);
    if (existingPlanner || newPlanner) {
        const mergedPlanner = mergePlannerSections(existingPlanner, newPlanner);
        if (mergedPlanner) {
            const plannerIndex = updatedSections.findIndex(s => s.title === 'Your Planner Actions');
            if (plannerIndex >= 0) {
                updatedSections[plannerIndex] = mergedPlanner;
            } else {
                updatedSections.push(mergedPlanner);
            }
        }
    }

    return updatedSections;
}

/**
 * Create a new section
 */
export function createSection(
    id: string,
    title: string,
    content: string,
    type: 'text' | 'list' | 'steps' | 'components' = 'text',
    subTitle?: string
): CanvasSection {
    return {
        id,
        title,
        subTitle,
        content,
        type,
        visibleContent: '',
        isVisible: false
    };
}

/**
 * Create a planner section
 */
export function createPlannerSection(
    content: string,
    subTitle?: string,
    id?: string
): CanvasSection {
    return createSection(
        id || `planner-${Date.now()}`,
        'Your Planner Actions',
        content,
        'list',
        subTitle
    );
}

