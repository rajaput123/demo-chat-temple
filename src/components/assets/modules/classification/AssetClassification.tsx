import React from 'react';
import { Tag, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function AssetClassification() {
    return (
        <div className="animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Dimensional Tags */}
                <div className="p-8 bg-white border border-slate-100 rounded-3xl space-y-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Tag className="text-slate-500" size={20} />
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Physical Nature</h4>
                    </div>
                    <div className="space-y-3">
                        {['Movable', 'Immovable', 'Semi-Movable'].map(t => (
                            <div key={t} className="p-4 rounded-xl border border-slate-100 flex items-center justify-between hover:border-slate-900 transition-all cursor-pointer group bg-slate-50/30">
                                <span className="text-sm font-bold text-slate-900">{t}</span>
                                <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-industrial-gray" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-8 bg-white border border-slate-100 rounded-3xl space-y-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldAlert className="text-slate-500" size={20} />
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Religious Significance</h4>
                    </div>
                    <div className="space-y-3">
                        {[
                            { name: 'Sacred (Para)', intensity: 'High' },
                            { name: 'Semi-Sacred (Apara)', intensity: 'Med' },
                            { name: 'Administrative', intensity: 'Low' },
                        ].map(t => (
                            <div key={t.name} className="p-4 rounded-xl border border-slate-100 flex items-center justify-between hover:border-slate-900 transition-all cursor-pointer group bg-slate-50/30">
                                <span className="text-sm font-bold text-slate-900">{t.name}</span>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{t.intensity}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-8 bg-white border border-slate-100 rounded-3xl space-y-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Tag className="text-slate-500" size={20} />
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Financial Nature</h4>
                    </div>
                    <div className="space-y-3">
                        {['Capital Asset', 'Revenue/Consumable', 'Endowment'].map(t => (
                            <div key={t} className="p-4 rounded-xl border border-slate-100 flex items-center justify-between hover:border-slate-900 transition-all cursor-pointer group bg-slate-50/30">
                                <span className="text-sm font-bold text-slate-900">{t}</span>
                                <div className="w-2 h-2 rounded-full bg-slate-300 group-hover:bg-industrial-gray" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 p-8 bg-industrial-gray rounded-[32px] text-white">
                <div className="flex items-start gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="text-white" size={24} />
                    </div>
                    <div>
                        <h5 className="text-lg font-black tracking-tight mb-2 italic">How Tags Drive Logic</h5>
                        <p className="text-white/80 text-sm font-medium leading-relaxed max-w-3xl">
                            Tagging an asset as <span className="text-white font-bold">&quot;Sacred&quot;</span> automatically elevates approval authority to the Trustee Board, triggers weekly physical verification, and hides specific valuation details from administrative staff. No separate workflows are required—the tags regulate the unified lifecycle.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
