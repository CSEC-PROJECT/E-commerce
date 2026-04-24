import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { apiRequest } from '../lib/apiClient';
import ProductCard from '../components/ProductCard';
import useCartStore from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
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
const ProductDetail = ({ onCategoryLoad }) => {
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const addToCart = useCartStore(state => state.addToCart);
  const user = useAuthStore(state => state.user);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await apiRequest(`/api/products/${id}`);
        setProduct(data.product);
        if (onCategoryLoad && data.product.category) {
          onCategoryLoad(data.product.category);
        }
        setActiveImage(data.product.coverImage || "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800");
      } catch (err) {
        console.error(err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
      if (!user) {
          navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
          return;
      }
      if (!product) return;
      try {
          await addToCart({
              product: product._id,
              quantity: quantity,
              price: product.price
          });
          toast.success("Added to cart successfully");
          
      } catch (error) {
          toast.error("Failed to add to cart");
      }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto p-12 text-center py-20 text-muted-foreground animate-pulse">Loading Premium Details...</div>;
  }

  if (error || !product) {
    return <div className="max-w-7xl mx-auto p-12 text-center py-20 text-destructive">{error || "Product not found."}</div>;
  }

  const productRating = Number(product.averageRating ?? 0);
  const productReviewCount = Number(product.reviewCount ?? 0);

  const productGallery = [
    product.coverImage,
    ...(product.detailImages || [])
  ].filter(Boolean);



  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-12 font-sans text-foreground">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">


        {/* Gallery Section */}
        <div className="space-y-4">
          <div className="aspect-[4/5] w-full bg-muted rounded-3xl overflow-hidden relative border border-border">
            <img
              src={activeImage}
              alt={product.name}
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
              {product.category || "New Arrival"}
            </span>
            <span className="text-sm font-medium flex items-center gap-1">★ {productRating.toFixed(1)} <span className="text-muted-foreground font-normal">({productReviewCount} reviews)</span></span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-6 leading-[0.95] text-foreground uppercase">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-bold text-primary">ETB {product.price?.toFixed(2)}</span>
            <span className="text-lg text-muted-foreground line-through font-medium">ETB {(product.price * 1.25).toFixed(2)}</span>
            {product.stock > 0 ? (
                product.status?.toLowerCase() === 'new' ? (
                  <span className="ml-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    {product.status}
                  </span>
                ) : product.status?.toLowerCase() === 'slightly used' ? (
                  <span className="ml-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-700 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    {product.status}
                  </span>
                ) : product.status?.toLowerCase() === 'used' ? (
                  <span className="ml-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    {product.status}
                  </span>
                ) : (
                  <span className="ml-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-700 bg-muted px-3 py-1 rounded-full border border-gray-200">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" />
                    {product.status || 'Available'}
                  </span>
                )
            ) : (
                <span className="ml-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-destructive bg-destructive/10 px-3 py-1 rounded-full border border-destructive/20">
                  Out of Stock
                </span>
            )}
          </div>

          <section className="mb-10">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4 text-muted-foreground">The Narrative</h3>
            <p className="text-muted-foreground leading-relaxed text-base italic">
              {product.description || "A masterpiece of modern design and craftsmanship, crafted strictly from high-grade materials to deliver an exceptional experience tailored for the discerning eye."}
            </p>
          </section>

          <section className="mb-10">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4 text-muted-foreground">Technical Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <TechnicalDetail label="Material" value={product.material || "Premium Hand-Finished"} iconPath="/Icons/stacks.svg" />
              <TechnicalDetail label="Type" value={product.category || "General"} iconPath="/Icons/square_foot.svg" />
              <TechnicalDetail label="Stock Status" value={product.stock > 0 ? "Available" : "Sold Out"} iconPath="/Icons/weight.svg" />
              <TechnicalDetail label="Origin" value={product.madeIn || "Global Sourced"} iconPath="/Icons/history.svg" />
            </div>
          </section>

          <div className="mt-auto space-y-6">
            <div className="flex flex-wrap items-end gap-4">

              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Quantity</p>
                <div className="flex items-center border border-border rounded-xl overflow-hidden bg-muted h-[56px]">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-5 h-full hover:bg-accent transition-colors text-foreground font-bold"
                    aria-label="Decrease quantity"
                  >-</button>
                  <span className="px-4 font-bold w-12 text-center text-foreground">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-5 h-full hover:bg-accent transition-colors text-foreground font-bold"
                    aria-label="Increase quantity"
                  >+</button>
                </div>
              </div>

              <button type="button" onClick={handleAddToCart} disabled={product.stock < 1} className="flex-1 bg-primary text-primary-foreground font-bold rounded-xl flex items-center justify-center gap-3 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-widest text-xs h-[56px]">
                {product.stock < 1 ? "Out of Stock" : "Add to Cart"}
              </button>

              <button type="button" className="p-4 border border-border rounded-xl hover:bg-muted transition-colors text-foreground h-[56px] w-[56px] flex items-center justify-center" aria-label="Add to wishlist">
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

                    alt="item icon"
                    className="w-5 h-5"
                    style={{ filter: 'brightness(0) saturate(100%) invert(20%) sepia(90%) saturate(3000%) hue-rotate(240deg)' }}
                  />
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground text-center">{item.text}</p>
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
const ReviewItem = ({ author, date, title, content, verified, rating = 5 }) => (
  <div className="py-8 border-b border-border last:border-0 transition-opacity">
    <div className="flex justify-between items-start mb-2">
      <StarRating rating={rating} />
      <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{date}</span>
    </div>
    <h4 className="text-lg font-black tracking-tight mb-3 text-foreground">{title}</h4>
    <p className="text-muted-foreground italic leading-relaxed mb-6 text-[15px]">"{content}"</p>
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20">
        {author.split(' ').map(n => n[0]).join('')}
      </div>
      <span className="text-sm font-bold text-foreground">{author}</span>
      {verified && <span className="text-primary text-[10px] opacity-80" title="Verified Purchase">✓</span>}
    </div>
  </div>
);

// 5. Reviews Section
const ReviewsSection = ({ productId }) => {
  const [activeTab, setActiveTab] = useState("reviews");
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore(state => state.user);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ averageRating: 0, reviewCount: 0 });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ rating: 5, title: "", content: "" });
  const [canReview, setCanReview] = useState(false);

  const loadEligibility = async () => {
    if (!productId || !user) {
      setCanReview(false);
      return;
    }

    try {
      const data = await apiRequest(`/api/products/${productId}/reviews/eligibility`);
      setCanReview(Boolean(data?.canReview));
    } catch (err) {
      setCanReview(false);
    }
  };

  const loadReviews = async () => {
    if (!productId) return;
    try {
      setLoading(true);
      const data = await apiRequest(`/api/products/${productId}/reviews`);
      setReviews(data?.reviews || []);
      setSummary(data?.summary || { averageRating: 0, reviewCount: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  useEffect(() => {
    loadEligibility();
  }, [productId, user]);

  const handleWriteReviewClick = () => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }

    if (!canReview) {
      toast.error("You can only review products you have purchased and paid for.");
      return;
    }

    setShowForm((prev) => !prev);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }

    if (!form.content.trim()) {
      toast.error("Please write your review before submitting");
      return;
    }

    try {
      setSubmitting(true);
      await apiRequest(`/api/products/${productId}/reviews`, {
        method: "POST",
        body: {
          rating: Number(form.rating),
          title: form.title,
          content: form.content,
        },
      });

      toast.success("Review saved successfully");
      setShowForm(false);
      setForm({ rating: 5, title: "", content: "" });
      await loadReviews();
    } catch (err) {
      toast.error(err.message || "Failed to save review");
    } finally {
      setSubmitting(false);
    }
  };

  const dynamicTabs = [
    { key: "reviews", label: `Ratings & Reviews (${summary.reviewCount || 0})` },
    { key: "delivery", label: "Delivery & Returns" },
    { key: "sustainability", label: "Sustainability" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 font-sans">
      <div className="flex gap-10 border-b border-border mb-12 overflow-x-auto no-scrollbar">
        {dynamicTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`pb-4 text-[11px] font-black uppercase tracking-[0.15em] transition-all relative whitespace-nowrap ${tab.key === activeTab ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            {tab.label}
            {tab.key === activeTab && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {activeTab !== "reviews" && (
        <div className="rounded-3xl border border-border bg-muted/20 p-8 text-sm text-muted-foreground leading-relaxed">
          {activeTab === "delivery" && "Delivery takes 3-7 business days for most destinations, with hassle-free 30-day returns."}
          {activeTab === "sustainability" && "Products are sourced with emphasis on durable materials and long lifecycle to reduce replacement frequency."}
        </div>
      )}

      {activeTab === "reviews" && (
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-16 items-start">
        <div className="bg-muted/30 p-8 rounded-[32px] text-center border border-border">
          <h2 className="text-7xl font-black tracking-tighter mb-4 text-foreground">{Number(summary.averageRating || 0).toFixed(1)}</h2>
          <div className="flex justify-center mb-2">
            <StarRating rating={Number(summary.averageRating || 0)} size="lg" />
          </div>
          <p className="text-xs text-muted-foreground font-medium mb-8">Based on {summary.reviewCount || 0} verified reviews</p>
          <button type="button" onClick={handleWriteReviewClick} className="w-full bg-background text-foreground text-[10px] font-black uppercase tracking-[0.2em] py-4 rounded-xl shadow-sm border border-border hover:bg-muted transition-all">
            {showForm ? "Cancel" : user ? (canReview ? "Write a Review" : "Purchase Required") : "Login to Review"}
          </button>

          {user && !canReview && (
            <p className="mt-3 text-[11px] text-muted-foreground leading-relaxed">
              You can read all reviews before buying. Posting a rating or review is available after a paid purchase.
            </p>
          )}

          {showForm && (
            <form onSubmit={handleReviewSubmit} className="mt-6 space-y-3 text-left">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Rating</label>
              <select
                value={form.rating}
                onChange={(e) => setForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>{value} Star{value > 1 ? "s" : ""}</option>
                ))}
              </select>

              <input
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                placeholder="Review title"
              />

              <textarea
                value={form.content}
                onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm min-h-28"
                placeholder="Share your experience with this product"
                required
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-primary text-primary-foreground py-3 text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-60"
              >
                {submitting ? "Saving..." : "Submit Review"}
              </button>
            </form>
          )}
        </div>

        <div>
          {loading && <div className="py-10 text-sm text-muted-foreground">Loading reviews...</div>}
          {!loading && reviews.length === 0 && (
            <div className="py-10 text-sm text-muted-foreground">No reviews yet. Be the first to review this product.</div>
          )}

          {!loading && reviews.map((review) => (
            <ReviewItem
              key={review._id}
              author={review.author}
              date={review.date}
              title={review.title || "Customer review"}
              content={review.content}
              verified={review.verified}
              rating={review.rating}
            />
          ))}
        </div>
      </div>
      )}
    </section>
  );
};

const DetailRelatedCard = ({ product }) => {
  const price = product.discountedPrice ?? product.price;
  
  return (
    <Link to={`/product/${product._id}`} onClick={() => window.scrollTo(0, 0)} className="group bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-border/50">
      <div className="w-full aspect-square bg-muted rounded-[1.5rem] overflow-hidden mb-5">
        <img 
          src={product.coverImage} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={(e) => { e.target.src = "https://via.placeholder.com/400x400?text=Not+Found"; }}
        />
      </div>

      <div className="flex flex-col flex-grow px-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[12px] font-bold uppercase tracking-widest text-indigo-600 truncate mr-2">
            {product.category || "New"}
          </span>
          <span className="text-lg font-black text-indigo-600 tracking-tight shrink-0">
            ETB {price?.toFixed(2)}
          </span>
        </div>
        
        <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex justify-between items-center mt-auto pt-2">
          <div className="flex items-center gap-1.5 text-base font-bold text-gray-900">
            <span className="text-amber-400">★</span>
            <span>{Number(product.averageRating ?? 0).toFixed(1)}</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs uppercase font-bold tracking-widest">
            {product.status?.toLowerCase() === 'new' ? (
              <><span className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-emerald-700">{product.status}</span></>
            ) : product.status?.toLowerCase() === 'slightly used' ? (
              <><span className="w-2 h-2 rounded-full bg-blue-500" /><span className="text-blue-700">{product.status}</span></>
            ) : product.status?.toLowerCase() === 'used' ? (
              <><span className="w-2 h-2 rounded-full bg-amber-500" /><span className="text-amber-700">{product.status}</span></>
            ) : (
              <><span className="w-2 h-2 rounded-full bg-gray-500" /><span className="text-gray-700">{product.status || 'Available'}</span></>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

const RelatedProductsSection = ({ category }) => {
  const [products, setProducts] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    if (!category) return;

    const fetchRelated = async () => {
      try {
        const query = `?category=${encodeURIComponent(category)}&limit=5`;
        const data = await apiRequest(`/api/products${query}`);
        if(data && data.products) {
          const filtered = data.products.filter(p => p._id !== id).slice(0, 4);
          setProducts(filtered);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRelated();
  }, [category, id]);

  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 font-sans">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-black tracking-tighter mb-2 text-foreground">You Might Also Like</h2>
          <p className="text-muted-foreground text-sm font-medium">Explore more items from this collection.</p>
        </div>
        <Link to="/products" className="text-[11px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2 group hover:opacity-80 transition-opacity">
          Browse More <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <DetailRelatedCard
            key={product._id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
};

// 7. Final Export Page
const DetailsPage = () => {
  const { id } = useParams();
  const [category, setCategory] = useState("");
  return (
  <main className="bg-background min-h-screen text-foreground selection:bg-primary selection:text-primary-foreground">
    <ProductDetail onCategoryLoad={setCategory} />
    <div className="border-t border-border">
      <ReviewsSection productId={id} />
    </div>
    <div className="border-t border-border bg-muted/20">
      <RelatedProductsSection category={category} />
    </div>
  </main>
)};

export default DetailsPage;