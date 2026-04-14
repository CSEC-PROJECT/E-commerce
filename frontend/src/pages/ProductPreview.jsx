import React, { useState } from 'react';
import Card2 from '../components/Common/Card2';

// 1. Reusable Technical Detail Component from ProductDetail
const TechnicalDetail = ({ iconPath, label, value }) => (
    <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border transition-colors">
        <div className="shrink-0">
            <img src={iconPath} alt="icon image" className="w-5 h-5 object-contain opacity-80" aria-hidden="true" />
        </div>
        <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{label}</p>
            <p className="text-sm font-semibold text-foreground">{value}</p>
        </div>
    </div>
);

const ProductPreviewModal = ({
    isOpen = true,
    onClose = () => { },
    onPublish = () => { },
    formData = {}
}) => {
    const [activeTab, setActiveTab] = useState('detail'); // 'detail' | 'card'
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(formData.images?.[0] || "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800");

    if (!isOpen) return null;

    const images = formData.images && formData.images.length > 0 ? formData.images : [
        "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800",
        "https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=400",
        "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400"
    ];

    // Render detail view layout
    const renderDetailPreview = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-foreground font-sans">
            {/* Gallery Section */}
            <div className="space-y-4">
                <div className="aspect-[4/5] w-full bg-muted rounded-3xl overflow-hidden relative border border-border">
                    <img
                        src={activeImage}
                        alt="Product preview main view"
                        className="w-full h-full object-cover transition-opacity duration-300"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/800x1000?text=Image+Not+Found"; }}
                    />
                </div>

                <div className="grid grid-cols-5 gap-2">
                    {images.map((url, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setActiveImage(url)}
                            className={`aspect-square rounded-xl bg-muted border-2 overflow-hidden transition-all ${activeImage === url ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-border'}`}
                        >
                            <img
                                src={url}
                                className={`w-full h-full object-cover transition-opacity ${activeImage === url ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                                alt={`View ${i + 1}`}
                                onError={(e) => { e.target.src = "https://via.placeholder.com/400?text=Broken"; }}
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Info Section */}
            <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                        {formData.category || "Electronics"}
                    </span>
                    <div className="text-sm font-medium flex items-center gap-1.5">
                        <div className="flex gap-0.5 text-muted-foreground/30 text-xs">
                            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                        </div>
                        <span className="text-foreground">0.0</span>
                        <span className="text-muted-foreground font-normal">(0 reviews)</span>
                    </div>
                </div>

                <h1 className="text-5xl font-black tracking-tight mb-6 leading-[0.95] text-foreground">
                    {formData.name || "Lumina Sculptural Object"}
                </h1>

                <div className="flex items-center gap-4 mb-8">
                    <span className="text-4xl font-bold text-primary">${formData.price || "240.00"}</span>
                    {formData.comparePrice && (
                        <span className="text-xl text-muted-foreground line-through font-medium">${formData.comparePrice}</span>
                    )}
                    <span className="ml-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-green-600 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        {formData.stockStatus || "In Stock"} ({formData.stock || 100})
                    </span>
                </div>

                <section className="mb-10">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4 text-muted-foreground">The Narrative</h3>
                    <p className="text-muted-foreground leading-relaxed text-base italic">
                        {formData.description || "A masterpiece of industrial poetry. The Lumina Sculptural Object is meticulously crafted from recycled aeronautical-grade aluminum, hand-polished to a satin finish."}
                    </p>
                </section>

                <section className="mb-10">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4 text-muted-foreground">Technical Details</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <TechnicalDetail label="Material" value={formData.material || "Brushed Aluminum"} iconPath="/Icons/stacks.svg" />
                        <TechnicalDetail label="Dimensions" value={formData.dimensions || "12 × 12 × 18 cm"} iconPath="/Icons/square_foot.svg" />
                        <TechnicalDetail label="Weight" value={formData.weight || "1.2 kg"} iconPath="/Icons/weight.svg" />
                        <TechnicalDetail label="Origin" value={formData.origin || "Milan, Italy"} iconPath="/Icons/history.svg" />
                    </div>
                </section>

                {/* Action Row */}
                <div className="mt-auto space-y-6">
                    <div className="flex flex-col gap-4">
                        {/* Top Row */}
                        <div className="flex items-end gap-3 w-full">

                            {/* Quantity */}
                            <div className="space-y-3 flex-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    Quantity
                                </p>

                                <div className="flex items-center justify-between border border-border rounded-xl overflow-hidden bg-muted w-full h-[56px]">
                                    <button
                                        type="button"
                                        className="px-5 h-full flex items-center justify-center text-foreground font-bold hover:bg-surface-soft transition-colors"
                                    >
                                        −
                                    </button>

                                    <span className="font-bold flex-1 text-center text-foreground">
                                        {quantity}
                                    </span>

                                    <button
                                        type="button"
                                        className="px-5 h-full flex items-center justify-center text-foreground font-bold hover:bg-surface-soft transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Wishlist Button */}
                            <button type="button" className="p-4 border border-border rounded-xl hover:bg-muted transition-colors text-foreground h-[56px] w-[56px] shrink-0 flex items-center justify-center" aria-label="Add to wishlist">
                                ♡
                            </button>
                        </div>

                        {/* Add to Cart */}
                        <button
                            type="button"
                            className="w-full h-[56px] bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:brightness-110 transition-all uppercase tracking-widest text-xs"
                        >
                            🛍️ Add to Cart
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-t border-border pt-6 mt-6">
                        {[
                            { text: '30-Day Returns', icon: '/Icons/assignment_return.svg' },
                            { text: 'Secure Checkout', icon: '/Icons/verified.svg' }
                        ].map((item, i) => (
                            <div key={item.text} className={`flex flex-col items-center gap-2 ${i === 0 ? 'border-r border-border px-2' : 'px-2'}`}>
                                <img
                                    src={item.icon}
                                    alt="item icon"
                                    className="w-5 h-5 opacity-80"
                                    style={{ filter: 'brightness(0) saturate(100%) invert(20%) sepia(90%) saturate(3000%) hue-rotate(240deg)' }}
                                />
                                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground text-center">
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCardPreview = () => (
        <div className="flex items-center justify-center py-20 pointer-events-none">
            <div className="w-[300px]">
                <Card2
                    image={images[0]}
                    category={formData.category || "Electronics"}
                    title={formData.name || "Lumina Sculptural Object"}
                    price={"$" + (Number(formData.price) || 240).toFixed(2)}
                    rating={0.0}
                    reviews={0}
                    inStock={true}
                />
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-12">
            {/* Dimmed Overlay */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative bg-background border border-border w-full max-w-7xl h-full max-h-[90vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col font-sans">

                {/* Header Bar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 bg-primary text-primary-foreground font-black tracking-widest uppercase text-[10px] px-3 py-1.5 rounded-full border border-primary">
                            <span className="w-1.5 h-1.5 bg-primary-foreground rounded-full animate-pulse" />
                            Live Preview
                        </span>
                    </div>

                    <div className="flex items-center gap-1 bg-muted/60 p-1.5 rounded-xl border border-border/50">
                        <button
                            type="button"
                            onClick={() => setActiveTab('detail')}
                            className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'detail' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-background/50'}`}
                        >
                            Detail Page View
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('card')}
                            className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'card' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-background/50'}`}
                        >
                            Card View
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-xs font-bold tracking-widest uppercase rounded-xl text-muted-foreground hover:bg-muted transition-colors hover:text-foreground border border-transparent"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                onPublish();
                                onClose();
                            }}
                            className="px-6 py-2.5 text-xs font-bold tracking-widest uppercase rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm"
                        >
                            Publish
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-12 no-scrollbar bg-background rounded-b-[2rem]">
                    {activeTab === 'detail' ? renderDetailPreview() : renderCardPreview()}
                </div>

            </div>
        </div>
    );
};

export default ProductPreviewModal;
