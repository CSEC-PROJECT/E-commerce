import React, { useEffect, useState, useMemo } from 'react';
import { MoreVertical, Filter, Search, Plus, Loader2 } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Common/Sidebar';
import { useAdminStore } from '../store/adminStore';
import { useProductStore } from '../store/productStore';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const {
    stats, salesPerformance, recentOrders, bestSellingProducts,
    loadingStats, loadingSales, loadingOrders, loadingBestSelling,
    fetchAll
  } = useAdminStore();

  const { products: searchProducts, fetchProducts } = useProductStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [transactionFilter, setTransactionFilter] = useState('All');
  const [transactionPage, setTransactionPage] = useState(1);
  const transactionsPerPage = 5;

  // Initial fetch
  useEffect(() => {
    fetchAll();
    fetchProducts({ limit: 3 }); // Initial top products without search
  }, []);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== null) {
        fetchProducts({ search: searchTerm, limit: 3 });
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // --- Transactions Logic ---
  const filteredTransactions = useMemo(() => {
    let filtered = recentOrders || [];
    if (transactionFilter !== 'All') {
      filtered = filtered.filter(t => t.paymentStatus?.toLowerCase() === transactionFilter.toLowerCase() || t.status?.toLowerCase() === transactionFilter.toLowerCase());
    }
    // ensure sorted by latest (should be from backend but just in case)
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [recentOrders, transactionFilter]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (transactionPage - 1) * transactionsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + transactionsPerPage);
  }, [filteredTransactions, transactionPage]);

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  const handleNextPage = () => {
    if (transactionPage < totalPages) setTransactionPage(transactionPage + 1);
  };
  const handlePrevPage = () => {
    if (transactionPage > 1) setTransactionPage(transactionPage - 1);
  };

  const getStatusColor = (status) => {
    if (!status) return "text-gray-500";
    const s = status.toLowerCase();
    if (s === 'paid' || s === 'delivered' || s === 'shipped') return "text-success";
    if (s === 'pending') return "text-warning";
    if (s === 'cancelled' || s === 'failed') return "text-error";
    return "text-gray-500";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    const d = new Date(dateString);
    const day = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleString('default', { month: 'short' });
    const time = d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).toLowerCase();
    return `${day} ${month} | ${time}`;
  };

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return "$0";
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
    return `$${val}`;
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background text-foreground font-sans">
      <Sidebar />
      <main className="flex-1 p-4 md:p-10 overflow-y-auto space-y-6 md:space-y-10 pb-24 lg:pb-10">

        {/* Row 1: Top Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {loadingStats ? (
            <div className="col-span-1 md:col-span-2 xl:col-span-3 flex justify-center py-10"><Loader2 className="animate-spin text-primary" size={32} /></div>
          ) : (
            <>
              <StatCard
                title="Total Sales"
                value={formatCurrency(stats?.grossRevenue)}
                subValue="Sales"
                subDetail="Gross Revenue"
                color="text-success"
                onClick={() => navigate('/admin/earnings')}
              />
              <StatCard
                title="Total Orders"
                value={stats?.totalOrders || 0}
                subValue="Orders"
                subDetail="Total processed orders"
                color="text-success"
                onClick={() => navigate('/admin/products')}
              />
              <StatCard
                isDouble
                title="Pending & Canceled"
                value={stats?.pendingOrders || 0}
                value2={stats?.cancelledOrders || 0}
                sub1="Pending"
                sub2="Canceled"
                onClick={() => document.getElementById('recent-transactions')?.scrollIntoView({ behavior: 'smooth' })}
              />
            </>
          )}
        </section>

        {/* Row 2: Charts & Region */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="col-span-1 lg:col-span-8 bg-card p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-border shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h3 className="text-xl font-bold tracking-tight  dark:text-primary">Weekly Sales Performance</h3>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-1">Revenue analysis for the past 7 days</p>
              </div>
              <div className="flex bg-muted dark:bg-muted p-1.5 rounded-2xl w-full sm:w-auto">
                <span className="flex-1 sm:flex-none px-6 py-2 bg-card shadow-sm rounded-xl text-xs font-bold text-primary cursor-default">This week</span>
              </div>
            </div>

            {loadingSales ? (
              <div className="h-[250px] md:h-[280px] w-full flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>
            ) : (
              <div className="h-[250px] md:h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesPerformance.length > 0 ? salesPerformance : [{ day: 'SUN', sales: 0 }]} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="var(--border)" />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'var(--primary)', fontSize: 12, fontWeight: 600 }}
                      dy={10}
                      padding={{ left: 10, right: 10 }}
                    />
                    <YAxis hide={true} />
                    <Area type="monotone" dataKey="sales" stroke="var(--primary)" strokeWidth={4} fill="url(#colorVal)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="flex flex-wrap justify-between gap-4 mt-8 pt-6 border-t border-border">
              <MiniInfo label="NEW CUSTOMERS" value={stats?.newCustomers || 0} />
              <MiniInfo label="ACTIVE PRODUCTS" value={stats?.activeProducts || 0} />
              <MiniInfo label="GROSS REVENUE" value={formatCurrency(stats?.grossRevenue)} />
            </div>
          </div>

          <div className="col-span-1 lg:col-span-4 space-y-6">
            <div className="bg-primary text-primary-foreground p-8 rounded-[2rem] text-white relative">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#00FF00] rounded-full animate-pulse" />
                <span className="text-[11px] font-bold tracking-widest uppercase">LIVE NOW</span>
              </div>
              <h2 className="text-[48px] md:text-[56px] font-bold mt-4 leading-none">---</h2>
              <p className="text-[14px] opacity-70 mb-10">Users browsing the store</p>
              <div className="flex gap-1.5 items-end h-16">
                {[40, 25, 45, 90, 35, 40].map((h, i) => (
                  <div key={i} className={`flex-1 rounded-md ${i === 3 ? 'bg-card' : 'bg-card/30'}`} style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
            <div className="bg-card p-8 rounded-[2rem] border border-border shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold dark:text-primary">Sales by Region</h3>
                <span className="text-xs font-bold cursor-default">Full Map</span>
              </div>
              <RegionRow label="N/A" percent={0} />
              <RegionRow label="N/A" percent={0} />
              <RegionRow label="N/A" percent={0} />
              {/* <RegionRow label="United States" percent={42} />
              <RegionRow label="United Kingdom" percent={18} />
              <RegionRow label="Germany" percent={12} /> */}
            </div>
          </div>
        </section>

        {/* Row 3: Recent Transactions */}
        <section id="recent-transactions" className="bg-card rounded-[2rem] border border-border p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="text-xl font-bold dark:text-primary">Recent Transaction</h3>

            <div className="flex items-center gap-4">
              <select
                value={transactionFilter}
                onChange={(e) => { setTransactionFilter(e.target.value); setTransactionPage(1); }}
                className="bg-muted dark:bg-muted text-sm font-bold dark:text-primary rounded-xl px-4 py-2 border-none outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="All">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              {/* <span className="flex items-center gap-2 bg-[#5CB85C] text-white px-5 py-2.5 rounded-xl text-sm font-bold cursor-default">
                <Filter size={16} /> Filter
              </span> */}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="text-muted-foreground dark:text-muted-foreground text-xs font-bold uppercase tracking-wider border-b border-border">
                  <th className="pb-4">No</th>
                  <th className="pb-4">Id Customer</th>
                  <th className="pb-4">Order Date</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {loadingOrders ? (
                  <tr>
                    <td colSpan="5" className="py-10 text-center"><Loader2 className="animate-spin inline-block text-primary" size={24} /></td>
                  </tr>
                ) : paginatedTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-muted-foreground font-bold">No transactions found.</td>
                  </tr>
                ) : (
                  paginatedTransactions.map((t, idx) => {
                    const status = t.paymentStatus !== "Pending" ? t.paymentStatus : t.status;
                    const isPaid = status?.toLowerCase() === "paid";
                    return (
                      <tr key={t._id} className="group hover:bg-muted/50">
                        <td className="py-5 text-muted-foreground dark:text-muted-foreground font-medium">{(transactionPage - 1) * transactionsPerPage + idx + 1}.</td>
                        <td className="py-5 font-bold dark:text-primary">#{t._id.substring(t._id.length - 6).toUpperCase()}</td>
                        <td className="py-5 dark:text-primary font-medium">{formatDate(t.createdAt)}</td>
                        <td className={`py-5 font-bold flex items-center gap-2 ${getStatusColor(status)}`}>
                          <span className="w-2 h-2 rounded-full bg-current" /> {status}
                        </td>
                        <td className="py-5 font-bold dark:text-primary">${(t.totalPrice || 0).toFixed(2)}</td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 py-2">
              <button
                disabled={transactionPage === 1}
                onClick={handlePrevPage}
                className="px-4 py-2 border border-primary rounded-xl text-primary text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:text-primary-foreground transition-all">
                Previous
              </button>
              <span className="text-xs font-bold text-muted-foreground dark:text-muted-foreground">Page {transactionPage} of {totalPages}</span>
              <button
                disabled={transactionPage === totalPages}
                onClick={handleNextPage}
                className="px-4 py-2 border border-primary rounded-xl text-primary text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary hover:text-primary-foreground transition-all">
                Next
              </button>
            </div>
          )}
        </section>

        {/* Row 4: Best Selling & Add Product */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8">
          <div className="col-span-1 lg:col-span-8 bg-card p-6 md:p-8 rounded-[2rem] border border-border shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold dark:text-primary">Best selling product</h3>
              {/* <button className="flex items-center gap-2 bg-[#5CB85C] text-white px-5 py-2 rounded-xl text-sm font-bold cursor-pointer">
                <Filter size={16} /> Filter
              </button> */}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="bg-secondary text-[10px] text-muted-foreground dark:text-muted-foreground uppercase font-bold tracking-widest text-left">
                    <th className="p-4 rounded-l-xl pl-6">Product</th>
                    <th className="p-4">Total Order</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 rounded-r-xl pr-6">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loadingBestSelling ? (
                    <tr><td colSpan="4" className="py-10 text-center"><Loader2 className="animate-spin inline-block text-primary" size={24} /></td></tr>
                  ) : bestSellingProducts.length > 0 ? (
                    bestSellingProducts.map((p, i) => {
                      const details = p.productDetails;
                      const isStocked = details?.stock > 0;
                      return (
                        <tr key={i} className="hover:bg-muted/30">
                          <td className="py-4 flex items-center gap-4 pl-2">
                            <img src={details?.coverImage || ''} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                            <span className="font-bold text-sm dark:text-primary">{details?.name || "Unknown Product"}</span>
                          </td>
                          <td className="py-4 text-sm font-bold dark:text-primary">{p.totalOrdered}</td>
                          <td className="py-4">
                            <span className={`flex items-center gap-2 font-bold text-xs ${isStocked ? 'text-success' : 'text-error'}`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current" /> {isStocked ? 'Stock' : 'Stock out'}
                            </span>
                          </td>
                          <td className="py-4 font-bold text-primary text-sm">${details?.price?.toFixed(2) || "0.00"}</td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr><td colSpan="4" className="py-6 text-center text-sm font-bold opacity-50">No best selling products recorded yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <button
              onClick={() => navigate('/admin/products')}
              className="w-full mt-6 py-3.5 border border-primary rounded-xl text-primary font-bold text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all"
            >
              View All Products
            </button>
          </div>

          <div className="col-span-1 lg:col-span-4 space-y-6">
            <div className="bg-card p-8 rounded-[2rem] border border-border shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold dark:text-primary">Top Products</h3>
                <button onClick={() => navigate('/admin/products')} className="text-primary text-[10px] font-bold uppercase cursor-pointer hover:underline">All product</button>
              </div>
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search"
                  className="w-full bg-muted dark:bg-muted rounded-xl py-3 pl-11 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>
              <div className="space-y-6">
                {searchProducts.length > 0 ? (
                  searchProducts.map(prod => (
                    <TopProductItem
                      key={prod._id}
                      name={prod.name}
                      price={`$${prod.price.toFixed(2)}`}
                      id={`#${prod._id.substring(prod._id.length - 6).toUpperCase()}`}
                      img={prod.coverImage}
                      onClick={() => navigate(`/product/${prod._id}`)}
                    />
                  ))
                ) : (
                  <p className="text-sm font-bold text-muted-foreground text-center">No products found</p>
                )}
              </div>
            </div>

            <div className="border-2 border-dashed border-accent rounded-[2rem] p-8 flex flex-col items-center text-center bg-surface-soft dark:bg-background">
              <button onClick={() => navigate('/admin/add-product')} className="w-14 h-14 bg-accent dark:bg-muted text-primary rounded-2xl flex items-center justify-center mb-4 cursor-pointer hover:scale-105 active:scale-95 transition-transform">
                <Plus size={28} strokeWidth={3} />
              </button>
              <h4 className="font-bold text-lg dark:text-primary">Add New Product</h4>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-2 mb-6 px-4">Select a category below to start listing your next best-seller</p>
              <div className="flex gap-3">
                <button onClick={() => navigate('/admin/add-product?category=Electronics')} className="px-5 py-2 bg-card border border-border dark:border-border rounded-xl text-[10px] font-bold uppercase shadow-sm cursor-pointer hover:border-primary">Electronics</button>
                <button onClick={() => navigate('/admin/add-product?category=Fashion')} className="px-5 py-2 bg-card border border-border dark:border-border rounded-xl text-[10px] font-bold uppercase shadow-sm cursor-pointer hover:border-primary">Fashion</button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

/* --- STAT CARD --- */
const StatCard = ({ title, value, value2, subValue, subDetail, color, isDouble, sub1, sub2, onClick }) => (
  <div className="bg-card p-6 rounded-[2.5rem] border border-border shadow-sm flex flex-col justify-between h-full min-h-[220px]">
    <div>
      <div className="flex justify-center items-center text-muted-foreground dark:text-muted-foreground mb-5">
        <span className="text-[10px] font-bold uppercase tracking-widest">{title}</span>
        {/* <MoreVertical size={18} className="cursor-pointer" /> */}
      </div>
      {isDouble ? (
        <div className="flex items-center justify-center gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="text-[28px] md:text-[32px] font-black leading-none dark:text-primary">{value}</div>
            <div className="text-[9px] text-muted-foreground dark:text-muted-foreground uppercase mt-2 font-bold tracking-tight">
              {sub1}
            </div>
          </div>
          <div className="w-[1px] h-10 bg-border self-center" />
          <div className="flex flex-col items-center text-center">
            <div className="text-[28px] md:text-[32px] font-black text-error leading-none">{value2}</div>
            <div className="text-[9px] text-muted-foreground dark:text-muted-foreground uppercase mt-2 font-bold tracking-tight">
              {sub2}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center text-center gap-1 mb-1">
            <div className="flex items-baseline gap-2">
              <span className="text-[38px] md:text-[44px] font-black leading-none tracking-tight dark:text-primary">{value}</span>
              <span className={`text-[10px] font-bold ${color}`}>{subValue}</span>
            </div>
            <p className="text-[9px] text-muted-foreground dark:text-muted-foreground mt-1.5 uppercase font-extrabold tracking-widest">{subDetail}</p>
          </div>
        </>
      )}
    </div>
    <div className="flex justify-end mt-4">
      {onClick && (
        <button
          onClick={onClick}
          className="text-[10px] font-bold border border-primary/30 px-5 py-2 rounded-xl text-primary cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all"
        >
          Details
        </button>
      )}
    </div>
  </div>
);

const MiniInfo = ({ label, value, color = "dark:text-primary" }) => (
  <div>
    <p className="text-[10px] text-muted-foreground dark:text-muted-foreground font-bold mb-1 uppercase tracking-wider">{label}</p>
    <p className={`text-lg md:text-xl font-black ${color}`}>{value}</p>
  </div>
);

const RegionRow = ({ label, percent }) => (
  <div className="mb-5 last:mb-0">
    <div className="flex justify-between text-xs font-bold mb-2">
      <span className="flex items-center gap-2 dark:text-primary">
        <div className="w-1 h-3 bg-primary text-primary-foreground rounded-full" /> {label}
      </span>
      <span className="dark:text-primary">{percent}%</span>
    </div>
    <div className="w-full bg-muted dark:bg-muted h-1.5 rounded-full overflow-hidden">
      <div className="bg-primary text-primary-foreground h-full rounded-full transition-all duration-700" style={{ width: `${percent}%` }} />
    </div>
  </div>
);

const TopProductItem = ({ name, price, id, img, onClick }) => (
  <div onClick={onClick} className="flex items-center justify-between group cursor-pointer">
    <div className="flex items-center gap-3">
      <img src={img} className="w-11 h-11 rounded-lg object-cover bg-gray-100" />
      <div>
        <p className="text-sm font-bold dark:text-primary transition-colors group-hover:text-primary">{name}</p>
        <p className="text-[10px] text-muted-foreground dark:text-muted-foreground font-semibold mt-0.5">Item: {id}</p>
      </div>
    </div>
    <span className="text-sm font-bold dark:text-primary">{price}</span>
  </div>
);

export default AdminDashboard;