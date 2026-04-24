import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';
import Pagination from '../components/Pagination';
import AICurator from '../components/AICurator';
import { useProductStore } from '../store/productStore';
import { useToastStore } from '../store/toastStore';
import { useAuthStore } from '../store/authStore';

// Skeleton — only shown on the very first load (no cached data yet)
const SkeletonCard = () => (
  <div className="flex flex-col w-full animate-pulse">
    <div className="w-full aspect-[4/5] bg-muted rounded-[1.5rem]" />
    <div className="pt-6 space-y-2">
      <div className="h-4 w-1/4 bg-muted rounded-full" />
      <div className="h-5 w-3/4 bg-muted rounded" />
      <div className="h-4 w-1/3 bg-muted rounded" />
    </div>
  </div>
);

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const category    = searchParams.get('category')  || '';
  const searchQuery = searchParams.get('search')    || '';
  const minPrice    = searchParams.get('minPrice')  || '';
  const maxPrice    = searchParams.get('maxPrice')  || '';
  const page        = parseInt(searchParams.get('page') || '1', 10);
  const [searchInput, setSearchInput] = useState(searchQuery);

  const {
    products,
    filteredProducts,
    totalProducts,
    loading,       // true only when grid is empty (first paint)
    error,
    fetchProducts,
    applyFilters,
    clearError,
  } = useProductStore();

  const addToast       = useToastStore((s) => s.addToast);
  const user           = useAuthStore((state) => state.user);
  const searchTimerRef = useRef(null);

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    fetchProducts().catch((err) => {
      addToast(err.message || 'Failed to load products', 'error');
    });
  }, [fetchProducts, addToast]);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Apply filters locally whenever searchParams or products change
  useEffect(() => {
    applyFilters({
      category,
      search: searchQuery,
      minPrice,
      maxPrice
    });
  }, [category, searchQuery, minPrice, maxPrice, products, applyFilters]);


  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (value.trim()) next.set('search', value.trim());
      else next.delete('search');
      next.set('page', '1');
      setSearchParams(next);
    }, 400);
  };

  const removeFilter = (key) => {
    const next = new URLSearchParams(searchParams);
    next.delete(key);
    next.set('page', '1');
    setSearchParams(next);
  };

  const hasActiveFilters = category || searchQuery || minPrice || maxPrice;

  // Grid content decision:
  //  loading=true  → show skeletons (no data at all)
  const showSkeletons = loading && products.length === 0;

  // Frontend Pagination
  const limit = 12;
  const productsToDisplay = filteredProducts.slice((page - 1) * limit, page * limit);

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-8">

          <Sidebar />

          <div className="flex-1">

            {/* ── Search bar + status ── */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <div className="relative w-full max-w-md">
                <input
                  id="product-search"
                  type="text"
                  value={searchInput}
                  onChange={handleSearchChange}
                  placeholder="Search products..."
                  className="w-full pl-12 pr-4 py-3.5 bg-muted rounded-xl outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                />
                <div className="absolute left-4 top-4 text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground whitespace-nowrap">
                {loading
                  ? 'Loading…'
                  : `${totalProducts} product${totalProducts !== 1 ? 's' : ''} found`}
              </div>
            </div>

            {/* ── Active filter chips ── */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {category && (
                  <button
                    onClick={() => removeFilter('category')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full hover:bg-primary/20 transition-colors"
                  >
                    {category} <span className="text-sm">×</span>
                  </button>
                )}
                {searchQuery && (
                  <button
                    onClick={() => removeFilter('search')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted text-foreground text-xs font-bold rounded-full hover:bg-accent transition-colors"
                  >
                    "{searchQuery}" <span className="text-sm">×</span>
                  </button>
                )}
                {(minPrice || maxPrice) && (
                  <button
                    onClick={() => {
                      const next = new URLSearchParams(searchParams);
                      next.delete('minPrice');
                      next.delete('maxPrice');
                      next.set('page', '1');
                      setSearchParams(next);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted text-foreground text-xs font-bold rounded-full hover:bg-accent transition-colors"
                  >
                    {minPrice ? `ETB ${Number(minPrice).toLocaleString()}` : 'ETB0'} – {maxPrice ? `ETB ${Number(maxPrice).toLocaleString()}` : 'ETB100,000'} <span className="text-sm">×</span>
                  </button>
                )}
                <button
                  onClick={() => setSearchParams({})}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-muted-foreground text-xs font-semibold rounded-full hover:text-foreground transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* ── Product grid ── */}
            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 transition-opacity duration-200"
            >
              {showSkeletons ? (
                Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
              ) : error ? (
                <div className="col-span-full py-20 text-center">
                  <div className="bg-destructive/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-destructive font-bold">!</span>
                  </div>
                  <h3 className="text-lg font-semibold">Something went wrong</h3>
                  <p className="text-muted-foreground mb-6">{error}</p>
                  <button
                    onClick={() => fetchProducts()}
                    className="bg-primary text-primary-foreground px-8 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : productsToDisplay.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                  <p className="text-muted-foreground text-lg">No products match your criteria.</p>
                  <button
                    onClick={() => setSearchParams({})}
                    className="text-primary font-semibold mt-2 underline"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                productsToDisplay.map((product) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    image={product.coverImage}
                    title={product.name}
                    price={product.discountedPrice ?? product.price}
                    status={product.status}
                    rating={Number(product.averageRating ?? 0)}
                  />
                ))
              )}
            </div>

            {/* ── Pagination ── */}
            {!loading && filteredProducts.length > 0 && (
              <div className="mt-16 border-t border-border pt-8">
                <Pagination
                  total={totalProducts}
                  current={page}
                  pageSize={12}
                />
              </div>
            )}
          </div>
        </div>
        {!user && (
          <div className="mt-20 py-16 px-6 bg-muted rounded-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Join our curated newsletter
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              for seasonal drops and artisan spotlights.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                to="/signup"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        )}
      </main>
      <AICurator page="products" />
    </div>
  );
};

export default ProductsPage;
