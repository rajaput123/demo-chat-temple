import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, UserPlus, Calendar, Plus, Check } from 'lucide-react';
import Modal from '@/components/shared/Modal';
import { PlannerAction } from '@/types/planner';
import { Employee } from '@/types/employee';
import { Department } from '@/types/department';

interface InteractivePlannerActionsProps {
    sectionId: string;
    title?: string; // Optional title to override default
    initialContent: string; // The content from the section (parsed from lines)
    employees: Employee[];
    departments: Department[];
    onUpdate?: (actions: PlannerAction[]) => void;
}

export default function InteractivePlannerActions({
    sectionId,
    title,
    initialContent,
    employees,
    departments,
    onUpdate
}: InteractivePlannerActionsProps) {
    // Parse initial content into planner actions
    const parseContentToActions = (content: string): PlannerAction[] => {
        if (!content) return [];

        const lines = content.split('\n');
        return lines
            .filter(line => line.trim())
            .map((line, idx) => {
                let cleanLine = line.trim();

                // Parse optional tags
                const isDirective = cleanLine.includes('[DIRECTIVE]');
                let priority: 'critical' | 'high' | 'medium' | 'low' | undefined = undefined;
                let departmentId: string | undefined = undefined;

                if (cleanLine.includes('[PRIORITY:CRITICAL]')) priority = 'critical';
                else if (cleanLine.includes('[PRIORITY:HIGH]')) priority = 'high';
                else if (cleanLine.includes('[PRIORITY:MEDIUM]')) priority = 'medium';
                else if (cleanLine.includes('[PRIORITY:LOW]')) priority = 'low';

                const deptMatch = cleanLine.match(/\[DEPT:([^\]]+)\]/);
                if (deptMatch) {
                    departmentId = deptMatch[1];
                }

                // Remove tags from display content
                cleanLine = cleanLine
                    .replace('[DIRECTIVE]', '')
                    .replace(/\[PRIORITY:[^\]]+\]/, '')
                    .replace(/\[DEPT:[^\]]+\]/, '')
                    .trim();

                const isDotTodo = cleanLine.startsWith('[·]');
                const isChecked = cleanLine.startsWith('[x]') || cleanLine.startsWith('[✓]');
                const finalContent = (isDotTodo || isChecked) ? cleanLine.substring(3).trim() : cleanLine;

                return {
                    id: `${sectionId}-action-${idx}`,
                    content: finalContent,
                    isCompleted: isChecked,
                    isDirective,
                    priority,
                    departmentId,
                    status: isChecked ? 'completed' : 'pending',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    createdBy: 'system',
                    updatedBy: 'system',
                };
            });
    };

    const [actions, setActions] = useState<PlannerAction[]>(() => parseContentToActions(initialContent));
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');
    const [assignModalOpen, setAssignModalOpen] = useState<string | null>(null);
    const [assignFormData, setAssignFormData] = useState({
        employeeId: '',
        startDate: new Date().toISOString().split('T')[0],
        dueDate: '',
    });

    // Sync with streaming content updates from useSimulation
    useEffect(() => {
        if (initialContent && initialContent.trim()) {
            const newActions = parseContentToActions(initialContent);
            // Only update if content has actually changed (avoid infinite loops)
            if (newActions.length !== actions.length ||
                newActions.some((na, i) => actions[i]?.content !== na.content)) {
                setActions(newActions);
            }
        }
    }, [initialContent]); // Only depend on initialContent, not actions

    const handleEdit = (action: PlannerAction) => {
        setEditingId(action.id);
        setEditContent(action.content);
    };

    const handleSaveEdit = (id: string) => {
        setActions(prev => prev.map(a =>
            a.id === id
                ? { ...a, content: editContent, updatedAt: new Date().toISOString(), updatedBy: 'current-user' }
                : a
        ));
        setEditingId(null);
        setEditContent('');
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditContent('');
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this action?')) {
            setActions(prev => prev.filter(a => a.id !== id));
        }
    };

    const handleToggleComplete = (id: string) => {
        setActions(prev => prev.map(a =>
            a.id === id
                ? { ...a, isCompleted: !a.isCompleted, updatedAt: new Date().toISOString(), updatedBy: 'current-user' }
                : a
        ));
    };

    const handleAssign = (action: PlannerAction) => {
        setAssignModalOpen(action.id);
        setAssignFormData({
            employeeId: action.assignedToEmployeeId || '',
            startDate: action.startDate || new Date().toISOString().split('T')[0],
            dueDate: action.dueDate || '',
        });
    };

    const handleSaveAssignment = (actionId: string) => {
        const employee = employees.find(e => e.id === assignFormData.employeeId);
        setActions(prev => prev.map(a =>
            a.id === actionId
                ? {
                    ...a,
                    assignedToEmployeeId: assignFormData.employeeId,
                    assignedToEmployeeName: employee?.name,
                    startDate: assignFormData.startDate,
                    dueDate: assignFormData.dueDate || undefined,
                    updatedAt: new Date().toISOString(),
                    updatedBy: 'current-user'
                }
                : a
        ));
        setAssignModalOpen(null);
        setAssignFormData({ employeeId: '', startDate: new Date().toISOString().split('T')[0], dueDate: '' });
    };

    const handleAddNew = (afterId?: string) => {
        const newAction: PlannerAction = {
            id: `${sectionId}-action-${Date.now()}`,
            content: 'New action item',
            isCompleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'current-user',
            updatedBy: 'current-user',
        };
        
        if (afterId) {
            // Insert after the specified action
            setActions(prev => {
                const index = prev.findIndex(a => a.id === afterId);
                if (index >= 0) {
                    const newActions = [...prev];
                    newActions.splice(index + 1, 0, newAction);
                    return newActions;
                }
                // If not found, append to end
                return [...prev, newAction];
            });
        } else {
            // Append to end (existing behavior)
            setActions(prev => [...prev, newAction]);
        }
        
        setEditingId(newAction.id);
        setEditContent('New action item');
    };

    const handleAddAfter = (actionId: string) => {
        handleAddNew(actionId);
    };

    return (
        <div className="space-y-3">
            {title && (
                <div className="mb-4">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">{title}</h4>
                </div>
            )}

            {actions.length === 0 ? (
                <div className="text-center py-8 text-sm text-neutral-500">
                    No actions. Click "Add Action" to create one.
                </div>
            ) : (
                <>
                    <ul className="space-y-2">
                        {actions.map((action) => (
                            <li
                                key={action.id}
                                className={`flex items-start gap-3 group p-3 rounded-lg transition-all border ${action.isDirective
                                    ? 'bg-soft-white/10 border-cane-green/10 hover:border-cane-green/40'
                                    : 'hover:bg-neutral-50 border-transparent'
                                    }`}
                            >
                                {/* Checkbox */}
                                <button
                                    onClick={() => handleToggleComplete(action.id)}
                                    className={`w-5 h-5 rounded-full border mt-0.5 shrink-0 flex items-center justify-center transition-all ${action.isCompleted
                                        ? 'bg-slate-50 border-slate-200 opacity-60'
                                        : action.isDirective ? 'bg-cane-green/10 border-cane-green/30 hover:border-cane-green' : 'bg-slate-100 border-slate-200 hover:border-cane-green cursor-pointer'
                                        }`}
                                >
                                    {action.isCompleted ? (
                                        <Check size={12} className="text-slate-400" />
                                    ) : (
                                        <div className={`w-1.5 h-1.5 rounded-full ${action.isDirective ? 'bg-industrial-gray/90' : 'bg-industrial-gray'}`} />
                                    )}
                                </button>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    {editingId === action.id ? (
                                        <input
                                            type="text"
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            onBlur={() => handleSaveEdit(action.id)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleSaveEdit(action.id);
                                                } else if (e.key === 'Escape') {
                                                    handleCancelEdit();
                                                }
                                            }}
                                            className="w-full px-2 py-1 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                                            autoFocus
                                        />
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-2 mb-1">
                                                {action.isDirective && (
                                                    <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-industrial-gray text-white rounded">
                                                        CEO Directive
                                                    </span>
                                                )}
                                                {action.priority && (
                                                    <span className={`px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded ${action.priority === 'critical' ? 'bg-red-100 text-red-700' :
                                                        action.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                                            'bg-slate-100 text-slate-600'
                                                        }`}>
                                                        {action.priority} Priority
                                                    </span>
                                                )}
                                                {action.departmentId && (
                                                    <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 rounded">
                                                        {action.departmentId}
                                                    </span>
                                                )}
                                            </div>
                                            <span className={`text-sm font-medium leading-relaxed block ${action.isCompleted ? 'text-slate-400 italic line-through' : 'text-slate-900'}`}>
                                                {action.content}
                                            </span>
                                            {(action.assignedToEmployeeName || action.dueDate) && (
                                                <div className="flex items-center gap-3 mt-1.5 text-xs text-neutral-500">
                                                    {action.assignedToEmployeeName && (
                                                        <span className="flex items-center gap-1">
                                                            <UserPlus size={12} />
                                                            {action.assignedToEmployeeName}
                                                        </span>
                                                    )}
                                                    {action.dueDate && (
                                                        <span className="flex items-center gap-1">
                                                            <Calendar size={12} />
                                                            {new Date(action.dueDate).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Actions */}
                                {editingId !== action.id && (
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleAddAfter(action.id)}
                                            className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
                                            title="Add Step"
                                        >
                                            <Plus size={14} className="text-cane-green" />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(action)}
                                            className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={14} className="text-neutral-600" />
                                        </button>
                                        <button
                                            onClick={() => handleAssign(action)}
                                            className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
                                            title="Assign to Employee"
                                        >
                                            <UserPlus size={14} className="text-cane-green" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(action.id)}
                                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} className="text-red-600" />
                                        </button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                    
                    {/* Add Step Button Below Last Item */}
                    <button
                        onClick={() => handleAddNew()}
                        className="w-full mt-3 px-4 py-2 border border-dashed border-neutral-300 rounded-lg text-sm text-neutral-600 hover:border-cane-green hover:text-industrial-gray hover:bg-soft-white/50 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={16} />
                        <span>Add Step</span>
                    </button>
                </>
            )}

            {/* Assign Modal */}
            {assignModalOpen && (
                <Modal
                    isOpen={!!assignModalOpen}
                    onClose={() => setAssignModalOpen(null)}
                    title="Assign Action to Employee"
                    size="md"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-1">
                                Employee *
                            </label>
                            <select
                                required
                                value={assignFormData.employeeId}
                                onChange={(e) => setAssignFormData({ ...assignFormData, employeeId: e.target.value })}
                                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                            >
                                <option value="">Select Employee</option>
                                {employees.filter(e => e.isActive).map((emp) => (
                                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-900 mb-1">
                                    Start Date *
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={assignFormData.startDate}
                                    onChange={(e) => setAssignFormData({ ...assignFormData, startDate: e.target.value })}
                                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-900 mb-1">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    value={assignFormData.dueDate}
                                    onChange={(e) => setAssignFormData({ ...assignFormData, dueDate: e.target.value })}
                                    min={assignFormData.startDate}
                                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={() => handleSaveAssignment(assignModalOpen!)}
                                disabled={!assignFormData.employeeId || !assignFormData.startDate}
                                className="flex-1 px-4 py-2 bg-industrial-gray text-white rounded-lg text-sm font-medium hover:bg-industrial-gray/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Assign
                            </button>
                            <button
                                onClick={() => setAssignModalOpen(null)}
                                className="px-4 py-2 border border-neutral-200 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

