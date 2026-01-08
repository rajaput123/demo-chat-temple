import React, { useState } from 'react';
import { Database, Search, Filter, MoreHorizontal, Plus } from 'lucide-react';
import Modal from '@/components/shared/Modal';
import AssetRelationshipView from './AssetRelationshipView';
import { AssetWithRelationships } from '@/types/assetRelationships';

export default function AssetRegistry() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<AssetWithRelationships | null>(null);
    const [showRelationships, setShowRelationships] = useState<string | null>(null);

    // Mock asset data with relationships
    const mockAssets: AssetWithRelationships[] = [
        {
            id: 'AST-001',
            name: 'Suvarna Kavacha (Main Deity)',
            category: 'sacred-valuable',
            type: 'gold-jewelry',
            lifecycleState: 'lock',
            departmentId: 'DEPT-001',
            custodianId: 'EMP-001',
            currentValue: 25000000,
            acquisitionDate: '2020-01-01',
            acquisitionCost: 20000000,
            createdAt: '2020-01-01',
            updatedAt: '2026-01-06',
            createdBy: 'user1',
            updatedBy: 'user1',
            department: { id: 'DEPT-001', name: 'Ritual Department', code: 'RIT', parentId: null, headEmployeeId: null, isActive: true, createdAt: '', updatedAt: '', createdBy: '', updatedBy: '' },
            custodian: { id: 'EMP-001', name: 'Keshav Bhat', departmentId: 'DEPT-001' },
            activeProjectUsage: null,
            financialRecords: {
                valuationRecords: [{ id: '1', value: 25000000, date: '2026-01-01' }],
                maintenanceExpenses: []
            },
            operationalUsage: null
        }
    ];

    return (
        <div className="animate-fadeIn">
            <div className="grid grid-cols-1 gap-4">
                {/* Search & Filter Bar */}
                <div className="flex gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by Asset ID, Name, or Custodian..."
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium text-sm"
                        />
                    </div>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-6 py-4 bg-industrial-gray text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-industrial-gray/90 transition-all"
                    >
                        <Plus size={18} />
                        <span>Register Asset</span>
                    </button>
                    <button className="px-6 py-4 bg-white border border-slate-100 rounded-2xl text-slate-900 font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all">
                        <Filter size={18} />
                        <span>Filters</span>
                    </button>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-industrial-gray rounded-t-2xl text-[10px] font-black text-white/80 uppercase tracking-[0.2em]">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-3">Asset Name</div>
                    <div className="col-span-2">Classification</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Custodian</div>
                    <div className="col-span-2">Last Audit</div>
                </div>

                {/* Asset Rows */}
                {mockAssets.map((asset) => (
                    <div key={asset.id} className="space-y-0">
                        <div className="grid grid-cols-12 gap-4 px-6 py-5 bg-white border border-slate-100 hover:border-slate-900 transition-all group items-center shadow-sm hover:shadow-md">
                            <div className="col-span-1 text-xs font-mono font-bold text-slate-500">{asset.id}</div>
                            <div className="col-span-3 text-sm font-black text-slate-900">{asset.name}</div>
                            <div className="col-span-2">
                                <span className="px-2 py-1 rounded-md bg-slate-50 text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
                                    {asset.category} / {asset.type}
                                </span>
                            </div>
                            <div className="col-span-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                <span className="text-xs font-bold text-slate-600 capitalize">{asset.lifecycleState}</span>
                            </div>
                            <div className="col-span-2 text-xs font-medium text-slate-700">{asset.custodian?.name || 'Unassigned'}</div>
                            <div className="col-span-1 text-xs font-medium text-slate-500 italic">{asset.department?.name || 'No Dept'}</div>
                            <div className="col-span-1 flex justify-end gap-2">
                                <button
                                    onClick={() => setShowRelationships(showRelationships === asset.id ? null : asset.id)}
                                    className="text-xs font-medium text-cane-green hover:text-cane-green/80"
                                >
                                    {showRelationships === asset.id ? 'Hide' : 'View'} Links
                                </button>
                                <MoreHorizontal className="text-slate-400 group-hover:text-slate-900 cursor-pointer" size={18} />
                            </div>
                        </div>
                        {showRelationships === asset.id && (
                            <div className="px-6 py-4 bg-slate-50 border-x border-b border-slate-100">
                                <AssetRelationshipView asset={asset} />
                            </div>
                        )}
                    </div>
                ))}

                <div className="p-8 border border-dashed border-slate-200 rounded-b-2xl flex flex-col items-center justify-center bg-slate-50/30">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Governance Note</p>
                    <p className="text-slate-600 text-sm max-w-md text-center italic font-medium leading-relaxed">
                        Registry logic is immutable across asset types. The &quot;Suvarna Kavacha&quot; and &quot;Guest House&quot; follow identical lifecycle entry protocols.
                    </p>
                </div>
            </div>

            {/* Register Asset Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Register Asset in Registry"
            >
                <form className="space-y-4">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-800 font-medium">
                            Asset must be in &apos;get&apos; state (Acquired) before registration. Registration moves asset to &apos;write&apos; state.
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                            Asset Name *
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-1">
                                Category *
                            </label>
                            <select className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green">
                                <option value="physical-general">Physical - General</option>
                                <option value="sacred-valuable">Sacred & Valuable</option>
                                <option value="property">Property</option>
                                <option value="knowledge">Knowledge</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-900 mb-1">
                                Department *
                            </label>
                            <select className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green">
                                <option value="">Select Department</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-industrial-gray text-white rounded-lg text-sm font-medium hover:bg-industrial-gray/90 transition-all"
                        >
                            Register Asset
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(false)}
                            className="px-4 py-2 border border-neutral-200 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
