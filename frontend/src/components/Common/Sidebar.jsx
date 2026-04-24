import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, Wallet, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const NAVIGATION_ITEMS = [
  { id: 'dashboard', text: 'Dashboard', icon: LayoutDashboard, to: '/admin/dashboard' },
  { id: 'products', text: 'Products', icon: ShoppingBag, to: '/admin/products' },
  { id: 'users', text: 'Users', icon: Users, to: '/admin/users' },
  { id: 'earnings', text: 'Earnings', icon: Wallet, to: '/admin/earnings' },
  { id: 'settings', text: 'Settings', icon: Settings, to: '/admin/settings' },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setIsMobileSidebarOpen(false);
      navigate('/');
    }
  };

  useEffect(() => {
    const handleToggle = () => {
      if (isAdminRoute) {
        setIsMobileSidebarOpen((prev) => !prev);
      }
    };

    window.addEventListener('admin-sidebar:toggle', handleToggle);
    return () => window.removeEventListener('admin-sidebar:toggle', handleToggle);
  }, [isAdminRoute]);

  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  return (
    <>
      <aside className="hidden lg:flex w-64 bg-card h-[calc(100vh-72px)] flex-col border-r border-border sticky top-[72px] self-start overflow-y-auto">
        <nav className="flex-1 pt-6">
          {NAVIGATION_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              end={item.id === 'dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-4 px-8 py-4 text-[14px] font-bold transition-all relative
                ${isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-primary hover:bg-muted'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-primary" />
                  )}
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  {item.text}
                </>
              )}
            </NavLink>
          ))}
        </nav>

      </aside>

      {isAdminRoute && (
        <>
          {isMobileSidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
              onClick={() => setIsMobileSidebarOpen(false)}
              aria-hidden="true"
            />
          )}

          <aside className={`lg:hidden fixed top-[72px] bottom-0 left-0 w-72 max-w-[85vw] bg-card border-r border-border z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h2 className="text-sm font-bold text-foreground">Admin Menu</h2>
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                aria-label="Close admin sidebar"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="pt-2 flex-1 overflow-y-auto">
              {NAVIGATION_ITEMS.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.to}
                  end={item.id === 'dashboard'}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-primary hover:bg-muted'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                      {item.text}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="border-t border-border p-3">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-destructive text-destructive font-semibold hover:bg-destructive/10 transition-colors"
              >
                <LogOut size={17} />
                Log out
              </button>
            </div>
          </aside>
        </>
      )}

    </>
  );
};

export default Sidebar;
