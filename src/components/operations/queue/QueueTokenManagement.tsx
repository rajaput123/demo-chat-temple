/**
 * Queue & Token Management
 * 
 * Token generation, queue management, and wait time tracking
 */

'use client';

import React, { useState } from 'react';
import { Ticket, Clock, Users, TrendingUp, Plus } from 'lucide-react';
import { Token, QueueStatus } from '@/types/operations';
import { mockTokens, mockQueueStatus } from '@/data/mockOperationsData';
import ChartContainer from '@/components/shared/charts/ChartContainer';
import NetworkGraph from '@/components/shared/charts/NetworkGraph';
import { Node, Edge } from '@xyflow/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export default function QueueTokenManagement() {
    const [tokens, setTokens] = useState<Token[]>(mockTokens);
    const [queueStatus, setQueueStatus] = useState<QueueStatus[]>(mockQueueStatus);
    const [viewMode, setViewMode] = useState<'tokens' | 'queue' | 'flow'>('tokens');

    // Wait time data (mock)
    const waitTimeData = [
        { time: '09:00', darshan: 25, seva: 15, prasad: 10 },
        { time: '10:00', darshan: 35, seva: 20, prasad: 12 },
        { time: '11:00', darshan: 45, seva: 25, prasad: 15 },
        { time: '12:00', darshan: 40, seva: 22, prasad: 13 },
        { time: '13:00', darshan: 30, seva: 18, prasad: 11 },
        { time: '14:00', darshan: 35, seva: 20, prasad: 12 },
    ];

    // Token distribution by type
    const tokenTypeData = tokens.reduce(
        (acc, token) => {
            acc[token.queueType] = (acc[token.queueType] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );

    const typeChartData = Object.entries(tokenTypeData).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
    }));

    // Token flow network graph
    const flowNodes: Node[] = [
        { id: 'issue', type: 'default', position: { x: 0, y: 100 }, data: { label: 'Token Issued' }, style: { background: '#8b5cf6', color: 'white', borderRadius: '8px', padding: '15px', fontWeight: 'bold' } },
        { id: 'queue', type: 'default', position: { x: 200, y: 100 }, data: { label: 'In Queue' }, style: { background: '#3b82f6', color: 'white', borderRadius: '8px', padding: '15px', fontWeight: 'bold' } },
        { id: 'processing', type: 'default', position: { x: 400, y: 100 }, data: { label: 'Processing' }, style: { background: '#f59e0b', color: 'white', borderRadius: '8px', padding: '15px', fontWeight: 'bold' } },
        { id: 'completed', type: 'default', position: { x: 600, y: 100 }, data: { label: 'Completed' }, style: { background: '#10b981', color: 'white', borderRadius: '8px', padding: '15px', fontWeight: 'bold' } },
    ];

    const flowEdges: Edge[] = [
        { id: 'e1', source: 'issue', target: 'queue', type: 'smoothstep', animated: true },
        { id: 'e2', source: 'queue', target: 'processing', type: 'smoothstep', animated: true },
        { id: 'e3', source: 'processing', target: 'completed', type: 'smoothstep', animated: true },
    ];

    const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-700';
            case 'processing':
                return 'bg-blue-100 text-blue-700';
            case 'waiting':
                return 'bg-yellow-100 text-yellow-700';
            case 'cancelled':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Queue & Token Management</h2>
                    <p className="text-sm text-slate-600 font-medium mt-1">Manage tokens and queue flow</p>
                </div>
                <button className="px-4 py-2 bg-industrial-gray text-white rounded-lg hover:bg-industrial-gray/90 transition-colors flex items-center gap-2">
                    <Plus size={18} />
                    <span className="font-medium">Issue Token</span>
                </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg w-fit">
                <button
                    onClick={() => setViewMode('tokens')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        viewMode === 'tokens' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    Tokens
                </button>
                <button
                    onClick={() => setViewMode('queue')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        viewMode === 'queue' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    Queue Status
                </button>
                <button
                    onClick={() => setViewMode('flow')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        viewMode === 'flow' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    Flow
                </button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Area */}
                <div className="lg:col-span-2 space-y-6">
                    {viewMode === 'tokens' && (
                        <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                            <h3 className="text-sm font-black text-slate-900 mb-4 tracking-tight">Tokens</h3>
                            <div className="space-y-3">
                                {tokens.map((token) => (
                                    <div
                                        key={token.id}
                                        className="p-4 bg-white/60 rounded-lg border border-slate-200/50 hover:border-slate-300/50 transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Ticket size={18} className="text-slate-400" />
                                                <h4 className="font-black text-slate-900">{token.tokenNumber}</h4>
                                                <span className="text-xs text-slate-500">({token.queueType})</span>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusColor(token.status)}`}>
                                                {token.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-slate-600">
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} />
                                                Issued: {new Date(token.issuedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                            </span>
                                            {token.estimatedWaitTime && (
                                                <span>Est. Wait: {token.estimatedWaitTime} min</span>
                                            )}
                                            {token.actualWaitTime && (
                                                <span className="text-green-600">Actual: {token.actualWaitTime} min</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {viewMode === 'queue' && (
                        <>
                            <ChartContainer title="Wait Time Trends">
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={waitTimeData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
                                        <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="darshan" stroke="#8b5cf6" strokeWidth={2} name="Darshan" />
                                        <Line type="monotone" dataKey="seva" stroke="#3b82f6" strokeWidth={2} name="Seva" />
                                        <Line type="monotone" dataKey="prasad" stroke="#10b981" strokeWidth={2} name="Prasad" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartContainer>

                            <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                                <h3 className="text-sm font-black text-slate-900 mb-4 tracking-tight">Queue Status</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {queueStatus.map((queue, index) => (
                                        <div key={index} className="p-4 bg-white/60 rounded-lg border border-slate-200/50">
                                            <h4 className="font-black text-slate-900 mb-2 capitalize">{queue.queueType}</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-600">Waiting</span>
                                                    <span className="font-black text-slate-900">{queue.totalWaiting}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-600">Processing</span>
                                                    <span className="font-black text-blue-600">{queue.totalProcessing}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-slate-600">Avg Wait</span>
                                                    <span className="font-black text-orange-600">{queue.averageWaitTime} min</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {viewMode === 'flow' && (
                        <ChartContainer title="Token Flow Diagram">
                            <NetworkGraph nodes={flowNodes} edges={flowEdges} />
                        </ChartContainer>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Token Type Distribution */}
                    <ChartContainer title="Token Types">
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={typeChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                    outerRadius={60}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {typeChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>

                    {/* Quick Stats */}
                    <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                        <h3 className="text-sm font-black text-slate-900 mb-4 tracking-tight">Quick Stats</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Total Tokens</span>
                                <span className="text-lg font-black text-slate-900">{tokens.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Waiting</span>
                                <span className="text-lg font-black text-yellow-600">{tokens.filter((t) => t.status === 'waiting').length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600">Total Queues</span>
                                <span className="text-lg font-black text-slate-900">{queueStatus.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
