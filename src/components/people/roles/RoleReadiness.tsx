import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { EmployeeReadiness, Role, RoleAssignment } from '@/types/role';
import { Employee } from '@/types/employee';
import { Department } from '@/types/department';
import { RoleService } from '@/services/roleService';

interface RoleReadinessProps {
    employees: Employee[];
    departments: Department[];
    roles: Role[];
    assignments: RoleAssignment[];
}

export default function RoleReadiness({ employees, departments, roles, assignments }: RoleReadinessProps) {
    const [readinessData, setReadinessData] = useState<Map<string, EmployeeReadiness>>(new Map([
        ['emp-001', {
            employeeId: 'emp-001',
            departmentId: 'dept-001',
            isReady: true,
            readinessReasons: ['Employee is active', 'Department is active', 'Valid role assignment exists'],
            lastCheckedAt: '2024-01-15T10:00:00Z',
            checkedBy: 'system',
        }],
        ['emp-002', {
            employeeId: 'emp-002',
            departmentId: 'dept-002',
            isReady: true,
            readinessReasons: ['Employee is active', 'Department is active', 'Valid role assignment exists'],
            lastCheckedAt: '2024-01-20T10:00:00Z',
            checkedBy: 'system',
        }],
        ['emp-003', {
            employeeId: 'emp-003',
            departmentId: 'dept-001',
            isReady: false,
            readinessReasons: ['No active role assignment'],
            lastCheckedAt: '2024-01-25T10:00:00Z',
            checkedBy: 'system',
        }],
    ]));
    const [loading, setLoading] = useState(false);

    const checkAllReadiness = async () => {
        setLoading(true);
        const newReadiness = new Map<string, EmployeeReadiness>();

        for (const employee of employees.filter(e => e.isActive)) {
            if (employee.departmentId) {
                const readiness = await RoleService.checkEmployeeReadiness(
                    employee.id,
                    employee.departmentId,
                    'current-user'
                );
                newReadiness.set(employee.id, readiness);
            }
        }

        setReadinessData(newReadiness);
        setLoading(false);
    };

    // Initialize with mock data - in production, this would call checkAllReadiness()
    // useEffect(() => {
    //     checkAllReadiness();
    // }, [employees.length]);

    const getReadinessStatus = (employeeId: string): EmployeeReadiness | null => {
        return readinessData.get(employeeId) || null;
    };

    const readyCount = Array.from(readinessData.values()).filter(r => r.isReady).length;
    const notReadyCount = Array.from(readinessData.values()).filter(r => !r.isReady).length;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-black text-neutral-900">Role Readiness</h3>
                    <p className="text-sm text-neutral-500 mt-1">Check if employees are operation-ready based on roles</p>
                </div>
                <button
                    onClick={checkAllReadiness}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-industrial-gray text-white rounded-lg text-sm font-medium hover:bg-industrial-gray/90 transition-all disabled:opacity-50"
                >
                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    <span>Refresh Status</span>
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-neutral-200 bg-white">
                    <div className="text-2xl font-black text-neutral-900">{employees.filter(e => e.isActive).length}</div>
                    <div className="text-xs text-neutral-500 mt-1">Total Employees</div>
                </div>
                <div className="p-4 rounded-lg border border-green-200 bg-green-50">
                    <div className="text-2xl font-black text-green-700">{readyCount}</div>
                    <div className="text-xs text-green-600 mt-1">Ready</div>
                </div>
                <div className="p-4 rounded-lg border border-red-200 bg-red-50">
                    <div className="text-2xl font-black text-red-700">{notReadyCount}</div>
                    <div className="text-xs text-red-600 mt-1">Not Ready</div>
                </div>
            </div>

            {/* Readiness Criteria */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-black text-blue-900 mb-2">Readiness Criteria</h4>
                <ul className="space-y-1 text-xs text-blue-800">
                    <li className="flex items-center gap-2">
                        <CheckCircle2 size={12} />
                        <span>Employee status = Active</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <CheckCircle2 size={12} />
                        <span>Department assignment = Active</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <CheckCircle2 size={12} />
                        <span>At least one valid role assigned for that department</span>
                    </li>
                </ul>
            </div>

            {/* Employee Readiness List */}
            <div className="space-y-2">
                {employees.filter(e => e.isActive).map((employee) => {
                    const readiness = getReadinessStatus(employee.id);
                    const department = departments.find(d => d.id === employee.departmentId);

                    return (
                        <div
                            key={employee.id}
                            className={`p-4 rounded-lg border transition-all ${
                                readiness?.isReady
                                    ? 'border-green-200 bg-green-50/30'
                                    : 'border-red-200 bg-red-50/30'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {readiness?.isReady ? (
                                        <CheckCircle2 size={20} className="text-green-600" />
                                    ) : (
                                        <XCircle size={20} className="text-red-600" />
                                    )}
                                    <div>
                                        <div className="text-sm font-medium text-neutral-900">{employee.name}</div>
                                        <div className="text-xs text-neutral-500 mt-1">
                                            {department?.name || 'No Department'} • {employee.email}
                                        </div>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded text-xs font-medium ${
                                    readiness?.isReady
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                }`}>
                                    {readiness?.isReady ? 'Ready' : 'Not Ready'}
                                </div>
                            </div>
                            {readiness && readiness.readinessReasons.length > 0 && (
                                <div className="mt-3 pl-8">
                                    <div className="text-xs font-medium text-neutral-700 mb-1">Status:</div>
                                    <ul className="space-y-1">
                                        {readiness.readinessReasons.map((reason, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-xs text-neutral-600">
                                                {readiness.isReady ? (
                                                    <CheckCircle2 size={10} className="text-green-600" />
                                                ) : (
                                                    <AlertCircle size={10} className="text-red-600" />
                                                )}
                                                <span>{reason}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {employees.filter(e => e.isActive).length === 0 && (
                <div className="text-center py-12 border border-neutral-200 rounded-xl bg-neutral-50">
                    <AlertCircle className="mx-auto text-neutral-400 mb-3" size={32} />
                    <p className="text-sm text-neutral-500">No active employees found</p>
                </div>
            )}
        </div>
    );
}

