import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/home/Hero";
import CuratedCategories from "../components/home/CuratedCategories";
import Newsletter from "../components/home/Newsletter";
import ProductCard from "../components/ProductCard";
import { useProductStore } from "../store/productStore";
import { useToastStore } from "../store/toastStore";


/* ─── Skeleton Card (pulse placeholder while loading) ─── */
function SkeletonCard() {
  return (
    <div className="flex flex-col w-full bg-card rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-sm border border-transparent animate-pulse">
      {/* Image placeholder */}
      <div className="w-full aspect-[4/5] bg-muted rounded-xl sm:rounded-2xl mb-3 sm:mb-4" />
      {/* Content placeholders */}
      <div className="flex flex-col px-0.5 sm:px-1 mb-3 sm:mb-4">
        <div className="flex justify-between items-start mb-2">
          <div className="h-3 w-16 bg-muted rounded" />
          <div className="h-6 w-14 bg-muted rounded" />
        </div>
        <div className="h-4 w-3/4 bg-muted rounded mt-1" />
      </div>
      {/* Meta row placeholder */}
      <div className="flex items-center justify-between px-0.5 sm:px-1 mb-3 sm:mb-5 mt-auto">
        <div className="h-3 w-20 bg-muted rounded" />
        <div className="h-3 w-14 bg-muted rounded" />
      </div>
      {/* Button placeholder */}
      <div className="w-full h-11 sm:h-[52px] bg-muted rounded-lg sm:rounded-xl" />
    </div>
  );
}

/* ─── Error State ─── */
function ErrorState({ message, onRetry }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">Unable to load products</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">{message}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      >
        Try Again
      </button>
    </div>
  );
}

/* ─── Helpers ─── */
function formatPrice(price) {
  if (typeof price === "number") {
    return `$${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return price;
}

export default function Home() {
  const { latestProducts, loading, error, fetchLatestProducts, clearError } = useProductStore();
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    fetchLatestProducts().catch((err) => {
      addToast(
        err.message || "Something went wrong loading products. Please try again.",
        "error",
        5000
      );
    });
  }, [fetchLatestProducts, addToast]);

  const handleRetry = () => {
    clearError();
    fetchLatestProducts(true).catch((err) => {
      addToast(err.message || "Still unable to load products. Please check your connection.", "error", 5000);
    });
  };

  return (
    <div className="font-sans antialiased bg-background text-foreground">
      <Hero />
      <CuratedCategories />

      {/* Product Selection Section using Card2 mapped from API */}
      <section className="bg-muted/30 py-28 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-14">
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">New Arrivals</h2>
              <p className="text-muted-foreground text-lg max-w-md font-medium leading-relaxed">
                Discover our latest arrivals, fresh from our artisans to you.
              </p>
            </div>
            <Link
              to="/products"
              className="text-primary hover:opacity-80 font-bold text-[11px] uppercase tracking-[0.2em] flex items-center gap-2 mt-4 md:mt-0 transition-opacity group"
            >
              View All <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Loading State */}
            {loading && latestProducts.length === 0 &&
              Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)
            }

            {/* Error State */}
            {!loading && error && latestProducts.length === 0 && (
              <ErrorState message={error} onRetry={handleRetry} />
            )}

            {/* Products */}
            {latestProducts.length > 0 &&
              latestProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  image={product.coverImage}
                  title={product.name}
                  price={product.discountedPrice ?? product.price}
                  status={
                    product.stock > 0
                      ? "IN STOCK"
                      : "OUT OF STOCK"
                  }
                  rating={product.averageRating}
                />
              ))
            }

            {/* Empty state — no products and not loading */}
            {!loading && !error && latestProducts.length === 0 && (
              <div className="col-span-full text-center py-16">
                <p className="text-muted-foreground text-lg font-medium">No products available yet. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}
