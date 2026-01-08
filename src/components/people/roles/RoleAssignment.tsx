import React, { useState } from 'react';
import { User, Building2, Shield, Plus, Calendar } from 'lucide-react';
import Modal from '@/components/shared/Modal';
import { RoleAssignment as RoleAssignmentType, RoleAssignmentType as RoleAssignmentTypeEnum } from '@/types/role';
import { Employee } from '@/types/employee';
import { Department } from '@/types/department';
import { Role } from '@/types/role';
import { RoleService } from '@/services/roleService';

interface RoleAssignmentProps {
    employees: Employee[];
    departments: Department[];
    roles: Role[];
    assignments: RoleAssignmentType[];
    setAssignments: React.Dispatch<React.SetStateAction<RoleAssignmentType[]>>;
}

export default function RoleAssignment({ employees, departments, roles, assignments, setAssignments }: RoleAssignmentProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        employeeId: '',
        departmentId: '',
        roleId: '',
            assignmentType: 'primary' as RoleAssignmentTypeEnum,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.employeeId) {
            newErrors.employeeId = 'Employee is required';
        }

        if (!formData.departmentId) {
            newErrors.departmentId = 'Department is required';
        }

        if (!formData.roleId) {
            newErrors.roleId = 'Role is required';
        }

        if (formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
            newErrors.endDate = 'End date must be after start date';
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
            const assignment = await RoleService.assignRoleToEmployee(
                formData,
                'current-user'
            );
            setAssignments(prev => [...prev, assignment]);
            setIsModalOpen(false);
            resetForm();
        } catch (error: any) {
            setErrors({ submit: error.message || 'Failed to assign role' });
        }
    };

    const resetForm = () => {
        setFormData({
            employeeId: '',
            departmentId: '',
            roleId: '',
            assignmentType: 'primary',
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
        });
        setErrors({});
    };

    // Filter employees by selected department
    const availableEmployees = formData.departmentId
        ? employees.filter(e => e.departmentId === formData.departmentId && e.isActive)
        : [];

    // Filter roles by selected department (in production, check RoleDepartmentMapping)
    const availableRoles = formData.departmentId
        ? roles.filter(r => r.isActive)
        : [];

    // Check if employee already has primary role for this department
    const hasPrimaryRole = formData.employeeId && formData.departmentId
        ? assignments.some(
            a => a.employeeId === formData.employeeId 
                && a.departmentId === formData.departmentId 
                && a.assignmentType === 'primary' 
                && a.isActive
          )
        : false;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-black text-neutral-900">Role Assignment</h3>
                    <p className="text-sm text-neutral-500 mt-1">Assign roles to employees. Only one primary role per department.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-industrial-gray text-white rounded-lg text-sm font-medium hover:bg-industrial-gray/90 transition-all"
                >
                    <Plus size={18} />
                    <span>Assign Role</span>
                </button>
            </div>

            {assignments.length === 0 ? (
                <div className="text-center py-12 border border-neutral-200 rounded-xl bg-neutral-50">
                    <Shield className="mx-auto text-neutral-400 mb-3" size={32} />
                    <p className="text-sm text-neutral-500">No role assignments found</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {assignments.map((assignment) => {
                        const employee = employees.find(e => e.id === assignment.employeeId);
                        const department = departments.find(d => d.id === assignment.departmentId);
                        const role = roles.find(r => r.id === assignment.roleId);
                        
                        return (
                            <div
                                key={assignment.id}
                                className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        assignment.assignmentType === 'primary' ? 'bg-industrial-gray/10' : 'bg-neutral-100'
                                    }`}>
                                        <Shield size={18} className={assignment.assignmentType === 'primary' ? 'text-industrial-gray' : 'text-neutral-600'} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-neutral-900">
                                                {employee?.name || 'Unknown Employee'}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                                assignment.assignmentType === 'primary'
                                                    ? 'bg-industrial-gray text-white'
                                                    : 'bg-neutral-100 text-neutral-600'
                                            }`}>
                                                {assignment.assignmentType === 'primary' ? 'Primary' : 'Secondary'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                                            <span>{role?.name || 'Unknown Role'}</span>
                                            <span>•</span>
                                            <span>{department?.name || 'Unknown Department'}</span>
                                            <span>•</span>
                                            <span>{new Date(assignment.startDate).toLocaleDateString()}</span>
                                            {assignment.endDate && (
                                                <>
                                                    <span>-</span>
                                                    <span>{new Date(assignment.endDate).toLocaleDateString()}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={`text-xs px-2 py-1 rounded ${
                                    assignment.isActive ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'
                                }`}>
                                    {assignment.isActive ? 'Active' : 'Inactive'}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    resetForm();
                }}
                title="Assign Role to Employee"
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
                            <Building2 size={14} className="inline mr-1" />
                            Department *
                        </label>
                        <select
                            required
                            value={formData.departmentId}
                            onChange={(e) => setFormData({ ...formData, departmentId: e.target.value, employeeId: '', roleId: '' })}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green ${errors.departmentId ? 'border-red-300' : 'border-neutral-200'}`}
                        >
                            <option value="">Select Department</option>
                            {departments.filter(d => d.isActive).map((dept) => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>
                        {errors.departmentId && <p className="text-xs text-red-600 mt-1">{errors.departmentId}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                            <User size={14} className="inline mr-1" />
                            Employee *
                        </label>
                        <select
                            required
                            value={formData.employeeId}
                            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green ${errors.employeeId ? 'border-red-300' : 'border-neutral-200'}`}
                            disabled={!formData.departmentId}
                        >
                            <option value="">Select Employee</option>
                            {availableEmployees.map((emp) => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                            ))}
                        </select>
                        {errors.employeeId && <p className="text-xs text-red-600 mt-1">{errors.employeeId}</p>}
                        {!formData.departmentId && (
                            <p className="text-xs text-neutral-500 mt-1">Select department first</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                            <Shield size={14} className="inline mr-1" />
                            Role *
                        </label>
                        <select
                            required
                            value={formData.roleId}
                            onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green ${errors.roleId ? 'border-red-300' : 'border-neutral-200'}`}
                            disabled={!formData.departmentId}
                        >
                            <option value="">Select Role</option>
                            {availableRoles.map((role) => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                        {errors.roleId && <p className="text-xs text-red-600 mt-1">{errors.roleId}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-1">
                                Assignment Type
                            </label>
                            <select
                                value={formData.assignmentType}
                                            onChange={(e) => setFormData({ ...formData, assignmentType: e.target.value as RoleAssignmentTypeEnum })}
                                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                                disabled={hasPrimaryRole}
                            >
                                <option value="primary">Primary</option>
                                <option value="secondary">Secondary</option>
                            </select>
                            {hasPrimaryRole && formData.assignmentType === 'primary' && (
                                <p className="text-xs text-red-600 mt-1">Employee already has a primary role for this department</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-1">
                                <Calendar size={14} className="inline mr-1" />
                                Start Date *
                            </label>
                            <input
                                type="date"
                                required
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                            End Date (Optional)
                        </label>
                        <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green ${errors.endDate ? 'border-red-300' : 'border-neutral-200'}`}
                            min={formData.startDate}
                        />
                        {errors.endDate && <p className="text-xs text-red-600 mt-1">{errors.endDate}</p>}
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-800 font-medium">
                            <strong>Note:</strong> Employee must have department assignment (enforced at employee creation). 
                            Only one primary role per department per employee is allowed.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-industrial-gray text-white rounded-lg text-sm font-medium hover:bg-industrial-gray/90 transition-all"
                        >
                            Assign Role
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

