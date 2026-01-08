
/**
 * Kitchen & Prasad Management (Sacred Operations Logbook)
 * 
 * Strict workflow enforcement for temple kitchen operations.
 * Principles:
 * 1. Sacredness (No commercial language)
 * 2. Accountability (No skipping steps)
 * 3. Visibility (Full transparency)
 */

'use client';

import React, { useState } from 'react';
import {
    LayoutDashboard,
    Calendar,
    ChefHat,
    Utensils,
    ClipboardCheck,
    Users,
    Store,
    Trash2
} from 'lucide-react';

// Tab Components
import OverviewTab from './tabs/OverviewTab';
import PlanningTab from './tabs/PlanningTab';
import RecipesTab from './tabs/RecipesTab';
import ProductionTab from './tabs/ProductionTab';
import QualityTab from './tabs/QualityTab';
import DistributionTab from './tabs/DistributionTab';
import CounterTab from './tabs/CounterTab';
import WastageTab from './tabs/WastageTab';

// Context
import { KitchenProvider } from '@/contexts/KitchenContext';

type TabId = 'overview' | 'planning' | 'recipes' | 'production' | 'quality' | 'distribution' | 'counter' | 'wastage';

function KitchenContent() {
    const [activeTab, setActiveTab] = useState<TabId>('overview');

    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'planning', label: 'Planning', icon: Calendar },
        { id: 'recipes', label: 'Recipes', icon: ChefHat },
        { id: 'production', label: 'Production', icon: Utensils },
        { id: 'quality', label: 'Quality', icon: ClipboardCheck },
        { id: 'distribution', label: 'Annadanam', icon: Users },
        { id: 'counter', label: 'Counter', icon: Store },
        { id: 'wastage', label: 'Wastage', icon: Trash2 },
    ];

    return (
        <div className="space-y-6 animate-fadeIn pb-20">
            {/* Module Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Kitchen & Prasad Seva</h2>
                    <p className="text-sm text-slate-600 font-bold mt-1 uppercase tracking-wide">Sacred Operations Logbook</p>
                </div>
                <div className="px-4 py-2 bg-soft-white border border-harvest-yellow/20 rounded-lg">
                    <p className="text-xs font-bold text-harvest-yellow uppercase tracking-wider">Today's Principle</p>
                    <p className="text-sm font-medium text-industrial-gray">"Purity in preparation leads to Divinity in offering."</p>
                </div>
            </div>

            {/* Navigation Tabs - Strict Order */}
            <div className="flex items-center gap-1 p-1 bg-white/40 backdrop-blur-md rounded-xl border border-white/20 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabId)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${isActive
                                ? 'bg-slate-900 text-white shadow-md'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                                }`}
                        >
                            <Icon size={16} className={isActive ? 'text-harvest-yellow/80' : ''} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content Area */}
            <div className="min-h-[500px]">
                {activeTab === 'overview' && <OverviewTab />}
                {activeTab === 'planning' && <PlanningTab />}
                {activeTab === 'recipes' && <RecipesTab />}
                {activeTab === 'production' && <ProductionTab />}
                {activeTab === 'quality' && <QualityTab />}
                {activeTab === 'distribution' && <DistributionTab />}
                {activeTab === 'counter' && <CounterTab />}
                {activeTab === 'wastage' && <WastageTab />}
            </div>
        </div>
    );
}

export default function KitchenPrasadOperations() {
    return (
        <KitchenProvider>
            <KitchenContent />
        </KitchenProvider>
    );
}
