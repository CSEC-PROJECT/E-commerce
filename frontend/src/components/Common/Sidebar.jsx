import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, Wallet, Settings } from 'lucide-react';

const NAVIGATION_ITEMS = [
  { id: 'dashboard', text: 'Dashboard', icon: LayoutDashboard, to: '/admin/dashboard' },
  { id: 'products', text: 'Products', icon: ShoppingBag, to: '/admin/products' },
  { id: 'users', text: 'Users', icon: Users, to: '/admin/users' },
  { id: 'earnings', text: 'Earnings', icon: Wallet, to: '/admin/earnings' },
  { id: 'settings', text: 'Settings', icon: Settings, to: '/admin/settings' },
];

const Sidebar = () => {
  return (
    <>
      <aside className="hidden lg:flex w-64 bg-white dark:bg-card min-h-screen flex-col border-r border-[#F4F5F7] dark:border-border sticky top-0">
        <nav className="flex-1 pt-6">
          {NAVIGATION_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              end={item.id === 'dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-4 px-8 py-4 text-[14px] font-bold transition-all relative
                ${isActive
                  ? 'bg-[#F4F5FF] dark:bg-muted text-[#5542F6]'
                  : 'text-[#92959E] dark:text-muted-foreground hover:text-[#5542F6] hover:bg-gray-50 dark:bg-muted'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-primary text-primary-foreground" />
                  )}
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  {item.text}
                </>
              )}
            </NavLink>
          ))}
        </nav>

      </aside>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-card border-t border-[#F4F5F7] dark:border-border flex justify-around items-center py-3 z-50">
        {NAVIGATION_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={item.to}
            end={item.id === 'dashboard'}
            className={({ isActive }) =>
              `p-2 rounded-lg ${isActive ? 'text-[#5542F6] bg-[#F4F5FF] dark:bg-muted' : 'text-[#92959E] dark:text-muted-foreground'}`
            }
            aria-label={item.text}
          >
            {({ isActive }) => <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />}
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
