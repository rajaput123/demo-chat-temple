import React, { useState } from 'react';
import { Shield, Plus, Edit2, XCircle } from 'lucide-react';
import Modal from '@/components/shared/Modal';
import { Role, RoleCategory } from '@/types/role';
import { RoleService } from '@/services/roleService';

interface RoleMasterProps {
    roles: Role[];
    setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
}

export default function RoleMaster({ roles, setRoles }: RoleMasterProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'operational' as RoleCategory,
        description: '',
        isActive: true,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Role name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            if (editingRole) {
                // Update role (in production, implement update method)
                setRoles(prev => prev.map(r => r.id === editingRole.id ? { ...r, ...formData } : r));
            } else {
                // Create role
                const role = await RoleService.createRole(
                    formData,
                    'current-user'
                );
                setRoles(prev => [...prev, role]);
            }
            
            setIsModalOpen(false);
            resetForm();
        } catch (error: any) {
            setErrors({ submit: error.message || 'Failed to create role' });
        }
    };

    const handleDeactivate = async (role: Role) => {
        if (!confirm(`Are you sure you want to deactivate "${role.name}"? Roles cannot be deleted, only deactivated.`)) {
            return;
        }

        try {
            const updatedRole = await RoleService.deactivateRole(role.id, 'current-user');
            setRoles(prev => prev.map(r => r.id === role.id ? updatedRole : r));
        } catch (error: any) {
            alert(error.message || 'Failed to deactivate role');
        }
    };

    const handleEdit = (role: Role) => {
        setEditingRole(role);
        setFormData({
            name: role.name,
            category: role.category,
            description: role.description || '',
            isActive: role.isActive,
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category: 'operational',
            description: '',
            isActive: true,
        });
        setEditingRole(null);
        setErrors({});
    };

    const categoryLabels: Record<RoleCategory, string> = {
        operational: 'Operational',
        supervisory: 'Supervisory',
        administrative: 'Administrative',
        audit: 'Audit',
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-black text-neutral-900">Role Master</h3>
                    <p className="text-sm text-neutral-500 mt-1">Define roles that can be assigned to employees. Roles cannot be deleted, only deactivated.</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-industrial-gray text-white rounded-lg text-sm font-medium hover:bg-industrial-gray/90 transition-all"
                >
                    <Plus size={18} />
                    <span>Create Role</span>
                </button>
            </div>

            {roles.length === 0 ? (
                <div className="text-center py-12 border border-neutral-200 rounded-xl bg-neutral-50">
                    <Shield className="mx-auto text-neutral-400 mb-3" size={32} />
                    <p className="text-sm text-neutral-500">No roles found. Create your first role.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {roles.map((role) => (
                        <div
                            key={role.id}
                            className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    role.isActive ? 'bg-industrial-gray/10' : 'bg-neutral-100'
                                }`}>
                                    <Shield size={18} className={role.isActive ? 'text-industrial-gray' : 'text-neutral-400'} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-neutral-900">{role.name}</span>
                                        {!role.isActive && (
                                            <span className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs font-medium rounded">
                                                Inactive
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-neutral-500">{categoryLabels[role.category]}</span>
                                        <span className="text-xs text-neutral-400">•</span>
                                        <span className="text-xs text-neutral-500">{role.permissions.length} permissions</span>
                                    </div>
                                    {role.description && (
                                        <p className="text-xs text-neutral-400 mt-1">{role.description}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleEdit(role)}
                                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                    title="Edit Role"
                                >
                                    <Edit2 size={16} className="text-neutral-600" />
                                </button>
                                {role.isActive && (
                                    <button
                                        onClick={() => handleDeactivate(role)}
                                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Deactivate Role"
                                    >
                                        <XCircle size={16} className="text-red-600" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    resetForm();
                }}
                title={editingRole ? 'Edit Role' : 'Create Role'}
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {errors.submit && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800">{errors.submit}</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                            Role Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green ${errors.name ? 'border-red-300' : 'border-neutral-200'}`}
                            placeholder="e.g., Department Head, Supervisor, Staff"
                        />
                        {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                        <p className="text-xs text-neutral-500 mt-1">Role names must be unique</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                            Category *
                        </label>
                        <select
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value as RoleCategory })}
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                        >
                            <option value="operational">Operational</option>
                            <option value="supervisory">Supervisory</option>
                            <option value="administrative">Administrative</option>
                            <option value="audit">Audit (Read-Only)</option>
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
                            placeholder="Describe the role's purpose and responsibilities"
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

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-800 font-medium">
                            Note: Roles cannot be deleted, only deactivated. Deactivated roles preserve all historical assignments.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-industrial-gray text-white rounded-lg text-sm font-medium hover:bg-industrial-gray/90 transition-all"
                        >
                            {editingRole ? 'Update Role' : 'Create Role'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsModalOpen(false);
                                resetForm();
                            }}
                            className="px-4 py-2 border border-neutral-200 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

