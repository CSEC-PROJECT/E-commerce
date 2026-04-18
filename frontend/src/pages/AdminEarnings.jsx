import React from "react";
import Sidebar from "../components/Common/Sidebar";
import FinanceAnalytics from "./FinanceAnalytics";

const AdminEarnings = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background font-sans">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-x-hidden">
        <FinanceAnalytics embedded />
      </div>
    </div>
  );
};

export default AdminEarnings;
