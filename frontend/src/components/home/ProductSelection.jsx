import React, { useEffect, useState } from 'react';
import { ShoppingCart, Star } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import useCartStore from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import { useProductStore } from "../../store/productStore";
import toast from "react-hot-toast";

export default function ProductSelection() {
  const allProducts = useProductStore(state => state.products);
  const isGlobalLoading = useProductStore(state => state.loading);
  const products = allProducts.slice(0, 4);
  const loading = isGlobalLoading && products.length === 0;

  const addToCart = useCartStore(state => state.addToCart);
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAddToCart = async (e, product) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (!user) {
          navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
          return;
      }

      try {
          await addToCart({
              product: product._id,
              quantity: 1,
              price: product.price
          });
          toast.success("Added to cart successfully");
          navigate('/cart');
      } catch (err) {
          toast.error("Failed to add to cart");
      }
  };

  return (
    <section className="bg-[#f2f4fc] py-28 px-4 md:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">The Selection</h2>
          <p className="text-gray-500 text-lg max-w-md font-medium leading-relaxed">
            A handpicked collection of pieces designed for the modern individual.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
             <div className="col-span-full py-16 text-center text-muted-foreground animate-pulse">Loading curated selections...</div>
          ) : (
            products.map((product) => (
             <Link to={`/product/${product._id}`} key={product._id} className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col group border border-gray-100/50 cursor-pointer">
                <div className="w-full h-72 rounded-[1.5rem] mb-5 relative overflow-hidden flex items-center justify-center">
                  <img src={product.coverImage || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=60"} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="flex flex-col flex-grow px-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-[#5c53e5] font-extrabold uppercase tracking-widest bg-[#5c53e5]/10 px-2.5 py-1 rounded-md">{product.category || "Curation"}</span>
                    <span className="text-lg text-[#5c53e5] font-extrabold">ETB {parseFloat(product.price).toFixed(2)}</span>
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-xl mb-3 tracking-tight">{product.name}</h3>
                  
                  <div className="flex justify-between items-center mb-6 mt-auto">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-extrabold text-gray-700">{product.rating || 5.0}</span>
                      <span className="text-sm text-gray-400 font-medium">({product.reviews || 0})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className={`text-[11px] uppercase tracking-wider font-extrabold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock > 0 ? 'In Stock' : 'Low Stock'}
                      </span>
                    </div>
                  </div>

                  <Button 
                    disabled={product.stock < 1}
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-full bg-[#5c53e5] hover:bg-[#4840b8] text-white flex items-center justify-center gap-2 py-6 rounded-xl transition-transform duration-200 active:scale-95 text-base font-extrabold shadow-md shadow-[#5c53e5]/20 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ShoppingCart className="w-5 h-5" /> {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
