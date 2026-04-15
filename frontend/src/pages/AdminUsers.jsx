import React, { useState } from 'react';
import { DownloadCloud, Users as UsersIcon, UserPlus, MousePointerClick } from 'lucide-react';
import Sidebar from '../components/Common/Sidebar';
import AdminHeader from '../components/Admin/AdminHeader';
import StatCard from '../components/Admin/StatCard';
import UsersTable from '../components/Admin/UsersTable';

const INITIAL_USERS_DATA = [
  { id: 'USR-8821', name: 'Julian Barnes', email: 'j.barnes@outlook.com', phone: '+1 (555) 012-3344', orders: 42, spend: '$3,120.00', status: 'VIP' },
  { id: 'USR-8794', name: 'Sarah Jenkins', email: 'sarah.j@tech-atelier.io', phone: '+1 (555) 890-1122', orders: 18, spend: '$1,450.50', status: 'ACTIVE' },
  { id: 'USR-8755', name: 'Robert Miller', email: 'r.miller.99@gmail.com', phone: '+1 (555) 443-5566', orders: 0, spend: '$0.00', status: 'INACTIVE' },
  { id: 'USR-8742', name: 'Emily Chen', email: 'emily.chen@design.co', phone: '+1 (555) 776-8899', orders: 104, spend: '$12,400.00', status: 'VIP' },
  { id: 'USR-8730', name: 'Michael Chang', email: 'm.chang88@yahoo.com', phone: '+1 (555) 234-5678', orders: 5, spend: '$345.00', status: 'ACTIVE' },
];

const AdminUsers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState(INITIAL_USERS_DATA);

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== id));
    }
  };

  const handleBanUser = (id) => {
    setUsers(prev => prev.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE' } 
        : user
    ));
  };

  const handleExport = () => {
    alert("Downloading report...");
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FAFAFC] text-gray-800 font-sans">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto w-full pb-24 lg:pb-10">
        <AdminHeader 
          title="Users" 
          subtitle="Manage users and monitor activity"
        >
          <button 
            onClick={handleExport}
            className="cursor-pointer flex items-center gap-2 bg-[#EEEDFE] text-[#5542F6] px-5 py-2.5 rounded-xl text-[14px] font-bold hover:bg-[#E4E2FD] active:scale-95 transition-all shadow-sm"
          >
            <DownloadCloud size={18} />
            Export Report
          </button>
        </AdminHeader>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4">
          <StatCard 
            title="Total Users" 
            value="12,840" 
            change="+12.5%" 
            trendingInfo="vs last month" 
            icon={UserPlus} 
            iconBg="bg-indigo-50" 
            iconColor="text-[#5542F6]" 
          />
          <StatCard 
            title="New Users" 
            value="1,204" 
            change="" 
            trendingInfo="ACTIVE NOW" 
            icon={UsersIcon} 
            iconBg="bg-green-50" 
            iconColor="text-green-500" 
          />
          <StatCard 
            title="Total Visits" 
            value="84.2k" 
            change="" 
            trendingInfo="Daily average" 
            icon={MousePointerClick} 
            iconBg="bg-gray-100" 
            iconColor="text-gray-400" 
          />
        </div>

        {/* Users Table Component */}
        <UsersTable 
           users={users} 
           currentPage={currentPage}
           setCurrentPage={setCurrentPage}
           totalPages={120}
           totalUsers="1,204"
           onDelete={handleDeleteUser}
           onBan={handleBanUser}
        />

      </main>
    </div>
  );
};

export default AdminUsers;
