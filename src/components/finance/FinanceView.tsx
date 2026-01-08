import React, { useState } from 'react';
import DonationManagement from './donations/DonationManagement';
import ExpenseManagement from './expenses/ExpenseManagement';
import BudgetForecasting from './budgeting/BudgetForecasting';
import ComplianceLegal from './compliance/ComplianceLegal';
import { ChevronRight } from 'lucide-react';

export default function FinanceView() {
    const [activeSubModule, setActiveSubModule] = useState<string | null>(null);

    const subModules = [
        { id: 'donations', label: 'Donation Management', component: DonationManagement },
        { id: 'expenses', label: 'Expense Management', component: ExpenseManagement },
        { id: 'budgeting', label: 'Budgeting & Forecasting', component: BudgetForecasting },
        { id: 'compliance', label: 'Compliance & Legal (80G)', component: ComplianceLegal },
    ];

    return (
        <div className="h-full w-full bg-white overflow-auto">
            <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-neutral-100">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 tracking-tight">Finance.</h1>
                <p className="text-base text-neutral-500 font-medium italic opacity-60 mt-1">Transparent, auditable financial governance</p>
            </div>

            <div className="px-4 sm:px-6 py-6">
                <div className="max-w-7xl mx-auto">
                    {activeSubModule ? (
                        <div>
                            <button
                                onClick={() => setActiveSubModule(null)}
                                className="mb-4 text-sm text-cane-green hover:text-cane-green/80 font-medium"
                            >
                                ← Back to Finance
                            </button>
                            {React.createElement(subModules.find(m => m.id === activeSubModule)?.component || DonationManagement)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {subModules.map((module) => (
                                <button
                                    key={module.id}
                                    onClick={() => setActiveSubModule(module.id)}
                                    className="group relative p-6 rounded-[24px] bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] transition-all duration-500 hover:shadow-[0_8px_48px_0_rgba(31,38,135,0.1)] hover:bg-white/60 hover:border-neutral-200/50 hover:-translate-y-1 text-left flex flex-col h-full"
                                >
                                    <div className="mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-industrial-gray/5 flex items-center justify-center text-slate-900 group-hover:bg-industrial-gray group-hover:text-white transition-all duration-500">
                                            <ChevronRight size={20} className="transition-transform duration-500 group-hover:rotate-[-45deg]" />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 mb-2 tracking-tight group-hover:text-cane-green transition-colors">{module.label}</h3>
                                    <p className="text-sm text-slate-600 font-medium leading-relaxed flex-1">Click to manage transparent financial governance.</p>
                                    <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                                        <span>Open module</span>
                                        <ChevronRight size={12} strokeWidth={3} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
