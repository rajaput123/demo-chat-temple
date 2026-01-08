/**
 * Special Scenario Handler
 * Handles special scenarios like Factory Manager inspections, Production batches, Crushing season, Factory Admin, Auditor, etc.
 */

import { CanvasSection } from '@/hooks/useSimulation';
import { ParsedVIPVisit } from '@/types/vip';
import { createSection, createPlannerSection } from '@/services/sectionManager';
import { isInfoQuery, isSummaryQuery } from '@/utils/queryHelpers';

export interface SpecialScenarioResult {
    handled: boolean;
    sections?: CanvasSection[];
    message?: string;
    vipVisit?: ParsedVIPVisit;
}

/**
 * Handle special scenario queries
 */
export function handleSpecialScenario(
    query: string,
    options?: { onVIPVisitParsed?: (vip: ParsedVIPVisit) => void }
): SpecialScenarioResult {
    const lowercaseQuery = query.toLowerCase();

    // Try each scenario handler in order
    const handlers = [
        () => handleFactoryManager(query, lowercaseQuery, options),
        () => handleProductionBatch(query, lowercaseQuery),
        () => handleMaintenance(query, lowercaseQuery),
        () => handleCrushingSeason(query, lowercaseQuery),
        () => handleFactoryAdmin(query, lowercaseQuery),
        () => handleAuditorInspection(query, lowercaseQuery),
        () => handleApproval(query, lowercaseQuery),
        () => handleScheduleReview(query, lowercaseQuery),
        () => handleDirective(query, lowercaseQuery),
        () => handleGovernmentAuditor(query, lowercaseQuery),
    ];

    for (const handler of handlers) {
        const result = handler();
        if (result.handled) {
            return result;
        }
    }

    return { handled: false };
}

/**
 * Handle Factory Manager/Quality Inspector queries
 */
function handleFactoryManager(
    query: string,
    lowercaseQuery: string,
    options?: { onVIPVisitParsed?: (vip: ParsedVIPVisit) => void }
): SpecialScenarioResult {
    if (!lowercaseQuery.includes('factory manager') && !lowercaseQuery.includes('quality inspector')) {
        return { handled: false };
    }

    const isFieldVisit = lowercaseQuery.includes('field') || lowercaseQuery.includes('farm');
    const vipVisit: ParsedVIPVisit = {
        visitor: "Factory Manager",
        title: "Operations Manager & Quality Inspector",
        date: isFieldVisit ? new Date() : new Date(new Date().setDate(new Date().getDate() + 1)),
        time: isFieldVisit ? "16:00" : "17:00",
        location: isFieldVisit ? "Cane Field" : "Main Factory Entrance",
        protocolLevel: "maximum",
        confidence: 1.0
    };

    if (options?.onVIPVisitParsed) {
        options.onVIPVisitParsed(vipVisit);
    }

    const inspectionData = {
        visitor: "Factory Manager",
        title: "Operations Manager & Quality Inspector",
        dateTime: isFieldVisit ? "Today at 4:00 PM" : "Tomorrow at 5:00 PM",
        location: isFieldVisit ? "Cane Field" : "Main Factory Entrance",
        protocolLevel: "maximum",
        delegationSize: isFieldVisit ? "~20 persons" : "~10 persons",
        todayHighlights: isFieldVisit ? [
            { time: '03:30 PM', description: 'Pre-inspection readiness check and safety briefing.' },
            { time: '04:00 PM', description: 'Arrival at cane field and quality assessment.' },
            { time: '04:30 PM', description: 'Cane quality inspection and sampling.' },
            { time: '05:30 PM', description: 'Review meeting with suppliers and farmers.' }
        ] : [
            { time: '05:00 PM', description: 'Arrival at main factory entrance.' },
            { time: '05:30 PM', description: 'Factory tour and production review.' },
            { time: '06:30 PM', description: 'Operations briefing and planning session.' }
        ],
        highlightTitle: "TODAY | HIGHLIGHTS",
        highlights: isFieldVisit ? [
            { time: '03:30 PM', description: 'Pre-inspection readiness check and safety briefing.' },
            { time: '04:00 PM', description: 'Arrival at cane field and quality assessment.' },
            { time: '04:30 PM', description: 'Cane quality inspection and sampling.' },
            { time: '05:30 PM', description: 'Review meeting with suppliers and farmers.' }
        ] : [
            { time: '05:00 PM', description: 'Arrival at main factory entrance.' },
            { time: '05:30 PM', description: 'Factory tour and production review.' },
            { time: '06:30 PM', description: 'Operations briefing and planning session.' }
        ]
    };

    const fieldInspectionPlannerContent = `[·] Confirm Factory Manager arrival & reception protocol
[·] Align factory coordination & travel readiness
[·] Prepare inspection route & movement path inside factory
[·] Confirm quality control team availability
[·] Prepare inspection checklist & sampling equipment
[·] Inform factory supervisors & senior staff
[·] Activate safety protocols & volunteer arrangement
[·] Coordinate sugar product preparation (sample batch)
[·] Ensure protocol & security alignment
[·] Conduct pre-arrival safety readiness check (3:30 PM)`;

    const sections: CanvasSection[] = [
        createSection('focus-inspection', 'Quality Inspection Brief', JSON.stringify(inspectionData), 'text'),
        createPlannerSection(
            isFieldVisit ? fieldInspectionPlannerContent : '[·] Arrange factory tour at main entrance\n[·] Coordinate production line inspection\n[·] Ensure quality clearance for production areas\n[·] Prepare production reports for review',
            isFieldVisit ? 'Field Inspection Plan' : 'Factory Tour Plan',
            'planner-manager'
        )
    ];

    return {
        handled: true,
        sections,
        message: `I've prepared the ${isFieldVisit ? 'field inspection' : 'factory tour'} briefing and planner actions for the Factory Manager.`,
        vipVisit
    };
}

/**
 * Handle Production Batch queries
 */
function handleProductionBatch(query: string, lowercaseQuery: string): SpecialScenarioResult {
    if (!lowercaseQuery.includes('batch') && !lowercaseQuery.includes('production') && !lowercaseQuery.includes('crushing')) {
        return { handled: false };
    }

    const isSpecialBatch = lowercaseQuery.includes('special') || lowercaseQuery.includes('priority');

    if (isSpecialBatch) {
        const batchData = {
            visitor: "Production Team & Quality Inspectors",
            title: "Special Production Batch",
            dateTime: "3rd Feb, 2024 (7:00 AM - 1:00 PM)",
            location: "Main Crushing Unit / Production Floor",
            protocolLevel: "high",
            delegationSize: "Multiple Quality Teams",
            todayHighlights: [
                { time: '07:00 AM', description: 'Commencement of special production batch with quality checks.' },
                { time: '09:00 AM', description: 'Crushing operation start and initial sampling.' },
                { time: '11:00 AM', description: 'Quality inspection and batch testing.' },
                { time: '12:30 PM', description: 'Final quality approval and batch completion.' }
            ],
            highlightTitle: "FEBRUARY 3 | HIGHLIGHTS",
            highlights: [
                { time: '07:00 AM', description: 'Commencement of special production batch with quality checks.' },
                { time: '09:00 AM', description: 'Crushing operation start and initial sampling.' },
                { time: '11:00 AM', description: 'Quality inspection and batch testing.' },
                { time: '12:30 PM', description: 'Final quality approval and batch completion.' }
            ]
        };

        const sections: CanvasSection[] = [
            createSection('focus-batch', 'Production Batch Protocol', JSON.stringify(batchData), 'text'),
            createPlannerSection(
                '[·] Confirm staffing for production line\n[·] Secure production area for quality inspection\n[·] Arrange for specialized quality testing equipment\n[·] Coordinate with inventory department for sugar product distribution',
                'Batch Preparation Plan',
                'planner-batch'
            )
        ];

        return {
            handled: true,
            sections,
            message: "I've generated the special production batch protocol briefing and planning steps for Feb 3rd."
        };
    } else {
        const sections: CanvasSection[] = [
            createSection('focus-event', 'Event Brief: Production Batch', 'The production batch is scheduled to commence at 7:00 AM tomorrow at the crushing unit. Quality control team has arrived. Final approval is scheduled for 12:30 PM on Sunday.', 'text'),
            createPlannerSection(
                '[·] Inspect crushing unit arrangements and safety\n[·] Verify stock of 500kg cane and 1000kg processing capacity\n[·] Coordinate staffing for production line\n[·] Setup quality control station near main gate',
                'Batch Preparation',
                'planner-batch'
            )
        ];

        return {
            handled: true,
            sections
        };
    }
}

/**
 * Handle Maintenance/Upgrade Project queries
 */
function handleMaintenance(query: string, lowercaseQuery: string): SpecialScenarioResult {
    if (!lowercaseQuery.includes('maintenance') && !lowercaseQuery.includes('upgrade') && !lowercaseQuery.includes('renovation') && !lowercaseQuery.includes('infrastructure')) {
        return { handled: false };
    }

    const projectData = {
        title: "Crushing Unit Equipment Upgrade",
        subTitle: "Status: Ongoing (65% Complete) | Deadline: Feb 20, 2024",
        highlightTitle: "PROJECT | RECENT MILESTONES",
        highlights: [
            { time: 'Jan 2', description: 'Primary equipment inspection and cleaning completed.' },
            { time: 'Jan 5', description: 'Equipment upgrade of base structure initiated.' },
            { time: 'Today', description: 'Ready for stage-3 quality review.' }
        ]
    };

    const sections: CanvasSection[] = [
        createSection('focus-project', 'Project Executive Brief', JSON.stringify(projectData), 'text'),
        createPlannerSection(
            `[·] Audit current equipment stock and utilization
[·] Approve stage-3 maintenance progress report
[·] Schedule safety transfer of completed components
[·] Finalize production closure window for installation
[·] Arrange documentation photography of progress`,
            'Maintenance Milestones',
            'planner-project'
        )
    ];

    return {
        handled: true,
        sections,
        message: "Project status updated. I've added the maintenance milestones to your planner."
    };
}

/**
 * Handle Crushing Season queries
 */
function handleCrushingSeason(query: string, lowercaseQuery: string): SpecialScenarioResult {
    if (!lowercaseQuery.includes('season') && !lowercaseQuery.includes('harvest') && !lowercaseQuery.includes('crushing season')) {
        return { handled: false };
    }

    const isPeakSeason = lowercaseQuery.includes('peak') || lowercaseQuery.includes('crushing season');
    const isStatusQuery = lowercaseQuery.includes('progress') || lowercaseQuery.includes('status') || lowercaseQuery.startsWith('show') || lowercaseQuery.includes('view');
    const isSeasonInfo = (lowercaseQuery.includes('season') || lowercaseQuery.includes('harvest') || lowercaseQuery.includes('crushing season')) && 
        (isInfoQuery(query) || isSummaryQuery(query) || lowercaseQuery.includes('prepare') || lowercaseQuery.includes('plan'));

    if (isPeakSeason || isSeasonInfo) {
        const seasonData = {
            visitor: "Production Season Protocol",
            title: "Crushing Season Operations",
            dateTime: "Upcoming: Peak Season Start",
            location: "Main Factory & Cane Yard",
            protocolLevel: "maximum",
            delegationSize: "Multiple supplier groups",
            todayHighlights: [
                { time: 'Week 1', description: 'Season commencement, initial cane intake setup.' },
                { time: 'Week 4', description: 'Peak production period, maximum capacity operations.' },
                { time: 'Week 10', description: 'Season wind-down, final batch processing.' }
            ],
            highlightTitle: "SEASON | HIGHLIGHTS",
            highlights: [
                { time: 'Week 1', description: 'Season commencement, initial cane intake setup.' },
                { time: 'Week 4', description: 'Peak production period, maximum capacity operations.' },
                { time: 'Week 10', description: 'Season wind-down, final batch processing.' }
            ]
        };

        const sections: CanvasSection[] = [
            createSection('focus-season', 'Production Season Brief', JSON.stringify(seasonData), 'text'),
            createPlannerSection(
                `[·] Verify production schedule for all 10 weeks
[·] Finalize cane procurement for peak season
[·] Deploy additional quality control staff
[·] Setup temporary storage facilities at 3 locations
[·] Coordinate with transport for cane delivery services`,
                'Season Execution Roadmap',
                'planner-season'
            )
        ];

        return {
            handled: true,
            sections,
            message: "I've generated the crushing season execution roadmap and briefing."
        };
    } else {
        const sections: CanvasSection[] = [
            createSection('focus-summary', 'Season Preparation Status', 'Overall preparation is 85% complete. The main production line for Week 1 is ready. Quality control barriers are installed. Cane supplies are stocked for the first 3 weeks.', 'text')
        ];

        if (!isStatusQuery) {
            sections.push(createPlannerSection(
                '[·] Final inspection of Cane Yard A\n[·] Review quality control coverage with Quality Manager\n[·] Suppliers meeting for cane delivery schedules\n[·] Equipment safety audit of production line',
                'Season Readiness',
                'planner-season'
            ));
        }

        return {
            handled: true,
            sections,
            message: "Season preparations are on track. Dashboard updated with current status."
        };
    }
}

/**
 * Handle Factory Admin queries
 */
function handleFactoryAdmin(query: string, lowercaseQuery: string): SpecialScenarioResult {
    if (!lowercaseQuery.includes('admin') && !(lowercaseQuery.includes('factory admin') || lowercaseQuery.includes('manager'))) {
        return { handled: false };
    }

    const isAdminAction = lowercaseQuery.includes('ask') || lowercaseQuery.includes('tell') || lowercaseQuery.includes('directive') || lowercaseQuery.includes('order');
    const dept = lowercaseQuery.includes('production') ? 'Production' : lowercaseQuery.includes('quality') ? 'Quality Control' : lowercaseQuery.includes('inventory') ? 'Inventory' : 'Admin';

    if (isAdminAction) {
        const sections: CanvasSection[] = [
            createSection(`focus-admin-action-${Date.now()}`, `Admin Directive: ${dept}`, `Factory Admin has directed the ${dept} department to ${query.split(' to ')[1] || 'respond immediately to current requirements'}. Tracking for completion by EOD.`, 'text'),
            createPlannerSection(
                `[·] Confirm receipt of directive by ${dept} head\n[·] Monitor ${dept} progress updates\n[·] Report completion to Factory Admin office`,
                'Admin Follow-up',
                `planner-admin-${Date.now()}`
            )
        ];

        return {
            handled: true,
            sections,
            message: `Directive issued to ${dept}. Tracking as high priority.`
        };
    } else {
        const adminData = {
            visitor: "Factory Admin",
            title: "Operations Manager & Factory Admin",
            dateTime: "Today: Office Hours (10:00 AM - 6:00 PM)",
            location: "Factory Administrative Office",
            protocolLevel: "maximum",
            delegationSize: "Executive Staff",
            todayHighlights: [
                { time: '11:30 AM', description: 'Review of production season preparation with department heads.' },
                { time: '03:00 PM', description: 'Meeting with Quality Control (Compliance).' },
                { time: '05:00 PM', description: 'Financial audit final review.' }
            ],
            highlightTitle: "OFFICE | HIGHLIGHTS"
        };

        const sections: CanvasSection[] = [
            createSection('focus-admin', 'Factory Admin Office Briefing', JSON.stringify(adminData), 'text')
        ];

        return {
            handled: true,
            sections,
            message: "Factory Admin office briefing loaded. Dashboard shows today's high-level engagements."
        };
    }
}

/**
 * Handle Auditor/Inspector queries (general)
 */
function handleAuditorInspection(query: string, lowercaseQuery: string): SpecialScenarioResult {
    if (!lowercaseQuery.includes('auditor') && !(lowercaseQuery.includes('inspector') && !lowercaseQuery.includes('quality inspector')) && !lowercaseQuery.includes('government') && !lowercaseQuery.includes('compliance')) {
        return { handled: false };
    }

    const visitorName = lowercaseQuery.includes('auditor') ? "Government Auditor" : "Compliance Inspector";
    const protocolData = {
        visitor: visitorName,
        title: "Government Inspection Protocol",
        dateTime: "Confirmed: 12th Feb, 2024 at 11:00 AM",
        location: "Main Factory Entrance / Reception Area",
        protocolLevel: "maximum",
        delegationSize: "~15 persons + security",
        leadEscort: "Factory Admin / Operations Manager",
        securityStatus: "High Priority / Local Authority Liaison",
        todayHighlights: [
            { time: '10:30 AM', description: `Pre-arrival safety sweep by compliance team.` },
            { time: '11:00 AM', description: `Arrival and reception by Factory Admin.` },
            { time: '11:30 AM', description: `Factory inspection and compliance review.` },
            { time: '12:30 PM', description: `Lunch at Executive Conference Room.` }
        ],
        highlightTitle: "PROTOCOL | HIGHLIGHTS"
    };

    const sections: CanvasSection[] = [
        createSection('focus-auditor', 'Government Inspection Protocol', JSON.stringify(protocolData), 'text'),
        createPlannerSection(
            `[·] Coordinate with local authorities for escort & access\n[·] Brief factory protocol officers on inspection requirements\n[·] Secure inspection window for production areas (30 mins)\n[·] Confirm documentation & compliance records ready`,
            'Inspection Protocol',
            'planner-auditor'
        )
    ];

    return {
        handled: true,
        sections,
        message: `I've prepared the inspection protocol briefing and planner actions for the ${visitorName}'s visit.`
    };
}

/**
 * Handle Approval queries
 */
function handleApproval(query: string, lowercaseQuery: string): SpecialScenarioResult {
    if (!lowercaseQuery.includes('approval') && !lowercaseQuery.includes('pending')) {
        return { handled: false };
    }

    const isViewOnly = lowercaseQuery.startsWith('show') || lowercaseQuery.includes('view') || lowercaseQuery.includes('list') || lowercaseQuery.includes('check');
    const focusContent = 'You have 3 high-priority approvals pending for the crushing unit equipment upgrade. Delay may impact the upcoming production season schedule.';

    const sections: CanvasSection[] = [
        createSection('focus-approval', 'Approval Briefing', focusContent, 'text')
    ];

    if (!isViewOnly) {
        sections.push(createPlannerSection(
            '[·] Review Production Manager\'s technical request\n[·] Verify equipment warranty coverage extension\n[·] Confirm maintenance team availability for Jan 15',
            undefined,
            'approval-steps'
        ));
    }

    return {
        handled: true,
        sections
    };
}

/**
 * Handle Schedule/Review/Plan queries
 */
function handleScheduleReview(query: string, lowercaseQuery: string): SpecialScenarioResult {
    if (!lowercaseQuery.startsWith('schedule') && !lowercaseQuery.startsWith('review') && !(lowercaseQuery.startsWith('plan') && !lowercaseQuery.includes('action'))) {
        return { handled: false };
    }

    let cardType = 'appointment';
    if (lowercaseQuery.includes('review')) cardType = 'review';
    else if (lowercaseQuery.includes('event') || lowercaseQuery.includes('batch')) cardType = 'event';
    else if (lowercaseQuery.includes('quality') || lowercaseQuery.includes('inspection')) cardType = 'inspection';

    const subject = query.replace(/^(schedule|review|plan)\s+/i, '').split(' on ')[0].split(' at ')[0];

    const cardData = {
        type: cardType,
        subject: subject.charAt(0).toUpperCase() + subject.slice(1),
        dateTime: "Tomorrow, 10:00 AM",
        intent: "Align key stakeholders on execution roadmap and identify blockers.",
        plannedBy: "Factory Admin",
        visibility: "Executive"
    };

    const sections: CanvasSection[] = [
        createSection('focus-admin-card', 'Executive Plan', JSON.stringify(cardData), 'text')
    ];

    return {
        handled: true,
        sections,
        message: `I've scheduled the ${cardType} regarding "${subject}". Relevant cards have been placed on your canvas.`
    };
}

/**
 * Handle Directive/Instruct queries
 */
function handleDirective(query: string, lowercaseQuery: string): SpecialScenarioResult {
    if (!lowercaseQuery.startsWith('direct') && !lowercaseQuery.startsWith('instruct') && !lowercaseQuery.startsWith('ask') && !lowercaseQuery.startsWith('tell') && !lowercaseQuery.startsWith('ensure')) {
        return { handled: false };
    }

    const cleanDirective = query.replace(/^(direct|instruct|ask|tell|ensure)\s+/i, '');

    let dept = 'Operations';
    if (cleanDirective.toLowerCase().includes('quality') || cleanDirective.toLowerCase().includes('inspection')) dept = 'Quality Control';
    else if (cleanDirective.toLowerCase().includes('finance') || cleanDirective.toLowerCase().includes('money')) dept = 'Finance';
    else if (cleanDirective.toLowerCase().includes('production') || cleanDirective.toLowerCase().includes('crushing')) dept = 'Production';
    else if (cleanDirective.toLowerCase().includes('inventory') || cleanDirective.toLowerCase().includes('storage')) dept = 'Inventory';

    const taggedAction = `[·] [DIRECTIVE] [PRIORITY:HIGH] [DEPT:${dept}] ${cleanDirective.charAt(0).toUpperCase() + cleanDirective.slice(1)}`;

    const sections: CanvasSection[] = [
        createPlannerSection(taggedAction, 'Executive Directives', `planner-actions-${Date.now()}`)
    ];

    return {
        handled: true,
        sections,
        message: `Directive issued to ${dept}. Tracking as high priority.`
    };
}

/**
 * Handle Government Auditor specific queries
 */
function handleGovernmentAuditor(query: string, lowercaseQuery: string): SpecialScenarioResult {
    if (!lowercaseQuery.includes('auditor') || (!lowercaseQuery.includes('government') && !lowercaseQuery.includes('visit'))) {
        return { handled: false };
    }

    const auditorData = {
        visitor: "Government Compliance Auditor",
        title: "State Compliance Inspector",
        dateTime: "15th Jan, 2024 at 11:30 AM",
        location: "Main Factory Entrance",
        protocolLevel: "high",
        delegationSize: "~12 persons",
        todayHighlights: [
            { time: '11:00 AM', description: 'Pre-arrival safety sweep of factory premises.' },
            { time: '11:30 AM', description: 'Arrival at main factory entrance and welcome.' },
            { time: '12:00 PM', description: 'Factory inspection and compliance review.' },
            { time: '01:00 PM', description: 'Lunch at Executive Conference Room with Factory Management.' }
        ],
        highlightTitle: "JANUARY 15 | HIGHLIGHTS",
        highlights: [
            { time: '11:00 AM', description: 'Pre-arrival safety sweep of factory premises.' },
            { time: '11:30 AM', description: 'Arrival at main factory entrance and welcome.' },
            { time: '12:00 PM', description: 'Factory inspection and compliance review.' },
            { time: '01:00 PM', description: 'Lunch at Executive Conference Room with Factory Management.' }
        ]
    };

    const sections: CanvasSection[] = [
        createSection('focus-auditor', 'Inspection Protocol Brief: Government Auditor Visit', JSON.stringify(auditorData), 'text'),
        createPlannerSection(
            `[·] Coordinate with government compliance office
[·] Arrange high-priority safety escort from entry
[·] Reserve Executive Conference Room for meeting
[·] Prepare compliance documentation at main gate
[·] Ensure inspection-ready corridor during factory tour`,
            'Auditor Inspection Plan',
            'planner-auditor'
        )
    ];

    return {
        handled: true,
        sections,
        message: "I've prepared the inspection protocol briefing and planner actions for the Government Auditor's visit."
    };
}

