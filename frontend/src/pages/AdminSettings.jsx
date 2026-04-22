import React from "react";
import Sidebar from "../components/Common/Sidebar";
import SettingPage from "./SettingPage";

const AdminSettings = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-[100dvh] bg-background text-foreground font-sans w-full">
      <Sidebar />
      <main className="flex-1 overflow-y-auto w-full pb-24 lg:pb-0 relative">
        <SettingPage />
      </main>
    </div>
  );
};

export default AdminSettings;
