"use client";

import React from 'react';
import { InfoCardData } from '@/types/planner';

interface InfoCardProps {
    data: InfoCardData;
    isStreaming?: boolean;
}

/**
 * InfoCard Component
 * 
 * MANDATORY: Always rendered for every query
 * Uses ONLY existing system mock data - NO new records
 * Renders instantly (NO streaming)
 * Design matches approval card style with colored dots and detail lines
 */
export default function InfoCard({ data }: InfoCardProps) {
    const contentToDisplay = data.visibleContent || data.content || '';
    const metadata = data.metadata || {};
    
    // Extract structured information from metadata or parse from content
    const recordType = metadata.recordType || 'SYSTEM RECORD';
    const name = metadata.name || metadata.title || null;
    const date = metadata.date || null;
    const time = metadata.time || null;
    const location = metadata.location || null;
    const status = metadata.status || null;
    const assignedRoles = metadata.assignedRoles || null;
    const department = metadata.department || null;
    
    // Format date for display
    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return null;
        const dateObj = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (dateStr === today.toISOString().split('T')[0]) {
            return 'TODAY';
        } else if (dateStr === tomorrow.toISOString().split('T')[0]) {
            return 'TOMORROW';
        } else {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            if (dateStr === yesterday.toISOString().split('T')[0]) {
                return 'YESTERDAY';
            }
            return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
        }
    };
    
    // Format time for display
    const formatTime = (timeStr: string | null) => {
        if (!timeStr) return null;
        // Convert 24h to 12h format if needed
        if (timeStr.includes('AM') || timeStr.includes('PM')) {
            return timeStr.toUpperCase();
        }
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };
    
    // Determine dot color based on record type or status
    const getDotColor = () => {
        if (status === 'pending' || status === 'pending-approval') return 'bg-red-500';
        if (status === 'active' || status === 'in-progress') return 'bg-orange-500';
        if (recordType.includes('TASK') || recordType.includes('ACTIVITY')) return 'bg-orange-500';
        if (recordType.includes('DONATION') || recordType.includes('EXPENSE')) return 'bg-orange-500';
        return 'bg-neutral-900';
    };
    
    // Format record type for display
    const formatRecordType = (type: string) => {
        return type.replace(/-/g, ' ').toUpperCase();
    };
    
    // Get department name from ID
    const getDepartmentName = (deptId: string | null) => {
        if (!deptId) return null;
        const deptMap: Record<string, string> = {
            'dept-ritual': 'RITUAL',
            'dept-security': 'SECURITY',
            'dept-kitchen': 'KITCHEN',
            'dept-finance': 'FINANCE',
            'dept-maintenance': 'MAINTENANCE',
            'dept-004': 'OPERATIONS',
        };
        return deptMap[deptId] || deptId.toUpperCase();
    };
    
    const displayTitle = name || 'System Record';
    const displayDate = formatDate(date);
    const displayTime = formatTime(time);
    const displayType = formatRecordType(recordType);
    const displayDepartment = getDepartmentName(department);
    const displayPerson = assignedRoles || null;

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-200/60 overflow-hidden">
            {/* Header - Title in top left, notification dot in top right */}
            <div className="px-6 py-4 relative">
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-700">
                    {data.title.toUpperCase()}
                </h2>
                {/* Notification dot in top right */}
                <div className="absolute top-4 right-6 w-2 h-2 bg-orange-500 rounded-full"></div>
            </div>

            {/* Content Card - White card with items */}
            <div className="px-6 pb-6">
                <div className="bg-white rounded-xl border border-neutral-200/40 shadow-sm p-4">
                    {/* Single item display */}
                    <div className="flex items-start gap-3">
                        {/* Colored dot */}
                        <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${getDotColor()}`}></div>
                        
                        <div className="flex-1 min-w-0">
                            {/* Main title */}
                            <h3 className="text-sm font-bold text-neutral-900 mb-1">
                                {displayTitle}
                            </h3>
                            
                            {/* Detail line */}
                            <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-medium flex-wrap">
                                {displayDate && (
                                    <>
                                        <span>{displayDate}</span>
                                        {displayTime && <span>, {displayTime}</span>}
                                    </>
                                )}
                                {displayType && (
                                    <>
                                        {displayDate && <span className="text-neutral-300">•</span>}
                                        <span>{displayType}</span>
                                    </>
                                )}
                                {displayDepartment && (
                                    <>
                                        {(displayDate || displayType) && <span className="text-neutral-300">•</span>}
                                        <span>{displayDepartment}</span>
                                    </>
                                )}
                                {displayPerson && (
                                    <>
                                        {(displayDate || displayType || displayDepartment) && <span className="text-neutral-300">•</span>}
                                        <span>{displayPerson.toUpperCase()}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Full sentence content below card (for context) */}
                <div className="mt-4 pt-4 border-t border-neutral-100">
                    <p className="text-xs text-neutral-600 leading-relaxed">
                        {contentToDisplay}
                    </p>
                </div>
            </div>
        </div>
    );
}
