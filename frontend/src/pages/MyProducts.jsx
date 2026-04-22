import React, { useState, useEffect, useCallback } from 'react';
import { Star, Loader2, ShoppingBag, AlertCircle, X } from 'lucide-react';
import { apiRequest } from '../lib/apiClient';
import { useAuthStore } from '../store/authStore';

/* ───────────────────────────────────────────
   Interactive star input for the review modal
─────────────────────────────────────────── */
const StarRatingInput = ({ value, onChange, hovered, onHover, onLeave }) => (
    <div className="flex gap-1" onMouseLeave={onLeave}>
        {[1, 2, 3, 4, 5].map((star) => (
            <button
                key={star}
                type="button"
                onClick={() => onChange(star)}
                onMouseEnter={() => onHover(star)}
                style={{ background: 'none', border: 'none', padding: '2px', cursor: 'pointer' }}
                className="transition-transform hover:scale-110 focus:outline-none"
            >
                <Star
                    size={34}
                    style={{
                        color: star <= (hovered || value) ? '#F59E0B' : '#D1D5DB',
                        fill:  star <= (hovered || value) ? '#F59E0B' : 'transparent',
                        transition: 'color 0.12s, fill 0.12s',
                        filter: star <= (hovered || value) ? 'drop-shadow(0 0 4px #F59E0B88)' : 'none',
                    }}
                />
            </button>
        ))}
    </div>
);



const resolveStatus = (status, paymentStatus) => {
    if (paymentStatus === 'failed') return { label: 'CANCELLED', tab: 'Cancelled',  bg: '#FFF0EF', color: '#B81919' };
    switch (status) {
        case 'delivered': return { label: 'DELIVERED',  tab: 'Delivered',  bg: '#E2FBEB', color: '#065C38' };
        case 'shipped':   return { label: 'SHIPPED',    tab: 'Processing', bg: '#DBEAFE', color: '#1D4ED8' };
        case 'paid':      return { label: 'PAID',       tab: 'Processing', bg: '#FEF3C7', color: '#92400E' };
        case 'pending':   return { label: 'PROCESSING', tab: 'Processing', bg: '#EDE9FE', color: '#4C1D95' };
        default:          return { label: (status || 'UNKNOWN').toUpperCase(), tab: 'All Products', bg: '#F3F4F6', color: '#6B7280' };
    }
};




const MyProducts = () => {
    const tabs = ['All Products', 'Delivered', 'Processing', 'Cancelled'];
    const [activeTab, setActiveTab]         = useState('All Products');
    const [orders, setOrders]               = useState([]);
    const [productImages, setProductImages] = useState({});
    const [loading, setLoading]             = useState(true);
    const [error, setError]                 = useState(null);

    // Review modal state
    const [reviewModal, setReviewModal]         = useState(null); // { productId, orderId, productName }
    const [reviewRating, setReviewRating]       = useState(0);
    const [reviewHovered, setReviewHovered]     = useState(0);
    const [reviewText, setReviewText]           = useState('');
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewSuccess, setReviewSuccess]     = useState(false);
    const [reviewError, setReviewError]         = useState(null);

    const { accessToken } = useAuthStore();

    /* ── Fetch orders + product images ────────── */
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiRequest('/api/user/orders/my', { token: accessToken });
            const fetched = data?.orders || [];
            setOrders(fetched);

            // Collect unique product IDs
            const uniqueIds = [
                ...new Set(
                    fetched
                        .flatMap((o) => o.items.map((i) => i.productId?.toString()))
                        .filter(Boolean)
                ),
            ];

            if (uniqueIds.length > 0) {
                const results = await Promise.allSettled(
                    uniqueIds.map((id) => apiRequest(`/api/products/${id}`))
                );
                const images = {};
                results.forEach((r, idx) => {
                    const img = r.value?.product?.coverImage || r.value?.coverImage;
                    if (r.status === 'fulfilled' && img) {
                        images[uniqueIds[idx]] = img;
                    }
                });
                setProductImages(images);
            }
        } catch (err) {
            setError(err.message || 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    }, [accessToken]);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    /* ── Flatten orders → flat item list ─────── */
    const flatItems = orders.flatMap((order) =>
        order.items.map((item) => {
            const s = resolveStatus(order.status, order.paymentStatus);
            return {
                id:           `${order._id}-${item.productId}`,
                productId:    item.productId?.toString(),
                orderId:      order._id,
                name:         item.name || 'Product',
                price:        item.price ?? 0,
                qty:          item.quantity ?? 1,
                purchaseDate: new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric',
                }),
                orderRef:     `#${order._id.slice(-6).toUpperCase()}`,
                statusMeta:   s,
            };
        })
    );

    const filteredItems =
        activeTab === 'All Products'
            ? flatItems
            : flatItems.filter((i) => i.statusMeta.tab === activeTab);

    /* ── Review modal handlers ────────────────── */
    const openReviewModal = (item) => {
        setReviewModal({ productId: item.productId, orderId: item.orderId, productName: item.name });
        setReviewRating(0);
        setReviewHovered(0);
        setReviewText('');
        setReviewSuccess(false);
        setReviewError(null);
    };

    const closeReviewModal = () => setReviewModal(null);

    const submitReview = async () => {
        if (reviewRating === 0) { setReviewError('Please select a star rating.'); return; }
        setReviewSubmitting(true);
        setReviewError(null);
        try {
            await apiRequest(`/api/products/${reviewModal.productId}/reviews`, {
                method: 'POST',
                body: { rating: reviewRating, description: reviewText.trim(), orderId: reviewModal.orderId },
                token: accessToken,
            });
            setReviewSuccess(true);
            setTimeout(closeReviewModal, 1800);
        } catch (err) {
            setReviewError(err.message || 'Failed to submit review. Please try again.');
        } finally {
            setReviewSubmitting(false);
        }
    };

    /* ══════════════════════════════════════════ */
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

                {/* ── Loading ── */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 className="animate-spin text-primary" size={44} />
                        <p className="text-text-muted font-medium">Loading your orders…</p>
                    </div>
                )}

                {/* ── Error ── */}
                {!loading && error && (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <AlertCircle size={44} className="text-red-500" />
                        <p className="text-text-muted font-medium">{error}</p>
                        <button
                            onClick={fetchOrders}
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* ── Empty ── */}
                {!loading && !error && filteredItems.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <ShoppingBag size={60} className="text-text-muted opacity-30" />
                        <p className="text-2xl font-bold text-text-main">No orders yet</p>
                        <p className="text-text-muted text-sm text-center">
                            {activeTab === 'All Products'
                                ? "You haven't placed any orders yet. Start shopping!"
                                : `No ${activeTab.toLowerCase()} orders found.`}
                        </p>
                    </div>
                )}

                {/* ── Product List ── */}
                {!loading && !error && filteredItems.length > 0 && (
                    <div className="space-y-8">
                        {filteredItems.map((item) => {
                            const { label, bg, color } = item.statusMeta;
                            const imgSrc = productImages[item.productId];

                            return (
                                <div
                                    key={item.id}
                                    className="bg-card rounded-3xl p-8 flex flex-col md:flex-row gap-10 shadow-sm border border-border"
                                >
                                    {/* Product image */}
                                    <div className="w-full md:w-52 h-52 bg-surface-soft rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                                        {imgSrc ? (
                                            <img
                                                src={imgSrc}
                                                alt={item.name}
                                                className="w-full h-full object-cover rounded-2xl"
                                            />
                                        ) : (
                                            <div className="w-32 h-32 bg-muted rounded-xl" />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-grow flex flex-col justify-between">
                                        <div className="space-y-2">
                                            <h2 className="text-2xl font-bold text-text-main">{item.name}</h2>
                                            <div className="flex flex-wrap gap-4 text-[10px] text-text-muted font-bold pt-1">
                                                <span>Order: {item.orderRef}</span>
                                                <span>Purchased: {item.purchaseDate}</span>
                                            </div>
                                        </div>

                                        {/* Gold stars (decorative) */}
                                        <div className="flex items-center gap-1.5 mt-6">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        style={{
                                                            color: '#F59E0B',
                                                            fill:  '#F59E0B',
                                                            filter: 'drop-shadow(0 0 2px #F59E0B66)',
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price + actions */}
                                    <div className="flex flex-col md:items-end justify-between min-w-[180px]">
                                        <div className="text-right space-y-1">
                                            <div className="text-3xl font-extrabold text-text-main">
                                                ${item.price.toFixed(2)}
                                            </div>
                                            <div className="text-[10px] text-text-muted font-bold uppercase">
                                                Qty: {item.qty}
                                            </div>
                                            {/* Status badge */}
                                            <div
                                                className="mt-3 inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase"
                                                style={{ backgroundColor: bg, color }}
                                            >
                                                <span
                                                    className="w-1.5 h-1.5 rounded-full mr-2"
                                                    style={{ backgroundColor: color }}
                                                />
                                                {label}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4 mt-8 w-full md:w-auto">
                                            {/* ── Write Review button ── */}
                                            <button
                                                onClick={() => openReviewModal(item)}
                                                style={{ borderRadius: '12px' }}
                                                className="px-5 py-2 text-xs font-bold tracking-wide transition-all bg-primary text-primary-foreground hover:opacity-90 hover:shadow-md active:scale-95"
                                            >
                                                Write Review
                                            </button>

                                            <div className="flex flex-col gap-2 md:items-end text-right px-1">
                                                <button className="text-[11px] font-black text-primary hover:underline">

                                                    <a href={`/product/${item.productId}`} className="text-primary hover:underline">
                                                        buy again
                                                    </a>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ══════════════════════════════════════════
                Review Modal
            ══════════════════════════════════════════ */}
            {reviewModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}
                    onClick={(e) => { if (e.target === e.currentTarget) closeReviewModal(); }}
                >
                    <div
                        className="bg-card rounded-3xl shadow-2xl p-8 w-full max-w-md relative"
                        style={{ animation: 'myp-fadeUp 0.25s ease-out forwards' }}
                    >
                        {/* Close */}
                        <button
                            onClick={closeReviewModal}
                            className="absolute top-5 right-5 text-text-muted hover:text-text-main transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-extrabold text-text-main mb-1">Write a Review</h2>
                        <p className="text-text-muted text-sm mb-6 truncate pr-6">{reviewModal.productName}</p>

                        {reviewSuccess ? (
                            /* Success state */
                            <div className="flex flex-col items-center py-10 gap-3">
                                <span style={{ fontSize: 52 }}>⭐</span>
                                <p className="text-xl font-extrabold text-text-main">Review Submitted!</p>
                                <p className="text-text-muted text-sm">Thank you for your feedback.</p>
                            </div>
                        ) : (
                            <>
                                {/* Star picker */}
                                <div className="mb-5">
                                    <label className="block text-sm font-semibold text-text-main mb-3">
                                        Your Rating
                                    </label>
                                    <StarRatingInput
                                        value={reviewRating}
                                        onChange={setReviewRating}
                                        hovered={reviewHovered}
                                        onHover={setReviewHovered}
                                        onLeave={() => setReviewHovered(0)}
                                    />
                                    {reviewRating > 0 && (
                                        <p className="text-xs text-text-muted mt-2 font-medium">
                                            {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][reviewRating]} — {reviewRating}/5
                                        </p>
                                    )}
                                </div>

                                {/* Textarea */}
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-text-main mb-2">
                                        Review Description
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        placeholder="Share your experience with this product…"
                                        className="w-full rounded-xl border border-border bg-background text-text-main text-sm px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary transition placeholder:text-text-muted"
                                    />
                                </div>

                                {reviewError && (
                                    <p className="text-xs text-red-500 mb-4 font-semibold">{reviewError}</p>
                                )}

                                {/* Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={submitReview}
                                        disabled={reviewSubmitting}
                                        className="flex-1 py-3 rounded-full bg-primary text-primary-foreground text-sm font-black hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        {reviewSubmitting ? (
                                            <><Loader2 size={15} className="animate-spin" /> Sending…</>
                                        ) : (
                                            'Send Review'
                                        )}
                                    </button>
                                    <button
                                        onClick={closeReviewModal}
                                        disabled={reviewSubmitting}
                                        className="flex-1 py-3 rounded-full border border-border text-text-muted text-sm font-semibold hover:text-text-main hover:border-primary transition-all disabled:opacity-60"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Modal entrance keyframe */}
            <style>{`
                @keyframes myp-fadeUp {
                    from { opacity: 0; transform: translateY(18px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)   scale(1);    }
                }
            `}</style>
        </div>
    );
};

export default MyProducts;