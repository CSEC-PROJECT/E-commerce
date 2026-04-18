import React from 'react';
import { useSearchParams } from 'react-router-dom';

const Pagination = ({ total = 0, current = 1, pageSize = 12 }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    const next = new URLSearchParams(searchParams);
    next.set('page', String(p));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Build visible page list with ellipsis
  const buildPages = () => {
    const pages = [];
    const delta = 1; // pages around current

    // Always show first
    pages.push(1);

    const left = current - delta;
    const right = current + delta;

    if (left > 2) pages.push('…');
    for (let i = Math.max(2, left); i <= Math.min(totalPages - 1, right); i++) {
      pages.push(i);
    }
    if (right < totalPages - 1) pages.push('…');

    // Always show last (if more than 1 page)
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const pages = buildPages();

  return (
    <div className="flex items-center justify-center gap-1 mt-12 mb-8">
      {/* Prev */}
      <button
        onClick={() => goToPage(current - 1)}
        disabled={current === 1}
        aria-label="Previous page"
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      {/* Page numbers */}
      {pages.map((p, idx) =>
        typeof p === 'string' ? (
          <span
            key={`dots-${idx}`}
            className="flex items-center justify-center w-9 h-9 text-muted-foreground select-none"
          >
            {p}
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goToPage(p)}
            aria-label={`Go to page ${p}`}
            aria-current={p === current ? 'page' : undefined}
            className={`flex items-center justify-center w-9 h-9 rounded-lg font-medium text-sm transition-colors ${
              p === current
                ? 'bg-primary text-primary-foreground shadow-sm pointer-events-none'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => goToPage(current + 1)}
        disabled={current === totalPages}
        aria-label="Next page"
        className="flex items-center justify-center w-9 h-9 rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
