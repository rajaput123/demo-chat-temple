"use client";

import React, { ReactNode } from 'react';
import { MessageSquare } from 'lucide-react';

interface ThreePaneLayoutProps {
  left: ReactNode;
  children: ReactNode;
  right: ReactNode;
  isLeftCollapsed: boolean;
  isRightCollapsed: boolean;
  isRightMaximized: boolean;
  onRightPaneToggle: () => void;
}

export default function ThreePaneLayout({
  left,
  children,
  right,
  isLeftCollapsed,
  isRightCollapsed,
  isRightMaximized,
  onRightPaneToggle
}: ThreePaneLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Left Pane - Always visible */}
      <aside
        className={`h-full transition-all duration-300 ease-in-out flex-shrink-0 relative overflow-hidden z-20 shadow-sm border-r border-neutral-200 ${isLeftCollapsed ? 'w-[72px]' : 'w-[240px]'
          }`}
      >
        <div className={`h-full ${isLeftCollapsed ? 'w-[72px]' : 'w-[240px]'}`}>
          {left}
        </div>
      </aside>

      {/* Main Canvas - Hidden when right pane is maximized */}
      {!isRightMaximized && (
        <main className="flex-1 h-full overflow-y-auto bg-background relative scroll-smooth scrollbar-hide">
          <div className="max-w-[1440px] mx-auto min-h-full flex flex-col">
            {children}
          </div>
          {/* Right Pane Toggle Button - Shows when right pane is collapsed */}
          {isRightCollapsed && (
            <button
              onClick={onRightPaneToggle}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-all group fixed right-4 top-1/2 -translate-y-1/2 z-30"
              title="Show SugarOS AI"
            >
              <MessageSquare size={16} className="text-cane-green" />
              <span className="text-sm font-bold text-industrial-gray group-hover:text-cane-green whitespace-nowrap">SugarOS AI</span>
            </button>
          )}
        </main>
      )}

      {/* Right Pane */}
      <aside
        className={`h-full transition-all duration-300 ease-in-out flex-shrink-0 relative overflow-hidden z-20 border-l border-slate-100 ${isRightCollapsed
          ? 'w-0'
          : isRightMaximized
            ? 'flex-1'
            : 'w-[380px]'
          }`}
      >
        <div className={`h-full ${isRightCollapsed
          ? 'w-0'
          : isRightMaximized
            ? 'w-full'
            : 'w-[380px]'
          }`}>
          {right}
        </div>
      </aside>
    </div>
  );
}
