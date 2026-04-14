import React, { useState, useEffect, useRef } from 'react';
import {
    Store, Bell, Shield, CreditCard, Palette, LogOut, RotateCcwKey,
    Sun, Moon, History, Wallet, ChevronDown
} from "lucide-react";
import ChangePassword from '../components/Admin-components/ChangePassword';

const Toggle = ({ active, onClick }) => (
    <div
        onClick={onClick}
        className={`w-11 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors duration-200 ${active ? 'bg-primary' : 'bg-muted'}`}
    >
        <div className={`w-4 h-4 rounded-full bg-background shadow-sm transform transition-transform duration-200 ${active ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
);

const CustomDropdown = ({ options, label, defaultValue }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(defaultValue || options[0]);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1.5 tracking-wide">{label}</label>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-muted text-foreground rounded-lg px-3 py-2 text-sm flex justify-between items-center cursor-pointer hover:bg-muted/80 transition-all border border-transparent focus-within:ring-2 focus-within:ring-primary"
            >
                <span className="font-medium">{selected}</span>
                <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-card border border-border rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-200">
                    {options.map((opt, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                setSelected(opt);
                                setIsOpen(false);
                            }}
                            className={`px-3 py-2.5 text-sm cursor-pointer transition-colors ${selected === opt ? 'bg-primary/10 text-primary font-bold' : 'text-foreground hover:bg-surface-soft'}`}
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const SettingPage = () => {
    const [toggles, setToggles] = useState({
        newOrder: true,
        shippingUpdates: true,
        inventoryLow: false,
        dailyRevenue: true,
        twoFactor: true,
        sessionTimeout: false,
        creditCard: true,
        chapa: true,
        paypal: false,
        compactInterface: false,
    });

    const [theme, setTheme] = useState('light');
    const [openPasswordModal, setOpenPasswordModal] = useState(false);

    const handleToggle = (key) => {
        setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 lg:p-12">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-foreground mb-1.5 tracking-tight">Settings</h1>
                    <p className="text-sm text-muted-foreground font-medium">Configure how your store operates across the globe</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button className="flex-1 md:flex-none text-sm font-bold text-muted-foreground hover:text-primary transition-colors px-4 py-2">
                        Reset
                    </button>
                    <button className="flex-1 md:flex-none text-sm font-bold bg-primary text-white px-6 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-md shadow-primary/10">
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 items-start">

                {/* Left Column */}
                <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">

                    {/* Store Information */}
                    <div className="bg-card border border-border rounded-xl p-4 md:p-6 overflow-visible">
                        <div className="flex items-center gap-3 mb-6 md:mb-8">
                            <div className="p-2.5 bg-secondary rounded-xl text-primary shadow-sm">
                                <Store size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-foreground leading-tight">Store Information</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">Basic details about your public storefront</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                            <div>
                                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1.5 tracking-wide">Store Name</label>
                                <input
                                    type="text"
                                    defaultValue="The Atelier Admin"
                                    className="w-full bg-muted text-foreground placeholder-muted-foreground rounded-lg px-3 py-2.5 text-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1.5 tracking-wide">Store Email</label>
                                <input
                                    type="email"
                                    defaultValue="contact@theatelier.com"
                                    className="w-full bg-muted text-foreground placeholder-muted-foreground rounded-lg px-3 py-2.5 text-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                />
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1.5 tracking-wide">Phone Number</label>
                            <input
                                type="text"
                                defaultValue="+1 (555) 000-1234"
                                className="w-full bg-muted text-foreground placeholder-muted-foreground rounded-lg px-3 py-2.5 text-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            />
                        </div>

                        <div className="mb-8">
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1.5 tracking-wide">Address</label>
                            <textarea
                                rows="3"
                                defaultValue="742 Evergreen Terrace, Springfield, OR 97403, USA"
                                className="w-full bg-muted text-foreground placeholder-muted-foreground rounded-lg px-3 py-2.5 text-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-border pt-8">
                            <CustomDropdown label="Currency" options={["USD ($)", "EUR (€)", "GBP (£)"]} defaultValue="USD ($)" />
                            <CustomDropdown label="Timezone" options={["(GMT-08:00) Pacific", "(GMT-05:00) Eastern", "(GMT+00:00) UTC"]} defaultValue="(GMT-08:00) Pacific" />
                            <CustomDropdown label="Language" options={["English (US)", "Spanish (ES)", "French (FR)"]} defaultValue="English (US)" />
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-card border border-border rounded-xl p-4 md:p-6 overflow-visible">
                        <div className="flex items-center gap-3 mb-6 md:mb-8">
                            <div className="p-2.5 bg-secondary rounded-xl text-primary shadow-sm">
                                <Shield size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-foreground leading-tight">Security</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">Manage your account security and sessions</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-sm font-bold text-foreground">2-Factor Authentication</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">Recommended for high security</p>
                            </div>
                            <Toggle active={toggles.twoFactor} onClick={() => handleToggle('twoFactor')} />
                        </div>

                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-sm font-bold text-foreground">Session Timeout</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">Auto-logout after 30 mins</p>
                            </div>
                            <Toggle active={toggles.sessionTimeout} onClick={() => handleToggle('sessionTimeout')} />
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => setOpenPasswordModal(true)}
                                className="w-full flex items-center justify-center gap-2 bg-muted text-foreground font-bold py-3 rounded-xl hover:text-primary transition-colors duration-200 text-sm border border-transparent"
                            >
                                <RotateCcwKey size={16} /> Change Password
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 text-destructive font-bold py-3 rounded-xl hover:opacity-80 transition-colors duration-200 text-sm border border-transparent">
                                <LogOut size={16} /> Logout from all devices
                            </button>
                        </div>
                    </div>

                    {/* Appearance */}
                    <div className="bg-card border border-border rounded-xl p-4 md:p-6">
                        <div className="flex items-center gap-3 mb-6 md:mb-8">
                            <div className="p-2.5 bg-secondary rounded-xl text-primary shadow-sm">
                                <Palette size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-foreground leading-tight">Appearance</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">Customize your dashboard look and feel</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                            <span className="text-sm font-bold text-foreground">Theme Mode</span>
                            <div className="flex items-center gap-1 p-1 bg-muted rounded-xl self-start sm:self-auto border border-border/50">
                                <button
                                    onClick={() => setTheme('light')}
                                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${theme === 'light' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    <Sun size={14} /> Light
                                </button>
                                <button
                                    onClick={() => setTheme('dark')}
                                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${theme === 'dark' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    <Moon size={14} /> Dark
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-sm font-bold text-foreground">Compact Interface</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">Optimize dashboard for data density</p>
                            </div>
                            <Toggle active={toggles.compactInterface} onClick={() => handleToggle('compactInterface')} />
                        </div>
                    </div>

                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">

                    {/* Notification Settings */}
                    <div className="bg-card border border-border rounded-xl p-4 md:p-6">
                        <div className="flex items-center gap-3 mb-6 md:mb-8">
                            <div className="p-2.5 bg-secondary rounded-xl text-primary shadow-sm">
                                <Bell size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-foreground leading-tight">Notification Settings</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">Choose what updates you want to receive</p>
                            </div>
                        </div>

                        <div className="mb-10">
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-5 tracking-wide px-1">Customer Notifications</label>
                            <div className="flex flex-col gap-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-foreground px-1">New Order Confirmation</span>
                                    <Toggle active={toggles.newOrder} onClick={() => handleToggle('newOrder')} />
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-foreground px-1">Shipping Updates</span>
                                    <Toggle active={toggles.shippingUpdates} onClick={() => handleToggle('shippingUpdates')} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-5 tracking-wide px-1">Admin Notifications</label>
                            <div className="flex flex-col gap-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-foreground px-1">Inventory Low Alerts</span>
                                    <Toggle active={toggles.inventoryLow} onClick={() => handleToggle('inventoryLow')} />
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-foreground px-1">Daily Revenue Report</span>
                                    <Toggle active={toggles.dailyRevenue} onClick={() => handleToggle('dailyRevenue')} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Settings */}
                    <div className="bg-card border border-border rounded-xl p-4 md:p-6">
                        <div className="flex items-center gap-3 mb-6 md:mb-8">
                            <div className="p-2.5 bg-secondary rounded-xl text-primary shadow-sm">
                                <CreditCard size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-foreground leading-tight">Payment Settings</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">Manage how you receive customer payments</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className={`flex items-center justify-between rounded-xl p-4 border border-border transition-all duration-300 ${toggles.creditCard ? 'bg-surface-soft ring-1 ring-primary/10' : 'bg-transparent'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg transition-colors ${toggles.creditCard ? 'bg-secondary text-primary' : 'bg-muted text-muted-foreground'}`}>
                                        <CreditCard size={18} />
                                    </div>
                                    <span className="text-sm font-bold text-foreground">Credit Card</span>
                                </div>
                                <Toggle active={toggles.creditCard} onClick={() => handleToggle('creditCard')} />
                            </div>

                            <div className={`flex items-center justify-between rounded-xl p-4 border border-border transition-all duration-300 ${toggles.chapa ? 'bg-surface-soft ring-1 ring-primary/10' : 'bg-transparent'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg transition-colors ${toggles.chapa ? 'bg-secondary text-primary' : 'bg-muted text-muted-foreground'}`}>
                                        <Wallet size={18} />
                                    </div>
                                    <span className="text-sm font-bold text-foreground">Chapa</span>
                                </div>
                                <Toggle active={toggles.chapa} onClick={() => handleToggle('chapa')} />
                            </div>

                            <div className={`flex items-center justify-between rounded-xl p-4 border border-border transition-all duration-300 ${toggles.paypal ? 'bg-surface-soft ring-1 ring-primary/10' : 'bg-transparent'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg transition-colors ${toggles.paypal ? 'bg-secondary text-primary' : 'bg-muted text-muted-foreground'}`}>
                                        <CreditCard size={18} />
                                    </div>
                                    <span className="text-sm font-bold text-foreground">PayPal</span>
                                </div>
                                <Toggle active={toggles.paypal} onClick={() => handleToggle('paypal')} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Footer */}
            <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-t border-border pt-10">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground px-1">
                    <History size={16} /> Last modified by Admin on Oct 24, 2023
                </div>
                <button className="w-full md:w-auto bg-primary text-white text-sm font-black py-4 px-10 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20 uppercase tracking-widest">
                    Save All Changes
                </button>
            </div>

            {/* Password Modal */}
            {openPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Blurred + Dimmed Background */}
                    <div
                        className="absolute inset-0 bg-background/70 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setOpenPasswordModal(false)}
                    />

                    {/* Modal */}
                    <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
                        <ChangePassword onClose={() => setOpenPasswordModal(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingPage;
