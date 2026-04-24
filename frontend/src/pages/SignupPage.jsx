import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/authStore";
import { signupSchema } from "../lib/authValidation";
import { z } from "zod";
import authHeroBg from "../assets/auth_hero_bg.png";

export default function SignupPage() {
  const navigate = useNavigate();
  const { register, loading } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      signupSchema.parse({ name, email, password, confirmPassword });
      await register({ name, email, password });
      toast.success("Account created. Please verify your email before login.");
      navigate("/login?verifyNotice=true");
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.issues?.[0]?.message || "Please check your input.");
      } else {
        toast.error(err?.message || "Unable to create account. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row">
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
              Join The Collective
            </h2>
            <p className="text-base lg:text-lg font-light text-white/80 leading-relaxed mb-8">
              Experience the intersection of modern aesthetics and effortless style. Track orders, save your wishlist, and gain exclusive early access to our seasonal drops.
            </p>
            <div className="flex gap-4 text-xs font-medium text-white/60 uppercase tracking-[0.2em]">
              <span>Curated</span>
              <span>•</span>
              <span>Elevated</span>
              <span>•</span>
              <span>Minimal</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 w-full md:w-1/2 flex items-center justify-center px-6 py-10 md:px-10 bg-background">
        <div className="w-full max-w-lg space-y-8 rounded-2xl border border-border/60 bg-card/60 p-8 shadow-sm backdrop-blur-sm">
          <div className="text-center lg:text-left animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">Create account</h1>
            <p className="text-sm text-muted-foreground mt-2 font-medium">
              Enter your details below to create your free account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold leading-none text-foreground" htmlFor="name">
                  Full Name
                </label>
                <div className="relative mt-2">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex h-11 w-full rounded-md border border-input bg-background pl-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary h-11 transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

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

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-semibold leading-none text-foreground" htmlFor="password">
                    Password
                  </label>
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
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold leading-none text-foreground" htmlFor="confirmPassword">
                    Confirm
                  </label>
                  <div className="relative mt-2">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="flex h-11 w-full rounded-md border border-input bg-background pl-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary h-11 transition-all"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-md text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 h-11 px-8 py-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm font-medium text-muted-foreground mt-8 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-primary hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>


    </div>
  );
}
