import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sparkles, X, Send, Plus, ShoppingBag, MessageSquareText } from "lucide-react";
import { ragApi } from "../lib/apiClient";
import useCartStore from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { useToastStore } from "../store/toastStore";



const ProductSuggestionCard = ({ product, onAdd }) => {
  const finalPrice = product.discountedPrice ?? product.price;

  return (
    <div className="group rounded-xl border border-border bg-card p-2.5 flex gap-3 hover:border-primary/40 transition-colors shadow-sm">
      <img
        src={product.coverImage}
        alt={product.name}
        className="w-16 h-16 rounded-lg object-cover bg-muted"
      />
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <p className="text-sm font-semibold text-foreground line-clamp-1">{product.name}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{product.category || "General"}</p>
        <div className="flex items-center justify-between mt-1">
            <p className="text-xs font-bold text-primary">ETB {Number(finalPrice || 0).toFixed(2)}</p>
            {product.inventoryNote && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                    {product.inventoryNote}
                </span>
            )}
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <button
            onClick={() => onAdd(product)}
            className="flex-1 text-[11px] py-1.5 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-1"
          >
            <ShoppingBag size={12} /> Add
          </button>
          <Link
            to={`/product/${product._id}`}
            className="flex-1 text-[11px] py-1.5 rounded-md border border-border bg-card text-foreground font-medium hover:bg-muted text-center transition-colors"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

const AICurator = ({ page = "home", productId = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const initialMessages = useMemo(() => [
    {
      id: "welcome",
      role: "assistant",
      text: "Hi there! 👋 Welcome to masob market. I'm your AI shopping assistant. How can I help you find the perfect item today?",
      products: [],
      alternatives: [],
    },
  ], []);

  const [messages, setMessages] = useState(initialMessages);

  const chatRef = useRef(null);
  const fabRef = useRef(null);
  const listRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const addToCart = useCartStore((state) => state.addToCart);
  const addToast = useToastStore((state) => state.addToast);



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        chatRef.current &&
        !chatRef.current.contains(event.target) &&
        fabRef.current &&
        !fabRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  const toggleOpen = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        // Reset to a fresh chat each time the widget is opened
        setMessages(initialMessages);
      }
      return next;
    });
  };

  const handleAddFromChat = async (product) => {
    if (!product?._id) return;

    if (!user) {
      addToast("Please login to add items to your cart", "info");
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`);
      return;
    }

    try {
      await addToCart({
        product: product._id,
        quantity: 1,
        price: product.discountedPrice ?? product.price,
      });
      addToast("Product added to cart", "success");
    } catch (error) {
      addToast(error?.message || "Failed to add product to cart", "error");
    }
  };

  const sendQuery = async (nextMessage) => {
    const trimmed = String(nextMessage || "").trim();
    if (!trimmed || isSending) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
      products: [],
      alternatives: [],
    };

    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setIsSending(true);

    try {
      const response = await ragApi.chat({
        message: trimmed,
        productId,
        page,
        limit: 4,
      });

      const parts = [response?.reply || "I processed your request."];
      if (response?.comparisonSummary) parts.push(response.comparisonSummary);
      if (response?.alternatives?.length) parts.push("Here are some in-stock alternatives.");

      const assistantMsg = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: parts.join("\n\n"),
        products: response?.products || [],
        alternatives: response?.alternatives || [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: error?.message || "I could not complete that request right now. Please try again.",
          products: [],
          alternatives: [],
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    sendQuery(message);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4 font-sans pointer-events-none">
      {/* Chat Window */}
      <div
        ref={chatRef}
        className={`transition-all duration-300 origin-bottom-right pointer-events-auto ${
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4 pointer-events-none"
        } w-[400px] max-w-[calc(100vw-2rem)] h-[650px] max-h-[calc(100vh-6rem)] bg-card rounded-2xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)] border border-border overflow-hidden flex flex-col`}
      >
        {/* Minimal Header */}
        <div className="px-5 py-4 bg-card border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
              <Sparkles size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-[15px] text-foreground tracking-tight">masob market</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <span className="text-[11px] font-medium text-muted-foreground">AI Assistant — Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 -mr-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Chat Area */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-5 space-y-6 bg-background/50 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
          {messages.map((item) => (
            <div key={item.id} className={`flex flex-col gap-1.5 ${item.role === "user" ? "items-end" : "items-start"}`}>
              {item.role === "assistant" && (
                <div className="flex items-center gap-2 mb-1">
                   <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles size={10} className="text-primary" />
                   </div>
                   <span className="text-[11px] font-medium text-muted-foreground">Assistant</span>
                </div>
              )}
              <div
                className={`max-w-[88%] px-4 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap ${
                  item.role === "user"
                    ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
                    : "bg-card text-foreground border border-border rounded-2xl rounded-tl-sm shadow-sm"
                }`}
              >
                {item.text}
              </div>

              {item.role === "assistant" && (item.products?.length > 0 || item.alternatives?.length > 0) && (
                <div className="w-full max-w-[90%] space-y-3 mt-2">
                  {item.products?.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {item.products.map((product) => (
                        <ProductSuggestionCard key={product._id} product={product} onAdd={handleAddFromChat} />
                      ))}
                    </div>
                  )}

                  {item.alternatives?.length > 0 && (
                    <div className="pt-2">
                      <p className="text-[11px] font-semibold text-muted-foreground mb-2">Alternatives</p>
                      <div className="flex flex-col gap-2">
                        {item.alternatives.map((product) => (
                          <ProductSuggestionCard key={`alt-${product._id}`} product={product} onAdd={handleAddFromChat} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {isSending && (
            <div className="flex flex-col gap-1.5 items-start">
              <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles size={10} className="text-primary" />
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground">Assistant is typing...</span>
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-card border-t border-border flex flex-col gap-3">

          <form onSubmit={onSubmit} className="flex items-center gap-2">
            <button type="button" className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-hidden>
              <Plus size={20} />
            </button>
            <input
              type="text"
              placeholder="Message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-muted/50 border border-transparent focus:border-primary/30 focus:bg-card focus:ring-0 rounded-full text-[14px] px-4 py-2 text-foreground transition-colors"
            />
            <button
              type="submit"
              disabled={isSending || !String(message).trim()}
              className="p-2 rounded-full text-primary hover:bg-primary/10 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Trigger Button */}
      <button
        ref={fabRef}
        onClick={toggleOpen}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_4px_14px_rgba(0,0,0,0.15)] pointer-events-auto ${
          isOpen
            ? "bg-card text-foreground border border-border"
            : "bg-primary text-primary-foreground hover:scale-105"
        }`}
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </button>
    </div>
  );
};

export default AICurator;

