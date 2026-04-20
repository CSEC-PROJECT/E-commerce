import React, { useState } from 'react';
import { Star, ArrowRight } from 'lucide-react';

const MyProducts = () => {
    const [activeTab, setActiveTab] = useState('All Products');

    const tabs = ['All Products', 'Delivered', 'Processing', 'Cancelled'];

    const products = [
        {
            id: 1,
            category: 'AUDIO & ELECTRONICS',
            name: 'Acoustic Pro-Elite Wireless',
            description: 'High-fidelity sound with adaptive noise cancellation and 40-hour battery life.',
            orderId: '#AT-984421',
            purchaseDate: 'Oct 12, 2023',
            rating: 4.5,
            price: 299.00,
            qty: 1,
            status: 'DELIVERED',
        },
        {
            id: 2,
            category: 'WEARABLES',
            name: 'Series 8 Smart Chronograph',
            description: 'Next-generation health tracking with a stunning OLED edge-to-edge display.',
            orderId: '#AT-981105',
            purchaseDate: 'Sep 28, 2023',
            rating: 4.5,
            price: 449.00,
            qty: 1,
            status: 'DELIVERED',
        },
        {
            id: 3,
            category: 'ACCESSORIES',
            name: 'Hand-Stitched Leather Sleeve',
            description: 'Premium full-grain Italian leather with soft microfiber interior lining.',
            orderId: '#AT-989230',
            purchaseDate: 'Oct 18, 2023',
            rating: 4.5,
            price: 85.00,
            qty: 1,
            status: 'PROCESSING',
            estimatedArrival: 'Oct 22'
        }
    ];

    const getStatusStyles = (status) => {
        switch (status) {
            case 'DELIVERED':
                return 'bg-secondary text-secondary-foreground';
            case 'PROCESSING':
                return 'bg-warning text-warning-foreground';
            case 'CANCELLED':
                return 'bg-destructive text-destructive-foreground';
            default:
                return 'bg-muted text-muted-foreground';
        }
    };

    return (
        <div className="min-h-screen bg-background py-16 px-6 md:px-12 lg:px-24">
            <div className="max-w-5xl mx-auto space-y-10">
                {/* Header */}
                <header className="space-y-1">
                    <h1 className="text-4xl font-extrabold text-text-main">My Products</h1>
                    <p className="text-text-muted text-lg">Review and manage your purchased items</p>
                </header>

                {/* Tabs */}
                <nav className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                                activeTab === tab
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-text-muted hover:text-text-main'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>

                {/* Product List */}
                <div className="space-y-8">
                    {products.map((product) => (
                        <div 
                            key={product.id} 
                            className="bg-card rounded-3xl p-8 flex flex-col md:flex-row gap-10 shadow-sm border border-border"
                        >
                            {/* Product Image Placeholder */}
                            <div className="w-full md:w-52 h-52 bg-surface-soft rounded-2xl flex items-center justify-center flex-shrink-0">
                                <div className="w-32 h-32 bg-muted rounded-xl" />
                            </div>
[4/21/2026 1:28 AM] Milke S: {/* Product Info */}
                            <div className="flex-grow flex flex-col justify-between">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-bold tracking-widest text-text-muted uppercase">
                                        {product.category}
                                    </span>
                                    <h2 className="text-2xl font-bold text-text-main">
                                        {product.name}
                                    </h2>
                                    <p className="text-text-muted text-sm leading-relaxed">
                                        {product.description}
                                    </p>
                                    <div className="flex flex-wrap gap-4 text-[10px] text-text-muted font-bold pt-1">
                                        <span>Order Id: {product.orderId}</span>
                                        <span>Purchased: {product.purchaseDate}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 mt-6">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                size={14} 
                                                className="fill-warning text-warning" 
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs font-bold text-text-main">{product.rating}</span>
                                </div>
                            </div>


                            {/* Actions & Price */}
                            <div className="flex flex-col md:items-end justify-between min-w-[180px]">
                                <div className="text-right space-y-1">
                                    <div className="text-3xl font-extrabold text-text-main">
                                        ${product.price.toFixed(2)}
                                    </div>
                                    <div className="text-[10px] text-text-muted font-bold uppercase">
                                        Qty: {product.qty}
                                    </div>
                                    <div className={`mt-3 inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase ${getStatusStyles(product.status)}`}>
                                        <span className="w-1 h-1 rounded-full bg-current mr-2"></span>
                                        {product.status}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 mt-8 w-full md:w-auto">
                                    <button className={`w-full md:w-44 py-3.5 rounded-2xl text-xs font-black transition-all ${
                                        product.status === 'PROCESSING' 
                                        ? 'bg-muted text-text-muted cursor-not-allowed' 
                                        : 'bg-primary text-primary-foreground hover:shadow-xl'
                                    }`}>
                                        Write Review
                                    </button>
[4/21/2026 1:28 AM] Milke S: <div className="flex flex-col gap-2 md:items-end text-right px-1">
                                        <button className="text-[11px] font-black text-primary hover:underline">
                                            Buy Again
                                        </button>
                                        <button className="text-[10px] font-bold text-text-muted hover:text-text-main">
                                            View Details
                                        </button>
                                        {product.estimatedArrival && (
                                            <div className="mt-2 text-[10px] text-text-muted leading-tight font-medium italic">
                                                Estimated arrival: {product.estimatedArrival}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


export default MyProducts;
