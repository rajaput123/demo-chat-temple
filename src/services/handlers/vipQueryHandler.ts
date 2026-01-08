/**
 * Supplier/Inspector Query Handler
 * Handles supplier visit and inspection queries
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

    // Skip if this is a "Show supplier visits" query (handled by QuickActionHandler)
    const isShowSupplierVisitsQuery = lowercaseQuery.startsWith('show') &&
        (lowercaseQuery.includes('supplier') && (lowercaseQuery.includes('visit') || lowercaseQuery.includes('visits')));

    if (isShowSupplierVisitsQuery) {
        return { handled: false };
    }

    // Only handle if query contains supplier/inspection-related keywords
    if (!lowercaseQuery.includes('supplier') && !lowercaseQuery.includes('auditor') && !lowercaseQuery.includes('inspection') && !lowercaseQuery.includes('visit')) {
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

        // Create structured supplier/inspection data for the info card
        const supplierCardData = {
            visitor: parsedVisit.visitor,
            title: parsedVisit.title || '',
            dateTime: `${dateStr} at ${parsedVisit.time}`,
            location: parsedVisit.location || 'Main Factory Entrance',
            protocolLevel: parsedVisit.protocolLevel,
            delegationSize: '~15 persons',
            leadEscort: 'Operations Manager',
            securityStatus: 'Briefed & Ready',
            todayHighlights: [
                { time: '07:00 AM', description: 'Factory Manager will perform the morning production review as part of daily operations.' },
                { time: '09:00 AM', description: 'The production batch quality check will be conducted in the crushing unit.' },
                { time: '09:30 AM', description: 'Supplier inspection is scheduled for the quality audit, with special protocol arrangements in place.' },
                { time: '04:00 PM', description: 'Factory Manager will deliver the evening operations briefing, offering guidance and updates to staff.' }
            ],
            factoryEvents: [
                { time: '09:00 AM', event: 'Production Batch Quality Check' },
                { time: '10:30 AM', event: 'Special Quality Inspection for Supplier Visit' },
                { time: '04:00 PM', event: 'Evening Operations Briefing' }
            ],
            executiveSchedule: [
                { time: '08:30 AM', event: 'Safety Briefing with Quality Manager' },
                { time: '09:00 AM', event: 'Receive Supplier at Main Entrance' },
                { time: '11:00 AM', event: 'Production Review Meeting' },
                { time: '02:00 PM', event: 'Internal Review Meeting' }
            ],
            managerSchedule: [
                { time: '07:00 AM', event: 'Morning Production Review' },
                { time: '09:30 AM', event: 'Supplier Inspection (Quality Audit)' },
                { time: '10:30 AM', event: 'Operations Briefing (Team Update)' },
                { time: '05:00 PM', event: 'Evening Quality Check' }
            ]
        };

        focusContent = JSON.stringify(supplierCardData);

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
        // Fallback supplier/inspection data
        const fallbackSupplierData = {
            visitor: 'Quality Inspector',
            title: 'Government Compliance Auditor',
            dateTime: 'Today at 4:00 PM',
            location: 'Main Factory Entrance',
            protocolLevel: 'high',
            delegationSize: '~5 persons',
            leadEscort: 'Operations Manager',
            securityStatus: 'Briefed & Ready'
        };
        focusContent = JSON.stringify(fallbackSupplierData);
        plannerActions = '[·] Reserve main entrance parking\n[·] Brief quality control staff\n[·] Arrange quality reports for 5 guests';
    }

    const sections: CanvasSection[] = [
        createSection('focus-supplier', 'Supplier Inspection Brief', focusContent, 'text')
    ];

    // Always add planner for supplier/inspection queries
    if (plannerActions) {
        sections.push(createPlannerSection(plannerActions, 'Inspection Plan', 'supplier-checklist'));
    }

    let message = "I've prepared the supplier inspection protocol briefing and planner actions.";
    if (lowercaseQuery.includes('show') && lowercaseQuery.includes('supplier')) {
        message = "Here are the supplier visits and related planning actions.";
    }

    return {
        handled: true,
        sections,
        message
    };
}

