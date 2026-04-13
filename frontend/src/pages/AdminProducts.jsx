import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Grid, Plus, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '../components/Common/Sidebar';

const INITIAL_PRODUCTS = [
  { id: 1, name: "Nova Smartwatch Gen 2", category: "Electronics", date: "12-05-2024", price: 249.00, formattedPrice: "$249.00", order: 45, status: "IN STOCK", img: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=100&h=100" },
  { id: 2, name: "Velocity Pro Runner", category: "Footwear", date: "10-05-2024", price: 120.00, formattedPrice: "$120.00", order: 82, status: "LOW STOCK", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=100&h=100" },
  { id: 3, name: "Artisan Leather Oxfords", category: "Footwear", date: "08-05-2024", price: 380.00, formattedPrice: "$380.00", order: 15, status: "OUT OF STOCK", img: "https://images.unsplash.com/photo-1614252339475-533eba9f2452?auto=format&fit=crop&q=80&w=100&h=100" },
  { id: 4, name: "Studio Sound Over-Ear", category: "Electronics", date: "05-05-2024", price: 199.00, formattedPrice: "$199.00", order: 124, status: "IN STOCK", img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=100&h=100" },
  { id: 5, name: "Quantum Book Pro 14", category: "Electronics", date: "01-05-2024", price: 1499.00, formattedPrice: "$1,499.00", order: 28, status: "IN STOCK", img: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=100&h=100" },
  { id: 6, name: "Classic Minimalist Watch", category: "Accessories", date: "28-04-2024", price: 85.00, formattedPrice: "$85.00", order: 210, status: "IN STOCK", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=100&h=100" },
  { id: 7, name: "Urban Explorer Backpack", category: "Accessories", date: "25-04-2024", price: 65.00, formattedPrice: "$65.00", order: 5, status: "LOW STOCK", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=100&h=100" },
  { id: 8, name: "Ergo Comfort Office Chair", category: "Furniture", date: "20-04-2024", price: 299.00, formattedPrice: "$299.00", order: 0, status: "OUT OF STOCK", img: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=100&h=100" },
  { id: 9, name: "Mech-Key RGB Wireless", category: "Electronics", date: "15-04-2024", price: 129.00, formattedPrice: "$129.00", order: 56, status: "IN STOCK", img: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=100&h=100" },
  { id: 10, name: "Ceramic Matte Mug Set", category: "Home Decor", date: "10-04-2024", price: 34.00, formattedPrice: "$34.00", order: 12, status: "IN STOCK", img: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=100&h=100" },
];

const StatusBadge = ({ status }) => {
  let bgColor = "bg-green-100 dark:bg-green-900/30";
  let textColor = "text-green-600 dark:text-green-400";

  if (status === "LOW STOCK") {
    bgColor = "bg-red-100 dark:bg-red-900/30";
    textColor = "text-red-500 dark:text-red-400";
  } else if (status === "OUT OF STOCK") {
    bgColor = "bg-indigo-100 dark:bg-indigo-900/30";
    textColor = "text-indigo-600 dark:text-indigo-400";
  }

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider capitalize ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};

const AdminProducts = () => {
  const navigate = useNavigate();

  // State Declarations
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [tabSearchQuery, setTabSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [priceFilter, setPriceFilter] = useState('Any Price');
  const [statusFilter, setStatusFilter] = useState('Any Status');
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  // Clear all filters
  const handleClearFilters = () => {
    setCategoryFilter('All Categories');
    setPriceFilter('Any Price');
    setStatusFilter('Any Status');
    setSearchQuery('');
    setTabSearchQuery('');
    setActiveTab('All');
    setCurrentPage(1);
  };

  // Delete product
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  // Edit product
  const handleEdit = (id) => {
    alert(`Editing product ID: ${id}`);
  };

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Tab Filter
      if (activeTab === 'Sale' && product.status === 'OUT OF STOCK') return false; 
      if (activeTab === 'Out' && product.status !== 'OUT OF STOCK') return false;

      // Global Search
      const searchLower = searchQuery.toLowerCase();
      if (searchQuery &&
        !product.name.toLowerCase().includes(searchLower) &&
        !product.category.toLowerCase().includes(searchLower)) {
        return false;
      }

      // Tab Search
      if (tabSearchQuery && !product.name.toLowerCase().includes(tabSearchQuery.toLowerCase())) {
        return false;
      }

      // Category Filter
      if (categoryFilter !== 'All Categories' && product.category !== categoryFilter) {
        return false;
      }

      // Status Filter
      if (statusFilter !== 'Any Status') {
        if (statusFilter === 'In Stock' && product.status !== 'IN STOCK') return false;
        if (statusFilter === 'Out of Stock' && product.status !== 'OUT OF STOCK') return false;
        if (statusFilter === 'Low Stock' && product.status !== 'LOW STOCK') return false;
      }

      // Price Filter
      if (priceFilter !== 'Any Price') {
        const { price } = product;
        if (priceFilter === 'Under $50' && price >= 50) return false;
        if (priceFilter === '$50 - $100' && (price < 50 || price > 100)) return false;
        if (priceFilter === '$100 - $200' && (price < 100 || price > 200)) return false;
        if (priceFilter === '$200 - $500' && (price < 200 || price > 500)) return false;
        if (priceFilter === '$500+' && price <= 500) return false;
      }

      return true;
    });
  }, [products, activeTab, searchQuery, tabSearchQuery, categoryFilter, priceFilter, statusFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentData = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background text-foreground font-sans">
      <Sidebar />
      <main className="flex-1 p-4 md:p-10 overflow-y-auto w-full pb-24 lg:pb-10">

        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-6 w-full sm:w-auto">
            <h1 className="text-[28px] font-extrabold text-foreground">Products</h1>
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search by name, SKU, or category..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full bg-muted border border-border rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 self-end sm:self-auto">
            <button className="text-muted-foreground hover:text-primary transition-colors p-2"><Bell size={20} /></button>
            <button className="text-muted-foreground hover:text-primary transition-colors p-2"><Grid size={20} /></button>
            <button onClick={() => navigate('/admin/add-product')} className="cursor-pointer flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-xl text-sm font-bold shadow-sm hover:brightness-110 transition-all">
              <Plus size={18} /> Add Product
            </button>
          </div>
        </header>

        {/* Filters */}
        <section className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              className="w-full bg-muted border border-border rounded-xl py-3 px-4 text-sm font-semibold text-foreground appearance-none cursor-pointer focus:ring-2 focus:ring-primary/50 transition-colors">
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Footwear</option>
              <option>Accessories</option>
              <option>Furniture</option>
              <option>Home Decor</option>
              <option>Clothing</option>
              <option>Beauty</option>
              <option>Sports</option>
              <option>Toys</option>
              <option>Books</option>
              <option>Music</option>
              <option>Movies</option>
              <option>Games</option>
              <option>Other</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Price Range</label>
            <select
              value={priceFilter}
              onChange={(e) => { setPriceFilter(e.target.value); setCurrentPage(1); }}
              className="w-full bg-muted border border-border rounded-xl py-3 px-4 text-sm font-semibold text-foreground appearance-none cursor-pointer focus:ring-2 focus:ring-primary/50 transition-colors">
              <option>Any Price</option>
              <option>Under $50</option>
              <option>$50 - $100</option>
              <option>$100 - $200</option>
              <option>$200 - $500</option>
              <option>$500+</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Stock Status</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="w-full bg-muted border border-border rounded-xl py-3 px-4 text-sm font-semibold text-foreground appearance-none cursor-pointer focus:ring-2 focus:ring-primary/50 transition-colors">
              <option>Any Status</option>
              <option>In Stock</option>
              <option>Out of Stock</option>
              <option>Low Stock</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px] flex items-end">
            <button
              onClick={handleClearFilters}
              className="cursor-pointer w-full bg-muted border border-border text-foreground font-bold py-3 rounded-xl text-sm hover:brightness-95 dark:hover:brightness-110 transition-all">
              Clear All Filters
            </button>
          </div>
        </section>

        {/* Tabs & Tab Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="flex bg-muted rounded-2xl p-1.5 w-full sm:w-auto border border-border">
            <button
              onClick={() => { setActiveTab('All'); setCurrentPage(1); }}
              className={`cursor-pointer px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'All' ? 'bg-card shadow-sm text-primary border border-border/50' : 'text-muted-foreground hover:text-foreground'}`}
            >
              All Product ({products.length})
            </button>
            <button
              onClick={() => { setActiveTab('Sale'); setCurrentPage(1); }}
              className={`cursor-pointer px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'Sale' ? 'bg-card shadow-sm text-primary border border-border/50' : 'text-muted-foreground hover:text-foreground'}`}
            >
              On Sale
            </button>
            <button
              onClick={() => { setActiveTab('Out'); setCurrentPage(1); }}
              className={`cursor-pointer px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'Out' ? 'bg-card shadow-sm text-primary border border-border/50' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Out of Stock
            </button>
          </div>

          <div className="flex items-center gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Search your product"
                value={tabSearchQuery}
                onChange={(e) => { setTabSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full bg-muted border border-border rounded-xl py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground transition-colors"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
            </div>
            <button onClick={() => navigate('/admin/add-product')} className="cursor-pointer bg-muted border border-border p-2 rounded-xl text-muted-foreground hover:text-primary transition-colors">
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden mb-8 min-h-[400px]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="bg-muted text-[11px] text-muted-foreground uppercase font-bold tracking-widest border-b border-border">
                  <th className="py-4 pl-6">Product</th>
                  <th className="py-4">Category</th>
                  <th className="py-4">Created Date</th>
                  <th className="py-4">Price</th>
                  <th className="py-4">Order</th>
                  <th className="py-4 text-center">Stock Status</th>
                  <th className="py-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentData.length > 0 ? (
                  currentData.map((product) => (
                    <tr key={product.id} className="hover:bg-muted/50 transition-colors">
                      <td className="py-4 pl-6 flex items-center gap-4">
                        <img src={product.img} alt={product.name} className="w-12 h-12 rounded-xl object-cover bg-muted" />
                        <span className="font-bold text-foreground text-sm">{product.name}</span>
                      </td>
                      <td className="py-4 text-sm text-muted-foreground font-medium">{product.category}</td>
                      <td className="py-4 text-sm text-muted-foreground font-medium">{product.date}</td>
                      <td className="py-4 font-bold text-foreground">{product.formattedPrice}</td>
                      <td className="py-4 text-muted-foreground font-medium">{product.order}</td>
                      <td className="py-4 text-center">
                        <StatusBadge status={product.status} />
                      </td>
                      <td className="py-4 pr-6">
                        <div className="flex justify-end gap-3 text-muted-foreground">
                          <button onClick={() => handleEdit(product.id)} className="cursor-pointer hover:text-primary transition-colors"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(product.id)} className="cursor-pointer hover:text-destructive transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-sm text-muted-foreground font-semibold">
                      No products found. Adjust your filters or search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm font-medium text-muted-foreground">
            <p>
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} products
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className={`flex items-center gap-1 px-3 py-1.5 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:text-foreground'}`}>
                <ChevronLeft size={16} /> Previous
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg transition-colors border border-transparent ${currentPage === i + 1 ? 'bg-primary text-primary-foreground font-bold shadow-sm' : 'hover:bg-muted border-border/50'}`}>
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className={`flex items-center gap-1 px-3 py-1.5 font-bold border border-border rounded-lg transition-colors ml-2 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-muted text-foreground'}`}>
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminProducts;
