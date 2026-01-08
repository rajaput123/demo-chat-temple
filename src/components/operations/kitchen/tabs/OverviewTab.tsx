
import React from 'react';
import { useKitchen } from '@/contexts/KitchenContext';
import { AlertTriangle, Check, Utensils, Users, TrendingUp, Clock, AlertCircle } from 'lucide-react';

export default function OverviewTab() {
    const { dailyPlan, batches, qualityChecks, distribution, counterStock } = useKitchen();

    // Calculate stats
    const totalPlanned = dailyPlan.plannedItems.reduce((acc, item) => acc + item.targetQuantity, 0); // Crude sum for demo
    const activeBatches = batches.filter(b => b.status === 'Cooking').length;
    const completedBatches = batches.filter(b => b.status === 'Completed').length;
    const alerts = distribution.alerts.length + qualityChecks.filter(q => q.status === 'Failed').length;

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Expected Devotees</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-1">{dailyPlan.expectedDevotees.toLocaleString()}</h3>
                        </div>
                        <Users className="text-blue-500" size={20} />
                    </div>
                </div>

                <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Plan Status</p>
                            <h3 className={`text-2xl font-black mt-1 ${dailyPlan.status === 'Approved' ? 'text-green-600' : 'text-harvest-yellow'
                                }`}>
                                {dailyPlan.status}
                            </h3>
                        </div>
                        <Check className="text-green-500" size={20} />
                    </div>
                </div>

                <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Batches</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-1">{activeBatches}</h3>
                            <p className="text-xs text-slate-500 mt-1">{completedBatches} Completed</p>
                        </div>
                        <Utensils className="text-orange-500" size={20} />
                    </div>
                </div>

                <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alerts</p>
                            <h3 className={`text-2xl font-black mt-1 ${alerts > 0 ? 'text-red-500' : 'text-slate-900'}`}>{alerts}</h3>
                        </div>
                        <AlertTriangle className={alerts > 0 ? 'text-red-500' : 'text-slate-300'} size={20} />
                    </div>
                </div>
            </div>

            {/* Read-Only Plan Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Clock size={18} className="text-slate-500" />
                        Today's Menu Plan
                    </h3>
                    <div className="space-y-3">
                        {dailyPlan.plannedItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-slate-100">
                                <div>
                                    <h4 className="font-bold text-slate-800">{item.recipeName}</h4>
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 mt-1 inline-block">
                                        {item.category}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-black text-slate-900">{item.targetQuantity} <span className="text-sm font-medium text-slate-500">{item.unit}</span></div>
                                    <div className="text-xs text-slate-500">{item.batchCount} Batches</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity Stream / Alerts */}
                <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <AlertCircle size={18} className="text-slate-500" />
                        Live Status
                    </h3>
                    <div className="space-y-4">
                        {/* Mock Live Stream Items */}
                        <div className="flex gap-4 items-start">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-slate-900">Distribution Started at Main Hall</p>
                                <p className="text-xs text-slate-500">12:00 PM</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-slate-900">Batch #2 Puliyogare Passed Quality Check</p>
                                <p className="text-xs text-slate-500">11:45 AM • Inspector: Head Priest</p>
                            </div>
                        </div>
                        {counterStock[0].items.some(i => i.currentStock < 100) && (
                            <div className="flex items-center gap-3 bg-red-50 p-3 rounded-lg border border-red-100">
                                <AlertTriangle className="text-red-500 shrink-0" size={16} />
                                <div>
                                    <p className="text-sm font-bold text-red-700">Low Stock Alert: Wada</p>
                                    <p className="text-xs text-red-600">Main Entrance Counter has only 50 pcs left.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
