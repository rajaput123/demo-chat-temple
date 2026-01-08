/**
 * Inventory Management Module
 * 
 * Temple Inventory Management following core principles:
 * - Inventory exists to support rituals, not commerce
 * - One missing item must never stop a ritual or annadanam
 * - Sacred items have higher priority
 * - Festival demand is fundamentally different
 * - Donation-in-kind items must be respected
 * - Shortages, excess, and deviations must always be visible
 */

'use client';

import React, { useState } from 'react';
import {
    Package,
    AlertTriangle,
    TrendingDown,
    Plus,
    Filter,
    Eye,
    List,
    BarChart3,
    TrendingUp,
    Truck,
    Bell,
    Calendar,
    FileCheck,
    CheckCircle2,
    XCircle,
    Clock,
} from 'lucide-react';
import {
    InventoryItem,
    StockStatusItem,
    ConsumptionRecord,
    Vendor,
    DonationEntry,
    InventoryAlert,
    ReplenishmentRequest,
    FestivalRequirement,
    InventoryAudit,
    ConsumptionReview,
    StockStatus,
    AlertSeverity,
} from '@/types/inventory';
import {
    mockInventoryItems,
    mockStockStatus,
    mockConsumptionRecords,
    mockVendors,
    mockDonations,
    mockAlerts,
    mockReplenishmentRequests,
    mockFestivalRequirements,
    mockAudits,
    mockConsumptionReviews,
} from '@/data/mockInventoryData';
import ChartContainer from '@/components/shared/charts/ChartContainer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { InventoryProvider, useInventory } from '@/contexts/InventoryContext';
import Modal from '@/components/shared/Modal';

interface Tab {
    id: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
}

const tabs: Tab[] = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'items', label: 'Items', icon: List },
    { id: 'stock', label: 'Stock Status', icon: BarChart3 },
    { id: 'consumption', label: 'Consumption', icon: TrendingUp },
    { id: 'sources', label: 'Sources', icon: Truck },
    { id: 'alerts', label: 'Alerts & Replenishment', icon: Bell },
    { id: 'festival', label: 'Festival Readiness', icon: Calendar },
    { id: 'review', label: 'Review & Audit', icon: FileCheck },
];

function InventoryContent() {
    const [activeTab, setActiveTab] = useState<string>('overview');
    const { items, alerts, addItem, stockStatus } = useInventory();

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        itemName: '',
        category: 'ritual' as 'ritual' | 'kitchen' | 'maintenance' | 'office',
        unit: 'kg',
        currentStock: '',
        reorderLevel: '',
        supplier: '',
        sacredStatus: 'general' as 'sacred' | 'semi-sacred' | 'general',
        shelfLife: ''
    });

    const handleAddItem = () => {
        if (!formData.itemName || !formData.currentStock || !formData.reorderLevel) {
            alert('Please fill in all required fields');
            return;
        }

        addItem({
            itemName: formData.itemName,
            category: formData.category,
            unit: formData.unit,
            currentStock: parseInt(formData.currentStock),
            reorderLevel: parseInt(formData.reorderLevel),
            supplier: formData.supplier || 'Unassigned',
            sacredStatus: formData.sacredStatus,
            shelfLife: formData.shelfLife ? parseInt(formData.shelfLife) : undefined,
            description: ''
        });

        // Reset form
        setFormData({
            itemName: '',
            category: 'ritual',
            unit: 'kg',
            currentStock: '',
            reorderLevel: '',
            supplier: '',
            sacredStatus: 'general',
            shelfLife: ''
        });
        setShowAddModal(false);
    };

    // Overview calculations
    const criticalItems = stockStatus.filter((s) => s.status === 'Critical').length;
    const lowItems = stockStatus.filter((s) => s.status === 'Low').length;
    const okItems = stockStatus.filter((s) => s.status === 'OK').length;
    const activeAlertsCount = alerts.filter((a) => !a.acknowledged).length;
    const sacredItemsAtRisk = stockStatus.filter((s) => s.sacredStatus === 'sacred' && (s.status === 'Low' || s.status === 'Critical')).length;

    // Festival readiness indicator
    const festivalReadiness = mockFestivalRequirements[0];
    const readyItems = festivalReadiness.items.filter((i) => i.status === 'ready').length;
    const totalFestivalItems = festivalReadiness.items.length;
    const festivalReadinessPercent = Math.round((readyItems / totalFestivalItems) * 100);

    const getStatusColor = (status: StockStatus) => {
        switch (status) {
            case 'OK':
                return 'bg-green-100 text-green-700';
            case 'Low':
                return 'bg-yellow-100 text-yellow-700';
            case 'Critical':
                return 'bg-red-100 text-red-700';
        }
    };

    const getSeverityColor = (severity: AlertSeverity) => {
        switch (severity) {
            case 'info':
                return 'bg-blue-100 text-blue-700';
            case 'warning':
                return 'bg-yellow-100 text-yellow-700';
            case 'critical':
                return 'bg-red-100 text-red-700';
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        {/* Critical Status Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-600">Critical Items</span>
                                    <AlertTriangle size={18} className="text-red-500" />
                                </div>
                                <div className="text-3xl font-black text-red-600">{criticalItems}</div>
                                <div className="text-xs text-slate-500 mt-1">Require immediate attention</div>
                            </div>
                            <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-600">Low Stock</span>
                                    <Clock size={18} className="text-yellow-500" />
                                </div>
                                <div className="text-3xl font-black text-yellow-600">{lowItems}</div>
                                <div className="text-xs text-slate-500 mt-1">Need replenishment</div>
                            </div>
                            <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-600">Active Alerts</span>
                                    <Bell size={18} className="text-orange-500" />
                                </div>
                                <div className="text-3xl font-black text-orange-600">{activeAlertsCount}</div>
                                <div className="text-xs text-slate-500 mt-1">Unacknowledged alerts</div>
                            </div>
                            <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-slate-600">Sacred Items at Risk</span>
                                    <AlertTriangle size={18} className="text-red-500" />
                                </div>
                                <div className="text-3xl font-black text-red-600">{sacredItemsAtRisk}</div>
                                <div className="text-xs text-slate-500 mt-1">Highest priority</div>
                            </div>
                        </div>

                        {/* Festival Readiness */}
                        <ChartContainer title="Festival Readiness">
                            <div className="p-6">
                                <div className="mb-4">
                                    <h4 className="font-black text-slate-900 mb-2">{festivalReadiness.festivalName}</h4>
                                    <p className="text-sm text-slate-600">
                                        {festivalReadiness.startDate} to {festivalReadiness.endDate}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <div className="w-full bg-slate-200 rounded-full h-4 mb-2">
                                            <div
                                                className={`h-4 rounded-full transition-all ${festivalReadinessPercent >= 80 ? 'bg-green-600' : festivalReadinessPercent >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                                                    }`}
                                                style={{ width: `${festivalReadinessPercent}%` }}
                                            />
                                        </div>
                                        <p className="text-sm text-slate-600">
                                            {readyItems} of {totalFestivalItems} items ready ({festivalReadinessPercent}%)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </ChartContainer>

                        {/* Active Alerts */}
                        {alerts.filter((a) => !a.acknowledged).length > 0 && (
                            <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                                <h3 className="text-sm font-black text-slate-900 mb-4 tracking-tight">Active Alerts</h3>
                                <div className="space-y-3">
                                    {alerts
                                        .filter((a) => !a.acknowledged)
                                        .slice(0, 5)
                                        .map((alert) => (
                                            <div
                                                key={alert.id}
                                                className="p-4 bg-white/60 rounded-lg border border-slate-200/50 hover:border-slate-300/50 transition-all cursor-pointer"
                                                onClick={() => setActiveTab('alerts')}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getSeverityColor(alert.severity)}`}>
                                                                {alert.severity}
                                                            </span>
                                                            {alert.sacredStatus === 'sacred' && (
                                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-700">
                                                                    Sacred
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h4 className="font-black text-slate-900 mb-1">{alert.itemName}</h4>
                                                        <p className="text-sm text-slate-600">{alert.message}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'items':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-slate-900 tracking-tight">Inventory Items</h3>
                            <button className="px-4 py-2 bg-industrial-gray text-white rounded-lg hover:bg-industrial-gray/90 transition-colors flex items-center gap-2">
                                <Plus size={18} />
                                <span className="font-medium">Add Item</span>
                            </button>
                        </div>
                        <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                            <div className="space-y-3">
                                {items.map((item) => (
                                    <div key={item.id} className="p-4 bg-white/60 rounded-lg border border-slate-200/50 hover:border-slate-300/50 transition-all">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Package size={18} className="text-slate-400" />
                                                <h4 className="font-black text-slate-900">{item.name}</h4>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {item.sacredStatus === 'sacred' && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-700">
                                                        Sacred
                                                    </span>
                                                )}
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 capitalize">
                                                    {item.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-slate-500 text-xs mb-1">Unit</p>
                                                <p className="font-medium text-slate-700">{item.unit}</p>
                                            </div>
                                            {item.shelfLife && (
                                                <div>
                                                    <p className="text-slate-500 text-xs mb-1">Shelf Life</p>
                                                    <p className="font-medium text-slate-700">{item.shelfLife} days</p>
                                                </div>
                                            )}
                                        </div>
                                        {item.description && <p className="text-xs text-slate-500 mt-2">{item.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'stock':
                return (
                    <div className="space-y-6">
                        <ChartContainer title="Stock Levels vs Minimum Required">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={stockStatus}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="itemName" stroke="#64748b" style={{ fontSize: '12px' }} angle={-45} textAnchor="end" height={100} />
                                    <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="currentStock" fill="#3b82f6" name="Current Stock" />
                                    <Bar dataKey="minimumRequired" fill="#ef4444" name="Minimum Required" />
                                    <Bar dataKey="reservedQuantity" fill="#f59e0b" name="Reserved" />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>

                        <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                            <h3 className="text-sm font-black text-slate-900 mb-4 tracking-tight">Stock Status</h3>
                            <div className="space-y-3">
                                {stockStatus.map((stock) => (
                                    <div
                                        key={stock.itemId}
                                        className={`p-4 rounded-lg border transition-all ${stock.status === 'Critical'
                                            ? 'bg-red-50/60 border-red-200/50'
                                            : stock.status === 'Low'
                                                ? 'bg-yellow-50/60 border-yellow-200/50'
                                                : 'bg-white/60 border-slate-200/50 hover:border-slate-300/50'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h4 className="font-black text-slate-900">{stock.itemName}</h4>
                                                <p className="text-xs text-slate-500 capitalize">{stock.category}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {stock.sacredStatus === 'sacred' && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-700">
                                                        Sacred
                                                    </span>
                                                )}
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusColor(stock.status)}`}>
                                                    {stock.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <p className="text-slate-500 text-xs mb-1">Current</p>
                                                <p className="font-black text-slate-900">
                                                    {stock.currentStock} {stock.unit}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 text-xs mb-1">Minimum</p>
                                                <p className="font-medium text-slate-700">
                                                    {stock.minimumRequired} {stock.unit}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 text-xs mb-1">Reserved</p>
                                                <p className="font-medium text-slate-700">
                                                    {stock.reservedQuantity} {stock.unit}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 text-xs mb-1">Available</p>
                                                <p
                                                    className={`font-black ${stock.availableBalance < 0 ? 'text-red-600' : 'text-slate-900'
                                                        }`}
                                                >
                                                    {stock.availableBalance} {stock.unit}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'consumption':
                return (
                    <div className="space-y-6">
                        <ChartContainer title="Consumption Trends">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={mockConsumptionRecords}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="itemName" stroke="#64748b" style={{ fontSize: '12px' }} angle={-45} textAnchor="end" height={100} />
                                    <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="plannedQuantity" stroke="#8b5cf6" strokeWidth={2} name="Planned" />
                                    <Line type="monotone" dataKey="actualQuantity" stroke="#10b981" strokeWidth={2} name="Actual" />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>

                        <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                            <h3 className="text-sm font-black text-slate-900 mb-4 tracking-tight">Consumption Records</h3>
                            <div className="space-y-3">
                                {mockConsumptionRecords.map((record) => (
                                    <div key={record.id} className="p-4 bg-white/60 rounded-lg border border-slate-200/50">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h4 className="font-black text-slate-900">{record.itemName}</h4>
                                                <p className="text-xs text-slate-500 capitalize">{record.consumptionType}</p>
                                            </div>
                                            {record.deviation && record.deviation !== 0 && (
                                                <span
                                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${Math.abs(record.deviation) > record.plannedQuantity! * 0.2
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                        }`}
                                                >
                                                    Deviation: {record.deviation > 0 ? '+' : ''}
                                                    {record.deviation} {record.unit}
                                                </span>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <p className="text-slate-500 text-xs mb-1">Planned</p>
                                                <p className="font-medium text-slate-700">
                                                    {record.plannedQuantity || 'N/A'} {record.unit}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 text-xs mb-1">Actual</p>
                                                <p className="font-black text-slate-900">
                                                    {record.actualQuantity} {record.unit}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 text-xs mb-1">Date</p>
                                                <p className="font-medium text-slate-700">
                                                    {new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                        {record.notes && <p className="text-xs text-slate-500 mt-2">{record.notes}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'sources':
                return (
                    <div className="space-y-6">
                        <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                            <h3 className="text-sm font-black text-slate-900 mb-4 tracking-tight">Vendors</h3>
                            <div className="space-y-3">
                                {mockVendors.map((vendor) => (
                                    <div key={vendor.id} className="p-4 bg-white/60 rounded-lg border border-slate-200/50">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h4 className="font-black text-slate-900">{vendor.name}</h4>
                                                {vendor.contactPerson && <p className="text-xs text-slate-500">{vendor.contactPerson}</p>}
                                            </div>
                                            {vendor.reliabilityScore && (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-100 text-green-700">
                                                    Reliability: {vendor.reliabilityScore}/10
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            {vendor.phone && <p>Phone: {vendor.phone}</p>}
                                            <p className="text-xs text-slate-500 mt-1">
                                                Supplies {vendor.itemsSupplied.length} item(s)
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                            <h3 className="text-sm font-black text-slate-900 mb-4 tracking-tight">Donation-in-Kind</h3>
                            <div className="space-y-3">
                                {mockDonations.map((donation) => (
                                    <div key={donation.id} className="p-4 bg-white/60 rounded-lg border border-purple-200/50">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h4 className="font-black text-slate-900">{donation.itemName}</h4>
                                                <p className="text-xs text-slate-500">Donated by: {donation.donorName}</p>
                                            </div>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-700">
                                                Donation
                                            </span>
                                        </div>
                                        <div className="text-sm">
                                            <p className="text-slate-700">
                                                Quantity: <span className="font-black">{donation.quantity}</span> {donation.unit}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Received: {new Date(donation.receivedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </p>
                                            {donation.usageRestrictions && (
                                                <p className="text-xs text-orange-600 mt-1">⚠️ {donation.usageRestrictions}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'alerts':
                return (
                    <div className="space-y-6">
                        <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                            <h3 className="text-sm font-black text-slate-900 mb-4 tracking-tight">Active Alerts</h3>
                            <div className="space-y-3">
                                {alerts.map((alert) => (
                                    <div
                                        key={alert.id}
                                        className={`p-4 rounded-lg border transition-all ${alert.severity === 'critical'
                                            ? 'bg-red-50/60 border-red-200/50'
                                            : alert.severity === 'warning'
                                                ? 'bg-yellow-50/60 border-yellow-200/50'
                                                : 'bg-blue-50/60 border-blue-200/50'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <AlertTriangle size={18} className="text-red-500" />
                                                <h4 className="font-black text-slate-900">{alert.itemName}</h4>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {alert.sacredStatus === 'sacred' && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-700">
                                                        Sacred
                                                    </span>
                                                )}
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getSeverityColor(alert.severity)}`}>
                                                    {alert.severity}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-2">{alert.message}</p>
                                        {alert.currentStock !== undefined && (
                                            <div className="text-xs text-slate-500">
                                                Current: {alert.currentStock} | Minimum: {alert.minimumRequired} | Available:{' '}
                                                {alert.availableBalance}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                            <h3 className="text-sm font-black text-slate-900 mb-4 tracking-tight">Replenishment Requests</h3>
                            <div className="space-y-3">
                                {mockReplenishmentRequests.map((request) => (
                                    <div key={request.id} className="p-4 bg-white/60 rounded-lg border border-slate-200/50">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h4 className="font-black text-slate-900">{request.itemName}</h4>
                                                <p className="text-xs text-slate-500">{request.reason}</p>
                                            </div>
                                            <span
                                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${request.priority === 'critical'
                                                    ? 'bg-red-100 text-red-700'
                                                    : request.priority === 'high'
                                                        ? 'bg-orange-100 text-orange-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                    }`}
                                            >
                                                {request.priority}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-600">
                                                Quantity: <span className="font-black">{request.requestedQuantity}</span> {request.unit}
                                            </span>
                                            <span
                                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${request.status === 'approved'
                                                    ? 'bg-green-100 text-green-700'
                                                    : request.status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-slate-100 text-slate-700'
                                                    }`}
                                            >
                                                {request.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'festival':
                return (
                    <div className="space-y-6">
                        {mockFestivalRequirements.map((festival) => (
                            <div key={festival.festivalId} className="space-y-6">
                                <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                                    <h3 className="text-sm font-black text-slate-900 mb-4 tracking-tight">{festival.festivalName}</h3>
                                    <p className="text-sm text-slate-600 mb-4">
                                        {new Date(festival.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} -{' '}
                                        {new Date(festival.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                                    </p>
                                    <div className="space-y-3">
                                        {festival.items.map((item) => (
                                            <div
                                                key={item.itemId}
                                                className={`p-4 rounded-lg border ${item.status === 'not-ready'
                                                    ? 'bg-red-50/60 border-red-200/50'
                                                    : item.status === 'partial'
                                                        ? 'bg-yellow-50/60 border-yellow-200/50'
                                                        : 'bg-green-50/60 border-green-200/50'
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h4 className="font-black text-slate-900">{item.itemName}</h4>
                                                        {item.sacredStatus === 'sacred' && (
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-700 mt-1 inline-block">
                                                                Sacred
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.priority === 'critical'
                                                                ? 'bg-red-100 text-red-700'
                                                                : item.priority === 'high'
                                                                    ? 'bg-orange-100 text-orange-700'
                                                                    : 'bg-yellow-100 text-yellow-700'
                                                                }`}
                                                        >
                                                            {item.priority}
                                                        </span>
                                                        <span
                                                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.status === 'ready'
                                                                ? 'bg-green-100 text-green-700'
                                                                : item.status === 'partial'
                                                                    ? 'bg-yellow-100 text-yellow-700'
                                                                    : 'bg-red-100 text-red-700'
                                                                }`}
                                                        >
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-slate-500 text-xs mb-1">Required</p>
                                                        <p className="font-black text-slate-900">
                                                            {item.requiredQuantity} {item.unit}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-500 text-xs mb-1">Current</p>
                                                        <p className="font-medium text-slate-700">
                                                            {item.currentStock} {item.unit}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-500 text-xs mb-1">Reserved</p>
                                                        <p className="font-medium text-slate-700">
                                                            {item.reservedQuantity} {item.unit}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-slate-500 text-xs mb-1">Shortfall</p>
                                                        <p className="font-black text-red-600">
                                                            {item.shortfall} {item.unit}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'review':
                return (
                    <div className="space-y-6">
                        <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                            <h3 className="text-sm font-black text-slate-900 mb-4 tracking-tight">Audit Records</h3>
                            <div className="space-y-4">
                                {mockAudits.map((audit) => (
                                    <div key={audit.id} className="p-4 bg-white/60 rounded-lg border border-slate-200/50">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h4 className="font-black text-slate-900">
                                                    Audit - {new Date(audit.auditDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                </h4>
                                                <p className="text-xs text-slate-500">Conducted by: {audit.conductedBy}</p>
                                            </div>
                                            <span
                                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${audit.status === 'approved'
                                                    ? 'bg-green-100 text-green-700'
                                                    : audit.status === 'completed'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-slate-100 text-slate-700'
                                                    }`}
                                            >
                                                {audit.status}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            {audit.items.map((item) => (
                                                <div key={item.itemId} className="text-sm">
                                                    <span className="font-medium text-slate-900">{item.itemName}:</span>{' '}
                                                    <span className="text-slate-600">
                                                        Recorded: {item.recordedStock} | Physical: {item.physicalStock} | Variance:{' '}
                                                        {item.variance > 0 ? '+' : ''}
                                                        {item.variance} {item.unit}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        {audit.discrepancies.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-slate-200">
                                                <p className="text-xs font-medium text-slate-500 mb-2">Discrepancies:</p>
                                                {audit.discrepancies.map((disc) => {
                                                    const auditItem = audit.items.find((i) => i.itemId === disc.itemId);
                                                    return (
                                                        <div key={disc.itemId} className="text-xs">
                                                            <span className="font-medium">{disc.itemName}:</span>{' '}
                                                            <span className={disc.resolved ? 'text-green-600' : 'text-red-600'}>
                                                                {disc.variance > 0 ? '+' : ''}
                                                                {disc.variance} {auditItem?.unit || ''} - {disc.severity} -{' '}
                                                                {disc.resolved ? 'Resolved' : 'Pending'}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[24px] p-6">
                            <h3 className="text-sm font-black text-slate-900 mb-4 tracking-tight">Consumption Reviews</h3>
                            <div className="space-y-4">
                                {mockConsumptionReviews.map((review) => (
                                    <div key={review.id} className="p-4 bg-white/60 rounded-lg border border-slate-200/50">
                                        <h4 className="font-black text-slate-900 mb-3">{review.reviewPeriod}</h4>
                                        <div className="space-y-2">
                                            {review.items.map((item) => (
                                                <div key={item.itemId} className="text-sm">
                                                    <span className="font-medium text-slate-900">{item.itemName}:</span>{' '}
                                                    <span className="text-slate-600">
                                                        Planned: {item.plannedConsumption} | Actual: {item.actualConsumption} | Deviation:{' '}
                                                        {item.deviation > 0 ? '+' : ''}
                                                        {item.deviation} ({item.deviationPercentage > 0 ? '+' : ''}
                                                        {item.deviationPercentage}%) {item.unit}
                                                    </span>
                                                    {Math.abs(item.deviationPercentage) > 20 && (
                                                        <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700">
                                                            Flagged
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Inventory Management</h2>
                    <p className="text-sm text-slate-600 font-medium mt-1">Ensure uninterrupted worship and ritual sanctity</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-neutral-200 overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${isActive
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
            <div className="animate-fadeIn">{renderTabContent()}</div>
        </div>
    );
}

export default function InventoryManagement() {
    return (
        <InventoryProvider>
            <InventoryContent />
        </InventoryProvider>
    );
}
