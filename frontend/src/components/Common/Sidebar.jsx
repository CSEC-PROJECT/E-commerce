import React from 'react';
import { LayoutDashboard, ShoppingCart, Users, Settings } from 'lucide-react';

const NAVIGATION_ITEMS = [
  { id: 'dashboard', text: 'Dashboard', icon: LayoutDashboard, active: true },
  { id: 'products', text: 'Products', icon: ShoppingCart },
  { id: 'users', text: 'Users', icon: Users },
  { id: 'settings', text: 'Settings', icon: Settings },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-[#f1f3ff] p-6 flex flex-col shrink-0 border-r border-[#DEE3E7]">
      <nav className="flex-1 space-y-2">
        {NAVIGATION_ITEMS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`flex items-center gap-3 p-3 rounded-lg text-sm font-semibold transition-colors
              ${item.active 
                ? 'bg-[#4338CA] text-white shadow-md' 
                : 'text-[#5A606D] hover:bg-white/50 hover:text-[#101928]'}`}
          >
            <item.icon size={20} strokeWidth={1.5} className={item.active ? 'text-white' : 'text-[#848199]'} />
            {item.text}
          </a>
        ))}
      </nav>

      

      {/* User Profile Mini-Card */}
      <div className="mt-auto flex items-center gap-3 bg-white p-3 rounded-xl border border-[#DEE3E7] shadow-sm">
        <img 
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" 
          alt="Admin Avatar" 
          className="w-10 h-10 rounded-lg object-cover" 
        />
        <div className="overflow-hidden">
          <p className="text-[10px] uppercase tracking-wider text-[#848199] font-bold">Admin</p>
          <p className="text-sm font-bold truncate">Alex Rivers</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;