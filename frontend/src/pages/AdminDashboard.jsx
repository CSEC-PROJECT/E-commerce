import React from 'react';
import { MoreVertical, Filter, Search, Plus } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import Sidebar from '../components/Common/Sidebar';

const SALES_DATA = [
  { name: 'MON', value: 30 }, { name: 'TUE', value: 40 }, { name: 'WED', value: 35 },
  { name: 'THU', value: 55 }, { name: 'FRI', value: 85 }, { name: 'SAT', value: 40 }, { name: 'SUN', value: 75 },
];

const RECENT_TRANSACTIONS = [
  { id: "#6545", date: "01 Oct | 11:29 am", status: "Paid", amount: "$64", color: "text-[#5CB85C]" },
  { id: "#5412", date: "01 Oct | 11:29 am", status: "Pending", amount: "$557", color: "text-[#FFB800]" },
  { id: "#6622", date: "01 Oct | 11:29 am", status: "Paid", amount: "$156", color: "text-[#5CB85C]" },
  { id: "#6462", date: "01 Oct | 11:29 am", status: "Paid", amount: "$265", color: "text-[#5CB85C]" },
  { id: "#6462", date: "01 Oct | 11:29 am", status: "Paid", amount: "$265", color: "text-[#5CB85C]" },
];

const BEST_SELLERS = [
  { name: "Apple iPhone 13", orders: 104, status: "Stock", price: "$999.00", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100" },
  { name: "Nike Air Jordan", orders: 56, status: "Stock out", price: "$180.00", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100" },
  { name: "Classic T-shirt", orders: 266, status: "Stock", price: "$35.00", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100" },
  { name: "Assorted Cross Bag", orders: 506, status: "Stock", price: "$80.00", img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100" },
];

const AdminDashboard = () => {
  const handleClick = (action) => console.log(`${action} clicked`);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FDFDFF] text-[#7C3AED] font-sans">
      <Sidebar />
      <main className="flex-1 p-4 md:p-10 overflow-y-auto space-y-6 md:space-y-10 pb-24 lg:pb-10">
        



        {/* Row 1: Top Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          <StatCard title="Total Sales" value="$350K" subValue="Sales ↑ 10.4%" subDetail="Previous 7days ($235)" color="text-[#5CB85C]" onClick={() => handleClick('Total Sales Details')} />
          <StatCard title="Total Orders" value="10.7K" subValue="order ↑ 14.4%" subDetail="Previous 7days (7.6k)" color="text-[#5CB85C]" onClick={() => handleClick('Total Orders Details')} />
          <StatCard isDouble title="Pending & Canceled" value="509" value2="94" sub1="Pending" sub2="Canceled" onClick={() => handleClick('Pending Details')} />
        </section>





        {/* Row 2: Charts & Region */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="col-span-1 lg:col-span-8 bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] border border-[#F5F5F7] shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-[#7C3AED]">Weekly Sales Performance</h3>
                <p className="text-sm text-[#A78BFA] mt-1">Revenue analysis for the past 7 days</p>
              </div>
              <div className="flex bg-[#F4F5F7] p-1.5 rounded-2xl w-full sm:w-auto">
                <button onClick={() => handleClick('This Week')} className="flex-1 sm:flex-none px-6 py-2 bg-white shadow-sm rounded-xl text-xs font-bold text-[#5542F6] cursor-pointer">This week</button>
                <button onClick={() => handleClick('Last Week')} className="flex-1 sm:flex-none px-6 py-2 text-xs text-[#A78BFA] font-bold cursor-pointer hover:text-[#5542F6]">Last week</button>
              </div>
            </div>
            <div className="h-[250px] md:h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SALES_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5542F6" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#5542F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#F0F0F0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#7C3AED', fontSize: 12, fontWeight: 600}} 
                    dy={10}
                    padding={{ left: 10, right: 10 }} 
                  />
                  <YAxis hide={true} />
                  <Area type="monotone" dataKey="value" stroke="#5542F6" strokeWidth={4} fill="url(#colorVal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-between gap-4 mt-8 pt-6 border-t border-[#F5F5F7]">
                <MiniInfo label="NEW CUSTOMERS" value="+1,240" />
                <MiniInfo label="ACTIVE PRODUCTS" value="8,421" />
                <MiniInfo label="GROSS REVENUE" value="$41.2k" color="text-[#5542F6]" />
            </div>
          </div>

          <div className="col-span-1 lg:col-span-4 space-y-6">
            <div className="bg-[#5542F6] p-8 rounded-[2rem] text-white relative">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#00FF00] rounded-full animate-pulse" />
                    <span className="text-[11px] font-bold tracking-widest uppercase">LIVE NOW</span>
                </div>
                <h2 className="text-[48px] md:text-[56px] font-bold mt-4 leading-none">428</h2>
                <p className="text-[14px] opacity-70 mb-10">Users browsing the store</p>
                <div className="flex gap-1.5 items-end h-16">
                    {[40, 25, 45, 90, 35, 40].map((h, i) => (
                        <div key={i} className={`flex-1 rounded-md ${i === 3 ? 'bg-white' : 'bg-white/30'}`} style={{height: `${h}%`}} />
                    ))}
                </div>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-[#F5F5F7] shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-[#7C3AED]">Sales by Region</h3>
                    <button onClick={() => handleClick('Full Map')} className="text-[#5542F6] text-xs font-bold cursor-pointer hover:underline">Full Map</button>
                </div>
                <RegionRow label="United States" percent={42} />
                <RegionRow label="United Kingdom" percent={18} />
                <RegionRow label="Germany" percent={12} />
            </div>
          </div>
        </section>




        {/* Row 3: Recent Transactions */}
        <section className="bg-white rounded-[2rem] border border-[#F5F5F7] p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="text-xl font-bold text-[#7C3AED]">Recent Transaction</h3>
            <button onClick={() => handleClick('Filter Transactions')} className="flex items-center gap-2 bg-[#5CB85C] text-white px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-colors hover:bg-[#4ea34e]">
              <Filter size={16} /> Filter
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="text-[#A78BFA] text-xs font-bold uppercase tracking-wider border-b border-[#F5F5F7]">
                  <th className="pb-4">No</th>
                  <th className="pb-4">Id Customer</th>
                  <th className="pb-4">Order Date</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_TRANSACTIONS.map((t, idx) => (
                  <tr key={idx} className="group hover:bg-gray-50/50">
                    <td className="py-5 text-[#A78BFA] font-medium">{idx + 1}.</td>
                    <td className="py-5 font-bold text-[#7C3AED]">{t.id}</td>
                    <td className="py-5 text-[#7C3AED] font-medium">{t.date}</td>
                    <td className={`py-5 font-bold flex items-center gap-2 ${t.color}`}>
                      <span className="w-2 h-2 rounded-full bg-current" /> {t.status}
                    </td>
                    <td className="py-5 font-bold text-[#7C3AED]">{t.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={() => handleClick('Transaction Details')} className="w-full mt-6 py-3.5 border border-[#5542F6] rounded-xl text-[#5542F6] font-bold text-sm cursor-pointer hover:bg-[#5542F6] hover:text-white transition-all">Details</button>
        </section>





        {/* Row 4: Best Selling & Add Product */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8">
          <div className="col-span-1 lg:col-span-8 bg-white p-6 md:p-8 rounded-[2rem] border border-[#F5F5F7] shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-[#7C3AED]">Best selling product</h3>
                <button onClick={() => handleClick('Filter Products')} className="flex items-center gap-2 bg-[#5CB85C] text-white px-5 py-2 rounded-xl text-sm font-bold cursor-pointer">
                    <Filter size={16} /> Filter
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                      <tr className="bg-[#F4FDF6] text-[10px] text-[#A78BFA] uppercase font-bold tracking-widest text-left">
                        <th className="p-4 rounded-l-xl pl-6">Product</th>
                        <th className="p-4">Total Order</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 rounded-r-xl pr-6">Price</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5F5F7]">
                      {BEST_SELLERS.map((p, i) => (
                        <tr key={i} className="hover:bg-gray-50/30">
                            <td className="py-4 flex items-center gap-4 pl-2">
                              <img src={p.img} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                              <span className="font-bold text-sm text-[#7C3AED]">{p.name}</span>
                            </td>
                            <td className="py-4 text-sm font-bold text-[#7C3AED]">{p.orders}</td>
                            <td className="py-4">
                              <span className={`flex items-center gap-2 font-bold text-xs ${p.status === 'Stock' ? 'text-[#5CB85C]' : 'text-[#EB5757]'}`}>
                                  <span className="w-1.5 h-1.5 rounded-full bg-current" /> {p.status}
                              </span>
                            </td>
                            <td className="py-4 font-bold text-[#5542F6] text-sm">{p.price}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <button onClick={() => handleClick('Best Seller Details')} className="w-full mt-6 py-3.5 border border-[#5542F6] rounded-xl text-[#5542F6] font-bold text-sm cursor-pointer hover:bg-[#5542F6] hover:text-white transition-all">Details</button>
          </div>

          <div className="col-span-1 lg:col-span-4 space-y-6">
              <div className="bg-white p-8 rounded-[2rem] border border-[#F5F5F7] shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-[#7C3AED]">Top Products</h3>
                    <button onClick={() => handleClick('All Products')} className="text-[#5542F6] text-[10px] font-bold uppercase cursor-pointer hover:underline">All product</button>
                </div>
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C4C4C4]" size={16} />
                    <input type="text" placeholder="Search" className="w-full bg-[#F4F5F7] rounded-xl py-3 pl-11 text-sm focus:outline-none focus:ring-1 focus:ring-[#5542F6]/30" />
                </div>
                <div className="space-y-6">
                    <TopProductItem name="Apple iPhone 13" price="$999.00" id="#FXZ-4567" img={BEST_SELLERS[0].img} />
                    <TopProductItem name="Nike Air Jordan" price="$72.40" id="#FXZ-4567" img={BEST_SELLERS[1].img} />
                </div>
              </div>

              <div className="border-2 border-dashed border-[#E5E7FF] rounded-[2rem] p-8 flex flex-col items-center text-center bg-[#F9FAFF]">
                <button onClick={() => handleClick('Add Product')} className="w-14 h-14 bg-[#EEF0FF] text-[#5542F6] rounded-2xl flex items-center justify-center mb-4 cursor-pointer hover:scale-105 active:scale-95 transition-transform">
                    <Plus size={28} strokeWidth={3} />
                </button>
                <h4 className="font-bold text-lg text-[#7C3AED]">Add New Product</h4>
                <p className="text-xs text-[#A78BFA] mt-2 mb-6 px-4">Select a category below to start listing your next best-seller</p>
                <div className="flex gap-3">
                    <button onClick={() => handleClick('Add Electronics')} className="px-5 py-2 bg-white border border-[#F0F0F0] rounded-xl text-[10px] font-bold uppercase shadow-sm cursor-pointer hover:border-[#5542F6]">Electronics</button>
                    <button onClick={() => handleClick('Add Fashion')} className="px-5 py-2 bg-white border border-[#F0F0F0] rounded-xl text-[10px] font-bold uppercase shadow-sm cursor-pointer hover:border-[#5542F6]">Fashion</button>
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
  <div className="bg-white p-6 rounded-[2.5rem] border border-[#F5F5F7] shadow-sm flex flex-col justify-between h-full min-h-[220px]">
    <div>
        <div className="flex justify-between items-center text-[#A78BFA] mb-5">
            <span className="text-[10px] font-bold uppercase tracking-widest">{title}</span>
            <MoreVertical size={18} className="cursor-pointer" />
        </div>
        {isDouble ? (
            <div className="flex items-start">
                <div className="flex-1">
                    <div className="text-[28px] md:text-[32px] font-black leading-none text-[#7C3AED]">{value}</div>
                    <div className="text-[9px] text-[#A78BFA] uppercase mt-2 font-bold tracking-tight">
                      {sub1} <span className="text-[#5CB85C] ml-1">user 204</span>
                    </div>
                </div>
                <div className="w-[1px] h-10 bg-[#F0F0F0] mx-4 self-center" />
                <div className="flex-1">
                    <div className="text-[28px] md:text-[32px] font-black text-[#EB5757] leading-none">{value2}</div>
                    <div className="text-[9px] text-[#A78BFA] uppercase mt-2 font-bold tracking-tight">
                      {sub2} <span className="text-[#EB5757] ml-1">↓ 14.4%</span>
                    </div>
                </div>
            </div>
        ) : (
            <>
                <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-[38px] md:text-[44px] font-black leading-none tracking-tight text-[#7C3AED]">{value}</span>
                    <span className={`text-[10px] font-bold ${color}`}>{subValue}</span>
                </div>
                <p className="text-[9px] text-[#A78BFA] mt-1.5 uppercase font-extrabold tracking-widest">{subDetail}</p>
            </>
        )}
    </div>
    
    <div className="flex justify-end mt-4">
        <button 
          onClick={onClick} 
          className="text-[10px] font-bold border border-[#5542F6]/30 px-5 py-2 rounded-xl text-[#5542F6] cursor-pointer hover:bg-[#5542F6] hover:text-white transition-all"
        >
          Details
        </button>
    </div>
  </div>
);

const MiniInfo = ({ label, value, color = "text-[#7C3AED]" }) => (
    <div>
        <p className="text-[10px] text-[#A78BFA] font-bold mb-1 uppercase tracking-wider">{label}</p>
        <p className={`text-lg md:text-xl font-black ${color}`}>{value}</p>
    </div>
);

const RegionRow = ({ label, percent }) => (
    <div className="mb-5 last:mb-0">
        <div className="flex justify-between text-xs font-bold mb-2">
            <span className="flex items-center gap-2 text-[#7C3AED]">
                <div className="w-1 h-3 bg-[#5542F6] rounded-full" /> {label}
            </span>
            <span className="text-[#7C3AED]">{percent}%</span>
        </div>
        <div className="w-full bg-[#F4F5F7] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#5542F6] h-full rounded-full transition-all duration-700" style={{width: `${percent}%`}} />
        </div>
    </div>
);

const TopProductItem = ({ name, price, id, img }) => (
    <div className="flex items-center justify-between group cursor-pointer">
        <div className="flex items-center gap-3">
            <img src={img} className="w-11 h-11 rounded-lg object-cover" />
            <div>
                <p className="text-sm font-bold text-[#7C3AED] transition-colors group-hover:text-[#5542F6]">{name}</p>
                <p className="text-[10px] text-[#A78BFA] font-semibold mt-0.5">Item: {id}</p>
            </div>
        </div>
        <span className="text-sm font-bold text-[#7C3AED]">{price}</span>
    </div>
);

export default AdminDashboard;