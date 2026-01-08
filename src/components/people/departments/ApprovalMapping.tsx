import React, { useState } from 'react';
import { Shield, Plus, X } from 'lucide-react';
import { Department, ApprovalMapping as ApprovalMappingType } from '@/types/department';

interface ApprovalMappingProps {
    departments: Department[];
    approvalMappings: ApprovalMappingType[];
    roles: Array<{ id: string; name: string }>;
    onAdd: (mapping: Omit<ApprovalMappingType, 'createdAt'>) => void;
    onRemove: (departmentId: string, roleId: string, approvalType: string) => void;
}

export default function ApprovalMapping({
    departments,
    approvalMappings,
    roles,
    onAdd,
    onRemove
}: ApprovalMappingProps) {
    const [selectedDept, setSelectedDept] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [selectedType, setSelectedType] = useState<'financial' | 'asset' | 'operational' | 'project'>('operational');
    const [requiresDual, setRequiresDual] = useState(false);

    const getMappingsForDepartment = (deptId: string) => {
        return approvalMappings.filter(m => m.departmentId === deptId);
    };

    const handleAdd = () => {
        if (selectedDept && selectedRole) {
            onAdd({
                departmentId: selectedDept,
                roleId: selectedRole,
                approvalType: selectedType,
                requiresDualApproval: requiresDual
            });
            setSelectedDept('');
            setSelectedRole('');
            setSelectedType('operational');
            setRequiresDual(false);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900">Approval Mapping</h3>
            <p className="text-xs text-neutral-500">Map roles to approval types for each department</p>

            {/* Add New Mapping */}
            <div className="p-4 rounded-lg border border-neutral-200 bg-neutral-50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                    <select
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        className="px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                    >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                    </select>

                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                    >
                        <option value="">Select Role</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                    </select>

                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value as any)}
                        className="px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                    >
                        <option value="financial">Financial</option>
                        <option value="asset">Asset</option>
                        <option value="operational">Operational</option>
                        <option value="project">Project</option>
                    </select>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={requiresDual}
                            onChange={(e) => setRequiresDual(e.target.checked)}
                            className="rounded"
                        />
                        <span className="text-xs text-neutral-600">Dual Approval</span>
                    </label>
                </div>
                <button
                    onClick={handleAdd}
                    disabled={!selectedDept || !selectedRole}
                    className="flex items-center gap-2 px-3 py-1.5 bg-industrial-gray text-white rounded-lg text-xs font-medium hover:bg-industrial-gray/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus size={14} />
                    <span>Add Mapping</span>
                </button>
            </div>

            {/* Existing Mappings */}
            <div className="space-y-3">
                {departments.map((dept) => {
                    const mappings = getMappingsForDepartment(dept.id);
                    if (mappings.length === 0) return null;

                    return (
                        <div key={dept.id} className="p-3 rounded-lg border border-neutral-200">
                            <div className="text-sm font-medium text-neutral-900 mb-2">{dept.name}</div>
                            <div className="space-y-1">
                                {mappings.map((mapping, idx) => {
                                    const role = roles.find(r => r.id === mapping.roleId);
                                    return (
                                        <div key={idx} className="flex items-center justify-between p-2 bg-neutral-50 rounded">
                                            <div className="flex items-center gap-2">
                                                <Shield size={14} className="text-neutral-400" />
                                                <span className="text-xs text-neutral-900">{role?.name}</span>
                                                <span className="text-xs text-neutral-500">•</span>
                                                <span className="text-xs text-neutral-500 capitalize">{mapping.approvalType}</span>
                                                {mapping.requiresDualApproval && (
                                                    <span className="text-xs px-1.5 py-0.5 bg-cane-green/10 text-cane-green/80 rounded">Dual</span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => onRemove(mapping.departmentId, mapping.roleId, mapping.approvalType)}
                                                className="p-1 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <X size={12} className="text-red-600" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

