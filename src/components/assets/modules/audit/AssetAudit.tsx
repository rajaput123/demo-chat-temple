import React, { useState } from 'react';
import { Search, CheckCircle2, AlertCircle } from 'lucide-react';
import Modal from '@/components/shared/Modal';

export default function AssetAudit() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Audit & Verification</h2>
                    <p className="text-sm text-slate-600 font-medium">Periodic physical verification and discrepancy resolution</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-industrial-gray text-white rounded-xl text-sm font-bold hover:bg-industrial-gray/90 transition-all"
                >
                    <Search size={18} />
                    <span>Conduct Audit</span>
                </button>
            </div>

            <div className="space-y-3">
                {[
                    { asset: 'Suvarna Kavacha', date: 'Jan 1, 2026', status: 'Verified', auditor: 'Trustee A' },
                    { asset: 'Temple Guest House', date: 'Dec 15, 2025', status: 'Discrepancy', auditor: 'Estate Mgr' },
                ].map((audit, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-black text-slate-900">{audit.asset}</p>
                                <p className="text-xs text-slate-500 mt-1">Audited: {audit.date} by {audit.auditor}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {audit.status === 'Verified' ? (
                                    <CheckCircle2 className="text-green-600" size={20} />
                                ) : (
                                    <AlertCircle className="text-red-600" size={20} />
                                )}
                                <span className={`text-xs font-bold uppercase ${audit.status === 'Verified' ? 'text-green-600' : 'text-red-600'}`}>
                                    {audit.status}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Conduct Asset Audit"
            >
                <form className="space-y-4">
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
                            Condition *
                        </label>
                        <select className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green">
                            <option value="excellent">Excellent</option>
                            <option value="good">Good</option>
                            <option value="fair">Fair</option>
                            <option value="poor">Poor</option>
                            <option value="damaged">Damaged</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                            Verification Status *
                        </label>
                        <select className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green">
                            <option value="verified">Verified</option>
                            <option value="discrepancy">Discrepancy Found</option>
                            <option value="missing">Missing</option>
                        </select>
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
                            Record Audit
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

