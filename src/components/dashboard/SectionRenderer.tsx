/**
 * Section Renderer Component
 * 
 * Renders canvas sections with proper formatting.
 * Extracted from MainCanvas and memoized for performance.
 */

import React from 'react';
import { CanvasSection } from '@/hooks/useSimulation';
import { Employee } from '@/types/employee';
import { Department } from '@/types/department';
import InteractivePlannerActions from '@/components/planner/InteractivePlannerActions';

interface SectionRendererProps {
    section: CanvasSection;
    employees: Employee[];
    departments: Department[];
}

export const SectionRenderer = React.memo(({ section, employees, departments }: SectionRendererProps) => {
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
        if (section.type === 'list' || section.type === 'components' || (section.type === 'steps' && section.visibleContent.length > 0)) {
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
                                        <div className="w-1.5 h-1.5 rounded-full bg-earth-900" />
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
});

SectionRenderer.displayName = 'SectionRenderer';

