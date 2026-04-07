import React from 'react';

const ProductCard = ({ image, title, price, status }) => {
  return (
    <div className="flex flex-col group cursor-pointer">
      <div className="relative aspect-square mb-4 rounded-radius-lg overflow-hidden bg-surface-soft">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
        {status === 'IN STOCK' && (
          <div className="absolute top-3 left-3 px-2 py-0.5 text-[0.6rem] font-bold tracking-wider rounded-radius-sm bg-accent text-accent-foreground">
            IN STOCK
          </div>
        )}
        {status === 'LOW STOCK' && (
          <div className="absolute top-3 left-3 px-2 py-0.5 text-[0.6rem] font-bold tracking-wider rounded-radius-sm bg-secondary text-secondary-foreground">
            LOW STOCK
          </div>
        )}
        {status === 'OUT OF STOCK' && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[2px]">
             <div className="px-3 py-1 text-xs font-bold tracking-wider rounded-radius-sm bg-background text-muted-foreground border border-border shadow-sm">
               SOLD OUT
             </div>
          </div>
        )}
      </div>
      <div>
        {status === 'OUT OF STOCK' && (
           <div className="w-min px-2 py-0.5 mb-2 text-[0.6rem] font-bold tracking-wider rounded-radius-sm bg-muted text-muted-foreground uppercase whitespace-nowrap">
             Out of Stock
           </div>
        )}
        <h3 className="text-sm font-medium text-text-main mb-1">{title}</h3>
        <p className="text-sm text-text-muted">{price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
