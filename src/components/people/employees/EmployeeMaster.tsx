import React, { useState } from 'react';
import { User, Plus, Mail, Lock, Building2, Shield } from 'lucide-react';
import Modal from '@/components/shared/Modal';
import { Employee } from '@/types/employee';
import { Department } from '@/types/department';
import { Role, RoleAssignmentType } from '@/types/role';
import { EmployeeService } from '@/services/employeeService';
import { RoleService } from '@/services/roleService';

interface EmployeeMasterProps {
    employees: Employee[];
    departments: Department[];
    roles: Role[];
    setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
}

export default function EmployeeMaster({ employees, departments, roles, setEmployees }: EmployeeMasterProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        departmentId: '',
        employeeId: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        isActive: true,
        // Optional role assignment
        assignRole: false,
        roleId: '',
        assignmentType: 'primary' as RoleAssignmentType,
        roleStartDate: new Date().toISOString().split('T')[0],
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain uppercase, lowercase, and number';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.departmentId) {
            newErrors.departmentId = 'Department is required';
        }

        if (formData.assignRole && !formData.roleId) {
            newErrors.roleId = 'Role is required when assigning role';
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
            // Create employee
            const employee = await EmployeeService.createEmployee(
                {
                    name: formData.name,
                    email: formData.email,
                    departmentId: formData.departmentId,
                    employeeId: formData.employeeId || undefined,
                    phone: formData.phone || undefined,
                    address: formData.address || undefined,
                    dateOfBirth: formData.dateOfBirth || undefined,
                    isActive: formData.isActive,
                },
                formData.password,
                'current-user', // In production, get from auth context
                formData.assignRole ? {
                    employeeId: '', // Will be set after employee creation
                    departmentId: formData.departmentId,
                    roleId: formData.roleId,
                    assignmentType: formData.assignmentType,
                    startDate: formData.roleStartDate,
                } : undefined
            );

            // If role assignment was requested, assign it
            if (formData.assignRole && formData.roleId) {
                await RoleService.assignRoleToEmployee(
                    {
                        employeeId: employee.id,
                        departmentId: formData.departmentId,
                        roleId: formData.roleId,
                        assignmentType: formData.assignmentType,
                        startDate: formData.roleStartDate,
                    },
                    'current-user'
                );
            }

            setEmployees(prev => [...prev, employee]);
            setIsModalOpen(false);
            resetForm();
        } catch (error: any) {
            setErrors({ submit: error.message || 'Failed to create employee' });
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            departmentId: '',
            employeeId: '',
            phone: '',
            address: '',
            dateOfBirth: '',
            isActive: true,
            assignRole: false,
            roleId: '',
            assignmentType: 'primary',
            roleStartDate: new Date().toISOString().split('T')[0],
        });
        setErrors({});
    };

    // Filter roles by selected department
    const availableRoles = roles.filter(role => {
        // In production, check RoleDepartmentMapping
        return role.isActive;
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-black text-neutral-900">Employee Master</h3>
                    <p className="text-sm text-neutral-500 mt-1">Create employees with email, password, and department assignment</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-industrial-gray text-white rounded-lg text-sm font-medium hover:bg-industrial-gray/90 transition-all"
                >
                    <Plus size={18} />
                    <span>Add Employee</span>
                </button>
            </div>

            {employees.length === 0 ? (
                <div className="text-center py-12 border border-neutral-200 rounded-xl bg-neutral-50">
                    <User className="mx-auto text-neutral-400 mb-3" size={32} />
                    <p className="text-sm text-neutral-500">No employees found. Create your first employee.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {employees.map((employee) => (
                        <div
                            key={employee.id}
                            className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-industrial-gray/10 flex items-center justify-center">
                                    <User size={18} className="text-industrial-gray" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-neutral-900">{employee.name}</div>
                                    <div className="text-xs text-neutral-500">{employee.email}</div>
                                </div>
                            </div>
                            <div className="text-xs text-neutral-500">
                                {departments.find(d => d.id === employee.departmentId)?.name || 'No Department'}
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
                title="Create Employee"
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {errors.submit && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800">{errors.submit}</p>
                        </div>
                    )}

                    {/* Required Fields Section */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-black text-neutral-900 uppercase tracking-wider">Required Information</h4>
                        
                        <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-1">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green ${errors.name ? 'border-red-300' : 'border-neutral-200'}`}
                            />
                            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-1">
                                <Mail size={14} className="inline mr-1" />
                                Email *
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green ${errors.email ? 'border-red-300' : 'border-neutral-200'}`}
                            />
                            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-900 mb-1">
                                    <Lock size={14} className="inline mr-1" />
                                    Password *
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green ${errors.password ? 'border-red-300' : 'border-neutral-200'}`}
                                />
                                {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-900 mb-1">
                                    Confirm Password *
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green ${errors.confirmPassword ? 'border-red-300' : 'border-neutral-200'}`}
                                />
                                {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-1">
                                <Building2 size={14} className="inline mr-1" />
                                Department *
                            </label>
                            <select
                                required
                                value={formData.departmentId}
                                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value, roleId: '' })}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green ${errors.departmentId ? 'border-red-300' : 'border-neutral-200'}`}
                            >
                                <option value="">Select Department</option>
                                {departments.filter(d => d.isActive).map((dept) => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                            {errors.departmentId && <p className="text-xs text-red-600 mt-1">{errors.departmentId}</p>}
                        </div>
                    </div>

                    {/* Optional Fields Section */}
                    <div className="space-y-4 pt-4 border-t border-neutral-200">
                        <h4 className="text-sm font-black text-neutral-900 uppercase tracking-wider">Optional Information</h4>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-900 mb-1">
                                    Employee ID
                                </label>
                                <input
                                    type="text"
                                    value={formData.employeeId}
                                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-900 mb-1">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-1">
                                Address
                            </label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                rows={2}
                                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-1">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                            />
                        </div>
                    </div>

                    {/* Optional Role Assignment Section */}
                    <div className="space-y-4 pt-4 border-t border-neutral-200">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.assignRole}
                                onChange={(e) => setFormData({ ...formData, assignRole: e.target.checked, roleId: e.target.checked ? formData.roleId : '' })}
                                className="rounded"
                            />
                            <label className="text-sm font-medium text-neutral-900 flex items-center gap-2">
                                <Shield size={14} />
                                Assign Role (Optional)
                            </label>
                        </div>

                        {formData.assignRole && (
                            <div className="space-y-4 pl-6 border-l-2 border-cane-green/20 bg-soft-white/30 p-4 rounded-lg">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-900 mb-1">
                                        Role *
                                    </label>
                                    <select
                                        required={formData.assignRole}
                                        value={formData.roleId}
                                        onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green ${errors.roleId ? 'border-red-300' : 'border-neutral-200'}`}
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
                                            onChange={(e) => setFormData({ ...formData, assignmentType: e.target.value as RoleAssignmentType })}
                                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                                        >
                                            <option value="primary">Primary</option>
                                            <option value="secondary">Secondary</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.roleStartDate}
                                            onChange={(e) => setFormData({ ...formData, roleStartDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                                        />
                                    </div>
                                </div>

                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-xs text-blue-800 font-medium">
                                        Role will be assigned to the employee after creation. Only one primary role per department is allowed.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-industrial-gray text-white rounded-lg text-sm font-medium hover:bg-industrial-gray/90 transition-all"
                        >
                            Create Employee
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

