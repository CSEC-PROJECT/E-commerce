import React from 'react';
import { Ban, Trash2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const UsersTable = ({ users = [], currentPage, setCurrentPage, totalPages = 1, totalUsers = 0, onDelete, onBan }) => {
  // Generate pagination range dynamically
  const getPaginationGroup = () => {
    let start = Math.max(currentPage - 1, 1);
    let end = Math.min(start + 2, totalPages);

    if (end - start < 2 && totalPages >= 3) {
      if (start === 1) end = 3;
      else Math.max(totalPages - 2, 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="bg-card rounded-[20px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-border/40 overflow-hidden mb-8 transition-colors">
      {/* Table Header / Title */}
      <div className="flex justify-between items-center p-6 border-b border-border/40">
        <h2 className="text-xl font-extrabold text-foreground">Users List</h2>
        <button
          onClick={() => alert("Filter functionality coming soon!")}
          className="cursor-pointer p-2 hover:bg-muted rounded-xl transition-all text-muted-foreground hover:text-foreground active:scale-95">
          {/* <Filter size={20} /> */}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[900px]">
          <thead>
            <tr className="bg-muted/30 text-[10px] text-muted-foreground uppercase font-bold tracking-widest border-b border-border/40">
              <th className="py-4 pl-6">Customer ID</th>
              <th className="py-4">User Identity</th>
              <th className="py-4">Role</th>
              <th className="py-4">Status</th>
              <th className="py-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-muted/40 transition-colors">
                <td className="py-4 pl-6 text-[14px] text-muted-foreground font-medium">#{user._id?.slice(-6)}</td>
                <td className="py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground text-[14px]">{user.name}</span>
                    <span className="text-[13px] text-muted-foreground">{user.email}</span>
                  </div>
                </td>
                <td className="py-4 text-[14px] text-foreground font-bold capitalize">
                  {Array.isArray(user.role) ? user.role.join(", ") : (user.role || 'User')}
                </td>
                <td className="py-4">
                  {user.isVerified ? (
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider bg-green-500/10 text-green-500">VERIFIED</span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider bg-gray-500/10 text-gray-500">UNVERIFIED</span>
                  )}
                </td>
                <td className="py-4 pr-6">
                  <div className="flex justify-end gap-3 text-muted-foreground">
                    <button
                      onClick={() => onBan && onBan(user._id)}
                      className={`cursor-pointer transition-all active:scale-90 hover:bg-muted hover:text-foreground p-1.5 rounded-lg`}
                      title="Ban User"
                    >
                      <Ban size={18} />
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(user._id)}
                      className="cursor-pointer hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg transition-all active:scale-90"
                      title="Delete User"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {(!users || users.length === 0) && (
              <tr>
                <td colSpan="5" className="py-12 text-center text-sm text-muted-foreground font-medium">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="p-6 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4 bg-card">
          <p className="text-sm text-muted-foreground font-medium">
            Showing page {currentPage} of {totalPages} ({totalUsers} total users)
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="cursor-pointer p-1.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted rounded-lg">
              <ChevronLeft size={18} />
            </button>

            {getPaginationGroup().map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all active:scale-95
                  ${currentPage === page
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted'}`}
              >
                {page}
              </button>
            ))}

            {totalPages > 3 && currentPage < totalPages - 1 && (
              <>
                <span className="px-1 text-muted-foreground">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all active:scale-95 hover:bg-muted text-muted-foreground`}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="cursor-pointer p-1.5 text-muted-foreground hover:text-foreground transition-colors ml-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted rounded-lg">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
