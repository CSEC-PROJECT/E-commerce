import React from 'react';

const Card3 = ({
    image = "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&auto=format&fit=crop&q=60",
    title = "Sana Vase",
    price = "$185.00",
    inStock = true
}) => {
    return (
        <div className="group flex flex-col w-[208px] flex-shrink-0 bg-transparent rounded-[1.5rem] transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-1">

            {/* Image Section */}
            <div className="w-[208px] h-[260px] relative overflow-hidden rounded-[1.5rem] shadow-sm group-hover:shadow-md transition-shadow">
                <img
                    src={image}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                />
            </div>

            {/* Content Section */}
            <div className="flex flex-col pt-6 px-1 min-h-[79px]">

                {/* Stock Status */}
                {inStock ? (
                    <span className="w-fit px-2.5 py-0.5 mb-1 text-[11px] font-bold text-green-950 bg-green-400 rounded-full uppercase tracking-wide">
                        In Stock
                    </span>
                ) : (
                    <span className="w-fit px-2.5 py-0.5 mb-1 text-[11px] font-bold text-red-950 bg-red-400 rounded-full uppercase tracking-wide">
                        Out of Stock
                    </span>
                )}

                {/* Title */}
                <h3 className="text-xl font-semibold text-foreground truncate mt-1">
                    {title}
                </h3>

                {/* Price */}
                <p className="text-base font-medium text-muted-foreground mt-0.5">
                    {price}
                </p>

            </div>
        </div>
    );
};

export default Card3;
