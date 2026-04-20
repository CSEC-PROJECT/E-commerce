import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { loginSchema } from "../lib/authValidation";
import { z } from "zod";
import authHeroBg from "../assets/auth_hero_bg.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login, loading } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      toast.success("Email verified successfully. You can now sign in.");
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      loginSchema.parse({ email, password });
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.issues?.[0]?.message || "Please check your input.");
        return;
      }
    }

    try {
      const result = await login({ email: email.trim(), password: password.trim() });
      toast.success("Welcome back!");

      const role = result?.data?.role || "";
      const isAdmin = Array.isArray(role) ? role.includes("admin") : role === "admin";
      
      const from = location.state?.from?.pathname || "/";

      if (isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error(error.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-10 md:px-10 bg-background">
        <div className="w-full max-w-lg space-y-8 rounded-2xl border border-border/60 bg-card/60 p-8 shadow-sm backdrop-blur-sm">
          <div className="text-center lg:text-left animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">Sign in</h1>
            <p className="text-sm text-muted-foreground mt-2 font-medium">
              Enter your email and password to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold leading-none text-foreground" htmlFor="email">
                  Email Address
                </label>
                <div className="relative mt-2">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex h-11 w-full rounded-md border border-input bg-background pl-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary h-11 transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold leading-none text-foreground" htmlFor="password">
                    Password
                  </label>
                  <Link to="#" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative mt-2">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex h-11 w-full rounded-md border border-input bg-background pl-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary h-11 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="remember" className="text-sm font-medium text-muted-foreground cursor-pointer select-none">
                  Remember me
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-md text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 h-11 px-8 py-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm font-medium text-muted-foreground mt-8 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-bold text-primary hover:underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10" />
        <img
          src={authHeroBg}
          alt="Auth side"
          className="absolute inset-0 h-full w-full object-cover z-0 transition-transform duration-1000 hover:scale-105"
        />
        <div className="relative z-30 flex flex-col justify-center items-center h-full w-full p-12 lg:p-20 text-center text-white backdrop-blur-[2px]">
          <div className="animate-fade-in-up flex flex-col items-center max-w-lg bg-black/20 border border-white/10 p-10 rounded-3xl backdrop-blur-md shadow-2xl" style={{ animationDelay: "0.2s" }}>
            <div className="w-12 h-1 bg-primary/80 mb-8 rounded-full"></div>
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-wide mb-6 text-white leading-tight">
              Access The Selection
            </h2>
            <p className="text-base lg:text-lg font-light text-white/80 leading-relaxed mb-8">
              Welcome back. Sign in to seamlessly continue discovering curated pieces designed for the modern individual and elevate your personal aesthetic.
            </p>
            <div className="flex gap-4 text-xs font-medium text-white/60 uppercase tracking-[0.2em]">
              <span>Discover</span>
              <span>•</span>
              <span>Refine</span>
              <span>•</span>
              <span>Express</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
