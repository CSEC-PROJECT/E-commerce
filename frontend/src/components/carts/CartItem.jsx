import React from 'react';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
    return (
        <div className="flex flex-col sm:flex-row items-center gap-6 bg-card rounded-2xl p-4 sm:p-6 shadow-sm border border-border/50 hover:shadow-md transition-shadow">
            {/* Product Image */}
            <div className="w-full sm:w-32 aspect-square rounded-xl bg-[#f0f4f8] dark:bg-muted p-2 flex-shrink-0 relative overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
            </div>

            {/* Product Info */}
            <div className="flex-1 w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{item.category}</span>
                    <h3 className="text-lg font-bold text-foreground leading-tight mb-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.details}</p>
                </div>

                {/* Actions & Price */}
                <div className="flex items-center gap-6 sm:gap-10 w-full sm:w-auto justify-between sm:justify-end">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-4 bg-muted/30 border border-border rounded-lg px-3 py-1">
                        <button 
                            className="text-foreground hover:text-primary transition-colors focus:outline-none disabled:opacity-50" 
                            aria-label="Decrease quantity"
                            onClick={(e) => {
                                e.preventDefault();
                                onUpdateQuantity(item.id, item.quantity - 1);
                            }}
                            disabled={item.quantity <= 1}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"/></svg>
                        </button>
                        <span className="font-semibold w-4 text-center text-sm">{item.quantity}</span>
                        <button 
                            className="text-foreground hover:text-primary transition-colors focus:outline-none" 
                            aria-label="Increase quantity"
                            onClick={(e) => {
                                e.preventDefault();
                                onUpdateQuantity(item.id, item.quantity + 1);
                            }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                        </button>
                    </div>

                    {/* Price */}
                    <div className="flex flex-col items-end min-w-[80px]">
                        <span className="text-lg font-bold text-foreground">ETB {(item.unitPrice * item.quantity).toFixed(2)}</span>
                        {item.quantity > 1 && (
                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">ETB {item.unitPrice.toFixed(2)} / UNIT</span>
                        )}
                    </div>

                    {/* Remove Button */}
                    <button 
                        className="text-muted-foreground hover:text-destructive transition-colors focus:outline-none" 
                        aria-label="Remove item"
                        onClick={(e) => {
                            e.preventDefault();
                            onRemove(item.id);
                        }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
