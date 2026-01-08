import React from 'react';
import { VIPVisit } from '@/types/vip';

interface VIPVisitsListViewProps {
    vipVisits?: VIPVisit[];
    filter?: 'today' | 'tomorrow';
}

export default function VIPVisitsListView({ vipVisits = [], filter = 'today' }: VIPVisitsListViewProps) {
    // Filter and sort visits based on filter prop
    const now = new Date();
    const targetDate = new Date(now);
    if (filter === 'tomorrow') {
        targetDate.setDate(targetDate.getDate() + 1);
    }

    // Reset time for comparison
    targetDate.setHours(0, 0, 0, 0);

    const filteredVisits = vipVisits
        .filter(visit => {
            try {
                // Parse visit date (YYYY-MM-DD)
                const visitDate = new Date(visit.date);
                // Reset time to ensure strict day matching (ignoring timezone offsets for this simple logic)
                // In a real app, strict date string comparison is better:
                return visitDate.toISOString().split('T')[0] === targetDate.toISOString().split('T')[0];
            } catch {
                // Fallback: simple string match if today
                if (filter === 'today') {
                    const todayStr = new Date().toISOString().split('T')[0];
                    return visit.date === todayStr;
                }
                return false;
            }
        })
        .sort((a, b) => a.time.localeCompare(b.time));

    return (
        <div className="p-4 sm:p-6">
            {filteredVisits.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-sm text-neutral-500">No upcoming VIP visits scheduled for {filter}.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredVisits.map((visit) => {
                        // Format date and time for display
                        let displayDate = visit.date;
                        try {
                            const dateObj = new Date(visit.date);
                            displayDate = dateObj.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            });
                        } catch {
                            // Use original if parsing fails
                        }

                        // Format time for display (convert 24-hour to 12-hour with AM/PM)
                        let displayTime = visit.time;
                        try {
                            const [hours, minutes] = visit.time.split(':').map(Number);
                            if (!isNaN(hours) && !isNaN(minutes)) {
                                const period = hours >= 12 ? 'PM' : 'AM';
                                const hour12 = hours === 0 ? 12 : (hours > 12 ? hours - 12 : hours);
                                displayTime = `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
                            }
                        } catch {
                            // Use original if parsing fails
                        }

                        const fullTime = `${displayTime} on ${displayDate}`;
                        const protocolColor = visit.protocolLevel === 'maximum' ? 'bg-red-500' :
                                             visit.protocolLevel === 'high' ? 'bg-harvest-yellow' :
                                             'bg-neutral-900';

                        return (
                            <div
                                key={visit.id}
                                className="flex items-start gap-3 group transition-all"
                            >
                                <div className="w-5 h-5 rounded-[4px] bg-neutral-100 border border-neutral-200 mt-0.5 shrink-0 flex items-center justify-center cursor-pointer hover:border-cane-green transition-colors">
                                    <div className={`w-1.5 h-1.5 rounded-full ${protocolColor}`} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-neutral-900">
                                        {visit.visitor}{visit.title ? `, ${visit.title}` : ''}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">
                                            {fullTime}
                                        </span>
                                        {visit.location && (
                                            <span className="flex items-center gap-1 text-[10px] text-neutral-400 font-bold uppercase tracking-wider before:content-['·'] before:mr-2">
                                                {visit.location}
                                            </span>
                                        )}
                                        {visit.assignedEscort && (
                                            <span className="flex items-center gap-1 text-[10px] text-neutral-400 font-bold uppercase tracking-wider before:content-['·'] before:mr-2 truncate">
                                                {visit.assignedEscort}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1 text-[10px] text-neutral-400 font-bold uppercase tracking-wider before:content-['·'] before:mr-2">
                                            {visit.protocolLevel} Protocol
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
