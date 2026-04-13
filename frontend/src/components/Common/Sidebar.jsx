import React from 'react';
import { LayoutDashboard, ShoppingBag, Users, Wallet, Settings } from 'lucide-react';

const NAVIGATION_ITEMS = [
  { id: 'dashboard', text: 'Dashboard', icon: LayoutDashboard, active: true },
  { id: 'products', text: 'Products', icon: ShoppingBag },
  { id: 'users', text: 'Users', icon: Users },
  { id: 'finance', text: 'Finance', icon: Wallet },
  { id: 'settings', text: 'Settings', icon: Settings },
];

const Sidebar = () => {
  return (
    <>
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex w-64 bg-white min-h-screen flex-col border-r border-[#F4F5F7] sticky top-0">
        <nav className="flex-1 pt-6">
          {NAVIGATION_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`flex items-center gap-4 px-8 py-4 text-[14px] font-bold transition-all relative
                ${item.active 
                  ? 'bg-[#F4F5FF] text-[#5542F6]' 
                  : 'text-[#92959E] hover:text-[#5542F6] hover:bg-gray-50'}`}
            >
              {item.active && (
                <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#5542F6]" />
              )}
              <item.icon size={20} strokeWidth={item.active ? 2.5 : 2} />
              {item.text}
            </a>
          ))}
        </nav>

        <div className="p-8 mt-auto border-t border-[#F4F5F7] hover:bg-gray-50 cursor-pointer transition-colors">
          <div className="flex items-center gap-3">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" 
              alt="Admin" 
              className="w-10 h-10 rounded-xl object-cover shadow-sm" 
            />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-[#1A1D1F] truncate">Admin User</p>
              <p className="text-[10px] text-[#92959E] uppercase font-extrabold tracking-tight">Chief Operations</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#F4F5F7] flex justify-around items-center py-3 z-50">
        {NAVIGATION_ITEMS.map((item) => (
          <a key={item.id} href={`#${item.id}`} className={`p-2 ${item.active ? 'text-[#5542F6]' : 'text-[#92959E]'}`}>
            <item.icon size={24} />
          </a>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;