/**
 * Simple Query Handler
 * 
 * Handles simple standalone queries: "plan", "summary", "complete information", "next information"
 * Generates info sections (top) and action sections (bottom) using real data.
 */

import { CanvasSection } from '@/hooks/useSimulation';
import { isPlanQuery, isSummaryQuery, isCompleteInfoQuery, isNextInfoQuery } from '@/utils/simpleQueryDetector';
import { extractContext } from '@/utils/contextExtractor';
import { extractSubject } from '@/utils/subjectExtractor';
import { formatPlanInfo, formatSummaryInfo, formatCompleteInfo, formatNextInfo } from '@/utils/infoSectionFormatters';
import { createSection, createPlannerSection } from '@/services/sectionManager';
import { DataLookupService } from '@/services/dataLookupService';
import { generatePlannerActionsFromQuery } from '@/utils/plannerHelpers';
import { generateInfoCardContent } from '@/services/infoCardContentGenerator';
import { formatTempleResponse, getQueryType } from '@/services/templeResponseFormatter';
import { aggregateCalendars } from '@/services/calendarAggregator';
import { generateCEOActions, formatActionsForPlanner } from '@/services/ceoActionGenerator';

export interface SimpleQueryResult {
    handled: boolean;
    chatMessage: string;
    infoSection?: CanvasSection;
    actionSection?: CanvasSection;
}

/**
 * Handle simple queries (plan, summary, complete information, next information)
 * Supports both simple queries ("plan") and dynamic queries ("plan for X")
 */
export function handleSimpleQuery(
    query: string,
    currentSections: CanvasSection[]
): SimpleQueryResult {
    const lowercaseQuery = query.toLowerCase().trim();

    // Detect query type and handle accordingly
    if (isPlanQuery(lowercaseQuery)) {
        const subject = extractSubject(query, 'plan');
        return handlePlanQuery(currentSections, subject, query);
    }
    if (isSummaryQuery(lowercaseQuery)) {
        const subject = extractSubject(query, 'summary');
        return handleSummaryQuery(currentSections, subject, query);
    }
    if (isCompleteInfoQuery(lowercaseQuery)) {
        const subject = extractSubject(query, 'complete');
        return handleCompleteInfoQuery(currentSections, subject, query);
    }
    if (isNextInfoQuery(lowercaseQuery)) {
        const subject = extractSubject(query, 'next');
        return handleNextInfoQuery(currentSections, subject, query);
    }

    return { handled: false, chatMessage: '' };
}

/**
 * Handle "plan" query
 * Supports both "plan" and "plan for X"
 * Uses temple response format: Info card + CEO actions
 */
function handlePlanQuery(
    currentSections: CanvasSection[],
    subject: string | null,
    originalQuery: string
): SimpleQueryResult {
    // Generate info card content using calendar aggregation
    const infoCardContent = generateInfoCardContent(originalQuery);
    
    // Generate CEO actions
    const ceoActions = generateCEOActions(originalQuery);
    const plannerActions = formatActionsForPlanner(ceoActions);

    // Create info section with RichCard format
    const infoSection: CanvasSection = createSection(
        `focus-info-plan-${Date.now()}`,
        infoCardContent.highlightTitle,
        JSON.stringify(infoCardContent),
        'text'
    );

    // Create action section with CEO actions
    const actionSection = createPlannerSection(
        plannerActions,
        'Plan Actions'
    );

    return {
        handled: true,
        chatMessage: "Here's your plan",
        infoSection,
        actionSection
    };
}

/**
 * Handle "summary" query
 * Supports both "summary" and "summary of X"
 * Uses temple response format: Info card + CEO actions
 */
function handleSummaryQuery(
    currentSections: CanvasSection[],
    subject: string | null,
    originalQuery: string
): SimpleQueryResult {
    // Generate info card content using calendar aggregation
    const infoCardContent = generateInfoCardContent(originalQuery);
    
    // Generate CEO actions
    const ceoActions = generateCEOActions(originalQuery);
    const plannerActions = formatActionsForPlanner(ceoActions);

    // Create info section with RichCard format
    const infoSection: CanvasSection = createSection(
        `focus-info-summary-${Date.now()}`,
        infoCardContent.highlightTitle,
        JSON.stringify(infoCardContent),
        'text'
    );

    // Create action section with CEO actions
    const actionSection = createPlannerSection(
        plannerActions,
        'Summary Actions'
    );

    return {
        handled: true,
        chatMessage: "Here's the summary",
        infoSection,
        actionSection
    };
}

/**
 * Handle "complete information" query
 * Supports both "complete information" and "complete information about X"
 * Uses temple response format: Info card + CEO actions
 */
function handleCompleteInfoQuery(
    currentSections: CanvasSection[],
    subject: string | null,
    originalQuery: string
): SimpleQueryResult {
    // Generate info card content using calendar aggregation
    const infoCardContent = generateInfoCardContent(originalQuery);
    
    // Generate CEO actions
    const ceoActions = generateCEOActions(originalQuery);
    const plannerActions = formatActionsForPlanner(ceoActions);

    // Create info section with RichCard format
    const infoSection: CanvasSection = createSection(
        `focus-info-complete-${Date.now()}`,
        infoCardContent.highlightTitle,
        JSON.stringify(infoCardContent),
        'text'
    );

    // Create action section with CEO actions
    const actionSection = createPlannerSection(
        plannerActions,
        'Complete Information Actions'
    );

    return {
        handled: true,
        chatMessage: "Here's the complete information",
        infoSection,
        actionSection
    };
}

/**
 * Handle "next information" query
 * Supports both "next information" and "next information for X"
 * Uses temple response format: Info card + CEO actions
 */
function handleNextInfoQuery(
    currentSections: CanvasSection[],
    subject: string | null,
    originalQuery: string
): SimpleQueryResult {
    // Generate info card content using calendar aggregation
    const infoCardContent = generateInfoCardContent(originalQuery);
    
    // Generate CEO actions
    const ceoActions = generateCEOActions(originalQuery);
    const plannerActions = formatActionsForPlanner(ceoActions);

    // Create info section with RichCard format
    const infoSection: CanvasSection = createSection(
        `focus-info-next-${Date.now()}`,
        infoCardContent.highlightTitle,
        JSON.stringify(infoCardContent),
        'text'
    );

    // Create action section with CEO actions
    const actionSection = createPlannerSection(
        plannerActions,
        'Next Information Actions'
    );

    return {
        handled: true,
        chatMessage: "Here's what's next",
        infoSection,
        actionSection
    };
}

