import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Common/Sidebar';

const AdminLayout = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background text-foreground font-sans">
      <Sidebar />
      <main className="flex-1 p-4 md:p-10 overflow-y-auto pb-24 lg:pb-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
