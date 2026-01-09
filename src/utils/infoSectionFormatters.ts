/**
 * Info Section Formatters
 * 
 * Helper functions to format data for info sections (plan, summary, complete info, next info)
 */

import { CanvasSection } from '@/hooks/useSimulation';
import { mockEvents } from '@/data/mockEventData';
import { mockActivities } from '@/data/mockOperationsData';

/**
 * Format plan information for info section
 */
export function formatPlanInfo(plannerSection: CanvasSection | undefined): string {
    if (!plannerSection || !plannerSection.content) {
        return 'No active plan. I can help you create one.';
    }

    const actions = plannerSection.content.split('\n').filter(line => 
        line.trim().startsWith('[·]') || line.trim().startsWith('[x]') || line.trim().startsWith('[✓]')
    );
    const activeActions = actions.filter(a => !a.trim().startsWith('[x]') && !a.trim().startsWith('[✓]'));
    const completedActions = actions.filter(a => a.trim().startsWith('[x]') || a.trim().startsWith('[✓]'));

    let info = `Your current plan has ${activeActions.length} active action${activeActions.length !== 1 ? 's' : ''}.`;
    if (completedActions.length > 0) {
        info += `\n\n${completedActions.length} action${completedActions.length !== 1 ? 's' : ''} completed.`;
    }
    if (plannerSection.subTitle) {
        info += `\n\nPlan: ${plannerSection.subTitle}`;
    }

    return info;
}

/**
 * Format summary information from sections
 */
export function formatSummaryInfo(sections: CanvasSection[]): string {
    const focusSection = sections.find(s => s.id.startsWith('focus-'));
    const plannerSection = sections.find(s => s.title === 'Your Planner Actions');

    if (!focusSection && !plannerSection) {
        return 'No current context to summarize.';
    }

    let summary = '';

    if (focusSection) {
        summary += `Current Focus: ${focusSection.title || 'Active Focus'}\n\n`;
        // Extract first 200 characters of content
        const contentPreview = focusSection.content.length > 200 
            ? focusSection.content.substring(0, 200) + '...'
            : focusSection.content;
        summary += contentPreview;
    }

    if (plannerSection) {
        const actionCount = plannerSection.content.split('\n').filter(l => 
            l.trim().startsWith('[·]') || l.trim().startsWith('[x]') || l.trim().startsWith('[✓]')
        ).length;
        if (summary) summary += '\n\n';
        summary += `Active Planner Actions: ${actionCount}`;
        if (plannerSection.subTitle) {
            summary += `\nPlan Type: ${plannerSection.subTitle}`;
        }
    }

    return summary || 'No current context to summarize.';
}

/**
 * Format complete information from focus section
 */
export function formatCompleteInfo(focusSection: CanvasSection): string {
    if (!focusSection || !focusSection.content) {
        return 'No focus area selected. Please select a focus area first to view complete information.';
    }

    // Try to parse JSON content (for structured cards)
    try {
        const parsed = JSON.parse(focusSection.content);
        // Format structured data
        let formatted = '';
        if (parsed.visitor) formatted += `Visitor: ${parsed.visitor}\n`;
        if (parsed.title) formatted += `Title: ${parsed.title}\n`;
        if (parsed.dateTime) formatted += `Date/Time: ${parsed.dateTime}\n`;
        if (parsed.location) formatted += `Location: ${parsed.location}\n`;
        if (parsed.protocolLevel) formatted += `Protocol Level: ${parsed.protocolLevel}\n`;
        if (parsed.intent) formatted += `\nIntent: ${parsed.intent}\n`;
        if (parsed.todayHighlights && Array.isArray(parsed.todayHighlights)) {
            formatted += '\nHighlights:\n';
            parsed.todayHighlights.forEach((h: any) => {
                formatted += `- ${h.time}: ${h.description}\n`;
            });
        }
        return formatted || focusSection.content;
    } catch (e) {
        // Not JSON, return as-is
        return focusSection.content;
    }
}

/**
 * Format next/upcoming information
 */
export function formatNextInfo(): string {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const items: string[] = [];

    // Get upcoming events (next 7 days)
    const upcomingEvents = mockEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= nextWeek;
    }).slice(0, 3);

    upcomingEvents.forEach(event => {
        const eventDate = new Date(event.date);
        const dateStr = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        items.push(`[·] ${event.name} - ${dateStr} at ${event.time || 'TBD'}`);
    });

    // Get upcoming activities (next 24 hours)
    const upcomingActivities = mockActivities.filter(activity => {
        const activityDate = new Date(activity.startTime);
        return activityDate >= now && activityDate <= new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }).slice(0, 3);

    upcomingActivities.forEach(activity => {
        const activityDate = new Date(activity.startTime);
        const timeStr = activityDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        items.push(`[·] ${activity.title} - Today at ${timeStr}`);
    });

    if (items.length === 0) {
        return 'No upcoming items found in the next week.';
    }

    return items.join('\n');
}

