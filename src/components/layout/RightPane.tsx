import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, SimulationStatus, CanvasSection } from '@/hooks/useSimulation';
import { MessageSquare, Send, Maximize2, Minimize2, History as HistoryIcon, ChevronRight, Plus, FileText, CheckCircle } from 'lucide-react';
import { UploadedFile } from '@/types/fileUpload';
import { useRecommendations } from '@/hooks/useRecommendations';
import { useFileUpload } from '@/hooks/useFileUpload';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { STATIC_QUICK_ACTIONS } from '@/constants/quickActions';

interface RightPaneProps {
    messages: ChatMessage[];
    status: SimulationStatus;
    sections: CanvasSection[];
    onSendMessage: (query?: string) => void;
    onClearPlanner: () => void;
    onFileUploaded?: (file: UploadedFile) => void;
    isCollapsed: boolean;
    isMaximized: boolean;
    onToggleCollapse: () => void;
    onToggleMaximize: () => void;
}


export default function RightPane({ messages, status, sections, onSendMessage, onClearPlanner, onFileUploaded, isCollapsed, isMaximized, onToggleCollapse, onToggleMaximize }: RightPaneProps) {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Use memoized recommendations hook
    const recommendations = useRecommendations(sections, status);

    // Use file upload hook
    const { 
        uploadingFile, 
        uploadProgress, 
        showSuccess, 
        fileInputRef, 
        handleFileSelect, 
        handleUploadClick 
    } = useFileUpload(onFileUploaded);

    // Render quick actions component
    const renderQuickActions = (title: string = 'Quick Actions') => (
        <div className="mt-8 pt-8 border-t border-slate-200/60">
            <div className="mb-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-1">{title}</h3>
            </div>
            <div className="space-y-4 px-1">
                {STATIC_QUICK_ACTIONS.map((action, idx) => (
                    <div
                        key={idx}
                        onClick={() => handleSend(action.query)}
                        className="group cursor-pointer flex items-center justify-between text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <span className="text-sm font-medium">{action.text}</span>
                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0" />
                    </div>
                ))}
            </div>
        </div>
    );

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (text?: string) => {
        const query = (text || inputValue).trim();
        if (!query) return;

        // Always trigger simulation - it will handle planner requests and other queries
        onSendMessage(query);

        setInputValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };


    return (
        <div className="flex flex-col h-full bg-white/80 backdrop-blur-md border-l border-slate-200/60 relative overflow-hidden">
            {/* Header - Fixed at top */}
            <div className="flex items-center justify-between px-6 py-5 shrink-0 border-b border-slate-200/40">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-slate-900 tracking-tight">Namaha AI</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onToggleMaximize}
                        className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all active:scale-95"
                        title={isMaximized ? 'Minimize' : 'Maximize'}
                    >
                        {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>
                    <button
                        className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all active:scale-95"
                        title="Recent Chats"
                    >
                        <HistoryIcon size={18} />
                    </button>
                    <button
                        onClick={onToggleCollapse}
                        className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all active:scale-95"
                        title="Collapse sidebar"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Message List - Scrollable */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide px-4 py-4">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col">
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                            <div className="w-20 h-20 rounded-[28px] bg-white shadow-xl flex items-center justify-center mb-6 text-slate-900 border border-slate-100 ring-4 ring-slate-50 animate-float">
                                <MessageSquare size={32} strokeWidth={1.5} />
                            </div>
                            <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Ready to help</p>
                        </div>

                        {/* What to do next suggestions */}
                        <div className="mt-auto pb-4">
                            {renderQuickActions('What should you do next?')}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {messages.map((msg) => (
                            <MessageBubble 
                                key={msg.id} 
                                role={msg.role} 
                                text={msg.text}
                                isTyping={msg.isTyping}
                            />
                        ))}

                        {/* Show smart recommendations after messages - only when planner actions exist */}
                        {messages.length > 0 && recommendations.length > 0 && (
                            <div className="mt-8 pt-8 border-t border-slate-200/60">
                                <div className="mb-4">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-1">Recommended Actions</h3>
                                </div>
                                <div className="space-y-4 px-1">
                                    {recommendations.map((rec, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => handleSend(`[REC] ${rec.query}`)}
                                            className="group cursor-pointer flex items-center justify-between text-slate-600 hover:text-slate-900 transition-colors"
                                        >
                                            <span className="text-sm font-medium">{rec.text}</span>
                                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Always show static quick actions when messages exist */}
                        {messages.length > 0 && renderQuickActions('Quick Actions')}
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Upload Progress/Success - Above Input Area */}
            {(uploadingFile || showSuccess) && (
                <div className="px-6 pb-2 shrink-0">
                    {showSuccess && uploadingFile ? (
                        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg animate-fadeIn">
                            <CheckCircle size={18} className="text-green-600 shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-green-900">File uploaded successfully</p>
                                <p className="text-xs text-green-700">{uploadingFile.name}</p>
                            </div>
                        </div>
                    ) : uploadingFile ? (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <FileText size={16} className="text-slate-600 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate">{uploadingFile.name}</p>
                                </div>
                                <span className="text-xs font-medium text-slate-600">{Math.round(uploadProgress)}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="h-full bg-earth-600 transition-all duration-300 ease-out rounded-full"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    ) : null}
                </div>
            )}

            {/* Input Area - Fixed at bottom */}
            <div className="p-6 shrink-0 border-t border-slate-200/40 bg-white/20 backdrop-blur-sm">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                />
                <div className="relative group bg-slate-50/80 rounded-[20px] focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900/10 focus-within:shadow-lg transition-all duration-300 border border-slate-200/40">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything..."
                        className="w-full pl-5 pr-24 py-4 bg-transparent border-none rounded-[20px] text-[14px] placeholder:text-slate-400 focus:outline-none text-slate-900 font-medium"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                        <button
                            onClick={handleUploadClick}
                            className="p-2.5 rounded-xl bg-earth-900 text-white hover:bg-earth-800 transition-all duration-300 shadow-lg scale-100 active:scale-95"
                            title="Upload PDF file"
                        >
                            <Plus size={18} strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={() => handleSend()}
                            disabled={!inputValue}
                            className={`p-2.5 rounded-xl transition-all duration-300 ${inputValue
                                ? 'bg-earth-900 text-white hover:bg-earth-800 shadow-lg scale-100 active:scale-95'
                                : 'bg-slate-100 text-slate-300 cursor-not-allowed scale-90'
                                }`}
                        >
                            <Send size={18} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
