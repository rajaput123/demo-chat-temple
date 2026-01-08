import React from 'react';
import { MapPin, User } from 'lucide-react';

interface Appointment {
    id: string;
    title: string;
    time: string;
    location?: string;
    attendee?: string;
    isPast?: boolean;
    day: 'today' | 'tomorrow';
}

const appointments: Appointment[] = [
    {
        id: '1',
        title: 'Team Sync Meeting',
        time: '10:00 AM - 11:00 AM',
        location: 'Conference Room A',
        attendee: 'John Doe',
        isPast: true,
        day: 'today'
    },
    {
        id: '2',
        title: 'Client Follow-up',
        time: '2:00 PM - 2:30 PM',
        location: 'Virtual',
        attendee: 'Sarah Smith',
        day: 'today'
    },
    {
        id: '3',
        title: 'Project Review',
        time: '4:00 PM - 5:00 PM',
        location: 'Office',
        attendee: 'Finance Team',
        day: 'today'
    },
    {
        id: '4',
        title: 'Client Meeting',
        time: '4:00 PM - 5:00 PM',
        location: 'Office',
        attendee: 'Client',
        day: 'today'
    },
    {
        id: 't1',
        title: 'Weekly Governance Council',
        time: '09:00 AM - 10:30 AM',
        location: 'Main Hall',
        attendee: 'Board Members',
        day: 'tomorrow'
    },
    {
        id: 't2',
        title: 'Site Inspection: North Gate',
        time: '11:00 AM - 12:00 PM',
        location: 'North Gate',
        attendee: 'Chief Architect',
        day: 'tomorrow'
    },
    {
        id: 't3',
        title: 'VIP Protocol Briefing',
        time: '03:00 PM - 04:00 PM',
        location: 'Security Office',
        attendee: 'Head of Security',
        day: 'tomorrow'
    }
];

interface AppointmentsListViewProps {
    filter?: 'today' | 'tomorrow';
}

export default function AppointmentsListView({ filter = 'today' }: AppointmentsListViewProps) {
    const filteredAppointments = appointments.filter(apt => apt.day === filter);

    return (
        <div className="p-4 sm:p-6">
            {filteredAppointments.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-sm text-neutral-500">No appointments scheduled for {filter}.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredAppointments.map((appointment) => (
                        <div
                            key={appointment.id}
                            className={`flex items-start gap-3 group transition-all ${filter === 'today' && appointment.isPast ? 'opacity-60' : ''}`}
                        >
                            {filter === 'today' && appointment.isPast ? (
                                <div className="w-5 h-5 rounded-[4px] bg-neutral-50 border border-neutral-200 mt-0.5 shrink-0 flex items-center justify-center">
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            ) : (
                                <div className="w-5 h-5 rounded-[4px] bg-neutral-100 border border-neutral-200 mt-0.5 shrink-0 flex items-center justify-center cursor-pointer hover:border-cane-green transition-colors">
                                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 group-hover:bg-cane-green transition-colors" />
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <div className={`text-sm font-medium ${filter === 'today' && appointment.isPast ? 'text-neutral-400 line-through' : 'text-neutral-900'}`}>
                                    {appointment.title}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">
                                        {appointment.time}
                                    </span>
                                    {appointment.location && (
                                        <span className="flex items-center gap-1 text-[10px] text-neutral-400 font-bold uppercase tracking-wider before:content-['·'] before:mr-2">
                                            {appointment.location}
                                        </span>
                                    )}
                                    {appointment.attendee && (
                                        <span className="flex items-center gap-1 text-[10px] text-neutral-400 font-bold uppercase tracking-wider before:content-['·'] before:mr-2">
                                            {appointment.attendee}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
