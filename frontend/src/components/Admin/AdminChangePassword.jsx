import React, { useState } from "react";
import { Eye, EyeOff, ArrowRight, CheckCircle, X } from "lucide-react";

const AdminChangePassword = ({ onClose }) => {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: "",
    });

    const isMatch = passwords.new !== "" && passwords.new === passwords.confirm;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-card w-full rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden">
            {/* Close button for better UX on mobile */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-lg md:hidden"
            >
                <X size={20} />
            </button>

            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Change Password</h2>
                <p className="text-sm text-muted-foreground mt-1 font-medium">Keep your account secure with a strong password</p>
            </div>

            <div className="space-y-6">
                {/* Current Password */}
                <div>
                    <label className="block text-[11px] font-black tracking-widest text-foreground uppercase mb-2 px-1">
                        Current Password
                    </label>
                    <div className="relative group">
                        <input
                            type={showCurrent ? "text" : "password"}
                            name="current"
                            value={passwords.current}
                            onChange={handleChange}
                            placeholder="Enter current password"
                            className="w-full h-14 bg-muted text-foreground rounded-xl px-5 pr-14 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all placeholder:text-muted-foreground/50 font-medium"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-2"
                        >
                            {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    <button className="text-primary text-xs font-bold mt-2 px-1 hover:underline underline-offset-4 tracking-tight">
                        Forgot Current Password? Click here
                    </button>
                </div>

                {/* New Password */}
                <div>
                    <label className="block text-[11px] font-black tracking-widest text-foreground uppercase mb-2 px-1">
                        New Password
                    </label>
                    <div className="relative group">
                        <input
                            type={showNew ? "text" : "password"}
                            name="new"
                            value={passwords.new}
                            onChange={handleChange}
                            placeholder="Create new password"
                            className="w-full h-14 bg-muted text-foreground rounded-xl px-5 pr-14 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all placeholder:text-muted-foreground/50 font-medium"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-2"
                        >
                            {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div>
                    <label className="block text-[11px] font-black tracking-widest text-foreground uppercase mb-2 px-1">
                        Confirm Password
                    </label>
                    <div className="relative group">
                        <input
                            type={showConfirm ? "text" : "password"}
                            name="confirm"
                            value={passwords.confirm}
                            onChange={handleChange}
                            placeholder="Confirm new password"
                            className="w-full h-14 bg-muted text-foreground rounded-xl px-5 pr-14 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all placeholder:text-muted-foreground/50 font-medium"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-2"
                        >
                            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {isMatch && (
                        <div className="flex items-center gap-2 mt-3 px-1 text-primary animate-in fade-in slide-in-from-top-1 duration-300">
                            <CheckCircle size={16} />
                            <span className="text-xs font-bold tracking-tight">Passwords match successfully</span>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="pt-4 flex flex-col md:flex-row gap-4">
                    <button
                        onClick={onClose}
                        className="w-full md:w-1/3 h-14 bg-muted text-foreground rounded-xl font-bold flex items-center justify-center hover:bg-surface-soft transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            // Implement save logic here
                            onClose();
                        }}
                        className="w-full md:w-2/3 h-14 bg-primary text-primary-foreground rounded-xl font-black flex items-center justify-center gap-3 hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 uppercase tracking-widest text-xs"
                    >
                        Save Changes
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminChangePassword;