import React from 'react';
import { 
  LayoutDashboard, ShoppingCart, Users, Settings, 
  Plus, Pencil, Trash2, ShieldUser, ArrowRight, 
  UserCog, Maximize 
} from 'lucide-react';

/** * CONSTANTS */
const NAVIGATION_ITEMS = [
  { id: 'dashboard', text: 'Dashboard', icon: LayoutDashboard, active: true },
  { id: 'products', text: 'Products', icon: ShoppingCart },
  { id: 'users', text: 'Users', icon: Users },
  { id: 'settings', text: 'Settings', icon: Settings },
];

const PRODUCT_DATA = [
  { id: 1, name: "Lunar Ceramic Vase", category: "Home Decor", price: "$185.00", stock: "12 Units", variant: "neutral" },
  { id: 2, name: "Atelier Linen Shirt", category: "Apparel", price: "$120.00", stock: "48 Units", variant: "success" },
  { id: 3, name: "Obsidian Desk Lamp", category: "Lighting", price: "$340.00", stock: "2 Units", variant: "danger" },
];

const USER_DATA = [
  { id: 1, initial: "JD", name: "Julianne Doe", email: "j.doe@example.com", role: "PREMIUM CUSTOMER" },
  { id: 2, initial: "MS", name: "Marcus Smith", email: "m.smith@studio.io", role: "CONTENT EDITOR" },
];

/** * SUB-COMPONENTS */

const StatCard = ({ title, value, change, changeText, icon: Icon, statusColorClass }) => (
  <div className="bg-white p-6 rounded-[1.25rem] border border-[#DEE3E7] flex-1 flex flex-col justify-between shadow-sm transition-shadow hover:shadow-md" style={{ aspectRatio: '304/144' }}>
    <div className="flex items-center justify-between">
      <p className="text-[#6C757D] text-sm font-medium">{title}</p>
      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[#F5F3FF]">
        <Icon size={20} className="text-[#4338CA]" />
      </div>
    </div>
    <div>
      <p className="text-[#101928] text-[2.5rem] leading-none font-bold tracking-tight">{value}</p>
      <div className={`flex items-center gap-1.5 mt-2 text-sm font-medium ${statusColorClass}`}>
        <span>{change}</span>
        <span className="opacity-80">{changeText}</span>
      </div>
    </div>
  </div>
);

const Badge = ({ children, variant = "neutral" }) => {
  const styles = {
    neutral: "bg-[#EAEDF1] text-[#1D1B4B]",
    success: "bg-[#ECFDF3] text-[#039855]",
    danger: "bg-[#FEF3F2] text-[#B42318]",
  };
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[variant]}`}>
      {children}
    </span>
  );
};

const TableHeader = ({ cols }) => (
  <thead className="bg-[#F9FAFB]">
    <tr className="text-xs font-semibold text-[#848199] uppercase tracking-wider">
      {cols.map((col, idx) => (
        <th key={idx} className={`px-6 py-4 text-left ${col.className || ''}`}>
          {col.label}
        </th>
      ))}
    </tr>
  </thead>
);

/** * MAIN COMPONENT */
const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-white font-sans antialiased text-[#101928]">



      {/* Sidebar Navigation - Narrowed from w-80 to w-64 */}
      <aside className="w-64 bg-[#E0E2FF] p-6 flex flex-col shrink-0 border-r border-[#DEE3E7]">
        <nav className="flex-1 space-y-2">
          {NAVIGATION_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`flex items-center gap-3 p-3 rounded-lg text-sm font-semibold transition-colors
                ${item.active 
                  ? 'bg-[#4338CA] text-white shadow-md' 
                  : 'text-[#5A606D] hover:bg-white/50 hover:text-[#101928]'}`}
            >
              <item.icon size={20} strokeWidth={1.5} className={item.active ? 'text-white' : 'text-[#848199]'} />
              {item.text}
            </a>
          ))}
        </nav>



        {/* User Profile Mini-Card */}
        <div className="mt-auto flex items-center gap-3 bg-white p-3 rounded-xl border border-[#DEE3E7] shadow-sm">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" 
            alt="Admin Avatar" 
            className="w-10 h-10 rounded-lg object-cover" 
          />
          <div className="overflow-hidden">
            <p className="text-[10px] uppercase tracking-wider text-[#848199] font-bold">Admin</p>
            <p className="text-sm font-bold truncate">Alex Rivers</p>
          </div>
        </div>
      </aside>



      {/* Main Content Area */}

      <main className="flex-1 p-10 overflow-y-auto space-y-12">



        {/* Analytics Section - Colors set to Green, Green, Red */}


        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Revenue" 
            value="$124,592" 
            change="↗ +12%" 
            changeText="from last month" 
            icon={Maximize} 
            statusColorClass="text-[#039855]" 
          />
          <StatCard 
            title="Total Orders" 
            value="1,842" 
            change="↗ +5.2%" 
            changeText="daily average" 
            icon={ShoppingCart} 
            statusColorClass="text-[#039855]" 
          />
          <StatCard 
            title="Active Users" 
            value="894" 
            change="↘ -2%" 
            changeText="currently online" 
            icon={Users} 
            statusColorClass="text-[#D92D20]" 
          />
        </section>



        {/* Inventory Section */}
        
        <section>
          <header className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Products Inventory</h2>
            <button className="bg-[#4338CA] hover:bg-[#3730A3] text-white text-sm font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all active:scale-95 shadow-sm">
              <Plus size={18} strokeWidth={3} />
              New Product
            </button>
          </header>

          <div className="overflow-hidden rounded-2xl border border-[#DEE3E7] shadow-sm bg-white">
            <table className="w-full">
              <TableHeader cols={[
                { label: 'Name', className: 'w-[35%]' },
                { label: 'Category', className: 'w-[25%]' },
                { label: 'Price', className: 'w-[15%]' },
                { label: 'Stock', className: 'w-[12%]' },
                { label: 'Actions', className: 'text-center w-[13%]' }
              ]} />
              <tbody className="divide-y divide-[#DEE3E7]">
                {PRODUCT_DATA.map((product) => (
                  <tr key={product.id} className="hover:bg-[#F9FAFB] transition-colors group">
                    <td className="px-6 py-4 font-semibold">{product.name}</td>
                    <td className="px-6 py-4 text-[#6C757D]">{product.category}</td>
                    <td className="px-6 py-4 text-[#4338CA] font-bold">{product.price}</td>
                    <td className="px-6 py-4">
                      <Badge variant={product.variant}>{product.stock}</Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-4 text-[#6C757D]">
                        <button className="hover:text-[#4338CA]"><Pencil size={18} /></button>
                        <button className="hover:text-[#D92D20]"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Users Section */}
        <section>
          <header className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold tracking-tight">System Users</h2>
            <button className="text-[#4338CA] text-xs font-bold flex items-center gap-1 group">
              View All Records
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </button>
          </header>

          <div className="overflow-hidden rounded-2xl border border-[#DEE3E7] shadow-sm bg-white">
            <table className="w-full">
              <TableHeader cols={[
                { label: 'Name', className: 'w-[35%]' },
                { label: 'Email', className: 'w-[35%]' },
                { label: 'Role', className: 'w-[17%]' },
                { label: 'Actions', className: 'text-center w-[13%]' }
              ]} />
              <tbody className="divide-y divide-[#DEE3E7]">
                {USER_DATA.map((user) => (
                  <tr key={user.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#EAEDF1] text-xs font-black text-[#6C757D]">
                          {user.initial}
                        </div>
                        <span className="font-semibold">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#6C757D] font-mono text-xs">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black text-[#4F46E5] tracking-widest uppercase">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-4 text-[#6C757D]">
                        <button className="hover:text-indigo-600"><ShieldUser size={18} /></button>
                        <button className="hover:text-indigo-600"><UserCog size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;