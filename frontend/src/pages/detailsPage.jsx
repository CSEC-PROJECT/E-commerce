import React, { useState } from 'react';

// 1. Technical Detail Component
const TechnicalDetail = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border transition-colors">
    <div className="text-primary shrink-0">{icon}</div>
    <div>
      <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold">{label}</p>
      <p className="text-sm font-semibold text-text-main">{value}</p>
    </div>
  </div>
);

// 2. Star Rating Component
const StarRating = ({ rating = 5, size = "sm" }) => (
  <div className="flex gap-0.5 text-yellow-400">
    {[...Array(5)].map((_, i) => (
      <span key={i} className={size === "lg" ? "text-2xl" : "text-xs"}>
        {i < rating ? "★" : "☆"}
      </span>
    ))}
  </div>
);

// 3. Product Detail Section
const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-12 font-sans text-text-main">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/5] w-full bg-muted rounded-3xl overflow-hidden relative border border-border">
             <div className="absolute inset-0 flex items-center justify-center text-text-muted/40 text-xs italic">
               Main Display
             </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`aspect-square rounded-xl bg-muted border-2 transition-all cursor-pointer ${i === 1 ? 'border-primary' : 'border-transparent hover:border-border'}`} />
            ))}
          </div>
        </div>

        {/* Right Column: Product Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
              New Arrival
            </span>
            <span className="text-sm font-medium">★ 4.9 <span className="text-text-muted font-normal">(88 reviews)</span></span>
          </div>

          <h1 className="text-5xl font-black tracking-tight mb-6 leading-[0.95] text-text-main">
            Lumina Sculptural<br />Object
          </h1>

          <div className="flex items-center gap-4 mb-8">
            <span className="text-4xl font-bold text-primary">$240.00</span>
            <span className="text-xl text-text-muted line-through font-medium">$310.00</span>
            <span className="ml-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-green-600 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              In Stock
            </span>
          </div>

          <section className="mb-10">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4 text-text-muted">The Narrative</h3>
            <p className="text-text-muted leading-relaxed text-base italic">
              A masterpiece of industrial poetry meticulously crafted from recycled 
              aeronautical-grade aluminum.
            </p>
          </section>

          <section className="mb-10">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4 text-text-muted">Technical Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <TechnicalDetail label="Material" value="Brushed Aluminum" icon="◈" />
              <TechnicalDetail label="Dimensions" value="12 × 12 × 18 cm" icon="📐" />
              <TechnicalDetail label="Weight" value="1.2 kg" icon="👜" />
              <TechnicalDetail label="Origin" value="Milan, Italy" icon="🌍" />
            </div>
          </section>

          {/* Action Row */}
          <div className="mt-auto space-y-6">
            <div className="flex gap-4">
              <div className="flex items-center border border-border rounded-xl overflow-hidden bg-muted">
                <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="px-5 py-4 hover:bg-accent transition-colors">-</button>
                <span className="px-4 font-bold w-12 text-center text-text-main">{quantity}</span>
                <button onClick={() => setQuantity(q => q+1)} className="px-5 py-4 hover:bg-accent transition-colors">+</button>
              </div>
              
              <button className="flex-1 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-3 hover:brightness-110 transition-all uppercase tracking-widest text-xs">
                Add to Cart
              </button>
              
              <button className="p-4 border border-border rounded-xl hover:bg-muted transition-colors text-text-main">
                ♡
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-border pt-6">
              {['Free Shipping', '30-Day Returns', 'Secure Checkout'].map((text, i) => (
                <div key={text} className={`text-center ${i === 1 ? 'border-x border-border' : ''}`}>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// 4. Review Item Component
const ReviewItem = ({ author, date, title, content, verified }) => (
  <div className="py-8 border-b border-border last:border-0 transition-opacity">
    <div className="flex justify-between items-start mb-2">
      <StarRating rating={5} />
      <span className="text-[11px] text-text-muted font-medium uppercase tracking-wider">{date}</span>
    </div>
    <h4 className="text-lg font-black tracking-tight mb-3 text-text-main">{title}</h4>
    <p className="text-text-muted italic leading-relaxed mb-6 text-[15px]">
      "{content}"
    </p>
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">
        {author.split(' ').map(n => n[0]).join('')}
      </div>
      <span className="text-sm font-bold text-text-main">{author}</span>
      {verified && <span className="text-primary text-[10px] opacity-80">✓</span>}
    </div>
  </div>
);

// 5. Reviews Section
const ReviewsSection = () => {
  const tabs = ["Ratings & Reviews (86)", "Delivery & Returns", "Sustainability"];
  const activeTab = tabs[0];

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 font-sans">
      <div className="flex gap-10 border-b border-border mb-12 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`pb-4 text-[11px] font-black uppercase tracking-[0.15em] transition-all relative whitespace-nowrap ${
              tab === activeTab ? 'text-text-main' : 'text-text-muted hover:text-text-main'
            }`}
          >
            {tab}
            {tab === activeTab && (
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-16 items-start">
        <div className="bg-surface-soft p-8 rounded-[32px] text-center border border-border">
          <h2 className="text-7xl font-black tracking-tighter mb-4 text-text-main">4.9</h2>
          <div className="flex justify-center mb-2">
            <StarRating rating={5} size="lg" />
          </div>
          <p className="text-xs text-text-muted font-medium mb-8">Based on 86 verified reviews</p>
          <button className="w-full bg-background text-text-main text-[10px] font-black uppercase tracking-[0.2em] py-4 rounded-xl shadow-sm border border-border hover:bg-muted transition-all">
            Write a Review
          </button>
        </div>

        <div>
          <ReviewItem 
            author="James D."
            date="March 12, 2024"
            title="Sublime minimalist aesthetic"
            content="The weight and finish of this object are exceptional."
            verified={true}
          />
        </div>
      </div>
    </section>
  );
};

// 6. Recommendation Card Component
const RecommendationCard = ({ category, name, price, rating, stockStatus, imagePlaceholder }) => {
  const isLowStock = stockStatus === "Low Stock";

  return (
    <div className="flex flex-col group cursor-pointer">
      <div className="aspect-square rounded-[32px] overflow-hidden bg-muted mb-6 relative border border-border/50">
        <div className="absolute inset-0 flex items-center justify-center text-text-muted/30 text-xs italic transition-transform duration-500 group-hover:scale-110">
          {imagePlaceholder}
        </div>
      </div>

      <div className="px-2">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">
            {category}
          </span>
          <span className="text-xl font-bold text-primary">${price.toFixed(2)}</span>
        </div>

        <h3 className="text-lg font-black tracking-tight mb-4 text-text-main group-hover:text-primary transition-colors">{name}</h3>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400 text-xs">★</span>
            <span className="text-[11px] font-bold text-text-main">{rating}</span>
          </div>
          
          <div className={`flex items-center gap-2 ${isLowStock ? 'text-destructive' : 'text-green-500'}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-current" />
            <span className="text-[9px] font-black uppercase tracking-widest">
              {stockStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 7. Recommendations Section
const RecommendationsSection = () => {
  const products = [
    { category: "Stationery", name: "Artisan Notebook", price: 85, rating: 4.8, stockStatus: "In Stock" },
    { category: "Photography", name: "Instant Classic", price: 120, rating: 4.9, stockStatus: "Low Stock" },
    { category: "Audio", name: "Studio Audio", price: 350, rating: 4.7, stockStatus: "In Stock" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 font-sans">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-black tracking-tighter mb-2 text-text-main">Pairs well with</h2>
          <p className="text-text-muted text-sm font-medium">Curated combinations for the discerning eye.</p>
        </div>
        <button className="text-[11px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2 group hover:opacity-80 transition-opacity">
          Browse More 
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <RecommendationCard key={index} {...product} imagePlaceholder={`${product.name}`} />
        ))}
      </div>
    </section>
  );
};

// 8. Final Export Page
const DetailsPage = () => {
  return (
    <main className="bg-background min-h-screen text-text-main">
      <ProductDetail />
      <div className="border-t border-border">
        <ReviewsSection />
      </div>
      <div className="border-t border-border bg-muted/20">
        <RecommendationsSection />
      </div>
    </main>
  );
}

export default DetailsPage;