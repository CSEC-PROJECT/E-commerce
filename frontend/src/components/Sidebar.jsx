import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const Sidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const [isOpen, setIsOpen] = useState(false);

  // Categories that match what the backend stores
  const categories = [
    { id: "", label: "All Collections" },
    { id: "Electronics", label: "Electronics" },
    { id: "Footwear", label: "Footwear" },
    { id: "Accessories", label: "Accessories" },
    { id: "Apparel", label: "Apparel" },
  ];

  const handleCategoryClick = (categoryId) => {
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      // Remove category param to show all
      setSearchParams({});
    }
  };

  return (
    <>
      {/* Mobile filter toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-muted rounded-lg text-sm font-semibold text-foreground border border-border w-fit"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
        {activeCategory && (
          <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-md uppercase">
            {activeCategory}
          </span>
        )}
        <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Sidebar content */}
      <aside className={`w-full md:w-56 lg:w-64 flex-shrink-0 md:pr-8 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[600px] opacity-100 mt-4' : 'max-h-0 md:max-h-none opacity-0 md:opacity-100'}`}>
        {/* Category Section */}
        <div className="mb-8 md:mb-10">
          <h3 className="text-xs font-bold text-muted-foreground tracking-wider mb-3 md:mb-4 uppercase">Category</h3>
          <div className="space-y-2.5 md:space-y-3">
            {categories.map((category) => {
              const isActive = category.id === activeCategory;
              return (
                <label
                  key={category.id}
                  className="flex items-center cursor-pointer group"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className={`w-4 h-4 rounded border border-border flex flex-shrink-0 justify-center items-center mr-3 transition-colors ${isActive ? 'bg-primary/10' : 'bg-muted group-hover:bg-primary/5'}`}>
                    {isActive && (
                      <svg className="w-3 h-3 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    )}
                  </div>
                  <span className={`text-sm transition-colors group-hover:text-primary ${isActive ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {category.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Price Range Section */}
        <div className="mb-8 md:mb-10">
          <h3 className="text-xs font-bold text-muted-foreground tracking-wider mb-3 md:mb-4 uppercase">Price Range</h3>
          <div className="px-2 mb-2">
            <div className="relative h-1 bg-muted rounded-full mt-4">
              <div className="absolute left-[15%] right-[25%] h-full bg-primary rounded-full"></div>
              <div className="absolute left-[15%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-primary bg-background shadow-sm cursor-pointer"></div>
              <div className="absolute right-[25%] top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 rounded-full border-2 border-primary bg-background shadow-sm cursor-pointer"></div>
            </div>
          </div>
          <div className="flex justify-between items-center text-xs text-foreground mt-4">
            <span>$0</span>
            <span>$2,500+</span>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-muted rounded-xl p-4 md:p-5">
          <p className="text-sm text-foreground mb-4 leading-relaxed">
            Join our curated newsletter for seasonal drops and artisan spotlights.
          </p>
          <button className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
            Sign up
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
