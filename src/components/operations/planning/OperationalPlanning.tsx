/**
 * Operational Planning & Control
 * 
 * Daily/weekly/monthly planning with activity scheduling and resource allocation
 */

'use client';

import React, { useState } from 'react';
import { Calendar, Clock, Users, Activity, Plus, Filter } from 'lucide-react';
import { ScheduledActivity, Resource } from '@/types/operations';
import { mockActivities, mockResources } from '@/data/mockOperationsData';
import ChartContainer from '@/components/shared/charts/ChartContainer';
import TimelineChart from '@/components/shared/charts/TimelineChart';
import NetworkGraph from '@/components/shared/charts/NetworkGraph';
import { Node, Edge } from '@xyflow/react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function OperationalPlanning() {
    const [activities, setActivities] = useState<ScheduledActivity[]>(mockActivities);
    const [resources, setResources] = useState<Resource[]>(mockResources);
    const [viewMode, setViewMode] = useState<'timeline' | 'calendar' | 'network'>('timeline');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // Prepare timeline data for chart
    const timelineData = activities.map((act) => {
        const start = new Date(act.startTime);
        const end = new Date(act.endTime);
        const startMinutes = start.getHours() * 60 + start.getMinutes();
        const duration = (end.getTime() - start.getTime()) / (1000 * 60);
        return {
            id: act.id,
            name: act.title,
            start: startMinutes,
            duration,
            status: act.status,
        };
    });

    // Prepare network graph data
    const networkNodes: Node[] = activities.map((act, index) => ({
        id: act.id,
        type: 'default',
        position: { x: index * 200, y: index % 2 === 0 ? 0 : 150 },
        data: { label: act.title },
        style: {
            background: act.status === 'completed' ? '#10b981' : act.status === 'in-progress' ? '#3b82f6' : '#8b5cf6',
            color: 'white',
            border: '2px solid #1e293b',
            borderRadius: '8px',
            padding: '10px',
            fontWeight: 'bold',
        },
    }));

    const networkEdges: Edge[] = activities
        .flatMap((act) =>
            act.dependencies.map((depId) => ({
                id: `edge-${depId}-${act.id}`,
                source: depId,
                target: act.id,
                type: 'smoothstep',
                animated: true,
            }))
        )
        .filter((edge) => activities.some((a) => a.id === edge.source));

    // Resource utilization data
    const resourceUtilization = resources.map((res) => ({
        name: res.name,
        available: res.availability === 'available' ? 1 : 0,
        busy: res.availability === 'busy' ? 1 : 0,
        unavailable: res.availability === 'unavailable' ? 1 : 0,
    }));

    const statusDistribution = activities.reduce(
        (acc, act) => {
            acc[act.status] = (acc[act.status] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );

    const statusData = Object.entries(statusDistribution).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
    }));

    const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#ef4444'];

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Operational Planning & Control</h2>
                    <p className="text-sm text-slate-600 font-medium mt-1">Schedule activities and allocate resources</p>
                </div>
                <button className="px-4 py-2 bg-industrial-gray text-white rounded-lg hover:bg-industrial-gray/90 transition-colors flex items-center gap-2">
                    <Plus size={18} />
                    <span className="font-medium">New Activity</span>
                </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg w-fit">
                <button
                    onClick={() => setViewMode('timeline')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        viewMode === 'timeline' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    Timeline
                </button>
                <button
                    onClick={() => setViewMode('calendar')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        viewMode === 'calendar' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    Calendar
                </button>
                <button
                    onClick={() => setViewMode('network')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        viewMode === 'network' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    Network
                </button>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Visualization */}
                <div className="lg:col-span-2 space-y-6">
                    {viewMode === 'timeline' && (
                        <ChartContainer title="Activity Timeline">
                            <TimelineChart data={timelineData} />
                        </ChartContainer>
                    )}

                    {viewMode === 'network' && (
                        <ChartContainer title="Activity Dependencies">
                            <NetworkGraph nodes={networkNodes} edges={networkEdges} />
                        </ChartContainer>
                    )}

                    {viewMode === 'calendar' && (
                        <ChartContainer title="Calendar View">
                            <div className="p-6">
                                <div className="grid grid-cols-7 gap-2 mb-4">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                        <div key={day} className="text-center text-xs font-black text-slate-400 uppercase tracking-wider">
                                            {day}
                                        </div>
                                    ))}
                                </div>
                                <div className="text-center py-12 text-slate-400 text-sm">
                                    Calendar view coming soon
                                </div>
                            </div>
                        </ChartContainer>
                    )}

                    {/* Activities List */}
                    <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                        <h3 className="text-sm font-black text-slate-900 mb-4 tracking-tight">Scheduled Activities</h3>
                        <div className="space-y-3">
                            {activities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="p-4 bg-white/60 rounded-lg border border-slate-200/50 hover:border-slate-300/50 transition-all"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="font-black text-slate-900">{activity.title}</h4>
                                                <span
                                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                        activity.status === 'completed'
                                                            ? 'bg-green-100 text-green-700'
                                                            : activity.status === 'in-progress'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : 'bg-purple-100 text-purple-700'
                                                    }`}
                                                >
                                                    {activity.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-slate-600">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {new Date(activity.startTime).toLocaleTimeString('en-US', {
                                                        hour: 'numeric',
                                                        minute: '2-digit',
                                                    })}{' '}
                                                    -{' '}
                                                    {new Date(activity.endTime).toLocaleTimeString('en-US', {
                                                        hour: 'numeric',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Activity size={12} />
                                                    {activity.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Stats and Resources */}
                <div className="space-y-6">
                    {/* Status Distribution */}
                    <ChartContainer title="Status Distribution">
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                    outerRadius={60}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>

                    {/* Resource Utilization */}
                    <ChartContainer title="Resource Utilization">
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={resourceUtilization}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '10px' }} angle={-45} textAnchor="end" height={80} />
                                <YAxis stroke="#64748b" style={{ fontSize: '10px' }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="available" stackId="a" fill="#10b981" />
                                <Bar dataKey="busy" stackId="a" fill="#3b82f6" />
                                <Bar dataKey="unavailable" stackId="a" fill="#ef4444" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>

                    {/* Resources List */}
                    <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                        <h3 className="text-sm font-black text-slate-900 mb-4 tracking-tight">Resources</h3>
                        <div className="space-y-2">
                            {resources.map((resource) => (
                                <div
                                    key={resource.id}
                                    className="p-3 bg-white/60 rounded-lg border border-slate-200/50 flex items-center justify-between"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{resource.name}</p>
                                        <p className="text-xs text-slate-500">{resource.type}</p>
                                    </div>
                                    <span
                                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                            resource.availability === 'available'
                                                ? 'bg-green-100 text-green-700'
                                                : resource.availability === 'busy'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}
                                    >
                                        {resource.availability}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
