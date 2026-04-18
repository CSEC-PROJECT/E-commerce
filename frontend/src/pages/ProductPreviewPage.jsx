import React from "react";
import { Link } from "react-router-dom";

export default function ProductPreviewPage() {
  return (
    <div className="min-h-screen bg-background p-8 md:p-12">
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-black tracking-tight text-foreground">Product preview</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Use the Add Product flow and open Preview from there for a live modal. This page is a fallback route for admin preview links.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/admin/products"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90"
          >
            Back to products
          </Link>
          <Link
            to="/admin/add-product"
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-bold text-foreground hover:bg-muted"
          >
            Add product
          </Link>
        </div>
      </div>
    </div>
  );
}
