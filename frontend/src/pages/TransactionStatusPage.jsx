import React from 'react';
import { Link } from 'react-router-dom';

const TransactionStatusPage = ({ success }) => {
    return (
        <div className="font-sans antialiased bg-background text-foreground min-h-screen flex items-center justify-center">
            <div className="container mx-auto max-w-md px-4 py-10 text-center">
                <div className="bg-card rounded-2xl shadow-xl border border-border/50 p-8 sm:p-12">
                    {success ? (
                        <>
                            <div className="w-20 h-20 mx-auto bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-6 border-4 border-emerald-200 dark:border-emerald-800">
                                <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-foreground mb-3 tracking-tight">Payment Successful!</h1>
                            <p className="text-muted-foreground text-base mb-8">
                                Thank you for your purchase. Your order is being processed and you will receive a confirmation email shortly.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link to="/user/orders" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
                                    View My Orders
                                </Link>
                                <Link to="/products" className="bg-muted text-foreground px-8 py-3 rounded-xl font-bold hover:bg-muted/80 transition-all">
                                    Continue Shopping
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mb-6 border-4 border-red-200 dark:border-red-800">
                                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-foreground mb-3 tracking-tight">Transaction Failed</h1>
                            <p className="text-muted-foreground text-base mb-8">
                                Unfortunately, we were unable to process your payment. Please check your payment details and try again.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link to="/cart" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
                                    Return to Cart
                                </Link>
                                <Link to="/" className="bg-muted text-foreground px-8 py-3 rounded-xl font-bold hover:bg-muted/80 transition-all">
                                    Go to Homepage
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionStatusPage;
