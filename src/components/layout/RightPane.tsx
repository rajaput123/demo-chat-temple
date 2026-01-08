import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, SimulationStatus, CanvasSection } from '@/hooks/useSimulation';
import { MessageSquare, Send, Maximize2, Minimize2, History as HistoryIcon, ChevronRight, Plus, FileText, CheckCircle, X } from 'lucide-react';
import { UploadedFile } from '@/types/fileUpload';
import { PDFExtractor } from '@/utils/pdfExtractor';

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

const MessageBubble = ({ role, text, isTyping }: { role: 'assistant' | 'user' | 'system'; text: string; isTyping?: boolean }) => {
    if (role === 'system') {
        return (
            <div className="flex justify-center my-6">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-2">
                    {text === 'Planning...' && (
                        <span className="flex gap-1">
                            <span className="w-1 h-1 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-1 h-1 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-1 h-1 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
                        </span>
                    )}
                    {text}
                </span>
            </div>
        );
    }

    return (
        <div className={`flex flex-col gap-1.5 ${role === 'user' ? 'items-end' : 'items-start'} mb-6 animate-fadeIn`}>
            <div className={`text-[11px] font-black uppercase tracking-widest mb-0.5 px-1 ${role === 'user' ? 'text-slate-400' : 'text-industrial-gray'}`}>
                {role === 'user' ? 'You' : 'SugarOS AI'}
            </div>
            <div
                className={`max-w-[90%] px-4 py-3 text-[14px] leading-relaxed font-medium transition-all rounded-[16px] shadow-sm
        ${role === 'user'
                        ? 'bg-industrial-gray text-white'
                        : 'bg-white border border-slate-200/60 text-slate-900'
                    }`}
            >
                {text}
                {isTyping && role === 'assistant' && (
                    <span className="ml-1 animate-pulse">|</span>
                )}
            </div>
        </div>
    );
};

export default function RightPane({ messages, status, sections, onSendMessage, onClearPlanner, onFileUploaded, isCollapsed, isMaximized, onToggleCollapse, onToggleMaximize }: RightPaneProps) {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingFile, setUploadingFile] = useState<UploadedFile | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const uploadTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Generate smart recommendations based on planner actions
    const generateRecommendations = (): { text: string; query: string }[] => {
        // Check all planner sections, not just visible ones (they might be visible but not marked as isVisible yet)
        const plannerSections = sections.filter(s => s.title === 'Your Planner Actions');

        if (plannerSections.length === 0 || !plannerSections[0].content) {
            // Only show recommendations when there are actual planner actions
            return [];
        }

        // Wait for streaming to complete before showing recommendations
        const plannerSection = plannerSections[0];
        // Check if content exists and either status is complete OR visibleContent matches content OR section is visible
        const hasContent = plannerSection.content && plannerSection.content.length > 0;
        const isStreamingComplete = status === 'complete' || 
                                    plannerSection.visibleContent === plannerSection.content ||
                                    (plannerSection.isVisible && hasContent);

        if (!isStreamingComplete || !hasContent) {
            return [];
        }

        // Parse planner actions
        const plannerContent = plannerSections[0].content;
        const actions = plannerContent.split('\n').filter(line => line.trim().startsWith('[·]')).map(line => line.replace('[·]', '').trim());

        const recommendations: { text: string; query: string }[] = [];

        // Generate contextual recommendations based on action keywords
        if (actions.some(a => a.toLowerCase().includes('quality') || a.toLowerCase().includes('inspection'))) {
            recommendations.push({ text: 'Review quality control checklist', query: 'Show quality control checklist' });
        }

        if (actions.some(a => a.toLowerCase().includes('cane') || a.toLowerCase().includes('intake') || a.toLowerCase().includes('supplier') || a.toLowerCase().includes('procurement'))) {
            recommendations.push({ text: 'Check cane stock availability', query: 'Check cane inventory' });
            recommendations.push({ text: 'View supplier schedule', query: 'Show supplier visits' });
        }

        if (actions.some(a => a.toLowerCase().includes('cane') || a.toLowerCase().includes('intake') || a.toLowerCase().includes('arrange'))) {
            recommendations.push({ text: 'Check cane stock quantity', query: 'How much cane is available?' });
        }
        
        // Procurement-specific recommendations
        if (actions.some(a => a.toLowerCase().includes('procurement') || a.toLowerCase().includes('supplier') || a.toLowerCase().includes('delivery') || a.toLowerCase().includes('shortfall') || a.toLowerCase().includes('risk'))) {
            recommendations.push({ text: 'Check procurement progress', query: 'Show overall sugarcane procurement progress against season target and highlight risks' });
            recommendations.push({ text: 'Review supplier contracts', query: 'Show supplier contract details' });
        }

        if (actions.some(a => a.toLowerCase().includes('approval') || a.toLowerCase().includes('verify') || a.toLowerCase().includes('review'))) {
            recommendations.push({ text: 'Check approval workflow status', query: 'Show approval workflow' });
            recommendations.push({ text: 'Notify relevant departments', query: 'Who needs to be notified about pending approvals?' });
        }

        if (actions.some(a => a.toLowerCase().includes('finance') || a.toLowerCase().includes('fund') || a.toLowerCase().includes('₹') || a.toLowerCase().includes('donation'))) {
            recommendations.push({ text: 'Review budget allocation', query: 'Show current budget status' });
            recommendations.push({ text: 'Generate financial report', query: 'Create financial summary report' });
        }

        // If no specific recommendations, suggest completing planner actions
        if (recommendations.length === 0 && actions.length > 0) {
            const firstAction = actions[0];
            recommendations.push({ text: `Start: ${firstAction.substring(0, 40)}...`, query: `Help me with: ${firstAction}` });
            if (actions.length > 1) {
                recommendations.push({ text: 'Assign all actions to team', query: 'Assign these planner actions to team members' });
            }
        }

        // Add generic helpful suggestions
        recommendations.push({ text: 'Set deadlines for all actions', query: 'When should these actions be completed?' });

        return recommendations.slice(0, 4); // Limit to 4 recommendations
    };

    const recommendations = generateRecommendations();

    // Static quick actions that should always be visible
    const staticQuickActions = [
        { text: 'Check cane intake status', query: 'Check cane intake status' },
        { text: 'Show production batch', query: 'Show production batch' },
        { text: 'Show pending approvals', query: 'Show pending approvals' },
        { text: 'Show quality reports', query: 'Show quality reports' },
        { text: 'Show supplier visits', query: 'Show supplier visits' },
        { text: 'Show financial summary', query: 'Show financial summary' }
    ];

    // Render quick actions component
    const renderQuickActions = (title: string = 'Quick Actions') => (
        <div className="mt-8 pt-8 border-t border-slate-200/60">
            <div className="mb-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-1">{title}</h3>
            </div>
            <div className="space-y-4 px-1">
                {staticQuickActions.map((action, idx) => (
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

    const simulateUpload = (file: File, onProgress: (progress: number) => void, onComplete: (uploadedFile: UploadedFile) => void) => {
        const duration = Math.random() * 10000 + 10000; // 10-20 seconds
        const interval = 100; // Update every 100ms
        const steps = duration / interval;
        const increment = 100 / steps;

        let currentProgress = 0;
        const timer = setInterval(() => {
            currentProgress += increment;
            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(timer);

                const uploadedFile: UploadedFile = {
                    id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    uploadedAt: new Date().toISOString(),
                    status: 'completed',
                    uploadProgress: 100,
                };

                onComplete(uploadedFile);
            } else {
                onProgress(currentProgress);
            }
        }, interval);

        uploadTimerRef.current = timer;
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || file.type !== 'application/pdf') {
            return;
        }

        // Create uploading file object
        const newUploadingFile: UploadedFile = {
            id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString(),
            status: 'uploading',
            uploadProgress: 0,
        };

        setUploadingFile(newUploadingFile);
        setUploadProgress(0);
        setShowSuccess(false);

        // Extract PDF content and generate summary
        let extractedContent = '';
        let summary = '';

        try {
            const { content, summary: generatedSummary } = await PDFExtractor.extractAndSummarize(file);
            extractedContent = content;
            summary = generatedSummary;
        } catch (error) {
            console.error('Error extracting PDF content:', error);
            // Continue with empty content if extraction fails
        }

        // Start simulated upload
        simulateUpload(
            file,
            (progress) => {
                setUploadProgress(progress);
                setUploadingFile(prev => prev ? { ...prev, uploadProgress: progress } : null);
            },
            (uploadedFile) => {
                // Add extracted content and summary to uploaded file
                const fileWithContent: UploadedFile = {
                    ...uploadedFile,
                    content: extractedContent,
                    summary: summary,
                };

                setUploadingFile(fileWithContent);
                setUploadProgress(100);
                setShowSuccess(true);

                // Notify parent component
                if (onFileUploaded) {
                    onFileUploaded(fileWithContent);
                }

                // Hide success message after 3 seconds
                setTimeout(() => {
                    setShowSuccess(false);
                    setUploadingFile(null);
                    setUploadProgress(0);
                }, 3000);
            }
        );

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (uploadTimerRef.current) {
                clearInterval(uploadTimerRef.current);
            }
        };
    }, []);

    return (
        <div className="flex flex-col h-full bg-white/80 backdrop-blur-md border-l border-slate-200/60 relative overflow-hidden">
            {/* Header - Fixed at top */}
            <div className="flex items-center justify-between px-6 py-5 shrink-0 border-b border-slate-200/40">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-slate-900 tracking-tight">SugarOS AI</span>
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
                                    className="h-full bg-cane-green transition-all duration-300 ease-out rounded-full"
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
                            className="p-2.5 rounded-xl bg-industrial-gray text-white hover:bg-industrial-gray/90 transition-all duration-300 shadow-lg scale-100 active:scale-95"
                            title="Upload Factory Data (PDF)"
                        >
                            <Plus size={18} strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={() => handleSend()}
                            disabled={!inputValue}
                            className={`p-2.5 rounded-xl transition-all duration-300 ${inputValue
                                ? 'bg-cane-green text-white hover:bg-cane-green/90 shadow-lg scale-100 active:scale-95'
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
