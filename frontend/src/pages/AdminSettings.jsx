import React from "react";
import Sidebar from "../components/Common/Sidebar";
import AdminChangePassword from "../components/Admin/AdminChangePassword";
import AdminHeader from "../components/Admin/AdminHeader";

const AdminSettings = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FAFAFC] text-gray-800 font-sans">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10 overflow-y-auto w-full pb-24 lg:pb-10">
        <AdminHeader title="Settings" subtitle="Admin account and security" />
        <div className="mt-8 max-w-xl">
          <AdminChangePassword onClose={() => {}} />
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
