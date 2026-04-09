import React from 'react';

const Card3 = ({
    image = "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&auto=format&fit=crop&q=60",
    title = "Sana Vase",
    price = "$185.00",
    inStock = true
}) => {
    return (
        <div className="group flex flex-col w-full bg-transparent rounded-xl sm:rounded-[1.5rem] transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-1">

            {/* Image Section */}
            <div className="w-full aspect-[4/5] relative overflow-hidden rounded-xl sm:rounded-[1.5rem] shadow-sm group-hover:shadow-md transition-shadow">
                <img
                    src={image}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                />
            </div>

            {/* Content Section */}
            <div className="flex flex-col pt-3 sm:pt-4 md:pt-6 px-0.5 sm:px-1">
                {/* Stock Status */}
                {inStock ? (
                    <span className="w-fit px-2 sm:px-2.5 py-0.5 mb-1 text-[10px] sm:text-[11px] font-bold text-green-950 bg-green-400 rounded-full uppercase tracking-wide">
                        In Stock
                    </span>
                ) : (
                    <span className="w-fit px-2 sm:px-2.5 py-0.5 mb-1 text-[10px] sm:text-[11px] font-bold text-red-950 bg-red-400 rounded-full uppercase tracking-wide">
                        Out of Stock
                    </span>
                )}

                {/* Title */}
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-foreground truncate mt-1">
                    {title}
                </h3>

                {/* Price */}
                <p className="text-sm sm:text-base font-medium text-muted-foreground mt-0.5">
                    {price}
                </p>
            </div>
        </div>
    );
};

export default Card3;
