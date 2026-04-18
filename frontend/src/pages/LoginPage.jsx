import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { loginSchema } from "../lib/authValidation";
import { z } from "zod";

export default function LoginPage() {
  const navigate = useNavigate();
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
      const result = await login({ email, password });
      toast.success("Welcome back!");

      const role = result?.data?.role || "";
      const isAdmin = Array.isArray(role) ? role.includes("admin") : role === "admin";

      if (isAdmin) {
        navigate("/admin/products");
      } else {
        navigate("/");
      }
    } catch {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-8 rounded-2xl border border-border/60 bg-card/60 p-8 shadow-sm backdrop-blur-sm">
      <div className="text-center lg:text-left animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">Sign In</h1>
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
          {loading ? "Signing In..." : "Sign In"}
          {!loading && (
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          )}
        </button>
      </form>

      <div className="relative animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground font-semibold">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
        <button className="inline-flex w-full items-center justify-center rounded-md text-sm font-bold border border-input bg-background hover:bg-muted h-11 px-8 py-2 transition-all">
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>
        <button className="inline-flex w-full items-center justify-center rounded-md text-sm font-bold border border-input bg-background hover:bg-muted h-11 px-8 py-2 transition-all">
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          FaceBook
        </button>
      </div>

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
  );
}
