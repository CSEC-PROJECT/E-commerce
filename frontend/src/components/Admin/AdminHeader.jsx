import React from 'react';
import { Search } from 'lucide-react';

const AdminHeader = ({ title, subtitle, children }) => {
  return (
    <header className="flex flex-col mb-8 gap-6">
      <div className="flex items-center w-full">
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
