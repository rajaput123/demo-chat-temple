import React, { useEffect, useRef, useState, useMemo } from 'react';
import { CanvasSection, SimulationStatus } from '@/hooks/useSimulation';
import OperationsView from '@/components/operations/OperationsView';
import PeopleView from '@/components/people/PeopleView';
import FinanceView from '@/components/finance/FinanceView';
import AssetManagementView from '@/components/assets/AssetManagementView';
import ProjectsView from '@/components/projects/ProjectsView';
import FileSummaryView from '@/components/dashboard/FileSummaryView';
import { FocusCardRouter } from '@/components/dashboard/cards/FocusCardRouter';
import { SectionRenderer } from '@/components/dashboard/SectionRenderer';
import { DEFAULT_DEPARTMENTS } from '@/constants/departments';
import { mockSringeriEmployees } from '@/data/mockEmployeeData';
import { Employee } from '@/types/employee';
import { VIPVisit } from '@/types/vip';
import { UploadedFile } from '@/types/fileUpload';

interface MainCanvasProps {
    status: SimulationStatus;
    sections: CanvasSection[];
    activeModule?: string;
    vipVisits?: VIPVisit[];
    uploadedFile?: UploadedFile | null;
}


// GlassCard component moved outside to prevent recreation on every render
const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] overflow-hidden transition-all duration-500 hover:shadow-[0_8px_48px_0_rgba(31,38,135,0.1)] hover:bg-white/50 hover:border-neutral-200/50 animate-snappy ${className}`}>
        {children}
    </div>
);

export default function MainCanvas({ status, sections, activeModule = '', vipVisits = [], uploadedFile = null }: MainCanvasProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    // Get employees from employee management (mock data)
    // In production, these would come from a context, API, or employee management module
    const [employees] = useState<Employee[]>(mockSringeriEmployees.filter(emp => emp.isActive));

    // Use memoized departments from constants
    const departments = DEFAULT_DEPARTMENTS;

    // Memoized section computations for performance
    const visibleSections = useMemo(() => 
        sections.filter(s => s.isVisible), 
        [sections]
    );

    const focusSection = useMemo(() => 
        sections.find(s => s.id.startsWith('focus-')) || visibleSections.find(s => s.id.startsWith('focus-')), 
        [sections, visibleSections]
    );

    const insightSections = useMemo(() => 
        visibleSections.filter(s => !s.id.startsWith('focus-')), 
        [visibleSections]
    );

    const plannerSection = useMemo(() => 
        sections.find(s => s.title === 'Your Planner Actions'), 
        [sections]
    );

    useEffect(() => {
        if (status === 'generating') {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [sections, status]);

    // Route to module views - using proper else-if chain for clarity
    if (activeModule === 'Operations') {
        return <OperationsView />;
    } else if (activeModule === 'People') {
        return <PeopleView />;
    } else if (activeModule === 'Finance') {
        return <FinanceView />;
    } else if (activeModule === 'Assets') {
        return <AssetManagementView />;
    } else if (activeModule === 'Projects') {
        return <ProjectsView />;
    }

    // Unified Dashboard Layout for all statuses (idle, generating, complete) when no module is active
    if (!activeModule || activeModule === 'Dashboard') {
        const hasFocus = !!focusSection;
        const hasInsights = insightSections.length > 0;
        const hasPlanner = !!plannerSection;

        return (
            <div className="h-full w-full gamma-light-bg relative overflow-hidden group/canvas">
                <div className="grain-overlay" />

                <div className="relative h-full w-full overflow-auto px-4 sm:px-12 pt-4 sm:pt-6 pb-2 scrollbar-hide">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Header Section */}
                        <div className="animate-fadeIn flex items-end justify-between border-slate-200/60 pb-2">
                            <div>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight ">
                                    Good Morning.
                                </h1>
                            </div>
                        </div>

                        {/* Top Slot: Replaceable Component Area */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] opacity-40">
                                    {hasFocus && focusSection?.title ? focusSection.title : "Today's Appointments"}
                                </h2>
                                <div className={`w-1.5 h-1.5 rounded-full ${hasFocus ? 'bg-earth-600 animate-pulse' : 'bg-slate-200'}`} />
                            </div>

                            <GlassCard className="transition-all duration-500">
                                <FocusCardRouter
                                    focusSection={focusSection}
                                    vipVisits={vipVisits}
                                    employees={employees}
                                    departments={departments}
                                />
                            </GlassCard>
                        </div>

                        {/* Bottom Slot: AI Insight/Next Actions Section (Streaming) */}
                        {(hasInsights || hasPlanner || status === 'generating' || (uploadedFile && uploadedFile.status === 'completed')) && (
                            <div className="space-y-4 animate-snappy pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="h-px w-8 bg-earth-900/20" />
                                    <h2 className="text-[10px] font-black text-earth-600 uppercase tracking-[0.4em]">Your Planner Actions</h2>
                                    <div className="h-px flex-1 bg-earth-900/20" />
                                </div>

                                {/* Show uploaded file summary if exists */}
                                {uploadedFile && uploadedFile.status === 'completed' && (
                                    <div className="space-y-3">
                                        <GlassCard className="border-earth-600/20 bg-earth-50/5">
                                            <div className="p-6 md:p-8">
                                                <FileSummaryView file={uploadedFile} />
                                            </div>
                                        </GlassCard>
                                    </div>
                                )}

                                {/* Show planner if it exists and has content (check both visibleContent and content) */}
                                {plannerSection && (plannerSection.isVisible || plannerSection.content) && (plannerSection.visibleContent || plannerSection.content) && (
                                    <div className="space-y-3">
                                        <GlassCard className="border-earth-600/20 bg-earth-50/5">
                                            <div className="p-6 md:p-8">
                                                <SectionRenderer section={plannerSection} employees={employees} departments={departments} />
                                            </div>
                                        </GlassCard>
                                    </div>
                                )}

                                {/* Show other insights */}
                                {insightSections.filter(s => s.title !== 'Your Planner Actions').map(s => (
                                    <div key={s.id} className="space-y-3">
                                        <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] px-1 opacity-50">{s.title}</h2>
                                        <GlassCard className="border-earth-600/20 bg-earth-50/5">
                                            <div className="p-6 md:p-8">
                                                <SectionRenderer section={s} employees={employees} departments={departments} />
                                            </div>
                                        </GlassCard>
                                    </div>
                                ))}

                                {status === 'generating' && (
                                    <div className="flex items-center gap-4 px-2 text-slate-900 text-[11px] font-black uppercase tracking-[0.3em] animate-pulse">
                                        <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
                                        Generating insight...
                                    </div>
                                )}
                            </div>
                        )}
                        <div ref={bottomRef} className="h-12" />
                    </div>
                </div>
            </div>
        );
    }

    // Default return for cases where a module is being generated but it's not the dashboard
    return (
        <div className="flex flex-col h-full relative gamma-light-bg overflow-hidden group/active text-center items-center justify-center">
            <div className="grain-overlay" />
            <p className="text-slate-400 font-medium italic">Please select a module from the left or ask Namaha AI for a dashboard update.</p>
        </div>
    );
}
