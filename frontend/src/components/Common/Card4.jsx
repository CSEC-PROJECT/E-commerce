import React from 'react';

const Card4 = ({
    image = "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=60",
    category = "STATIONERY",
    title = "Artisan Notebook",
    price = "$85.00",
    rating = 4.8,
    reviews = 124,
    inStock = true
}) => {
    return (
        <div className="group flex flex-col w-[378px] flex-shrink-0 mx-auto bg-card rounded-[2rem] p-4 shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-1 border border-border/50">

            {/* 2. Image Section (Fixed 346x346 effectively via padding) */}
            <div className="w-[346px] h-[346px] mx-auto bg-muted rounded-2xl overflow-hidden mb-6 relative">
                {/* Placeholder styling uses object-cover but can gracefully degrade to contain if needed */}
                <img
                    src={image}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                />
            </div>

            {/* 3. Content Section */}
            <div className="flex flex-col px-2 mb-1">

                {/* Top Row: Category & Price */}
                <div className="flex justify-between items-start mb-1">
                    {/* Category Label */}
                    <span className="text-[11px] sm:text-xs font-bold text-primary uppercase tracking-[0.15em] mt-2">
                        {category}
                    </span>

                    {/* Price */}
                    <span className="text-[32px] font-black text-primary leading-none">
                        {price}
                    </span>
                </div>

                {/* Product Title */}
                <h3 className="text-[22px] font-bold text-foreground tracking-tight line-clamp-2 leading-tight mb-6">
                    {title}
                </h3>

                {/* 4. Meta Row */}
                <div className="flex items-center justify-between pb-1 mt-auto">

                    {/* Left: Star + Rating */}
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-bold text-foreground">{rating}</span>
                        <span className="text-xs text-muted-foreground ml-1">({reviews})</span>
                    </div>

                    {/* Right: Stock Status */}
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${inStock ? 'bg-primary' : 'bg-muted-foreground'}`}></span>
                        <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
                            {inStock ? 'IN STOCK' : 'OUT OF STOCK'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card4;
