import React from 'react';
import { Building2, Shield, Check } from 'lucide-react';
import { Role } from '@/types/role';
import { Department } from '@/types/department';
import { RoleDepartmentMapping as RoleDepartmentMappingType } from '@/types/role';
import { RoleService } from '@/services/roleService';

interface RoleDepartmentMappingProps {
    roles: Role[];
    departments: Department[];
    mappings: RoleDepartmentMappingType[];
    setMappings: React.Dispatch<React.SetStateAction<RoleDepartmentMappingType[]>>;
}

export default function RoleDepartmentMapping({ roles, departments, mappings, setMappings }: RoleDepartmentMappingProps) {

    const isMapped = (roleId: string, departmentId: string): boolean => {
        return mappings.some(m => m.roleId === roleId && m.departmentId === departmentId && m.isValid);
    };

    const handleToggleMapping = async (roleId: string, departmentId: string) => {
        const existing = mappings.find(m => m.roleId === roleId && m.departmentId === departmentId);
        
        try {
            if (existing && existing.isValid) {
                // Remove mapping
                await RoleService.removeRoleDepartmentMapping(existing.id);
                setMappings(prev => prev.filter(m => m.id !== existing.id));
            } else {
                // Add mapping
                const mapping = await RoleService.mapRoleToDepartment(roleId, departmentId, 'current-user');
                if (existing) {
                    setMappings(prev => prev.map(m => m.id === existing.id ? mapping : m));
                } else {
                    setMappings(prev => [...prev, mapping]);
                }
            }
        } catch (error: any) {
            alert(error.message || 'Failed to update mapping');
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-black text-neutral-900">Role-Department Mapping</h3>
                <p className="text-sm text-neutral-500 mt-1">Define which roles are valid for which departments</p>
            </div>

            {roles.length === 0 || departments.length === 0 ? (
                <div className="text-center py-12 border border-neutral-200 rounded-xl bg-neutral-50">
                    <Building2 className="mx-auto text-neutral-400 mb-3" size={32} />
                    <p className="text-sm text-neutral-500">
                        {roles.length === 0 ? 'Create roles first' : 'Create departments first'}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full">
                        <table className="min-w-full border border-neutral-200 rounded-lg">
                            <thead>
                                <tr className="bg-neutral-50">
                                    <th className="px-4 py-3 text-left text-xs font-black text-neutral-900 uppercase tracking-wider border-b border-neutral-200">
                                        Role
                                    </th>
                                    {departments.filter(d => d.isActive).map((dept) => (
                                        <th
                                            key={dept.id}
                                            className="px-4 py-3 text-center text-xs font-black text-neutral-900 uppercase tracking-wider border-b border-neutral-200"
                                        >
                                            {dept.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {roles.filter(r => r.isActive).map((role) => (
                                    <tr key={role.id} className="hover:bg-neutral-50 transition-colors">
                                        <td className="px-4 py-3 border-b border-neutral-200">
                                            <div className="flex items-center gap-2">
                                                <Shield size={16} className="text-industrial-gray" />
                                                <span className="text-sm font-medium text-neutral-900">{role.name}</span>
                                            </div>
                                        </td>
                                        {departments.filter(d => d.isActive).map((dept) => {
                                            const mapped = isMapped(role.id, dept.id);
                                            return (
                                                <td
                                                    key={dept.id}
                                                    className="px-4 py-3 text-center border-b border-neutral-200"
                                                >
                                                    <button
                                                        onClick={() => handleToggleMapping(role.id, dept.id)}
                                                        className={`w-8 h-8 rounded-lg border-2 transition-all flex items-center justify-center ${
                                                            mapped
                                                                ? 'bg-industrial-gray border-industrial-gray text-white'
                                                                : 'border-neutral-200 hover:border-cane-green'
                                                        }`}
                                                        title={mapped ? 'Remove mapping' : 'Add mapping'}
                                                    >
                                                        {mapped && <Check size={16} />}
                                                    </button>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800 font-medium">
                    <strong>Note:</strong> Invalid role-department combinations will be blocked during role assignment. 
                    For example, a Finance Officer role cannot be assigned to the Ritual Department if not mapped here.
                </p>
            </div>
        </div>
    );
}

