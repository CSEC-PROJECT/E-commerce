import React, { useState } from 'react';
import ProductPreviewModal from './ProductPreview';

// === Internal Components ===

const SectionContainer = ({ title, icon, children, noPadding }) => (
  <div className="bg-card border border-border rounded-xl mb-6 overflow-hidden shadow-sm">
    {title && (
      <div className="flex items-center gap-3 p-6 pb-4 border-b border-border/50">
        {icon && <span className="text-primary">{icon}</span>}
        <h2 className="text-lg font-bold tracking-tight text-foreground">{title}</h2>
      </div>
    )}
    <div className={noPadding ? "" : "p-6"}>
      {children}
    </div>
  </div>
);

const InputField = ({ label, type = "text", placeholder, as = "input", rows }) => (
  <div className="mb-5 last:mb-0">
    <label className="block text-[11px] font-black tracking-widest text-foreground uppercase mb-2">
      {label}
    </label>
    {as === "textarea" ? (
      <textarea
        placeholder={placeholder}
        rows={rows || 4}
        className="w-full bg-muted text-foreground border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm placeholder:text-muted-foreground resize-none"
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        className="w-full bg-muted text-foreground border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm placeholder:text-muted-foreground"
      />
    )}
  </div>
);

const SelectField = ({ label, options }) => (
  <div className="mb-5 last:mb-0">
    <label className="block text-[11px] font-black tracking-widest text-foreground uppercase mb-2">
      {label}
    </label>
    <div className="relative">
      <select className="w-full bg-muted text-foreground border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm appearance-none cursor-pointer font-medium hover:bg-muted/80">
        {options.map((opt, i) => (
          <option key={i} value={opt}>{opt}</option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-muted-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  </div>
);

// === Sections ===

const BasicDetails = () => (
  <SectionContainer
    title="Basic Details"
    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>}
  >
    <InputField label="Product Name" placeholder="e.g. Lumina Sculptural Object" />
    <InputField label="Description" placeholder="Detailed product description..." as="textarea" />
  </SectionContainer>
);

const Pricing = () => (
  <SectionContainer
    title="Pricing"
    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" /></svg>}
  >
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <InputField label="Price ($)" type="number" placeholder="0.00" />
      <InputField label="Compare at Price ($)" type="number" placeholder="0.00" />
    </div>
  </SectionContainer>
);

const Inventory = () => (
  <SectionContainer
    title="Inventory"
    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>}
  >
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <InputField label="Stock Quantity" type="number" placeholder="e.g. 100" />
      <SelectField label="Stock Status" options={["In Stock", "Limited Stock", "Out of Stock"]} />
    </div>
  </SectionContainer>
);

const Condition = () => (
  <SectionContainer
    title="Condition"
    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
  >
    <SelectField label="Item Condition" options={["New", "Slightly used", "Used"]} />
  </SectionContainer>
);

const Shipping = () => {
  const [shippingType, setShippingType] = useState('free');

  return (
    <SectionContainer
      title="Shipping"
      icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>}
    >
      <div className="flex gap-4 mb-5">
        <button
          type="button"
          onClick={() => setShippingType('free')}
          className={`flex-1 text-[11px] font-black tracking-widest uppercase py-3 rounded-xl border transition-all ${shippingType === 'free' ? 'border-primary text-primary bg-primary/10' : 'border-border text-foreground bg-muted hover:bg-muted/80'}`}
        >
          Free
        </button>
        <button
          type="button"
          onClick={() => setShippingType('paid')}
          className={`flex-1 text-[11px] font-black tracking-widest uppercase py-3 rounded-xl border transition-all ${shippingType === 'paid' ? 'border-primary text-primary bg-primary/10' : 'border-border text-foreground bg-muted hover:bg-muted/80'}`}
        >
          Paid
        </button>
      </div>

      {shippingType === 'paid' && (
        <InputField label="Shipping Cost (ETB) / KM" type="number" placeholder="0.00" />
      )}
    </SectionContainer>
  );
};

const MediaUpload = () => (
  <SectionContainer
    title="Media"
    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>}
  >
    <button type="button" className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-all group">
      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
      </div>
      <p className="text-sm font-bold text-foreground mb-1">Click to upload images</p>
      <p className="text-xs text-muted-foreground font-medium">SVG, PNG, JPG (max. 5MB)</p>
    </button>
  </SectionContainer>
);

const Organization = () => (
  <SectionContainer
    title="Organization"
    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>}
  >
    <SelectField label="Product Category" options={["Electronics", "Footwear", "Clothing", "Accessories", "Home & Living"]} />
  </SectionContainer>
);

const TechnicalDetails = () => (
  <SectionContainer
    title="Technical Details"
    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
  >
    <div className="grid grid-cols-2 gap-5 mb-5">
      <InputField label="Material" placeholder="e.g. Stoneware" />
      <InputField label="Origin" placeholder="e.g. Denmark" />
      <InputField label="Dimensions" placeholder="12 x 12 x 20cm" />
      <InputField label="Weight" placeholder="0.85 kg" />
    </div>
    <SelectField label="Delivery Time" options={["3 Days", "5 Days", ">5 Days"]} />
  </SectionContainer>
);

// === Main Component ===

const AddProduct = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div className="bg-background min-h-screen py-8 md:py-12 text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <ProductPreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        onPublish={() => console.log('Publish Live clicked')}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground mb-2">Add Product</h1>
            <p className="text-muted-foreground font-medium text-sm">Create a new exhibit for your Digital Atelier</p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" className="px-5 py-2.5 text-xs font-black tracking-widest uppercase rounded-xl text-primary hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/20">
              Save Draft
            </button>
            <button type="button" onClick={() => setIsPreviewOpen(true)} className="px-6 py-2.5 text-xs font-black tracking-widest uppercase rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm">
              Preview
            </button>
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left Column (Main Specs) */}
          <div className="lg:col-span-2">
            <BasicDetails />
            <Pricing />
            <Inventory />
            <Condition />
            <Shipping />
          </div>

          {/* Right Column (Sidebar Specs) */}
          <div className="lg:col-span-1">
            <MediaUpload />
            <Organization />
            <TechnicalDetails />

            {/* Requested Replaced Code block directly embedded */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="grid grid-cols-2 gap-2 border-t border-border pt-6">
                {[
                  { text: '30-Day Returns', icon: '/Icons/assignment_return.svg' },
                  { text: 'Secure Checkout', icon: '/Icons/verified.svg' }
                ].map((item, i) => (
                  <div key={item.text} className={`flex flex-col items-center gap-2 ${i === 0 ? 'border-r border-border px-2' : 'px-2'}`}>
                    <img
                      src={item.icon}
                      alt="item icon"
                      className="w-5 h-5"
                      style={{ filter: 'brightness(0) saturate(100%) invert(20%) sepia(90%) saturate(3000%) hue-rotate(240deg)' }}
                    />
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground text-center">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AddProduct;
