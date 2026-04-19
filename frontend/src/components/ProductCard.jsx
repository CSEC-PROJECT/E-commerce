import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Star, Plus } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import useCartStore from '../store/cartStore';
import { useToastStore } from '../store/toastStore';

const StarRating = ({ rating = 5 }) => (
  <div className="flex items-center gap-1">
    <div className="flex text-amber-400">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={12} 
          fill={i < Math.floor(rating) ? "currentColor" : "none"} 
          className={i < Math.floor(rating) ? "" : "text-gray-300"}
        />
      ))}
    </div>
    <span className="text-[10px] font-medium text-gray-500 uppercase tracking-tighter">
      {rating?.toFixed(1)}
    </span>
  </div>
);

const ProductCard = ({ id, image, title, price, status, rating }) => {
  const isOutOfStock = status === 'OUT OF STOCK';
  const isInStock = status === 'IN STOCK';
  
  const user = useAuthStore((state) => state.user);
  const addToCart = useCartStore((state) => state.addToCart);
  const addToast = useToastStore((state) => state.addToast);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    if (user) {
      addToCart({ product: id, quantity: 1, price });
      addToast('Product added to cart', 'success');
    } else {
      addToast('Please login to add items to your cart', 'info');
      navigate('/login', { state: { from: location } });
    }
  };

  return (
    <Link 
      to={`/product/${id}`} 
      className="group relative flex flex-col bg-white rounded-2xl p-3 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] mb-4 rounded-xl overflow-hidden bg-gray-50">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
        />
        
        {/* Status Badges */}
        {status && !isOutOfStock && (
          <div className="absolute top-2 left-2 z-10">
            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-sm backdrop-blur-md ${
              isInStock 
                ? 'bg-emerald-100/90 text-emerald-700 border border-emerald-200' 
                : 'bg-blue-100/90 text-blue-700 border border-blue-200'
            }`}>
              {status}
            </span>
          </div>
        )}

        {/* Quick Add Overlay */}
        {!isOutOfStock && (
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out hidden md:block">
            <button
              onClick={handleAddToCart}
              className="w-full py-3 bg-gray-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-xl"
            >
              <Plus size={14} /> Quick Add
            </button>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-slate-800 text-white px-4 py-2 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase shadow-lg">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="px-1 flex flex-col gap-1.5">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-base font-bold text-gray-900">
            ETB {price?.toFixed(2)}
          </p>
        </div>

        <div className="flex items-center justify-between mt-1">
          {rating && <StarRating rating={rating} />}
          
          {/* Mobile Add Button */}
          <button 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="md:hidden p-2 rounded-full bg-gray-900 text-white active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 transition-all"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;