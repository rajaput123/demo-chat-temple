
import React from 'react';
import { useKitchen } from '@/contexts/KitchenContext';
import { Users, Utensils, AlertTriangle, Activity } from 'lucide-react';

export default function DistributionTab() {
    const { distribution } = useKitchen();
    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Users size={24} className="text-slate-500" />
                    Annadanam Distribution
                </h2>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold uppercase text-sm animate-pulse">
                    Live: {distribution.status}
                </span>
            </div>

            {/* Main Status Card */}
            <div className="bg-gradient-to-br from-orange-400 to-harvest-yellow rounded-2xl p-8 text-white shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-x divide-white/20">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-white/60 mb-2">Location</p>
                        <h3 className="text-2xl font-black">{distribution.location}</h3>
                    </div>
                    <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-white/60 mb-2">Meals Served</p>
                        <h3 className="text-4xl font-black">{distribution.mealsServed.toLocaleString()}</h3>
                        <p className="text-sm font-medium text-white/80 mt-1">of {distribution.mealsPrepared.toLocaleString()} Prepared</p>
                    </div>
                    <div>
                        <p className="text-sm font-bold uppercase tracking-widest text-white/60 mb-2">Crowd Level</p>
                        <div className="inline-flex items-center gap-2 bg-black/20 px-4 py-2 rounded-lg">
                            <Activity size={20} />
                            <h3 className="text-xl font-black">{distribution.currentCrowdLevel}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white/40 backdrop-blur-xl border border-neutral-200/30 rounded-2xl p-6">
                <h3 className="font-bold text-slate-900 mb-4">Actions</h3>
                <div className="flex gap-4">
                    <button className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex flex-col items-center gap-2">
                        <Users size={24} />
                        Update Count
                    </button>
                    <button className="flex-1 py-4 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold hover:bg-red-100 transition-all flex flex-col items-center gap-2">
                        <AlertTriangle size={24} />
                        Log Issue
                    </button>
                </div>
            </div>
        </div>
    );
}
