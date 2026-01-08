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
import { handleProcurementProgress } from '@/services/handlers/procurementProgressHandler';
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


    const startSimulation = useCallback((query: string = 'Check cane intake status', options?: { isRecommendation?: boolean; displayQuery?: string; onVIPVisitParsed?: (vip: any) => void; onModuleDetected?: (module: ModuleName) => void }) => {
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
            // Use sections from quick action if provided, otherwise create default
            let newSections: CanvasSection[] = [];
            if (quickActionResult.sections && quickActionResult.sections.length > 0) {
                newSections = quickActionResult.sections;
            } else {
                newSections = [{
                    id: quickActionResult.sectionId,
                    title: quickActionResult.sectionTitle,
                    content: 'Loading...',
                    type: 'components',
                    visibleContent: '',
                    isVisible: false
                }];
            }

            // Handle actionable finance queries separately
            if (quickActionResult.sectionId === 'focus-finance' && lowercaseQuery.includes('approve')) {
                newSections = [
                    {
                        id: 'focus-finance',
                        title: 'Finance Action Required',
                        content: JSON.stringify({
                            title: 'Payment Approval',
                            subTitle: 'Amount: ₹2,50,000 | Status: Pending',
                            highlightTitle: "FINANCE | HIGHLIGHTS",
                            highlights: [
                                { time: 'Amount', description: '₹2,50,000' },
                                { time: 'Department', description: 'Production' },
                                { time: 'Priority', description: 'High' }
                            ]
                        }),
                        type: 'text',
                        visibleContent: '',
                        isVisible: false
                    },
                    {
                        id: 'finance-actions',
                        title: 'Your Planner Actions',
                        content: '[·] Review payment request\n[·] Approve or reject payment\n[·] Update financial records',
                        type: 'list',
                        visibleContent: '',
                        isVisible: false
                    }
                ];
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

        // Handler 6: Procurement Progress Handler (check early, before info queries)
        const procurementResult = handleProcurementProgress(query);
        if (procurementResult.handled && procurementResult.needsAsyncProcessing) {
            setTimeout(() => {
                if (procurementResult.response) {
                    addMessage('assistant', procurementResult.response, true);
                }
                if (procurementResult.sections) {
                    setSections(prev => replaceFocusCards(prev, procurementResult.sections!));
                    setTimeout(() => {
                        setCurrentSectionIndex(0);
                        setTypingIndex(0);
                    }, 100);
                }
            }, 600);
            return;
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
            // Handler 8: Recommendation Handler
            const isFieldInspection = lowercaseQuery.includes('field') || lowercaseQuery.includes('farm');

            if (options?.onVIPVisitParsed) {
                options.onVIPVisitParsed({
                    visitor: "Factory Manager",
                    title: "Operations Manager & Quality Inspector",
                    date: isFieldInspection ? new Date() : new Date(new Date().setDate(new Date().getDate() + 1)),
                    time: isFieldInspection ? "16:00" : "17:00",
                    location: isFieldInspection ? "Cane Field" : "Main Factory Entrance",
                    protocolLevel: "maximum",
                    confidence: 1.0
                });
            }

            const inspectionData = {
                visitor: "Factory Manager",
                title: "Operations Manager & Quality Inspector",
                dateTime: isFieldInspection ? "Today at 4:00 PM" : "Tomorrow at 5:00 PM",
                location: isFieldInspection ? "Cane Field" : "Main Factory Entrance",
                protocolLevel: "maximum",
                delegationSize: isFieldInspection ? "~20 persons" : "~10 persons",
                todayHighlights: isFieldInspection ? [
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
                highlights: isFieldInspection ? [
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

            newSections = [
                {
                    id: 'focus-inspection',
                    title: 'Quality Inspection Brief',
                    content: JSON.stringify(inspectionData),
                    type: 'text',
                    visibleContent: '',
                    isVisible: false
                },
                {
                    id: 'planner-manager',
                    title: 'Your Planner Actions',
                    subTitle: isFieldInspection ? 'Field Inspection Plan' : 'Factory Tour Plan',
                    content: isFieldInspection ? fieldInspectionPlannerContent : '[·] Arrange factory tour at main entrance\n[·] Coordinate production line inspection\n[·] Ensure quality clearance for production areas\n[·] Prepare production reports for review',
                    type: 'list',
                    visibleContent: '',
                    isVisible: false
                }
            ];
            addMessage('assistant', `I've prepared the ${isFieldInspection ? 'field inspection' : 'factory tour'} briefing and planner actions for the Factory Manager.`, true);

        } else if (lowercaseQuery.includes('batch') || lowercaseQuery.includes('production') || lowercaseQuery.includes('crushing')) {
            // Production Batch logic
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

                newSections = [
                    {
                        id: 'focus-batch',
                        title: 'Production Batch Protocol',
                        content: JSON.stringify(batchData),
                        type: 'text',
                        visibleContent: '',
                        isVisible: false
                    },
                    {
                        id: 'planner-batch',
                        title: 'Your Planner Actions',
                        subTitle: 'Batch Preparation Plan',
                        content: '[·] Confirm staffing for production line\n[·] Secure production area for quality inspection\n[·] Arrange for specialized quality testing equipment\n[·] Coordinate with inventory department for sugar product distribution',
                        type: 'list',
                        visibleContent: '',
                        isVisible: false
                    }
                ];
                addMessage('assistant', "I've generated the special production batch protocol briefing and planning steps for Feb 3rd.", true);
            }

        } else if (lowercaseQuery.includes('maintenance') || lowercaseQuery.includes('upgrade') || lowercaseQuery.includes('renovation')) {
            // Factory Maintenance/Upgrade Project Logic
            const projectData = {
                visitor: "Project Management Office",
                title: "Factory Maintenance & Upgrade Project",
                dateTime: "Phase 1: Equipment Upgrade & Maintenance",
                location: "Crushing Unit & Production Floor",
                protocolLevel: "standard",
                delegationSize: "25 members crew",
                todayHighlights: [
                    { time: '10:00 AM', description: 'Daily site inspection and safety briefing.' },
                    { time: '02:00 PM', description: 'Equipment review and maintenance progress.' },
                    { time: '04:00 PM', description: 'Material audit and procurement update for next week.' }
                ],
                highlightTitle: "PROJECT | HIGHLIGHTS",
                highlights: [
                    { time: 'Phase 1', description: 'Equipment inspection and safety checks.' },
                    { time: 'Phase 2', description: 'Crushing unit upgrade and maintenance.' },
                    { time: 'Phase 3', description: 'Final testing, calibration, and production restart prep.' }
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
                    subTitle: 'Maintenance Milestones',
                    content: '[·] Review equipment blueprints for crushing unit\n[·] Approve spare parts supply from authorized vendors\n[·] Schedule weekly project review meeting with Factory Admin\n[·] Coordinate with Safety Dept for compliance standards',
                    type: 'list',
                    visibleContent: '',
                    isVisible: false
                }
            ];
            addMessage('assistant', "Project status updated. I've added the maintenance milestones to your planner.", true);

        } else if (lowercaseQuery.includes('season') || lowercaseQuery.includes('harvest') || lowercaseQuery.includes('crushing season')) {
            // Production Season Logic - check if info/summary or prepare/plan
            const isSeasonInfo = (lowercaseQuery.includes('season') || lowercaseQuery.includes('harvest') || lowercaseQuery.includes('crushing season')) && (isInfoQuery || isSummaryQuery || lowercaseQuery.includes('prepare') || lowercaseQuery.includes('plan'));

            if (isSeasonInfo) {
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

                newSections = [
                    {
                        id: 'focus-season',
                        title: 'Production Season Brief',
                        content: JSON.stringify(seasonData),
                        type: 'text',
                        visibleContent: '',
                        isVisible: false
                    },
                    {
                        id: 'planner-season',
                        title: 'Your Planner Actions',
                        subTitle: 'Season Execution Roadmap',
                        content: `[·] Verify production schedule for all 10 weeks
[·] Finalize cane procurement for peak season
[·] Deploy additional quality control staff
[·] Setup temporary storage facilities at 3 locations
[·] Coordinate with transport for cane delivery services`,
                        type: 'list',
                        visibleContent: '',
                        isVisible: false
                    }
                ];
                addMessage('assistant', "I've generated the crushing season execution roadmap and briefing.", true);
            } else {
                newSections = [
                    {
                        id: 'focus-summary',
                        title: 'Season Preparation Status',
                        content: 'Overall preparation is 85% complete. The main production line for Week 1 is ready. Quality control barriers are installed. Cane supplies are stocked for the first 3 weeks.',
                        type: 'text',
                        visibleContent: '',
                        isVisible: false
                    }
                ];
                addMessage('assistant', "Season preparations are on track. Dashboard updated with current status.", true);
            }

        } else if (lowercaseQuery.includes('admin') || (lowercaseQuery.includes('factory admin') || lowercaseQuery.includes('manager'))) {
            // Factory Admin Intent - Info or Action
            const isAdminAction = lowercaseQuery.includes('ask') || lowercaseQuery.includes('tell') || lowercaseQuery.includes('directive') || lowercaseQuery.includes('order');
            const dept = lowercaseQuery.includes('production') ? 'Production' : lowercaseQuery.includes('quality') ? 'Quality Control' : lowercaseQuery.includes('inventory') ? 'Inventory' : 'Admin';

            if (isAdminAction) {
                newSections = [
                    {
                        id: `focus-admin-action-${Date.now()}`,
                        title: `Admin Directive: ${dept}`,
                        content: `Factory Admin has directed the ${dept} department to ${query.split(' to ')[1] || 'respond immediately to current requirements'}. Tracking for completion by EOD.`,
                        type: 'text',
                        visibleContent: '',
                        isVisible: false
                    },
                    {
                        id: `planner-admin-${Date.now()}`,
                        title: 'Your Planner Actions',
                        subTitle: 'Admin Follow-up',
                        content: `[·] Confirm receipt of directive by ${dept} head\n[·] Monitor ${dept} progress updates\n[·] Report completion to Factory Admin office`,
                        type: 'list',
                        visibleContent: '',
                        isVisible: false
                    }
                ];
                addMessage('assistant', `Directive issued to ${dept}. Tracking as high priority.`, true);
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

                newSections = [
                    {
                        id: 'focus-admin',
                        title: 'Factory Admin Office Briefing',
                        content: JSON.stringify(adminData),
                        type: 'text',
                        visibleContent: '',
                        isVisible: false
                    }
                ];
                addMessage('assistant', "Factory Admin office briefing loaded. Dashboard shows today's high-level engagements.", true);
            }

        } else if (lowercaseQuery.includes('auditor') || (lowercaseQuery.includes('inspector') && !lowercaseQuery.includes('quality inspector')) || lowercaseQuery.includes('government') || lowercaseQuery.includes('compliance')) {
            // Government Auditor / Inspector visit
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

            newSections = [
                {
                    id: 'focus-auditor',
                    title: 'Government Inspection Protocol',
                    content: JSON.stringify(protocolData),
                    type: 'text',
                    visibleContent: '',
                    isVisible: false
                },
                {
                    id: 'planner-auditor',
                    title: 'Your Planner Actions',
                    subTitle: 'Inspection Protocol',
                    content: `[·] Coordinate with local authorities for escort & access\n[·] Brief factory protocol officers on inspection requirements\n[·] Secure inspection window for production areas (30 mins)\n[·] Confirm documentation & compliance records ready`,
                    type: 'list',
                    visibleContent: '',
                    isVisible: false
                }
            ];
            addMessage('assistant', `I've prepared the inspection protocol briefing and planner actions for the ${visitorName}'s visit.`, true);
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
                                visitor: planningQuery.person || "Factory Manager",
                                title: "Factory Inspection",
                                dateTime: `${planningQuery.date || 'Today'} at ${visitTime}`,
                                location: planningQuery.location || "Factory",
                                protocolLevel: "maximum",
                                delegationSize: "~20 persons",
                                leadEscort: "Operations Manager",
                                securityStatus: "Briefed & Ready",
                                todayHighlights: [
                                    {
                                        time: formatTime((hour24 - 1 + 24) % 24, minute, period),
                                        description: 'Pre-arrival safety readiness check and final preparations.'
                                    },
                                    {
                                        time: visitTime,
                                        description: `Arrival at ${planningQuery.location || 'factory'} and inspection briefing.`
                                    },
                                    {
                                        time: formatTime((hour24 + 1) % 24, minute, period),
                                        description: 'Factory tour and quality inspection.'
                                    },
                                    {
                                        time: formatTime((hour24 + 2) % 24, minute, period),
                                        description: 'Review meeting with suppliers and farmers.'
                                    }
                                ],
                                highlightTitle: "TODAY | HIGHLIGHTS"
                            };

                            // Create focus-visit section
                            const visitCardSection: CanvasSection = {
                                id: `focus-visit-${Date.now()}`,
                                title: 'Inspection Protocol Brief',
                                content: JSON.stringify(visitCardData),
                                type: 'text',
                                visibleContent: '',
                                isVisible: true
                            };

                            plannerActions = `[·] Coordinate travel arrangements for ${planningQuery.person || 'Factory Manager'} to ${planningQuery.location || 'factory'}\n`;
                            plannerActions += `[·] Arrange safety and protocol for the visit\n`;
                            plannerActions += `[·] Prepare welcome arrangements at ${planningQuery.location || 'factory'}\n`;
                            if (locationInfo && locationInfo.description) {
                                plannerActions += `[·] Review location details: ${locationInfo.description}\n`;
                            }
                            plannerActions += `[·] Coordinate with factory supervisors\n`;
                            plannerActions += `[·] Arrange accommodation if needed\n`;
                            plannerActions += `[·] Notify quality control department about the visit\n`;
                            if (planningQuery.date) {
                                plannerActions += `[·] Confirm visit date: ${planningQuery.date}\n`;
                            }
                            if (planningQuery.time) {
                                plannerActions += `[·] Schedule arrival time: ${planningQuery.time}\n`;
                            }
                            plannerActions += `[·] Prepare quality reports for the visit\n`;
                            plannerActions += `[·] Arrange documentation if required\n`;

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

                            addMessage('assistant', `I've created a plan for the inspection. Check your planner actions.`, true); // Enable typewriter
                            return;
                        } else if (planningQuery.type === 'event-planning') {
                            // Get event data from mock data
                            const eventData = DataLookupService.searchEvents(query);
                            const eventInfo = eventData.data.length > 0 ? eventData.data[0] : null;

                            // Create rich card data for event planning
                            const eventCardData = {
                                visitor: "Production Event",
                                title: planningQuery.eventType || "Event",
                                dateTime: `${planningQuery.date || 'TBD'} at ${eventInfo?.time || 'TBD'}`,
                                location: eventInfo?.location || "Main Factory Complex",
                                protocolLevel: planningQuery.vipAssociation ? "high" : "standard",
                                delegationSize: planningQuery.vipAssociation ? "Multiple Inspection Teams" : "~100 persons",
                                leadEscort: planningQuery.vipAssociation ? "Operations Manager" : "Production Department",
                                securityStatus: planningQuery.vipAssociation ? "Briefed & Ready" : "Standard Protocol",
                                todayHighlights: eventInfo ? [
                                    { time: '07:00 AM', description: `Commencement of ${planningQuery.eventType || 'event'} with quality checks.` },
                                    { time: '09:00 AM', description: 'Production start and initial sampling.' },
                                    { time: '11:00 AM', description: planningQuery.vipAssociation ? 'Inspection team participation in the event and quality review.' : 'Main event proceedings.' },
                                    { time: '12:30 PM', description: 'Final quality approval and batch completion.' }
                                ] : [
                                    { time: 'Morning', description: `Preparation for ${planningQuery.eventType || 'event'}.` },
                                    { time: 'Midday', description: 'Main event proceedings.' },
                                    { time: 'Evening', description: 'Conclusion and product distribution.' }
                                ],
                                highlightTitle: planningQuery.date ? `${planningQuery.date.toUpperCase()} | HIGHLIGHTS` : "TODAY | HIGHLIGHTS"
                            };

                            // Create focus-event section
                            const eventCardSection: CanvasSection = {
                                id: `focus-event-${Date.now()}`,
                                title: 'Production Event Brief',
                                content: JSON.stringify(eventCardData),
                                type: 'text',
                                visibleContent: '',
                                isVisible: true
                            };

                            plannerActions = `[·] Prepare ${planningQuery.eventType || 'event'} arrangements\n`;
                            plannerActions += `[·] Coordinate with production department for ${planningQuery.eventType || 'event'}\n`;
                            if (planningQuery.date) {
                                plannerActions += `[·] Confirm event date: ${planningQuery.date}\n`;
                            }
                            if (planningQuery.vipAssociation) {
                                plannerActions += `[·] Arrange inspection protocol and safety\n`;
                                plannerActions += `[·] Coordinate inspection invitations\n`;
                                plannerActions += `[·] Prepare special arrangements for inspection teams\n`;
                            }
                            plannerActions += `[·] Arrange quality testing preparation\n`;
                            plannerActions += `[·] Coordinate documentation and reporting if needed\n`;

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

                        if (actionQuery.action === 'add' && actionQuery.entityType === 'suppliers') {
                            plannerActions = `[·] Add supplier records to system\n`;
                            plannerActions += `[·] Update supplier database\n`;
                            plannerActions += `[·] Notify relevant departments about new suppliers\n`;
                            response = "I've added supplier-related actions to your planner.";
                        } else if (actionQuery.action === 'extend' && actionQuery.recipients) {
                            actionQuery.recipients.forEach(recipient => {
                                plannerActions += `[·] Send invitation to ${recipient}\n`;
                                plannerActions += `[·] Coordinate protocol for ${recipient} visit\n`;
                                plannerActions += `[·] Arrange security briefing for ${recipient}\n`;
                            });
                            response = `I've added invitation actions for ${actionQuery.recipients.join(' and ')} to your planner.`;
                        } else if (actionQuery.action === 'ask' && actionQuery.target === 'inventory department') {
                            const inventoryData = DataLookupService.searchKitchen(query);
                            if (inventoryData.data.length > 0) {
                                response = `**Inventory Information:**\n\n${DataLookupService.formatDataForDisplay(inventoryData)}`;
                            } else {
                                response = "I've requested the inventory from the inventory department. Here's the current information:\n\n";
                                response += "**Sugar Products:**\n";
                                response += "- White Sugar\n";
                                response += "- Brown Sugar\n";
                                response += "- Molasses\n\n";
                                response += "**Raw Materials:**\n";
                                response += "- Cane Stock\n";
                                response += "- Processing Supplies\n";
                                response += "- Packaging Materials\n";
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
                        const inventoryData = DataLookupService.searchKitchen(query);
                        let response = '';

                        if (kitchenQuery.requestType === 'menu') {
                            response = "**Inventory Products:**\n\n";
                            if (kitchenQuery.menuType === 'prasad') {
                                response += "**Sugar Products:**\n";
                                response += "- White Sugar\n";
                                response += "- Brown Sugar\n";
                                response += "- Molasses\n";
                                response += "- Jaggery\n";
                            } else if (kitchenQuery.menuType === 'annadanam') {
                                response += "**Raw Materials:**\n";
                                response += "- Cane Stock\n";
                                response += "- Processing Supplies\n";
                                response += "- Packaging Materials\n";
                                response += "- Quality Testing Kits\n";
                                response += "- Maintenance Supplies\n";
                            } else {
                                response += "**Sugar Products:** White Sugar, Brown Sugar, Molasses, Jaggery\n";
                                response += "**Raw Materials:** Cane Stock, Processing Supplies, Packaging Materials\n";
                            }
                        } else {
                            response = DataLookupService.formatDataForDisplay(inventoryData);
                        }

                        addMessage('assistant', response, true); // Enable typewriter

                        // Generate planner actions for inventory query
                        const plannerActions = generatePlannerActionsFromQuery(query, 'inventory');

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
                                    subTitle: 'Inventory Follow-up',
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

        // Handler 9: Info Query Handler
        if ((isInfoQuery(query) || isSummaryQuery(query)) && newSections.length === 0) {
                    const infoResult = handleInfoQuery(query);
                    if (infoResult.handled && infoResult.needsAsyncProcessing) {
                        setTimeout(() => {
                            if (infoResult.response) {
                                addMessage('assistant', infoResult.response, true);
                            }
                            if (infoResult.sections) {
                                setSections(prev => addSections(prev, infoResult.sections!));
                                if (infoResult.sections.length > 0) {
                                    setTimeout(() => {
                                        const firstSectionIndex = prev.length;
                                        setCurrentSectionIndex(firstSectionIndex);
                                        setTypingIndex(0);
                                    }, 100);
                                }
                            }
                            setStatus('complete');
                        }, 1200);
                        return;
                    }
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
                                return [...prev, ...plannerRequestResult.sections];
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
                } else if (lowercaseQuery.includes('factory manager') || lowercaseQuery.includes('quality inspector')) {
                    // Factory Manager / Quality Inspector Logic
                    const isFieldVisit = lowercaseQuery.includes('field') || lowercaseQuery.includes('farm');

                    if (options?.onVIPVisitParsed) {
                        options.onVIPVisitParsed({
                            visitor: "Factory Manager",
                            title: "Operations Manager & Quality Inspector",
                            date: isFieldVisit ? new Date() : new Date(new Date().setDate(new Date().getDate() + 1)),
                            time: isFieldVisit ? "16:00" : "17:00",
                            location: isFieldVisit ? "Cane Field" : "Main Factory Entrance",
                            protocolLevel: "maximum",
                            confidence: 1.0
                        });
                    }

                    const managerData = {
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

                    const fieldVisitPlannerContent = `[·] Confirm Factory Manager arrival & reception protocol
[·] Align factory coordination & travel readiness
[·] Prepare inspection route & movement path inside factory
[·] Confirm quality control team availability
[·] Prepare inspection checklist & sampling equipment
[·] Inform factory supervisors & senior staff
[·] Activate safety protocols & volunteer arrangement
[·] Coordinate sugar product preparation (sample batch)
[·] Ensure protocol & security alignment
[·] Conduct pre-arrival safety readiness check (3:30 PM)`;

                    newSections = [
                        {
                            id: 'focus-manager',
                            title: 'Factory Manager Inspection Brief',
                            content: JSON.stringify(managerData),
                            type: 'text',
                            visibleContent: '',
                            isVisible: false
                        },
                        {
                            id: 'planner-manager',
                            title: 'Your Planner Actions',
                            subTitle: isFieldVisit ? 'Field Inspection Plan' : 'Factory Tour Plan',
                            content: isFieldVisit ? fieldVisitPlannerContent : '[·] Arrange factory tour at main entrance\n[·] Coordinate production line inspection\n[·] Ensure quality clearance for production areas\n[·] Prepare production reports for review',
                            type: 'list',
                            visibleContent: '',
                            isVisible: false
                        }
                    ];

                } else if (lowercaseQuery.includes('batch') || lowercaseQuery.includes('production') || lowercaseQuery.includes('crushing')) {
                    // Production Batch logic
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

                        newSections = [
                            {
                                id: 'focus-batch',
                                title: 'Production Batch Brief: Special Batch',
                                content: JSON.stringify(batchData),
                                type: 'text',
                                visibleContent: '',
                                isVisible: false
                            },
                            {
                                id: 'planner-batch',
                                title: 'Your Planner Actions',
                                subTitle: 'Special Batch Plan (Feb 3rd)',
                                content: `[·] Confirm batch schedule, timing & duration
[·] Assign production supervisor, quality team & operators
[·] Prepare complete crushing unit & production line
[·] Verify quality testing equipment readiness
[·] Align inspection protocol, sampling & batch testing
[·] Coordinate sugar product & inventory preparation plan
[·] Prepare supplier & farmer coordination arrangement
[·] Notify factory supervisors & quality oversight committee
[·] Deploy staff & volunteers for batch support operations
[·] Conduct pre-batch safety readiness review (2nd Feb)`,
                                type: 'list',
                                visibleContent: '',
                                isVisible: false
                            }
                        ];
                    } else {
                        newSections = [
                            {
                                id: 'focus-event',
                                title: 'Event Brief: Production Batch',
                                content: 'The production batch is scheduled to commence at 7:00 AM tomorrow at the crushing unit. Quality control team has arrived. Final approval is scheduled for 12:30 PM on Sunday.',
                                type: 'text',
                                visibleContent: '',
                                isVisible: false
                            },
                            {
                                id: 'planner-batch',
                                title: 'Your Planner Actions',
                                subTitle: 'Batch Preparation',
                                content: '[·] Inspect crushing unit arrangements and safety\n[·] Verify stock of 500kg cane and 1000kg processing capacity\n[·] Coordinate staffing for production line\n[·] Setup quality control station near main gate',
                                type: 'list',
                                visibleContent: '',
                                isVisible: false
                            }
                        ];
                    }

                } else if (lowercaseQuery.includes('maintenance') || lowercaseQuery.includes('renovation') || lowercaseQuery.includes('infrastructure')) {
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
                            subTitle: 'Maintenance Milestones',
                            content: `[·] Audit current equipment stock and utilization
[·] Approve stage-3 maintenance progress report
[·] Schedule safety transfer of completed components
[·] Finalize production closure window for installation
[·] Arrange documentation photography of progress`,
                            type: 'list',
                            visibleContent: '',
                            isVisible: false
                        }
                    ];
                    addMessage('assistant', "Project status updated. I've added the maintenance milestones to your planner.", true); // Enable typewriter

                } else if (lowercaseQuery.includes('season') || lowercaseQuery.includes('harvest') || lowercaseQuery.includes('crushing season')) {
                    // Production Season preparation
                    const isPeakSeason = lowercaseQuery.includes('peak') || lowercaseQuery.includes('crushing season');
                    const isStatusQuery = lowercaseQuery.includes('progress') || lowercaseQuery.includes('status') || lowercaseQuery.startsWith('show') || lowercaseQuery.includes('view');

                    if (isPeakSeason) {
                        const seasonData = {
                            title: "Crushing Season 2024",
                            subTitle: "Duration: Oct 3 - Oct 12, 2024 | Expected: 50,000+ Tons Daily",
                            highlightTitle: "SEASON | KEY HIGHLIGHTS",
                            highlights: [
                                { time: 'Week 1', description: 'Season commencement, initial cane intake setup.' },
                                { time: 'Week 4', description: 'Peak production period, maximum capacity operations.' },
                                { time: 'Week 10', description: 'Season wind-down, final batch processing.' }
                            ]
                        };

                        newSections = [
                            {
                                id: 'focus-season',
                                title: 'Production Season Brief',
                                content: JSON.stringify(seasonData),
                                type: 'text',
                                visibleContent: '',
                                isVisible: false
                            },
                            {
                                id: 'planner-season',
                                title: 'Your Planner Actions',
                                subTitle: 'Season Execution Roadmap',
                                content: `[·] Verify production schedule for all 10 weeks
[·] Finalize cane procurement for peak season
[·] Deploy additional quality control staff
[·] Setup temporary storage facilities at 3 locations
[·] Coordinate with transport for cane delivery services`,
                                type: 'list',
                                visibleContent: '',
                                isVisible: false
                            }
                        ];
                        addMessage('assistant', "I've generated the crushing season execution roadmap and briefing.", true); // Enable typewriter
                    } else {
                        newSections = [
                            {
                                id: 'focus-summary',
                                title: 'Season Preparation Status',
                                content: 'Overall preparation is 85% complete. The main production line for Week 1 is ready. Quality control barriers are installed. Cane supplies are stocked for the first 3 weeks.',
                                type: 'text',
                                visibleContent: '',
                                isVisible: false
                            }
                        ];

                        if (!isStatusQuery) {
                            newSections.push({
                                id: 'planner-season',
                                title: 'Your Planner Actions',
                                subTitle: 'Season Readiness',
                                content: '[·] Final inspection of Cane Yard A\n[·] Review quality control coverage with Quality Manager\n[·] Suppliers meeting for cane delivery schedules\n[·] Equipment safety audit of production line',
                                type: 'list',
                                visibleContent: '',
                                isVisible: false
                            });
                        }
                    }

                } else if (lowercaseQuery.includes('approval') || lowercaseQuery.includes('pending')) {
                    const isViewOnly = lowercaseQuery.startsWith('show') || lowercaseQuery.includes('view') || lowercaseQuery.includes('list') || lowercaseQuery.includes('check');

                    const focusContent = 'You have 3 high-priority approvals pending for the crushing unit equipment upgrade. Delay may impact the upcoming production season schedule.';

                    newSections = [
                        { id: 'focus-approval', title: 'Approval Briefing', content: focusContent, type: 'text', visibleContent: '', isVisible: false }
                    ];

                    if (!isViewOnly) {
                        newSections.push({
                            id: 'approval-steps',
                            title: 'Your Planner Actions',
                            content: '[·] Review Production Manager\'s technical request\n[·] Verify equipment warranty coverage extension\n[·] Confirm maintenance team availability for Jan 15',
                            type: 'list',
                            visibleContent: '',
                            isVisible: false
                        });
                    }
                } else if (lowercaseQuery.startsWith('schedule') || lowercaseQuery.startsWith('review') || lowercaseQuery.startsWith('plan') && !lowercaseQuery.includes('action')) {
                    // Factory Admin INFORMATION / APPOINTMENT INTENT
                    if (lowercaseQuery.includes('production batch')) {
                        // Special handling for the specific event if needed, or fall through to generic
                    }

                    let cardType = 'appointment';
                    if (lowercaseQuery.includes('review')) cardType = 'review';
                    else if (lowercaseQuery.includes('event') || lowercaseQuery.includes('batch')) cardType = 'event';
                    else if (lowercaseQuery.includes('quality') || lowercaseQuery.includes('inspection')) cardType = 'inspection';

                    // Mock Extract subjects
                    const subject = query.replace(/^(schedule|review|plan)\s+/i, '').split(' on ')[0].split(' at ')[0];

                    const cardData = {
                        type: cardType,
                        subject: subject.charAt(0).toUpperCase() + subject.slice(1),
                        dateTime: "Tomorrow, 10:00 AM", // Mock logic
                        intent: "Align key stakeholders on execution roadmap and identify blockers.",
                        plannedBy: "Factory Admin",
                        visibility: "Executive"
                    };

                    newSections = [
                        {
                            id: 'focus-admin-card',
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
                    if (cleanDirective.toLowerCase().includes('quality') || cleanDirective.toLowerCase().includes('inspection')) dept = 'Quality Control';
                    else if (cleanDirective.toLowerCase().includes('finance') || cleanDirective.toLowerCase().includes('money')) dept = 'Finance';
                    else if (cleanDirective.toLowerCase().includes('production') || cleanDirective.toLowerCase().includes('crushing')) dept = 'Production';
                    else if (cleanDirective.toLowerCase().includes('inventory') || cleanDirective.toLowerCase().includes('storage')) dept = 'Inventory';

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

                } else if (lowercaseQuery.includes('auditor') && (lowercaseQuery.includes('government') || lowercaseQuery.includes('visit'))) {
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

                    newSections = [
                        {
                            id: 'focus-auditor',
                            title: 'Inspection Protocol Brief: Government Auditor Visit',
                            content: JSON.stringify(auditorData),
                            type: 'text',
                            visibleContent: '',
                            isVisible: false
                        },
                        {
                            id: 'planner-auditor',
                            title: 'Your Planner Actions',
                            subTitle: 'Auditor Inspection Plan',
                            content: `[·] Coordinate with government compliance office
[·] Arrange high-priority safety escort from entry
[·] Reserve Executive Conference Room for meeting
[·] Prepare compliance documentation at main gate
[·] Ensure inspection-ready corridor during factory tour`,
                            type: 'list',
                            visibleContent: '',
                            isVisible: false
                        }
                    ];
                    addMessage('assistant', "I've prepared the inspection protocol briefing and planner actions for the Government Auditor's visit.", true); // Enable typewriter
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
                
                const isVIPOrVisitQuery = lowercaseQuery.includes('inspection') || 
                                          lowercaseQuery.includes('auditor') || 
                                          lowercaseQuery.includes('visit') ||
                                          lowercaseQuery.includes('supplier') ||
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
                // Informational query - just provide a chat response
                const responses = [
                    "Based on your current planner, I recommend coordinating with the relevant department heads to ensure smooth execution.",
                    "This action requires careful coordination with security and protocol teams. I suggest scheduling a brief alignment meeting.",
                    "For this task, you'll want to verify availability and resource allocation before proceeding.",
                    "I'd recommend breaking this down into smaller sub-tasks and assigning specific owners to each."
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessage('assistant', randomResponse, true);
                setStatus('complete');
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

