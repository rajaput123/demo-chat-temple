import { useState, useEffect, useCallback, useRef } from 'react';
import { QueryParserService } from '@/services/queryParserService';
import { VIPPlannerService } from '@/services/vipPlannerService';
import { DataLookupService } from '@/services/dataLookupService';
import { FlexibleQueryParser } from '@/services/flexibleQueryParser';
import { ParsedVIPVisit } from '@/types/vip';
import { SpecialQueryHandler } from '@/services/specialQueryHandler';
import { QuickActionHandler } from '@/services/quickActionHandler';
import { ModuleDetector, ModuleName } from '@/services/moduleDetector';
// Import new handlers
import { handleModuleDetection } from '@/services/handlers/moduleDetectionHandler';
import { handleInventoryCheck } from '@/services/handlers/inventoryCheckHandler';
import { handlePlannerAdd } from '@/services/handlers/plannerAddHandler';
import { handleSpecialScenario } from '@/services/handlers/specialScenarioHandler';
import { handleRecommendation } from '@/services/handlers/recommendationHandler';
import { handleInfoQuery } from '@/services/handlers/infoQueryHandler';
import { handleVIPQuery } from '@/services/handlers/vipQueryHandler';
import { handlePlannerRequest } from '@/services/handlers/plannerRequestHandler';
import { handleDataLookup } from '@/services/handlers/dataLookupHandler';
import { handleSimpleQuery } from '@/services/handlers/simpleQueryHandler';
// Import utilities
import { generatePlannerActionsFromQuery, parseActionsFromQuery } from '@/utils/plannerHelpers';
import { isInfoQuery, isSummaryQuery, isPlannerRequest, normalizeQuery, isInformationalQuery } from '@/utils/queryHelpers';
import { replaceFocusCards, addSections, filterFocusCards, findPlannerSection, mergePlannerSections } from '@/services/sectionManager';

export type SimulationStatus = 'idle' | 'generating' | 'complete';

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    text: string;
    fullText?: string; // Full text for typewriter effect
    isTyping?: boolean; // Whether to show typewriter effect
}

export interface CanvasSection {
    id: string;
    title: string;
    subTitle?: string;
    content: string; // The full content
    type: 'text' | 'list' | 'steps' | 'components';
    visibleContent: string; // What is currently shown (typewriter)
    isVisible: boolean; // Has the section started appearing?
}

export interface UseSimulationOptions {
    onVIPVisitParsed?: (visit: ParsedVIPVisit) => void;
    onModuleDetected?: (module: ModuleName) => void;
}

export function useSimulation(options?: UseSimulationOptions) {
    // Store module detection callback
    const moduleDetectionCallback = options?.onModuleDetected;
    
    const [status, setStatus] = useState<SimulationStatus>('idle');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [sections, setSections] = useState<CanvasSection[]>([]);

    const [currentSectionIndex, setCurrentSectionIndex] = useState(-1);
    const [typingIndex, setTypingIndex] = useState(0);
    const planningMessageShownRef = useRef(false);

    // Helper to add messages
    const addMessage = useCallback((role: 'user' | 'assistant' | 'system', text: string, enableTypewriter: boolean = false) => {
        const messageId = Math.random().toString(36).substr(2, 9);
        if (enableTypewriter && role === 'assistant') {
            // For typewriter effect, start with empty text and store full text
            setMessages(prev => [...prev, {
                id: messageId,
                role,
                text: '',
                fullText: text,
                isTyping: true
            }]);
        } else {
            // For user/system messages or non-typewriter, show immediately
            setMessages(prev => [...prev, {
                id: messageId,
                role,
                text,
                isTyping: false
            }]);
        }
    }, []);


    const startSimulation = useCallback((query: string = 'Create onboarding workflow', options?: { isRecommendation?: boolean; displayQuery?: string; onVIPVisitParsed?: (vip: any) => void; onModuleDetected?: (module: ModuleName) => void }) => {
        const lowercaseQuery = query.toLowerCase();

        // Normalize query and options
        const { cleanQuery, isRecommendation } = normalizeQuery(query);
        const displayQuery = options?.displayQuery || cleanQuery;

        // Set status and add user message for all queries
        setStatus('generating');
        addMessage('user', displayQuery);

        // Handler 1: Module Detection (highest priority)
        const moduleResult = handleModuleDetection(query);
        if (moduleResult.handled && moduleResult.module) {
            const callback = options?.onModuleDetected || moduleDetectionCallback;
            if (callback) {
                callback(moduleResult.module);
            }
            setTimeout(() => {
                if (moduleResult.message) {
                    addMessage('assistant', moduleResult.message, true);
                }
                setStatus('complete');
            }, 500);
            return;
        }

        // Handler 1.5: Simple Query Handler (plan, summary, complete information, next information)
        const simpleResult = handleSimpleQuery(query, sections);
        if (simpleResult.handled) {
            const newSections: CanvasSection[] = [];
            
            // Add info section (top - focus area)
            if (simpleResult.infoSection) {
                newSections.push(simpleResult.infoSection);
            }
            
            // Add action section (bottom - planner)
            if (simpleResult.actionSection) {
                newSections.push(simpleResult.actionSection);
            }
            
            setTimeout(() => {
                setSections(prev => replaceFocusCards(prev, newSections));
                setTimeout(() => {
                    setCurrentSectionIndex(0);
                    setTypingIndex(0);
                }, 100);
                addMessage('assistant', simpleResult.chatMessage, true);
            }, 600);
            return;
        }

        // Handler 2: Special Query Handler (existing)
        const specialResult = SpecialQueryHandler.handleQuery(query, options?.onVIPVisitParsed);
        if (specialResult) {
            const newSections: CanvasSection[] = [
                {
                    id: specialResult.sectionId,
                    title: specialResult.cardTitle,
                    content: specialResult.infoCardData,
                    type: 'text',
                    visibleContent: '',
                    isVisible: false
                },
                {
                    id: `planner-${specialResult.sectionId.replace('focus-', '')}`,
                    title: 'Your Planner Actions',
                    subTitle: specialResult.planTitle,
                    content: specialResult.plannerActions,
                    type: 'list',
                    visibleContent: '',
                    isVisible: false
                }
            ];

            setTimeout(() => {
                setSections(prev => replaceFocusCards(prev, newSections));
                setTimeout(() => {
                    setCurrentSectionIndex(0);
                    setTypingIndex(0);
                }, 100);
                addMessage('assistant', "I've prepared the briefing and planner actions.", true);
            }, 600);
            return;
        }

        // Handler 3: Quick Action Handler (existing)
        const quickActionResult = QuickActionHandler.handleQuery(query);
        if (quickActionResult) {
            const newSections: CanvasSection[] = [{
                id: quickActionResult.sectionId,
                title: quickActionResult.sectionTitle,
                content: 'Loading...',
                type: 'components',
                visibleContent: '',
                isVisible: false
            }];

            // Handle actionable finance queries separately
            if (quickActionResult.sectionId === 'focus-finance' && lowercaseQuery.includes('approve')) {
                newSections[0] = {
                    id: 'focus-finance',
                    title: 'Morning Revenue Analysis',
                    content: 'Today\'s collections are 18% higher than the 30-day average.',
                    type: 'text',
                    visibleContent: '',
                    isVisible: false
                };
                newSections.push({
                    id: 'finance-actions',
                    title: 'Your Planner Actions',
                    content: '[·] Move ₹15L to Endowment Fund\n[·] Audit North Gate UPI scanner logs',
                    type: 'list',
                    visibleContent: '',
                    isVisible: false
                });
            }

            setTimeout(() => {
                setSections(prev => replaceFocusCards(prev, newSections));
                setTimeout(() => {
                    setCurrentSectionIndex(0);
                    setTypingIndex(0);
                }, 100);
                addMessage('assistant', quickActionResult.responseMessage, true);
            }, 600);
            return;
        }

        // Handler 4: Inventory Check Handler
        const inventoryResult = handleInventoryCheck(query);
        if (inventoryResult.handled && inventoryResult.response) {
            setTimeout(() => {
                addMessage('assistant', inventoryResult.response!, true);
                setStatus('complete');
            }, 1200);
            return;
        }

        // Handler 5: Planner Add Handler
        const plannerAddResult = handlePlannerAdd(query);
        if (plannerAddResult.handled && plannerAddResult.itemToAdd) {
            const itemToAdd = plannerAddResult.itemToAdd;
            setSections(prev => {
                const plannerIndex = prev.findIndex(s => s.title === 'Your Planner Actions');
                if (plannerIndex >= 0) {
                    const planner = prev[plannerIndex];
                    const newContent = planner.content ? `${planner.content}\n[·] ${itemToAdd}` : `[·] ${itemToAdd}`;
                    const updated = [...prev];
                    updated[plannerIndex] = {
                        ...planner,
                        content: newContent,
                        visibleContent: planner.visibleContent,
                        isVisible: true
                    };
                    setTimeout(() => {
                        setTypingIndex(planner.visibleContent.length);
                        setCurrentSectionIndex(plannerIndex);
                    }, 0);
                    return updated;
                } else {
                    const newPlanner: CanvasSection = {
                        id: `planner-actions-${Date.now()}`,
                        title: 'Your Planner Actions',
                        content: `[·] ${itemToAdd}`,
                        type: 'list',
                        visibleContent: '',
                        isVisible: false
                    };
                    const newPlannerIndex = prev.length;
                    setTimeout(() => {
                        setTypingIndex(0);
                        setCurrentSectionIndex(newPlannerIndex);
                    }, 0);
                    return [...prev, newPlanner];
                }
            });
            setTimeout(() => {
                addMessage('assistant', `Adding "${itemToAdd}" to your plan...`, true);
            }, 400);
            return;
        }

        // Define intent flags for remaining handlers
        let newSections: CanvasSection[] = [];

        // Handler 6: Info Query Handler (moved earlier to catch info queries before other handlers)
        // Check info queries early to ensure they generate canvas sections
        if ((isInfoQuery(query) || isSummaryQuery(query)) && newSections.length === 0) {
            const infoResult = handleInfoQuery(query);
            if (infoResult.handled) {
                // Set status to generating first to trigger typewriter effect
                setStatus('generating');
                
                setTimeout(() => {
                    if (infoResult.response) {
                        addMessage('assistant', infoResult.response, true);
                    }
                    if (infoResult.sections && infoResult.sections.length > 0) {
                        setSections(prev => {
                            // Use replaceFocusCards for info sections (they should replace focus area)
                            const hasInfoSection = infoResult.sections!.some(s => s.id.startsWith('focus-info-'));
                            if (hasInfoSection) {
                                return replaceFocusCards(prev, infoResult.sections!);
                            }
                            return addSections(prev, infoResult.sections!);
                        });
                        setTimeout(() => {
                            // Start typewriter effect from first section
                            // For focus sections, immediately set visibleContent
                            setSections(prev => prev.map((s, i) => {
                                if (s.id.startsWith('focus-')) {
                                    return { ...s, isVisible: true, visibleContent: s.content };
                                }
                                return s;
                            }));
                            setCurrentSectionIndex(0);
                            setTypingIndex(0);
                        }, 100);
                    } else {
                        // No sections, mark as complete
                        setStatus('complete');
                    }
                }, 600);
                return;
            }
        }

        // Handler 7: Special Scenario Handler
        const specialScenarioResult = handleSpecialScenario(query, options);
        if (specialScenarioResult.handled && specialScenarioResult.sections) {
            newSections = specialScenarioResult.sections;
            if (specialScenarioResult.vipVisit && options?.onVIPVisitParsed) {
                options.onVIPVisitParsed(specialScenarioResult.vipVisit);
            }
            if (specialScenarioResult.message) {
                addMessage('assistant', specialScenarioResult.message, true);
            }
        } else if (isRecommendation) {
            // Handler 7: Recommendation Handler
            const isKiggaVisit = lowercaseQuery.includes('kigga');

            if (options?.onVIPVisitParsed) {
                options.onVIPVisitParsed({
                    visitor: "Jagadguru Sri Sri Vidhushekhara Bharati Sannidhanam",
                    title: "Pontiff of Sringeri Sharada Peetham",
                    date: isKiggaVisit ? new Date() : new Date(new Date().setDate(new Date().getDate() + 1)),
                    time: isKiggaVisit ? "16:00" : "17:00",
                    location: isKiggaVisit ? "Kigga" : "Main Entrance (Raja Gopuram)",
                    protocolLevel: "maximum",
                    confidence: 1.0
                });
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

            newSections = [
                {
                    id: 'focus-vip',
                    title: 'VIP Protocol Brief',
                    content: JSON.stringify(vipData),
                    type: 'text',
                    visibleContent: '',
                    isVisible: false
                },
                {
                    id: 'planner-jagadguru',
                    title: 'Your Planner Actions',
                    subTitle: isKiggaVisit ? 'Kigga Adhoc Visit Plan' : 'Poornakumbha Swagata Plan',
                    content: isKiggaVisit ? kiggaPlannerContent : '[·] Arrange Poornakumbha Swagata at Raja Gopuram\n[·] Coordinate Dhuli Pada Puja at Pravachana Mandiram\n[·] Ensure security clearance for devotee darshan line\n[·] Prepare Sanctum for special Mangala Arathi',
                    type: 'list',
                    visibleContent: '',
                    isVisible: false
                }
            ];
            addMessage('assistant', `I've prepared the ${isKiggaVisit ? 'Kigga visit' : 'Sringeri arrival'} briefing and planner actions for Jagadgurugalu.`, true);

        } else if (lowercaseQuery.includes('chandi') || lowercaseQuery.includes('yaga') || lowercaseQuery.includes('homa')) {
            // Sahasra Chandi Yaga logic
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

                newSections = [
                    {
                        id: 'focus-yaga',
                        title: 'Sahasra Chandi Maha Yaga Protocol',
                        content: JSON.stringify(vipData),
                        type: 'text',
                        visibleContent: '',
                        isVisible: false
                    },
                    {
                        id: 'planner-yaga',
                        title: 'Your Planner Actions',
                        subTitle: 'Yaga Preparation Plan',
                        content: '[·] Confirm seating for 50+ Vedic scholars\n[·] Secure Yaga Shala perimeter for VIP entry\n[·] Arrange for specialized ritual samagri (Chandi Homa specific)\n[·] Coordinate with Annadanam department for special Prasad distribution',
                        type: 'list',
                        visibleContent: '',
                        isVisible: false
                    }
                ];
                addMessage('assistant', "I've generated the Sahasra Chandi Maha Yaga protocol briefing and planning steps for Feb 3rd.", true);
            }

        } else if (lowercaseQuery.includes('restoration') || lowercaseQuery.includes('project') || lowercaseQuery.includes('renovation')) {
            // Project Restoration Logic
            const projectData = {
                visitor: "Project Management Office",
                title: "Temple Restoration Project",
                dateTime: "Phase 1: Construction & Conservation",
                location: "Sharada Temple North Wing",
                protocolLevel: "standard",
                delegationSize: "25 members crew",
                todayHighlights: [
                    { time: '10:00 AM', description: 'Daily site inspection and safety briefing.' },
                    { time: '02:00 PM', description: 'Architectural review of stone carving progress.' },
                    { time: '04:00 PM', description: 'Material audit and procurement update for next week.' }
                ],
                highlightTitle: "PROJECT | HIGHLIGHTS",
                highlights: [
                    { time: 'Phase 1', description: 'Foundation reinforcement and heritage stone cleaning.' },
                    { time: 'Phase 2', description: 'Intricate wood carving and roof restoration.' },
                    { time: 'Phase 3', description: 'Final painting, lighting, and consecration prep.' }
                ]
            };

            newSections = [
                {
                    id: 'focus-project',
                    title: 'Project Executive Brief',
                    content: JSON.stringify(projectData),
                    type: 'text',
                    visibleContent: '',
                    isVisible: false
                },
                {
                    id: 'planner-project',
                    title: 'Your Planner Actions',
                    subTitle: 'Restoration Milestones',
                    content: '[·] Review architectural blueprints for North Wing\n[·] Approve granite supply from authorized quarries\n[·] Schedule weekly project review meeting with CEO\n[·] Coordinate with Archeology Dept for heritage preservation standards',
                    type: 'list',
                    visibleContent: '',
                    isVisible: false
                }
            ];
            addMessage('assistant', "Project status updated. I've added the restoration milestones to your planner.", true);

        } else if (lowercaseQuery.includes('navaratri') || lowercaseQuery.includes('festival')) {
            // Navaratri Logic - check if info/summary or prepare/plan
            const isNavaratriInfo = (lowercaseQuery.includes('navaratri') || lowercaseQuery.includes('festival')) && (isInfoQuery || isSummaryQuery || lowercaseQuery.includes('prepare') || lowercaseQuery.includes('plan'));

            if (isNavaratriInfo) {
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

                newSections = [
                    {
                        id: 'focus-festival',
                        title: 'Festival Event Brief',
                        content: JSON.stringify(festivalData),
                        type: 'text',
                        visibleContent: '',
                        isVisible: false
                    },
                    {
                        id: 'planner-festival',
                        title: 'Your Planner Actions',
                        subTitle: 'Navaratri Execution Roadmap',
                        content: `[·] Verify Alankara schedule for all 10 days
[·] Finalize Annadanam procurement for 5L+ devotees
[·] Deploy additional 200 crowd control volunteers
[·] Setup temporary medical camps at 3 locations
[·] Coordinate with KSRTC for special bus services`,
                        type: 'list',
                        visibleContent: '',
                        isVisible: false
                    }
                ];
                addMessage('assistant', "I've generated the Sharada Sharannavarathri execution roadmap and briefing.", true);
            } else {
                newSections = [
                    {
                        id: 'focus-summary',
                        title: 'Navaratri Preparation Status',
                        content: 'Overall preparation is 85% complete. The main Alankara for Day 1 is ready. Security barriers are installed. Annadanam supplies are stocked for the first 3 days.',
                        type: 'text',
                        visibleContent: '',
                        isVisible: false
                    }
                ];
                addMessage('assistant', "Navaratri preparations are on track. Dashboard updated with current status.", true);
            }

        } else if (lowercaseQuery.includes('ceo') || (lowercaseQuery.includes('appointment') && lowercaseQuery.includes('eo'))) {
            // CEO Intent - Info or Action
            const isCEOAction = lowercaseQuery.includes('ask') || lowercaseQuery.includes('tell') || lowercaseQuery.includes('directive') || lowercaseQuery.includes('order');
            const dept = lowercaseQuery.includes('kitchen') ? 'Kitchen' : lowercaseQuery.includes('security') ? 'Security' : 'Admin';

            if (isCEOAction) {
                newSections = [
                    {
                        id: `focus-ceo-action-${Date.now()}`,
                        title: `Executive Directive: ${dept}`,
                        content: `CEO has directed the ${dept} department to ${query.split(' to ')[1] || 'respond immediately to current requirements'}. Tracking for completion by EOD.`,
                        type: 'text',
                        visibleContent: '',
                        isVisible: false
                    },
                    {
                        id: `planner-ceo-${Date.now()}`,
                        title: 'Your Planner Actions',
                        subTitle: 'Admin Follow-up',
                        content: `[·] Confirm receipt of directive by ${dept} head\n[·] Monitor ${dept} progress updates\n[·] Report completion to CEO office`,
                        type: 'list',
                        visibleContent: '',
                        isVisible: false
                    }
                ];
                addMessage('assistant', `Directive issued to ${dept}. Tracking as high priority.`, true);
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

                newSections = [
                    {
                        id: 'focus-ceo',
                        title: 'CEO Office Briefing',
                        content: JSON.stringify(ceoData),
                        type: 'text',
                        visibleContent: '',
                        isVisible: false
                    }
                ];
                addMessage('assistant', "CEO office briefing loaded. Dashboard shows today's high-level engagements.", true);
            }

        } else if (lowercaseQuery.includes('governor') || (lowercaseQuery.includes('minister') && !lowercaseQuery.includes('prime minister')) || lowercaseQuery.includes('cm') || lowercaseQuery.includes('vvip')) {
            // VVIP / Governor visit (but not Prime Minister - that's handled by VIP visit parser)
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

            newSections = [
                {
                    id: 'focus-vvip',
                    title: 'VVIP Visit Protocol',
                    content: JSON.stringify(protocolData),
                    type: 'text',
                    visibleContent: '',
                    isVisible: false
                },
                {
                    id: 'planner-vvip',
                    title: 'Your Planner Actions',
                    subTitle: 'State Guest Protocol',
                    content: `[·] Coordinate with District Police for pilot & escort\n[·] Brief Sringeri protocol officers on guest profile\n[·] Secure private darshan window (30 mins)\n[·] Confirm special prasadam & shalu arrangements`,
                    type: 'list',
                    visibleContent: '',
                    isVisible: false
                }
            ];
            addMessage('assistant', `I've prepared the protocol briefing and planner actions for the ${visitorName}'s visit.`, true);
        } else if (isRecommendation) {
            // 4. Recommendation Click (No Canvas Update)
            // User message already added at start
            setTimeout(() => {
                let response = "I've noted this requirement. I'll flag any potential conflicts with the existing schedule.";
                const effectiveLowercaseQuery = lowercaseQuery;

                // Check for flexible query parsing FIRST (planning, actions, kitchen) - before general status setting
                const planningQuery = FlexibleQueryParser.parsePlanningQuery(query);
                const actionQuery = FlexibleQueryParser.parseActionQuery(query);
                const kitchenQuery = FlexibleQueryParser.parseKitchenQuery(query);

                if (planningQuery) {
                    // User message already added at start

                    setTimeout(() => {
                        let plannerActions = '';

                        if (planningQuery.type === 'adhoc-visit') {
                            // Get location data from mock data
                            const locationData = DataLookupService.searchLocations(query);
                            const locationInfo = locationData.data.length > 0 ? locationData.data[0] : null;

                            // Parse time to generate highlights
                            let visitTime = '04:00 PM';
                            if (planningQuery.time) {
                                visitTime = planningQuery.time;
                            }

                            // Generate highlights based on visit time
                            const timeParts = visitTime.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)/i);
                            let hour24 = 16;
                            let minute = 0;
                            let period = 'PM';
                            if (timeParts) {
                                const hour12 = parseInt(timeParts[1]);
                                minute = timeParts[2] ? parseInt(timeParts[2]) : 0;
                                period = timeParts[3].toUpperCase();
                                hour24 = hour12;
                                if (period === 'PM' && hour12 !== 12) hour24 = hour12 + 12;
                                if (period === 'AM' && hour12 === 12) hour24 = 0;
                            }

                            // Format time helper - convert 24h to 12h format
                            const formatTime = (h24: number, m: number, originalPeriod: string) => {
                                let h12 = h24;
                                let period = originalPeriod;
                                if (h24 > 12) {
                                    h12 = h24 - 12;
                                    period = 'PM';
                                } else if (h24 === 0) {
                                    h12 = 12;
                                    period = 'AM';
                                } else if (h24 === 12) {
                                    h12 = 12;
                                    period = 'PM';
                                } else {
                                    period = 'AM';
                                }
                                return `${h12}:${String(m).padStart(2, '0')} ${period}`;
                            };

                            // Create rich card data for adhoc visit
                            const visitCardData = {
                                visitor: planningQuery.person || "Jagadgurugalu",
                                title: "Spiritual Visit",
                                dateTime: `${planningQuery.date || 'Today'} at ${visitTime}`,
                                location: planningQuery.location || "Destination",
                                protocolLevel: "maximum",
                                delegationSize: "~20 persons",
                                leadEscort: "Executive Officer",
                                securityStatus: "Briefed & Ready",
                                todayHighlights: [
                                    {
                                        time: formatTime((hour24 - 1 + 24) % 24, minute, period),
                                        description: 'Pre-arrival shubha samaya readiness check and final preparations.'
                                    },
                                    {
                                        time: visitTime,
                                        description: `Arrival at ${planningQuery.location || 'destination'} and Poornakumbha Swagata.`
                                    },
                                    {
                                        time: formatTime((hour24 + 1) % 24, minute, period),
                                        description: 'Darshan and special pooja at the sanctum.'
                                    },
                                    {
                                        time: formatTime((hour24 + 2) % 24, minute, period),
                                        description: 'Ashirvachana and meeting with devotees.'
                                    }
                                ],
                                highlightTitle: "TODAY | HIGHLIGHTS"
                            };

                            // Create focus-visit section
                            const visitCardSection: CanvasSection = {
                                id: `focus-visit-${Date.now()}`,
                                title: 'Visit Protocol Brief',
                                content: JSON.stringify(visitCardData),
                                type: 'text',
                                visibleContent: '',
                                isVisible: true
                            };

                            plannerActions = `[·] Coordinate travel arrangements for ${planningQuery.person || 'Jagadguru'} to ${planningQuery.location || 'destination'}\n`;
                            plannerActions += `[·] Arrange security and protocol for the visit\n`;
                            plannerActions += `[·] Prepare welcome arrangements at ${planningQuery.location || 'destination'}\n`;
                            if (locationInfo && locationInfo.description) {
                                plannerActions += `[·] Review location details: ${locationInfo.description}\n`;
                            }
                            plannerActions += `[·] Coordinate with local temple authorities\n`;
                            plannerActions += `[·] Arrange accommodation if needed\n`;
                            plannerActions += `[·] Notify security department about the visit\n`;
                            if (planningQuery.date) {
                                plannerActions += `[·] Confirm visit date: ${planningQuery.date}\n`;
                            }
                            if (planningQuery.time) {
                                plannerActions += `[·] Schedule arrival time: ${planningQuery.time}\n`;
                            }
                            plannerActions += `[·] Prepare special prasad for the visit\n`;
                            plannerActions += `[·] Arrange media coverage if required\n`;

                            // Add visit card section first, then planner
                            setSections(prev => {
                                const plannerIndex = prev.findIndex(s => s.title === 'Your Planner Actions');
                                const updated = [...prev, visitCardSection];

                                const newPlanner: CanvasSection = {
                                    id: `planner-${Date.now()}`,
                                    title: 'Your Planner Actions',
                                    subTitle: 'Visit Plan',
                                    content: plannerActions,
                                    type: 'list',
                                    visibleContent: '',
                                    isVisible: true
                                };

                                if (plannerIndex >= 0) {
                                    const existingContent = prev[plannerIndex].content || '';
                                    const existingVisibleContent = prev[plannerIndex].visibleContent || '';
                                    const newContent = existingContent ? `${existingContent}\n${plannerActions}` : plannerActions;
                                    updated[plannerIndex] = {
                                        ...prev[plannerIndex],
                                        content: newContent,
                                        visibleContent: existingVisibleContent,
                                        isVisible: true
                                    };

                                    // Set up typewriter for visit card first, then planner
                                    const visitCardIndex = updated.length - 1;
                                    setTimeout(() => {
                                        setCurrentSectionIndex(visitCardIndex);
                                        setTypingIndex(0);
                                    }, 100);

                                    return updated;
                                } else {
                                    const newPlannerIndex = updated.length;
                                    updated.push(newPlanner);

                                    // Set up typewriter for visit card first, then planner
                                    const visitCardIndex = updated.length - 2;
                                    setTimeout(() => {
                                        setCurrentSectionIndex(visitCardIndex);
                                        setTypingIndex(0);
                                    }, 100);

                                    return updated;
                                }
                            });

                            addMessage('assistant', `I've created a plan for the visit. Check your planner actions.`, true); // Enable typewriter
                            return;
                        } else if (planningQuery.type === 'event-planning') {
                            // Get event data from mock data
                            const eventData = DataLookupService.searchEvents(query);
                            const eventInfo = eventData.data.length > 0 ? eventData.data[0] : null;

                            // Create rich card data for event planning
                            const eventCardData = {
                                visitor: "Special Event",
                                title: planningQuery.eventType || "Event",
                                dateTime: `${planningQuery.date || 'TBD'} at ${eventInfo?.time || 'TBD'}`,
                                location: eventInfo?.location || "Main Temple Complex",
                                protocolLevel: planningQuery.vipAssociation ? "high" : "standard",
                                delegationSize: planningQuery.vipAssociation ? "Multiple VIP Groups" : "~100 persons",
                                leadEscort: planningQuery.vipAssociation ? "Executive Officer" : "Ritual Department",
                                securityStatus: planningQuery.vipAssociation ? "Briefed & Ready" : "Standard Protocol",
                                todayHighlights: eventInfo ? [
                                    { time: '07:00 AM', description: `Commencement of ${planningQuery.eventType || 'event'} with Maha Sankalpa.` },
                                    { time: '09:00 AM', description: 'Ritwik Varanam and start of main rituals.' },
                                    { time: '11:00 AM', description: planningQuery.vipAssociation ? 'VIP participation in the event and special darshan flow.' : 'Main event proceedings.' },
                                    { time: '12:30 PM', description: 'Purnahuti, Deeparadhana, and Shanti Mantra Patha.' }
                                ] : [
                                    { time: 'Morning', description: `Preparation for ${planningQuery.eventType || 'event'}.` },
                                    { time: 'Midday', description: 'Main event proceedings.' },
                                    { time: 'Evening', description: 'Conclusion and prasad distribution.' }
                                ],
                                highlightTitle: planningQuery.date ? `${planningQuery.date.toUpperCase()} | HIGHLIGHTS` : "TODAY | HIGHLIGHTS"
                            };

                            // Create focus-event section
                            const eventCardSection: CanvasSection = {
                                id: `focus-event-${Date.now()}`,
                                title: 'Event Protocol Brief',
                                content: JSON.stringify(eventCardData),
                                type: 'text',
                                visibleContent: '',
                                isVisible: true
                            };

                            plannerActions = `[·] Prepare ${planningQuery.eventType || 'event'} arrangements\n`;
                            plannerActions += `[·] Coordinate with ritual department for ${planningQuery.eventType || 'event'}\n`;
                            if (planningQuery.date) {
                                plannerActions += `[·] Confirm event date: ${planningQuery.date}\n`;
                            }
                            if (planningQuery.vipAssociation) {
                                plannerActions += `[·] Arrange VIP protocol and security\n`;
                                plannerActions += `[·] Coordinate VIP invitations\n`;
                                plannerActions += `[·] Prepare special arrangements for VIP guests\n`;
                            }
                            plannerActions += `[·] Arrange special prasad preparation\n`;
                            plannerActions += `[·] Coordinate media and documentation if needed\n`;

                            // Add event card section first, then planner
                            setSections(prev => {
                                const plannerIndex = prev.findIndex(s => s.title === 'Your Planner Actions');
                                const updated = [...prev, eventCardSection];

                                const newPlanner: CanvasSection = {
                                    id: `planner-${Date.now()}`,
                                    title: 'Your Planner Actions',
                                    subTitle: 'Event Plan',
                                    content: plannerActions,
                                    type: 'list',
                                    visibleContent: '',
                                    isVisible: true
                                };

                                if (plannerIndex >= 0) {
                                    const existingContent = prev[plannerIndex].content || '';
                                    const existingVisibleContent = prev[plannerIndex].visibleContent || '';
                                    const newContent = existingContent ? `${existingContent}\n${plannerActions}` : plannerActions;
                                    updated[plannerIndex] = {
                                        ...prev[plannerIndex],
                                        content: newContent,
                                        visibleContent: existingVisibleContent,
                                        isVisible: true
                                    };

                                    // Set up typewriter for event card first, then planner
                                    const eventCardIndex = updated.length - 1;
                                    setTimeout(() => {
                                        setCurrentSectionIndex(eventCardIndex);
                                        setTypingIndex(0);
                                    }, 100);

                                    return updated;
                                } else {
                                    const newPlannerIndex = updated.length;
                                    updated.push(newPlanner);

                                    // Set up typewriter for event card first, then planner
                                    const eventCardIndex = updated.length - 2;
                                    setTimeout(() => {
                                        setCurrentSectionIndex(eventCardIndex);
                                        setTypingIndex(0);
                                    }, 100);

                                    return updated;
                                }
                            });

                            addMessage('assistant', `I've created a plan for the event. Check your planner actions.`, true); // Enable typewriter
                            return;
                        }
                    }, 1200);
                    return;
                }

                if (actionQuery) {
                    // User message already added at start

                    setTimeout(() => {
                        let response = '';
                        let plannerActions = '';

                        if (actionQuery.action === 'add' && actionQuery.entityType === 'devotees') {
                            plannerActions = `[·] Add devotee records to system\n`;
                            plannerActions += `[·] Update devotee database\n`;
                            plannerActions += `[·] Notify relevant departments about new devotees\n`;
                            response = "I've added devotee-related actions to your planner.";
                        } else if (actionQuery.action === 'extend' && actionQuery.recipients) {
                            actionQuery.recipients.forEach(recipient => {
                                plannerActions += `[·] Send invitation to ${recipient}\n`;
                                plannerActions += `[·] Coordinate protocol for ${recipient} visit\n`;
                                plannerActions += `[·] Arrange security briefing for ${recipient}\n`;
                            });
                            response = `I've added invitation actions for ${actionQuery.recipients.join(' and ')} to your planner.`;
                        } else if (actionQuery.action === 'ask' && actionQuery.target === 'kitchen department') {
                            const kitchenData = DataLookupService.searchKitchen(query);
                            if (kitchenData.data.length > 0) {
                                response = `**Kitchen Menu Information:**\n\n${DataLookupService.formatDataForDisplay(kitchenData)}`;
                            } else {
                                response = "I've requested the menu from the kitchen department. Here's the current information:\n\n";
                                response += "**Prasad Menu:**\n";
                                response += "- Laddu\n";
                                response += "- Sweet Pongal\n";
                                response += "- Payasam\n\n";
                                response += "**Annadanam Menu:**\n";
                                response += "- Puliyogare\n";
                                response += "- Curd Rice\n";
                                response += "- Sambar\n";
                                response += "- Rasam\n";
                            }
                        }

                        if (plannerActions) {
                            setSections(prev => {
                                const plannerIndex = prev.findIndex(s => s.title === 'Your Planner Actions');
                                const newContent = plannerActions;

                                if (plannerIndex >= 0) {
                                    const updated = [...prev];
                                    const existingContent = prev[plannerIndex].content || '';
                                    const existingVisibleContent = prev[plannerIndex].visibleContent || '';
                                    const mergedContent = existingContent ? `${existingContent}\n${newContent}` : newContent;
                                    updated[plannerIndex] = {
                                        ...prev[plannerIndex],
                                        content: mergedContent,
                                        visibleContent: existingVisibleContent, // Keep existing, typewriter will add new part
                                        isVisible: true
                                    };

                                    // Set up typewriter effect
                                    setTimeout(() => {
                                        setTypingIndex(existingVisibleContent.length);
                                        setCurrentSectionIndex(plannerIndex);
                                    }, 0);

                                    return updated;
                                } else {
                                    const newPlannerIndex = prev.length;

                                    // Set up typewriter effect for new planner
                                    setTimeout(() => {
                                        setTypingIndex(0);
                                        setCurrentSectionIndex(newPlannerIndex);
                                    }, 0);

                                    return [...prev, {
                                        id: `planner-${Date.now()}`,
                                        title: 'Your Planner Actions',
                                        subTitle: 'Query Follow-up',
                                        content: newContent,
                                        type: 'list',
                                        visibleContent: '', // Start empty for typewriter effect
                                        isVisible: true
                                    }];
                                }
                            });
                        }

                        addMessage('assistant', response || "I've processed your request.", true); // Enable typewriter
                        setStatus('complete');
                    }, 1200);
                    return;
                }

                if (kitchenQuery) {
                    // User message already added at start

                    setTimeout(() => {
                        const kitchenData = DataLookupService.searchKitchen(query);
                        let response = '';

                        if (kitchenQuery.requestType === 'menu') {
                            response = "**Kitchen Menu:**\n\n";
                            if (kitchenQuery.menuType === 'prasad') {
                                response += "**Prasad Menu:**\n";
                                response += "- Laddu\n";
                                response += "- Sweet Pongal\n";
                                response += "- Payasam\n";
                                response += "- Vada\n";
                            } else if (kitchenQuery.menuType === 'annadanam') {
                                response += "**Annadanam Menu:**\n";
                                response += "- Puliyogare\n";
                                response += "- Curd Rice\n";
                                response += "- Sambar\n";
                                response += "- Rasam\n";
                                response += "- Pickle\n";
                            } else {
                                response += "**Prasad:** Laddu, Sweet Pongal, Payasam, Vada\n";
                                response += "**Annadanam:** Puliyogare, Curd Rice, Sambar, Rasam\n";
                            }
                        } else {
                            response = DataLookupService.formatDataForDisplay(kitchenData);
                        }

                        addMessage('assistant', response, true); // Enable typewriter

                        // Generate planner actions for kitchen query
                        const plannerActions = generatePlannerActionsFromQuery(query, 'kitchen');

                        // Add planner actions to the planner section
                        setSections(prev => {
                            const plannerIndex = prev.findIndex(s => s.title === 'Your Planner Actions');

                            if (plannerIndex >= 0) {
                                const updated = [...prev];
                                const existingContent = prev[plannerIndex].content || '';
                                const existingVisibleContent = prev[plannerIndex].visibleContent || '';
                                const mergedContent = existingContent ? `${existingContent}\n${plannerActions}` : plannerActions;
                                updated[plannerIndex] = {
                                    ...prev[plannerIndex],
                                    content: mergedContent,
                                    visibleContent: existingVisibleContent, // Keep existing, typewriter will add new part
                                    isVisible: true
                                };

                                // Set up typewriter effect
                                setTimeout(() => {
                                    setTypingIndex(existingVisibleContent.length);
                                    setCurrentSectionIndex(plannerIndex);
                                }, 0);

                                return updated;
                            } else {
                                const newPlannerIndex = prev.length;

                                // Set up typewriter effect for new planner
                                setTimeout(() => {
                                    setTypingIndex(0);
                                    setCurrentSectionIndex(newPlannerIndex);
                                }, 0);

                                return [...prev, {
                                    id: `planner-${Date.now()}`,
                                    title: 'Your Planner Actions',
                                    subTitle: 'Kitchen Follow-up',
                                    content: plannerActions,
                                    type: 'list',
                                    visibleContent: '', // Start empty for typewriter effect
                                    isVisible: true
                                }];
                            }
                        });

                        setStatus('complete');
                    }, 1200);
                    return;
                }

                // Simple recommendation response (if no complex processing needed)
                const recommendationResult = handleRecommendation(query);
                if (recommendationResult.handled && recommendationResult.response && !recommendationResult.needsAsyncProcessing) {
                    setTimeout(() => {
                        addMessage('assistant', recommendationResult.response!, true);
                        setStatus('complete');
                    }, 800);
                    return;
                }
            }, 600);
            return;
        }


                // Handler 9: Planner Request Handler
                if (isPlannerRequest(query) && newSections.length === 0) {
                    const plannerRequestResult = handlePlannerRequest(query);
                    if (plannerRequestResult.handled && plannerRequestResult.sections) {
                        setSections(prev => {
                            const existingPlannerIndex = prev.findIndex(s => s.title === 'Your Planner Actions');
                            if (existingPlannerIndex >= 0) {
                                const existingSection = prev[existingPlannerIndex];
                                const newPlanner = plannerRequestResult.sections![0];
                                const mergedPlanner = mergePlannerSections(existingSection, newPlanner);
                                const updated = [...prev];
                                if (mergedPlanner) {
                                    updated[existingPlannerIndex] = mergedPlanner;
                                    setTimeout(() => {
                                        setTypingIndex(existingSection.visibleContent.length);
                                        setCurrentSectionIndex(existingPlannerIndex);
                                    }, 0);
                                }
                                return updated;
                            } else {
                                const newPlannerIndex = prev.length;
                                setTimeout(() => {
                                    setTypingIndex(0);
                                    setCurrentSectionIndex(newPlannerIndex);
                                }, 0);
                                return [...prev, ...(plannerRequestResult.sections || [])];
                            }
                        });
                        if (plannerRequestResult.message) {
                            setTimeout(() => {
                                addMessage('assistant', plannerRequestResult.message!, true);
                            }, 400);
                        }
                        newSections = [];
                        return;
                    }
                } else if (lowercaseQuery.includes('jagadguru') || lowercaseQuery.includes('swamiji')) {
                    // Jagadgurugalu / Swamiji Logic
                    const isKiggaVisit = lowercaseQuery.includes('kigga');

                    if (options?.onVIPVisitParsed) {
                        options.onVIPVisitParsed({
                            visitor: "Jagadguru Sri Sri Vidhushekhara Bharati Sannidhanam",
                            title: "Pontiff of Sringeri Sharada Peetham",
                            date: isKiggaVisit ? new Date() : new Date(new Date().setDate(new Date().getDate() + 1)),
                            time: isKiggaVisit ? "16:00" : "17:00",
                            location: isKiggaVisit ? "Kigga" : "Main Entrance (Raja Gopuram)",
                            protocolLevel: "maximum",
                            confidence: 1.0
                        });
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

                    newSections = [
                        {
                            id: 'focus-vip',
                            title: 'VIP Protocol Brief',
                            content: JSON.stringify(vipData),
                            type: 'text',
                            visibleContent: '',
                            isVisible: false
                        },
                        {
                            id: 'planner-jagadguru',
                            title: 'Your Planner Actions',
                            subTitle: isKiggaVisit ? 'Kigga Adhoc Visit Plan' : 'Poornakumbha Swagata Plan',
                            content: isKiggaVisit ? kiggaPlannerContent : '[·] Arrange Poornakumbha Swagata at Raja Gopuram\n[·] Coordinate Dhuli Pada Puja at Pravachana Mandiram\n[·] Ensure security clearance for devotee darshan line\n[·] Prepare Sanctum for special Mangala Arathi',
                            type: 'list',
                            visibleContent: '',
                            isVisible: false
                        }
                    ];

                } else if (lowercaseQuery.includes('chandi') || lowercaseQuery.includes('yaga') || lowercaseQuery.includes('homa')) {
                    // Sahasra Chandi Yaga logic
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

                        newSections = [
                            {
                                id: 'focus-vip',
                                title: 'VIP Event Brief: Sahasra Chandi Yaga',
                                content: JSON.stringify(vipData),
                                type: 'text',
                                visibleContent: '',
                                isVisible: false
                            },
                            {
                                id: 'planner-yaga',
                                title: 'Your Planner Actions',
                                subTitle: 'Sahasra Chandi Yaga Plan (Feb 3rd)',
                                content: `[·] Confirm yaga sankalpa, muhurta & duration
[·] Assign chief acharya, rtviks & purohita team
[·] Prepare complete yaga shala & homa kundas
[·] Verify Sahasra Chandi pooja samagri readiness
[·] Align VIP darshan, seating & yaga participation protocol
[·] Coordinate prasad & naivedya preparation plan
[·] Prepare devotee & crowd movement arrangement
[·] Notify temple trustees & ritual oversight committee
[·] Deploy sevaks & volunteers for yaga support seva
[·] Conduct pre-yaga shubha muhurtam readiness review (2nd Feb)`,
                                type: 'list',
                                visibleContent: '',
                                isVisible: false
                            }
                        ];
                    } else {
                        newSections = [
                            {
                                id: 'focus-event',
                                title: 'Event Brief: Sahasra Chandi Yaga',
                                content: 'The Sahasra Chandi Maha Yaga is scheduled to commence at 7:00 AM tomorrow at the Yaga Shala. 108 Ritwiks have arrived. Purnahuti is scheduled for 12:30 PM on Sunday.',
                                type: 'text',
                                visibleContent: '',
                                isVisible: false
                            },
                            {
                                id: 'planner-yaga',
                                title: 'Your Planner Actions',
                                subTitle: 'Yaga Preparation',
                                content: '[·] Inspect Yaga Shala arrangements and seating\n[·] Verify stock of 500kg Ghee and 1000kg Samidha\n[·] Coordinate accommodation for 108 Ritwiks\n[·] Setup medical camp near North Gate',
                                type: 'list',
                                visibleContent: '',
                                isVisible: false
                            }
                        ];
                    }

                } else if (lowercaseQuery.includes('restoration') || lowercaseQuery.includes('renovation') || lowercaseQuery.includes('infrastructure')) {
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

                    newSections = [
                        {
                            id: 'focus-project',
                            title: 'Project Executive Brief',
                            content: JSON.stringify(projectData),
                            type: 'text',
                            visibleContent: '',
                            isVisible: false
                        },
                        {
                            id: 'planner-project',
                            title: 'Your Planner Actions',
                            subTitle: 'Restoration Milestones',
                            content: `[·] Audit current gold stock and utilization
[·] Approve stage-3 artisan progress report
[·] Schedule security transfer of completed components
[·] Finalize sanctum closure window for installation
[·] Arrange documentation photography of progress`,
                            type: 'list',
                            visibleContent: '',
                            isVisible: false
                        }
                    ];
                    addMessage('assistant', "Project status updated. I've added the restoration milestones to your planner.", true); // Enable typewriter

                } else if (lowercaseQuery.includes('navaratri') || lowercaseQuery.includes('festival') || lowercaseQuery.includes('dasara') || lowercaseQuery.includes('sharannavarathri')) {
                    // Navaratri preparation
                    const isSharadaNavaratri = lowercaseQuery.includes('sharada') || lowercaseQuery.includes('sharannavarathri');
                    const isStatusQuery = lowercaseQuery.includes('progress') || lowercaseQuery.includes('status') || lowercaseQuery.startsWith('show') || lowercaseQuery.includes('view');

                    if (isSharadaNavaratri) {
                        const festivalData = {
                            title: "Sharada Sharannavarathri 2024",
                            subTitle: "Duration: Oct 3 - Oct 12, 2024 | Expected: 50,000+ Daily",
                            highlightTitle: "FESTIVAL | KEY HIGHLIGHTS",
                            highlights: [
                                { time: 'Day 1', description: 'Sharada Sharannavarathri Prarambha, Kalasha Sthapana.' },
                                { time: 'Day 7', description: 'Moola Nakshatra (Saraswati Avahana).' },
                                { time: 'Day 10', description: 'Vijayadashami, Maha Rathotsava.' }
                            ]
                        };

                        newSections = [
                            {
                                id: 'focus-festival',
                                title: 'Festival Event Brief',
                                content: JSON.stringify(festivalData),
                                type: 'text',
                                visibleContent: '',
                                isVisible: false
                            },
                            {
                                id: 'planner-festival',
                                title: 'Your Planner Actions',
                                subTitle: 'Navaratri Execution Roadmap',
                                content: `[·] Verify Alankara schedule for all 10 days
[·] Finalize Annadanam procurement for 5L+ devotees
[·] Deploy additional 200 crowd control volunteers
[·] Setup temporary medical camps at 3 locations
[·] Coordinate with KSRTC for special bus services`,
                                type: 'list',
                                visibleContent: '',
                                isVisible: false
                            }
                        ];
                        addMessage('assistant', "I've generated the Sharada Sharannavarathri execution roadmap and briefing.", true); // Enable typewriter
                    } else {
                        newSections = [
                            {
                                id: 'focus-summary',
                                title: 'Navaratri Preparation Status',
                                content: 'Overall preparation is 85% complete. The main Alankara for Day 1 is ready. Security barriers are installed. Annadanam supplies are stocked for the first 3 days.',
                                type: 'text',
                                visibleContent: '',
                                isVisible: false
                            }
                        ];

                        if (!isStatusQuery) {
                            newSections.push({
                                id: 'planner-navaratri',
                                title: 'Your Planner Actions',
                                subTitle: 'Festival Readiness',
                                content: '[·] Final inspection of Queue Complex A\n[·] Review CCTV coverage with Police Commissioner\n[·] Distributors meeting for Prasadam counters\n[·] Electrical safety audit of illumination',
                                type: 'list',
                                visibleContent: '',
                                isVisible: false
                            });
                        }
                    }

                } else if (lowercaseQuery.includes('approval') || lowercaseQuery.includes('pending')) {
                    const isViewOnly = lowercaseQuery.startsWith('show') || lowercaseQuery.includes('view') || lowercaseQuery.includes('list') || lowercaseQuery.includes('check');

                    const focusContent = 'You have 3 high-priority approvals pending for the Gold Kavacha restoration. Delay may impact the upcoming festival schedule.';

                    newSections = [
                        { id: 'focus-approval', title: 'Approval Briefing', content: focusContent, type: 'text', visibleContent: '', isVisible: false }
                    ];

                    if (!isViewOnly) {
                        newSections.push({
                            id: 'approval-steps',
                            title: 'Your Planner Actions',
                            content: '[·] Review Priest\'s technical request\n[·] Verify insurance coverage extension\n[·] Confirm artisan availability for Jan 15',
                            type: 'list',
                            visibleContent: '',
                            isVisible: false
                        });
                    }
                } else if (lowercaseQuery.startsWith('schedule') || lowercaseQuery.startsWith('review') || lowercaseQuery.startsWith('plan') && !lowercaseQuery.includes('action')) {
                    // CEO INFORMATION / APPOINTMENT INTENT
                    if (lowercaseQuery.includes('sahasra chandi')) {
                        // Special handling for the specific event if needed, or fall through to generic
                    }

                    let cardType = 'appointment';
                    if (lowercaseQuery.includes('review')) cardType = 'review';
                    else if (lowercaseQuery.includes('event') || lowercaseQuery.includes('yaga')) cardType = 'event';
                    else if (lowercaseQuery.includes('ritual') || lowercaseQuery.includes('pooja')) cardType = 'ritual';

                    // Mock Extract subjects
                    const subject = query.replace(/^(schedule|review|plan)\s+/i, '').split(' on ')[0].split(' at ')[0];

                    const cardData = {
                        type: cardType,
                        subject: subject.charAt(0).toUpperCase() + subject.slice(1),
                        dateTime: "Tomorrow, 10:00 AM", // Mock logic
                        intent: "Align key stakeholders on execution roadmap and identify blockers.",
                        plannedBy: "Temple CEO",
                        visibility: "Executive"
                    };

                    newSections = [
                        {
                            id: 'focus-ceo-card',
                            title: 'Executive Plan',
                            content: JSON.stringify(cardData),
                            type: 'text', // We use custom renderer
                            visibleContent: '', // Not used for this type really
                            isVisible: false
                        }
                    ];
                    addMessage('assistant', `I've scheduled the ${cardType} regarding "${subject}". Relevant cards have been placed on your canvas.`, true); // Enable typewriter

                } else if (lowercaseQuery.startsWith('direct') || lowercaseQuery.startsWith('instruct') || lowercaseQuery.startsWith('ask') || lowercaseQuery.startsWith('tell') || lowercaseQuery.startsWith('ensure')) {
                    // CEO ACTION / DIRECTIVE INTENT
                    // User message already added at start
                    const cleanDirective = query.replace(/^(direct|instruct|ask|tell|ensure)\s+/i, '');

                    // Infer Department
                    let dept = 'Operations';
                    if (cleanDirective.toLowerCase().includes('security') || cleanDirective.toLowerCase().includes('guard')) dept = 'Security';
                    else if (cleanDirective.toLowerCase().includes('finance') || cleanDirective.toLowerCase().includes('money')) dept = 'Finance';
                    else if (cleanDirective.toLowerCase().includes('priest') || cleanDirective.toLowerCase().includes('ritual')) dept = 'Rituals';

                    // Construct Tagged Action
                    const taggedAction = `[·] [DIRECTIVE] [PRIORITY:HIGH] [DEPT:${dept}] ${cleanDirective.charAt(0).toUpperCase() + cleanDirective.slice(1)}`;

                    setSections(prev => {
                        const existingPlannerIndex = prev.findIndex(s => s.title === 'Your Planner Actions');

                        if (existingPlannerIndex >= 0) {
                            const existingContent = prev[existingPlannerIndex].content;
                            const newContent = existingContent
                                ? `${existingContent}\n${taggedAction}`
                                : taggedAction;

                            const updated = [...prev];
                            const existingSection = prev[existingPlannerIndex];
                            updated[existingPlannerIndex] = {
                                ...updated[existingPlannerIndex],
                                content: newContent,
                                visibleContent: existingSection.visibleContent // Persist existing view
                            };

                            // Start typing from the end of current content - set after state update
                            setTimeout(() => {
                                setTypingIndex(existingSection.visibleContent.length);
                                setCurrentSectionIndex(existingPlannerIndex);
                            }, 0);
                            return updated;
                        } else {
                            // Create new planner actions section
                            const newPlannerIndex = prev.length; // Index of the new planner after adding
                            setTimeout(() => {
                                setTypingIndex(0);
                                setCurrentSectionIndex(newPlannerIndex);
                            }, 0);
                            return [
                                ...prev,
                                {
                                    id: `planner-actions-${Date.now()}`,
                                    title: 'Your Planner Actions',
                                    subTitle: 'Executive Directives',
                                    content: taggedAction,
                                    type: 'list',
                                    visibleContent: '',
                                    isVisible: false
                                }
                            ];
                        }
                    });

                    addMessage('assistant', `Directive issued to ${dept}. Tracking as high priority.`, true); // Enable typewriter
                    setStatus('complete'); // Early exit since we handled the state update manually
                    return;

                } else if (lowercaseQuery.includes('governor') && (lowercaseQuery.includes('karnataka') || lowercaseQuery.includes('visit'))) {
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

                    newSections = [
                        {
                            id: 'focus-vip',
                            title: 'VIP Protocol Brief: Governor Visit',
                            content: JSON.stringify(vipData),
                            type: 'text',
                            visibleContent: '',
                            isVisible: false
                        },
                        {
                            id: 'planner-governor',
                            title: 'Your Planner Actions',
                            subTitle: 'Governor Protocol Plan',
                            content: `[·] Coordinate with Raj Bhavan protocol office
[·] Arrange Z-category security escort from entry
[·] Reserve Executive Guest House for lunch
[·] Prepare Poornakumbha Swagata at main gate
[·] Ensure media-free corridor during darshan`,
                            type: 'list',
                            visibleContent: '',
                            isVisible: false
                        }
                    ];
                    addMessage('assistant', "I've prepared the protocol briefing and planner actions for the Governor's visit.", true); // Enable typewriter
        }

        // Handler 10: VIP Query Handler
        const vipQueryResult = handleVIPQuery(query, options);
        if (vipQueryResult.handled && vipQueryResult.sections) {
            newSections = vipQueryResult.sections;
            if (vipQueryResult.vipVisit && options?.onVIPVisitParsed) {
                options.onVIPVisitParsed(vipQueryResult.vipVisit);
            }
            if (vipQueryResult.message) {
                setTimeout(() => {
                    addMessage('assistant', vipQueryResult.message!, true);
                }, 500);
            }
        } else {
            // Check if this is an informational query (from recommendations or general questions)
            const isInformational = isInformationalQuery(query);

            if (!isInformational) {
                // No default sections - let user query determine content
                newSections = [];
            } else {
                // For informational queries, generate planner actions
                const plannerActions = generatePlannerActionsFromQuery(query, 'general');
                if (plannerActions) {
                    newSections = [
                        {
                            id: `planner-${Date.now()}`,
                            title: 'Your Planner Actions',
                            subTitle: 'Query Follow-up',
                            content: plannerActions,
                            type: 'list',
                            visibleContent: '',
                            isVisible: false
                        }
                    ];
                }
            }
        }

        // Only set sections if we have new sections (not for planner requests which update existing)
        if (newSections.length > 0) {
            setSections(prev => {
                // For quick actions (Show queries) and VIP/visit queries, replace existing focus cards
                const isQuickAction = lowercaseQuery.startsWith('show') || 
                                     lowercaseQuery.includes('view') || 
                                     lowercaseQuery.includes('list') ||
                                     lowercaseQuery.includes('check') ||
                                     isRecommendation;
                
                const isVIPOrVisitQuery = lowercaseQuery.includes('vip') || 
                                          lowercaseQuery.includes('minister') || 
                                          lowercaseQuery.includes('visit') ||
                                          lowercaseQuery.includes('governor') ||
                                          newSections.some(s => s.id.startsWith('focus-'));
                
                if ((isQuickAction || isVIPOrVisitQuery) && newSections.length > 0) {
                    return replaceFocusCards(prev, newSections);
                } else {
                    return addSections(prev, newSections);
                }
            });
        }

        setTimeout(() => {
            if (isPlannerRequest(query)) {
                addMessage('assistant', "I've added these actions to your planner. You can edit, assign, or add more items.", true);
                setSections(prev => {
                    const plannerIndex = prev.findIndex(s => s.title === 'Your Planner Actions');
                    if (plannerIndex >= 0) {
                        setCurrentSectionIndex(plannerIndex);
                    }
                    return prev;
                });
            } else if (newSections.length === 0) {
                // Handler 11: Data Lookup Handler (Fallback - searches real data instead of hallucinating)
                const dataLookupResult = handleDataLookup(query);
                if (dataLookupResult.handled) {
                    setTimeout(() => {
                        if (dataLookupResult.response) {
                            addMessage('assistant', dataLookupResult.response, true);
                        }
                        if (dataLookupResult.sections && dataLookupResult.sections.length > 0) {
                            setSections(prev => {
                                // Use replaceFocusCards if info section exists, otherwise addSections
                                const hasInfoSection = dataLookupResult.sections!.some(s => s.id.startsWith('focus-info-'));
                                if (hasInfoSection) {
                                    return replaceFocusCards(prev, dataLookupResult.sections!);
                                }
                                return addSections(prev, dataLookupResult.sections!);
                            });
                            setTimeout(() => {
                                setCurrentSectionIndex(sections.length); // Start typing from the new sections
                                setTypingIndex(0);
                            }, 100);
                        }
                        setStatus('complete');
                    }, 800);
                    return;
                }
                // If data lookup also doesn't handle it, just acknowledge
                setTimeout(() => {
                    addMessage('assistant', "I'm processing your query. Please try rephrasing or asking about specific data.", true);
                    setStatus('complete');
                }, 800);
                return;
            } else {
                // Generate context-specific response based on query type
                let response = "I'm generating the relevant briefing in your workspace focus area.";
                if (lowercaseQuery.includes('alert') || lowercaseQuery.includes('reminder') || lowercaseQuery.includes('notification')) {
                    const datePrefix = lowercaseQuery.includes('tomorrow') ? 'tomorrow\'s' : 'today\'s';
                    response = `Showing ${datePrefix} alerts and reminders.`;
                } else if (lowercaseQuery.includes('approval')) {
                    const datePrefix = lowercaseQuery.includes('tomorrow') ? 'tomorrow\'s' : 'today\'s';
                    response = `Showing ${datePrefix} pending approvals.`;
                } else if (lowercaseQuery.includes('appointment') || lowercaseQuery.includes('calendar') || lowercaseQuery.includes('schedule')) {
                    const datePrefix = lowercaseQuery.includes('tomorrow') ? 'tomorrow\'s' : 'today\'s';
                    response = `Showing ${datePrefix} appointments and schedule.`;
                } else if (lowercaseQuery.includes('finance') || lowercaseQuery.includes('summary') || lowercaseQuery.includes('revenue')) {
                    const datePrefix = lowercaseQuery.includes('tomorrow') ? 'tomorrow\'s' : 'today\'s';
                    response = `Showing ${datePrefix} financial summary.`;
                }
                addMessage('assistant', response, true);
                setCurrentSectionIndex(0);
            }
        }, 600);
    }, [addMessage]);

    // The Typewriter Effect Loop
    useEffect(() => {
        if (status !== 'generating' || currentSectionIndex === -1) return;

        if (currentSectionIndex >= sections.length) {
            setStatus('complete');
            return;
        }

        const currentSection = sections[currentSectionIndex];
        const contentToType = currentSection.content;

        // Skip typewriter for focus- components and component type sections
        const isFocusSection = currentSection.id.startsWith('focus-');
        const isComponentSection = currentSection.type === 'components';

        if (!currentSection.isVisible) {
            setSections(prev => prev.map((s, i) => i === currentSectionIndex ? { ...s, isVisible: true } : s));
            // Show planning message only once per query
            if (!planningMessageShownRef.current) {
                planningMessageShownRef.current = true;
                addMessage('system', 'Planning...');
            }
        }

        if (isFocusSection || isComponentSection) {
            // Immediate display for dashboard sections and component sections
            setSections(prev => prev.map((s, i) => {
                if (i !== currentSectionIndex) return s;
                return { ...s, visibleContent: contentToType || s.content };
            }));
            const nextIndex = currentSectionIndex + 1;
            setCurrentSectionIndex(nextIndex);
            setTypingIndex(0);
            
            // If this was the last section, set status to complete
            if (nextIndex >= sections.length) {
                setStatus('complete');
            }
        } else if (typingIndex < contentToType.length) {
            const timeoutId = setTimeout(() => {
                setSections(prev => prev.map((s, i) => {
                    if (i !== currentSectionIndex) return s;
                    return { ...s, visibleContent: contentToType.slice(0, typingIndex + 1) };
                }));
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
                    setStatus('complete');
                }
            }, 400);
            return () => clearTimeout(delay);
        }
    }, [status, currentSectionIndex, typingIndex, sections, addMessage]);

    // Typewriter Effect for Chat Messages
    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (!lastMessage || lastMessage.role !== 'assistant' || !lastMessage.isTyping) {
            return;
        }

        const fullText = lastMessage.fullText || lastMessage.text;
        const currentVisibleText = lastMessage.text;

        if (currentVisibleText.length < fullText.length) {
            const timeoutId = setTimeout(() => {
                setMessages(prev => prev.map(msg =>
                    msg.id === lastMessage.id
                        ? { ...msg, text: fullText.slice(0, currentVisibleText.length + 1) }
                        : msg
                ));
            }, 15); // Typing speed for chat messages (15ms per character)
            return () => clearTimeout(timeoutId);
        } else {
            // Typing complete for this message
            setMessages(prev => prev.map(msg =>
                msg.id === lastMessage.id
                    ? { ...msg, isTyping: false }
                    : msg
            ));
        }
    }, [messages]);

    return {
        status,
        messages,
        sections,
        startSimulation,
        clearPlanner: () => {
            // Remove all sections with title "Your Planner Actions"
            setSections(prev => prev.filter(s => s.title !== 'Your Planner Actions'));
        },
        reset: () => {
            setStatus('idle');
            setMessages([]);
            setSections([]);
            setCurrentSectionIndex(-1);
            setTypingIndex(0);
            planningMessageShownRef.current = false;
        }
    };
}

