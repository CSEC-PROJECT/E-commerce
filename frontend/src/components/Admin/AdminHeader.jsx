import React from 'react';
import { Search, Bell, Sun, Moon } from 'lucide-react';

const AdminHeader = ({ title, subtitle, children }) => {
  return (
    <header className="flex flex-col mb-8 gap-6">
      <div className="flex items-center justify-between w-full">
        {/* Search */}
        <div className="relative flex-1 max-w-xl group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search data, users, or reports"
            className="w-full bg-gray-50 border border-transparent rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/10 text-gray-800 transition-all shadow-sm"
          />
        </div>
        
        {/* Right Actions */}
        <div className="flex items-center gap-4 ml-6">
          <button 
            onClick={() => alert("No new notifications!")}
            className="cursor-pointer text-gray-400 hover:text-gray-800 hover:bg-muted transition-all p-2.5 rounded-full active:scale-90"
          >
            <Bell size={20} />
          </button>
          <div className="flex items-center bg-gray-100/80 rounded-full p-1 border border-gray-200">
            <button 
              onClick={() => {}} 
              className="cursor-pointer p-1.5 rounded-full bg-white shadow-sm text-gray-800 active:scale-95 transition-all"
            >
              <Sun size={16} />
            </button>
            <button 
              onClick={() => alert("Dark mode coming soon!")} 
              className="cursor-pointer p-1.5 rounded-full text-gray-400 hover:text-gray-800 hover:bg-white/50 active:scale-95 transition-all"
            >
              <Moon size={16} />
            </button>
          </div>
          <button 
            onClick={() => alert("Opening profile...")}
            className="cursor-pointer active:scale-95 transition-all rounded-full overflow-hidden ml-2 ring-2 ring-transparent hover:ring-blue-500/30"
          >
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop" 
              alt="User Avatar" 
              className="w-10 h-10 object-cover border-2 border-white shadow-sm" 
            />
          </button>
        </div>
      </div>

      <div className="flex items-end justify-between w-full">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1A1D1F] mb-1">{title}</h1>
          {subtitle && <p className="text-sm text-[#92959E]">{subtitle}</p>}
        </div>
        <div>
          {children}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
