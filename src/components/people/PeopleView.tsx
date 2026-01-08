import React, { useState } from 'react';
import DepartmentMaster from './departments/DepartmentMaster';
import DepartmentHierarchy from './departments/DepartmentHierarchy';
import DepartmentHeadAssignment from './departments/DepartmentHeadAssignment';
import ApprovalMapping from './departments/ApprovalMapping';
import EmployeeMaster from './employees/EmployeeMaster';
import PriestManagement from './priests/PriestManagement';
import VolunteerManagement from './volunteers/VolunteerManagement';
import DevoteeRelations from './devotees/DevoteeRelations';
import AccessControl from './access/AccessControl';
import RoleAuthorityView from './roles/RoleAuthorityView';
import FreelancerManagement from './freelancers/FreelancerManagement';
import VIPManagement from './vip/VIPManagement';
import ContentManagement from './content/ContentManagement';
import PRCommunicationManagement from './media/PRCommunicationManagement';
import { ChevronRight } from 'lucide-react';
import { Department, DepartmentHead, ApprovalMapping as ApprovalMappingType } from '@/types/department';
import { Employee } from '@/types/employee';
import { Role, RoleAssignment, RoleDepartmentMapping, RolePermission, ApprovalAuthority } from '@/types/role';

export default function PeopleView() {
    // Mock data - will be replaced with actual API calls
    const [departments, setDepartments] = useState<Department[]>([
        {
            id: 'dept-001',
            name: 'Ritual Department',
            code: 'RIT',
            parentId: null,
            headEmployeeId: 'emp-001',
            description: 'Manages all ritual activities and ceremonies',
            isActive: true,
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
            updatedBy: 'admin',
        },
        {
            id: 'dept-002',
            name: 'Finance & Accounts',
            code: 'FIN',
            parentId: null,
            headEmployeeId: 'emp-002',
            description: 'Financial management, accounting, and compliance',
            isActive: true,
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
            updatedBy: 'admin',
        },
        {
            id: 'dept-003',
            name: 'Asset Custody Department',
            code: 'AST',
            parentId: null,
            headEmployeeId: 'emp-004',
            description: 'Asset management, custody, and security',
            isActive: true,
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
            updatedBy: 'admin',
        },
        {
            id: 'dept-004',
            name: 'Operations & Workflow',
            code: 'OPS',
            parentId: null,
            headEmployeeId: 'emp-006',
            description: 'Daily operations and workflow management',
            isActive: true,
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
            updatedBy: 'admin',
        },
        {
            id: 'dept-005',
            name: 'Security & Safety',
            code: 'SEC',
            parentId: null,
            headEmployeeId: null,
            description: 'Temple security and safety management',
            isActive: true,
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
            updatedBy: 'admin',
        },
    ]);
    const [departmentHeads, setDepartmentHeads] = useState<DepartmentHead[]>([
        {
            departmentId: 'dept-001',
            employeeId: 'emp-001',
            assignedAt: '2024-01-15T10:00:00Z',
            assignedBy: 'admin',
        },
        {
            departmentId: 'dept-002',
            employeeId: 'emp-002',
            assignedAt: '2024-01-20T10:00:00Z',
            assignedBy: 'admin',
        },
        {
            departmentId: 'dept-003',
            employeeId: 'emp-004',
            assignedAt: '2024-02-01T10:00:00Z',
            assignedBy: 'admin',
        },
        {
            departmentId: 'dept-004',
            employeeId: 'emp-006',
            assignedAt: '2024-02-10T10:00:00Z',
            assignedBy: 'admin',
        },
        {
            departmentId: 'dept-005',
            employeeId: 'emp-007',
            assignedAt: '2024-02-15T10:00:00Z',
            assignedBy: 'admin',
        },
    ]);
    const [approvalMappings, setApprovalMappings] = useState<ApprovalMappingType[]>([]);
    
    // Centralized state for employees
    const [employees, setEmployees] = useState<Employee[]>([
        {
            id: 'emp-001',
            name: 'Keshav Bhat',
            email: 'keshav.bhat@temple.org',
            passwordHash: 'hashed_password',
            departmentId: 'dept-001',
            employeeId: 'EMP001',
            phone: '+91 98765 43210',
            address: 'Temple Quarters, Main Building',
            isActive: true,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
            createdBy: 'admin',
            updatedBy: 'admin',
        },
        {
            id: 'emp-002',
            name: 'Arjun Das',
            email: 'arjun.das@temple.org',
            passwordHash: 'hashed_password',
            departmentId: 'dept-002',
            employeeId: 'EMP002',
            phone: '+91 98765 43211',
            isActive: true,
            createdAt: '2024-01-20T10:00:00Z',
            updatedAt: '2024-01-20T10:00:00Z',
            createdBy: 'admin',
            updatedBy: 'admin',
        },
        {
            id: 'emp-003',
            name: 'Priya Sharma',
            email: 'priya.sharma@temple.org',
            passwordHash: 'hashed_password',
            departmentId: 'dept-001',
            employeeId: 'EMP003',
            phone: '+91 98765 43212',
            address: 'Temple Quarters, Block A',
            isActive: true,
            createdAt: '2024-01-25T10:00:00Z',
            updatedAt: '2024-01-25T10:00:00Z',
            createdBy: 'admin',
            updatedBy: 'admin',
        },
        {
            id: 'emp-004',
            name: 'Ramesh Kumar',
            email: 'ramesh.kumar@temple.org',
            passwordHash: 'hashed_password',
            departmentId: 'dept-003',
            employeeId: 'EMP004',
            phone: '+91 98765 43213',
            address: 'Temple Quarters, Block B',
            isActive: true,
            createdAt: '2024-02-01T10:00:00Z',
            updatedAt: '2024-02-01T10:00:00Z',
            createdBy: 'admin',
            updatedBy: 'admin',
        },
        {
            id: 'emp-005',
            name: 'Lakshmi Nair',
            email: 'lakshmi.nair@temple.org',
            passwordHash: 'hashed_password',
            departmentId: 'dept-002',
            employeeId: 'EMP005',
            phone: '+91 98765 43214',
            address: 'Temple Quarters, Block C',
            isActive: true,
            createdAt: '2024-02-05T10:00:00Z',
            updatedAt: '2024-02-05T10:00:00Z',
            createdBy: 'admin',
            updatedBy: 'admin',
        },
        {
            id: 'emp-006',
            name: 'Vikram Reddy',
            email: 'vikram.reddy@temple.org',
            passwordHash: 'hashed_password',
            departmentId: 'dept-004',
            employeeId: 'EMP006',
            phone: '+91 98765 43215',
            address: 'Temple Quarters, Block D',
            isActive: true,
            createdAt: '2024-02-10T10:00:00Z',
            updatedAt: '2024-02-10T10:00:00Z',
            createdBy: 'admin',
            updatedBy: 'admin',
        },
        {
            id: 'emp-007',
            name: 'Anjali Patel',
            email: 'anjali.patel@temple.org',
            passwordHash: 'hashed_password',
            departmentId: 'dept-005',
            employeeId: 'EMP007',
            phone: '+91 98765 43216',
            address: 'Temple Quarters, Block E',
            isActive: true,
            createdAt: '2024-02-15T10:00:00Z',
            updatedAt: '2024-02-15T10:00:00Z',
            createdBy: 'admin',
            updatedBy: 'admin',
        },
        {
            id: 'emp-008',
            name: 'Suresh Iyer',
            email: 'suresh.iyer@temple.org',
            passwordHash: 'hashed_password',
            departmentId: 'dept-001',
            employeeId: 'EMP008',
            phone: '+91 98765 43217',
            address: 'Temple Quarters, Block F',
            isActive: true,
            createdAt: '2024-02-20T10:00:00Z',
            updatedAt: '2024-02-20T10:00:00Z',
            createdBy: 'admin',
            updatedBy: 'admin',
        },
        {
            id: 'emp-009',
            name: 'Meera Joshi',
            email: 'meera.joshi@temple.org',
            passwordHash: 'hashed_password',
            departmentId: 'dept-003',
            employeeId: 'EMP009',
            phone: '+91 98765 43218',
            address: 'Temple Quarters, Block G',
            isActive: true,
            createdAt: '2024-02-25T10:00:00Z',
            updatedAt: '2024-02-25T10:00:00Z',
            createdBy: 'admin',
            updatedBy: 'admin',
        },
        {
            id: 'emp-010',
            name: 'Rajesh Menon',
            email: 'rajesh.menon@temple.org',
            passwordHash: 'hashed_password',
            departmentId: 'dept-002',
            employeeId: 'EMP010',
            phone: '+91 98765 43219',
            address: 'Temple Quarters, Block H',
            isActive: true,
            createdAt: '2024-03-01T10:00:00Z',
            updatedAt: '2024-03-01T10:00:00Z',
            createdBy: 'admin',
            updatedBy: 'admin',
        },
    ]);
    
    // Centralized state for roles
    const [roles, setRoles] = useState<Role[]>([
        {
            id: 'role-001',
            name: 'Department Head',
            category: 'supervisory',
            description: 'Head of department with supervisory authority',
            isActive: true,
            permissions: [],
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
            updatedBy: 'admin',
        },
        {
            id: 'role-002',
            name: 'Finance Officer',
            category: 'administrative',
            description: 'Manages financial transactions and records',
            isActive: true,
            permissions: [],
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
            updatedBy: 'admin',
        },
        {
            id: 'role-003',
            name: 'Asset Custodian',
            category: 'operational',
            description: 'Responsible for asset custody and security',
            isActive: true,
            permissions: [],
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
            updatedBy: 'admin',
        },
        {
            id: 'role-004',
            name: 'Supervisor',
            category: 'supervisory',
            description: 'Supervises operational activities',
            isActive: true,
            permissions: [],
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
            updatedBy: 'admin',
        },
        {
            id: 'role-005',
            name: 'Staff',
            category: 'operational',
            description: 'General staff member with operational duties',
            isActive: true,
            permissions: [],
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
            updatedBy: 'admin',
        },
        {
            id: 'role-006',
            name: 'Security Officer',
            category: 'operational',
            description: 'Manages security and safety operations',
            isActive: true,
            permissions: [],
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
            updatedBy: 'admin',
        },
        {
            id: 'role-007',
            name: 'Auditor',
            category: 'audit',
            description: 'Read-only audit role for compliance verification',
            isActive: true,
            permissions: [],
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
            updatedBy: 'admin',
        },
        {
            id: 'role-008',
            name: 'Operations Coordinator',
            category: 'operational',
            description: 'Coordinates daily operations and workflow',
            isActive: true,
            permissions: [],
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
            updatedBy: 'admin',
        },
    ]);
    
    // Centralized state for role assignments
    const [roleAssignments, setRoleAssignments] = useState<RoleAssignment[]>([
        {
            id: 'assignment-001',
            employeeId: 'emp-001',
            departmentId: 'dept-001',
            roleId: 'role-001',
            assignmentType: 'primary',
            startDate: '2024-01-15',
            isActive: true,
            assignedBy: 'admin',
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
        },
        {
            id: 'assignment-002',
            employeeId: 'emp-002',
            departmentId: 'dept-002',
            roleId: 'role-002',
            assignmentType: 'primary',
            startDate: '2024-01-20',
            isActive: true,
            assignedBy: 'admin',
            createdAt: '2024-01-20T10:00:00Z',
            updatedAt: '2024-01-20T10:00:00Z',
        },
        {
            id: 'assignment-003',
            employeeId: 'emp-003',
            departmentId: 'dept-001',
            roleId: 'role-004',
            assignmentType: 'primary',
            startDate: '2024-01-25',
            isActive: true,
            assignedBy: 'admin',
            createdAt: '2024-01-25T10:00:00Z',
            updatedAt: '2024-01-25T10:00:00Z',
        },
        {
            id: 'assignment-004',
            employeeId: 'emp-004',
            departmentId: 'dept-003',
            roleId: 'role-003',
            assignmentType: 'primary',
            startDate: '2024-02-01',
            isActive: true,
            assignedBy: 'admin',
            createdAt: '2024-02-01T10:00:00Z',
            updatedAt: '2024-02-01T10:00:00Z',
        },
        {
            id: 'assignment-005',
            employeeId: 'emp-005',
            departmentId: 'dept-002',
            roleId: 'role-005',
            assignmentType: 'primary',
            startDate: '2024-02-05',
            isActive: true,
            assignedBy: 'admin',
            createdAt: '2024-02-05T10:00:00Z',
            updatedAt: '2024-02-05T10:00:00Z',
        },
        {
            id: 'assignment-006',
            employeeId: 'emp-006',
            departmentId: 'dept-004',
            roleId: 'role-008',
            assignmentType: 'primary',
            startDate: '2024-02-10',
            isActive: true,
            assignedBy: 'admin',
            createdAt: '2024-02-10T10:00:00Z',
            updatedAt: '2024-02-10T10:00:00Z',
        },
        {
            id: 'assignment-007',
            employeeId: 'emp-007',
            departmentId: 'dept-005',
            roleId: 'role-006',
            assignmentType: 'primary',
            startDate: '2024-02-15',
            isActive: true,
            assignedBy: 'admin',
            createdAt: '2024-02-15T10:00:00Z',
            updatedAt: '2024-02-15T10:00:00Z',
        },
        {
            id: 'assignment-008',
            employeeId: 'emp-008',
            departmentId: 'dept-001',
            roleId: 'role-005',
            assignmentType: 'primary',
            startDate: '2024-02-20',
            isActive: true,
            assignedBy: 'admin',
            createdAt: '2024-02-20T10:00:00Z',
            updatedAt: '2024-02-20T10:00:00Z',
        },
        {
            id: 'assignment-009',
            employeeId: 'emp-009',
            departmentId: 'dept-003',
            roleId: 'role-005',
            assignmentType: 'primary',
            startDate: '2024-02-25',
            isActive: true,
            assignedBy: 'admin',
            createdAt: '2024-02-25T10:00:00Z',
            updatedAt: '2024-02-25T10:00:00Z',
        },
        {
            id: 'assignment-010',
            employeeId: 'emp-010',
            departmentId: 'dept-002',
            roleId: 'role-004',
            assignmentType: 'primary',
            startDate: '2024-03-01',
            isActive: true,
            assignedBy: 'admin',
            createdAt: '2024-03-01T10:00:00Z',
            updatedAt: '2024-03-01T10:00:00Z',
        },
        // Secondary role assignments
        {
            id: 'assignment-011',
            employeeId: 'emp-003',
            departmentId: 'dept-001',
            roleId: 'role-005',
            assignmentType: 'secondary',
            startDate: '2024-01-25',
            isActive: true,
            assignedBy: 'admin',
            createdAt: '2024-01-25T10:00:00Z',
            updatedAt: '2024-01-25T10:00:00Z',
        },
        {
            id: 'assignment-012',
            employeeId: 'emp-005',
            departmentId: 'dept-002',
            roleId: 'role-007',
            assignmentType: 'secondary',
            startDate: '2024-02-05',
            isActive: true,
            assignedBy: 'admin',
            createdAt: '2024-02-05T10:00:00Z',
            updatedAt: '2024-02-05T10:00:00Z',
        },
    ]);
    
    // Centralized state for role-department mappings
    const [roleDepartmentMappings, setRoleDepartmentMappings] = useState<RoleDepartmentMapping[]>([
        {
            id: 'mapping-001',
            roleId: 'role-001',
            departmentId: 'dept-001',
            isValid: true,
            createdAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
        },
        {
            id: 'mapping-002',
            roleId: 'role-001',
            departmentId: 'dept-002',
            isValid: true,
            createdAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
        },
        {
            id: 'mapping-003',
            roleId: 'role-001',
            departmentId: 'dept-003',
            isValid: true,
            createdAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
        },
        {
            id: 'mapping-004',
            roleId: 'role-001',
            departmentId: 'dept-004',
            isValid: true,
            createdAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
        },
        {
            id: 'mapping-005',
            roleId: 'role-001',
            departmentId: 'dept-005',
            isValid: true,
            createdAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
        },
        {
            id: 'mapping-006',
            roleId: 'role-002',
            departmentId: 'dept-002',
            isValid: true,
            createdAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
        },
        {
            id: 'mapping-007',
            roleId: 'role-003',
            departmentId: 'dept-003',
            isValid: true,
            createdAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
        },
        {
            id: 'mapping-008',
            roleId: 'role-004',
            departmentId: 'dept-001',
            isValid: true,
            createdAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
        },
        {
            id: 'mapping-009',
            roleId: 'role-004',
            departmentId: 'dept-002',
            isValid: true,
            createdAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
        },
        {
            id: 'mapping-010',
            roleId: 'role-004',
            departmentId: 'dept-004',
            isValid: true,
            createdAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
        },
        {
            id: 'mapping-011',
            roleId: 'role-005',
            departmentId: 'dept-001',
            isValid: true,
            createdAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
        },
        {
            id: 'mapping-012',
            roleId: 'role-005',
            departmentId: 'dept-002',
            isValid: true,
            createdAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
        },
        {
            id: 'mapping-013',
            roleId: 'role-005',
            departmentId: 'dept-003',
            isValid: true,
            createdAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
        },
        {
            id: 'mapping-014',
            roleId: 'role-005',
            departmentId: 'dept-004',
            isValid: true,
            createdAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
        },
        {
            id: 'mapping-015',
            roleId: 'role-006',
            departmentId: 'dept-005',
            isValid: true,
            createdAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
        },
        {
            id: 'mapping-016',
            roleId: 'role-007',
            departmentId: 'dept-002',
            isValid: true,
            createdAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
        },
        {
            id: 'mapping-017',
            roleId: 'role-008',
            departmentId: 'dept-004',
            isValid: true,
            createdAt: '2024-01-01T10:00:00Z',
            createdBy: 'admin',
        },
    ]);
    
    // Centralized state for role permissions
    const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
    
    // Centralized state for approval authorities
    const [approvalAuthorities, setApprovalAuthorities] = useState<ApprovalAuthority[]>([]);
    
    const [activeSubModule, setActiveSubModule] = useState<string | null>(null);
    const [deptTab, setDeptTab] = useState<'master' | 'hierarchy' | 'heads' | 'approvals'>('master');

    const subModules = [
        {
            id: 'departments',
            label: 'Department Management',
            description: 'Master, hierarchy, head assignment, approval mapping',
            component: null // Special handling for departments
        },
        { id: 'employees', label: 'Employee Management', description: 'Employee master, attendance, shifts', component: EmployeeMaster },
        { id: 'priests', label: 'Priest Management', description: 'Priest management, certifications', component: PriestManagement },
        { id: 'volunteers', label: 'Volunteer Management', description: 'Volunteer and contract staff management', component: VolunteerManagement },
        { id: 'devotees', label: 'Devotee Management', description: 'Devotee and VIP devotee management', component: DevoteeRelations },
        { id: 'freelancers', label: 'Freelancer Management', description: 'Freelancer management, freelancer relationships', component: FreelancerManagement },
        { id: 'vip', label: 'VIP Management', description: 'VIP management, VIP relationships', component: VIPManagement },
        { id: 'content', label: 'Content Management', description: 'Content management, content relationships', component: ContentManagement },
        { id: 'media', label: 'PR & Communication Management', description: 'PR and Communication management, PR and Communication relationships', component: PRCommunicationManagement },
        { id: 'access', label: 'Role & Authority Management', description: 'Role-based access control and authority management', component: RoleAuthorityView },
    ];

    const deptTabs = [
        { id: 'master', label: 'Department Master', component: DepartmentMaster },
        { id: 'hierarchy', label: 'Hierarchy', component: DepartmentHierarchy },
        { id: 'heads', label: 'Head Assignment', component: DepartmentHeadAssignment },
        { id: 'approvals', label: 'Approval Mapping', component: ApprovalMapping },
    ];

    return (
        <div className="h-full w-full bg-white overflow-auto">
            <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-neutral-100">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 tracking-tight">People.</h1>
                <p className="text-base text-neutral-500 font-medium italic opacity-60 mt-1">Organizational core - departments live here</p>
            </div>

            <div className="px-4 sm:px-6 py-6">
                <div className="max-w-7xl mx-auto">
                    {activeSubModule ? (
                        <div>
                            <button
                                onClick={() => setActiveSubModule(null)}
                                className="mb-4 text-sm text-cane-green hover:text-cane-green/80 font-medium"
                            >
                                ← Back to People
                            </button>

                            {/* Special handling for Departments */}
                            {activeSubModule === 'departments' ? (
                                <div>
                                    <div className="flex gap-2 mb-4 border-b border-neutral-200">
                                        {deptTabs.map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setDeptTab(tab.id as any)}
                                                className={`px-3 py-1.5 text-xs font-medium transition-colors border-b-2 ${deptTab === tab.id
                                                    ? 'border-cane-green text-industrial-gray'
                                                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                                                    }`}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                    {deptTab === 'master' && (
                                        <DepartmentMaster
                                            departments={departments}
                                            onAdd={(dept) => {
                                                // Handle department creation
                                                const newDept: Department = {
                                                    ...dept,
                                                    id: `dept-${Date.now()}`,
                                                    createdAt: new Date().toISOString(),
                                                    updatedAt: new Date().toISOString(),
                                                    createdBy: 'current-user',
                                                    updatedBy: 'current-user',
                                                };
                                                setDepartments([...departments, newDept]);
                                            }}
                                            onEdit={(dept) => {
                                                setDepartments(departments.map(d => d.id === dept.id ? dept : d));
                                            }}
                                            onDelete={(deptId) => {
                                                setDepartments(departments.filter(d => d.id !== deptId));
                                            }}
                                        />
                                    )}
                                    {deptTab === 'hierarchy' && (
                                        <DepartmentHierarchy
                                            hierarchy={departments.map(dept => ({
                                                ...dept,
                                                children: [],
                                                level: 0,
                                            }))}
                                            onSelect={() => { }}
                                        />
                                    )}
                                    {deptTab === 'heads' && (
                                        <DepartmentHeadAssignment
                                            departments={departments}
                                            departmentHeads={departmentHeads}
                                            employees={employees.map(emp => ({ id: emp.id, name: emp.name, departmentId: emp.departmentId }))}
                                            onAssign={(deptId, empId) => {
                                                setDepartmentHeads([
                                                    ...departmentHeads.filter(h => h.departmentId !== deptId),
                                                    {
                                                        departmentId: deptId,
                                                        employeeId: empId,
                                                        assignedAt: new Date().toISOString(),
                                                        assignedBy: 'current-user',
                                                    }
                                                ]);
                                            }}
                                            onRemove={(deptId) => {
                                                setDepartmentHeads(departmentHeads.filter(h => h.departmentId !== deptId));
                                            }}
                                        />
                                    )}
                                    {deptTab === 'approvals' && (
                                        <ApprovalMapping
                                            departments={departments}
                                            approvalMappings={approvalMappings}
                                            roles={roles.map(r => ({ id: r.id, name: r.name }))}
                                            onAdd={(mapping) => {
                                                setApprovalMappings([
                                                    ...approvalMappings,
                                                    {
                                                        ...mapping,
                                                        createdAt: new Date().toISOString(),
                                                    }
                                                ]);
                                            }}
                                            onRemove={(deptId, roleId, approvalType) => {
                                                setApprovalMappings(
                                                    approvalMappings.filter(
                                                        m => !(m.departmentId === deptId && m.roleId === roleId && m.approvalType === approvalType)
                                                    )
                                                );
                                            }}
                                        />
                                    )}
                                </div>
                            ) : (
                                // Other sub-modules
                                (() => {
                                    if (activeSubModule === 'employees') {
                                        return (
                                            <EmployeeMaster
                                                employees={employees}
                                                departments={departments}
                                                roles={roles}
                                                setEmployees={setEmployees}
                                            />
                                        );
                                    } else if (activeSubModule === 'access') {
                                        return (
                                            <RoleAuthorityView
                                                employees={employees}
                                                departments={departments}
                                                roles={roles}
                                                roleAssignments={roleAssignments}
                                                roleDepartmentMappings={roleDepartmentMappings}
                                                rolePermissions={rolePermissions}
                                                approvalAuthorities={approvalAuthorities}
                                                setRoles={setRoles}
                                                setRoleAssignments={setRoleAssignments}
                                                setRoleDepartmentMappings={setRoleDepartmentMappings}
                                                setRolePermissions={setRolePermissions}
                                                setApprovalAuthorities={setApprovalAuthorities}
                                            />
                                        );
                                    } else {
                                        // Other sub-modules that don't need props
                                        const module = subModules.find(m => m.id === activeSubModule);
                                        if (module?.component && activeSubModule !== 'employees' && activeSubModule !== 'access') {
                                            const Component = module.component as React.ComponentType;
                                            return <Component />;
                                        }
                                        return null;
                                    }
                                })()
                            )}
                        </div>
                    ) : (
                        /* Premium Card Grid View */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {subModules.map((module) => (
                                <button
                                    key={module.id}
                                    onClick={() => setActiveSubModule(module.id)}
                                    className="group relative p-6 rounded-[24px] bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] transition-all duration-500 hover:shadow-[0_8px_48px_0_rgba(31,38,135,0.1)] hover:bg-white/60 hover:border-neutral-200/50 hover:-translate-y-1 text-left flex flex-col h-full"
                                >
                                    <div className="mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-industrial-gray/5 flex items-center justify-center text-slate-900 group-hover:bg-industrial-gray group-hover:text-white transition-all duration-500">
                                            <ChevronRight size={20} className="transition-transform duration-500 group-hover:rotate-[-45deg]" />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 mb-2 tracking-tight group-hover:text-cane-green transition-colors">{module.label}</h3>
                                    <p className="text-sm text-slate-600 font-medium leading-relaxed flex-1">{module.description}</p>
                                    <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                                        <span>Open module</span>
                                        <ChevronRight size={12} strokeWidth={3} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
