import React, { useState } from 'react';
import { Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Modal from '@/components/shared/Modal';

export default function AssetDisposal() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Retirement & Disposal</h2>
                    <p className="text-sm text-slate-600 font-medium">Governance-approved decommissioning and recycling</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-industrial-gray text-white rounded-xl text-sm font-bold hover:bg-industrial-gray/90 transition-all"
                >
                    <Trash2 size={18} />
                    <span>Initiate Disposal</span>
                </button>
            </div>

            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">
                <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="text-slate-400" size={20} />
                    <h3 className="text-sm font-black text-slate-900">Disposal Protocol</h3>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                    Asset disposal requires dual approval from Asset Governance and Finance module. 
                    Disposal value will be recorded in Finance module (read-only link).
                </p>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <CheckCircle2 size={12} />
                        <span>Requires Trustee Board approval for sacred assets</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <CheckCircle2 size={12} />
                        <span>Finance module records disposal value (immutable after audit)</span>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Initiate Asset Disposal"
                size="md"
            >
                <form className="space-y-4">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs text-red-800 font-medium">
                            Warning: Disposal moves asset to &apos;close&apos; state. This action requires approval.
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                            Select Asset *
                        </label>
                        <select className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green">
                            <option value="">Select Asset</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                            Disposal Reason *
                        </label>
                        <select className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green">
                            <option value="damaged">Damaged Beyond Repair</option>
                            <option value="obsolete">Obsolete</option>
                            <option value="sold">Sold</option>
                            <option value="donated">Donated</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                            Disposal Value
                        </label>
                        <input
                            type="number"
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                            placeholder="Will be linked to Finance module"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                            Notes
                        </label>
                        <textarea
                            rows={3}
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-industrial-gray text-white rounded-lg text-sm font-medium hover:bg-industrial-gray/90 transition-all"
                        >
                            Request Disposal Approval
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
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

