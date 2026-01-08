import React, { useState } from 'react';
import { Shield, Building2, Key, UserCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import RoleMaster from './RoleMaster';
import RoleDepartmentMapping from './RoleDepartmentMapping';
import PermissionDefinition from './PermissionDefinition';
import RoleAssignment from './RoleAssignment';
import ApprovalAuthority from './ApprovalAuthority';
import RoleReadiness from './RoleReadiness';
import { Employee } from '@/types/employee';
import { Department } from '@/types/department';
import { Role, RoleAssignment as RoleAssignmentType, RoleDepartmentMapping as RoleDepartmentMappingType, RolePermission, ApprovalAuthority as ApprovalAuthorityType } from '@/types/role';

type TabId = 'master' | 'mapping' | 'permissions' | 'assignment' | 'authority' | 'readiness';

interface Tab {
    id: TabId;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    description: string;
}

const tabs: Tab[] = [
    {
        id: 'master',
        label: 'Role Master',
        icon: Shield,
        description: 'Create and manage roles',
    },
    {
        id: 'mapping',
        label: 'Role-Department Mapping',
        icon: Building2,
        description: 'Define valid role-department combinations',
    },
    {
        id: 'permissions',
        label: 'Permission Definition',
        icon: Key,
        description: 'Define permissions for each role',
    },
    {
        id: 'assignment',
        label: 'Role Assignment',
        icon: UserCheck,
        description: 'Assign roles to employees',
    },
    {
        id: 'authority',
        label: 'Approval Authority',
        icon: CheckCircle2,
        description: 'Define approval capabilities',
    },
    {
        id: 'readiness',
        label: 'Role Readiness',
        icon: AlertTriangle,
        description: 'Check employee operation-readiness',
    },
];

interface RoleAuthorityViewProps {
    employees: Employee[];
    departments: Department[];
    roles: Role[];
    roleAssignments: RoleAssignmentType[];
    roleDepartmentMappings: RoleDepartmentMappingType[];
    rolePermissions: RolePermission[];
    approvalAuthorities: ApprovalAuthorityType[];
    setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
    setRoleAssignments: React.Dispatch<React.SetStateAction<RoleAssignmentType[]>>;
    setRoleDepartmentMappings: React.Dispatch<React.SetStateAction<RoleDepartmentMappingType[]>>;
    setRolePermissions: React.Dispatch<React.SetStateAction<RolePermission[]>>;
    setApprovalAuthorities: React.Dispatch<React.SetStateAction<ApprovalAuthorityType[]>>;
}

export default function RoleAuthorityView({
    employees,
    departments,
    roles,
    roleAssignments,
    roleDepartmentMappings,
    rolePermissions,
    approvalAuthorities,
    setRoles,
    setRoleAssignments,
    setRoleDepartmentMappings,
    setRolePermissions,
    setApprovalAuthorities,
}: RoleAuthorityViewProps) {
    const [activeTab, setActiveTab] = useState<TabId>('master');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'master':
                return <RoleMaster roles={roles} setRoles={setRoles} />;
            case 'mapping':
                return (
                    <RoleDepartmentMapping
                        roles={roles}
                        departments={departments}
                        mappings={roleDepartmentMappings}
                        setMappings={setRoleDepartmentMappings}
                    />
                );
            case 'permissions':
                return (
                    <PermissionDefinition
                        roles={roles}
                        permissions={rolePermissions}
                        setPermissions={setRolePermissions}
                    />
                );
            case 'assignment':
                return (
                    <RoleAssignment
                        employees={employees}
                        departments={departments}
                        roles={roles}
                        assignments={roleAssignments}
                        setAssignments={setRoleAssignments}
                    />
                );
            case 'authority':
                return (
                    <ApprovalAuthority
                        roles={roles}
                        authorities={approvalAuthorities}
                        setAuthorities={setApprovalAuthorities}
                    />
                );
            case 'readiness':
                return (
                    <RoleReadiness
                        employees={employees}
                        departments={departments}
                        roles={roles}
                        assignments={roleAssignments}
                    />
                );
            default:
                return <RoleMaster roles={roles} setRoles={setRoles} />;
        }
    };

    return (
        <div className="h-full w-full bg-white overflow-auto">
            <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-neutral-100">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 tracking-tight">Role & Authority Management.</h1>
                <p className="text-base text-neutral-500 font-medium italic opacity-60 mt-1">Strict authority control layer for temple operations</p>
            </div>

            <div className="px-4 sm:px-6 py-6">
                <div className="max-w-7xl mx-auto">
                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 border-b border-neutral-200 overflow-x-auto scrollbar-hide">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                                        isActive
                                            ? 'border-cane-green text-industrial-gray bg-soft-white/30'
                                            : 'border-transparent text-neutral-500 hover:text-neutral-900 hover:border-neutral-300'
                                    }`}
                                >
                                    <Icon size={16} />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab Content */}
                    <div className="animate-fadeIn">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}

