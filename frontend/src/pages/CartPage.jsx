import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Card2 from '../components/Common/Card2';
import CartItem from '../components/carts/CartItem';
import OrderSummary from '../components/carts/OrderSummary';
import useCartStore from '../store/cartStore';
import { apiRequest } from '../lib/apiClient';

const CartPage = () => {
    const { cart, getCart, updateQuantity, removeFromCart } = useCartStore();
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        getCart();
    }, [getCart]);

    const cartItems = cart?.items || [];
    
    // Fetch suggestions based on the first item's category
    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                let category = '';
                if (cartItems.length > 0 && cartItems[0].product) {
                    category = cartItems[0].product.category || '';
                }
                
                const query = category ? `?category=${category}&limit=4` : `?limit=4`;
                const response = await apiRequest(`/api/products${query}`);
                
                if (response?.products && response.products.length > 0) {
                    setSuggestions(response.products.slice(0, 4).map(p => ({
                        id: p._id,
                        image: p.coverImage,
                        category: p.category,
                        title: p.name,
                        price: p.price,
                        inStock: p.stock > 0
                    })));
                } else {
                    setSuggestions([]);
                }
            } catch (error) {
                console.error("Failed to fetch suggestions", error);
                setSuggestions([]);
            }
        };
        fetchSuggestions();
    }, [cartItems.length]);

    const handleUpdateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        updateQuantity(productId, newQuantity);
    };

    const handleRemoveItem = (productId) => {
        removeFromCart(productId);
    };

    const subtotal = typeof cart?.totalPrice === 'number' && cart.totalPrice > 0 
        ? cart.totalPrice 
        : cartItems.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0);
        
    const taxRate = 0.08; 
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return (
        <div className="font-sans antialiased bg-background text-foreground min-h-screen pb-20">
            <div className="container mx-auto max-w-7xl px-4 md:px-8 pt-10 pb-16">

                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-black text-foreground mb-2 tracking-tight">Your Shopping Bag</h1>
                    <p className="text-muted-foreground text-base">Review your selections from the Digital Atelier.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="flex-1 flex flex-col gap-5">
                        {cartItems.length > 0 ? (
                            cartItems.map((item) => {
                                const mappedItem = {
                                    id: item.product?._id || item.product, // ensure we have the id for store actions
                                    image: item.product?.coverImage || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60",
                                    category: item.product?.category || "CATEGORY",
                                    title: item.product?.name || "Product",
                                    details: item.product?.material || "",
                                    quantity: item.quantity || 1,
                                    unitPrice: item.price || 0,
                                    price: item.price || 0
                                };

                                return (
                                <CartItem
                                    key={item._id || mappedItem.id}
                                    item={mappedItem}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onRemove={handleRemoveItem}
                                />
                                )
                            })
                        ) : (
                            <div className="text-center py-20 bg-card rounded-2xl border border-border/50 shadow-sm flex flex-col items-center justify-center">
                                <svg className="w-16 h-16 text-muted-foreground mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <h3 className="text-2xl font-bold text-foreground mb-2">Your shopping bag is empty</h3>
                                <p className="text-muted-foreground mb-8 max-w-sm">Looks like you haven't added anything to your bag yet. Explore our collections and find something you love.</p>
                                <Link to="/products" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
                                    Start Shopping
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="w-full lg:w-[400px]">
                        <OrderSummary 
                            subtotal={subtotal} 
                            tax={tax} 
                            total={total} 
                            cartItems={cartItems} 
                        />
                    </div>
                </div>
            </div>

            <section className="bg-muted/10 py-16 px-4 md:px-8 border-t border-border/50">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex justify-between items-end mb-10">
                        <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">You May Also Like</h2>
                        <Link to="/products" className="text-primary hover:opacity-80 font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-opacity group">
                            View All <span className="transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {suggestions.map((product) => (
                            <Link to={`/product/${product.id}`} key={product.id}>
                                <Card2
                                    id={product.id}
                                    image={product.image}
                                    category={product.category}
                                    title={product.title}
                                    price={product.price}
                                    rating={product.rating || 5}
                                    reviews={product.reviews || 12}
                                    inStock={product.inStock}
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CartPage;
