import React from "react";
import { X } from "lucide-react";

export default function ProductPreviewModal({ isOpen, onClose, onPublish }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-title"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Close preview"
        >
          <X size={20} />
        </button>
        <div className="p-8 pt-14">
          <h2 id="preview-title" className="text-xl font-black tracking-tight text-foreground">
            Product preview
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This is a quick preview. Connect your form fields to real data when you wire the API.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-5 py-2.5 text-sm font-bold text-foreground hover:bg-muted"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onPublish?.();
                onClose?.();
              }}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90"
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
