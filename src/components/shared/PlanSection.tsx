"use client";

import React from 'react';
import { PlanSectionData } from '@/types/planner';
import { PlannerAction } from '@/types/planner';

interface PlanSectionProps {
    data: PlanSectionData;
    isStreaming?: boolean;
}

/**
 * PlanSection Component
 * 
 * MANDATORY: Always rendered for every query
 * Displays actions in card format matching VIP PLAN design
 * Streams step-by-step
 */
export default function PlanSection({ data, isStreaming = false }: PlanSectionProps) {
    // Parse visibleContent to show streaming actions
    const parseActionsFromContent = (content: string) => {
        return content.split('\n').filter(line => line.trim()).map((line, idx) => {
            const cleanLine = line.replace(/^\[·\]\s*/, '').trim();
            return {
                id: `action-${idx}`,
                content: cleanLine,
                isCompleted: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: 'system',
                updatedBy: 'system',
            };
        });
    };
    
    const visibleActions = data.visibleActions || (data.visibleContent ? parseActionsFromContent(data.visibleContent) : []);

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-200/60 overflow-hidden">
            {/* Header - Title with horizontal lines */}
            <div className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-neutral-200"></div>
                    <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#B8864A]">
                        {data.title.toUpperCase()}
                    </h2>
                    <div className="h-px flex-1 bg-neutral-200"></div>
                </div>
            </div>

            {/* Plan Content - Directly in main card, no nested card */}
            <div className="px-6 pb-6">
                {/* Plan Title - Blue-gray color, top left */}
                {data.subTitle && (
                    <h3 className="text-sm font-semibold text-[#6A7B9B] mb-4 uppercase">
                        {data.subTitle.toUpperCase()}
                    </h3>
                )}
                
                {/* Actions List */}
                <div className="space-y-2">
                    {visibleActions.length === 0 ? (
                        <p className="text-sm text-neutral-500 italic">No actions yet...</p>
                    ) : (
                        visibleActions.map((action, idx) => (
                            <div
                                key={action.id}
                                className="flex items-start gap-3 p-0 rounded-lg transition-all"
                            >
                                {/* Target-style bullet point - light grey outer with dark brown inner */}
                                <div className="mt-1.5 shrink-0 flex items-center justify-center">
                                    <div className="w-3 h-3 rounded-full bg-neutral-200 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#7A5C3D]"></div>
                                    </div>
                                </div>
                                
                                {/* Action text */}
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm text-neutral-900 leading-relaxed ${
                                        action.isCompleted ? 'line-through text-neutral-400' : ''
                                    }`}>
                                        {action.content}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                    
                    {/* Streaming indicator */}
                    {isStreaming && (
                        <div className="flex items-center gap-2 text-sm text-neutral-500 italic animate-pulse pt-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-earth-600"></div>
                            <span>Planning</span>
                            <span className="ml-1 inline-block w-0.5 h-4 bg-earth-600 animate-pulse">▍</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
