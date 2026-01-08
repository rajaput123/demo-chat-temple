import React from 'react';

export default function PlannerSection() {
    const tasks: any[] = []; // Empty tasks array - show empty state

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-neutral-900">Planner</h2>
            </div>

            {tasks.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-sm text-neutral-500">No tasks planned for today.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {tasks.map((task) => (
                        <div key={task.id} className="flex items-start gap-3 group">
                            <div className="w-5 h-5 rounded-[4px] bg-neutral-100 border border-neutral-200 mt-0.5 shrink-0 flex items-center justify-center cursor-pointer hover:border-cane-green transition-colors">
                                <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 group-hover:bg-cane-green transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-neutral-900">{task.title}</div>
                                {task.dueDate && (
                                    <div className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider font-bold">{task.dueDate}</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
