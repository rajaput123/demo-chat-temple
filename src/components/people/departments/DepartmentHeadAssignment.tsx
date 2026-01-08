import React, { useState } from 'react';
import { User, Search } from 'lucide-react';
import { Department, DepartmentHead } from '@/types/department';

interface DepartmentHeadAssignmentProps {
    departments: Department[];
    departmentHeads: DepartmentHead[];
    employees: Array<{ id: string; name: string; departmentId: string }>;
    onAssign: (departmentId: string, employeeId: string) => void;
    onRemove: (departmentId: string) => void;
}

export default function DepartmentHeadAssignment({
    departments,
    departmentHeads,
    employees,
    onAssign,
    onRemove
}: DepartmentHeadAssignmentProps) {
    const [selectedDept, setSelectedDept] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

    const getHeadForDepartment = (deptId: string) => {
        return departmentHeads.find(h => h.departmentId === deptId);
    };

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900">Department Head Assignment</h3>

            <div className="space-y-3">
                {departments.map((dept) => {
                    const head = getHeadForDepartment(dept.id);
                    const headEmployee = head ? employees.find(e => e.id === head.employeeId) : null;

                    return (
                        <div
                            key={dept.id}
                            className="p-3 rounded-lg border border-neutral-200"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <div className="text-sm font-medium text-neutral-900">{dept.name}</div>
                                    <div className="text-xs text-neutral-500">{dept.code}</div>
                                </div>
                                {headEmployee ? (
                                    <button
                                        onClick={() => onRemove(dept.id)}
                                        className="text-xs text-red-600 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setSelectedDept(selectedDept === dept.id ? '' : dept.id)}
                                        className="text-xs text-cane-green hover:text-cane-green/80"
                                    >
                                        Assign
                                    </button>
                                )}
                            </div>

                            {headEmployee && (
                                <div className="flex items-center gap-2 mt-2 p-2 bg-neutral-50 rounded">
                                    <User size={14} className="text-neutral-400" />
                                    <span className="text-sm text-neutral-900">{headEmployee.name}</span>
                                </div>
                            )}

                            {selectedDept === dept.id && (
                                <div className="mt-3 p-3 bg-neutral-50 rounded-lg">
                                    <div className="relative mb-2">
                                        <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400" />
                                        <input
                                            type="text"
                                            placeholder="Search employees..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-8 pr-3 py-1.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                                        />
                                    </div>
                                    <div className="space-y-1 max-h-40 overflow-y-auto">
                                        {filteredEmployees.map((emp) => (
                                            <button
                                                key={emp.id}
                                                onClick={() => {
                                                    onAssign(dept.id, emp.id);
                                                    setSelectedDept('');
                                                    setSearchTerm('');
                                                }}
                                                className="w-full text-left p-2 hover:bg-neutral-100 rounded text-sm text-neutral-900"
                                            >
                                                {emp.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

