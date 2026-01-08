import React, { useState } from 'react';
import {
    Database, Tag, PlusCircle, ShieldCheck, Truck,
    Wrench, Search, LineChart, FileText, Trash2,
    Archive, BarChart3, Lock, ChevronRight, ArrowLeft
} from 'lucide-react';

// Real Sub-module imports
import AssetRegistry from './modules/registry/AssetRegistry';
import AssetClassification from './modules/classification/AssetClassification';
import AssetAcquisition from './modules/acquisition/AssetAcquisition';
import SecurityCustody from './modules/security/SecurityCustody';
import AssetMovement from './modules/movement/AssetMovement';
import AssetMaintenance from './modules/maintenance/AssetMaintenance';
import AssetAudit from './modules/audit/AssetAudit';
import AssetValuation from './modules/valuation/AssetValuation';
import AssetCompliance from './modules/compliance/AssetCompliance';
import AssetDisposal from './modules/disposal/AssetDisposal';
import AssetHistory from './modules/history/AssetHistory';
import AssetReporting from './modules/reporting/AssetReporting';
import AssetGovernance from './modules/governance/AssetGovernance';

// Generic Placeholder for not-yet-implemented modules
const Placeholder = ({ name, description }: { name: string, description: string }) => (
    <div className="p-8 bg-white/50 backdrop-blur-xl rounded-[32px] border border-neutral-200/50 shadow-sm animate-fadeIn">
        <h2 className="text-xl font-black text-slate-900 mb-4 tracking-tight underline decoration-slate-200 underline-offset-8">{name}.</h2>
        <p className="text-slate-600 font-medium leading-relaxed max-w-2xl mb-8">{description}</p>
        <div className="mt-12 p-12 rounded-3xl bg-slate-50 border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Database size={24} className="opacity-20" />
            </div>
            <p className="font-bold text-xs uppercase tracking-[0.2em] mb-2">Governance Framework Active</p>
            <p className="italic text-sm text-center max-w-xs">Connecting to the cross-module data lake for &quot;{name}&quot; logic stream...</p>
        </div>
    </div>
);

export default function AssetManagementView() {
    const [activeSubModule, setActiveSubModule] = useState<string | null>(null);

    const subModules = [
        { id: 'registry', label: 'Asset Registry', icon: Database, description: 'Single source of truth for all temple assets across branches.', component: AssetRegistry },
        { id: 'classification', label: 'Classification & Tagging', icon: Tag, description: 'Multi-dimensional tagging (Sacred, Movable, Capital).', component: AssetClassification },
        { id: 'acquisition', label: 'Onboarding & Acquisition', icon: PlusCircle, description: 'Formal entry for donations, purchases, and grants.', component: AssetAcquisition },
        { id: 'security', label: 'Security & Custody', icon: ShieldCheck, description: 'Real-time custodianship tracking and access restriction.', component: SecurityCustody },
        { id: 'movement', label: 'Movement tracking', icon: Truck, description: 'Utilization logs and intra-temple movement control.', component: AssetMovement },
        { id: 'maintenance', label: 'Maintenance & Preservation', icon: Wrench, description: 'Predictive care for sacred artifacts and infrastructure.', component: AssetMaintenance },
        { id: 'audit', label: 'Audit & Verification', icon: Search, description: 'Periodic physical verification and discrepancy resolution.', component: AssetAudit },
        { id: 'valuation', label: 'Valuation & Finance', icon: LineChart, description: 'Financial linkage, appreciation, and balance sheet integration.', component: AssetValuation },
        { id: 'compliance', label: 'Compliance & Legal', icon: FileText, description: 'Deeds, legal status, and 80G tax benefit management.', component: AssetCompliance },
        { id: 'disposal', label: 'Retirement & Disposal', icon: Trash2, description: 'Governance-approved decommissioning and recycling.', component: AssetDisposal },
        { id: 'history', label: 'History & Memory', icon: Archive, description: 'Institutional memory and archival media preservation.', component: AssetHistory },
        { id: 'reporting', label: 'Impact & Reporting', icon: BarChart3, description: 'High-fidelity dashboards for trustees and auditors.', component: AssetReporting },
        { id: 'governance', label: 'Access & Governance', icon: Lock, description: 'Role-based access, approval matrices, and audit logs.', component: AssetGovernance },
    ];

    const activeModuleData = subModules.find(m => m.id === activeSubModule);

    return (
        <div className="h-full w-full bg-white overflow-auto scrollbar-hide">
            <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-neutral-100">
                <div className="max-w-[1600px] mx-auto">
                    <div className="flex items-center gap-4">
                        {activeSubModule && (
                            <button
                                onClick={() => setActiveSubModule(null)}
                                className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-slate-900 hover:bg-industrial-gray hover:text-white transition-all hover:scale-105 active:scale-95"
                            >
                                <ArrowLeft size={18} />
                            </button>
                        )}
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">Asset Management.</h1>
                            <p className="text-base text-slate-500 font-medium italic opacity-60 mt-1">Unified governance across all temple wealth.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-6 py-8">
                <div className="max-w-[1600px] mx-auto">
                    {activeSubModule ? (
                        activeModuleData?.component ? (
                            React.createElement(activeModuleData.component)
                        ) : (
                            <Placeholder name={activeModuleData?.label || ''} description={activeModuleData?.description || ''} />
                        )
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {subModules.map((module) => (
                                <button
                                    key={module.id}
                                    onClick={() => setActiveSubModule(module.id)}
                                    className="group relative p-6 rounded-[24px] bg-white/40 backdrop-blur-xl border border-neutral-200/30 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] transition-all duration-500 hover:shadow-[0_8px_48px_0_rgba(31,38,135,0.1)] hover:bg-white/60 hover:border-neutral-200/50 hover:-translate-y-1 text-left flex flex-col h-full"
                                >
                                    <div className="mb-4 flex items-start justify-between">
                                        <div className="w-10 h-10 rounded-xl bg-industrial-gray/5 flex items-center justify-center text-slate-900 group-hover:bg-industrial-gray group-hover:text-white transition-all duration-500">
                                            <module.icon size={20} />
                                        </div>
                                        <ChevronRight size={18} className="text-slate-300 group-hover:text-cane-green transition-all opacity-0 group-hover:opacity-100" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-black text-slate-900 mb-2 tracking-tight group-hover:text-cane-green transition-colors uppercase tracking-tight">{module.label}</h3>
                                        <p className="text-sm text-slate-600 font-medium leading-relaxed group-hover:text-slate-900 transition-colors line-clamp-3">
                                            {module.description}
                                        </p>
                                    </div>
                                    <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                        <span>Initialize governance</span>
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
