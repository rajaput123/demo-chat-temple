/**
 * VIP Query Handler
 * Handles VIP visit queries
 */

import { CanvasSection } from '@/hooks/useSimulation';
import { ParsedVIPVisit } from '@/types/vip';
import { QueryParserService } from '@/services/queryParserService';
import { VIPPlannerService } from '@/services/vipPlannerService';
import { createSection, createPlannerSection } from '@/services/sectionManager';

export interface VIPQueryResult {
    handled: boolean;
    sections?: CanvasSection[];
    message?: string;
    vipVisit?: ParsedVIPVisit;
}

/**
 * Handle VIP query
 */
export function handleVIPQuery(
    query: string,
    options?: { onVIPVisitParsed?: (vip: ParsedVIPVisit) => void }
): VIPQueryResult {
    const lowercaseQuery = query.toLowerCase();

    // Skip if this is a "Show VIP visits" query (handled by QuickActionHandler)
    const isShowVIPVisitsQuery = lowercaseQuery.startsWith('show') &&
        (lowercaseQuery.includes('vip') && (lowercaseQuery.includes('visit') || lowercaseQuery.includes('visits')));

    if (isShowVIPVisitsQuery) {
        return { handled: false };
    }

    // Only handle if query contains VIP-related keywords
    if (!lowercaseQuery.includes('vip') && !lowercaseQuery.includes('minister') && !lowercaseQuery.includes('visit')) {
        return { handled: false };
    }

    // Try to parse VIP visit using NLP
    const parseResult = QueryParserService.parseQuery(query);
    let focusContent = '';
    let plannerActions = '';

    if (parseResult.intent === 'vip-visit' && parseResult.data) {
        const parsedVisit = parseResult.data as ParsedVIPVisit;
        if (options?.onVIPVisitParsed) {
            options.onVIPVisitParsed(parsedVisit);
        }

        // Format date
        const dateStr = parsedVisit.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        // Create structured VIP data for the info card
        const vipCardData = {
            visitor: parsedVisit.visitor,
            title: parsedVisit.title || '',
            dateTime: `${dateStr} at ${parsedVisit.time}`,
            location: parsedVisit.location || 'Main Entrance',
            protocolLevel: parsedVisit.protocolLevel,
            delegationSize: '~15 persons',
            leadEscort: 'Executive Officer',
            securityStatus: 'Briefed & Ready',
            todayHighlights: [
                { time: '07:00 AM', description: 'Sri Gurugalu will perform the Morning Anushtana as part of the daily spiritual observances.' },
                { time: '09:00 AM', description: 'The Sahasra Chandi Yaga Purnahuti will be conducted in the temple sanctum.' },
                { time: '09:30 AM', description: 'VIP Darshan is scheduled for the Honourable Prime Minister, with special protocol arrangements in place.' },
                { time: '04:00 PM', description: 'Sri Gurugalu will deliver the Evening Discourse, offering spiritual guidance and blessings to devotees.' }
            ],
            templeEvents: [
                { time: '09:00 AM', event: 'Sahasra Chandi Yaga Purnahuti' },
                { time: '10:30 AM', event: 'Special Pooja for VIP Visit' },
                { time: '04:00 PM', event: 'Evening Discourse' }
            ],
            executiveSchedule: [
                { time: '08:30 AM', event: 'Security Briefing with Police Chief' },
                { time: '09:00 AM', event: 'Receive Prime Minister at Helipad' },
                { time: '11:00 AM', event: 'Press Briefing Review' },
                { time: '02:00 PM', event: 'Internal Review Meeting' }
            ],
            gurugaluSchedule: [
                { time: '07:00 AM', event: 'Morning Anushtana' },
                { time: '09:30 AM', event: 'VIP Darshan (Prime Minister)' },
                { time: '10:30 AM', event: 'Public Discourse (Anugraha Bhashana)' },
                { time: '05:00 PM', event: 'Evening Pooja' }
            ]
        };

        focusContent = JSON.stringify(vipCardData);

        // Generate planner actions
        const tempVisit = {
            id: 'temp',
            visitor: parsedVisit.visitor,
            title: parsedVisit.title,
            date: parsedVisit.date.toISOString().split('T')[0],
            time: parsedVisit.time,
            location: parsedVisit.location,
            protocolLevel: parsedVisit.protocolLevel,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'system',
            updatedBy: 'system',
        };
        const actions = VIPPlannerService.generateVIPPlannerActions(tempVisit);
        plannerActions = VIPPlannerService.formatActionsForPlanner(actions);
    } else {
        // Fallback VIP data
        const fallbackVipData = {
            visitor: 'Justice A. K. Reddy',
            title: 'High Court Judge',
            dateTime: 'Today at 4:00 PM',
            location: 'North Gate VIP Entrance',
            protocolLevel: 'high',
            delegationSize: '~5 persons',
            leadEscort: 'Executive Officer',
            securityStatus: 'Briefed & Ready'
        };
        focusContent = JSON.stringify(fallbackVipData);
        plannerActions = '[·] Reserve North Gate parking\n[·] Brief Sanctum security staff\n[·] Arrange Prasadam for 5 guests';
    }

    const sections: CanvasSection[] = [
        createSection('focus-vip', 'VIP Protocol Brief', focusContent, 'text')
    ];

    // Always add planner for VIP queries
    if (plannerActions) {
        sections.push(createPlannerSection(plannerActions, 'VIP Plan', 'vip-checklist'));
    }

    let message = "I've prepared the VIP protocol briefing and planner actions.";
    if (lowercaseQuery.includes('show') && lowercaseQuery.includes('vip')) {
        message = "Here are the VIP visits and related planning actions.";
    }

    return {
        handled: true,
        sections,
        message
    };
}

