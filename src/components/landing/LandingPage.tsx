"use client";

import React, { useState, useEffect } from 'react';
import {
    ArrowRight,
    Factory,
    Truck,
    Microscope,
    Database,
    Users,
    ShieldCheck,
    Zap,
    ChevronRight,
    BarChart3,
    Calendar,
    Settings,
    ClipboardCheck,
    Cpu,
    Activity,
    Info
} from 'lucide-react';
import LoginForm from './LoginForm';

interface LandingPageProps {
    onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
    const [showLogin, setShowLogin] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const FeatureCard = ({ icon: Icon, title, description, delay = "0s" }: { icon: any, title: string, description: string, delay?: string }) => (
        <div
            className="flex flex-col p-8 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
            style={{ animation: `slideUpFade 0.8s ease-out forwards ${delay}`, opacity: 0 }}
        >
            <div className="w-12 h-12 rounded-xl bg-cane-green/10 flex items-center justify-center mb-6 border border-cane-green/20 group-hover:scale-110 transition-transform">
                <Icon className="text-cane-green" size={24} />
            </div>
            <h3 className="text-xl font-bold text-industrial-gray mb-3">{title}</h3>
            <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
        </div>
    );

    const ModuleItem = ({ icon: Icon, title }: { icon: any, title: string }) => (
        <div className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl hover:border-cane-green/30 transition-shadow shadow-sm hover:shadow-md">
            <div className="w-10 h-10 rounded-lg bg-cane-green/5 flex items-center justify-center border border-cane-green/10">
                <Icon size={18} className="text-cane-green" />
            </div>
            <span className="font-bold text-industrial-gray">{title}</span>
        </div>
    );

    return (
        <div className="min-h-screen w-full bg-soft-white text-industrial-gray selection:bg-cane-green/20 overflow-x-hidden font-sans">
            <main className="relative">
                {/* Hero Section - Redesigned for High Impact */}
                <section className="relative min-h-screen flex items-center pt-24 pb-20 bg-industrial-gray overflow-hidden">
                    {/* Background Visual Elements */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/images/landing/hero-v1.png"
                            alt="Sugar Factory Industrial"
                            className="w-full h-full object-cover opacity-20"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-industrial-gray via-industrial-gray/80 to-transparent" />
                        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-cane-green/10 to-transparent" />
                        <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-gradient-to-tr from-cane-green/5 to-transparent" />
                    </div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                            {/* Left Content Column */}
                            <div className="lg:col-span-7">
                                <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-[0.2em] mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                                    <div className="w-2 h-2 rounded-full bg-harvest-yellow animate-pulse" />
                                    <span>Next-Gen Factory OS v3.0</span>
                                </div>

                                <h1 className={`text-6xl md:text-7xl xl:text-8xl font-black text-white mb-8 leading-[0.95] tracking-tighter transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                                    Command Your <br />
                                    <span className="text-cane-green">Digital Factory</span>
                                </h1>

                                <p className={`text-xl md:text-2xl text-gray-400 max-w-2xl mb-12 font-medium leading-relaxed transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                                    The ultimate industrial dashboard for sugarcane operations. AI-driven procurement, real-time crushing analytics, and integrated logistics control in one unified terminal.
                                </p>

                                <div className={`flex flex-wrap items-center gap-6 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                                    <button
                                        onClick={onGetStarted}
                                        className="group px-12 py-6 bg-cane-green text-white font-black rounded-2xl flex items-center gap-4 transition-all hover:bg-green-700 shadow-2xl shadow-cane-green/40 hover:-translate-y-1 active:scale-95"
                                    >
                                        Launch Terminal <ArrowRight size={24} className="transition-transform group-hover:translate-x-2" />
                                    </button>
                                    <button
                                        onClick={() => setShowLogin(true)}
                                        className="px-12 py-6 bg-white/5 border-2 border-white/10 text-white font-black rounded-2xl transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
                                    >
                                        Admin Secure Login
                                    </button>
                                </div>

                                <div className={`mt-16 pt-8 border-t border-white/5 grid grid-cols-3 gap-8 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                                    {[
                                        { label: 'Factory Efficiency', val: '+24%' },
                                        { label: 'Waste Reduction', val: '-18%' },
                                        { label: 'Settlement Speed', val: '2.5x' }
                                    ].map((stat, i) => (
                                        <div key={i}>
                                            <div className="text-2xl font-black text-white mb-1">{stat.val}</div>
                                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Visual Column */}
                            <div className="lg:col-span-5 relative group">
                                <div className={`relative aspect-square lg:aspect-[4/5] xl:aspect-square rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_80px_-20px_rgba(46,125,50,0.4)] transition-all duration-1000 delay-300 ${isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                                    <img
                                        src="/images/landing/terminal.png"
                                        alt="Factory Control Center"
                                        className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-industrial-gray via-transparent to-transparent flex items-end p-8">
                                        <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl w-full">
                                            <div className="flex items-center gap-3 mb-3">
                                                <Zap className="text-harvest-yellow" size={18} />
                                                <span className="text-xs font-black text-white uppercase tracking-widest">Real-time Feed</span>
                                            </div>
                                            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-cane-green w-2/3 animate-[shimmer_2s_infinite]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Floating decorative element */}
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-cane-green/20 rounded-full blur-[80px] -z-10 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Platform Overview */}
                <section className="py-24 bg-white relative">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                            <div className="max-w-xl">
                                <h2 className="text-4xl font-black text-industrial-gray mb-4">Core Operating Modules</h2>
                                <p className="text-gray-600 font-medium">Integrated digital ecosystem designed for the specific complexities of the sugar industry.</p>
                            </div>
                            <div className="hidden lg:block shrink-0 w-32 h-1 bg-cane-green/20 rounded-full" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                            <FeatureCard
                                icon={Activity}
                                title="Crushing Analytics"
                                description="Monitor TCD and recovery rates in real-time with granular shift-wise reporting."
                                delay="0.1s"
                            />
                            <FeatureCard
                                icon={Settings}
                                title="Procurement Hub"
                                description="Automated weighbridge sync and gate-pass management for seamless intake."
                                delay="0.2s"
                            />
                            <FeatureCard
                                icon={BarChart3}
                                title="Supply Chain"
                                description="End-to-end tracking of sugarcane volume from harvester to yard."
                                delay="0.3s"
                            />
                            <FeatureCard
                                icon={ClipboardCheck}
                                title="Settlement"
                                description="Rapid, compliant farmer payments with automated direct bank transfer."
                                delay="0.4s"
                            />
                            <FeatureCard
                                icon={Truck}
                                title="Logistics"
                                description="GPS-enabled fleet management for optimized cane transport flow."
                                delay="0.5s"
                            />
                        </div>
                    </div>
                </section>

                {/* AI & Planner Section */}
                <section className="py-32 bg-soft-white overflow-hidden">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <div className="relative">
                                <div className="absolute -top-10 -left-10 w-40 h-40 bg-cane-green/5 rounded-full blur-3xl" />
                                <h2 className="text-4xl md:text-5xl font-black text-industrial-gray mb-8 leading-tight">Predictive Yard <br /> Management</h2>
                                <div className="space-y-10 relative z-10">
                                    <div className="flex gap-6 group">
                                        <div className="shrink-0 w-14 h-14 rounded-2xl bg-industrial-gray text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                                            <Database size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black mb-2">AI-Sourced Facts</h3>
                                            <p className="text-gray-600 leading-relaxed font-medium">System processes millions of data points from sensors to provide unified procurement facts.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 group">
                                        <div className="shrink-0 w-14 h-14 rounded-2xl bg-cane-green text-white flex items-center justify-center shadow-lg shadow-cane-green/20 transition-transform group-hover:scale-110">
                                            <Zap size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black mb-2">Next-Action Planner</h3>
                                            <p className="text-gray-600 leading-relaxed font-medium">Predictive modeling generates a rolling 72-hour operational roadmap to prevent bottlenecks.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative group">
                                {/* Dashboard Card */}
                                <div className="absolute inset-0 bg-cane-green/5 rounded-[2.5rem] rotate-3 scale-105 transition-transform group-hover:rotate-1" />
                                <div className="relative bg-white p-10 rounded-[2.5rem] border border-gray-200 shadow-2xl">
                                    <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-8">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-2 h-2 rounded-full bg-cane-green animate-pulse" />
                                                <h4 className="font-black text-xl tracking-tight">System Pulse</h4>
                                            </div>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Zone: North Mill (SF-04)</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="px-4 py-1.5 bg-cane-green text-white text-[10px] font-black rounded-lg tracking-widest uppercase">Live Stream</span>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="p-6 bg-soft-white rounded-2xl border-l-4 border-cane-green flex justify-between items-center group/card">
                                            <div>
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Crushing Rate</span>
                                                <div className="text-3xl font-black text-industrial-gray">5,500 <span className="text-sm font-bold text-gray-400">TCD</span></div>
                                            </div>
                                            <div className="px-3 py-1 rounded-full bg-cane-green/10 text-cane-green text-[10px] font-black border border-cane-green/20 group-hover/card:scale-110 transition-transform">OPTIMAL</div>
                                        </div>

                                        <div className="p-6 bg-soft-white rounded-2xl border-l-4 border-risk-red flex justify-between items-center group/card">
                                            <div>
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Yard Congestion</span>
                                                <div className="text-3xl font-black text-industrial-gray">1,200 <span className="text-sm font-bold text-gray-400">Tons</span></div>
                                            </div>
                                            <div className="px-3 py-1 rounded-full bg-risk-red/10 text-risk-red text-[10px] font-black border border-risk-red/20 group-hover/card:scale-110 transition-transform uppercase">Critical</div>
                                        </div>

                                        <div className="mt-8 pt-8 border-t border-gray-100">
                                            <div className="flex items-center gap-2 mb-6">
                                                <Info size={16} className="text-cane-green" />
                                                <span className="font-black text-xs uppercase tracking-widest text-industrial-gray">AI Recommendation</span>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-start gap-4 p-4 bg-industrial-gray rounded-xl text-white shadow-lg transition-transform hover:scale-[1.02]">
                                                    <div className="shrink-0 w-6 h-6 rounded bg-harvest-yellow text-industrial-gray flex items-center justify-center font-black text-[10px]">!</div>
                                                    <p className="text-xs leading-relaxed"><span className="font-black text-harvest-yellow uppercase border-b border-harvest-yellow/30 pb-0.5">High Priority:</span> Divert 20 trucks from Sector 4 to Gate B to reduce yard wait time.</p>
                                                </div>
                                                <div className="flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-xl text-industrial-gray shadow-sm group-hover:border-cane-green/20 transition-colors">
                                                    <div className="shrink-0 w-6 h-6 rounded bg-cane-green text-white flex items-center justify-center font-black text-[10px]">2</div>
                                                    <p className="text-xs leading-relaxed font-bold">Projected 15% rain risk in North Zone; accelerate harvest in Sector 8.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Logistics Image Section */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="rounded-[3rem] overflow-hidden relative shadow-2xl group">
                            <img
                                src="/images/landing/logistics.png"
                                alt="Sugarcane Logistics"
                                className="w-full h-[400px] md:h-[600px] object-cover group-hover:scale-105 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-industrial-gray/90 via-industrial-gray/40 to-transparent flex items-center">
                                <div className="max-w-md ml-12 md:ml-24 text-white">
                                    <h3 className="text-4xl font-black mb-6 leading-tight">Optimized Fleet <br /> Management</h3>
                                    <p className="text-gray-300 font-medium mb-8">Reduce empty running and maximize vehicle utilization with automated fleet scheduling.</p>
                                    <ul className="space-y-4">
                                        {[
                                            "Real-time GPS Tracking",
                                            "Load Factor Optimization",
                                            "Automated Weighbridge Sync"
                                        ].map(item => (
                                            <li key={item} className="flex items-center gap-3 font-bold text-sm">
                                                <div className="w-5 h-5 rounded-full bg-cane-green flex items-center justify-center">
                                                    <ChevronRight size={12} />
                                                </div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Operational Workflow */}
                <section className="py-32 bg-industrial-gray text-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-5xl font-black mb-6">Digital Ecosystem Flow</h2>
                            <p className="text-gray-400 font-medium max-w-2xl mx-auto">From field data collection to factory floor execution in four integrated steps.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">
                            {[
                                { step: "01", title: "Data Sources", desc: "IoT sensors and mobile field apps stream raw data into the cloud." },
                                { step: "02", title: "AI Fact Check", desc: "Synthesizes data into verifiable procurement and production facts." },
                                { step: "03", title: "Sync Planning", desc: "Generates optimal operational tasks for the next 72 hours." },
                                { step: "04", title: "Execution", desc: "Command center pushes tasks to field and factory teams." }
                            ].map((item, i) => (
                                <div key={i} className="group">
                                    <div className="text-6xl font-black text-white/5 mb-6 transition-colors group-hover:text-cane-green/20">{item.step}</div>
                                    <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed font-medium">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Who it is For */}
                <section className="py-24 bg-white overflow-hidden">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col lg:flex-row gap-16 items-center">
                            <div className="lg:w-1/3">
                                <h2 className="text-3xl font-black mb-6">Designed for Stakeholders</h2>
                                <p className="text-gray-500 mb-8">Role-based interfaces ensure the right people have the right data at the right time.</p>
                                <div className="space-y-4">
                                    {['Factory Admin', 'Cane Department', 'Operations Head', 'Finance & Compliance'].map(role => (
                                        <div key={role} className="flex items-center gap-3 font-bold text-industrial-gray">
                                            <div className="w-2 h-2 rounded-full bg-cane-green" />
                                            {role}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="lg:w-2/3 grid grid-cols-2 gap-6">
                                <div className="p-8 bg-cane-green text-white rounded-[2rem]">
                                    <h4 className="text-4xl font-black mb-2">100%</h4>
                                    <p className="text-white/70 font-bold uppercase tracking-widest text-xs">Efficiency Potential</p>
                                </div>
                                <div className="p-8 bg-harvest-yellow text-industrial-gray rounded-[2rem]">
                                    <h4 className="text-4xl font-black mb-2">24/7</h4>
                                    <p className="text-industrial-gray/70 font-bold uppercase tracking-widest text-xs">AI Monitoring</p>
                                </div>
                                <div className="p-8 bg-soft-white border border-gray-100 rounded-[2rem] col-span-2">
                                    <h3 className="text-xl font-black mb-4">Strategic Outcomes</h3>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                        <li className="flex items-center gap-2">
                                            <div className="shrink-0 w-5 h-5 rounded-full bg-cane-green/10 flex items-center justify-center">
                                                <ChevronRight size={12} className="text-cane-green" />
                                            </div>
                                            Prevent cane shortfall
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="shrink-0 w-5 h-5 rounded-full bg-cane-green/10 flex items-center justify-center">
                                                <ChevronRight size={12} className="text-cane-green" />
                                            </div>
                                            Improve sugar recovery
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="shrink-0 w-5 h-5 rounded-full bg-cane-green/10 flex items-center justify-center">
                                                <ChevronRight size={12} className="text-cane-green" />
                                            </div>
                                            Reduce payment delays
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="shrink-0 w-5 h-5 rounded-full bg-cane-green/10 flex items-center justify-center">
                                                <ChevronRight size={12} className="text-cane-green" />
                                            </div>
                                            Data-driven decisions
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-soft-white">
                    <div className="container mx-auto px-6">
                        <div className="bg-cane-green rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-1/4" />
                            <div className="relative z-10">
                                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">Ready to Digitalize Your <br /> Factory Operations?</h2>
                                <p className="text-white/80 max-w-2xl mx-auto mb-12 text-lg font-medium leading-relaxed">Join the leading mills using our AI platform to achieve higher recovery rates and streamlined farmer relations.</p>
                                <div className="flex flex-wrap justify-center gap-6">
                                    <button
                                        onClick={onGetStarted}
                                        className="px-12 py-5 bg-white text-cane-green font-black rounded-xl hover:bg-gray-100 transition-all flex items-center gap-3 shadow-2xl shadow-black/20"
                                    >
                                        Request Platform Demo <ChevronRight size={24} />
                                    </button>
                                    <button className="px-12 py-5 bg-transparent border-2 border-white/20 text-white font-black rounded-xl hover:bg-white/5 transition-colors">
                                        Talk to an Expert
                                    </button>
                                </div>
                            </div>
                        </div>

                        <footer className="mt-24 pt-16 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-12">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-industrial-gray flex items-center justify-center font-black text-white text-xl shadow-lg border-b-4 border-cane-green">S</div>
                                <div>
                                    <span className="text-xl font-black tracking-tight text-industrial-gray uppercase block leading-none mb-1">SugarFlow</span>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block leading-none">Industrial Systems</span>
                                </div>
                            </div>
                            <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                                © 2026 SugarFlow Digital Platforms. All rights reserved.
                            </div>
                            <div className="flex gap-10">
                                {['Privacy', 'Security', 'Compliance'].map(item => (
                                    <a key={item} href="#" className="text-xs font-bold text-gray-400 hover:text-cane-green transition-colors uppercase tracking-[0.2em]">{item}</a>
                                ))}
                            </div>
                        </footer>
                    </div>
                </section>
            </main>

            {/* Login Modal */}
            {showLogin && (
                <LoginForm
                    onClose={() => setShowLogin(false)}
                    onLoginSuccess={onGetStarted}
                />
            )}
        </div>
    );
}
