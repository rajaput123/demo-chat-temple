import React from 'react';
import { AlertTriangle, Calendar, Info } from 'lucide-react';

interface AlertItem {
    id: string;
    title: string;
    description: string;
    type: 'warning' | 'reminder' | 'info';
    date: string;
    day: 'today' | 'tomorrow';
}

const alerts: AlertItem[] = [
    {
        id: 'ALR-001',
        title: 'Lease Expiry Warning',
        description: 'Commercial lease for Temple Shop #4 expires in 15 days.',
        type: 'warning',
        date: 'Jan 21, 2026',
        day: 'today'
    },
    {
        id: 'ALR-002',
        title: 'Stock Low: Chandanam',
        description: 'Sacred sandalwood paste stock is below 1kg threshold.',
        type: 'reminder',
        date: 'Immediate',
        day: 'today'
    },
    {
        id: 'ALR-003',
        title: 'Software Update available',
        description: 'New security patch Version 4.2 for CCTV network.',
        type: 'info',
        date: 'Today',
        day: 'today'
    },
    {
        id: 'ALR-T1',
        title: 'Scheduled Power Outage',
        description: 'Maintenance work on Main Grid. Backup generators ready.',
        type: 'warning',
        date: 'Tomorrow, 2-4 PM',
        day: 'tomorrow'
    },
    {
        id: 'ALR-T2',
        title: 'Flower Delivery',
        description: 'Special consignment for Friday festival arriving early.',
        type: 'info',
        date: 'Tomorrow, 8 AM',
        day: 'tomorrow'
    }
];

interface AlertsListViewProps {
    filter?: 'today' | 'tomorrow';
}

export default function AlertsListView({ filter = 'today' }: AlertsListViewProps) {
    const filteredAlerts = alerts.filter(item => item.day === filter);

    return (
        <div className="p-4 sm:p-6">
            {filteredAlerts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-sm text-neutral-500">No alerts for {filter}.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredAlerts.map((alert) => (
                        <div
                            key={alert.id}
                            className="flex items-start gap-3 group transition-all"
                        >
                            <div className="w-5 h-5 rounded-[4px] bg-neutral-100 border border-neutral-200 mt-0.5 shrink-0 flex items-center justify-center cursor-pointer hover:border-cane-green transition-colors">
                                {alert.type === 'warning' ? (
                                    <AlertTriangle size={12} className="text-red-500" />
                                ) : alert.type === 'reminder' ? (
                                    <Calendar size={12} className="text-harvest-yellow" />
                                ) : (
                                    <Info size={12} className="text-blue-500" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-neutral-900">
                                    {alert.title}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">
                                        {alert.date}
                                    </span>
                                    <span className="flex items-center gap-1 text-[10px] text-neutral-400 font-bold uppercase tracking-wider before:content-['·'] before:mr-2 truncate">
                                        {alert.description}
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
