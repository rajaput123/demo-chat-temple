/**
 * Special Query Handler Service
 * 
 * Handles specific query types with consistent brown/amber info cards
 * and planner actions with typewriter effect.
 */

import { QueryParserService } from './queryParserService';
import { FlexibleQueryParser, ParsedPlanningQuery, ParsedProgressQuery } from './flexibleQueryParser';
import { VIPPlannerService } from './vipPlannerService';
import { ParsedVIPVisit } from '@/types/vip';
import { generateInfoCardContent } from './infoCardContentGenerator';
import { generateCEOActions, formatActionsForPlanner } from './ceoActionGenerator';

export interface SpecialQueryResult {
    infoCardData: string; // JSON string with card data
    plannerActions: string; // Formatted string with [·] bullet points
    sectionId: string; // Unique ID for focus section
    cardTitle: string; // Title for the card section
    planTitle?: string; // Subtitle for planner section
}

export class SpecialQueryHandler {
    /**
     * Main entry point - tries all handlers and returns first match
     */
    static handleQuery(query: string, onVIPVisitParsed?: (vip: ParsedVIPVisit) => void): SpecialQueryResult | null {
        const lowercaseQuery = query.toLowerCase();

        // Try VIP visit handler first
        const vipResult = this.handleVIPVisit(query, onVIPVisitParsed);
        if (vipResult) return vipResult;

        // Try Jagadguru visit handler
        const jagadguruResult = this.handleJagadguruVisit(query);
        if (jagadguruResult) return jagadguruResult;

        // Try Yaga event handler
        const yagaResult = this.handleYagaEvent(query);
        if (yagaResult) return yagaResult;

        // Try Navaratri progress handler
        const navaratriResult = this.handleNavaratriProgress(query);
        if (navaratriResult) return navaratriResult;

        return null;
    }

    /**
     * Handle VIP visit queries (e.g., "Tomorrow 9 AM, Prime Minister Modi is visiting Sringeri")
     */
    static handleVIPVisit(query: string, onVIPVisitParsed?: (vip: ParsedVIPVisit) => void): SpecialQueryResult | null {
        const lowercaseQuery = query.toLowerCase();
        
        // Check if this is a VIP visit query
        if (!lowercaseQuery.includes('vip') && 
            !lowercaseQuery.includes('minister') && 
            !lowercaseQuery.includes('visit') &&
            !lowercaseQuery.includes('prime minister')) {
            return null;
        }

        // Skip if it's a "show" query (handled elsewhere)
        if (lowercaseQuery.startsWith('show') || lowercaseQuery.includes('view') || lowercaseQuery.includes('list')) {
            return null;
        }

        // Parse VIP visit using NLP
        const parseResult = QueryParserService.parseQuery(query);
        
        if (parseResult.intent === 'vip-visit' && parseResult.data) {
            const parsedVisit = parseResult.data as ParsedVIPVisit;
            
            // Call callback if provided
            if (onVIPVisitParsed) {
                onVIPVisitParsed(parsedVisit);
            }

            // Use temple response format: Generate info card from calendar aggregation
            const infoCardContent = generateInfoCardContent(query);
            const ceoActions = generateCEOActions(query);
            const plannerActions = formatActionsForPlanner(ceoActions);
            
            const infoCardData = infoCardContent;

            return {
                infoCardData: JSON.stringify(infoCardData),
                plannerActions,
                sectionId: 'focus-visit-vip',
                cardTitle: infoCardData.highlightTitle || 'VIP Protocol Brief',
                planTitle: 'VIP Plan'
            };
        }

        return null;
    }

    /**
     * Handle Jagadguru adhoc visit queries (e.g., "Plan adhoc visit of Jagadgurugalu to Kigga - today @ 4:00 pm")
     */
    static handleJagadguruVisit(query: string): SpecialQueryResult | null {
        const lowercaseQuery = query.toLowerCase();
        
        // Check if this is a Jagadguru visit planning query
        if (!lowercaseQuery.includes('plan') || 
            (!lowercaseQuery.includes('jagadgurugalu') && !lowercaseQuery.includes('gurugalu') && !lowercaseQuery.includes('swamiji'))) {
            return null;
        }

        // Parse using flexible query parser
        const planningQuery = FlexibleQueryParser.parsePlanningQuery(query);
        
        if (planningQuery && planningQuery.type === 'adhoc-visit' && planningQuery.person) {
            const visitTime = planningQuery.time || '4:00 PM';
            const visitLocation = planningQuery.location || 'Kigga';
            const visitDate = planningQuery.date || 'Today';

            // Create info card data
            const infoCardData = {
                highlightTitle: "VISIT | HIGHLIGHTS",
                todayHighlights: [
                    { 
                        time: this.calculateTimeBefore(visitTime, 1), 
                        description: `Pre-arrival shubha samaya readiness check and final preparations for ${planningQuery.person}'s visit to ${visitLocation}.` 
                    },
                    { 
                        time: visitTime, 
                        description: `Arrival at ${visitLocation} and Poornakumbha Swagata for ${planningQuery.person}.` 
                    },
                    { 
                        time: this.calculateTimeAfter(visitTime, 1), 
                        description: `Darshan and special pooja at the sanctum.` 
                    },
                    { 
                        time: this.calculateTimeAfter(visitTime, 2), 
                        description: `Ashirvachana and meeting with devotees.` 
                    }
                ]
            };

            // Generate planner actions
            const plannerActions = [
                `[·] Coordinate travel arrangements for ${planningQuery.person} to ${visitLocation}`,
                `[·] Arrange security and protocol for the visit`,
                `[·] Prepare welcome arrangements at ${visitLocation}`,
                `[·] Coordinate with local temple authorities`,
                `[·] Arrange accommodation if needed`,
                `[·] Notify security department about the visit`,
                `[·] Confirm visit date: ${visitDate}`,
                `[·] Schedule arrival time: ${visitTime}`,
                `[·] Prepare special prasad for the visit`,
                `[·] Arrange media coverage if required`
            ].join('\n');

            return {
                infoCardData: JSON.stringify(infoCardData),
                plannerActions,
                sectionId: 'focus-visit-jagadguru',
                cardTitle: 'Visit Protocol Brief',
                planTitle: 'Visit Plan'
            };
        }

        return null;
    }

    /**
     * Handle Yaga event planning queries (e.g., "Plan for sahasra chandi yaga on 3rd Feb associated with VIP")
     */
    static handleYagaEvent(query: string): SpecialQueryResult | null {
        const lowercaseQuery = query.toLowerCase();
        
        // Check if this is a Yaga event planning query
        if (!lowercaseQuery.includes('plan') || 
            (!lowercaseQuery.includes('yaga') && !lowercaseQuery.includes('chandi'))) {
            return null;
        }

        // Parse using flexible query parser
        const planningQuery = FlexibleQueryParser.parsePlanningQuery(query);
        
        if (planningQuery && planningQuery.type === 'event-planning' && planningQuery.eventType) {
            const eventDate = planningQuery.date || 'TBD';
            const hasVIP = planningQuery.vipAssociation || false;

            // Format date for display - handle both string and Date objects
            let dateDisplay = 'TBD';
            if (eventDate && typeof eventDate === 'string') {
                dateDisplay = eventDate;
            } else if (eventDate) {
                dateDisplay = String(eventDate);
            }

            // Create info card data
            const infoCardData = {
                highlightTitle: `${dateDisplay.toUpperCase()} | HIGHLIGHTS`,
                todayHighlights: [
                    { 
                        time: '07:00 AM', 
                        description: `Commencement of ${planningQuery.eventType} with Maha Sankalpa and Avahana.` 
                    },
                    { 
                        time: '09:00 AM', 
                        description: 'Ritwik Varanam and start of main rituals.' 
                    },
                    { 
                        time: '11:00 AM', 
                        description: hasVIP 
                            ? 'VIP participation in the event and special darshan flow.' 
                            : 'Main event proceedings.' 
                    },
                    { 
                        time: '12:30 PM', 
                        description: 'Purnahuti, Deeparadhana, and Shanti Mantra Patha.' 
                    }
                ]
            };

            // Generate planner actions
            const plannerActions = [
                `[·] Prepare ${planningQuery.eventType} arrangements`,
                `[·] Coordinate with ritual department for ${planningQuery.eventType}`,
                `[·] Confirm event date: ${eventDate}`,
                ...(hasVIP ? [
                    `[·] Arrange VIP protocol and security`,
                    `[·] Coordinate VIP invitations`,
                    `[·] Prepare special arrangements for VIP guests`
                ] : []),
                `[·] Arrange special prasad preparation`,
                `[·] Coordinate media and documentation if needed`,
                `[·] Confirm seating for 50+ Vedic scholars`,
                `[·] Secure Yaga Shala perimeter${hasVIP ? ' for VIP entry' : ''}`,
                `[·] Arrange for specialized ritual samagri (Chandi Homa specific)`,
                `[·] Coordinate with Annadanam department for special Prasad distribution`
            ].join('\n');

            return {
                infoCardData: JSON.stringify(infoCardData),
                plannerActions,
                sectionId: 'focus-event-yaga',
                cardTitle: 'Event Protocol Brief',
                planTitle: 'Event Plan'
            };
        }

        return null;
    }

    /**
     * Handle Navaratri progress queries (e.g., "Show me the progress of navaratri preparation actions--summary")
     */
    static handleNavaratriProgress(query: string): SpecialQueryResult | null {
        const lowercaseQuery = query.toLowerCase();
        
        // Check if this is a Navaratri progress query
        if (!lowercaseQuery.includes('navaratri') || !lowercaseQuery.includes('progress')) {
            return null;
        }

        // Parse using flexible query parser
        const progressQuery = FlexibleQueryParser.parseProgressQuery(query);
        
        if (progressQuery && progressQuery.festivalName === 'Navaratri') {
            // Create info card data with progress summary
            const infoCardData = {
                highlightTitle: "PROGRESS | HIGHLIGHTS",
                todayHighlights: [
                    { 
                        time: 'Status', 
                        description: 'Overall preparation is 85% complete. Main Alankara for Day 1 is ready.' 
                    },
                    { 
                        time: 'Security', 
                        description: 'Security barriers are installed. Crowd control volunteers deployed.' 
                    },
                    { 
                        time: 'Annadanam', 
                        description: 'Supplies are stocked for the first 3 days. Procurement for remaining days in progress.' 
                    },
                    { 
                        time: 'Actions', 
                        description: '12 of 15 critical actions completed. 3 pending items require attention.' 
                    }
                ]
            };

            // Generate remaining planner actions
            const plannerActions = [
                `[·] Verify Alankara schedule for all 10 days`,
                `[·] Finalize Annadanam procurement for 5L+ devotees`,
                `[·] Deploy additional 200 crowd control volunteers`,
                `[·] Setup temporary medical camps at 3 locations`,
                `[·] Coordinate with KSRTC for special bus services`,
                `[·] Complete remaining 3 critical action items`,
                `[·] Review and approve final security arrangements`,
                `[·] Confirm media coverage and documentation teams`
            ].join('\n');

            return {
                infoCardData: JSON.stringify(infoCardData),
                plannerActions,
                sectionId: 'focus-summary-navaratri',
                cardTitle: 'Navaratri Preparation Status',
                planTitle: 'Remaining Actions'
            };
        }

        return null;
    }

    /**
     * Helper: Calculate time before given time by hours
     */
    private static calculateTimeBefore(timeStr: string, hours: number): string {
        const timeMatch = timeStr.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)/i);
        if (!timeMatch) return '03:00 PM';
        
        let hour = parseInt(timeMatch[1]);
        const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
        const period = timeMatch[3].toUpperCase();
        
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        
        hour = (hour - hours + 24) % 24;
        
        const newPeriod = hour >= 12 ? 'PM' : 'AM';
        const newHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        
        return `${newHour}:${String(minutes).padStart(2, '0')} ${newPeriod}`;
    }

    /**
     * Helper: Calculate time after given time by hours
     */
    private static calculateTimeAfter(timeStr: string, hours: number): string {
        const timeMatch = timeStr.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)/i);
        if (!timeMatch) return '05:00 PM';
        
        let hour = parseInt(timeMatch[1]);
        const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
        const period = timeMatch[3].toUpperCase();
        
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        
        hour = (hour + hours) % 24;
        
        const newPeriod = hour >= 12 ? 'PM' : 'AM';
        const newHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        
        return `${newHour}:${String(minutes).padStart(2, '0')} ${newPeriod}`;
    }
}

