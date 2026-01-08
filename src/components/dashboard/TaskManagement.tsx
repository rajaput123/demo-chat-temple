import React from 'react';
import { Plus } from 'lucide-react';

interface Task {
    id: string;
    title: string;
    team: string;
    category: string;
    dueDate: string;
    status: 'In Progress' | 'Pending' | 'Completed';
    priority: 'High' | 'Medium' | 'Low';
}

const tasks: Task[] = [
    {
        id: '1',
        title: 'Prepare Monthly Financial Report',
        team: 'Finance Team',
        category: 'Finance',
        dueDate: 'Jul 20, 2025',
        status: 'In Progress',
        priority: 'High'
    },
    {
        id: '2',
        title: 'Schedule Guru Purnima Celebrations',
        team: 'Event Manager',
        category: 'Events',
        dueDate: 'Jul 18, 2025',
        status: 'Pending',
        priority: 'High'
    },
    {
        id: '3',
        title: 'Update Temple Website Content',
        team: 'Content Team',
        category: 'Content',
        dueDate: 'Jul 15, 2025',
        status: 'Completed',
        priority: 'Medium'
    }
];

export default function TaskManagement() {
    return (
        <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 px-1">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Roadmap</span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Active Tasks</h3>
                </div>
                <button className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-industrial-gray text-white rounded-full hover:bg-industrial-gray/90 transition-all shadow-xl active:scale-95 shrink-0">
                    <Plus size={20} />
                </button>
            </div>

            {/* Task List */}
            <div className="space-y-4 px-4 sm:px-0">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className={`flex items-start gap-3 group transition-all ${task.status === 'Completed' ? 'opacity-60' : ''}`}
                    >
                        {task.status === 'Completed' ? (
                            <div className="w-5 h-5 rounded-[4px] bg-neutral-50 border border-neutral-200 mt-0.5 shrink-0 flex items-center justify-center">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#A3A3A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        ) : (
                            <div className="w-5 h-5 rounded-[4px] bg-neutral-100 border border-neutral-200 mt-0.5 shrink-0 flex items-center justify-center cursor-pointer hover:border-cane-green transition-colors">
                                <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 group-hover:bg-cane-green" />
                            </div>
                        )}

                        <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium ${task.status === 'Completed' ? 'text-neutral-400 line-through' : 'text-neutral-900'}`}>
                                {task.title}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">
                                    {task.team} · {task.dueDate}
                                </span>
                                {task.priority === 'High' && task.status !== 'Completed' && (
                                    <span className="text-[9px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded uppercase font-bold tracking-tight">
                                        High
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
