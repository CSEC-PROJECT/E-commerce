import React, { useState } from 'react';
import { Search, User, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Globe, Share2, Mail, Phone, MapPin, CreditCard } from 'lucide-react';

export default function Frame4Page() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Elysian Chronograph',
      tag: 'HOROLOGY',
      variant: 'Lunar Silver / 40mm',
      price: 240.0,
      quantity: 1,
      image: 'https://picsum.photos/id/175/300/300'
    },
    {
      id: 2,
      name: 'Atelier Sound V2',
      tag: 'AUDIO',
      variant: 'Midnight Black',
      price: 395.0,
      quantity: 1,
      image: 'https://picsum.photos/id/160/300/300'
    },
    {
      id: 3,
      name: 'Twilight Fig Candle',
      tag: 'LIFESTYLE',
      variant: '12oz Glass',
      price: 65.0,
      quantity: 2,
      image: 'https://picsum.photos/id/106/300/300'
    }
  ]);

  const recommendedItems = [
    {
      id: 101,
      name: 'Artisan Leather Tote',
      price: 420.0,
      image: 'https://picsum.photos/id/88/300/300'
    },
    {
      id: 102,
      name: 'Crimson Runner',
      price: 185.0,
      image: 'https://picsum.photos/id/21/300/300'
    },
    {
      id: 103,
      name: 'Stone Brew Set',
      price: 85.0,
      image: 'https://picsum.photos/id/113/300/300'
    },
    {
      id: 104,
      name: 'Onyx Fountain Pen',
      price: 115.0,
      image: 'https://picsum.photos/id/36/300/300'
    }
  ];

  const updateQuantity = (id, delta) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Top Navbar */}
      <nav className="w-full bg-white border-b px-6 lg:px-12 py-4 flex items-center justify-between sticky top-0 z-10 transition-shadow">
        <div className="font-bold text-xl tracking-wider uppercase flex-shrink-0 cursor-pointer">
          E-Shop
        </div>
        <div className="hidden md:flex items-center space-x-8 font-medium text-sm text-gray-600">
          <a href="#" className="hover:text-black transition-colors">Home</a>
          <a href="#" className="hover:text-black transition-colors">Products</a>
          <a href="#" className="hover:text-black transition-colors">About</a>
          <a href="#" className="hover:text-black transition-colors">Contact</a>
        </div>
        <div className="flex items-center space-x-5 text-gray-500">
          <button className="hover:text-black transition-colors" aria-label="Search"><Search size={20} /></button>
          <button className="hover:text-black transition-colors" aria-label="User"><User size={20} /></button>
          <button className="hover:text-black transition-colors relative" aria-label="Cart">
            <ShoppingBag size={20} />
            {cartItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#0062FF] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-16">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-2">Your Shopping Bag</h1>
          <p className="text-gray-500 text-lg">Review your selections from the Digital Atelier.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left Column: Cart Items (approx 2/3 width) */}
          <div className="w-full lg:w-2/3 flex flex-col space-y-6">
            {cartItems.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag size={32} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-bold mb-2">Your bag is empty</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Explore our top products and find something you love.</p>
                <button className="bg-[#0062FF] hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-colors cursor-pointer">
                  Continue Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="bg-white p-5 lg:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6 group">
                  <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>

                  <div className="flex-grow flex flex-col w-full">
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-xs font-bold text-[#0062FF] tracking-wider mb-1">{item.tag}</div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <div>
                        <h3 className="font-bold text-lg leading-tight mb-1">{item.name}</h3>
                        <p className="text-gray-500 text-sm">{item.variant}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</div>
                        <div className="text-gray-400 text-xs mt-0.5">${item.price.toFixed(2)} / unit</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex items-center border border-gray-200 rounded-full h-10 w-fit">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 rounded-l-full transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 flex justify-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 rounded-r-full transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Column: Order Summary (approx 1/3 width) - Sticky container */}
          <div className="w-full lg:w-1/3 static lg:sticky top-28">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-black">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Tax</span>
                  <span className="font-medium text-black">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="mb-6 pt-6 border-t border-gray-100">
                <p className="text-sm font-medium mb-3 text-gray-700">Promo Code</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-grow w-full border border-gray-200 rounded-lg h-12 px-4 focus:outline-none focus:ring-2 focus:ring-[#0062FF]/20 focus:border-[#0062FF] transition-all bg-gray-50"
                  />
                  <button className="h-12 px-6 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors cursor-pointer whitespace-nowrap">
                    Apply
                  </button>
                </div>
              </div>

              <div className="mb-8 pt-6 border-t border-gray-100 flex justify-between items-end">
                <span className="text-lg font-bold">Total</span>
                <span className="text-3xl font-extrabold text-[#0062FF]">${total.toFixed(2)}</span>
              </div>

              <button className="w-full min-h-[56px] h-14 bg-[#0062FF] hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all cursor-pointer">
                Checkout
                <ArrowRight size={20} />
              </button>

              <div className="mt-6 flex flex-col gap-2 text-xs text-gray-500 font-medium">
                <div className="flex items-center gap-2 justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Arrives in 3-5 business days
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Free 30-day returns
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Secure checkout powered by Stripe
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* You May Also Like Section */}
        <section className="mt-20">
          <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-center pb-2 border-b border-gray-200 inline-block">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedItems.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 aspect-square mb-4 relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                  <button className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 bg-white shadow-lg text-black font-medium text-sm px-6 py-2.5 rounded-full transition-all duration-300 hover:bg-gray-50">
                    Quick Add
                  </button>
                </div>
                <h4 className="font-bold text-lg group-hover:text-[#0062FF] transition-colors">{item.name}</h4>
                <p className="text-gray-500 font-medium">${item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 w-full bg-[#f9fafb] py-16 px-6 lg:px-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand/Description */}
            <div className="col-span-1 md:col-span-1">
              <h3 className="text-3xl font-extrabold text-[#111827] mb-4">E-Shop</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                The Digital Atelier. Where curated aesthetics meet modern functionality in every piece we offer.
              </p>
              <div className="flex gap-3">
                <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:text-black hover:border-gray-300 transition-colors">
                  <Globe size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 hover:text-black hover:border-gray-300 transition-colors">
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* Shop Links */}
            <div className="col-span-1 flex flex-col gap-4">
              <h4 className="text-sm font-bold tracking-widest text-[#111827] uppercase mb-2">SHOP</h4>
              <a href="#" className="text-gray-500 hover:text-black transition-colors text-sm">All Products</a>
              <a href="#" className="text-gray-500 hover:text-black transition-colors text-sm">New Arrivals</a>
              <a href="#" className="text-gray-500 hover:text-black transition-colors text-sm">Featured</a>
              <a href="#" className="text-gray-500 hover:text-black transition-colors text-sm">Sale</a>
            </div>

            {/* Support Links */}
            <div className="col-span-1 flex flex-col gap-4">
              <h4 className="text-sm font-bold tracking-widest text-[#111827] uppercase mb-2">SUPPORT</h4>
              <a href="#" className="text-gray-500 hover:text-black transition-colors text-sm">Shipping & Returns</a>
              <a href="#" className="text-gray-500 hover:text-black transition-colors text-sm">FAQ</a>
              <a href="#" className="text-gray-500 hover:text-black transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-black transition-colors text-sm">Privacy Policy</a>
            </div>

            {/* Contact Info */}
            <div className="col-span-1 flex flex-col gap-4">
              <h4 className="text-sm font-bold tracking-widest text-[#111827] uppercase mb-2">CONTACT</h4>
              <div className="flex items-center gap-3 text-gray-500 text-sm">
                <Mail size={16} className="text-[#6366f1]" />
                <span>hello@atelier.shop</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500 text-sm">
                <Phone size={16} className="text-[#6366f1]" />
                <span>+1 (555) 000-0000</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500 text-sm">
                <MapPin size={16} className="text-[#6366f1]" />
                <span>123 Digital Ave, Tech City</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-500 text-xs font-medium">
              © 2024 Digital Atelier. All rights reserved.
            </div>
            <div className="flex gap-2 text-gray-300">
              <CreditCard size={20} />
              <CreditCard size={20} />
              <CreditCard size={20} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
