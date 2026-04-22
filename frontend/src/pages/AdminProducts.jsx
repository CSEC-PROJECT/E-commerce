import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Grid, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Loader2, ChevronDown } from 'lucide-react';
import Sidebar from '../components/Common/Sidebar';
import { useProducts } from '../hooks/useProducts';

const StatusBadge = ({ status }) => {
  let bgColor = "bg-green-100 dark:bg-green-900/30";
  let textColor = "text-green-600 dark:text-green-400";
  const upperStatus = status?.toUpperCase() || '';

  if (upperStatus === "LOW STOCK" || upperStatus === "LOW") {
    bgColor = "bg-red-100 dark:bg-red-900/30";
    textColor = "text-red-500 dark:text-red-400";
  } else if (upperStatus === "OUT OF STOCK" || upperStatus === "OUT") {
    bgColor = "bg-indigo-100 dark:bg-indigo-900/30";
    textColor = "text-indigo-600 dark:text-indigo-400";
  }

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider capitalize ${bgColor} ${textColor}`}>
      {status || 'Unknown'}
    </span>
  );
};

const AdminProducts = () => {
  const navigate = useNavigate();

  // State Declarations
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [tabSearchQuery, setTabSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [priceFilter, setPriceFilter] = useState('Any Price');
  const [statusFilter, setStatusFilter] = useState('Any Status');
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  const { products, loading, error, totalPages, deleteProduct } = useProducts({
    searchQuery,
    tabSearchQuery,
    categoryFilter,
    statusFilter,
    priceFilter,
    currentPage,
    itemsPerPage: ITEMS_PER_PAGE,
  });

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
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const res = await deleteProduct(id);
      if (res && !res.success) {
        alert(res.error || 'Failed to delete product');
      }
    }
  };

  // Edit product
  const handleEdit = (id) => {
    navigate(`/admin/edit-product/${id}`);
  };

  // Tabs filtering is now fully offloaded to the backend via statusFilter mapping
  const displayedProducts = products;

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
                disabled={loading}
              />
            </div>
          </div>
          <div className="flex items-center gap-4 self-end sm:self-auto">
            {/* <button className="text-muted-foreground hover:text-primary transition-colors p-2"><Bell size={20} /></button>
            <button className="text-muted-foreground hover:text-primary transition-colors p-2"><Grid size={20} /></button> */}
            <button onClick={() => navigate('/admin/add-product')} disabled={loading} className="cursor-pointer flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-xl text-sm font-bold shadow-sm hover:brightness-110 transition-all disabled:opacity-50">
              <Plus size={18} /> Add Product
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-4 p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
            <span className="font-medium">Error!</span> {error}
          </div>
        )}

        {/* Filters */}
        <section className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Category</label>
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                disabled={loading}
                className="w-full bg-muted border border-border rounded-xl py-3 px-4 text-sm font-semibold text-foreground appearance-none cursor-pointer focus:ring-2 focus:ring-primary/50 transition-colors disabled:opacity-50">
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
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Price Range</label>
            <div className="relative">
              <select
                value={priceFilter}
                onChange={(e) => { setPriceFilter(e.target.value); setCurrentPage(1); }}
                disabled={loading}
                className="w-full bg-muted border border-border rounded-xl py-3 px-4 text-sm font-semibold text-foreground appearance-none cursor-pointer focus:ring-2 focus:ring-primary/50 transition-colors disabled:opacity-50">
                <option>Any Price</option>
                <option>Under ETB 50</option>
                <option>ETB 50 - ETB 100</option>
                <option>ETB 100 - ETB 200</option>
                <option>ETB 200 - ETB 500</option>
                <option>ETB 500+</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Stock Status</label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  const val = e.target.value;
                  setStatusFilter(val);
                  if (val === 'Out of Stock') setActiveTab('Out');
                  else if (val === 'In Stock') setActiveTab('Sale');
                  else if (val === 'Any Status') setActiveTab('All');
                  else setActiveTab('');
                  setCurrentPage(1);
                }}
                disabled={loading}
                className="w-full bg-muted border border-border rounded-xl py-3 px-4 text-sm font-semibold text-foreground appearance-none cursor-pointer focus:ring-2 focus:ring-primary/50 transition-colors disabled:opacity-50">
                <option>Any Status</option>
                <option>In Stock</option>
                <option>Out of Stock</option>
                <option>Low Stock</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            </div>
          </div>
          <div className="flex-1 min-w-[200px] flex items-end">
            <button
              onClick={handleClearFilters}
              disabled={loading}
              className="cursor-pointer w-full bg-muted border border-border text-foreground font-bold py-3 rounded-xl text-sm hover:brightness-95 dark:hover:brightness-110 transition-all disabled:opacity-50">
              Clear All Filters
            </button>
          </div>
        </section>

        {/* Tabs & Tab Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="flex bg-muted rounded-2xl p-1.5 w-full sm:w-auto border border-border">
            <button
              onClick={() => { setActiveTab('All'); setStatusFilter('Any Status'); setCurrentPage(1); }}
              disabled={loading}
              className={`cursor-pointer px-6 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 ${activeTab === 'All' ? 'bg-card shadow-sm text-primary border border-border/50' : 'text-muted-foreground hover:text-foreground'}`}
            >
              All Product
            </button>
            <button
              onClick={() => { setActiveTab('Sale'); setStatusFilter('In Stock'); setCurrentPage(1); }}
              disabled={loading}
              className={`cursor-pointer px-6 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 ${activeTab === 'Sale' ? 'bg-card shadow-sm text-primary border border-border/50' : 'text-muted-foreground hover:text-foreground'}`}
            >
              On Sale
            </button>
            <button
              onClick={() => { setActiveTab('Out'); setStatusFilter('Out of Stock'); setCurrentPage(1); }}
              disabled={loading}
              className={`cursor-pointer px-6 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 ${activeTab === 'Out' ? 'bg-card shadow-sm text-primary border border-border/50' : 'text-muted-foreground hover:text-foreground'}`}
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
                disabled={loading}
                className="w-full bg-muted border border-border rounded-xl py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground transition-colors disabled:opacity-50"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
            </div>
            <button onClick={() => navigate('/admin/add-product')} disabled={loading} className="cursor-pointer bg-muted border border-border p-2 rounded-xl text-muted-foreground hover:text-primary transition-colors disabled:opacity-50">
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden mb-8 min-h-[400px]">
          {loading && !products.length ? (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground text-sm font-medium">Loading products...</p>
            </div>
          ) : (
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
                  {displayedProducts.length > 0 ? (
                    displayedProducts.map((product) => {
                      const id = product._id || product.id;
                      const dateStr = product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A';
                      const formattedPrice = typeof product.price === 'number' ? `ETB ${product.price.toFixed(2)}` : 'N/A';

                      return (
                        <tr key={id} className="hover:bg-muted/50 transition-colors">
                          <td className="py-4 pl-6 flex items-center gap-4">
                            <img src={product.coverImage || product.img || 'https://via.placeholder.com/100'} alt={product.name} className="w-12 h-12 rounded-xl object-cover bg-muted" />
                            <span className="font-bold text-foreground text-sm">{product.name}</span>
                          </td>
                          <td className="py-4 text-sm text-muted-foreground font-medium">{product.category || 'Uncategorized'}</td>
                          <td className="py-4 text-sm text-muted-foreground font-medium">{dateStr}</td>
                          <td className="py-4 font-bold text-foreground">{formattedPrice}</td>
                          <td className="py-4 text-muted-foreground font-medium">{product.order || '-'}</td>
                          <td className="py-4 text-center">
                            <StatusBadge status={product.status || 'IN STOCK'} />
                          </td>
                          <td className="py-4 pr-6">
                            <div className="flex justify-end gap-3 text-muted-foreground">
                              <button onClick={() => handleEdit(id)} disabled={loading} className="cursor-pointer hover:text-primary transition-colors disabled:opacity-50"><Edit2 size={16} /></button>
                              <button onClick={() => handleDelete(id)} disabled={loading} className="cursor-pointer hover:text-destructive transition-colors disabled:opacity-50"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
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
          )}
        </div>

        {/* Pagination */}
        {totalPages > 0 && !loading && (
          <div className="flex flex-col sm:flex-row justify-end items-center gap-4 text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1 || loading}
                onClick={() => setCurrentPage(p => p - 1)}
                className={`flex items-center gap-1 px-3 py-1.5 transition-colors ${currentPage === 1 || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:text-foreground'}`}>
                <ChevronLeft size={16} /> Previous
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  disabled={loading}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg transition-colors border border-transparent disabled:opacity-50 ${currentPage === i + 1 ? 'bg-primary text-primary-foreground font-bold shadow-sm' : 'hover:bg-muted border-border/50'}`}>
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages || loading || totalPages === 0}
                onClick={() => setCurrentPage(p => p + 1)}
                className={`flex items-center gap-1 px-3 py-1.5 font-bold border border-border rounded-lg transition-colors ml-2 ${currentPage === totalPages || loading || totalPages === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-muted text-foreground'}`}>
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

      </main>
    </div >
  );
};

export default AdminProducts;
