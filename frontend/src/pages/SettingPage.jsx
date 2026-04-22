import React, { useState, useEffect, useRef } from 'react';
import {
    Store, Bell, Shield, CreditCard, Palette, LogOut, RotateCcwKey,
    Sun, Moon, History, Wallet, ChevronDown
} from "lucide-react";
import AdminChangePassword from '../components/Admin/AdminChangePassword';
import useThemeStore from '../store/themeStore';
import { apiRequest } from '../lib/apiClient';
import toast from 'react-hot-toast';

const CustomSelect = ({ options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={selectRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-foreground py-1 flex justify-between items-center bg-transparent focus:outline-none"
            >
                <span className="text-sm font-medium">{value}</span>
                <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-card border rounded-lg shadow-md z-50 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-200">
                    {options.map((option, idx) => (
                        <div
                            key={idx}
                            onClick={() => {
                                onChange(option);
                                setIsOpen(false);
                            }}
                            className={`px-3 py-2 cursor-pointer text-sm hover:bg-surface-soft transition-colors ${value === option ? 'text-primary font-medium' : 'text-foreground'}`}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const Toggle = ({ active, onClick }) => (
    <div
        onClick={onClick}
        className={`w-11 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${active ? 'bg-primary' : 'bg-muted'}`}
    >
        <div className={`w-4 h-4 rounded-full bg-background shadow-sm transform transition-transform ${active ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
);

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

    const { theme, setTheme } = useThemeStore();
    const [openChangePassword, setOpenChangePassword] = useState(false);

    const handlePasswordChange = async ({ oldPassword, newPassword }) => {
        try {
            await apiRequest('/api/auth/change-password', {
                method: 'POST',
                body: { oldPassword, newPassword },
            });
            toast.success('Password changed successfully');
            setOpenChangePassword(false);
        } catch (error) {
            toast.error(error.message || 'Failed to change password');
        }
    };

    // Select dropdown states
    const [currency, setCurrency] = useState('USD ($)');
    const [timezone, setTimezone] = useState('(GMT-08:00) Pacific');
    const [language, setLanguage] = useState('English (US)');

    const handleToggle = (key) => {
        setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="min-h-screen bg-background p-6 md:p-8 lg:p-10">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-1">Settings</h1>
                    <p className="text-sm text-muted-foreground">Configure how your store operates across the globe</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                        Reset
                    </button>
                    <button className="text-sm font-bold bg-primary text-white px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 items-start">

                {/* Left Column */}
                <div className="flex flex-col gap-6">

                    {/* Store Information */}
                    <div className="bg-card border rounded-xl p-4 md:p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-secondary rounded-lg text-primary">
                                <Store size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-foreground leading-tight">Store Information</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">Basic details about your public storefront</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1.5 tracking-wide">Store Name</label>
                                <input
                                    type="text"
                                    placeholder="The Atelier Admin"
                                    className="w-full bg-muted text-foreground placeholder-muted-foreground rounded-lg px-3 py-2 text-sm border-none focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1.5 tracking-wide">Store Email</label>
                                <input
                                    type="email"
                                    placeholder="contact@theatelier.com"
                                    className="w-full bg-muted text-foreground placeholder-muted-foreground rounded-lg px-3 py-2 text-sm border-none focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1.5 tracking-wide">Phone Number</label>
                            <input
                                type="text"
                                placeholder="+1 (555) 000-1234"
                                className="w-full bg-muted text-foreground placeholder-muted-foreground rounded-lg px-3 py-2 text-sm border-none focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1.5 tracking-wide">Address</label>
                            <textarea
                                rows="3"
                                placeholder="742 Evergreen Terrace, Springfield, OR 97403, USA"
                                className="w-full bg-muted text-foreground placeholder-muted-foreground rounded-lg px-3 py-2 text-sm border-none focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-6 pb-2">
                            <div>
                                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1.5 tracking-wide">Currency</label>
                                <CustomSelect
                                    options={['USD ($)', 'EUR (€)', 'GBP (£)']}
                                    value={currency}
                                    onChange={setCurrency}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1.5 tracking-wide">Timezone</label>
                                <CustomSelect
                                    options={['(GMT-08:00) Pacific', '(GMT-05:00) Eastern', '(GMT+00:00) UTC']}
                                    value={timezone}
                                    onChange={setTimezone}
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1.5 tracking-wide">Language</label>
                                <CustomSelect
                                    options={['English (US)', 'Spanish (ES)', 'French (FR)']}
                                    value={language}
                                    onChange={setLanguage}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-card border rounded-xl p-4 md:p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-secondary rounded-lg text-primary">
                                <Shield size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-foreground leading-tight">Security</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">Manage your account security and sessions</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-5">
                            <div>
                                <h3 className="text-sm font-bold text-foreground">2-Factor Authentication</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">Recommended for high security</p>
                            </div>
                            <Toggle active={toggles.twoFactor} onClick={() => handleToggle('twoFactor')} />
                        </div>

                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-sm font-bold text-foreground">Session Timeout</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">Auto-logout after 30 mins</p>
                            </div>
                            <Toggle active={toggles.sessionTimeout} onClick={() => handleToggle('sessionTimeout')} />
                        </div>

                        <button
                            onClick={() => setOpenChangePassword(true)}
                            className="w-full flex items-center justify-center gap-2 bg-secondary text-primary font-bold py-2.5 rounded-lg mb-3 hover:opacity-90 transition-opacity text-sm"
                        >
                            <RotateCcwKey size={16} /> Change Password
                        </button>
                        <button className="w-full flex items-center justify-center gap-2 bg-destructive text-destructive-foreground font-bold py-2.5 rounded-lg hover:brightness-110 transition-all text-sm">
                            <LogOut size={16} /> Logout from all devices
                        </button>
                    </div>

                    {/* Appearance */}
                    <div className="bg-card border rounded-xl p-4 md:p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-secondary rounded-lg text-primary">
                                <Palette size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-foreground leading-tight">Appearance</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">Customize your dashboard look and feel</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                            <span className="text-sm font-bold text-foreground">Theme Mode</span>
                            <div className="flex items-center p-1 bg-muted rounded-lg self-start sm:self-auto">
                                <button
                                    onClick={() => setTheme('light')}
                                    className={`flex items-center justify-center gap-2 px-6 py-1.5 rounded-md text-sm font-bold transition-all ${theme === 'light' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    <Sun size={14} /> Light
                                </button>
                                <button
                                    onClick={() => setTheme('dark')}
                                    className={`flex items-center justify-center gap-2 px-6 py-1.5 rounded-md text-sm font-bold transition-all ${theme === 'dark' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
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
                <div className="flex flex-col gap-6">

                    {/* Notification Settings */}
                    <div className="bg-card border rounded-xl p-4 md:p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-secondary rounded-lg text-primary">
                                <Bell size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-foreground leading-tight">Notification Settings</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">Choose what updates you want to receive</p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-4 tracking-wide">Customer Notifications</label>
                            <div className="flex flex-col gap-5">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-foreground">New Order Confirmation</span>
                                    <Toggle active={toggles.newOrder} onClick={() => handleToggle('newOrder')} />
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-foreground">Shipping Updates</span>
                                    <Toggle active={toggles.shippingUpdates} onClick={() => handleToggle('shippingUpdates')} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-4 tracking-wide">Admin Notifications</label>
                            <div className="flex flex-col gap-5">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-foreground">Inventory Low Alerts</span>
                                    <Toggle active={toggles.inventoryLow} onClick={() => handleToggle('inventoryLow')} />
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-foreground">Daily Revenue Report</span>
                                    <Toggle active={toggles.dailyRevenue} onClick={() => handleToggle('dailyRevenue')} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Settings */}
                    <div className="bg-card border rounded-xl p-4 md:p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-secondary rounded-lg text-primary">
                                <CreditCard size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-foreground leading-tight">Payment Settings</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">Manage how you receive customer payments</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className={`flex items-center justify-between rounded-xl p-3 border transition-colors ${toggles.creditCard ? 'bg-surface-soft' : 'bg-transparent'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-md ${toggles.creditCard ? 'bg-secondary text-primary' : 'bg-muted text-muted-foreground'}`}>
                                        <CreditCard size={18} />
                                    </div>
                                    <span className="text-sm font-bold text-foreground">Credit Card</span>
                                </div>
                                <Toggle active={toggles.creditCard} onClick={() => handleToggle('creditCard')} />
                            </div>

                            <div className={`flex items-center justify-between rounded-xl p-3 border transition-colors ${toggles.chapa ? 'bg-surface-soft' : 'bg-transparent'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-md ${toggles.chapa ? 'bg-secondary text-primary' : 'bg-muted text-muted-foreground'}`}>
                                        <Wallet size={18} />
                                    </div>
                                    <span className="text-sm font-bold text-foreground">Chapa</span>
                                </div>
                                <Toggle active={toggles.chapa} onClick={() => handleToggle('chapa')} />
                            </div>

                            <div className={`flex items-center justify-between rounded-xl p-3 border transition-colors ${toggles.paypal ? 'bg-surface-soft' : 'bg-transparent'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-md ${toggles.paypal ? 'bg-secondary text-primary' : 'bg-muted text-muted-foreground'}`}>
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

            {/* Password Modal Overlay */}
            {openChangePassword && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Dimmed + Blurred Background */}
                    <div
                        className="absolute inset-0 bg-background/70 backdrop-blur-sm"
                        onClick={() => setOpenChangePassword(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative z-10 w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200">
                        <AdminChangePassword
                            isOpen={openChangePassword}
                            onClose={() => setOpenChangePassword(false)}
                            onChangePassword={handlePasswordChange}
                        />
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-t pt-8">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <History size={16} /> Last modified by Admin on Oct 24, 2023
                </div>
                <button className="w-full sm:w-auto bg-primary text-white text-sm font-bold py-3 px-10 rounded-lg hover:opacity-90 transition-opacity uppercase tracking-wider">
                    Save All Changes
                </button>
            </div>

        </div>
    );
};

export default SettingPage;
