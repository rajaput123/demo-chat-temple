import React, { useState, useEffect } from 'react';
import { Shield, Check, X } from 'lucide-react';
import { Role, PermissionType, RolePermission } from '@/types/role';
import { RoleService } from '@/services/roleService';

const PERMISSION_TYPES: PermissionType[] = ['view', 'create', 'assign', 'approve', 'modify', 'close', 'override'];
const MODULES = ['Operations', 'Finance', 'Assets', 'Projects', 'People', 'All'];

const permissionLabels: Record<PermissionType, string> = {
    view: 'View',
    create: 'Create',
    assign: 'Assign',
    approve: 'Approve',
    modify: 'Modify',
    close: 'Close',
    override: 'Override',
};

interface PermissionDefinitionProps {
    roles: Role[];
    permissions: RolePermission[];
    setPermissions: React.Dispatch<React.SetStateAction<RolePermission[]>>;
}

export default function PermissionDefinition({ roles, permissions, setPermissions }: PermissionDefinitionProps) {
    const [selectedRole, setSelectedRole] = useState<Role | null>(roles[0] || null);
    
    useEffect(() => {
        if (roles.length > 0 && !selectedRole) {
            setSelectedRole(roles[0]);
        }
    }, [roles, selectedRole]);

    const hasPermission = (roleId: string, permissionType: PermissionType, scope: string): boolean => {
        return permissions.some(
            p => p.roleId === roleId && p.permissionType === permissionType && p.scope === scope
        );
    };

    const handleTogglePermission = async (permissionType: PermissionType, scope: string) => {
        if (!selectedRole) return;

        const hasPerm = hasPermission(selectedRole.id, permissionType, scope);

        try {
            if (hasPerm) {
                // Remove permission
                setPermissions(prev => prev.filter(
                    p => !(p.roleId === selectedRole.id && p.permissionType === permissionType && p.scope === scope)
                ));
            } else {
                // Add permission
                const newPermissions = await RoleService.definePermissions(
                    selectedRole.id,
                    [{ permissionType, scope }],
                    'current-user'
                );
                setPermissions(prev => [...prev, ...newPermissions]);
            }
        } catch (error: any) {
            alert(error.message || 'Failed to update permission');
        }
    };

    const selectedRolePermissions = selectedRole
        ? permissions.filter(p => p.roleId === selectedRole.id)
        : [];

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-black text-neutral-900">Permission Definition</h3>
                <p className="text-sm text-neutral-500 mt-1">Define permissions for each role, scoped by module</p>
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
                    <div className="p-4 bg-soft-white border border-cane-green/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield size={18} className="text-industrial-gray" />
                            <span className="text-sm font-black text-industrial-gray">{selectedRole.name}</span>
                        </div>
                        <p className="text-xs text-industrial-gray/90">
                            {selectedRole.category === 'audit' 
                                ? 'Auditor roles are read-only (View permission only)'
                                : 'Define permissions for this role'}
                        </p>
                    </div>

                    {/* Permission Matrix */}
                    <div className="overflow-x-auto">
                        <div className="inline-block min-w-full">
                            <table className="min-w-full border border-neutral-200 rounded-lg">
                                <thead>
                                    <tr className="bg-neutral-50">
                                        <th className="px-4 py-3 text-left text-xs font-black text-neutral-900 uppercase tracking-wider border-b border-neutral-200">
                                            Permission
                                        </th>
                                        {MODULES.map((module) => (
                                            <th
                                                key={module}
                                                className="px-4 py-3 text-center text-xs font-black text-neutral-900 uppercase tracking-wider border-b border-neutral-200"
                                            >
                                                {module}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {PERMISSION_TYPES.map((permType) => {
                                        // Auditor roles can only have view permission
                                        const isReadOnly = selectedRole.category === 'audit' && permType !== 'view';
                                        
                                        return (
                                            <tr key={permType} className="hover:bg-neutral-50 transition-colors">
                                                <td className="px-4 py-3 border-b border-neutral-200">
                                                    <span className="text-sm font-medium text-neutral-900">
                                                        {permissionLabels[permType]}
                                                    </span>
                                                </td>
                                                {MODULES.map((module) => {
                                                    const hasPerm = hasPermission(selectedRole.id, permType, module);
                                                    return (
                                                        <td
                                                            key={module}
                                                            className="px-4 py-3 text-center border-b border-neutral-200"
                                                        >
                                                            {isReadOnly ? (
                                                                <div className="w-8 h-8 rounded-lg border-2 border-neutral-200 bg-neutral-100 flex items-center justify-center">
                                                                    <X size={14} className="text-neutral-400" />
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleTogglePermission(permType, module)}
                                                                    className={`w-8 h-8 rounded-lg border-2 transition-all flex items-center justify-center ${
                                                                        hasPerm
                                                                            ? 'bg-industrial-gray border-industrial-gray text-white'
                                                                            : 'border-neutral-200 hover:border-cane-green'
                                                                    }`}
                                                                    title={hasPerm ? 'Remove permission' : 'Add permission'}
                                                                >
                                                                    {hasPerm && <Check size={16} />}
                                                                </button>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-800 font-medium">
                            <strong>Special Rules:</strong> Sacred, financial, and asset permissions require stricter roles. 
                            Auditor roles are read-only (View permission only).
                        </p>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 border border-neutral-200 rounded-xl bg-neutral-50">
                    <Shield className="mx-auto text-neutral-400 mb-3" size={32} />
                    <p className="text-sm text-neutral-500">Select a role to define permissions</p>
                </div>
            )}
        </div>
    );
}

