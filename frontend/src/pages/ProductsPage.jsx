import React from 'react';
import Sidebar from '../components/Sidebar';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';

const PRODUCTS = [
  {
    id: 1,
    title: 'Sana Vase',
    price: '$185.00',
    status: 'IN STOCK',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&q=80',
  },
  {
    id: 2,
    title: 'Lunar Horizon',
    price: '$420.00',
    status: 'LOW STOCK',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
  },
  {
    id: 3,
    title: 'Echo Audio S1',
    price: '$349.00',
    status: 'IN STOCK',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
  },
  {
    id: 4,
    title: 'Bespoke Lounge',
    price: '$1,250.00',
    status: 'OUT OF STOCK',
    image: 'https://images.unsplash.com/photo-1506459225024-1428097a7e18?w=500&q=80',
  },
  {
    id: 5,
    title: 'Atlas Wallet',
    price: '$85.00',
    status: 'IN STOCK',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80',
  },
  {
    id: 6,
    title: 'Aviator Pro',
    price: '$210.00',
    status: 'IN STOCK',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80',
  },
  {
    id: 7,
    title: 'Moment Cam',
    price: '$129.00',
    status: 'IN STOCK',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80',
  },
  {
    id: 8,
    title: 'Earth Bowl Set',
    price: '$115.00',
    status: 'IN STOCK',
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500&q=80',
  },
];

const ProductsPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-8">
          
          <Sidebar />

          <div className="flex-1">
            {/* Header / Search & Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search text-muted-foreground"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
                <input 
                   type="text" 
                   placeholder="Search curated products..." 
                   className="block w-full pl-10 pr-3 py-2 border-transparent bg-surface-soft rounded-radius-md text-sm placeholder:text-muted-foreground focus:border-border focus:ring-1 focus:ring-ring focus:outline-none transition-colors"
                />
              </div>
              
              <div className="flex items-center text-sm text-text-muted shrink-0 space-x-4">
                <span>Showing 24 products</span>
                <div className="h-4 w-px bg-border"></div>
                <button className="flex items-center text-text-main font-medium hover:text-primary transition-colors">
                  Sort by: Newest
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down ml-1"><path d="m6 9 6 6 6-6"/></svg>
                </button>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {PRODUCTS.map((product) => (
                <ProductCard 
                  key={product.id}
                  title={product.title}
                  price={product.price}
                  status={product.status}
                  image={product.image}
                />
              ))}
            </div>

            <Pagination />
          </div>

        </div>
      </main>
    </div>
  );
};

export default ProductsPage;
