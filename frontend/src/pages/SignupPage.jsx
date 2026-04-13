import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup with", { name, email, password });
  };

  return (
    <div className="w-full min-h-screen flex font-sans antialiased bg-background text-foreground">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight">Create Account</h1>
            <p className="text-sm text-muted-foreground mt-2 font-medium">
              Enter your details below to create your free account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
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
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-md text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 h-11 px-8 py-2 transition-all"
            >
              Create Account
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-semibold">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <span className="mr-2 text-lg font-bold">⌘</span>
              GitHub
            </button>
          </div>

          <p className="text-center text-sm font-medium text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-primary hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-muted items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
        <img
          src="/auth_hero_bg.png"
          alt="E-Commerce Signup Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="relative z-20 flex flex-col justify-end h-full w-full p-16 text-white">
          <h2 className="text-4xl font-extrabold tracking-tight mb-4 text-white">
            Join The Community
          </h2>
          <p className="text-lg max-w-md font-medium text-white/80">
            Create an account to track your orders, save your wishlist, and get access to exclusive drops and curated selections.
          </p>
        </div>
      </div>
    </div>
  );
}
