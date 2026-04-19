import React from "react";
import { X, Tag, Package, Truck, Star } from "lucide-react";

export default function ProductPreviewModal({ isOpen, onClose, onPublish, formData = {}, coverImage = null }) {
  if (!isOpen) return null;

  // Derive a local URL for the cover image so we can render it
  const coverPreviewUrl = coverImage instanceof File ? URL.createObjectURL(coverImage) : null;

  const displayPrice   = formData.price     ? `$${Number(formData.price).toFixed(2)}`        : "—";
  const comparePrice   = formData.comparePrice ? `$${Number(formData.comparePrice).toFixed(2)}` : null;
  const discount       = formData.comparePrice && formData.price
    ? Math.round((1 - Number(formData.price) / Number(formData.comparePrice)) * 100)
    : null;

  const stockLabel = formData.stockStatus || "In Stock";
  const stockColor =
    stockLabel === "Out of Stock" ? "text-red-500 bg-red-500/10 border-red-500/20"
    : stockLabel === "Limited Stock" ? "text-amber-500 bg-amber-500/10 border-amber-500/20"
    : "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-title"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black tracking-widest uppercase text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
              Preview Mode
            </span>
            <span className="text-xs text-muted-foreground font-medium">This is how your product will look</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close preview"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">

            {/* Image Panel */}
            <div className="bg-muted/30 min-h-[260px] flex items-center justify-center p-6">
              {coverPreviewUrl ? (
                <img
                  src={coverPreviewUrl}
                  alt={formData.name || "Product"}
                  className="w-full h-56 object-contain rounded-xl shadow-md"
                />
              ) : (
                <div className="w-full h-56 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <p className="text-xs font-medium">No cover image uploaded</p>
                </div>
              )}
            </div>

            {/* Details Panel */}
            <div className="p-6 flex flex-col gap-4">
              {/* Category badge */}
              {formData.category && (
                <div className="flex items-center gap-1.5">
                  <Tag size={11} className="text-primary" />
                  <span className="text-[10px] font-black tracking-widest uppercase text-primary">{formData.category}</span>
                </div>
              )}

              {/* Name */}
              <h2 id="preview-title" className="text-xl font-black tracking-tight text-foreground leading-snug">
                {formData.name || <span className="text-muted-foreground italic font-normal">No product name</span>}
              </h2>

              {/* Pricing row */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-2xl font-black text-foreground">{displayPrice}</span>
                {comparePrice && (
                  <span className="text-sm text-muted-foreground line-through">{comparePrice}</span>
                )}
                {discount && (
                  <span className="text-[10px] font-black tracking-widest uppercase text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
                    {discount}% OFF
                  </span>
                )}
              </div>

              {/* Stock status */}
              <span className={`self-start text-[10px] font-black tracking-widest uppercase border rounded-full px-3 py-1 ${stockColor}`}>
                {stockLabel} {formData.stock ? `· ${formData.stock} units` : ""}
              </span>

              {/* Description */}
              {formData.description && (
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                  {formData.description}
                </p>
              )}

              {/* Meta chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {formData.status && (
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-muted border border-border rounded-full text-foreground capitalize">
                    {formData.status}
                  </span>
                )}
                {formData.shippingType && (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 bg-muted border border-border rounded-full text-foreground capitalize">
                    <Truck size={10} /> {formData.shippingType === "free" ? "Free Shipping" : `Paid Shipping${formData.shippingCost ? ` · $${formData.shippingCost}/km` : ""}`}
                  </span>
                )}
                {formData.deliveryTime && (
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-muted border border-border rounded-full text-foreground">
                    Delivery: {formData.deliveryTime}
                  </span>
                )}
              </div>

              {/* Technical specs */}
              {(formData.material || formData.madeIn || formData.dimensions || formData.weight) && (
                <div className="pt-2 border-t border-border/50 grid grid-cols-2 gap-1.5">
                  {[
                    { label: "Material", value: formData.material },
                    { label: "Origin", value: formData.madeIn },
                    { label: "Dimensions", value: formData.dimensions },
                    { label: "Weight", value: formData.weight },
                  ].filter(r => r.value).map(row => (
                    <div key={row.label}>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{row.label}</span>
                      <p className="text-xs font-semibold text-foreground">{row.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/40 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-bold text-foreground hover:bg-muted transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => { onPublish?.(); onClose?.(); }}
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity shadow-sm"
          >
            Publish Product
          </button>
        </div>
      </div>
    </div>
  );
}
