import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Hero from "../components/home/Hero";
import CuratedCategories from "../components/home/CuratedCategories";
import Newsletter from "../components/home/Newsletter";
import AICurator from "../components/AICurator";
import ProductCard from "../components/ProductCard";
import useCartStore from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { useToastStore } from "../store/toastStore";
import { useProductStore } from "../store/productStore";
import { ShoppingCart, Star, Sparkles, X } from "lucide-react";

/* ─── Home Product Card ─── */
const HomeProductCard = ({ product }) => {
  const { user } = useAuthStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const addToast = useToastStore((state) => state.addToast);
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    
    if (user) {
      await addToCart({ product: product._id, quantity: 1, price: product.discountedPrice ?? product.price });
      addToast('Product added to cart', 'success');
    } else {
      addToast('Please login to add items to your cart', 'info');
      navigate('/login');
    }
  };

  const price = product.discountedPrice ?? product.price;

  return (
    <Link to={`/product/${product._id}`} className="group bg-card rounded-[2rem] p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="w-full aspect-square bg-muted rounded-[1.5rem] overflow-hidden mb-5">
        <img 
          src={product.coverImage} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow px-1">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            {product.category || "New"}
          </span>
          <span className="text-xl font-black text-primary">
            ETB {typeof price === 'number' ? price.toFixed(2) : '0.00'}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-foreground leading-snug mb-4 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex justify-between items-center mb-6 mt-auto">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground/80">
            <Star size={14} className="fill-warning text-warning text-yellow-400" />
            <span>{Number(product.averageRating ?? 0).toFixed(1)}</span>
            <span className="text-muted-foreground font-medium text-xs ">({Number(product.reviewCount ?? 0)})</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs font-bold ">
            {product.status?.toLowerCase() === 'new' ? (
              <><span className="w-2 h-2 rounded-full bg-success" /><span className="text-success capitalize">{product.status}</span></>
            ) : product.status?.toLowerCase() === 'slightly used' ? (
              <><span className="w-2 h-2 rounded-full bg-primary" /><span className="text-primary capitalize">{product.status}</span></>
            ) : product.status?.toLowerCase() === 'used' ? (
              <><span className="w-2 h-2 rounded-full bg-warning" /><span className="text-warning-foreground text-yellow-400 capitalize">{product.status}</span></>
            ) : (
              <><span className="w-2 h-2 rounded-full bg-muted-foreground" /><span className="text-muted-foreground capitalize">{product.status || 'Available'}</span></>
            )}
          </div>
        </div>

        <button 
          onClick={handleAddToCart}
          className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:shadow-lg active:scale-95"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      </div>
    </Link>
  );
};

/* ─── Skeleton Card (pulse placeholder while loading) ─── */
function SkeletonCard() {
  return (
    <div className="flex flex-col w-full bg-card rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-sm border border-transparent animate-pulse">
      <div className="w-full aspect-[4/5] bg-muted rounded-xl sm:rounded-2xl mb-3 sm:mb-4" />
      <div className="flex flex-col px-0.5 sm:px-1 mb-3 sm:mb-4">
        <div className="flex justify-between items-start mb-2">
          <div className="h-3 w-16 bg-muted rounded" />
          <div className="h-6 w-14 bg-muted rounded" />
        </div>
        <div className="h-4 w-3/4 bg-muted rounded mt-1" />
      </div>
      <div className="flex items-center justify-between px-0.5 sm:px-1 mb-3 sm:mb-5 mt-auto">
        <div className="h-3 w-20 bg-muted rounded" />
        <div className="h-3 w-14 bg-muted rounded" />
      </div>
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

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");
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
              className="text-primary hover:opacity-80 font-bold text-[15px] uppercase tracking-[0.2em] flex items-center gap-2 mt-4 md:mt-0 transition-opacity group"
            >
              View All
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
                <HomeProductCard
                  key={product._id}
                  product={product}
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

      <AICurator page="home" />
    </div>
  );
}
