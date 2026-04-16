import React from 'react';
import { Ban, Trash2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const UsersTable = ({ users, currentPage, totalPages, setCurrentPage, totalUsers, onDelete, onBan }) => {
  return (
    <div className="bg-white rounded-[20px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden mb-8">
      {/* Table Header / Title */}
      <div className="flex justify-between items-center p-6 border-b border-gray-100">
        <h2 className="text-xl font-extrabold text-[#1A1D1F]">Users List</h2>
        <button 
          onClick={() => alert("Filter functionality coming soon!")}
          className="cursor-pointer p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-600 active:scale-95">
          <Filter size={20} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[900px]">
          <thead>
            <tr className="bg-gray-50/50 text-[10px] text-[#92959E] uppercase font-bold tracking-widest border-b border-gray-100">
              <th className="py-4 pl-6">Customer ID</th>
              <th className="py-4">User Identity</th>
              <th className="py-4">Contact</th>
              <th className="py-4">Orders</th>
              <th className="py-4">Total Spend</th>
              <th className="py-4">Status</th>
              <th className="py-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 pl-6 text-[14px] text-gray-500 font-medium">#{user.id}</td>
                <td className="py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-[#1A1D1F] text-[14px]">{user.name}</span>
                    <span className="text-[13px] text-gray-400">{user.email}</span>
                  </div>
                </td>
                <td className="py-4 text-[14px] text-gray-500 font-medium">{user.phone}</td>
                <td className="py-4 text-[14px] text-[#1A1D1F] font-bold">{user.orders}</td>
                <td className="py-4 text-[14px] text-[#1A1D1F] font-bold font-mono">{user.spend}</td>
                <td className="py-4">
                  {user.status === 'VIP' && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider bg-green-100 text-green-600">VIP</span>
                  )}
                  {user.status === 'ACTIVE' && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider bg-blue-100 text-blue-600">ACTIVE</span>
                  )}
                  {user.status === 'INACTIVE' && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider bg-gray-100 text-gray-500">INACTIVE</span>
                  )}
                </td>
                <td className="py-4 pr-6">
                  <div className="flex justify-end gap-3 text-gray-400">
                    <button 
                      onClick={() => onBan && onBan(user.id)}
                      className={`cursor-pointer transition-all active:scale-90 ${user.status === 'INACTIVE' ? 'text-gray-800 bg-gray-100 p-1.5 rounded-lg' : 'hover:text-gray-800 p-1.5'}`}
                      title={user.status === 'INACTIVE' ? 'Unban User' : 'Ban User'}
                    >
                      <Ban size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete && onDelete(user.id)}
                      className="cursor-pointer hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all active:scale-90"
                      title="Delete User"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="7" className="py-12 text-center text-sm text-gray-500 font-medium">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-500 font-medium">
          Showing 1-{Math.min(10, users.length)} of {totalUsers} users
        </p>
        <div className="flex items-center gap-1">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="cursor-pointer p-1.5 text-gray-400 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 rounded-lg">
            <ChevronLeft size={18} />
          </button>
          
          {[1, 2, 3].map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all active:scale-95
                ${currentPage === page 
                  ? 'bg-[#5542F6] text-white shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-100'}`}
            >
              {page}
            </button>
          ))}
          <span className="px-1 text-gray-400">...</span>
          <button
            onClick={() => setCurrentPage(120)}
            className={`cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all active:scale-95
              ${currentPage === 120 ? 'bg-[#5542F6] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            120
          </button>
          
          <button 
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="cursor-pointer p-1.5 text-gray-400 hover:text-gray-800 transition-colors ml-1 hover:bg-gray-100 rounded-lg">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
