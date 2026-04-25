import React, { useState, useEffect } from 'react';
import { DownloadCloud, Users as UsersIcon, UserPlus, MousePointerClick, Search } from 'lucide-react';
import AdminHeader from '../components/Admin/AdminHeader';
import StatCard from '../components/Admin/StatCard';
import UsersTable from '../components/Admin/UsersTable';
import ConfirmModal from '../components/Admin/ConfirmModal';
import { useUserStore } from '../store/userStore';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const { users, fetchUsers, deleteUser, toggleBanUser, totalUsers, totalPages, loading, error } = useUserStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchUsers({ page: currentPage, limit: 10, search: debouncedSearch });
  }, [currentPage, debouncedSearch, fetchUsers]);

  const handleDeleteClick = (id) => {
    setUserToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      const success = await deleteUser(userToDelete);
      if (success) {
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
      }
    }
  };

  const handleBanUser = async (id) => {
    await toggleBanUser(id);
  };

  const handleExport = () => {
    if (!users || users.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = ["Customer ID", "Name", "Email", "Verified", "Role"];
    const csvRows = [];
    csvRows.push(headers.join(","));

    users.forEach(u => {
      const row = [
        `USR-${u._id?.substring(u._id.length - 4)}`,
        `"${u.name}"`,
        `"${u.email}"`,
        u.isVerified ? "Yes" : "No",
        Array.isArray(u.role) ? u.role.join(" ") : (u.role || "user")
      ];
      csvRows.push(row.join(","));
    });

    const csvData = csvRows.join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "admin_users_report.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              className="flex h-11 w-full rounded-xl border border-input bg-card pl-10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary h-12 transition-all shadow-sm"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleExport}
            className="cursor-pointer flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/20 active:scale-95 transition-all shadow-sm"
          >
            <DownloadCloud size={18} />
            Export Report
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4">
          <StatCard
            title="Total Users"
            value={totalUsers || "0"}
            change=""
            trendingInfo="vs last month"
            icon={UserPlus}
            iconBg="bg-primary/10 dark:bg-primary/10"
            iconColor="text-primary dark:text-primary"
          />
          <StatCard
            title="New Users"
            value="--"
            change=""
            trendingInfo="ACTIVE NOW"
            icon={UsersIcon}
            iconBg="bg-success/10"
            iconColor="text-success"
          />
          <StatCard
            title="Total Visits"
            value="--"
            change=""
            trendingInfo="Daily average"
            icon={MousePointerClick}
            iconBg="bg-muted"
            iconColor="text-muted-foreground dark:text-muted-foreground"
          />
        </div>

        {/* Users Table Component */}
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-[1px] flex items-center justify-center rounded-[20px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          <UsersTable
            users={users}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            totalUsers={totalUsers}
            onDelete={handleDeleteClick}
            onBan={handleBanUser}
          />
        </div>

        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Delete User"
          message="Are you sure you want to permanently delete this user? This action cannot be undone."
          confirmText="Yes, Delete User"
          isLoading={loading}
        />
    </div>
  );
};

export default AdminUsers;
