import React, { useState, useRef, useEffect } from 'react';
import {
    Home,
    LayoutGrid,
    Package,
    DollarSign,
    Users,
    ChevronDown,
    Gift,
    Zap,
    Mail,
    Plus,
    Workflow,
    Building2,
    LogOut,
    ArrowLeft,
    ChevronUp
} from 'lucide-react';

interface LeftPaneProps {
    isCollapsed: boolean;
    onToggle: () => void;
    onNewChat: () => void;
    activeModule: string;
    onSelectModule: (module: string) => void;
    onLogout?: () => void;
    onBackToLanding?: () => void;
}

// Nav Item Component
const NavItem = ({
    icon: Icon,
    label,
    collapsed,
    active,
    onClick,
    hasChevron = false
}: {
    icon: React.ElementType;
    label: string;
    collapsed: boolean;
    active?: boolean;
    onClick?: () => void;
    hasChevron?: boolean;
}) => (
    <div
        onClick={onClick}
        className={`h-10 flex items-center rounded-lg cursor-pointer transition-all duration-200 group relative ${collapsed
            ? 'justify-center w-10 mx-auto'
            : 'gap-3 px-3 mx-2'
            } ${active
                ? 'bg-cane-green/10 text-cane-green font-bold'
                : 'text-industrial-gray/70 hover:bg-soft-white hover:text-industrial-gray'
            }`}
    >
        <Icon size={20} className="shrink-0" />
        {!collapsed && (
            <>
                <span className="text-sm font-semibold whitespace-nowrap flex-1">{label}</span>
                {hasChevron && <ChevronDown size={16} className="shrink-0" />}
            </>
        )}
        {/* Tooltip for collapsed state */}
        {collapsed && (
            <div className="absolute left-full ml-3 z-50 px-2 py-1 bg-industrial-gray text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg border border-white/10">
                {label}
                <div className="absolute top-1/2 -left-1 -mt-1 border-4 border-transparent border-r-industrial-gray"></div>
            </div>
        )}
    </div>
);

export default function LeftPane({ isCollapsed, onToggle, onNewChat, activeModule, onSelectModule, onLogout, onBackToLanding }: LeftPaneProps) {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }
        };

        if (showProfileMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showProfileMenu]);

    // Get sub-modules based on active module - UPDATED FOR SUGAR FACTORY
    const getSubModules = () => {
        switch (activeModule) {
            case 'Assets':
                return [
                    'Machinery Registry',
                    'Inventory & Spares',
                    'Fleet Management',
                    'Maintenance Logs',
                    'Depreciation Tracking'
                ];
            case 'Operations':
                return [
                    'Cane Yard Management',
                    'Crushing Optimization',
                    'Quality Control Lab',
                    'Logistics Control',
                    'Gate Management'
                ];
            case 'People':
                return [
                    'Farmer Management',
                    'Staff Directory',
                    'Shift Scheduling',
                    'Contractor Management',
                    'Worker Compliance'
                ];
            case 'Finance':
                return [
                    'Farmer Payments',
                    'Vendor Invoices',
                    'Operational Budget',
                    'Regulatory Filing'
                ];
            case 'Projects':
                return [
                    'Factory Upgrade 2026',
                    'Ethanol Plant Expansion',
                    'Renewable Energy Grid'
                ];
            default:
                return [];
        }
    };

    const subModules = getSubModules();

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200 relative overflow-hidden shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)]">
            {/* Header - Fixed at top */}
            <div className={`flex items-center relative shrink-0 group ${isCollapsed ? 'justify-center py-6' : 'justify-between px-6 py-6'}`}>
                {!isCollapsed && (
                    <div className="flex items-center gap-3">
                        {/* Logo with gradient */}
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cane-green to-green-800 flex items-center justify-center shadow-lg shadow-cane-green/20">
                            <span className="text-white font-black text-sm">S</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-lg text-industrial-gray leading-none">SugarOS</span>
                            <span className="text-[10px] font-bold text-cane-green uppercase tracking-widest mt-1">Terminal</span>
                        </div>
                    </div>
                )}
                {isCollapsed && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cane-green to-green-800 flex items-center justify-center shadow-lg shadow-cane-green/20">
                        <span className="text-white font-black text-sm">S</span>
                    </div>
                )}
                <button
                    onClick={onToggle}
                    className={`p-2 rounded-lg hover:bg-soft-white text-gray-400 hover:text-industrial-gray transition-all ${isCollapsed
                        ? 'absolute top-6 right-2 opacity-0 group-hover:opacity-100'
                        : ''
                        }`}
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="9" y1="3" x2="9" y2="21"></line>
                            <line x1="14" y1="8" x2="18" y2="12"></line>
                            <line x1="14" y1="16" x2="18" y2="12"></line>
                        </svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="9" y1="3" x2="9" y2="21"></line>
                            <line x1="14" y1="12" x2="18" y2="12"></line>
                        </svg>
                    )}
                </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-2">
                {/* New Analysis Button */}
                <div className={`${isCollapsed ? 'px-2 mb-6' : 'px-4 mb-6'}`}>
                    <button
                        onClick={onNewChat}
                        className={`h-11 flex items-center rounded-xl cursor-pointer transition-all duration-200 group relative shadow-sm border border-gray-100 hover:shadow-md ${isCollapsed
                            ? 'justify-center w-11 mx-auto bg-white text-industrial-gray hover:border-cane-green/30'
                            : 'w-full gap-3 px-4 bg-white text-industrial-gray hover:border-cane-green/30 px-3 mx-2'
                            }`}
                    >
                        <Plus size={20} className="shrink-0 text-cane-green" />
                        {!isCollapsed && <span className="text-sm font-bold">New Operation</span>}
                        {/* Tooltip for collapsed state */}
                        {isCollapsed && (
                            <div className="absolute left-full ml-3 z-50 px-2 py-1 bg-industrial-gray text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg border border-white/10">
                                New Operation
                                <div className="absolute top-1/2 -left-1 -mt-1 border-4 border-transparent border-r-industrial-gray"></div>
                            </div>
                        )}
                    </button>
                </div>

                {/* Modules Navigation */}
                {!isCollapsed && (
                    <div className="px-6 mb-3">
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Management Modules</div>
                    </div>
                )}
                <div className={`flex flex-col gap-1 ${isCollapsed ? 'px-2' : 'px-2'}`}>
                    <NavItem
                        icon={Home}
                        label="Command Center"
                        collapsed={isCollapsed}
                        active={activeModule === 'Dashboard'}
                        onClick={() => onSelectModule('Dashboard')}
                    />
                    <NavItem
                        icon={Workflow}
                        label="Gate & Crushing"
                        collapsed={isCollapsed}
                        active={activeModule === 'Operations'}
                        onClick={() => onSelectModule('Operations')}
                    />
                    <NavItem
                        icon={Users}
                        label="Farmer Relations"
                        collapsed={isCollapsed}
                        active={activeModule === 'People'}
                        onClick={() => onSelectModule('People')}
                    />
                    <NavItem
                        icon={DollarSign}
                        label="Financial Hub"
                        collapsed={isCollapsed}
                        active={activeModule === 'Finance'}
                        onClick={() => onSelectModule('Finance')}
                    />
                    <NavItem
                        icon={Package}
                        label="Logistics & Fleet"
                        collapsed={isCollapsed}
                        active={activeModule === 'Assets'}
                        onClick={() => onSelectModule('Assets')}
                    />
                    <NavItem
                        icon={LayoutGrid}
                        label="Strategic Projects"
                        collapsed={isCollapsed}
                        active={activeModule === 'Projects'}
                        onClick={() => onSelectModule('Projects')}
                    />
                </div>

                {/* Recent Chats Section */}
                {!isCollapsed && (
                    <div className="px-4 mt-6 mb-4">
                        <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Recent</div>
                        <div className="flex flex-col gap-1">
                            {[
                                'Onboarding Workflow',
                                'Q4 Financial Review',
                                'Asset Allocation',
                                'Team Structure',
                                'Project Alpha'
                            ].map((chat, i) => (
                                <div
                                    key={i}
                                    onClick={() => onSelectModule(chat)}
                                    className={`px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors truncate ${activeModule === chat
                                        ? 'bg-neutral-100 text-neutral-900 font-medium'
                                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                                        }`}
                                >
                                    {chat}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Promotional Cards - Only when expanded */}

            </div>

            {/* Bottom Section - Fixed at bottom */}
            <div className="shrink-0 border-t border-gray-100 relative bg-white" ref={profileMenuRef}>
                {isCollapsed ? (
                    <div className="flex flex-col items-center gap-4 py-6 relative">
                        {/* User Avatar - Collapsed */}
                        <div
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="w-10 h-10 rounded-xl bg-industrial-gray flex items-center justify-center cursor-pointer hover:bg-industrial-gray/90 transition-all shadow-md relative z-10"
                        >
                            <span className="text-white font-black text-sm">ADM</span>
                        </div>
                        {/* Profile Menu - Collapsed */}
                        {showProfileMenu && (
                            <div className="absolute bottom-6 left-full ml-4 w-72 bg-white border border-gray-200 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] z-[100] overflow-hidden animate-fadeIn flex flex-col max-h-[80vh]">
                                {/* Menu Header */}
                                <div className="px-5 py-4 bg-industrial-gray border-b border-gray-800 shrink-0">
                                    <div className="text-[11px] font-black text-white/50 uppercase tracking-[0.15em] mb-1">Authorization level</div>
                                    <div className="text-sm font-black text-white">System Administrator</div>
                                </div>

                                {/* Sub-Modules Section - Scrollable */}
                                {subModules.length > 0 && (
                                    <>
                                        <div className="px-5 py-3 bg-soft-white border-b border-gray-100 shrink-0">
                                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Module Controls</div>
                                        </div>
                                        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent min-h-0">
                                            {subModules.map((subModule, idx) => (
                                                <div
                                                    key={idx}
                                                    className="px-5 py-3 text-xs font-bold text-industrial-gray hover:bg-soft-white cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors flex items-center justify-between"
                                                >
                                                    {subModule}
                                                    <div className="w-1 h-1 rounded-full bg-cane-green opacity-0 group-hover:opacity-100" />
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* Navigation Options - Fixed at bottom */}
                                <div className="p-3 bg-soft-white">
                                    {onBackToLanding && (
                                        <div
                                            onClick={() => {
                                                setShowProfileMenu(false);
                                                onBackToLanding();
                                            }}
                                            className="px-3 py-2.5 text-xs font-bold text-industrial-gray hover:bg-white rounded-lg cursor-pointer flex items-center gap-3 transition-all border border-transparent hover:border-gray-100"
                                        >
                                            <ArrowLeft size={16} className="text-cane-green" />
                                            <span>Exit to Landing Page</span>
                                        </div>
                                    )}
                                    {onLogout && (
                                        <div
                                            onClick={() => {
                                                setShowProfileMenu(false);
                                                onLogout();
                                            }}
                                            className="px-3 py-2.5 text-xs font-bold text-risk-red hover:bg-red-50 rounded-lg cursor-pointer flex items-center gap-3 mt-1 transition-all"
                                        >
                                            <LogOut size={16} />
                                            <span>Terminate Session</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-4">
                        <div
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-3 cursor-pointer hover:bg-soft-white rounded-xl p-3 transition-all border border-transparent hover:border-gray-100"
                        >
                            <div className="w-10 h-10 rounded-xl bg-industrial-gray flex items-center justify-center shadow-md shrink-0">
                                <span className="text-white font-black text-xs">A</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-black text-industrial-gray truncate">Factory Admin</div>
                                <div className="text-[10px] font-bold text-cane-green truncate">sugar-os.cloud/terminal</div>
                            </div>
                            <ChevronUp
                                size={16}
                                className={`text-gray-400 transition-transform shrink-0 ${showProfileMenu ? 'rotate-180' : ''}`}
                            />
                        </div>
                        {/* Profile Menu - Expanded */}
                        {showProfileMenu && (
                            <div className="mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-fadeIn">
                                {subModules.length > 0 && (
                                    <>
                                        <div className="px-4 py-2.5 bg-soft-white border-b border-gray-100">
                                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Controls</div>
                                        </div>
                                        <div className="max-h-56 overflow-y-auto">
                                            {subModules.map((subModule, idx) => (
                                                <div
                                                    key={idx}
                                                    className="px-4 py-3 text-xs font-bold text-industrial-gray hover:bg-soft-white cursor-pointer border-b border-gray-50 last:border-b-0 flex items-center justify-between"
                                                >
                                                    {subModule}
                                                    <div className="w-1 h-1 rounded-full bg-cane-green" />
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                                <div className="p-2 bg-soft-white border-t border-gray-100">
                                    {onBackToLanding && (
                                        <div
                                            onClick={() => {
                                                setShowProfileMenu(false);
                                                onBackToLanding();
                                            }}
                                            className="px-3 py-2.5 text-xs font-bold text-industrial-gray hover:bg-white rounded-lg cursor-pointer flex items-center gap-3 transition-all"
                                        >
                                            <ArrowLeft size={16} className="text-cane-green" />
                                            <span>Landing Page</span>
                                        </div>
                                    )}
                                    {onLogout && (
                                        <div
                                            onClick={() => {
                                                setShowProfileMenu(false);
                                                onLogout();
                                            }}
                                            className="px-3 py-2.5 text-xs font-bold text-risk-red hover:bg-red-50 rounded-lg cursor-pointer flex items-center gap-3 transition-all"
                                        >
                                            <LogOut size={16} />
                                            <span>Logout</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
