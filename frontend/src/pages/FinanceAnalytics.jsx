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
  { title: 'Total Revenue', value: '$428,930.00', change: '+12.5%', trend: 'up', icon: Banknote, iconBg: 'bg-muted', iconColor: 'text-primary' },
  { title: 'Avg. Order Value', value: '$156.40', change: '+4.2%', trend: 'up', icon: ShoppingBag, iconBg: 'bg-accent', iconColor: 'text-accent-foreground' },
  { title: 'Acquisition Cost', value: '$28.15', change: '-2.1%', trend: 'down', icon: UserPlus, iconBg: 'bg-destructive', iconColor: 'text-destructive-foreground' },
  { title: 'Profit Margin', value: '32.4%', change: '+0.8%', trend: 'up', icon: PieChart, iconBg: 'bg-secondary', iconColor: 'text-secondary-foreground' },
];

const CustomBlueBar = (props) => {
  const { x, y, width, height, fill } = props;
  const GAP = 8; 
  if (height <= GAP) return null;
  return <rect x={x} y={y} width={width} height={height - GAP} fill={fill} />;
};

const FinanceAnalytics = () => {
  return (
    <div className="min-h-screen bg-background p-8 text-sm pt-20">
      <div className="max-w-7xl mx-auto xl:px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-muted-foreground font-medium text-[11px] mb-1.5 uppercase tracking-wider">Financial Overview</p>
            <h1 className="text-3xl font-black text-foreground tracking-tight">Revenue Dashboard</h1>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-surface-soft px-4 py-2.5 shadow-sm rounded-2xl text-primary font-medium text-xs hover:bg-muted transition-colors">
              <Calendar className="w-4 h-4 text-primary" />
              Oct 1 - Oct 31, 2023
            </button>
            <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium text-xs shadow-md hover:bg-primary/90 transition-colors">
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
              <div key={idx} className="bg-card p-6 rounded-[20px] shadow-sm border flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-[46px] h-[46px] rounded-[16px] flex items-center justify-center ${card.iconBg} bg-opacity-80`}>
                    <card.icon className={`w-[22px] h-[22px] ${card.iconColor}`} fill="none" strokeWidth={2.5} />
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-[12px] font-bold flex items-center gap-1.5 ${isUp ? 'bg-chart-3 text-chart-5' : 'bg-chart-4 text-destructive-foreground'}`}>
                    {isUp ? <TrendingUp className="w-3.5 h-3.5" strokeWidth={2.5} /> : <TrendingDown className="w-3.5 h-3.5" strokeWidth={2.5} />}
                    {card.change}
                  </div>
                </div>
                <div className="pt-2">
                  <h3 className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest mb-1.5">{card.title}</h3>
                  <p className="text-[28px] font-black text-foreground tracking-tight leading-none">{card.value}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Area Chart */}
          <div className="bg-card p-6 rounded-2xl shadow-sm border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-foreground tracking-tight">Revenue over time</h2>
              <div className="flex gap-1 bg-muted p-1 rounded-full border">
                <button className="px-4 py-1.5 bg-card text-primary shadow-sm rounded-full text-xs font-semibold transition-all">Daily</button>
                <button className="px-4 py-1.5 text-muted-foreground rounded-full text-xs font-medium hover:text-foreground transition-all">Weekly</button>
              </div>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 600 }} dy={10} />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders vs Refunds Bar Chart */}
          <div className="bg-card p-6 rounded-2xl shadow-sm border">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-bold text-foreground tracking-tight">Orders vs Refunds</h2>
              <div className="flex gap-5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-xs font-medium text-muted-foreground">Orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-chart-2"></div>
                  <span className="text-xs font-medium text-muted-foreground">Refunds</span>
                </div>
              </div>
            </div>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersRefundsData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }} barGap={0}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 600 }} dy={10} />
                  <RechartsTooltip
                    cursor={{ fill: 'transparent' }}
                  />
                  <Bar dataKey="refunds" stackId="a" fill="var(--chart-2)" radius={[10, 10, 0, 0]} barSize={16} />
                  <Bar dataKey="orders" stackId="a" fill="var(--chart-1)" shape={<CustomBlueBar />} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-card p-6 rounded-2xl shadow-sm border">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-foreground tracking-tight mb-5">Recent Transactions</h2>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-0 gap-4">
              <div className="flex gap-8">
                <button className="text-primary font-bold text-sm border-b-2 border-primary pb-3 -mb-[2px]">All order <span className="font-medium text-primary/70">(240)</span></button>
                <button className="text-muted-foreground font-medium text-sm pb-3 border-b-2 border-transparent hover:text-foreground transition-colors">Completed</button>
                <button className="text-muted-foreground font-medium text-sm pb-3 border-b-2 border-transparent hover:text-foreground transition-colors">Pending</button>
                <button className="text-muted-foreground font-medium text-sm pb-3 border-b-2 border-transparent hover:text-foreground transition-colors">Canceled</button>
              </div>

              <div className="flex gap-2 relative pb-2 md:pb-0">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search payment history"
                    className="pl-10 pr-4 py-2.5 bg-muted rounded-xl text-[13px] font-medium placeholder:text-muted-foreground text-foreground w-64 outline-none transition-colors"
                  />
                </div>
                <button className="w-10 h-10 border rounded-xl text-muted-foreground hover:bg-muted flex items-center justify-center bg-card shadow-sm ml-2">
                  <ListFilter className="w-5 h-5 stroke-[2]" />
                </button>
                <button className="w-10 h-10 border rounded-xl text-muted-foreground hover:bg-muted flex items-center justify-center bg-card shadow-sm">
                  <ArrowUpDown className="w-5 h-5 stroke-[2]" />
                </button>
                <button className="w-12 h-10 border rounded-xl text-muted-foreground hover:bg-muted flex items-center justify-center bg-card shadow-sm">
                  <MoreHorizontal className="w-5 h-5 stroke-[2]" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm mt-2">
              <thead>
                <tr className="text-[13px] text-muted-foreground font-bold capitalize border-b">
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
                  <tr key={idx} className="border-border/50 hover:bg-muted/50 transition-colors group">
                    <td className="py-5 text-foreground font-bold">{tr.id}</td>
                    <td className="py-5 text-foreground font-medium">{tr.name}</td>
                    <td className="py-5 text-muted-foreground font-medium">{tr.date}</td>
                    <td className="py-5 text-foreground font-bold tracking-tight">{tr.total}</td>
                    <td className="py-5 text-muted-foreground font-medium">{tr.method}</td>
                    <td className="py-5">
                      <span className={`inline-flex items-center gap-1.5 font-medium text-[13px] ${tr.status === 'Complete' ? 'text-success' :
                          tr.status === 'Pending' ? 'text-warning' : 'text-error'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${tr.status === 'Complete' ? 'bg-success' :
                            tr.status === 'Pending' ? 'bg-warning' : 'bg-error'
                          }`}></div>
                        {tr.status}
                      </span>
                    </td>
                    <td className="py-5 text-right">
                      <button className="text-primary font-bold text-[13px] hover:text-primary/80 transition-colors">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-8 border-t pt-6">
            <button className="flex items-center gap-1 text-muted-foreground font-medium text-[13px] hover:text-foreground transition-colors">
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <div className="flex gap-1.5">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold text-[13px] shadow-sm">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground font-medium text-[13px] transition-colors">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground font-medium text-[13px] transition-colors">3</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground font-medium text-[13px] transition-colors hidden sm:flex">4</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground font-medium text-[13px] transition-colors hidden sm:flex">5</button>
              <span className="w-8 h-8 flex items-center justify-center text-muted-foreground font-bold tracking-widest">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground font-medium text-[13px] transition-colors">24</button>
            </div>
            <button className="flex items-center gap-1 text-muted-foreground font-medium text-[13px] hover:text-foreground transition-colors">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FinanceAnalytics;
