import React from 'react';
import { Link } from 'react-router-dom';
import Card3 from '../components/Common/Card3';
import Sidebar from '../components/Sidebar';
import Pagination from '../components/Pagination';
import shopProducts from '../data/shopProducts.json';

const ProductsPage = () => {
  const [products] = React.useState(shopProducts);

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-8">

          <Sidebar />

          <div className="flex-1">
            {/* Header / Search & Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div className="relative w-full max-w-[480px]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ea4b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                </div>
                <input
                  type="text"
                  placeholder="Search curated products..."
                  className="block w-full pl-12 pr-4 py-3.5 bg-muted rounded-xl text-[15px] font-medium text-foreground placeholder:text-muted-foreground placeholder:font-normal outline-none border-none focus:ring-0 transition-colors"
                />
              </div>

              <div className="flex items-center text-sm text-muted-foreground shrink-0 space-x-4">
                <span>Showing {products.length} products</span>
                <div className="h-4 w-px bg-border"></div>
                <button className="flex items-center text-foreground font-medium hover:text-primary transition-colors">
                  Sort by: Newest
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down ml-1"><path d="m6 9 6 6 6-6" /></svg>
                </button>
              </div>
            </div>

            {/* Product Grid using Card3 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {products.map((product) => (
                <Link to={`/product/${product.id}`} key={product.id}>
                  <Card3
                    image={product.image}
                    title={product.title}
                    price={product.price}
                    inStock={product.inStock}
                  />
                </Link>
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
