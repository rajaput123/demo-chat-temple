import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

interface ApprovalItem {
    id: string;
    title: string;
    type: string;
    requestor: string;
    date: string;
    priority: 'high' | 'medium' | 'low';
    day: 'today' | 'tomorrow';
}

const approvals: ApprovalItem[] = [
    {
        id: 'APP-001',
        title: 'Gold Kavacha Restoration',
        type: 'Asset Maintenance',
        requestor: 'K. Bhat (Head Priest)',
        date: 'Today, 09:00 AM',
        priority: 'high',
        day: 'today'
    },
    {
        id: 'APP-002',
        title: 'Security Staff Overtime',
        type: 'Operations',
        requestor: 'R. Singh (Security Mgr)',
        date: 'Today, 10:30 AM',
        priority: 'medium',
        day: 'today'
    },
    {
        id: 'APP-003',
        title: 'New Vessel Procurement',
        type: 'Finance',
        requestor: 'A. Sharma (Kitchen Mgr)',
        date: 'Yesterday',
        priority: 'low',
        day: 'today'
    },
    {
        id: 'APP-T1',
        title: 'Festival Budget Review',
        type: 'Finance',
        requestor: 'Board of Trustees',
        date: 'Tomorrow, 10:00 AM',
        priority: 'high',
        day: 'tomorrow'
    },
    {
        id: 'APP-T2',
        title: 'Guest House Renovation',
        type: 'Infrastructure',
        requestor: 'Site Engineer',
        date: 'Tomorrow, 02:00 PM',
        priority: 'medium',
        day: 'tomorrow'
    }
];

interface ApprovalsListViewProps {
    filter?: 'today' | 'tomorrow';
}

export default function ApprovalsListView({ filter = 'today' }: ApprovalsListViewProps) {
    const filteredApprovals = approvals.filter(item => item.day === filter);

    return (
        <div className="p-4 sm:p-6">
            {filteredApprovals.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-sm text-neutral-500">No pending approvals for {filter}.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredApprovals.map((approval) => (
                        <div
                            key={approval.id}
                            className="flex items-start gap-3 group transition-all"
                        >
                            <div className="w-5 h-5 rounded-[4px] bg-neutral-100 border border-neutral-200 mt-0.5 shrink-0 flex items-center justify-center cursor-pointer hover:border-cane-green transition-colors">
                                {approval.priority === 'high' ? (
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                ) : approval.priority === 'medium' ? (
                                    <div className="w-1.5 h-1.5 rounded-full bg-harvest-yellow" />
                                ) : (
                                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-neutral-900">
                                    {approval.title}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">
                                        {approval.date}
                                    </span>
                                    <span className="flex items-center gap-1 text-[10px] text-neutral-400 font-bold uppercase tracking-wider before:content-['·'] before:mr-2">
                                        {approval.type}
                                    </span>
                                    <span className="flex items-center gap-1 text-[10px] text-neutral-400 font-bold uppercase tracking-wider before:content-['·'] before:mr-2 truncate">
                                        {approval.requestor}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
