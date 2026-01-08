/**
 * Task Management & Workflow Orchestration
 * 
 * Task creation, assignment, tracking with workflow visualization
 */

'use client';

import React, { useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, Plus, Filter, Workflow } from 'lucide-react';
import { Task, Workflow as WorkflowType } from '@/types/operations';
import { mockTasks, mockWorkflows } from '@/data/mockOperationsData';
import ChartContainer from '@/components/shared/charts/ChartContainer';
import NetworkGraph from '@/components/shared/charts/NetworkGraph';
import { Node, Edge } from '@xyflow/react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function TaskOrchestration() {
    const [tasks, setTasks] = useState<Task[]>(mockTasks);
    const [workflows, setWorkflows] = useState<WorkflowType[]>(mockWorkflows);
    const [viewMode, setViewMode] = useState<'list' | 'workflow' | 'timeline'>('list');
    const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowType | null>(null);

    // Task status distribution
    const statusDistribution = tasks.reduce(
        (acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );

    const statusData = Object.entries(statusDistribution).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' '),
        value,
    }));

    // Priority distribution
    const priorityData = tasks.reduce(
        (acc, task) => {
            acc[task.priority] = (acc[task.priority] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );

    const priorityChartData = Object.entries(priorityData).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
    }));

    // Task completion timeline (mock data)
    const timelineData = [
        { date: 'Mon', completed: 2, pending: 5 },
        { date: 'Tue', completed: 4, pending: 3 },
        { date: 'Wed', completed: 3, pending: 4 },
        { date: 'Thu', completed: 5, pending: 2 },
        { date: 'Fri', completed: 3, pending: 3 },
        { date: 'Sat', completed: 2, pending: 1 },
        { date: 'Sun', completed: 1, pending: 2 },
    ];

    // Workflow network graph
    const workflow = workflows[0];
    const workflowNodes: Node[] = workflow
        ? workflow.steps.map((step, index) => ({
              id: step.id,
              type: 'default',
              position: { x: index * 250, y: 0 },
              data: { label: step.name },
              style: {
                  background: '#8b5cf6',
                  color: 'white',
                  border: '2px solid #1e293b',
                  borderRadius: '8px',
                  padding: '15px',
                  fontWeight: 'bold',
                  minWidth: '150px',
              },
          }))
        : [];

    const workflowEdges: Edge[] = workflow
        ? workflow.steps
              .flatMap((step) =>
                  step.dependencies.map((depId) => ({
                      id: `edge-${depId}-${step.id}`,
                      source: depId,
                      target: step.id,
                      type: 'smoothstep',
                      animated: true,
                  }))
              )
              .filter((edge) => workflow.steps.some((s) => s.id === edge.source))
        : [];

    const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#ef4444', '#f59e0b'];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle2 size={16} className="text-green-600" />;
            case 'in-progress':
                return <Clock size={16} className="text-blue-600" />;
            case 'blocked':
                return <AlertCircle size={16} className="text-red-600" />;
            default:
                return <Clock size={16} className="text-slate-400" />;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent':
                return 'bg-red-100 text-red-700';
            case 'high':
                return 'bg-orange-100 text-orange-700';
            case 'medium':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Task Management</h2>
                    <p className="text-sm text-slate-600 font-medium mt-1">Orchestrate tasks and workflows</p>
                </div>
                <button className="px-4 py-2 bg-industrial-gray text-white rounded-lg hover:bg-industrial-gray/90 transition-colors flex items-center gap-2">
                    <Plus size={18} />
                    <span className="font-medium">New Task</span>
                </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg w-fit">
                <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    List
                </button>
                <button
                    onClick={() => setViewMode('workflow')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        viewMode === 'workflow' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    Workflow
                </button>
                <button
                    onClick={() => setViewMode('timeline')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        viewMode === 'timeline' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    Timeline
                </button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Area */}
                <div className="lg:col-span-2 space-y-6">
                    {viewMode === 'list' && (
                        <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-black text-slate-900 tracking-tight">Tasks</h3>
                                <button className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900">
                                    <Filter size={14} />
                                    Filter
                                </button>
                            </div>
                            <div className="space-y-3">
                                {tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="p-4 bg-white/60 rounded-lg border border-slate-200/50 hover:border-slate-300/50 transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2 flex-1">
                                                {getStatusIcon(task.status)}
                                                <h4 className="font-black text-slate-900">{task.title}</h4>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-3">{task.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-slate-500">
                                            {task.assigneeName && (
                                                <span className="flex items-center gap-1">
                                                    <span className="font-medium">Assignee:</span> {task.assigneeName}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <span className="font-medium">Due:</span>{' '}
                                                {new Date(task.dueDate).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {viewMode === 'workflow' && (
                        <ChartContainer title="Workflow Visualization">
                            <NetworkGraph nodes={workflowNodes} edges={workflowEdges} />
                        </ChartContainer>
                    )}

                    {viewMode === 'timeline' && (
                        <ChartContainer title="Task Completion Timeline">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={timelineData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
                                    <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} name="Completed" />
                                    <Line type="monotone" dataKey="pending" stroke="#3b82f6" strokeWidth={2} name="Pending" />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    )}
                </div>

                {/* Sidebar */}
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

                    {/* Priority Distribution */}
                    <ChartContainer title="Priority Distribution">
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={priorityChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '10px' }} />
                                <YAxis stroke="#64748b" style={{ fontSize: '10px' }} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8b5cf6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>

                    {/* Workflows List */}
                    <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                        <h3 className="text-sm font-black text-slate-900 mb-4 tracking-tight">Workflows</h3>
                        <div className="space-y-2">
                            {workflows.map((wf) => (
                                <div
                                    key={wf.id}
                                    className="p-3 bg-white/60 rounded-lg border border-slate-200/50 cursor-pointer hover:border-slate-300/50 transition-all"
                                    onClick={() => {
                                        setSelectedWorkflow(wf);
                                        setViewMode('workflow');
                                    }}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <Workflow size={14} className="text-slate-400" />
                                        <p className="text-sm font-medium text-slate-900">{wf.name}</p>
                                    </div>
                                    <p className="text-xs text-slate-500">{wf.description}</p>
                                    <span
                                        className={`mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                            wf.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                                        }`}
                                    >
                                        {wf.status}
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
