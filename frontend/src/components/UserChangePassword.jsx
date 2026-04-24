import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowRight, CheckCircle, X, Loader2 } from "lucide-react";
import { useModalStore } from "../store/modalStore";
import { apiRequest } from "../lib/apiClient";
import toast from "react-hot-toast";

const UserChangePassword = () => {
    const { isChangePasswordOpen, closeChangePassword } = useModalStore();
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: "",
    });

    const isMatch = passwords.new !== "" && passwords.new === passwords.confirm;
    const isStrong = passwords.new.length >= 6;

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") closeChangePassword();
        };
        if (isChangePasswordOpen) {
            window.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden"; // Lock scroll
        }
        return () => {
            window.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "unset"; // Unlock scroll
        };
    }, [isChangePasswordOpen, closeChangePassword]);

    if (!isChangePasswordOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isMatch) {
            toast.error("Passwords do not match");
            return;
        }
        if (!isStrong) {
            toast.error("New password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            await apiRequest("/api/auth/change-password", {
                method: "POST",
                body: {
                    oldPassword: passwords.current,
                    newPassword: passwords.new,
                },
            });
            toast.success("Password updated successfully");
            closeChangePassword();
            setPasswords({ current: "", new: "", confirm: "" });
        } catch (error) {
            toast.error(error.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-[999] flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
        >
            {/* Overlay with blur and dim */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
                onClick={closeChangePassword}
            />

            {/* Modal Content */}
            <div className="bg-card w-full max-w-md rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden z-10 animate-in zoom-in-95 fade-in duration-300 border border-border">
                {/* Close button */}
                <button
                    onClick={closeChangePassword}
                    className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-all p-2 hover:bg-muted rounded-full group"
                >
                    <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>

                <div className="mb-10">
                    <h2 className="text-3xl font-black text-foreground tracking-tight leading-tight">Change Password</h2>
                    <p className="text-[15px] text-muted-foreground mt-2 font-medium opacity-80">
                        Keep your account secure with a strong password
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Current Password */}
                    <div className="space-y-2">
                        <label className="block text-[11px] font-black tracking-[0.2em] text-muted-foreground uppercase px-1">
                            Current Password
                        </label>
                        <div className="relative group">
                            <input
                                type={showCurrent ? "text" : "password"}
                                name="current"
                                value={passwords.current}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                                className="w-full h-14 bg-muted/50 text-foreground rounded-2xl px-5 pr-14 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all placeholder:text-muted-foreground/30 font-medium"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-2"
                            >
                                {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <button 
                            type="button" 
                            onClick={() => window.open(`${import.meta.env.VITE_API_BASE_URL || "https://e-commerce-he4h.onrender.com"}/api/auth/forgot-password`, "_blank")}
                            className="text-primary text-[13px] font-bold mt-1 px-1 hover:underline underline-offset-4 tracking-tight transition-all"
                        >
                            Forgot Current Password? Click here
                        </button>
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                        <label className="block text-[11px] font-black tracking-[0.2em] text-muted-foreground uppercase px-1">
                            New Password
                        </label>
                        <div className="relative group">
                            <input
                                type={showNew ? "text" : "password"}
                                name="new"
                                value={passwords.new}
                                onChange={handleChange}
                                placeholder="Create new password"
                                required
                                className="w-full h-14 bg-muted/50 text-foreground rounded-2xl px-5 pr-14 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all placeholder:text-muted-foreground/30 font-medium"
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
                    <div className="space-y-2">
                        <label className="block text-[11px] font-black tracking-[0.2em] text-muted-foreground uppercase px-1">
                            Confirm Password
                        </label>
                        <div className="relative group">
                            <input
                                type={showConfirm ? "text" : "password"}
                                name="confirm"
                                value={passwords.confirm}
                                onChange={handleChange}
                                placeholder="Confirm new password"
                                required
                                className="w-full h-14 bg-muted/50 text-foreground rounded-2xl px-5 pr-14 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all placeholder:text-muted-foreground/30 font-medium"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-2"
                            >
                                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {isMatch && passwords.new !== "" && (
                            <div className="flex items-center gap-2 mt-3 px-1 text-primary animate-in fade-in slide-in-from-top-1 duration-300">
                                <CheckCircle size={14} />
                                <span className="text-[13px] font-bold tracking-tight">Passwords match successfully</span>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading || !isMatch || !isStrong || !passwords.current}
                            className="w-full inline-flex items-center justify-center gap-3 rounded-full text-base font-black bg-gradient-to-r from-primary to-[#8b5cf6] text-primary-foreground hover:shadow-lg hover:shadow-primary/20 h-14 px-8 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md group"
                        >
                            {loading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    <span>Update Password</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserChangePassword;
