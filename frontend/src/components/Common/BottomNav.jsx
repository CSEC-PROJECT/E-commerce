import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
    Home, 
    ShoppingBag, 
    ShoppingCart, 
    User, 
    LayoutDashboard, 
    Users, 
    Wallet, 
    Settings,
    Info,
    Users as UsersIcon
} from 'lucide-react';

import { useAuthStore } from '../../store/authStore';
import useCartStore from '../../store/cartStore';

const BottomNav = () => {
    const location = useLocation();
    const { user, accessToken } = useAuthStore();
    const cart = useCartStore((state) => state.cart);
    const cartItemCount = cart?.items?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;

    const isAdmin = !!accessToken && (Array.isArray(user?.role)
        ? user.role.includes('admin')
        : user?.role === 'admin');

    const hideNav = ['/login', '/signup', '/forgot-password'].includes(location.pathname) || 
                    location.pathname.startsWith('/reset-password');

    if (hideNav) return null;

    const adminItems = [
        { id: 'home', icon: Home, to: '/', label: 'Home' },
        { id: 'products', icon: ShoppingBag, to: '/products', label: 'Shop' },
        { id: 'cart', icon: ShoppingCart, to: '/cart', label: 'Cart', badge: cartItemCount },
        { id: 'about', icon: Info, to: '/about', label: 'About' },
        { id: 'settings', icon: User, to: '/settings', label: 'Account' },


    ];

    const userItems = [
        { id: 'home', icon: Home, to: '/', label: 'Home' },
        { id: 'products', icon: ShoppingBag, to: '/products', label: 'Shop' },
        { id: 'cart', icon: ShoppingCart, to: '/cart', label: 'Cart', badge: cartItemCount },
        { id: 'about', icon: Info, to: '/about', label: 'About' },
        { id: 'community', icon: UsersIcon, to: '/community', label: 'Community' },
        { id: 'settings', icon: User, to: '/settings', label: 'Account' },

    ];

    const items = isAdmin ? adminItems : userItems;

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around items-center py-2 pb-safe-area-inset-bottom z-50 shadow-lg">
            {items.map((item) => (
                <NavLink
                    key={item.id}
                    to={item.to}
                    end={item.id === 'home' || item.id === 'dashboard'}
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-300 relative ${
                            isActive 
                                ? 'text-primary' 
                                : 'text-muted-foreground hover:text-foreground'
                        }`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-primary/10' : ''}`}>
                                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={`text-[10px] font-bold mt-0.5 tracking-tight ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                                {item.label}
                            </span>
                            {item.badge > 0 && (
                                <span className="absolute top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white border-2 border-card">
                                    {item.badge}
                                </span>
                            )}
                            {isActive && (
                                <div className="absolute -top-2 w-1 h-1 bg-primary rounded-full" />
                            )}
                        </>
                    )}
                </NavLink>
            ))}
        </nav>
    );
};

export default BottomNav;
