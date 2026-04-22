import React, { useState } from 'react';
import { Sparkles, X, Send, Plus, Package, RotateCcw, Info, Ruler } from 'lucide-react';

const AICurator = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');

    const quickActions = [
        { icon: <Package size={16} />, label: 'Track Order' },
        { icon: <RotateCcw size={16} />, label: 'Return Policy' },
        { icon: <Info size={16} />, label: 'Shipping Info' },
        { icon: <Ruler size={16} />, label: 'Sizing Guide' },
    ];

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-6">
            {/* Chat Window */}
            <div 
                className={`transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] origin-bottom-right ${
                    isOpen 
                        ? 'scale-100 opacity-100 translate-y-0' 
                        : 'scale-90 opacity-0 translate-y-10 pointer-events-none'
                } w-[420px] max-w-[calc(100vw-4rem)] h-[650px] max-h-[calc(100vh-10rem)] bg-card rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] border border-outline-variant/10 overflow-hidden flex flex-col`}
            >
                {/* Header */}
                <div className="p-8 bg-primary text-primary-foreground relative overflow-hidden shrink-0">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-foreground/10 rounded-full blur-2xl"></div>
                    
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary-foreground/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-inner">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <h3 className="font-heading font-black text-xl tracking-tight">Curator AI</h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Assistant Active</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-primary-foreground/10 rounded-full transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-none bg-surface-soft/5">
                    {/* AI Message */}
                    <div className="flex flex-col gap-2 max-w-[85%]">
                        <div className="bg-secondary text-secondary-foreground p-5 rounded-[1.8rem] rounded-bl-none shadow-sm font-sans leading-relaxed text-[15px]">
                            <p>Greetings. I'm your dedicated style curator. How may I assist you today?</p>
                        </div>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest ml-4">Assistant • Just now</span>
                    </div>

                    {/* Quick Actions Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        {quickActions.map((action, index) => (
                            <button 
                                key={index}
                                className="flex items-center gap-3 p-4 bg-card hover:bg-primary hover:text-primary-foreground rounded-2xl transition-all border border-outline-variant/5 hover:border-transparent hover:shadow-lg group text-left"
                            >
                                <div className="w-8 h-8 bg-primary/5 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary-foreground/20 group-hover:text-primary-foreground transition-all">
                                    {action.icon}
                                </div>
                                <span className="font-bold text-xs">{action.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* User Mock Message - EXACTLY MATCHING IMAGE */}
                    <div className="flex flex-col gap-2 items-end ml-auto max-w-[85%]">
                        <div className="bg-muted text-foreground p-5 rounded-[1.8rem] rounded-br-none shadow-sm font-sans leading-relaxed text-[15px]">
                            <p>Do you have any recommendation for a formal summer event?</p>
                        </div>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mr-4">You • 2m ago</span>
                    </div>
                </div>

                {/* Input Area - EXACTLY MATCHING IMAGE */}
                <div className="p-8 bg-card border-t border-outline-variant/5">
                    <div className="flex items-center gap-4 p-2 bg-background border border-outline-variant/20 rounded-full shadow-inner focus-within:border-primary/30 transition-all">
                        <button className="p-3 text-muted-foreground/60 hover:text-primary transition-colors ml-1">
                            <Plus size={22} className="stroke-[2.5px]" />
                        </button>
                        <input 
                            type="text" 
                            placeholder="Ask your stylist..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="flex-1 bg-transparent border-none focus:ring-0 text-[15px] font-sans py-2 placeholder:text-muted-foreground/40 text-foreground"
                        />
                        <button className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all mr-1">
                            <Send size={20} className="ml-1" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Trigger FAB */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center transition-all duration-500 shadow-2xl relative group ${
                    isOpen 
                        ? 'bg-secondary text-secondary-foreground rotate-[135deg]' 
                        : 'bg-primary text-primary-foreground shadow-primary/30 hover:scale-110 active:scale-95'
                }`}
            >
                {!isOpen && (
                    <div className="absolute inset-0 rounded-[2.5rem] border-2 border-primary/20 animate-ping opacity-50"></div>
                )}
                
                {isOpen ? <X size={32} /> : <Sparkles size={32} className="animate-pulse" />}
                
                {!isOpen && (
                    <div className="absolute right-24 bg-secondary text-secondary-foreground px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">
                        Talk to your Curator
                    </div>
                )}
            </button>
        </div>
    );
};

export default AICurator;
