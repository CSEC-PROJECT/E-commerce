import React, { useState } from 'react';


// 1. Technical Detail Component
const TechnicalDetail = ({ iconPath, label, value }) => (
  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border transition-colors">
    <div className="shrink-0">
      <img src={iconPath} alt="" className="w-5 h-5 object-contain opacity-80" aria-hidden="true" />
    </div>
    <div>
      <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold">{label}</p>
      <p className="text-sm font-semibold text-text-main">{value}</p>
    </div>
  </div>
);



// 2. Star Rating Component
const StarRating = ({ rating = 5, size = "sm" }) => (
  <div className="flex gap-0.5 text-yellow-400" aria-label={`${rating} out of 5 stars`}>
    {[...Array(5)].map((_, i) => (
      <span key={i} className={size === "lg" ? "text-2xl" : "text-xs"}>
        {i < Math.floor(rating) ? "★" : "☆"}
      </span>
    ))}
  </div>
);


// 3. Product Detail Section
const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  
  const productGallery = [
    "https://images.pexels.com/photos/4207892/pexels-photo-4207892.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/2100063/pexels-photo-2100063.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/6612392/pexels-photo-6612392.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/1570779/pexels-photo-1570779.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/4480535/pexels-photo-4480535.jpeg?auto=compress&cs=tinysrgb&w=400"
  ];

  const [activeImage, setActiveImage] = useState(productGallery[0]);

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-12 font-sans text-text-main">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        

        {/* Gallery Section */}
        <div className="space-y-4">
          <div className="aspect-[4/5] w-full bg-muted rounded-3xl overflow-hidden relative border border-border">
              <img 
                src={activeImage} 
                alt="Lumina Sculptural Object main view" 
                className="w-full h-full object-cover transition-opacity duration-300" 
                onError={(e) => { e.target.src = "https://via.placeholder.com/800x1000?text=Image+Not+Found"; }}
              />
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {productGallery.map((url, i) => (
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
              New Arrival
            </span>
            <span className="text-sm font-medium flex items-center gap-1">★ 4.9 <span className="text-text-muted font-normal">(88 reviews)</span></span>
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
              A masterpiece of industrial poetry. The Lumina Sculptural Object is meticulously crafted from recycled aeronautical-grade aluminum,
              hand-polished to a satin finish that catches ambient light like a still pool of water. 
            </p>
          </section>

          <section className="mb-10">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4 text-text-muted">Technical Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <TechnicalDetail label="Material" value="Brushed Aluminum" iconPath="/Icons/stacks.svg" />
              <TechnicalDetail label="Dimensions" value="12 × 12 × 18 cm" iconPath="/Icons/square_foot.svg" />
              <TechnicalDetail label="Weight" value="1.2 kg" iconPath="/Icons/weight.svg" />
              <TechnicalDetail label="Origin" value="Milan, Italy" iconPath="/Icons/history.svg" />
            </div>
          </section>

          {/* Action Row with QUANTITY Label */}
          <div className="mt-auto space-y-6">
            <div className="flex flex-wrap items-end gap-4">
              
              {/* Quantity Selector with Label */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Quantity</p>
                <div className="flex items-center border border-border rounded-xl overflow-hidden bg-muted h-[56px]">
                  <button 
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="px-5 h-full hover:bg-accent transition-colors text-text-main font-bold"
                    aria-label="Decrease quantity"
                  >-</button>
                  <span className="px-4 font-bold w-12 text-center text-text-main">{quantity}</span>
                  <button 
                    type="button"
                    onClick={() => setQuantity(quantity + 1)} 
                    className="px-5 h-full hover:bg-accent transition-colors text-text-main font-bold"
                    aria-label="Increase quantity"
                  >+</button>
                </div>
              </div>
              
              <button type="button" className="flex-1 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-3 hover:brightness-110 transition-all uppercase tracking-widest text-xs h-[56px]">
                Add to Cart
              </button>
              
              <button type="button" className="p-4 border border-border rounded-xl hover:bg-muted transition-colors text-text-main h-[56px] w-[56px] flex items-center justify-center" aria-label="Add to wishlist">
                ♡
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-border pt-6">
              {[
                { text: 'Free Shipping', icon: '/Icons/local_shipping.svg' },
                { text: '30-Day Returns', icon: '/Icons/assignment_return.svg' },
                { text: 'Secure Checkout', icon: '/Icons/verified.svg' }
              ].map((item, i) => (
                <div key={item.text} className={`flex flex-col items-center gap-2 ${i === 1 ? 'border-x border-border' : ''}`}>
                  <img 
                    src={item.icon} 
                    alt="" 
                    className="w-5 h-5" 
                    style={{ filter: 'brightness(0) saturate(100%) invert(20%) sepia(90%) saturate(3000%) hue-rotate(240deg)' }} 
                  />
                  <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted text-center">{item.text}</p>
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
    <p className="text-text-muted italic leading-relaxed mb-6 text-[15px]">"{content}"</p>
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">
        {author.split(' ').map(n => n[0]).join('')}
      </div>
      <span className="text-sm font-bold text-text-main">{author}</span>
      {verified && <span className="text-primary text-[10px] opacity-80" title="Verified Purchase">✓</span>}
    </div>
  </div>
);

// 5. Reviews Section
const ReviewsSection = () => {
  const tabs = ["Ratings & Reviews (86)", "Delivery & Returns", "Sustainability"];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 font-sans">
      <div className="flex gap-10 border-b border-border mb-12 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
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
        <div className="bg-muted/30 p-8 rounded-[32px] text-center border border-border">
          <h2 className="text-7xl font-black tracking-tighter mb-4 text-text-main">4.9</h2>
          <div className="flex justify-center mb-2">
            <StarRating rating={5} size="lg" />
          </div>
          <p className="text-xs text-text-muted font-medium mb-8">Based on 86 verified reviews</p>
          <button type="button" className="w-full bg-background text-text-main text-[10px] font-black uppercase tracking-[0.2em] py-4 rounded-xl shadow-sm border border-border hover:bg-muted transition-all">
            Write a Review
          </button>
        </div>

        <div>
          <ReviewItem 
            author="James D."
            date="March 12, 2024"
            title="Sublime minimalist aesthetic"
            content="The weight and finish of this object are exceptional. It feels truly premium and has become the centerpiece of my workspace."
            verified={true}
          />
        </div>
      </div>
    </section>
  );
};

// 6. Recommendation Card Component
const RecommendationCard = ({ category, name, price, rating, stockStatus, imageUrl }) => (
  <div className="flex flex-col group cursor-pointer">
    <div className="aspect-square rounded-[32px] overflow-hidden bg-muted mb-6 relative border border-border/50">
      <img 
          src={imageUrl} 
          alt={name} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    </div>
    <div className="px-2">
      <div className="flex justify-between items-start mb-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-primary">{category}</span>
        <span className="text-xl font-bold text-primary">${price.toFixed(2)}</span>
      </div>
      <h3 className="text-lg font-black tracking-tight mb-4 text-text-main group-hover:text-primary transition-colors">{name}</h3>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-[11px] font-bold text-text-main">{rating}</span>
        </div>
        <div className={`flex items-center gap-2 ${stockStatus === "Low Stock" ? 'text-destructive' : 'text-green-500'}`}>
          <div className="w-1.5 h-1.5 rounded-full bg-current" />
          <span className="text-[9px] font-black uppercase tracking-widest">{stockStatus}</span>
        </div>
      </div>
    </div>
  </div>
);

// 7. Recommendations Section
const RecommendationsSection = () => {
  const products = [
    { category: "Furniture", name: "Minimalist Stool", price: 185, rating: 4.9, stockStatus: "In Stock", imageUrl: "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { category: "Lighting", name: "Orbital Desk Lamp", price: 210, rating: 4.8, stockStatus: "Low Stock", imageUrl: "https://images.pexels.com/photos/112811/pexels-photo-112811.jpeg?auto=compress&cs=tinysrgb&w=400" },
    { category: "Decor", name: "Ceramic Vessel", price: 95, rating: 4.7, stockStatus: "In Stock", imageUrl: "https://images.pexels.com/photos/4006714/pexels-photo-4006714.jpeg?auto=compress&cs=tinysrgb&w=400" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 font-sans">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-black tracking-tighter mb-2 text-text-main">Pairs well with</h2>
          <p className="text-text-muted text-sm font-medium">Curated combinations for the discerning eye.</p>
        </div>
        <button type="button" className="text-[11px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2 group hover:opacity-80 transition-opacity">
          Browse More <span className="transition-transform group-hover:translate-x-1">→</span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((p, i) => <RecommendationCard key={i} {...p} />)}
      </div>
    </section>
  );
};

// 8. Final Export Page
const DetailsPage = () => (
  <main className="bg-background min-h-screen text-text-main selection:bg-primary selection:text-primary-foreground">
    <ProductDetail />
    <div className="border-t border-border">
      <ReviewsSection />
    </div>
    <div className="border-t border-border bg-muted/20">
      <RecommendationsSection />
    </div>
  </main>
);

export default DetailsPage;