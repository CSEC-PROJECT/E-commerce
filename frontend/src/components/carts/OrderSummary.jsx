import React from 'react';

const OrderSummary = ({ subtotal, tax, total }) => {
    return (
        <div className="bg-card rounded-2xl shadow-sm border border-border/50 p-6 sm:p-8 sticky top-24">
            <h2 className="text-2xl font-bold text-foreground mb-6">Order Summary</h2>

            <div className="flex flex-col gap-4 text-sm mb-6 pb-6 border-b border-border/60">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Subtotal</span>
                    <span className="font-bold text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Shipping</span>
                    <span className="font-bold text-emerald-500">Free</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Estimated Tax</span>
                    <span className="font-bold text-foreground">${tax.toFixed(2)}</span>
                </div>
            </div>

            {/* Promo Code */}
            <div className="mb-6">
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Promo Code</label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        placeholder="Enter code" 
                        className="flex-1 bg-muted/50 border border-transparent focus:border-primary focus:bg-background rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none transition-colors"
                    />
                    <button className="bg-foreground text-background hover:bg-foreground/90 px-6 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm">
                        Apply
                    </button>
                </div>
            </div>

            {/* Total Container */}
            <div className="flex justify-between items-end mb-8 pt-4">
                <span className="text-lg font-bold text-foreground">Total</span>
                <div className="flex flex-col items-end">
                    <span className="text-3xl font-extrabold text-primary leading-none">${total.toFixed(2)}</span>
                    <span className="text-[9px] uppercase tracking-wider font-semibold text-muted-foreground mt-1">USD INCLUDES VAT</span>
                </div>
            </div>

            {/* Checkout Button */}
            <button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-4 flex items-center justify-center gap-2 font-bold text-lg shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card mb-8">
                Checkout
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </button>

            {/* Trust Badges */}
            <div className="flex flex-col gap-3 text-xs text-muted-foreground font-medium mb-6">
                <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    Arrives in 3-5 business days
                </div>
                <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
                    Free 30-day returns
                </div>
                <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                    Secure checkout powered by Stripe
                </div>
            </div>

            {/* Payment Icons */}
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-border/50">
                <div className="w-10 h-6 bg-muted rounded flex items-center justify-center">
                    <span className="text-[10px] font-bold text-muted-foreground">VISA</span>
                </div>
                <div className="w-10 h-6 bg-muted rounded flex items-center justify-center">
                    <span className="text-[10px] font-bold text-muted-foreground">MC</span>
                </div>
                <div className="w-10 h-6 bg-[#63b3ed]/20 rounded flex items-center justify-center">
                    <span className="text-[10px] font-bold text-[#3182ce]">AMEX</span>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
