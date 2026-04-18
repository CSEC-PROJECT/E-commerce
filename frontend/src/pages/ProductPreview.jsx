import React from 'react';

const ProductPreviewModal = ({ isOpen, onClose, onPublish }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="text-xl font-black tracking-tight text-foreground">Product Preview</h2>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              This is how your product will appear to customers
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Preview Card */}
        <div className="p-6">
          {/* Image placeholder */}
          <div className="w-full aspect-video bg-muted rounded-xl flex items-center justify-center mb-5 border border-border">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="text-xs font-medium">No image uploaded</span>
            </div>
          </div>

          {/* Product info placeholders */}
          <div className="space-y-3">
            <div className="h-6 bg-muted rounded-lg w-3/4 animate-pulse" />
            <div className="h-4 bg-muted rounded-lg w-full animate-pulse" />
            <div className="h-4 bg-muted rounded-lg w-5/6 animate-pulse" />
            <div className="flex items-center gap-4 pt-2">
              <div className="h-7 bg-muted rounded-lg w-24 animate-pulse" />
              <div className="h-5 bg-muted rounded-lg w-16 animate-pulse opacity-50" />
            </div>
          </div>

          {/* Badges */}
          <div className="flex gap-2 mt-4">
            {['In Stock', 'New', 'Free Shipping'].map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-border bg-muted/30">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-black tracking-widest uppercase rounded-xl border border-border text-foreground hover:bg-muted transition-colors"
          >
            Continue Editing
          </button>
          <button
            type="button"
            onClick={() => { onPublish && onPublish(); onClose(); }}
            className="flex-1 py-2.5 text-xs font-black tracking-widest uppercase rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm"
          >
            Publish Live
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPreviewModal;
