/**
 * Special Scenario Handler
 * Handles special scenarios like Jagadguru visits, Chandi Yaga, Navaratri, CEO, Governor, etc.
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
        () => handleJagadguru(query, lowercaseQuery, options),
        () => handleChandiYaga(query, lowercaseQuery),
        () => handleRestoration(query, lowercaseQuery),
        () => handleNavaratri(query, lowercaseQuery),
        () => handleCEO(query, lowercaseQuery),
        () => handleGovernorVVIP(query, lowercaseQuery),
        () => handleApproval(query, lowercaseQuery),
        () => handleScheduleReview(query, lowercaseQuery),
        () => handleDirective(query, lowercaseQuery),
        () => handleGovernorKarnataka(query, lowercaseQuery),
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
 * Handle Jagadguru/Swamiji queries
 */
function handleJagadguru(
    query: string,
    lowercaseQuery: string,
    options?: { onVIPVisitParsed?: (vip: ParsedVIPVisit) => void }
): SpecialScenarioResult {
    if (!lowercaseQuery.includes('jagadguru') && !lowercaseQuery.includes('swamiji')) {
        return { handled: false };
    }

    const isKiggaVisit = lowercaseQuery.includes('kigga');
    const vipVisit: ParsedVIPVisit = {
        visitor: "Jagadguru Sri Sri Vidhushekhara Bharati Sannidhanam",
        title: "Pontiff of Sringeri Sharada Peetham",
        date: isKiggaVisit ? new Date() : new Date(new Date().setDate(new Date().getDate() + 1)),
        time: isKiggaVisit ? "16:00" : "17:00",
        location: isKiggaVisit ? "Kigga" : "Main Entrance (Raja Gopuram)",
        protocolLevel: "maximum",
        confidence: 1.0
    };

    if (options?.onVIPVisitParsed) {
        options.onVIPVisitParsed(vipVisit);
    }

    const vipData = {
        visitor: "Jagadguru Sri Sri Vidhushekhara Bharati Sannidhanam",
        title: "Pontiff of Sringeri Sharada Peetham",
        dateTime: isKiggaVisit ? "Today at 4:00 PM" : "Tomorrow at 5:00 PM",
        location: isKiggaVisit ? "Kigga" : "Main Entrance (Raja Gopuram)",
        protocolLevel: "maximum",
        delegationSize: isKiggaVisit ? "~20 persons" : "~10 persons",
        todayHighlights: isKiggaVisit ? [
            { time: '03:30 PM', description: 'Pre-arrival shubha samaya readiness check.' },
            { time: '04:00 PM', description: 'Arrival at Kigga Temple and Poornakumbha Swagata.' },
            { time: '04:30 PM', description: 'Darshan and special pooja at the sanctum.' },
            { time: '05:30 PM', description: 'Ashirvachana and meeting with devotees.' }
        ] : [
            { time: '05:00 PM', description: 'Arrival at Raja Gopuram, Sringeri.' },
            { time: '05:30 PM', description: 'Poornakumbha Swagata and processional welcome.' },
            { time: '06:30 PM', description: 'Dharma Sabha and Anugraha Bhashana.' }
        ],
        highlightTitle: "TODAY | HIGHLIGHTS",
        highlights: isKiggaVisit ? [
            { time: '03:30 PM', description: 'Pre-arrival shubha samaya readiness check.' },
            { time: '04:00 PM', description: 'Arrival at Kigga Temple and Poornakumbha Swagata.' },
            { time: '04:30 PM', description: 'Darshan and special pooja at the sanctum.' },
            { time: '05:30 PM', description: 'Ashirvachana and meeting with devotees.' }
        ] : [
            { time: '05:00 PM', description: 'Arrival at Raja Gopuram, Sringeri.' },
            { time: '05:30 PM', description: 'Poornakumbha Swagata and processional welcome.' },
            { time: '06:30 PM', description: 'Dharma Sabha and Anugraha Bhashana.' }
        ]
    };

    const kiggaPlannerContent = `[·] Confirm Jagadguru arrival seva & reception krama
[·] Align mutt coordination & travel readiness
[·] Prepare darshan & movement path inside temple
[·] Confirm archaka & purohita availability
[·] Prepare alankara & minimal pooja samagri
[·] Inform temple trustees & senior sevaks
[·] Activate crowd seva & volunteer arrangement
[·] Coordinate prasad preparation (small batch)
[·] Ensure protocol & security alignment
[·] Conduct pre-arrival shubha samaya readiness check (3:30 PM)`;

    const sections: CanvasSection[] = [
        createSection('focus-vip', 'VIP Protocol Brief', JSON.stringify(vipData), 'text'),
        createPlannerSection(
            isKiggaVisit ? kiggaPlannerContent : '[·] Arrange Poornakumbha Swagata at Raja Gopuram\n[·] Coordinate Dhuli Pada Puja at Pravachana Mandiram\n[·] Ensure security clearance for devotee darshan line\n[·] Prepare Sanctum for special Mangala Arathi',
            isKiggaVisit ? 'Kigga Adhoc Visit Plan' : 'Poornakumbha Swagata Plan',
            'planner-jagadguru'
        )
    ];

    return {
        handled: true,
        sections,
        message: `I've prepared the ${isKiggaVisit ? 'Kigga visit' : 'Sringeri arrival'} briefing and planner actions for Jagadgurugalu.`,
        vipVisit
    };
}

/**
 * Handle Chandi Yaga queries
 */
function handleChandiYaga(query: string, lowercaseQuery: string): SpecialScenarioResult {
    if (!lowercaseQuery.includes('chandi') && !lowercaseQuery.includes('yaga') && !lowercaseQuery.includes('homa')) {
        return { handled: false };
    }

    const isFeb3rd = lowercaseQuery.includes('3rd feb') || lowercaseQuery.includes('february 3');

    if (isFeb3rd) {
        const vipData = {
            visitor: "Special Dignitaries & Devotees",
            title: "Sahasra Chandi Maha Yaga",
            dateTime: "3rd Feb, 2024 (7:00 AM - 1:00 PM)",
            location: "Main Yaga Shala / Temple Inner Courtyard",
            protocolLevel: "high",
            delegationSize: "Multiple VIP Groups",
            todayHighlights: [
                { time: '07:00 AM', description: 'Commencement of Sahasra Chandi Yaga with Maha Sankalpa and Avahana.' },
                { time: '09:00 AM', description: 'Ritwik Varanam and start of Maha Chandi Parayanam.' },
                { time: '11:00 AM', description: 'VIP participation in the Yaga and special darshan flow.' },
                { time: '12:30 PM', description: 'Maha Purnahuti, Deeparadhana, and Shanti Mantra Patha.' }
            ],
            highlightTitle: "FEBRUARY 3 | HIGHLIGHTS",
            highlights: [
                { time: '07:00 AM', description: 'Commencement of Sahasra Chandi Yaga with Maha Sankalpa and Avahana.' },
                { time: '09:00 AM', description: 'Ritwik Varanam and start of Maha Chandi Parayanam.' },
                { time: '11:00 AM', description: 'VIP participation in the Yaga and special darshan flow.' },
                { time: '12:30 PM', description: 'Maha Purnahuti, Deeparadhana, and Shanti Mantra Patha.' }
            ]
        };

        const sections: CanvasSection[] = [
            createSection('focus-yaga', 'Sahasra Chandi Maha Yaga Protocol', JSON.stringify(vipData), 'text'),
            createPlannerSection(
                '[·] Confirm seating for 50+ Vedic scholars\n[·] Secure Yaga Shala perimeter for VIP entry\n[·] Arrange for specialized ritual samagri (Chandi Homa specific)\n[·] Coordinate with Annadanam department for special Prasad distribution',
                'Yaga Preparation Plan',
                'planner-yaga'
            )
        ];

        return {
            handled: true,
            sections,
            message: "I've generated the Sahasra Chandi Maha Yaga protocol briefing and planning steps for Feb 3rd."
        };
    } else {
        const sections: CanvasSection[] = [
            createSection('focus-event', 'Event Brief: Sahasra Chandi Yaga', 'The Sahasra Chandi Maha Yaga is scheduled to commence at 7:00 AM tomorrow at the Yaga Shala. 108 Ritwiks have arrived. Purnahuti is scheduled for 12:30 PM on Sunday.', 'text'),
            createPlannerSection(
                '[·] Inspect Yaga Shala arrangements and seating\n[·] Verify stock of 500kg Ghee and 1000kg Samidha\n[·] Coordinate accommodation for 108 Ritwiks\n[·] Setup medical camp near North Gate',
                'Yaga Preparation',
                'planner-yaga'
            )
        ];

        return {
            handled: true,
            sections
        };
    }
}

/**
 * Handle Restoration/Project queries
 */
function handleRestoration(query: string, lowercaseQuery: string): SpecialScenarioResult {
    if (!lowercaseQuery.includes('restoration') && !lowercaseQuery.includes('project') && !lowercaseQuery.includes('renovation') && !lowercaseQuery.includes('infrastructure')) {
        return { handled: false };
    }

    const projectData = {
        title: "Gold Archak (Kavacha) Restoration",
        subTitle: "Status: Ongoing (65% Complete) | Deadline: Feb 20, 2024",
        highlightTitle: "PROJECT | RECENT MILESTONES",
        highlights: [
            { time: 'Jan 2', description: 'Primary cleaning and purification completed.' },
            { time: 'Jan 5', description: 'Gold plating of base structure initiated.' },
            { time: 'Today', description: 'Ready for stage-3 artisan review.' }
        ]
    };

    const sections: CanvasSection[] = [
        createSection('focus-project', 'Project Executive Brief', JSON.stringify(projectData), 'text'),
        createPlannerSection(
            `[·] Audit current gold stock and utilization
[·] Approve stage-3 artisan progress report
[·] Schedule security transfer of completed components
[·] Finalize sanctum closure window for installation
[·] Arrange documentation photography of progress`,
            'Restoration Milestones',
            'planner-project'
        )
    ];

    return {
        handled: true,
        sections,
        message: "Project status updated. I've added the restoration milestones to your planner."
    };
}

/**
 * Handle Navaratri/Festival queries
 */
function handleNavaratri(query: string, lowercaseQuery: string): SpecialScenarioResult {
    if (!lowercaseQuery.includes('navaratri') && !lowercaseQuery.includes('festival') && !lowercaseQuery.includes('dasara') && !lowercaseQuery.includes('sharannavarathri')) {
        return { handled: false };
    }

    const isSharadaNavaratri = lowercaseQuery.includes('sharada') || lowercaseQuery.includes('sharannavarathri');
    const isStatusQuery = lowercaseQuery.includes('progress') || lowercaseQuery.includes('status') || lowercaseQuery.startsWith('show') || lowercaseQuery.includes('view');
    const isNavaratriInfo = (lowercaseQuery.includes('navaratri') || lowercaseQuery.includes('festival')) && 
        (isInfoQuery(query) || isSummaryQuery(query) || lowercaseQuery.includes('prepare') || lowercaseQuery.includes('plan'));

    if (isSharadaNavaratri || isNavaratriInfo) {
        const festivalData = {
            visitor: "Special Festival Protocol",
            title: "Sharada Sharannavarathri",
            dateTime: "Upcoming: Ashwayuja Shukla Prathama",
            location: "Main Temple & Sringeri Town",
            protocolLevel: "maximum",
            delegationSize: "Lakhs of devotees",
            todayHighlights: [
                { time: 'Day 1', description: 'Sharada Sharannavarathri Prarambha, Kalasha Sthapana.' },
                { time: 'Day 7', description: 'Moola Nakshatra (Saraswati Avahana).' },
                { time: 'Day 10', description: 'Vijayadashami, Maha Rathotsava.' }
            ],
            highlightTitle: "FESTIVAL | HIGHLIGHTS",
            highlights: [
                { time: 'Day 1', description: 'Sharada Sharannavarathri Prarambha, Kalasha Sthapana.' },
                { time: 'Day 7', description: 'Moola Nakshatra (Saraswati Avahana).' },
                { time: 'Day 10', description: 'Vijayadashami, Maha Rathotsava.' }
            ]
        };

        const sections: CanvasSection[] = [
            createSection('focus-festival', 'Festival Event Brief', JSON.stringify(festivalData), 'text'),
            createPlannerSection(
                `[·] Verify Alankara schedule for all 10 days
[·] Finalize Annadanam procurement for 5L+ devotees
[·] Deploy additional 200 crowd control volunteers
[·] Setup temporary medical camps at 3 locations
[·] Coordinate with KSRTC for special bus services`,
                'Navaratri Execution Roadmap',
                'planner-festival'
            )
        ];

        return {
            handled: true,
            sections,
            message: "I've generated the Sharada Sharannavarathri execution roadmap and briefing."
        };
    } else {
        const sections: CanvasSection[] = [
            createSection('focus-summary', 'Navaratri Preparation Status', 'Overall preparation is 85% complete. The main Alankara for Day 1 is ready. Security barriers are installed. Annadanam supplies are stocked for the first 3 days.', 'text')
        ];

        if (!isStatusQuery) {
            sections.push(createPlannerSection(
                '[·] Final inspection of Queue Complex A\n[·] Review CCTV coverage with Police Commissioner\n[·] Distributors meeting for Prasadam counters\n[·] Electrical safety audit of illumination',
                'Festival Readiness',
                'planner-navaratri'
            ));
        }

        return {
            handled: true,
            sections,
            message: "Navaratri preparations are on track. Dashboard updated with current status."
        };
    }
}

/**
 * Handle CEO queries
 */
function handleCEO(query: string, lowercaseQuery: string): SpecialScenarioResult {
    if (!lowercaseQuery.includes('ceo') && !(lowercaseQuery.includes('appointment') && lowercaseQuery.includes('eo'))) {
        return { handled: false };
    }

    const isCEOAction = lowercaseQuery.includes('ask') || lowercaseQuery.includes('tell') || lowercaseQuery.includes('directive') || lowercaseQuery.includes('order');
    const dept = lowercaseQuery.includes('kitchen') ? 'Kitchen' : lowercaseQuery.includes('security') ? 'Security' : 'Admin';

    if (isCEOAction) {
        const sections: CanvasSection[] = [
            createSection(`focus-ceo-action-${Date.now()}`, `Executive Directive: ${dept}`, `CEO has directed the ${dept} department to ${query.split(' to ')[1] || 'respond immediately to current requirements'}. Tracking for completion by EOD.`, 'text'),
            createPlannerSection(
                `[·] Confirm receipt of directive by ${dept} head\n[·] Monitor ${dept} progress updates\n[·] Report completion to CEO office`,
                'Admin Follow-up',
                `planner-ceo-${Date.now()}`
            )
        ];

        return {
            handled: true,
            sections,
            message: `Directive issued to ${dept}. Tracking as high priority.`
        };
    } else {
        const ceoData = {
            visitor: "Sri V. R. Gowrishankar",
            title: "Executive Officer & CEO, Sringeri Mutt",
            dateTime: "Today: Office Hours (10:00 AM - 6:00 PM)",
            location: "Peetham Administrative Office",
            protocolLevel: "maximum",
            delegationSize: "Executive Staff",
            todayHighlights: [
                { time: '11:30 AM', description: 'Review of Navaratri preparation with HODs.' },
                { time: '03:00 PM', description: 'Meeting with District Administration (Protocol).' },
                { time: '05:00 PM', description: 'Financial audit final review.' }
            ],
            highlightTitle: "OFFICE | HIGHLIGHTS"
        };

        const sections: CanvasSection[] = [
            createSection('focus-ceo', 'CEO Office Briefing', JSON.stringify(ceoData), 'text')
        ];

        return {
            handled: true,
            sections,
            message: "CEO office briefing loaded. Dashboard shows today's high-level engagements."
        };
    }
}

/**
 * Handle Governor/VVIP queries (general)
 */
function handleGovernorVVIP(query: string, lowercaseQuery: string): SpecialScenarioResult {
    if (!lowercaseQuery.includes('governor') && !(lowercaseQuery.includes('minister') && !lowercaseQuery.includes('prime minister')) && !lowercaseQuery.includes('cm') && !lowercaseQuery.includes('vvip')) {
        return { handled: false };
    }

    const visitorName = lowercaseQuery.includes('governor') ? "Governor of Karnataka" : "Hon'ble Minister";
    const protocolData = {
        visitor: visitorName,
        title: "State Guest Protocol",
        dateTime: "Confirmed: 12th Feb, 2024 at 11:00 AM",
        location: "Helipad / Raja Gopuram Entrance",
        protocolLevel: "maximum",
        delegationSize: "~15 persons + security",
        leadEscort: "CEO / Executive Officer",
        securityStatus: "Z-Category / Local Police Liaison",
        todayHighlights: [
            { time: '10:30 AM', description: `Pre-arrival security sweep by local police.` },
            { time: '11:00 AM', description: `Arrival and reception by Peetham CEO.` },
            { time: '11:30 AM', description: `Temple Darshan and Ashirvada.` },
            { time: '12:30 PM', description: `Lunch at Special VIP Guesthouse.` }
        ],
        highlightTitle: "PROTOCOL | HIGHLIGHTS"
    };

    const sections: CanvasSection[] = [
        createSection('focus-vvip', 'VVIP Visit Protocol', JSON.stringify(protocolData), 'text'),
        createPlannerSection(
            `[·] Coordinate with District Police for pilot & escort\n[·] Brief Sringeri protocol officers on guest profile\n[·] Secure private darshan window (30 mins)\n[·] Confirm special prasadam & shalu arrangements`,
            'State Guest Protocol',
            'planner-vvip'
        )
    ];

    return {
        handled: true,
        sections,
        message: `I've prepared the protocol briefing and planner actions for the ${visitorName}'s visit.`
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
    const focusContent = 'You have 3 high-priority approvals pending for the Gold Kavacha restoration. Delay may impact the upcoming festival schedule.';

    const sections: CanvasSection[] = [
        createSection('focus-approval', 'Approval Briefing', focusContent, 'text')
    ];

    if (!isViewOnly) {
        sections.push(createPlannerSection(
            '[·] Review Priest\'s technical request\n[·] Verify insurance coverage extension\n[·] Confirm artisan availability for Jan 15',
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
    else if (lowercaseQuery.includes('event') || lowercaseQuery.includes('yaga')) cardType = 'event';
    else if (lowercaseQuery.includes('ritual') || lowercaseQuery.includes('pooja')) cardType = 'ritual';

    const subject = query.replace(/^(schedule|review|plan)\s+/i, '').split(' on ')[0].split(' at ')[0];

    const cardData = {
        type: cardType,
        subject: subject.charAt(0).toUpperCase() + subject.slice(1),
        dateTime: "Tomorrow, 10:00 AM",
        intent: "Align key stakeholders on execution roadmap and identify blockers.",
        plannedBy: "Temple CEO",
        visibility: "Executive"
    };

    const sections: CanvasSection[] = [
        createSection('focus-ceo-card', 'Executive Plan', JSON.stringify(cardData), 'text')
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
    if (cleanDirective.toLowerCase().includes('security') || cleanDirective.toLowerCase().includes('guard')) dept = 'Security';
    else if (cleanDirective.toLowerCase().includes('finance') || cleanDirective.toLowerCase().includes('money')) dept = 'Finance';
    else if (cleanDirective.toLowerCase().includes('priest') || cleanDirective.toLowerCase().includes('ritual')) dept = 'Rituals';

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
 * Handle Governor Karnataka specific queries
 */
function handleGovernorKarnataka(query: string, lowercaseQuery: string): SpecialScenarioResult {
    if (!lowercaseQuery.includes('governor') || (!lowercaseQuery.includes('karnataka') && !lowercaseQuery.includes('visit'))) {
        return { handled: false };
    }

    const vipData = {
        visitor: "Thawar Chand Gehlot",
        title: "Governor of Karnataka",
        dateTime: "15th Jan, 2024 at 11:30 AM",
        location: "Main Entrance (Raja Gopuram)",
        protocolLevel: "high",
        delegationSize: "~12 persons",
        todayHighlights: [
            { time: '11:00 AM', description: 'Pre-arrival security sweep of Raj Niwas Guest House.' },
            { time: '11:30 AM', description: 'Arrival at Raja Gopuram and ceremonial welcome.' },
            { time: '12:00 PM', description: 'Special Darshan at Sri Sharadamba Temple.' },
            { time: '01:00 PM', description: 'Lunch at Executive Guest House with Temple Trust.' }
        ],
        highlightTitle: "JANUARY 15 | HIGHLIGHTS",
        highlights: [
            { time: '11:00 AM', description: 'Pre-arrival security sweep of Raj Niwas Guest House.' },
            { time: '11:30 AM', description: 'Arrival at Raja Gopuram and ceremonial welcome.' },
            { time: '12:00 PM', description: 'Special Darshan at Sri Sharadamba Temple.' },
            { time: '01:00 PM', description: 'Lunch at Executive Guest House with Temple Trust.' }
        ]
    };

    const sections: CanvasSection[] = [
        createSection('focus-vip', 'VIP Protocol Brief: Governor Visit', JSON.stringify(vipData), 'text'),
        createPlannerSection(
            `[·] Coordinate with Raj Bhavan protocol office
[·] Arrange Z-category security escort from entry
[·] Reserve Executive Guest House for lunch
[·] Prepare Poornakumbha Swagata at main gate
[·] Ensure media-free corridor during darshan`,
            'Governor Protocol Plan',
            'planner-governor'
        )
    ];

    return {
        handled: true,
        sections,
        message: "I've prepared the protocol briefing and planner actions for the Governor's visit."
    };
}

