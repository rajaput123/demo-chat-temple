import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface CalendarViewProps {
    selectedCalendar?: string;
}

export default function CalendarView({ selectedCalendar = 'Temple Calendar' }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 5)); // Start at Jan 5, 2026
    const [activeView, setActiveView] = useState<'day' | 'month' | 'year'>('month');
    const [activeCalendar, setActiveCalendar] = useState(selectedCalendar);

    const calendars = [
        { name: 'Temple Calendar', color: 'bg-cane-green' },
        { name: 'Shri Gurugal', color: 'bg-industrial-gray/90' },
        { name: 'Temple Executive', color: 'bg-cane-green' }
    ];

    const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const navigateDate = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            const offset = direction === 'prev' ? -1 : 1;

            if (activeView === 'day') {
                newDate.setDate(newDate.getDate() + offset);
            } else if (activeView === 'month') {
                newDate.setMonth(newDate.getMonth() + offset);
            } else if (activeView === 'year') {
                newDate.setFullYear(newDate.getFullYear() + offset);
            }
            return newDate;
        });
    };

    const goToToday = () => {
        setCurrentDate(new Date(2026, 0, 5));
    };

    const getTitle = () => {
        if (activeView === 'day') return currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        if (activeView === 'month') return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        return currentDate.getFullYear().toString();
    };

    const renderDayView = () => {
        const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM
        return (
            <div className="flex-1 min-h-0 overflow-auto pr-2 scrollbar-hide">
                <div className="flex flex-col gap-2">
                    {timeSlots.map(hour => (
                        <div key={hour} className="flex gap-4 border-b border-neutral-100 py-3 last:border-0 relative group">
                            <span className="text-xs font-medium text-neutral-400 w-12 shrink-0 text-right">
                                {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                            </span>
                            <div className="flex-1 h-6 rounded bg-neutral-50/0 group-hover:bg-neutral-50 transition-colors" />
                            {/* Example event for demo */}
                            {hour === 10 && (
                                <div className="absolute left-16 top-1 right-2 bg-cane-green/10 border-l-2 border-industrial-gray p-1.5 rounded-r text-xs text-industrial-gray pointer-events-none">
                                    <span className="font-bold">Team Sync</span> • 10:00 - 11:00 AM
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderYearView = () => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return (
            <div className="flex-1 min-h-0 overflow-auto scrollbar-hide">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {months.map((m, idx) => (
                        <button
                            key={m}
                            onClick={() => {
                                const newDate = new Date(currentDate);
                                newDate.setMonth(idx);
                                setCurrentDate(newDate);
                                setActiveView('month');
                            }}
                            className={`p-4 rounded-lg text-sm font-medium transition-all text-center border ${currentDate.getMonth() === idx && currentDate.getFullYear() === 2026 // Highlight active month
                                ? 'bg-industrial-gray text-white border-industrial-gray shadow-sm'
                                : 'bg-white text-neutral-600 border-neutral-100 hover:border-cane-green/20 hover:text-industrial-gray'
                                }`}
                        >
                            {m.slice(0, 3)}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const renderMonthView = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(i);

        return (
            <div className="flex-1 min-h-0 overflow-auto flex flex-col">
                <div className="grid grid-cols-7 gap-1 mb-2 shrink-0">
                    {daysOfWeek.map((day) => (
                        <div key={day} className="text-center text-[10px] font-bold text-neutral-400 uppercase tracking-widest py-2">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1 overflow-y-auto scrollbar-hide">
                    {days.map((day, index) => {
                        const isSelected = day === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear();
                        const isEmpty = day === null;
                        return (
                            <div
                                key={index}
                                onClick={() => {
                                    if (!isEmpty) {
                                        const newDate = new Date(currentDate);
                                        newDate.setDate(day);
                                        setCurrentDate(newDate);
                                    }
                                }}
                                className={`aspect-square flex items-center justify-center rounded-lg text-sm transition-all cursor-pointer ${isEmpty
                                    ? ''
                                    : isSelected
                                        ? 'bg-industrial-gray text-white font-medium shadow-sm'
                                        : 'text-neutral-600 hover:bg-neutral-50 font-normal'
                                    }`}
                            >
                                {day}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">January 2026</h3>
                <div className="flex items-center gap-1 bg-neutral-100/50 p-1 rounded-lg self-start sm:self-auto">
                    {(['Day', 'Month', 'Year'] as const).map((view) => (
                        <button
                            key={view}
                            onClick={() => setActiveView(view.toLowerCase() as 'day' | 'month' | 'year')}
                            className={`px-3 py-1.5 text-[11px] sm:text-xs font-medium rounded-md transition-all ${activeView === view.toLowerCase()
                                ? 'bg-white text-industrial-gray shadow-sm ring-1 ring-black/5'
                                : 'text-neutral-500 hover:text-industrial-gray'
                                }`}
                        >
                            {view}
                        </button>
                    ))}
                </div>
            </div>

            {/* Calendar Filters */}
            <div className="flex flex-wrap items-center gap-2 mb-6 sm:mb-8">
                {calendars.map((cal) => (
                    <button
                        key={cal.name}
                        onClick={() => setActiveCalendar(cal.name)}
                        className={`px-3 py-2 rounded-lg text-[11px] sm:text-xs font-medium transition-all border ${activeCalendar === cal.name
                            ? 'bg-industrial-gray text-white border-industrial-gray'
                            : 'bg-white text-neutral-600 border-neutral-200 hover:border-cane-green/20 hover:text-cane-green/80'
                            }`}
                    >
                        {cal.name}
                    </button>
                ))}
            </div>

            {/* Calendar Navigation & Title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center justify-between sm:justify-start gap-4">
                    <h3 className="text-[11px] sm:text-xs font-bold text-neutral-600 tracking-tight uppercase">{getTitle()}</h3>
                    <div className="flex items-center gap-1 bg-neutral-50 p-0.5 rounded-lg border border-neutral-200/50">
                        <button
                            onClick={() => navigateDate('prev')}
                            className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-neutral-400 hover:text-industrial-gray"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            onClick={goToToday}
                            className="px-3 py-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider text-neutral-600 hover:text-industrial-gray transition-colors"
                        >
                            Today
                        </button>
                        <button
                            onClick={() => navigateDate('next')}
                            className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-neutral-400 hover:text-industrial-gray"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-industrial-gray text-white rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-[0.1em] hover:bg-industrial-gray/90 transition-all shadow-lg active:scale-95 w-full sm:w-auto">
                    <Plus size={14} strokeWidth={3} />
                    <span>Add Event</span>
                </button>
            </div>

            {/* Content Display */}
            <div className="flex-1 min-h-0 relative">
                {activeView === 'day' && renderDayView()}
                {activeView === 'month' && renderMonthView()}
                {activeView === 'year' && renderYearView()}
            </div>
        </div>
    );
}
