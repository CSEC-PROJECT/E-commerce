import React, { useState, useEffect } from 'react';

const NavBar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);

    // Prevent body scrolling when drawer is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        // Cleanup function
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    return (
        <>
            <nav className="bg-background border-b border-border sticky top-0 z-40">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-[72px]">

                        {/* Left Section: Logo & Nav Links */}
                        <div className="flex items-center gap-8 lg:gap-14 pl-2 lg:pl-4">
                            {/* Logo */}
                            <a href="/" className="flex items-center outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
                                <span className="text-[26px] font-black tracking-tight text-foreground whitespace-nowrap">
                                    E-Shop
                                </span>
                            </a>

                            {/* Desktop Nav */}
                            <div className="hidden md:flex space-x-6 lg:space-x-8 items-center h-full">
                                <a href="/" className="text-[15px] text-primary font-semibold border-b-[2.5px] border-primary h-[72px] flex items-center px-1">
                                    Home
                                </a>

                                {/* Categories Dropdown */}
                                <div className="relative group h-[72px] flex items-center">
                                    <button className="flex items-center px-1 text-[15px] text-muted-foreground hover:text-primary transition-colors font-semibold">
                                        Categories
                                        <svg className="ml-1.5 h-3.5 w-3.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <div className="absolute top-full left-0 hidden group-hover:block w-48 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                                        <a href="/category/electronics" className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors">Electronics</a>
                                        <a href="/category/fashion" className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors">Fashion</a>
                                        <a href="/category/home" className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors">Home & Garden</a>
                                    </div>
                                </div>

                                <a href="/products" className="px-1 text-[15px] text-muted-foreground hover:text-primary transition-colors font-semibold h-[72px] flex items-center">
                                    Products
                                </a>
                                <a href="/collections" className="px-1 text-[15px] text-muted-foreground hover:text-primary transition-colors font-semibold h-[72px] flex items-center">
                                    Collections
                                </a>
                                <a href="/about" className="px-1 text-[15px] text-muted-foreground hover:text-primary transition-colors font-semibold h-[72px] flex items-center">
                                    About Us
                                </a>
                            </div>
                        </div>

                        {/* Right Section: Actions */}
                        <div className="flex items-center justify-end gap-5 sm:gap-6 flex-1 pr-2 lg:pr-4">

                            {/* Top Navbar Search */}
                            <div className="hidden lg:block flex-1 max-w-[280px] xl:max-w-[340px] relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-[16px] w-[16px] text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-9 pr-4 py-[9px] bg-[#f5f6f8] dark:bg-muted border border-transparent rounded-[8px] text-[15px] text-foreground placeholder-muted-foreground focus:outline-none focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 font-medium"
                                />
                            </div>

                            {/* Action Icons */}
                            <div className="flex items-center gap-5 sm:gap-6">
                                {/* Cart Icon */}
                                <a href="/cart" className="relative text-foreground hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md" aria-label="Cart">
                                    <svg className="h-[25px] w-[25px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span className="absolute -top-2 -right-2.5 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white border-[2.5px] border-background">
                                        3
                                    </span>
                                </a>

                                {/* Dark Mode Moon Button */}
                                <button className="text-foreground/80 hover:text-primary transition-colors focus:outline-none hidden sm:block" aria-label="Toggle Dark Mode">
                                    <svg className="h-6 w-6 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Desktop Sign In */}
                            <div className="hidden md:block">
                                <a
                                    href="/signin"
                                    className="flex items-center gap-1.5 px-3 py-2 border-[1.5px] border-primary/40 text-primary hover:bg-primary/5 rounded-[6px] text-[15px] font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background"
                                >
                                    <svg className="h-[18px] w-[18px] stroke-[2.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Sign In
                                </a>
                            </div>

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="md:hidden p-2 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md transition-colors"
                                aria-expanded={isMobileMenuOpen}
                                aria-label="Open navigation menu"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 transition-opacity md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Mobile Drawer Panel */}
            <div
                className={`fixed inset-y-0 right-0 z-50 w-[85%] max-w-sm bg-background border-l border-border shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                aria-modal="true"
                role="dialog"
            >
                {/* Drawer Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <span className="text-xl font-bold tracking-tight text-foreground">Menu</span>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        aria-label="Close navigation menu"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Drawer Scrollable Content */}
                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="px-4 space-y-2">
                        {/* Active Link */}
                        <a
                            href="/"
                            className="flex items-center px-4 py-3 text-base font-semibold text-primary bg-primary/10 border-l-4 border-primary rounded-r-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                            Home
                        </a>

                        {/* Collapsible Categories */}
                        <div className="space-y-1">
                            <button
                                onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)}
                                className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                aria-expanded={isMobileCategoryOpen}
                            >
                                <span>Categories</span>
                                <svg
                                    className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${isMobileCategoryOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Children with smooth height transition */}
                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${isMobileCategoryOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <div className="pt-1 pb-2 pl-6 pr-4 space-y-1 ml-4 border-l-2 border-muted/50 mt-1">
                                    <a href="/category/electronics" className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">Electronics</a>
                                    <a href="/category/fashion" className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">Fashion</a>
                                    <a href="/category/home" className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">Home & Garden</a>
                                </div>
                            </div>
                        </div>

                        <a href="/products" className="flex items-center px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                            Products
                        </a>
                        <a href="/collections" className="flex items-center px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                            Collections
                        </a>
                        <a href="/about" className="flex items-center px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                            About Us
                        </a>
                    </nav>
                </div>

                {/* Drawer Bottom Actions */}
                <div className="p-6 border-t border-border bg-muted/30">
                    <div className="flex flex-col gap-4">
                        <a
                            href="/cart"
                            className="flex items-center justify-between px-4 py-3 text-base font-medium text-foreground hover:bg-muted bg-background rounded-md border border-border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span>Cart Items</span>
                            </div>
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                                3
                            </span>
                        </a>

                        <a
                            href="/signin"
                            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-base font-medium text-white bg-primary hover:bg-primary/90 rounded-md shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Sign In
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NavBar;
