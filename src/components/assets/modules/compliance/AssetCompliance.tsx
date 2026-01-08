import React, { useState } from 'react';
import { FileText, Shield, CheckCircle2 } from 'lucide-react';
import Modal from '@/components/shared/Modal';

export default function AssetCompliance() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Compliance & Legal</h2>
                    <p className="text-sm text-slate-600 font-medium">Deeds, legal status, and 80G tax benefit management</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-industrial-gray text-white rounded-xl text-sm font-bold hover:bg-industrial-gray/90 transition-all"
                >
                    <FileText size={18} />
                    <span>Add Legal Document</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    { asset: 'Temple Land', type: 'Deed', status: 'Valid', expiry: 'N/A' },
                    { asset: 'Gold Jewelry', type: '80G Certificate', status: 'Active', expiry: 'Dec 2026' },
                ].map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-white">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-black text-slate-900">{item.asset}</h3>
                            <CheckCircle2 className="text-green-600" size={16} />
                        </div>
                        <p className="text-xs text-slate-500 mb-1">{item.type}</p>
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-slate-600">{item.status}</span>
                            <span className="text-slate-500">Expiry: {item.expiry}</span>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add Legal Document"
                size="md"
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
                            Document Type *
                        </label>
                        <select className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green">
                            <option value="deed">Deed</option>
                            <option value="80g">80G Certificate</option>
                            <option value="title">Title Document</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-900 mb-1">
                            Upload Document
                        </label>
                        <input
                            type="file"
                            className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cane-green"
                        />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-industrial-gray text-white rounded-lg text-sm font-medium hover:bg-industrial-gray/90 transition-all"
                        >
                            Add Document
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

