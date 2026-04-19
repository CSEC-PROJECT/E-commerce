import React, { useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';
import Pagination from '../components/Pagination';
import { useProductStore } from '../store/productStore';
import { useToastStore } from '../store/toastStore';
import { useAuthStore } from '../store/authStore';

function SkeletonCard() {
  return (
    <div className="flex flex-col w-full rounded-xl sm:rounded-[1.5rem] animate-pulse">
      <div className="w-full aspect-[4/5] bg-muted rounded-xl sm:rounded-[1.5rem]" />
      <div className="flex flex-col pt-3 sm:pt-4 md:pt-6 px-0.5 sm:px-1">
        <div className="h-4 w-16 bg-muted rounded-full mb-2" />
        <div className="h-5 w-3/4 bg-muted rounded mt-1" />
        <div className="h-4 w-1/3 bg-muted rounded mt-2" />
      </div>
    </div>
  );
}

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search") || "";

  const { products, totalProducts, loading, error, fetchProducts, clearError } = useProductStore();
  const addToast = useToastStore((s) => s.addToast);

  const loadProducts = useCallback(() => {
    const params = { limit: 20 };
    if (category) params.category = category;
    if (searchQuery) params.search = searchQuery;

    fetchProducts(params).catch((err) => {
      addToast(
        err.message || "Failed to load products. Please try again.",
        "error",
        5000
      );
    });
  }, [category, searchQuery, fetchProducts, addToast]);

  useEffect(() => {
    clearError();
    loadProducts();
  }, [loadProducts, clearError]);

  useEffect(() => {
    return () => {
      useProductStore.getState().cancelRequests();
    };
  }, []);

  const searchTimerRef = React.useRef(null);
  const handleSearchChange = (e) => {
    const value = e.target.value;
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      const next = {};
      if (category) next.category = category;
      if (value.trim()) next.search = value.trim();
      setSearchParams(next);
    }, 400);
  };

  const clearCategory = () => {
    const next = {};
    if (searchQuery) next.search = searchQuery;
    setSearchParams(next);
  };

  const clearSearch = () => {
    const next = {};
    if (category) next.category = category;
    setSearchParams(next);
  };

  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-8">

          <Sidebar />

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div className="relative w-full max-w-[480px]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ea4b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                </div>
                <input
                  id="products-search"
                  type="text"
                  defaultValue={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search products..."
                  className="block w-full pl-12 pr-10 py-3.5 bg-muted rounded-xl text-[15px] font-medium text-foreground placeholder:text-muted-foreground placeholder:font-normal outline-none border-none focus:ring-0 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Clear search"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                )}
              </div>

              <div className="flex items-center text-sm text-muted-foreground shrink-0 space-x-4">
                <span>
                  {loading
                    ? "Loading..."
                    : `${totalProducts} product${totalProducts !== 1 ? "s" : ""}`}
                </span>
                <div className="h-4 w-px bg-border" />
                <button className="flex items-center text-foreground font-medium hover:text-primary transition-colors">
                  Sort: Newest
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down ml-1"><path d="m6 9 6 6 6-6" /></svg>
                </button>
              </div>
            </div>

            {(category || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-xs text-muted-foreground font-medium">Active filters:</span>
                {category && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    {category}
                    <button onClick={clearCategory} aria-label="Remove category filter" className="hover:opacity-70 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted text-foreground text-xs font-semibold rounded-full border border-border">
                    "{searchQuery}"
                    <button onClick={clearSearch} aria-label="Remove search filter" className="hover:opacity-70 transition-opacity">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {/* Loading skeletons */}
              {loading && products.length === 0 &&
                Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={`skel-${i}`} />)
              }

              {/* Error State */}
              {!loading && error && products.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Unable to load products</h3>
                  <p className="text-sm text-muted-foreground mb-5 max-w-sm">{error}</p>
                  <button
                    onClick={loadProducts}
                    className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Products */}
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  image={product.coverImage}
                  title={product.name}
                  price={product. discountedPrice ?? product.price}
                  status={
                    product.stock > 0
                      ? "IN STOCK"
                      : "OUT OF STOCK"
                  }
                />
              ))}

              {/* Empty state */}
              {!loading && !error && products.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <p className="text-muted-foreground text-lg font-medium">
                    {category
                      ? `No products found in "${category}".`
                      : searchQuery
                        ? `No results for "${searchQuery}".`
                        : "No products available yet. Check back soon!"}
                  </p>
                  {(category || searchQuery) && (
                    <Link
                      to="/products"
                      className="inline-block mt-4 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                    >
                      View All Products
                    </Link>
                  )}
                </div>
              )}
            </div>

            <Pagination />
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
    </div>
  );
};

export default ProductsPage;
