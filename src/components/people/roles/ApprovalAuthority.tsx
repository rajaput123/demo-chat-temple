import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Role, ApprovalAuthority as ApprovalAuthorityType, ApprovalType } from '@/types/role';
import { RoleService } from '@/services/roleService';
import Modal from '@/components/shared/Modal';

const APPROVAL_TYPES: ApprovalType[] = ['task-assignment', 'task-closure', 'department-override', 'emergency-override'];

const approvalLabels: Record<ApprovalType, string> = {
    'task-assignment': 'Task Assignment',
    'task-closure': 'Task Closure',
    'department-override': 'Department Override',
    'emergency-override': 'Emergency Override',
};

interface ApprovalAuthorityProps {
    roles: Role[];
    authorities: ApprovalAuthorityType[];
    setAuthorities: React.Dispatch<React.SetStateAction<ApprovalAuthorityType[]>>;
}

export default function ApprovalAuthority({ roles, authorities, setAuthorities }: ApprovalAuthorityProps) {
    const [selectedRole, setSelectedRole] = useState<Role | null>(roles[0] || null);
    
    useEffect(() => {
        if (roles.length > 0 && !selectedRole) {
            setSelectedRole(roles[0]);
        }
    }, [roles, selectedRole]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        approvalType: 'task-assignment' as ApprovalType,
        approvalLevel: 1,
        requiresDualApproval: false,
        canOverride: false,
    });

    const getRoleAuthorities = (roleId: string): ApprovalAuthorityType[] => {
        return authorities.filter(a => a.roleId === roleId);
    };

    const handleAddAuthority = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedRole) return;

        try {
            const authority = await RoleService.defineApprovalAuthority(
                {
                    roleId: selectedRole.id,
                    ...formData,
                },
                'current-user'
            );
            setAuthorities(prev => [...prev, authority]);
            setIsModalOpen(false);
            setFormData({
                approvalType: 'task-assignment',
                approvalLevel: 1,
                requiresDualApproval: false,
                canOverride: false,
            });
        } catch (error: any) {
            alert(error.message || 'Failed to add approval authority');
        }
    };

    const roleAuthorities = selectedRole ? getRoleAuthorities(selectedRole.id) : [];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-black text-neutral-900">Approval Authority</h3>
                    <p className="text-sm text-neutral-500 mt-1">Define approval capabilities for each role</p>
                </div>
            </div>

            {/* Role Selector */}
            <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                    Select Role
                </label>
                <select
                    value={selectedRole?.id || ''}
                    onChange={(e) => {
                        const role = roles.find(r => r.id === e.target.value);
                        setSelectedRole(role || null);
                    }}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                >
                    <option value="">Select a role</option>
                    {roles.filter(r => r.isActive).map((role) => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                </select>
            </div>

            {selectedRole ? (
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-soft-white border border-cane-green/20 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Shield size={18} className="text-industrial-gray" />
                            <span className="text-sm font-black text-industrial-gray">{selectedRole.name}</span>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-3 py-1.5 bg-industrial-gray text-white rounded-lg text-xs font-medium hover:bg-industrial-gray/90 transition-all"
                        >
                            Add Approval Authority
                        </button>
                    </div>

                    {roleAuthorities.length === 0 ? (
                        <div className="text-center py-8 border border-neutral-200 rounded-lg bg-neutral-50">
                            <AlertTriangle className="mx-auto text-neutral-400 mb-2" size={24} />
                            <p className="text-sm text-neutral-500">No approval authorities defined for this role</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {roleAuthorities.map((authority) => (
                                <div
                                    key={authority.id}
                                    className="p-4 rounded-lg border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <CheckCircle2 size={16} className="text-green-600" />
                                                <span className="text-sm font-medium text-neutral-900">
                                                    {approvalLabels[authority.approvalType]}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-neutral-500">
                                                <span>Level: {authority.approvalLevel}</span>
                                                {authority.requiresDualApproval && (
                                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                                                        Dual Approval Required
                                                    </span>
                                                )}
                                                {authority.canOverride && (
                                                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded">
                                                        Can Override
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Hierarchy Visualization */}
                    {roleAuthorities.length > 0 && (
                        <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                            <h4 className="text-sm font-black text-neutral-900 mb-3">Approval Hierarchy</h4>
                            <div className="space-y-2">
                                {roleAuthorities
                                    .sort((a, b) => a.approvalLevel - b.approvalLevel)
                                    .map((authority) => (
                                        <div key={authority.id} className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-industrial-gray text-white flex items-center justify-center text-xs font-bold">
                                                {authority.approvalLevel}
                                            </div>
                                            <span className="text-sm text-neutral-700">
                                                {approvalLabels[authority.approvalType]}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-12 border border-neutral-200 rounded-xl bg-neutral-50">
                    <Shield className="mx-auto text-neutral-400 mb-3" size={32} />
                    <p className="text-sm text-neutral-500">Select a role to define approval authority</p>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add Approval Authority"
                size="md"
            >
                <form onSubmit={handleAddAuthority} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                            Approval Type *
                        </label>
                        <select
                            required
                            value={formData.approvalType}
                            onChange={(e) => setFormData({ ...formData, approvalType: e.target.value as ApprovalType })}
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                        >
                            {APPROVAL_TYPES.map((type) => (
                                <option key={type} value={type}>{approvalLabels[type]}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                            Approval Level *
                        </label>
                        <input
                            type="number"
                            required
                            min="1"
                            max="10"
                            value={formData.approvalLevel}
                            onChange={(e) => setFormData({ ...formData, approvalLevel: parseInt(e.target.value) })}
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                        />
                        <p className="text-xs text-neutral-500 mt-1">Lower numbers = higher authority (1 = highest)</p>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.requiresDualApproval}
                                onChange={(e) => setFormData({ ...formData, requiresDualApproval: e.target.checked })}
                                className="rounded"
                            />
                            <span className="text-sm text-neutral-700">Requires Dual Approval</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.canOverride}
                                onChange={(e) => setFormData({ ...formData, canOverride: e.target.checked })}
                                className="rounded"
                            />
                            <span className="text-sm text-neutral-700">Can Override</span>
                        </label>
                    </div>

                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-xs text-yellow-800 font-medium">
                            <strong>Warning:</strong> Emergency overrides must be logged separately and require special audit trails.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-industrial-gray text-white rounded-lg text-sm font-medium hover:bg-industrial-gray/90 transition-all"
                        >
                            Add Authority
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
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

