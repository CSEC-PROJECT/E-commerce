import React from 'react';

const Card2 = ({
    image = "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=60",
    category = "OUTERWEAR",
    title = "Classic Winter Parka",
    price = "$180.00",
    rating = 4.8,
    reviews = 124,
    inStock = true
}) => {
    return (
        <div className="group flex flex-col w-full bg-card rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-sm hover:shadow-md hover:border-border border border-transparent transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-1">

            {/* Image Section */}
            <div className="w-full aspect-[4/5] bg-muted rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-4 relative">
                <img
                    src={image}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                />
            </div>

            {/* Content Section */}
            <div className="flex flex-col px-0.5 sm:px-1 mb-3 sm:mb-4">
                {/* Category & Price Row */}
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-primary uppercase tracking-wide mt-1">
                        {category}
                    </span>
                    <span className="text-lg sm:text-xl md:text-[28px] font-extrabold text-primary leading-none">
                        {price}
                    </span>
                </div>

                {/* Product Title */}
                <h3 className="text-sm sm:text-base font-semibold text-foreground tracking-tight line-clamp-2 leading-snug">
                    {title}
                </h3>
            </div>

            {/* Meta Row */}
            <div className="flex items-center justify-between px-0.5 sm:px-1 mb-3 sm:mb-5 mt-auto">
                <div className="flex items-center gap-1 sm:gap-1.5">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs sm:text-sm font-medium text-foreground">{rating}</span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground">({reviews})</span>
                </div>

                <div className="flex items-center gap-1 sm:gap-1.5">
                    <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${inStock ? 'bg-primary' : 'bg-muted-foreground'}`}></span>
                    <span className="text-[10px] sm:text-xs font-medium text-muted-foreground hidden sm:inline">
                        {inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                </div>
            </div>

            {/* Add to Cart Button */}
            <button
                className="w-full h-11 sm:h-[52px] bg-primary text-white rounded-lg sm:rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log("Added to cart");
                }}
                aria-label="Add to Cart"
            >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-sm sm:text-base font-semibold tracking-wide">Add to Cart</span>
            </button>
        </div>
    );
};

export default Card2;
