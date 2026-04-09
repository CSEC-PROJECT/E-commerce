import React from 'react';

const Pagination = () => {
  return (
    <div className="flex items-center justify-center space-x-2 mt-12 mb-8">
      <button className="flex items-center justify-center w-8 h-8 rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6" /></svg>
      </button>

      {[1, 2, 3].map((pageNumber) => (
        <button
          key={pageNumber}
          className={`flex items-center justify-center w-9 h-9 rounded-lg ${pageNumber === 1
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
        >
          {pageNumber}
        </button>
      ))}

      <span className="flex items-center justify-center w-8 h-8 text-muted-foreground">
        ...
      </span>
      <button className="flex items-center justify-center w-8 h-8 rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6" /></svg>
      </button>
    </div>
  );
};

export default Pagination;
