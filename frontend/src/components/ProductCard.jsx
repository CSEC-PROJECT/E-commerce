import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Star, Plus } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import useCartStore from '../store/cartStore';
import { useToastStore } from '../store/toastStore';

const StarRating = ({ rating = 5 }) => (
  <div className="flex items-center gap-1">
    <div className="flex text-warning text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={12} 
          fill={i < Math.floor(rating) ? "currentColor" : "none"} 
          className={i < Math.floor(rating) ? "" : "text-muted"}
        />
      ))}
    </div>
    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-tighter">
      {Number(rating ?? 0).toFixed(1)}
    </span>
  </div>
);

const ProductCard = ({ id, image, title, price, status, rating }) => {
  const user = useAuthStore((state) => state.user);
  const addToCart = useCartStore((state) => state.addToCart);
  const addToast = useToastStore((state) => state.addToast);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (user) {
      await addToCart({ product: id, quantity: 1, price });
      addToast('Product added to cart', 'success');
    } else {
      addToast('Please login to add items to your cart', 'info');
      navigate('/login', { state: { from: location } });
    }
  };

  const getStatusClasses = (status) => {
    switch (status?.toLowerCase()) {
      case 'new':
        return 'bg-success/10 text-success border-success/20';
      case 'slightly used':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'used':
        return 'bg-warning/10 text-warning-foreground border-warning/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <Link 
      to={`/product/${id}`} 
      className="group relative flex flex-col bg-card rounded-2xl p-3 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] mb-4 rounded-xl overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
        />
        
        {/* Status Badges */}
        {status && (
          <div className="absolute top-2 left-2 z-10">
            <span className={`px-2.5 py-1 text-[10px]  font-bold uppercase tracking-widest rounded-lg shadow-sm backdrop-blur-md border ${getStatusClasses(status)}`}>
              {status}
            </span>
          </div>
        )}

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out hidden md:block">
          <button
            onClick={handleAddToCart}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-xl"
          >
            <Plus size={14} /> Quick Add
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="px-1 flex flex-col gap-1.5">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-base font-bold text-primary">
            ETB {price?.toFixed(2)}
          </p>
        </div>

        <div className="flex items-center justify-between mt-1">
          <StarRating rating={rating} />
          
          {/* Mobile Add Button */}
          <button 
            onClick={handleAddToCart}
            className="md:hidden p-2 rounded-full bg-primary text-primary-foreground active:scale-95 transition-all"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;