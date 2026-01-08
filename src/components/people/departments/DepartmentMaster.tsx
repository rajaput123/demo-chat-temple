import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Building2 } from 'lucide-react';
import { Department } from '@/types/department';
import Modal from '@/components/shared/Modal';

interface DepartmentMasterProps {
    departments: Department[];
    onAdd: (department: Omit<Department, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => void;
    onEdit: (department: Department) => void;
    onDelete: (departmentId: string) => void;
}

export default function DepartmentMaster({ departments, onAdd, onEdit, onDelete }: DepartmentMasterProps) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        parentId: '',
        headEmployeeId: '',
        description: '',
        isActive: true
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            ...formData,
            parentId: formData.parentId || null,
            headEmployeeId: formData.headEmployeeId || null,
        });
        setIsAddModalOpen(false);
        setFormData({
            name: '',
            code: '',
            parentId: '',
            headEmployeeId: '',
            description: '',
            isActive: true
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-neutral-900">Department Master</h3>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-industrial-gray text-white rounded-lg text-xs font-medium hover:bg-industrial-gray/90 transition-all"
                >
                    <Plus size={14} />
                    <span>Add Department</span>
                </button>
            </div>

            {/* Add Department Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add Department"
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                            Department Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                            Department Code *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                            Parent Department
                        </label>
                        <select
                            value={formData.parentId}
                            onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                        >
                            <option value="">None (Top Level)</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="rounded"
                        />
                        <label className="text-sm text-neutral-700">Active</label>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-industrial-gray text-white rounded-lg text-sm font-medium hover:bg-industrial-gray/90 transition-all"
                        >
                            Create Department
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(false)}
                            className="px-4 py-2 border border-neutral-200 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>

            <div className="space-y-2">
                {departments.length === 0 ? (
                    <div className="text-center py-8 text-sm text-neutral-500">
                        No departments found. Create your first department.
                    </div>
                ) : (
                    departments.map((dept) => (
                        <div
                            key={dept.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <Building2 size={18} className="text-neutral-400" />
                                <div>
                                    <div className="text-sm font-medium text-neutral-900">{dept.name}</div>
                                    <div className="text-xs text-neutral-500">{dept.code}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onEdit(dept)}
                                    className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
                                >
                                    <Edit2 size={14} className="text-neutral-600" />
                                </button>
                                <button
                                    onClick={() => onDelete(dept.id)}
                                    className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={14} className="text-red-600" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

