/**
 * Facilities Management
 * 
 * Facility maintenance scheduling, usage tracking, and issue management
 */

'use client';

import React, { useState } from 'react';
import { Building2, Wrench, AlertCircle, Calendar, TrendingUp, Plus } from 'lucide-react';
import { Facility, MaintenanceRecord, FacilityIssue } from '@/types/operations';
import { mockFacilities, mockMaintenanceRecords, mockFacilityIssues } from '@/data/mockOperationsData';
import ChartContainer from '@/components/shared/charts/ChartContainer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export default function FacilitiesManagement() {
    const [facilities, setFacilities] = useState<Facility[]>(mockFacilities);
    const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(mockMaintenanceRecords);
    const [issues, setIssues] = useState<FacilityIssue[]>(mockFacilityIssues);
    const [viewMode, setViewMode] = useState<'facilities' | 'maintenance' | 'issues'>('facilities');

    // Usage metrics (mock data)
    const usageData = facilities.map((fac) => ({
        name: fac.name,
        usage: Math.floor(Math.random() * 100),
        capacity: fac.capacity || 0,
    }));

    // Maintenance cost trends (mock data)
    const costData = [
        { month: 'Jan', cost: 15000 },
        { month: 'Feb', cost: 18000 },
        { month: 'Mar', cost: 12000 },
        { month: 'Apr', cost: 20000 },
        { month: 'May', cost: 16000 },
        { month: 'Jun', cost: 22000 },
    ];

    // Issue status distribution
    const issueStatusData = issues.reduce(
        (acc, issue) => {
            acc[issue.status] = (acc[issue.status] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );

    const statusChartData = Object.entries(issueStatusData).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' '),
        value,
    }));

    const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#6b7280'];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'operational':
                return 'bg-green-100 text-green-700';
            case 'maintenance':
                return 'bg-yellow-100 text-yellow-700';
            case 'closed':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-slate-100 text-slate-700';
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical':
                return 'bg-red-100 text-red-700';
            case 'high':
                return 'bg-orange-100 text-orange-700';
            case 'medium':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-blue-100 text-blue-700';
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Facilities Management</h2>
                    <p className="text-sm text-slate-600 font-medium mt-1">Manage facilities and maintenance</p>
                </div>
                <button className="px-4 py-2 bg-industrial-gray text-white rounded-lg hover:bg-industrial-gray/90 transition-colors flex items-center gap-2">
                    <Plus size={18} />
                    <span className="font-medium">New Facility</span>
                </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg w-fit">
                <button
                    onClick={() => setViewMode('facilities')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        viewMode === 'facilities' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    Facilities
                </button>
                <button
                    onClick={() => setViewMode('maintenance')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        viewMode === 'maintenance' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    Maintenance
                </button>
                <button
                    onClick={() => setViewMode('issues')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        viewMode === 'issues' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    Issues
                </button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Area */}
                <div className="lg:col-span-2 space-y-6">
                    {viewMode === 'facilities' && (
                        <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                            <h3 className="text-sm font-black text-slate-900 mb-4 tracking-tight">Facilities</h3>
                            <div className="space-y-3">
                                {facilities.map((facility) => (
                                    <div
                                        key={facility.id}
                                        className="p-4 bg-white/60 rounded-lg border border-slate-200/50 hover:border-slate-300/50 transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Building2 size={18} className="text-slate-400" />
                                                <h4 className="font-black text-slate-900">{facility.name}</h4>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusColor(facility.status)}`}>
                                                {facility.status}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-slate-500 text-xs mb-1">Type</p>
                                                <p className="font-medium text-slate-700">{facility.type}</p>
                                            </div>
                                            {facility.capacity && (
                                                <div>
                                                    <p className="text-slate-500 text-xs mb-1">Capacity</p>
                                                    <p className="font-medium text-slate-700">{facility.capacity} people</p>
                                                </div>
                                            )}
                                            <div className="col-span-2">
                                                <p className="text-slate-500 text-xs mb-1">Location</p>
                                                <p className="font-medium text-slate-700">{facility.location}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {viewMode === 'maintenance' && (
                        <>
                            <ChartContainer title="Maintenance Cost Trends">
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={costData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
                                        <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="cost" stroke="#8b5cf6" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartContainer>

                            <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                                <h3 className="text-sm font-black text-slate-900 mb-4 tracking-tight">Maintenance Records</h3>
                                <div className="space-y-3">
                                    {maintenanceRecords.map((record) => (
                                        <div
                                            key={record.id}
                                            className="p-4 bg-white/60 rounded-lg border border-slate-200/50 hover:border-slate-300/50 transition-all"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h4 className="font-black text-slate-900">{record.facilityName}</h4>
                                                    <p className="text-xs text-slate-500 mt-1">{record.description}</p>
                                                </div>
                                                <span
                                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                        record.status === 'completed'
                                                            ? 'bg-green-100 text-green-700'
                                                            : record.status === 'in-progress'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : 'bg-purple-100 text-purple-700'
                                                    }`}
                                                >
                                                    {record.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-slate-600">
                                                <span>
                                                    Scheduled: {new Date(record.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                                {record.cost && <span>Cost: ₹{record.cost.toLocaleString()}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {viewMode === 'issues' && (
                        <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                            <h3 className="text-sm font-black text-slate-900 mb-4 tracking-tight">Facility Issues</h3>
                            <div className="space-y-3">
                                {issues.map((issue) => (
                                    <div
                                        key={issue.id}
                                        className="p-4 bg-white/60 rounded-lg border border-slate-200/50 hover:border-slate-300/50 transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <AlertCircle size={18} className="text-red-500" />
                                                <h4 className="font-black text-slate-900">{issue.facilityName}</h4>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getSeverityColor(issue.severity)}`}>
                                                    {issue.severity}
                                                </span>
                                                <span
                                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                        issue.status === 'resolved'
                                                            ? 'bg-green-100 text-green-700'
                                                            : issue.status === 'in-progress'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                    }`}
                                                >
                                                    {issue.status}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-2">{issue.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-slate-500">
                                            <span>Reported by: {issue.reportedBy}</span>
                                            <span>
                                                {new Date(issue.reportedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Usage Metrics */}
                    <ChartContainer title="Usage Metrics">
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={usageData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '10px' }} angle={-45} textAnchor="end" height={80} />
                                <YAxis stroke="#64748b" style={{ fontSize: '10px' }} />
                                <Tooltip />
                                <Bar dataKey="usage" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>

                    {/* Issue Status */}
                    {statusChartData.length > 0 && (
                        <ChartContainer title="Issue Status">
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={statusChartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                        outerRadius={60}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {statusChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    )}

                    {/* Quick Stats */}
                    <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                        <h3 className="text-sm font-black text-slate-900 mb-4 tracking-tight">Quick Stats</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Total Facilities</span>
                                <span className="text-lg font-black text-slate-900">{facilities.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Open Issues</span>
                                <span className="text-lg font-black text-red-600">{issues.filter((i) => i.status === 'open').length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Scheduled Maintenance</span>
                                <span className="text-lg font-black text-blue-600">
                                    {maintenanceRecords.filter((m) => m.status === 'scheduled').length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
