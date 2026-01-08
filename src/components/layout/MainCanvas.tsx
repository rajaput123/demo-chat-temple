import React, { useEffect, useRef, useState } from 'react';
import { CanvasSection, SimulationStatus } from '@/hooks/useSimulation';
import AppointmentsListView from '@/components/appointments/AppointmentsListView';
import ApprovalsListView from '@/components/dashboard/ApprovalsListView';
import VIPVisitsListView from '@/components/dashboard/VIPVisitsListView';
import FinanceSummaryView from '@/components/dashboard/FinanceSummaryView';
import AlertsListView from '@/components/dashboard/AlertsListView';
import OperationsView from '@/components/operations/OperationsView';
import PeopleView from '@/components/people/PeopleView';
import FinanceView from '@/components/finance/FinanceView';
import AssetManagementView from '@/components/assets/AssetManagementView';
import ProjectsView from '@/components/projects/ProjectsView';
import InteractivePlannerActions from '@/components/planner/InteractivePlannerActions';
import FileSummaryView from '@/components/dashboard/FileSummaryView';
import { mockSringeriEmployees } from '@/data/mockEmployeeData';
import { PlannerAction } from '@/types/planner';
import { Employee } from '@/types/employee';
import { Department } from '@/types/department';
import { VIPVisit } from '@/types/vip';
import { UploadedFile } from '@/types/fileUpload';

interface MainCanvasProps {
    status: SimulationStatus;
    sections: CanvasSection[];
    activeModule?: string;
    vipVisits?: VIPVisit[];
    uploadedFile?: UploadedFile | null;
}

const SectionRenderer = ({
    section,
    employees,
    departments
}: {
    section: CanvasSection;
    employees: Employee[];
    departments: Department[];
}) => {
    const renderContent = () => {
        // Use InteractivePlannerActions for "Your Planner Actions" sections
        if (section.title === 'Your Planner Actions' && (section.type === 'list' || section.type === 'steps')) {
            return (
                <InteractivePlannerActions
                    sectionId={section.id}
                    title={section.subTitle}
                    initialContent={section.visibleContent}
                    employees={employees}
                    departments={departments}
                />
            );
        }

        // Simple list format for other sections
        if (section.type === 'list' || section.type === 'components' || section.type === 'steps' && section.visibleContent.length > 0) {
            const lines = section.visibleContent.split('\n').filter(line => line.trim());
            return (
                <ul className="space-y-2 mt-3">
                    {lines.map((line, idx) => {
                        if (!line.trim()) return null;

                        // Identify indentation (2 spaces = 1 level)
                        const indentLevel = Math.floor((line.match(/^\s*/) || [""])[0].length / 2);
                        const cleanLine = line.trim();

                        // Parse markers
                        const isDotTodo = cleanLine.startsWith('[·]');
                        const isChecked = cleanLine.startsWith('[x]') || cleanLine.startsWith('[✓]');
                        const isAnyCheck = isDotTodo || isChecked;

                        const content = isAnyCheck
                            ? cleanLine.substring(3).trim()
                            : cleanLine;

                        return (
                            <li
                                key={idx}
                                className={`flex items-start gap-4 text-[14px] animate-slideDown group`}
                                style={{ marginLeft: `${indentLevel * 1.5}rem` }}
                            >
                                {isDotTodo ? (
                                    <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 mt-0.5 shrink-0 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cane-green" />
                                    </div>
                                ) : isChecked ? (
                                    <div className="w-5 h-5 rounded-full bg-slate-50 border border-slate-200 mt-0.5 shrink-0 flex items-center justify-center opacity-60 scale-95 transition-all">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                ) : section.type === 'list' ? (
                                    <div className="w-5 h-5 rounded-full border border-slate-200 mt-0.5 shrink-0 flex items-center justify-center">
                                    </div>
                                ) : section.type === 'components' ? (
                                    <div className="w-5 h-5 mt-0.5 shrink-0 text-slate-400 font-black text-xs flex items-center justify-center">
                                        ❖
                                    </div>
                                ) : (
                                    <span className="text-slate-400 font-mono mt-0.5 w-5 text-right text-[11px] font-black">{idx + 1}.</span>
                                )}
                                <span className={`leading-relaxed flex-1 ${isChecked ? 'text-slate-400 italic line-through' : 'text-slate-900 font-medium'}`}>
                                    {content}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            );
        }

        return (
            <p className="text-slate-900 leading-relaxed text-[15px] whitespace-pre-wrap mt-4 font-medium">
                {section.visibleContent}
            </p>
        );
    };

    return (
        <div className="mb-10 last:mb-0 animate-fadeIn">
            {/* Only show title for non-planner sections, planner sections handle their own title */}
            {section.title !== 'Your Planner Actions' && section.title && (
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
                    {section.title}
                </h3>
            )}
            {renderContent()}
        </div>
    );
};

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

    const [departments] = useState<Department[]>([
        {
            id: 'dept-procurement',
            name: 'Cane Procurement',
            code: 'PRC',
            parentId: null,
            headEmployeeId: null,
            isActive: true,
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
            updatedBy: 'admin',
        },
        {
            id: 'dept-production',
            name: 'Production & Crushing',
            code: 'PRO',
            parentId: null,
            headEmployeeId: null,
            isActive: true,
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
            updatedBy: 'admin',
        },
        {
            id: 'dept-logistics',
            name: 'Logistics & Fleet',
            code: 'LOG',
            parentId: null,
            headEmployeeId: null,
            isActive: true,
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
            updatedBy: 'admin',
        },
        {
            id: 'dept-finance',
            name: 'Finance & Compliance',
            code: 'FIN',
            parentId: null,
            headEmployeeId: null,
            isActive: true,
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
            updatedBy: 'admin',
        },
    ]);

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
        const visibleSections = sections.filter(s => s.isVisible);
        // Check all sections (not just visible) for focus detection to ensure title updates immediately
        const focusSection = sections.find(s => s.id.startsWith('focus-')) || visibleSections.find(s => s.id.startsWith('focus-'));
        const insightSections = visibleSections.filter(s => !s.id.startsWith('focus-'));
        const plannerSection = sections.find(s => s.title === 'Your Planner Actions'); // Find planner even if not visible yet
        const hasFocus = !!focusSection;
        const hasInsights = insightSections.length > 0;
        const hasPlanner = !!plannerSection; // Check if planner exists

        return (
            <div className="h-full w-full gamma-light-bg relative overflow-hidden group/canvas">
                <div className="grain-overlay" />

                <div className="relative h-full w-full overflow-auto px-4 sm:px-12 pt-4 sm:pt-6 pb-2 scrollbar-hide">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Header Section */}
                        <div className="animate-fadeIn flex items-end justify-between border-slate-200/60 pb-2">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-cane-green uppercase tracking-[0.4em] mb-1">
                                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tight ">
                                    {(() => {
                                        const hour = new Date().getHours();
                                        if (hour >= 5 && hour < 12) return "Good Morning.";
                                        if (hour >= 12 && hour < 17) return "Good Afternoon.";
                                        if (hour >= 17 && hour < 22) return "Good Evening.";
                                        return "Good Night.";
                                    })()}
                                </h1>
                            </div>
                        </div>

                        {/* Top Slot: Replaceable Component Area */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] opacity-40">
                                    {hasFocus && focusSection?.title ? focusSection.title : "Live Factory Status"}
                                </h2>
                                <div className={`w-1.5 h-1.5 rounded-full ${hasFocus ? 'bg-cane-green animate-pulse' : 'bg-slate-200'}`} />
                            </div>

                            <GlassCard className="transition-all duration-500">
                                {(() => {
                                    const filter = focusSection?.title?.toLowerCase().includes('tomorrow') ? 'tomorrow' : 'today';

                                    // Handle CEO Cards (Executive Mode)
                                    if (focusSection?.id === 'focus-ceo-card') {
                                        try {
                                            // Parse the content assuming it's JSON-like or structured text
                                            // For simplicity in this demo, we'll try to parse JSON, or fallback to regex/strings
                                            // In useSimulation, we will store the card data as a JSON string in 'content'
                                            const cardData = JSON.parse(focusSection.content);
                                            return (
                                                <div className="p-6 md:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white animate-fadeIn">
                                                    <div className="flex items-center justify-between mb-6">
                                                        <div className="px-2 py-1 bg-white/10 rounded text-[10px] font-black uppercase tracking-widest text-white/80">
                                                            {cardData.type}
                                                        </div>
                                                        <div className="px-2 py-1 bg-cane-green rounded text-[10px] font-black uppercase tracking-widest text-white">
                                                            {cardData.visibility} Scope
                                                        </div>
                                                    </div>

                                                    <h3 className="text-2xl font-black tracking-tight mb-2">{cardData.subject}</h3>
                                                    <p className="text-lg text-white/60 font-medium mb-8">{cardData.dateTime}</p>

                                                    <div className="space-y-4 border-t border-white/10 pt-6">
                                                        <div>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Executive Intent</p>
                                                            <p className="text-sm font-medium leading-relaxed text-white/90">{cardData.intent}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                                                                CEO
                                                            </div>
                                                            <p className="text-[10px] font-medium text-white/40">Planned by {cardData.plannedBy}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        } catch (e) {
                                            // Fallback if parsing fails
                                            return <div className="p-6 text-red-500">Error rendering CEO Card</div>;
                                        }
                                    }
                                    if (focusSection?.id === 'focus-approval') return <ApprovalsListView filter={filter} />;

                                    // Rich Card Renderer - handles VIP, Visit, Event, Summary, and Procurement cards (no colors, plain white)
                                    const renderRichCard = (cardData: any, cardType: 'vip' | 'visit' | 'event' | 'summary' | 'procurement') => {
                                        const highlightTitle = cardData.highlightTitle || cardData.title || "TODAY | HIGHLIGHTS";
                                        const subTitle = cardData.subTitle || '';

                                        // Special rendering for procurement cards
                                        if (cardType === 'procurement' || cardData.seasonTarget) {
                                            return (
                                                <div className="p-6 md:p-8 bg-white animate-fadeIn">
                                                    {cardData.title && (
                                                        <div className="mb-6">
                                                            <h3 className="text-2xl font-black tracking-tight mb-1 text-slate-900">{cardData.title}</h3>
                                                        </div>
                                                    )}
                                                    <div className="space-y-4">
                                                        {cardData.seasonTarget && (
                                                            <div className="flex items-start gap-4">
                                                                <span className="text-slate-400 text-sm font-medium uppercase tracking-wider min-w-[140px]">Season Target:</span>
                                                                <span className="text-slate-900 text-sm font-semibold">{cardData.seasonTarget}</span>
                                                            </div>
                                                        )}
                                                        {cardData.procuredPercentage && (
                                                            <div className="flex items-start gap-4">
                                                                <span className="text-slate-400 text-sm font-medium uppercase tracking-wider min-w-[140px]">Procured Till Date:</span>
                                                                <span className="text-slate-900 text-sm font-semibold">{cardData.procuredPercentage}</span>
                                                            </div>
                                                        )}
                                                        {cardData.riskLevel && (
                                                            <div className="flex items-start gap-4">
                                                                <span className="text-slate-400 text-sm font-medium uppercase tracking-wider min-w-[140px]">Risk Level:</span>
                                                                <span className={`text-sm font-semibold ${cardData.riskLevel === 'High' ? 'text-red-600' :
                                                                    cardData.riskLevel === 'Medium' ? 'text-amber-600' :
                                                                        'text-green-600'
                                                                    }`}>{cardData.riskLevel}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div className="p-6 md:p-8 bg-white animate-fadeIn">
                                                {cardData.title && (
                                                    <div className="mb-4">
                                                        <h3 className="text-2xl font-black tracking-tight mb-1 text-slate-900">{cardData.title}</h3>
                                                        {subTitle && <p className="text-slate-600 text-sm font-medium">{subTitle}</p>}
                                                    </div>
                                                )}
                                                {(cardData.todayHighlights || cardData.highlights) && (cardData.todayHighlights?.length > 0 || cardData.highlights?.length > 0) && (
                                                    <div className="mb-8">
                                                        <h4 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                                                            {highlightTitle}
                                                        </h4>
                                                        <div className="space-y-4">
                                                            {(cardData.todayHighlights || cardData.highlights || []).map((highlight: { time: string; description: string }, idx: number) => (
                                                                <div key={idx} className="flex gap-4">
                                                                    <span className="text-slate-600 font-mono text-sm font-bold whitespace-nowrap pt-0.5">{highlight.time}</span>
                                                                    <span className="text-slate-900 text-sm leading-relaxed border-l-2 border-slate-200 pl-4">{highlight.description}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    };

                                    // Handle VIP visits explicitly - match approvals pattern (simple list view only)
                                    if (focusSection?.id === 'focus-vip') return <VIPVisitsListView vipVisits={vipVisits} filter={filter} />;

                                    // Handle other visit/event/summary cards (adhoc visits, events, summaries)
                                    // Also handle factory-related focus cards (cane-intake, production-batch, quality, supplier, etc.)
                                    if (focusSection?.id?.startsWith('focus-visit') ||
                                        focusSection?.id?.startsWith('focus-event') ||
                                        focusSection?.id?.startsWith('focus-summary') ||
                                        focusSection?.id?.startsWith('focus-cane') ||
                                        focusSection?.id?.startsWith('focus-production') ||
                                        focusSection?.id?.startsWith('focus-quality') ||
                                        focusSection?.id?.startsWith('focus-supplier') ||
                                        focusSection?.id?.startsWith('focus-inspection') ||
                                        focusSection?.id?.startsWith('focus-manager') ||
                                        focusSection?.id?.startsWith('focus-batch') ||
                                        focusSection?.id?.startsWith('focus-season') ||
                                        focusSection?.id?.startsWith('focus-project') ||
                                        focusSection?.id?.startsWith('focus-admin') ||
                                        focusSection?.id?.startsWith('focus-auditor') ||
                                        focusSection?.id?.startsWith('focus-procurement')) {
                                        // If content is available (parsed data), render rich card
                                        if (focusSection.content && focusSection.content.length > 0 && !focusSection.content.includes('Loading')) {
                                            try {
                                                // Try parsing as JSON first (for structured data)
                                                const cardData = JSON.parse(focusSection.content);
                                                const cardType = focusSection.id?.startsWith('focus-visit') ? 'visit' :
                                                    focusSection.id?.startsWith('focus-event') ? 'event' :
                                                        focusSection.id?.startsWith('focus-batch') ? 'event' :
                                                            focusSection.id?.startsWith('focus-procurement') ? 'procurement' :
                                                                cardData.seasonTarget ? 'procurement' :
                                                                    'summary';
                                                return renderRichCard(cardData, cardType);
                                            } catch (e) {
                                                // Fallback: render as plain text card (no colors)
                                                return (
                                                    <div className="p-6 md:p-8 bg-white animate-fadeIn">
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <div className="px-2 py-1 bg-slate-100 rounded text-[10px] font-black uppercase tracking-widest text-slate-600">
                                                                {focusSection.title || 'Info Brief'}
                                                            </div>
                                                        </div>
                                                        <p className="text-sm font-medium leading-relaxed text-slate-900">{focusSection.content}</p>
                                                    </div>
                                                );
                                            }
                                        }
                                    }

                                    // Handle appointments explicitly
                                    if (focusSection?.id === 'focus-appointments') return <AppointmentsListView filter={filter} />;

                                    // Handle approvals (both singular and plural) - check if content is JSON first
                                    if (focusSection?.id === 'focus-approvals' || focusSection?.id === 'focus-approval') {
                                        if (focusSection.content && focusSection.content.length > 0 && !focusSection.content.includes('Loading')) {
                                            try {
                                                const cardData = JSON.parse(focusSection.content);
                                                return renderRichCard(cardData, 'summary');
                                            } catch (e) {
                                                return <ApprovalsListView filter={filter} />;
                                            }
                                        }
                                        return <ApprovalsListView filter={filter} />;
                                    }

                                    // Handle finance - check if content is JSON first
                                    if (focusSection?.id === 'focus-finance') {
                                        if (focusSection.content && focusSection.content.length > 0 && !focusSection.content.includes('Loading')) {
                                            try {
                                                const cardData = JSON.parse(focusSection.content);
                                                return renderRichCard(cardData, 'summary');
                                            } catch (e) {
                                                return <FinanceSummaryView filter={filter} />;
                                            }
                                        }
                                        return <FinanceSummaryView filter={filter} />;
                                    }

                                    // Handle alerts - check if content is JSON first
                                    if (focusSection?.id === 'focus-alert') {
                                        if (focusSection.content && focusSection.content.length > 0 && !focusSection.content.includes('Loading')) {
                                            try {
                                                const cardData = JSON.parse(focusSection.content);
                                                return renderRichCard(cardData, 'summary');
                                            } catch (e) {
                                                return <AlertsListView filter={filter} />;
                                            }
                                        }
                                        return <AlertsListView filter={filter} />;
                                    }

                                    // Handle custom focus areas (Events, Summaries) using standard renderer
                                    if (focusSection && (focusSection.id === 'focus-event' || focusSection.id === 'focus-summary')) {
                                        return (
                                            <div className="p-6 md:p-8">
                                                <SectionRenderer section={focusSection} employees={employees} departments={departments} />
                                            </div>
                                        );
                                    }

                                    // Default fallback to appointments (when no focus section exists)
                                    return <AppointmentsListView filter={filter} />;
                                })()}
                            </GlassCard>
                        </div>

                        {/* Bottom Slot: AI Insight/Next Actions Section (Streaming) */}
                        {(hasInsights || hasPlanner || status === 'generating' || (uploadedFile && uploadedFile.status === 'completed')) && (
                            <div className="space-y-4 animate-snappy pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="h-px w-8 bg-cane-green/20" />
                                    <h2 className="text-[10px] font-black text-cane-green uppercase tracking-[0.4em]">Your Planner Actions</h2>
                                    <div className="h-px flex-1 bg-cane-green/20" />
                                </div>

                                {/* Show uploaded file summary if exists */}
                                {uploadedFile && uploadedFile.status === 'completed' && (
                                    <div className="space-y-3">
                                        <GlassCard className="border-cane-green/20 bg-cane-green/5">
                                            <div className="p-6 md:p-8">
                                                <FileSummaryView file={uploadedFile} />
                                            </div>
                                        </GlassCard>
                                    </div>
                                )}

                                {/* Show planner if it exists and has content (check both visibleContent and content) */}
                                {plannerSection && (plannerSection.isVisible || plannerSection.content) && (plannerSection.visibleContent || plannerSection.content) && (
                                    <div className="space-y-3">
                                        <GlassCard className="border-cane-green/20 bg-cane-green/5">
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
                                        <GlassCard className="border-cane-green/20 bg-cane-green/5">
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
            <p className="text-slate-400 font-medium italic">Please select a module from the left or ask SugarOS AI for an operational update.</p>
        </div>
    );
}
