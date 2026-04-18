import React from "react";
import { useLocation, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <div className="w-full min-h-screen flex font-sans antialiased bg-background text-foreground relative overflow-hidden">
      {/* Fixed Branding Logo - Always Absolute */}
      <div className="absolute top-8 left-8 z-50 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <span className="text-2xl font-black tracking-tighter text-foreground uppercase lg:text-white lg:mix-blend-difference">
          E—Shop
        </span>
      </div>

      <div className="flex w-full min-h-screen relative flex-row">
        {/* Form Container */}
        <div
          className="flex flex-col justify-center items-center p-8 sm:p-12 lg:p-16 auth-panel-form w-full lg:w-1/2 h-full min-h-screen"
          style={{
            transform: (window.innerWidth >= 1024)
              ? `translateX(${isLogin ? "100%" : "0%"})`
              : 'none',
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>

        {/* Image Panel */}
        <div
          className="hidden lg:flex lg:w-1/2 absolute top-0 bottom-0 auth-panel-image bg-muted items-center justify-center overflow-hidden z-20 h-full border-l border-border transition-transform duration-600 ease-in-out"
          style={{
            left: '0%',
            transform: isLogin
              ? "translateX(0%)"
              : "translateX(100%)",
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <div className="absolute inset-0 bg-black/20 z-10" />
          <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
          <img
            src="/auth_hero_bg.png"
            alt="E-Commerce Auth Background"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          {/* Dynamic Text for Image Panel */}
          <div className="relative z-30 flex flex-col justify-end h-full w-full p-20 text-white">
            <div className="animate-fade-in-up" key={isLogin ? "login" : "signup"}>
              <h2 className="text-5xl font-black tracking-tighter mb-6 text-white leading-[0.9]">
                {isLogin ? "ACCESS THE SELECTION" : "JOIN THE COLLECTIVE"}
              </h2>
              <p className="text-lg max-w-sm font-medium text-white/90 leading-relaxed">
                {isLogin
                  ? "Sign in to discover curated pieces designed for the modern individual and elevate your style."
                  : "Create an account to track your orders, save your wishlist, and get exclusive access to seasonal drops."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
