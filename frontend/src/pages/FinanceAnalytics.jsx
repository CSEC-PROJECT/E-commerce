import React from 'react';
import { AreaChart, Area, XAxis, Tooltip as RechartsTooltip, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { Calendar, Download, Search, ListFilter, ArrowUpDown, MoreHorizontal, ChevronLeft, ChevronRight, Banknote, ShoppingBag, UserPlus, PieChart, TrendingUp, TrendingDown } from 'lucide-react';

const revenueData = [
  { name: 'MON', value: 1000 },
  { name: 'TUE', value: 1800 },
  { name: 'WED', value: 1400 },
  { name: 'THU', value: 3200 },
  { name: 'FRI', value: 4800 },
  { name: 'SAT', value: 2000 },
  { name: 'SUN', value: 4200 },
];

const ordersRefundsData = [
  { name: 'WK1', orders: 4000, refunds: 500 },
  { name: 'WK2', orders: 5000, refunds: 700 },
  { name: 'WK3', orders: 2800, refunds: 300 },
  { name: 'WK4', orders: 6000, refunds: 600 },
];

const transactions = [
  { id: '#CUST001', name: 'John Doe', date: '01-01-2025', total: '$2,904', method: 'CC', status: 'Complete' },
  { id: '#CUST001', name: 'John Doe', date: '01-01-2025', total: '$2,904', method: 'PayPal', status: 'Complete' },
  { id: '#CUST001', name: 'Emily Davis', date: '01-01-2025', total: '$2,904', method: 'PayPal', status: 'Pending' },
  { id: '#CUST001', name: 'Jane Smith', date: '01-01-2025', total: '$2,904', method: 'CC', status: 'Canceled' },
];

const cards = [
  { title: 'Total Revenue', value: '$428,930.00', change: '+12.5%', trend: 'up', icon: Banknote, iconBg: 'bg-[#EAE7F6]', iconColor: 'text-[#4438CA]' },
  { title: 'Avg. Order Value', value: '$156.40', change: '+4.2%', trend: 'up', icon: ShoppingBag, iconBg: 'bg-[#EBECFA]', iconColor: 'text-[#4A538F]' },
  { title: 'Acquisition Cost', value: '$28.15', change: '-2.1%', trend: 'down', icon: UserPlus, iconBg: 'bg-[#FFF0EF]', iconColor: 'text-[#B81919]' },
  { title: 'Profit Margin', value: '32.4%', change: '+0.8%', trend: 'up', icon: PieChart, iconBg: 'bg-[#E2FBEB]', iconColor: 'text-[#065C38]' },
];

const CustomBlueBar = (props) => {
  const { x, y, width, height, fill } = props;
  const GAP = 8; 
  if (height <= GAP) return null;
  return <rect x={x} y={y} width={width} height={height - GAP} fill={fill} />;
};

const FinanceAnalytics = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FC] p-8 text-sm pt-20">
      <div className="max-w-7xl mx-auto xl:px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-gray-500 font-medium text-[11px] mb-1.5 uppercase tracking-wider">Financial Overview</p>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Revenue Dashboard</h1>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white px-4 py-2 border border-gray-200 shadow-sm rounded-lg text-gray-700 font-medium text-xs hover:bg-gray-50 transition-colors">
              <Calendar className="w-4 h-4 text-indigo-600" />
              Oct 1 - Oct 31, 2023
            </button>
            <button className="flex items-center gap-2 bg-[#4F46E5] text-white px-4 py-2 rounded-lg font-medium text-xs shadow-md hover:bg-[#4338ca] transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {cards.map((card, idx) => {
            const isUp = card.trend === 'up';
            return (
              <div key={idx} className="bg-white p-6 rounded-[20px] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-[46px] h-[46px] rounded-[16px] flex items-center justify-center ${card.iconBg} bg-opacity-80`}>
                    <card.icon className={`w-[22px] h-[22px] ${card.iconColor}`} fill="none" strokeWidth={2.5} />
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-[12px] font-bold flex items-center gap-1.5 ${isUp ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#FEE2E2] text-[#991B1B]'}`}>
                    {isUp ? <TrendingUp className="w-3.5 h-3.5" strokeWidth={2.5} /> : <TrendingDown className="w-3.5 h-3.5" strokeWidth={2.5} />}
                    {card.change}
                  </div>
                </div>
                <div className="pt-2">
                  <h3 className="text-[#6B7280] text-[11px] font-bold uppercase tracking-widest mb-1.5">{card.title}</h3>
                  <p className="text-[28px] font-black text-gray-900 tracking-tight leading-none">{card.value}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Area Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">Revenue over time</h2>
              <div className="flex gap-1 bg-gray-50 p-1 rounded-full border border-gray-100">
                <button className="px-4 py-1.5 bg-white text-[#4F46E5] shadow-sm rounded-full text-xs font-semibold transition-all">Daily</button>
                <button className="px-4 py-1.5 text-gray-500 rounded-full text-xs font-medium hover:text-gray-800 transition-all">Weekly</button>
              </div>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 600 }} dy={10} />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontWeight: 700 }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders vs Refunds Bar Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">Orders vs Refunds</h2>
              <div className="flex gap-5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#4F46E5]"></div>
                  <span className="text-xs font-medium text-gray-600">Orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#E8B5B5]"></div>
                  <span className="text-xs font-medium text-gray-600">Refunds</span>
                </div>
              </div>
            </div>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersRefundsData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }} barGap={0}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 600 }} dy={10} />
                  <RechartsTooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="refunds" stackId="a" fill="#E8B5B5" radius={[10, 10, 0, 0]} barSize={16} />
                  <Bar dataKey="orders" stackId="a" fill="#3B28CC" shape={<CustomBlueBar />} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight mb-5">Recent Transactions</h2>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-0 gap-4">
              <div className="flex gap-8">
                <button className="text-[#4F46E5] font-bold text-sm border-b-2 border-[#4F46E5] pb-3 -mb-[2px]">All order <span className="font-medium text-[#4F46E5]/70">(240)</span></button>
                <button className="text-gray-500 font-medium text-sm pb-3 border-b-2 border-transparent hover:text-gray-700 transition-colors">Completed</button>
                <button className="text-gray-500 font-medium text-sm pb-3 border-b-2 border-transparent hover:text-gray-700 transition-colors">Pending</button>
                <button className="text-gray-500 font-medium text-sm pb-3 border-b-2 border-transparent hover:text-gray-700 transition-colors">Canceled</button>
              </div>

              <div className="flex gap-2 relative pb-2 md:pb-0">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A8499]" />
                  <input
                    type="text"
                    placeholder="Search payment history"
                    className="pl-10 pr-4 py-2.5 bg-[#EFF2F9] rounded-xl text-[13px] font-medium placeholder:text-[#7A8499] text-gray-800 w-64 outline-none transition-colors"
                  />
                </div>
                <button className="w-10 h-10 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 flex items-center justify-center bg-white shadow-sm ml-2">
                  <ListFilter className="w-5 h-5 stroke-[2]" />
                </button>
                <button className="w-10 h-10 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 flex items-center justify-center bg-white shadow-sm">
                  <ArrowUpDown className="w-5 h-5 stroke-[2]" />
                </button>
                <button className="w-12 h-10 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 flex items-center justify-center bg-white shadow-sm">
                  <MoreHorizontal className="w-5 h-5 stroke-[2]" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm mt-2">
              <thead>
                <tr className="text-[13px] text-[#4B5563] font-bold capitalize border-b border-gray-100">
                  <th className="pb-4 pt-2">Customer Id</th>
                  <th className="pb-4 pt-2">Name</th>
                  <th className="pb-4 pt-2">Date</th>
                  <th className="pb-4 pt-2">Total</th>
                  <th className="pb-4 pt-2">Method</th>
                  <th className="pb-4 pt-2">Status</th>
                  <th className="pb-4 pt-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tr, idx) => (
                  <tr key={idx} className="border-border/50 hover:bg-gray-50/50 transition-colors group">
                    <td className="py-5 text-gray-800 font-bold">{tr.id}</td>
                    <td className="py-5 text-gray-700 font-medium">{tr.name}</td>
                    <td className="py-5 text-gray-500 font-medium">{tr.date}</td>
                    <td className="py-5 text-gray-900 font-bold tracking-tight">{tr.total}</td>
                    <td className="py-5 text-gray-500 font-medium">{tr.method}</td>
                    <td className="py-5">
                      <span className={`inline-flex items-center gap-1.5 font-medium text-[13px] ${tr.status === 'Complete' ? 'text-green-600' :
                          tr.status === 'Pending' ? 'text-orange-500' : 'text-red-500'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${tr.status === 'Complete' ? 'bg-green-500' :
                            tr.status === 'Pending' ? 'bg-orange-500' : 'bg-red-500'
                          }`}></div>
                        {tr.status}
                      </span>
                    </td>
                    <td className="py-5 text-right">
                      <button className="text-[#4F46E5] font-bold text-[13px] hover:text-[#3730a3] transition-colors">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-8 border-t border-gray-100 pt-6">
            <button className="flex items-center gap-1 text-gray-600 font-medium text-[13px] hover:text-gray-900 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <div className="flex gap-1.5">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#4F46E5] text-white font-semibold text-[13px] shadow-sm shadow-indigo-200">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 font-medium text-[13px] transition-colors">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 font-medium text-[13px] transition-colors">3</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 font-medium text-[13px] transition-colors hidden sm:flex">4</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 font-medium text-[13px] transition-colors hidden sm:flex">5</button>
              <span className="w-8 h-8 flex items-center justify-center text-gray-400 font-bold tracking-widest">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 font-medium text-[13px] transition-colors">24</button>
            </div>
            <button className="flex items-center gap-1 text-gray-600 font-medium text-[13px] hover:text-gray-900 transition-colors">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FinanceAnalytics;
