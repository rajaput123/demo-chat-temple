/**
 * Focus Card Router Component
 * 
 * Routes to appropriate card component based on focusSection.id.
 * Replaces the massive IIFE from MainCanvas for better maintainability.
 */

import React from 'react';
import { CanvasSection } from '@/hooks/useSimulation';
import { VIPVisit } from '@/types/vip';
import { Employee } from '@/types/employee';
import { Department } from '@/types/department';
import { CEOCard } from './CEOCard';
import { RichCard } from './RichCard';
import { SectionRenderer } from '../SectionRenderer';
import AppointmentsListView from '@/components/appointments/AppointmentsListView';
import ApprovalsListView from '@/components/dashboard/ApprovalsListView';
import VIPVisitsListView from '@/components/dashboard/VIPVisitsListView';
import FinanceSummaryView from '@/components/dashboard/FinanceSummaryView';
import AlertsListView from '@/components/dashboard/AlertsListView';

interface FocusCardRouterProps {
    focusSection: CanvasSection | undefined;
    vipVisits: VIPVisit[];
    employees: Employee[];
    departments: Department[];
}

export const FocusCardRouter = React.memo(({ focusSection, vipVisits, employees, departments }: FocusCardRouterProps) => {
    if (!focusSection) {
        const filter = 'today';
        return <AppointmentsListView filter={filter} />;
    }

    const filter = focusSection.title?.toLowerCase().includes('tomorrow') ? 'tomorrow' : 'today';

    // Handle CEO Cards (Executive Mode)
    if (focusSection.id === 'focus-ceo-card') {
        try {
            const cardData = JSON.parse(focusSection.content);
            return <CEOCard cardData={cardData} />;
        } catch (e) {
            return <div className="p-6 text-red-500">Error rendering CEO Card</div>;
        }
    }

    // Handle approvals
    if (focusSection.id === 'focus-approval' || focusSection.id === 'focus-approvals') {
        return <ApprovalsListView filter={filter} />;
    }

    // Handle VIP visits
    if (focusSection.id === 'focus-vip') {
        return <VIPVisitsListView vipVisits={vipVisits} filter={filter} />;
    }

    // Handle appointments
    if (focusSection.id === 'focus-appointments') {
        return <AppointmentsListView filter={filter} />;
    }

    // Handle finance
    if (focusSection.id === 'focus-finance') {
        return <FinanceSummaryView filter={filter} />;
    }

    // Handle alerts
    if (focusSection.id === 'focus-alert') {
        return <AlertsListView filter={filter} />;
    }

    // Handle visit/event/summary cards (adhoc visits, events, summaries)
    if (focusSection.id?.startsWith('focus-visit') || 
        focusSection.id?.startsWith('focus-event') || 
        focusSection.id?.startsWith('focus-summary')) {
        
        // If content is available (parsed data), render rich card
        if (focusSection.content && focusSection.content.length > 0 && !focusSection.content.includes('Loading')) {
            try {
                const cardData = JSON.parse(focusSection.content);
                const cardType = focusSection.id?.startsWith('focus-visit') ? 'visit' :
                                 focusSection.id?.startsWith('focus-event') ? 'event' :
                                 'summary';
                return <RichCard cardData={cardData} cardType={cardType} />;
            } catch (e) {
                // Fallback: render as plain text card
                return (
                    <div className="p-6 md:p-8 bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 text-white animate-fadeIn">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="px-2 py-1 bg-white/10 rounded text-[10px] font-black uppercase tracking-widest text-white/80">
                                {focusSection.title || 'Protocol Brief'}
                            </div>
                        </div>
                        <p className="text-sm font-medium leading-relaxed text-white/90">{focusSection.content}</p>
                    </div>
                );
            }
        }
    }

    // Handle info sections (plan, summary, complete info, next info)
    if (focusSection.id?.startsWith('focus-info-')) {
        // Try to parse JSON content and render as RichCard
        // Use visibleContent if available (after typewriter), otherwise use content
        const contentToParse = focusSection.visibleContent || focusSection.content;
        if (contentToParse && contentToParse.length > 0 && !contentToParse.includes('Loading')) {
            try {
                const cardData = JSON.parse(contentToParse);
                // Check if it has the RichCard format (highlightTitle and todayHighlights)
                if (cardData.highlightTitle && cardData.todayHighlights) {
                    return <RichCard cardData={cardData} cardType="summary" />;
                }
            } catch (e) {
                // If JSON parsing fails, fall through to SectionRenderer
            }
        }
        // Fallback to SectionRenderer if content is not JSON or parsing fails
        return (
            <div className="p-6 md:p-8">
                <SectionRenderer section={focusSection} employees={employees} departments={departments} />
            </div>
        );
    }

    // Handle custom focus areas (Events, Summaries) using standard renderer
    if (focusSection.id === 'focus-event' || focusSection.id === 'focus-summary') {
        return (
            <div className="p-6 md:p-8">
                <SectionRenderer section={focusSection} employees={employees} departments={departments} />
            </div>
        );
    }

    // Default fallback to appointments
    return <AppointmentsListView filter={filter} />;
});

FocusCardRouter.displayName = 'FocusCardRouter';

