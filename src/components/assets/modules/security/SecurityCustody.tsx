import React from 'react';
import { ShieldCheck, UserCheck, Map } from 'lucide-react';

export default function SecurityCustody() {
    return (
        <div className="animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Active Custodians */}
                <div className="p-8 bg-white border border-slate-100 rounded-[32px] shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <UserCheck className="text-slate-500" size={20} />
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Primary Custodians</h4>
                        </div>
                        <button className="text-[10px] font-black uppercase text-slate-900 tracking-widest hover:underline">Revoke / Transfer</button>
                    </div>

                    <div className="space-y-4">
                        {[
                            { name: 'Keshav Bhat', role: 'Head Priest', assets: 14, risk: 'Critical' },
                            { name: 'Arjun Das', role: 'Store Manager', assets: 242, risk: 'Med' },
                            { name: 'Meera Rao', role: 'Admin', assets: 45, risk: 'Low' },
                        ].map(c => (
                            <div key={c.name} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-slate-100">
                                <div className="w-10 h-10 rounded-full bg-industrial-gray text-white flex items-center justify-center font-bold text-xs">
                                    {c.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-black text-slate-900">{c.name}</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{c.role}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-slate-900">{c.assets} Assets</p>
                                    <p className={`text-[9px] font-black uppercase tracking-widest ${c.risk === 'Critical' ? 'text-red-600 font-black' : 'text-slate-500'}`}>{c.risk} Risk</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Storage Locations */}
                <div className="p-8 bg-white border border-slate-100 rounded-[32px] shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <Map className="text-slate-500" size={20} />
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Sanctuary & Storage</h4>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {[
                            { loc: 'Garbhagriha (Sanctum)', security: 'Locked / Armed', occ: 98 },
                            { loc: 'Treasury Vault A', security: 'Biometric / Dual Key', occ: 45 },
                            { loc: 'Main Storehouse', security: 'Standard Guard', occ: 60 },
                        ].map(l => (
                            <div key={l.loc} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-sm font-black text-slate-900">{l.loc}</span>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{l.security}</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-industrial-gray"
                                        style={{ width: `${l.occ}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
