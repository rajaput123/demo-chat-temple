"use client";

import React, { useState } from 'react';
import { X, Phone, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginFormProps {
    onClose: () => void;
    onLoginSuccess: () => void;
}

export default function LoginForm({ onClose, onLoginSuccess }: LoginFormProps) {
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (mobile.length !== 10) {
            alert('Please enter a valid 10-digit mobile number');
            return;
        }
        if (password.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        // Simulate login
        setTimeout(() => {
            setIsLoading(false);
            onLoginSuccess();
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-industrial-gray/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors z-10"
                >
                    <X size={18} />
                </button>

                {/* Header */}
                <div className="bg-gradient-to-br from-industrial-gray to-slate-900 px-8 py-10 text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck size={32} className="text-cane-green" />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Terminal Access</h2>
                    <p className="text-slate-400 text-sm">Authorized personnel only</p>
                </div>

                {/* Form Content */}
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="mobile" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                                Operator ID / Mobile
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                                    <Phone size={18} />
                                </div>
                                <input
                                    id="mobile"
                                    type="tel"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    placeholder="Enter 10-digit mobile number"
                                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:border-cane-green focus:outline-none text-slate-900 font-medium transition-colors"
                                    required
                                    maxLength={10}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                                Secure Key
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your security key"
                                    className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl focus:border-cane-green focus:outline-none text-slate-900 font-medium transition-colors"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || mobile.length !== 10 || password.length < 6}
                            className="w-full py-4 bg-cane-green text-white font-black rounded-xl hover:bg-green-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 shadow-lg shadow-cane-green/20"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                <>
                                    <span>Access Dashboard</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
                <div className="p-6 bg-soft-white border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-500 font-medium">System Version: v2.4.8-industrial-release</p>
                </div>
            </div>
        </div>
    );
}

