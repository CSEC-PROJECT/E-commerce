import React from 'react';

const Card1 = ({ 
    image = "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&auto=format&fit=crop&q=60", 
    title = "Artisan Leather Tote", 
    price = "$420.00" 
}) => {
    return (
        <div className="group flex flex-col w-[290px] flex-shrink-0 mx-auto bg-card rounded-3xl p-4 shadow-sm hover:shadow-md hover:border-border border border-transparent transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-1">
            {/* Top Section: Image Container */}
            <div className="max-w-full w-[256px] h-[256px] mx-auto bg-muted rounded-2xl overflow-hidden mb-4 flex items-center justify-center">
                {/* Fallback image is purely for presentation structure since no image prop is passed initially */}
                <img 
                    src={image} 
                    alt={title} 
                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out" 
                    loading="lazy"
                />
            </div>

            {/* Bottom Section: Details */}
            <div className="flex flex-col space-y-2 px-1">
                <h3 className="text-base font-semibold text-foreground tracking-tight line-clamp-1">
                    {title}
                </h3>
                <p className="text-sm text-muted-foreground">
                    {price}
                </p>
            </div>
        </div>
    );
};

export default Card1;
