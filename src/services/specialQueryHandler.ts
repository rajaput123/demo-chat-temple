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

        // Try Factory Manager visit handler
        const managerResult = this.handleFactoryManagerVisit(query);
        if (managerResult) return managerResult;

        // Try Production Batch event handler
        const batchResult = this.handleProductionBatchEvent(query);
        if (batchResult) return batchResult;

        // Try Crushing Season progress handler
        const seasonResult = this.handleCrushingSeasonProgress(query);
        if (seasonResult) return seasonResult;

        return null;
    }

    /**
     * Handle Supplier/Inspector visit queries (e.g., "Tomorrow 9 AM, Quality Inspector is visiting Factory")
     */
    static handleVIPVisit(query: string, onVIPVisitParsed?: (vip: ParsedVIPVisit) => void): SpecialQueryResult | null {
        const lowercaseQuery = query.toLowerCase();
        
        // Check if this is a supplier/inspection visit query
        if (!lowercaseQuery.includes('supplier') && 
            !lowercaseQuery.includes('auditor') && 
            !lowercaseQuery.includes('inspection') &&
            !lowercaseQuery.includes('visit')) {
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

            // Format date
            const dateStr = parsedVisit.date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });

            // Create info card data with brown/amber format
            const infoCardData = {
                highlightTitle: "SUPPLIER INSPECTION | HIGHLIGHTS",
                todayHighlights: [
                    { 
                        time: '07:00 AM', 
                        description: 'Factory Manager will perform the morning production review as part of daily operations.' 
                    },
                    { 
                        time: parsedVisit.time || '09:00 AM', 
                        description: `Supplier inspection is scheduled for ${parsedVisit.visitor}${parsedVisit.title ? ` (${parsedVisit.title})` : ''}, with special protocol arrangements in place.` 
                    },
                    { 
                        time: '09:00 AM', 
                        description: 'The production batch quality check will be conducted in the crushing unit.' 
                    },
                    { 
                        time: '04:00 PM', 
                        description: 'Factory Manager will deliver the evening operations briefing, offering guidance and updates to staff.' 
                    }
                ]
            };

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
            const plannerActions = VIPPlannerService.formatActionsForPlanner(actions);

            return {
                infoCardData: JSON.stringify(infoCardData),
                plannerActions,
                sectionId: 'focus-visit-supplier',
                cardTitle: 'Supplier Inspection Brief',
                planTitle: 'Inspection Plan'
            };
        }

        return null;
    }

    /**
     * Handle Factory Manager adhoc visit queries (e.g., "Plan adhoc visit of Factory Manager to Cane Field - today @ 4:00 pm")
     */
    static handleFactoryManagerVisit(query: string): SpecialQueryResult | null {
        const lowercaseQuery = query.toLowerCase();
        
        // Check if this is a Factory Manager visit planning query
        if (!lowercaseQuery.includes('plan') || 
            (!lowercaseQuery.includes('factory manager') && !lowercaseQuery.includes('quality inspector'))) {
            return null;
        }

        // Parse using flexible query parser
        const planningQuery = FlexibleQueryParser.parsePlanningQuery(query);
        
        if (planningQuery && planningQuery.type === 'adhoc-visit' && planningQuery.person) {
            const visitTime = planningQuery.time || '4:00 PM';
            const visitLocation = planningQuery.location || 'Cane Field';
            const visitDate = planningQuery.date || 'Today';

            // Create info card data
            const infoCardData = {
                highlightTitle: "INSPECTION | HIGHLIGHTS",
                todayHighlights: [
                    { 
                        time: this.calculateTimeBefore(visitTime, 1), 
                        description: `Pre-inspection safety readiness check and final preparations for ${planningQuery.person}'s visit to ${visitLocation}.` 
                    },
                    { 
                        time: visitTime, 
                        description: `Arrival at ${visitLocation} and inspection briefing for ${planningQuery.person}.` 
                    },
                    { 
                        time: this.calculateTimeAfter(visitTime, 1), 
                        description: `Factory tour and quality inspection.` 
                    },
                    { 
                        time: this.calculateTimeAfter(visitTime, 2), 
                        description: `Review meeting with suppliers and farmers.` 
                    }
                ]
            };

            // Generate planner actions
            const plannerActions = [
                `[·] Coordinate travel arrangements for ${planningQuery.person} to ${visitLocation}`,
                `[·] Arrange safety and protocol for the visit`,
                `[·] Prepare welcome arrangements at ${visitLocation}`,
                `[·] Coordinate with factory supervisors`,
                `[·] Arrange accommodation if needed`,
                `[·] Notify quality control department about the visit`,
                `[·] Confirm visit date: ${visitDate}`,
                `[·] Schedule arrival time: ${visitTime}`,
                `[·] Prepare quality reports for the visit`,
                `[·] Arrange documentation if required`
            ].join('\n');

            return {
                infoCardData: JSON.stringify(infoCardData),
                plannerActions,
                sectionId: 'focus-visit-manager',
                cardTitle: 'Inspection Protocol Brief',
                planTitle: 'Inspection Plan'
            };
        }

        return null;
    }

    /**
     * Handle Production Batch event planning queries (e.g., "Plan for production batch on 3rd Feb associated with inspection")
     */
    static handleProductionBatchEvent(query: string): SpecialQueryResult | null {
        const lowercaseQuery = query.toLowerCase();
        
        // Check if this is a production batch event planning query
        if (!lowercaseQuery.includes('plan') || 
            (!lowercaseQuery.includes('batch') && !lowercaseQuery.includes('production'))) {
            return null;
        }

        // Parse using flexible query parser
        const planningQuery = FlexibleQueryParser.parsePlanningQuery(query);
        
        if (planningQuery && planningQuery.type === 'event-planning' && planningQuery.eventType) {
            const eventDate = planningQuery.date || 'TBD';
            const hasInspection = planningQuery.vipAssociation || false;

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
                        description: `Commencement of ${planningQuery.eventType} with quality checks.` 
                    },
                    { 
                        time: '09:00 AM', 
                        description: 'Production start and initial sampling.' 
                    },
                    { 
                        time: '11:00 AM', 
                        description: hasInspection 
                            ? 'Inspection team participation in the event and quality review.' 
                            : 'Main event proceedings.' 
                    },
                    { 
                        time: '12:30 PM', 
                        description: 'Final quality approval and batch completion.' 
                    }
                ]
            };

            // Generate planner actions
            const plannerActions = [
                `[·] Prepare ${planningQuery.eventType} arrangements`,
                `[·] Coordinate with production department for ${planningQuery.eventType}`,
                `[·] Confirm event date: ${eventDate}`,
                ...(hasInspection ? [
                    `[·] Arrange inspection protocol and safety`,
                    `[·] Coordinate inspection invitations`,
                    `[·] Prepare special arrangements for inspection teams`
                ] : []),
                `[·] Arrange quality testing preparation`,
                `[·] Coordinate documentation and reporting if needed`,
                `[·] Confirm staffing for production line`,
                `[·] Secure production area perimeter${hasInspection ? ' for inspection entry' : ''}`,
                `[·] Arrange for specialized quality testing equipment`,
                `[·] Coordinate with inventory department for sugar product distribution`
            ].join('\n');

            return {
                infoCardData: JSON.stringify(infoCardData),
                plannerActions,
                sectionId: 'focus-event-batch',
                cardTitle: 'Production Event Brief',
                planTitle: 'Event Plan'
            };
        }

        return null;
    }

    /**
     * Handle Crushing Season progress queries (e.g., "Show me the progress of crushing season preparation actions--summary")
     */
    static handleCrushingSeasonProgress(query: string): SpecialQueryResult | null {
        const lowercaseQuery = query.toLowerCase();
        
        // Check if this is a crushing season progress query
        if (!lowercaseQuery.includes('season') && !lowercaseQuery.includes('harvest') && !lowercaseQuery.includes('progress')) {
            return null;
        }

        // Parse using flexible query parser
        const progressQuery = FlexibleQueryParser.parseProgressQuery(query);
        
        if (progressQuery && (progressQuery.festivalName === 'Crushing Season' || progressQuery.festivalName === 'Season')) {
            // Create info card data with progress summary
            const infoCardData = {
                highlightTitle: "PROGRESS | HIGHLIGHTS",
                todayHighlights: [
                    { 
                        time: 'Status', 
                        description: 'Overall preparation is 85% complete. Main production line for Week 1 is ready.' 
                    },
                    { 
                        time: 'Quality Control', 
                        description: 'Quality control barriers are installed. Inspection staff deployed.' 
                    },
                    { 
                        time: 'Cane Supply', 
                        description: 'Cane supplies are stocked for the first 3 weeks. Procurement for remaining weeks in progress.' 
                    },
                    { 
                        time: 'Actions', 
                        description: '12 of 15 critical actions completed. 3 pending items require attention.' 
                    }
                ]
            };

            // Generate remaining planner actions
            const plannerActions = [
                `[·] Verify production schedule for all 10 weeks`,
                `[·] Finalize cane procurement for peak season`,
                `[·] Deploy additional quality control staff`,
                `[·] Setup temporary storage facilities at 3 locations`,
                `[·] Coordinate with transport for cane delivery services`,
                `[·] Complete remaining 3 critical action items`,
                `[·] Review and approve final quality arrangements`,
                `[·] Confirm documentation and reporting teams`
            ].join('\n');

            return {
                infoCardData: JSON.stringify(infoCardData),
                plannerActions,
                sectionId: 'focus-summary-season',
                cardTitle: 'Season Preparation Status',
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

