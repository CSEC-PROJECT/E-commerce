import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProductStore } from '../store/productStore';

const MIN_PRICE = 0;
const MAX_PRICE = 2500;
const STEP = 50;
const GAP = 50; // minimum gap between min and max

// ─── Custom dual-thumb slider ───────────────────────────────────────────────
// Uses Pointer Events API (works for mouse + touch) on a single track div.
// Determines which thumb to move based on proximity to the click/tap point.
const DualSlider = ({ minVal, maxVal, onMinChange, onMaxChange }) => {
  const trackRef = useRef(null);
  const dragging = useRef(null); // 'min' | 'max' | null

  const getValueFromPointer = useCallback((clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const raw = MIN_PRICE + pct * (MAX_PRICE - MIN_PRICE);
    return Math.round(raw / STEP) * STEP;
  }, []);

  const handlePointerDown = (e) => {
    e.preventDefault();
    trackRef.current.setPointerCapture(e.pointerId);
    const val = getValueFromPointer(e.clientX);
    const distMin = Math.abs(val - minVal);
    const distMax = Math.abs(val - maxVal);
    // Pick the closer thumb; tie goes to max so min can still be grabbed at left edge
    dragging.current = distMin < distMax ? 'min' : 'max';
  };

  const handlePointerMove = (e) => {
    if (!dragging.current) return;
    const val = getValueFromPointer(e.clientX);
    if (dragging.current === 'min') {
      const clamped = Math.max(MIN_PRICE, Math.min(val, maxVal - GAP));
      onMinChange(clamped);
    } else {
      const clamped = Math.min(MAX_PRICE, Math.max(val, minVal + GAP));
      onMaxChange(clamped);
    }
  };

  const handlePointerUp = () => {
    dragging.current = null;
  };

  const minPct = ((minVal - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;
  const maxPct = ((maxVal - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100;

  return (
    <div
      ref={trackRef}
      className="relative select-none cursor-pointer mx-2"
      style={{ height: '20px', touchAction: 'none' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Full grey track */}
      <div
        className="absolute rounded-full"
        style={{
          left: 0,
          right: 0,
          top: '50%',
          height: '4px',
          transform: 'translateY(-50%)',
          backgroundColor: 'var(--muted)',
        }}
      />

      {/* Blue active range */}
      <div
        className="absolute rounded-full"
        style={{
          left: `${minPct}%`,
          width: `${maxPct - minPct}%`,
          top: '50%',
          height: '4px',
          transform: 'translateY(-50%)',
          backgroundColor: 'var(--primary)',
        }}
      />

      {/* Min thumb */}
      <div
        className="absolute rounded-full bg-background shadow"
        style={{
          width: '16px',
          height: '16px',
          left: `${minPct}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          border: '2px solid var(--primary)',
          zIndex: 2,
        }}
      />

      {/* Max thumb */}
      <div
        className="absolute rounded-full bg-background shadow"
        style={{
          width: '16px',
          height: '16px',
          left: `${maxPct}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          border: '2px solid var(--primary)',
          zIndex: 2,
        }}
      />
    </div>
  );
};

// ─── Sidebar ────────────────────────────────────────────────────────────────
const Sidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';
  const [isOpen, setIsOpen] = useState(false);

  const urlMin = Number(searchParams.get('minPrice')) || MIN_PRICE;
  const urlMax = Number(searchParams.get('maxPrice')) || MAX_PRICE;

  const [localMin, setLocalMin] = useState(urlMin);
  const [localMax, setLocalMax] = useState(urlMax);
  const applyTimerRef = useRef(null);

  // Sync local state when URL is cleared externally (e.g. "Clear all filters")
  useEffect(() => {
    const nextMin = Number(searchParams.get('minPrice')) || MIN_PRICE;
    const nextMax = Number(searchParams.get('maxPrice')) || MAX_PRICE;
    setLocalMin(nextMin);
    setLocalMax(nextMax);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('minPrice'), searchParams.get('maxPrice')]);

  // Debounced URL update – fires 400ms after dragging stops
  const scheduleApply = useCallback((min, max) => {
    if (applyTimerRef.current) clearTimeout(applyTimerRef.current);
    applyTimerRef.current = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (min > MIN_PRICE) next.set('minPrice', String(min));
      else next.delete('minPrice');
      if (max < MAX_PRICE) next.set('maxPrice', String(max));
      else next.delete('maxPrice');
      next.set('page', '1');
      setSearchParams(next);
    }, 400);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, setSearchParams]);

  const handleMinChange = (val) => {
    setLocalMin(val);
    scheduleApply(val, localMax);
  };

  const handleMaxChange = (val) => {
    setLocalMax(val);
    scheduleApply(localMin, val);
  };

  const products = useProductStore((state) => state.products);
  
  // Standard categories from screenshot
  const STANDARD_CATEGORIES = ['Electronics', 'Footwear', 'Accessories', 'Apparel'];
  const dbCategories = [...new Set(products.filter(p => !!p.category).map(p => p.category))];
  const uniqueCategories = [...new Set([...STANDARD_CATEGORIES, ...dbCategories])];
  
  const categories = [
    { id: '', label: 'All Collections' },
    ...uniqueCategories.map(c => ({ id: c, label: c }))
  ];

  const handleCategoryClick = (id) => {
    const next = new URLSearchParams(searchParams);
    if (id) next.set('category', id);
    else next.delete('category');
    next.set('page', '1');
    setSearchParams(next);
  };

  const formatLabel = (val) =>
    val >= MAX_PRICE ? `$${MAX_PRICE.toLocaleString()}+` : `$${val.toLocaleString()}`;

  const hasFilters = activeCategory || localMin > MIN_PRICE || localMax < MAX_PRICE;

  return (
    <>
      {/* Mobile filter toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-muted rounded-lg text-sm font-semibold text-foreground border border-border w-fit"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
        {hasFilters && (
          <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-md uppercase">
            Active
          </span>
        )}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Sidebar panel */}
      <aside
        className={`w-full md:w-56 lg:w-64 flex-shrink-0 md:pr-8 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[700px] opacity-100 mt-4' : 'max-h-0 md:max-h-none opacity-0 md:opacity-100'
        }`}
      >
        {/* ── Category ── */}
        <div className="mb-8 md:mb-10">
          <h3 className="text-xs font-bold text-muted-foreground tracking-wider mb-3 md:mb-4 uppercase">
            Category
          </h3>
          <div className="space-y-2.5 md:space-y-3">
            {categories.map((cat) => {
              const isActive = cat.id === activeCategory;
              return (
                <label
                  key={cat.id}
                  className="flex items-center cursor-pointer group"
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  <div
                    className={`w-5 h-5 rounded flex flex-shrink-0 justify-center items-center mr-3 transition-colors ${
                      isActive ? 'bg-primary' : 'bg-[#e5e7eb] dark:bg-muted group-hover:bg-primary/20'
                    }`}
                  >
                    {isActive && (
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-sm transition-colors group-hover:text-primary ${
                      isActive ? 'text-foreground font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    {cat.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* ── Price Range ── */}
        <div className="mb-8 md:mb-10">
          <h3 className="text-xs font-bold text-muted-foreground tracking-wider mb-4 uppercase">
            Price Range
          </h3>

          <DualSlider
            minVal={localMin}
            maxVal={localMax}
            onMinChange={handleMinChange}
            onMaxChange={handleMaxChange}
          />

          <div className="flex justify-between items-center text-xs font-semibold text-foreground mt-3">
            <span>{formatLabel(localMin)}</span>
            <span>{formatLabel(localMax)}</span>
          </div>
        </div>

        {/* ── Newsletter ── */}
        <div className="bg-muted rounded-xl p-4 md:p-5">
          <p className="text-sm text-foreground mb-4 leading-relaxed">
            Join our curated newsletter for seasonal drops and artisan spotlights.
          </p>
          <button className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
            Sign up
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
