import React, { useState } from 'react';

const Sidebar = () => {
  return (
    <aside className="w-64 flex-shrink-0 pr-8">
      {/* Category Section */}
      <div className="mb-10">
        <h3 className="text-xs font-bold text-text-muted tracking-wider mb-4 uppercase">Category</h3>
        <div className="space-y-3">
          <label className="flex items-center cursor-pointer group">
            <div className="w-4 h-4 rounded border border-border bg-primary/10 flex flex-shrink-0 justify-center items-center mr-3 transition-colors">
              <svg className="w-3 h-3 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span className="text-sm text-text-main group-hover:text-primary transition-colors">All Collections</span>
          </label>
          <label className="flex items-center cursor-pointer group">
            <div className="w-4 h-4 rounded border border-border bg-surface-soft flex flex-shrink-0 justify-center items-center mr-3 transition-colors group-hover:bg-primary/5"></div>
            <span className="text-sm text-text-muted group-hover:text-primary transition-colors">Home Decor</span>
          </label>
          <label className="flex items-center cursor-pointer group">
            <div className="w-4 h-4 rounded border border-border bg-surface-soft flex flex-shrink-0 justify-center items-center mr-3 transition-colors group-hover:bg-primary/5"></div>
            <span className="text-sm text-text-muted group-hover:text-primary transition-colors">Accessories</span>
          </label>
          <label className="flex items-center cursor-pointer group">
            <div className="w-4 h-4 rounded border border-border bg-surface-soft flex flex-shrink-0 justify-center items-center mr-3 transition-colors group-hover:bg-primary/5"></div>
            <span className="text-sm text-text-muted group-hover:text-primary transition-colors">Workspace</span>
          </label>
        </div>
      </div>

      {/* Price Range Section */}
      <div className="mb-10">
        <h3 className="text-xs font-bold text-text-muted tracking-wider mb-4 uppercase">Price Range</h3>
        <div className="px-2 mb-2">
          {/* Custom Slider Visual */}
          <div className="relative h-1 bg-surface-soft rounded-full mt-4">
            <div className="absolute left-[15%] right-[25%] h-full bg-primary rounded-full"></div>
            <div className="absolute left-[15%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-primary bg-background shadow-sm cursor-pointer"></div>
            <div className="absolute right-[25%] top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 rounded-full border-2 border-primary bg-background shadow-sm cursor-pointer"></div>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs text-text-main mt-4">
          <span>$0</span>
          <span>$2,500+</span>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-surface-soft rounded-radius-lg p-5">
        <p className="text-sm text-text-main mb-4 leading-relaxed">
          Join our curated newsletter for seasonal drops and artisan spotlights.
        </p>
        <button className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
          Sign up
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
