import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full bg-surface-soft bg-muted pt-16 pb-8 border-t border-border mt-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-16">

                    {/* Left Section: Brand & About */}
                    <div className="md:col-span-4 flex flex-col">
                        <h2 className="text-3xl font-bold text-foreground mb-4">E-Shop</h2>
                        <p className="text-muted-foreground leading-relaxed mb-8 max-w-sm text-[15px]">
                            The Digital Atelier. Where curated aesthetics meet modern functionality in every piece we offer.
                        </p>

                        {/* Action Icons */}
                        <div className="flex items-center gap-4">
                            <button
                                aria-label="Globe"
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-card text-primary shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                            </button>
                            <button
                                aria-label="Share"
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-card text-primary shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Right Sections: Links & Contact */}
                    <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">

                        {/* SHOP */}
                        <div className="flex flex-col">
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">
                                Shop
                            </h3>
                            <ul className="flex flex-col space-y-4">
                                <li><a href="#" className="text-[15px] text-muted-foreground hover:text-foreground hover:underline transition-all decoration-primary underline-offset-4">All Products</a></li>
                                <li><a href="#" className="text-[15px] text-muted-foreground hover:text-foreground hover:underline transition-all decoration-primary underline-offset-4">New Arrivals</a></li>
                                <li><a href="#" className="text-[15px] text-muted-foreground hover:text-foreground hover:underline transition-all decoration-primary underline-offset-4">Featured</a></li>
                                <li><a href="#" className="text-[15px] text-muted-foreground hover:text-foreground hover:underline transition-all decoration-primary underline-offset-4">Sale</a></li>
                            </ul>
                        </div>

                        {/* SUPPORT */}
                        <div className="flex flex-col">
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">
                                Support
                            </h3>
                            <ul className="flex flex-col space-y-4">
                                <li><a href="#" className="text-[15px] text-muted-foreground hover:text-foreground hover:underline transition-all decoration-primary underline-offset-4">Shipping & Returns</a></li>
                                <li><a href="#" className="text-[15px] text-muted-foreground hover:text-foreground hover:underline transition-all decoration-primary underline-offset-4">FAQ</a></li>
                                <li><a href="#" className="text-[15px] text-muted-foreground hover:text-foreground hover:underline transition-all decoration-primary underline-offset-4">Terms of Service</a></li>
                                <li><a href="#" className="text-[15px] text-muted-foreground hover:text-foreground hover:underline transition-all decoration-primary underline-offset-4">Privacy Policy</a></li>
                            </ul>
                        </div>

                        {/* CONTACT */}
                        <div className="flex flex-col">
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">
                                Contact
                            </h3>
                            <ul className="flex flex-col space-y-4">
                                <li>
                                    <a href="mailto:hello@atelier.shop" className="flex items-center gap-3 text-[15px] text-muted-foreground hover:text-foreground transition-colors group">
                                        <svg className="w-[18px] h-[18px] text-primary group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        hello@atelier.shop
                                    </a>
                                </li>
                                <li>
                                    <a href="tel:+15550000000" className="flex items-center gap-3 text-[15px] text-muted-foreground hover:text-foreground transition-colors group">
                                        <svg className="w-[18px] h-[18px] text-primary group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        +1 (555) 000-0000
                                    </a>
                                </li>
                                <li>
                                    <div className="flex items-start gap-3 text-[15px] text-muted-foreground group">
                                        <svg className="w-[18px] h-[18px] text-primary shrink-0 mt-0.5 cursor-default group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        123 Digital Ave, Tech City
                                    </div>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>

                {/* Bottom Border & Copyright */}
                <div className="pt-8 border-t border-border/80 flex flex-col sm:flex-row justify-between items-center gap-6">

                    <p className="text-[13px] text-muted-foreground">
                        © 2024 Digital Atelier. All rights reserved.
                    </p>

                    {/* Payment/Trust Icons Placeholder */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-5 rounded-[4px] bg-muted-foreground/20 flex items-center justify-center shadow-sm">
                            <span className="sr-only">Visa</span>
                            <div className="w-4 h-3 bg-muted-foreground/60 rounded-[1px]"></div>
                        </div>
                        <div className="w-8 h-5 rounded-[4px] bg-muted-foreground/20 flex items-center justify-center shadow-sm">
                            <span className="sr-only">Mastercard</span>
                            <div className="flex space-x-[-5px]">
                                <div className="w-[14px] h-[14px] rounded-full bg-muted-foreground/60 mix-blend-multiply"></div>
                                <div className="w-[14px] h-[14px] rounded-full bg-muted-foreground/60 mix-blend-multiply"></div>
                            </div>
                        </div>
                        <div className="w-8 h-5 rounded-[4px] bg-muted-foreground/20 flex items-center justify-center shadow-sm">
                            <span className="sr-only">Amex</span>
                            <div className="w-4 h-[10px] bg-muted-foreground/60 rounded-[1px]"></div>
                        </div>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
