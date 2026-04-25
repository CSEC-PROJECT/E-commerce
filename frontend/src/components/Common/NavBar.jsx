import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Package, LogOut, LayoutDashboard, Lock } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useModalStore } from '../../store/modalStore';
import toast from 'react-hot-toast';
import useCartStore from '../../store/cartStore';
import { useProductStore } from '../../store/productStore';
import useThemeStore from '../../store/themeStore';

const NavBar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
    const { theme, setTheme } = useThemeStore();
    const isDark = theme === 'dark';
    const location = useLocation();
    const navigate = useNavigate();
    const accessToken = useAuthStore((state) => state.accessToken);
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const { openChangePassword } = useModalStore();

    const products = useProductStore((state) => state.products);

    const STANDARD_CATEGORIES = ['Electronics', 'Fashion', 'Home & Living', 'Beauty & Personal Care', 'Sports & Outdoor', 'Books & Education'];
    const CATEGORIES = STANDARD_CATEGORIES.map(c => ({ label: c, value: c }));

    const [searchQuery, setSearchQuery] = useState('');

    const isAdmin = !!accessToken && (Array.isArray(user?.role)
        ? user.role.includes('admin')
        : user?.role === 'admin');

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const { cart, getCart } = useCartStore();

    useEffect(() => {
        if (accessToken) {
            getCart();
        }
    }, [accessToken, getCart]);

    const cartItemCount = cart?.items?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;

    const handleLogout = async () => {
        setUserMenuOpen(false);
        try {
            await logout();
            toast.success('Signed out');
            navigate('/');
        } catch {
            toast.error('Could not sign out');
        }
    };

    // Detect active category from URL for navbar highlight
    const searchParams = new URLSearchParams(location.search);
    const activeCategory = searchParams.get('category') || '';
    const isCategoryActive = location.pathname === '/products' && activeCategory !== '';

    const handleCategoryNav = (value) => {
        navigate(`/products?category=${encodeURIComponent(value)}`);
    };

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter') {
            if (searchQuery.trim()) {
                navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            } else {
                navigate(`/products`);
            }
        }
    };

    // Dark mode toggle
    const toggleDarkMode = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const isActive = (path) => location.pathname === path;
    const isAdminRoute = location.pathname.startsWith('/admin');

    const handleMobileMenuButton = () => {
        if (isAdminRoute) {
            window.dispatchEvent(new CustomEvent('admin-sidebar:toggle'));
        } else {
            setIsMobileMenuOpen(true);
        }
    };

    // Do not render NavBar on Login or Signup pages
    if (location.pathname === '/login' || location.pathname === '/signup') {
        return null;
    }

    const navLinkClass = (path) =>
        `px-1 text-[15px] font-semibold h-[72px] flex items-center transition-colors ${isActive(path)
            ? 'text-primary border-b-[2.5px] border-primary'
            : 'text-muted-foreground hover:text-primary'
        }`;

    const mobileNavLinkClass = (path) =>
        `flex items-center px-4 py-3 text-base font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isActive(path)
            ? 'text-primary bg-primary/10 border-l-4 border-primary'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted font-medium'
        }`;

    return (
        <>
            <nav className="bg-background border-b border-border sticky top-0 z-40">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-[72px]">

                        {/* Left Section: Logo & Nav Links */}
                        <div className="flex items-center gap-8 lg:gap-14 pl-2 lg:pl-4">
                            {/* Logo */}
                            <Link to="/" className="flex items-center outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
                                <span className="text-[26px] font-black tracking-tight text-foreground whitespace-nowrap">
                                    E-Shop
                                </span>
                            </Link>

                            {/* Desktop Nav */}
                            <div className="hidden md:flex space-x-6 lg:space-x-8 items-center h-full">

                                {/* ── Admin links ── */}
                                {isAdmin ? (
                                    <>
                                        <Link to="/admin/dashboard" className={navLinkClass('/admin/dashboard')}>
                                            Dashboard
                                        </Link>
                                        <Link to="/" className={navLinkClass('/')}>
                                            Home
                                        </Link>

                                        {/* Admin Categories Dropdown */}
                                        <div className="relative group h-[72px] flex items-center">
                                            <button className={`flex items-center px-1 text-[15px] font-semibold transition-colors ${isCategoryActive
                                                ? 'text-primary border-b-[2.5px] border-primary h-full'
                                                : 'text-muted-foreground hover:text-primary'
                                                }`}>
                                                Categories
                                                <svg className="ml-1.5 h-3.5 w-3.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            <div className="absolute top-full left-0 hidden group-hover:block w-52 bg-card border border-border rounded-xl shadow-xl py-2 z-50">
                                                <div className="px-3 py-1.5 mb-1">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Shop by Category</span>
                                                </div>
                                                {CATEGORIES.map((cat) => (
                                                    <button
                                                        key={cat.value}
                                                        onClick={() => handleCategoryNav(cat.value)}
                                                        className={`w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors ${activeCategory === cat.value
                                                            ? 'text-primary bg-primary/8 font-semibold'
                                                            : 'text-foreground hover:bg-muted hover:text-primary'
                                                            }`}
                                                    >
                                                        {activeCategory === cat.value && (
                                                            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                                        )}
                                                        {cat.label}
                                                    </button>
                                                ))}
                                                <div className="border-t border-border mt-2 pt-2 px-4">
                                                    <Link
                                                        to="/products"
                                                        className="text-xs font-semibold text-primary hover:opacity-80 transition-opacity"
                                                    >
                                                        View All Products
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>

                                        <Link to="/products" className={navLinkClass('/products')}>
                                            Products
                                        </Link>
                                        <Link to="/about" className={navLinkClass('/about')}>
                                            About Us
                                        </Link>



                                    </>
                                ) : !accessToken ? (
                                    /* ── Landing Page (Not logged in) links ── */
                                    <>
                                        <Link to="/" className={navLinkClass('/')}>
                                            Home
                                        </Link>

                                        {/* Categories Dropdown */}
                                        <div className="relative group h-[72px] flex items-center">
                                            <button className={`flex items-center px-1 text-[15px] font-semibold transition-colors ${isCategoryActive
                                                ? 'text-primary border-b-[2.5px] border-primary h-full'
                                                : 'text-muted-foreground hover:text-primary'
                                                }`}>
                                                Categories
                                                <svg className="ml-1.5 h-3.5 w-3.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            <div className="absolute top-full left-0 hidden group-hover:block w-52 bg-card border border-border rounded-xl shadow-xl py-2 z-50">
                                                <div className="px-3 py-1.5 mb-1">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Shop by Category</span>
                                                </div>
                                                {CATEGORIES.map((cat) => (
                                                    <button
                                                        key={cat.value}
                                                        onClick={() => handleCategoryNav(cat.value)}
                                                        className={`w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors ${activeCategory === cat.value
                                                            ? 'text-primary bg-primary/8 font-semibold'
                                                            : 'text-foreground hover:bg-muted hover:text-primary'
                                                            }`}
                                                    >
                                                        {activeCategory === cat.value && (
                                                            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                                        )}
                                                        {cat.label}
                                                    </button>
                                                ))}
                                                <div className="border-t border-border mt-2 pt-2 px-4">
                                                    <Link
                                                        to="/products"
                                                        className="text-xs font-semibold text-primary hover:opacity-80 transition-opacity"
                                                    >
                                                        View All Products
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>

                                        <Link to="/products" className={navLinkClass('/products')}>
                                            Products
                                        </Link>
                                        <Link to="/cart" className={navLinkClass('/cart')}>
                                            Collections
                                        </Link>
                                        <Link to="/about" className={navLinkClass('/about')}>
                                            About Us
                                        </Link>
                                        <Link to="/community" className={navLinkClass('/community')}>
                                            Community
                                        </Link>

                                    </>
                                ) : (
                                    /* ── User links ── */
                                    <>
                                        <Link to="/" className={navLinkClass('/')}>
                                            Home
                                        </Link>

                                        {/* User Categories Dropdown */}
                                        <div className="relative group h-[72px] flex items-center">
                                            <button className={`flex items-center px-1 text-[15px] font-semibold transition-colors ${isCategoryActive
                                                ? 'text-primary border-b-[2.5px] border-primary h-full'
                                                : 'text-muted-foreground hover:text-primary'
                                                }`}>
                                                Categories
                                                <svg className="ml-1.5 h-3.5 w-3.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                            <div className="absolute top-full left-0 hidden group-hover:block w-52 bg-card border border-border rounded-xl shadow-xl py-2 z-50">
                                                <div className="px-3 py-1.5 mb-1">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Shop by Category</span>
                                                </div>
                                                {CATEGORIES.map((cat) => (
                                                    <button
                                                        key={cat.value}
                                                        onClick={() => handleCategoryNav(cat.value)}
                                                        className={`w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors ${activeCategory === cat.value
                                                            ? 'text-primary bg-primary/8 font-semibold'
                                                            : 'text-foreground hover:bg-muted hover:text-primary'
                                                            }`}
                                                    >
                                                        {activeCategory === cat.value && (
                                                            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                                        )}
                                                        {cat.label}
                                                    </button>
                                                ))}
                                                <div className="border-t border-border mt-2 pt-2 px-4">
                                                    <Link
                                                        to="/products"
                                                        className="text-xs font-semibold text-primary hover:opacity-80 transition-opacity"
                                                    >
                                                        View All Products
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>

                                        <Link to="/products" className={navLinkClass('/products')}>
                                            Products
                                        </Link>
                                        <Link to="/cart" className={navLinkClass('/cart')}>
                                            Collections
                                        </Link>
                                        <Link to="/about" className={navLinkClass('/about')}>
                                            About Us
                                        </Link>
                                        <Link to="/community" className={navLinkClass('/community')}>
                                            Community
                                        </Link>

                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right Section: Actions */}
                        <div className="flex items-center justify-end gap-5 sm:gap-6 flex-1 pr-2 lg:pr-4">

                            {/* Search Bar */}
                            <div className="hidden lg:block flex-1 max-w-[280px] xl:max-w-[340px] relative group">
                                <button 
                                    onClick={() => handleSearchSubmit({ key: 'Enter' })}
                                    className="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer text-muted-foreground hover:text-primary transition-colors z-10"
                                >
                                    <svg className="h-[16px] w-[16px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearchSubmit}
                                    className="w-full pl-10 pr-4 py-[9px] bg-[#f5f6f8] dark:bg-muted  rounded-full text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 font-medium"
                                />
                            </div>

                            {/* Cart Icon – visible for non-admin users */}
                            {!isAdmin && (
                                <Link to="/cart" className="relative text-foreground hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md" aria-label="Cart">
                                    <svg className="h-[25px] w-[25px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {cartItemCount > 0 && (
                                        <span className="absolute -top-2 -right-2.5 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground border-[2.5px] border-background">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </Link>
                            )}

                            {/* Dark / Light Mode Toggle – both User & Admin */}
                            <button
                                onClick={toggleDarkMode}
                                className="text-foreground/80 hover:text-primary transition-all duration-300 focus:outline-none hidden sm:flex items-center justify-center w-9 h-9 rounded-lg hover:bg-muted cursor-pointer"
                                aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            >
                                {isDark ? (
                                    <svg className="h-[22px] w-[22px] transition-transform duration-300 rotate-0 hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                        <circle cx="12" cy="12" r="5" />
                                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                    </svg>
                                ) : (
                                    <svg className="h-[22px] w-[22px] fill-current transition-transform duration-300" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                    </svg>
                                )}
                            </button>

                            {/* Desktop User menu – always visible */}
                            <div className="hidden md:block relative" ref={userMenuRef}>
                                {accessToken ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setUserMenuOpen((o) => !o)}
                                            className="flex items-center justify-center w-10 h-10 border-[1.5px] border-none text-primary hover:bg-primary/5 rounded-[8px] transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background cursor-pointer"
                                            aria-expanded={userMenuOpen}
                                            aria-haspopup="menu"
                                            aria-label="Account menu"
                                        >
                                            <User size={20} />
                                        </button>
                                        {userMenuOpen && (
                                            <div
                                                role="menu"
                                                className="absolute right-0 mt-2 w-64 rounded-[22px] border border-border bg-card p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right"
                                            >
                                                {/* My Products – User only */}
                                                {!isAdmin && (
                                                    <Link
                                                        to="/my-products"
                                                        role="menuitem"
                                                        onClick={() => setUserMenuOpen(false)}
                                                        className="flex items-center gap-3 px-4 py-3 text-[14px] font-bold text-foreground hover:bg-primary/5 hover:text-primary rounded-[14px] transition-all duration-200"
                                                    >
                                                        <Package size={18} className="opacity-70" />
                                                        My products
                                                    </Link>
                                                )}

                                                {/* Admin Dashboard – Admin only */}
                                                {isAdmin && (
                                                    <Link
                                                        to="/admin/dashboard"
                                                        role="menuitem"
                                                        onClick={() => setUserMenuOpen(false)}
                                                        className="flex items-center gap-3 px-4 py-3 text-[14px] font-bold text-foreground hover:bg-primary/5 hover:text-primary rounded-[14px] transition-all duration-200"
                                                    >
                                                        <LayoutDashboard size={18} className="opacity-70" />
                                                        Admin Dashboard
                                                    </Link>
                                                )}

                                                <div className="h-[1px] bg-border my-1 mx-2 opacity-50" />

                                                <button
                                                    type="button"
                                                    role="menuitem"
                                                    onClick={() => { openChangePassword(); setUserMenuOpen(false); }}
                                                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-[14px] font-bold text-foreground hover:bg-primary/5 hover:text-primary rounded-[14px] transition-all duration-200 cursor-pointer"
                                                >
                                                    <Lock size={18} className="opacity-70" />
                                                    Change Password
                                                </button>


                                                <button
                                                    type="button"
                                                    role="menuitem"
                                                    onClick={handleLogout}
                                                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-[14px] font-bold text-red-600 bg-white border-red-100 hover:bg-red-50 rounded-[14px] transition-all duration-200 cursor-pointer"
                                                >
                                                    <LogOut size={18} className="opacity-100" />
                                                    Log out
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="flex items-center gap-1.5 px-3 py-2 border-[1.5px] border-primary/40 text-primary hover:bg-primary/5 rounded-[6px] text-[15px] font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background"
                                    >
                                        <svg className="h-[18px] w-[18px] stroke-[2.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Sign in
                                    </Link>
                                )}
                            </div>

                            {/* Mobile menu button */}
                            <button
                                onClick={handleMobileMenuButton}
                                className={`${isAdminRoute ? 'lg:hidden' : 'md:hidden'} p-2 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md transition-colors`}
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
                    <div className="flex items-center gap-3">
                        {/* Mobile dark mode toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {isDark ? (
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                    <circle cx="12" cy="12" r="5" />
                                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                            )}
                        </button>
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
                </div>

                {/* Drawer Scrollable Content */}
                <div className="flex-1 overflow-y-auto py-4">
                    {/* Mobile Search Bar */}
                    <div className="px-6 mb-6">
                        <div className="relative">
                            <button 
                                onClick={() => { handleSearchSubmit({ key: 'Enter' }); setIsMobileMenuOpen(false); }}
                                className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-foreground hover:text-primary transition-colors"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearchSubmit(e);
                                        setIsMobileMenuOpen(false);
                                    }
                                }}
                                className="w-full pl-11 pr-4 py-3 bg-muted border border-transparent rounded-full text-base text-foreground focus:outline-none focus:bg-background focus:border-primary transition-all"
                            />
                        </div>
                    </div>
                    <nav className="px-4 space-y-2">

                        {/* ── Admin sidebar links ── */}
                        {isAdmin ? (
                            <>
                                <Link to="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass('/admin/dashboard')}>
                                    Dashboard
                                </Link>
                                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass('/')}>
                                    Home
                                </Link>
                                <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass('/cart')}>
                                    Collections
                                </Link>

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
                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isMobileCategoryOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="pt-1 pb-2 pl-6 pr-4 space-y-0.5 ml-4 border-l-2 border-muted/50 mt-1">
                                            {CATEGORIES.map((cat) => (
                                                <button
                                                    key={cat.value}
                                                    onClick={() => { handleCategoryNav(cat.value); setIsMobileMenuOpen(false); }}
                                                    className={`w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${activeCategory === cat.value
                                                        ? 'text-primary bg-primary/10 font-semibold'
                                                        : 'text-muted-foreground hover:text-primary hover:bg-muted'
                                                        }`}
                                                >
                                                    {activeCategory === cat.value && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                                    )}
                                                    {cat.label}
                                                </button>
                                            ))}
                                            <Link
                                                to="/products"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="block px-4 py-2 text-xs font-bold text-primary hover:opacity-80 transition-opacity rounded-md mt-1"
                                            >
                                                View All
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass('/products')}>
                                    Products
                                </Link>
                                <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass('/about')}>
                                    About Us
                                </Link>



                            </>
                        ) : !accessToken ? (
                            /* ── Landing Page (Not logged in) sidebar links ── */
                            <>
                                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass('/')}>
                                    Home
                                </Link>

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
                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isMobileCategoryOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="pt-1 pb-2 pl-6 pr-4 space-y-0.5 ml-4 border-l-2 border-muted/50 mt-1">
                                            {CATEGORIES.map((cat) => (
                                                <button
                                                    key={cat.value}
                                                    onClick={() => { handleCategoryNav(cat.value); setIsMobileMenuOpen(false); }}
                                                    className={`w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${activeCategory === cat.value
                                                        ? 'text-primary bg-primary/10 font-semibold'
                                                        : 'text-muted-foreground hover:text-primary hover:bg-muted'
                                                        }`}
                                                >
                                                    {activeCategory === cat.value && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                                    )}
                                                    {cat.label}
                                                </button>
                                            ))}
                                            <Link
                                                to="/products"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="block px-4 py-2 text-xs font-bold text-primary hover:opacity-80 transition-opacity rounded-md mt-1"
                                            >
                                                View All
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass('/products')}>
                                    Products
                                </Link>
                                <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass('/cart')}>
                                    Collections
                                </Link>
                                <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass('/about')}>
                                    About Us
                                </Link>
                                <Link to="/community" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass('/community')}>
                                    Community
                                </Link>

                            </>
                        ) : (
                            /* ── User sidebar links ── */
                            <>
                                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass('/')}>
                                    Home
                                </Link>

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
                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isMobileCategoryOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="pt-1 pb-2 pl-6 pr-4 space-y-0.5 ml-4 border-l-2 border-muted/50 mt-1">
                                            {CATEGORIES.map((cat) => (
                                                <button
                                                    key={cat.value}
                                                    onClick={() => { handleCategoryNav(cat.value); setIsMobileMenuOpen(false); }}
                                                    className={`w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${activeCategory === cat.value
                                                        ? 'text-primary bg-primary/10 font-semibold'
                                                        : 'text-muted-foreground hover:text-primary hover:bg-muted'
                                                        }`}
                                                >
                                                    {activeCategory === cat.value && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                                    )}
                                                    {cat.label}
                                                </button>
                                            ))}
                                            <Link
                                                to="/products"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="block px-4 py-2 text-xs font-bold text-primary hover:opacity-80 transition-opacity rounded-md mt-1"
                                            >
                                                View All
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass('/products')}>
                                    Products
                                </Link>
                                <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass('/cart')}>
                                    Collections
                                </Link>
                                <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass('/about')}>
                                    About Us
                                </Link>
                                <Link to="/community" onClick={() => setIsMobileMenuOpen(false)} className={mobileNavLinkClass('/community')}>
                                    Community
                                </Link>

                            </>
                        )}
                    </nav>
                </div>

                {/* Drawer Bottom Actions */}
                <div className="p-6 border-t border-border bg-muted/30">
                    <div className="flex flex-col gap-4">
                        {/* Cart link – visible for non-admin users */}
                        {!isAdmin && (
                            <Link
                                to="/cart"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center px-4 py-3 text-base font-medium text-foreground hover:bg-muted bg-background rounded-md border border-border transition-colors focus:outline-none shadow-sm ${cartItemCount > 0 ? 'justify-between' : 'justify-center'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>Cart Items</span>
                                </div>
                                {cartItemCount > 0 && (
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {accessToken ? (
                            <div className="flex flex-col gap-2">
                                {/* My Products – User only */}
                                {!isAdmin && (
                                    <Link
                                        to="/my-products"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 w-full px-4 py-3.5 text-base font-bold text-foreground border border-border bg-background hover:bg-muted rounded-xl transition-colors"
                                    >
                                        <Package size={20} />
                                        My products
                                    </Link>
                                )}

                                <button
                                    type="button"
                                    onClick={() => { setIsMobileMenuOpen(false); openChangePassword(); }}
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3.5 text-base font-bold text-foreground border border-border bg-background hover:bg-muted rounded-xl transition-colors"
                                >
                                    <Lock size={20} />
                                    Change Password
                                </button>


                                <button
                                    type="button"
                                    onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                                    className="flex items-center justify-center gap-2 w-full px-4 py-4 text-base font-bold text-red-600 border border-red-200 bg-white hover:bg-red-50 rounded-xl transition-colors mt-2 shadow-sm"
                                >
                                    <LogOut size={20} />
                                    Log out
                                </button>
                                <div className="h-20" /> {/* Spacer for BottomNav */}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-base font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md shadow-sm transition-colors focus:outline-none"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default NavBar;
