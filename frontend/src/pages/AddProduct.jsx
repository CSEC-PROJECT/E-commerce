import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductPreviewModal from './ProductPreview';
import { useProductStore } from '../store/productStore';
import { useToastStore } from '../store/toastStore';

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

const InputField = ({ label, type = "text", placeholder, as = "input", rows, name, value, onChange }) => (
  <div className="mb-5 last:mb-0">
    <label className="block text-[11px] font-black tracking-widest text-foreground uppercase mb-2">
      {label}
    </label>
    {as === "textarea" ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows || 4}
        className="w-full bg-muted text-foreground border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm placeholder:text-muted-foreground resize-none"
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-muted text-foreground border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm placeholder:text-muted-foreground"
      />
    )}
  </div>
);

const SelectField = ({ label, options, name, value, onChange }) => (
  <div className="mb-5 last:mb-0">
    <label className="block text-[11px] font-black tracking-widest text-foreground uppercase mb-2">
      {label}
    </label>
    <div className="relative">
      <select name={name} value={value} onChange={onChange} className="w-full bg-muted text-foreground border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm appearance-none cursor-pointer font-medium hover:bg-muted/80">
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

const BasicDetails = ({ formData, handleChange }) => (
  <SectionContainer
    title="Basic Details"
    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>}
  >
    <InputField name="name" value={formData.name} onChange={handleChange} label="Product Name" placeholder="e.g. Lumina Sculptural Object" />
    <InputField name="description" value={formData.description} onChange={handleChange} label="Description" placeholder="Detailed product description..." as="textarea" />
  </SectionContainer>
);

const Pricing = ({ formData, handleChange }) => (
  <SectionContainer
    title="Pricing"
    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" /></svg>}
  >
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <InputField name="price" value={formData.price} onChange={handleChange} label="Price ($)" type="number" placeholder="0.00" />
      <InputField name="comparePrice" value={formData.comparePrice} onChange={handleChange} label="Compare at Price ($)" type="number" placeholder="0.00" />
    </div>
  </SectionContainer>
);

const Inventory = ({ formData, handleChange }) => (
  <SectionContainer
    title="Inventory"
    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>}
  >
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <InputField name="stock" value={formData.stock} onChange={handleChange} label="Stock Quantity" type="number" placeholder="e.g. 100" />
      <SelectField name="stockStatus" value={formData.stockStatus} onChange={handleChange} label="Stock Status" options={["In Stock", "Limited Stock", "Out of Stock"]} />
    </div>
  </SectionContainer>
);

const Condition = ({ formData, handleChange }) => (
  <SectionContainer
    title="Condition"
    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
  >
    <SelectField name="status" value={formData.status} onChange={handleChange} label="Item Condition" options={["new", "slightly used", "used"]} />
  </SectionContainer>
);

const Shipping = ({ formData, handleChange }) => {
  return (
    <SectionContainer
      title="Shipping"
      icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>}
    >
      <div className="flex gap-4 mb-5">
        <button
          type="button"
          onClick={() => handleChange({ target: { name: 'shippingType', value: 'free' } })}
          className={`flex-1 text-[11px] font-black tracking-widest uppercase py-3 rounded-xl border transition-all ${formData.shippingType === 'free' ? 'border-primary text-primary bg-primary/10' : 'border-border text-foreground bg-muted hover:bg-muted/80'}`}
        >
          Free
        </button>
        <button
          type="button"
          onClick={() => handleChange({ target: { name: 'shippingType', value: 'paid' } })}
          className={`flex-1 text-[11px] font-black tracking-widest uppercase py-3 rounded-xl border transition-all ${formData.shippingType === 'paid' ? 'border-primary text-primary bg-primary/10' : 'border-border text-foreground bg-muted hover:bg-muted/80'}`}
        >
          Paid
        </button>
      </div>

      {formData.shippingType === 'paid' && (
        <InputField name="shippingCost" value={formData.shippingCost} onChange={handleChange} label="Shipping Cost (ETB) / KM" type="number" placeholder="0.00" />
      )}
    </SectionContainer>
  );
};

const MediaUpload = ({ coverImage, setCoverImage, detailImages, setDetailImages, isEditing, formData }) => {
  const [isOn, setIsOn] = useState(false);

  // Derive existing image states
  const hasExistingCover = isEditing && !!formData?.coverImageURL;

  return (
    <SectionContainer
      title="Media"
      icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>}
    >
      <div className="space-y-4">
        <div className="relative">
          <input type="file" id="coverImage" className="hidden" accept="image/*" onChange={(e) => setCoverImage(e.target.files[0])} />
          <button onClick={() => document.getElementById('coverImage').click()} type="button" className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-all group">
            {coverImage ? (
              <p className="text-sm font-bold text-foreground mb-1">Selected: {coverImage.name}</p>
            ) : hasExistingCover ? (
              <>
                <img src={formData.coverImageURL} alt="Current cover" className="w-16 h-16 object-cover rounded-md mb-2 border border-border" />
                <p className="text-sm font-bold text-foreground mb-1">Click to replace existing cover image</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                </div>
                <p className="text-sm font-bold text-foreground mb-1">Click to upload cover image</p>
                <p className="text-xs text-muted-foreground font-medium">SVG, PNG, JPG (max. 5MB)</p>
              </>
            )}
          </button>
        </div>

        <div className="flex justify-center">
          <button 
            type="button"
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold transition-all border rounded-lg ${isOn ? 'text-primary border-primary bg-primary/10' : 'text-muted-foreground border-border'}`}
            onClick={() => setIsOn(!isOn)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            {isOn ? 'Hide Details' : 'Add Detail Images'}
          </button>
        </div>
        
        {isOn && (
          <AddDetailImages detailImages={detailImages} setDetailImages={setDetailImages} />
        )}
      </div>
    </SectionContainer>
  );
};

const AddDetailImages = ({ detailImages, setDetailImages }) => {
  const handleDetailImageChange = (e, i) => {
    const newFiles = [...detailImages];
    newFiles[i] = e.target.files[0];
    setDetailImages(newFiles);
  };

  const addImagesComponent = []
  for (let i=0; i < 3; i++){
    addImagesComponent.push(
      <div key={`detail-image-${i}`} className="relative mb-2">
        <input type="file" id={`detailImage${i}`} className="hidden" accept="image/*" onChange={(e) => handleDetailImageChange(e, i)} />
        <button onClick={() => document.getElementById(`detailImage${i}`).click()} type="button" className="w-full border-2 border-dashed border-border rounded-xl p-3 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-all group">
          {detailImages[i] ? (
             <p className="text-xs font-bold text-foreground mb-1">Selected: {detailImages[i].name}</p>
          ) : (
            <>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              </div>
              <p className="text-sm font-bold text-foreground mb-1">Upload detail image</p>
            </>
          )}
        </button>
      </div>
    )
  }

  return addImagesComponent
}

const Organization = ({ formData, handleChange }) => (
  <SectionContainer
    title="Organization"
    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>}
  >
    <SelectField name="category" value={formData.category} onChange={handleChange} label="Product Category" options={["Electronics", "Footwear", "Clothing", "Accessories", "Home & Living"]} />
  </SectionContainer>
);

const TechnicalDetails = ({ formData, handleChange }) => (
  <SectionContainer
    title="Technical Details"
    icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
  >
    <div className="grid grid-cols-2 gap-5 mb-5">
      <InputField name="material" value={formData.material} onChange={handleChange} label="Material" placeholder="e.g. Stoneware" />
      <InputField name="madeIn" value={formData.madeIn} onChange={handleChange} label="Origin" placeholder="e.g. Denmark" />
      <InputField name="dimensions" value={formData.dimensions} onChange={handleChange} label="Dimensions" placeholder="12 x 12 x 20cm" />
      <InputField name="weight" value={formData.weight} onChange={handleChange} label="Weight" placeholder="0.85 kg" />
    </div>
    <SelectField name="deliveryTime" value={formData.deliveryTime} onChange={handleChange} label="Delivery Time" options={["3 Days", "5 Days", ">5 Days"]} />
  </SectionContainer>
);

// === Main Component ===

const DRAFT_KEY = 'addProduct_draft';

const defaultFormData = {
  name: '',
  description: '',
  price: '',
  comparePrice: '',
  stock: '',
  stockStatus: 'In Stock',
  status: 'new',
  shippingType: 'free',
  shippingCost: '',
  category: 'Electronics',
  material: '',
  madeIn: '',
  dimensions: '',
  weight: '',
  deliveryTime: '3 Days'
};

const AddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { createProduct, updateProduct, fetchProductById } = useProductStore();
  const { addToast } = useToastStore();

  const [formData, setFormData] = useState(defaultFormData);
  const [coverImage, setCoverImage] = useState(null);
  const [detailImages, setDetailImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const isEditing = !!id;

  // ── Retrieve Existing Product or Restore Draft ─────────────────────────────
  useEffect(() => {
    if (isEditing) {
      const getProduct = async () => {
        try {
          const prod = await fetchProductById(id);
          if (prod) {
            setFormData({
              name: prod.name || '',
              description: prod.description || '',
              price: prod.price || '',
              comparePrice: prod.comparePrice || '',
              stock: prod.stock || '',
              stockStatus: prod.stockStatus || 'In Stock',
              status: prod.status || 'new',
              shippingType: prod.shippingType || 'free',
              shippingCost: prod.shippingCost || '',
              category: prod.category || 'Electronics',
              material: prod.material || '',
              madeIn: prod.madeIn || '',
              dimensions: prod.dimensions || '',
              weight: prod.weight || '',
              deliveryTime: prod.deliveryTime || '3 Days',
              coverImageURL: prod.coverImage || prod.img || ''
            });
            // Not setting images here, user will have to re-upload if they want to change them.
          }
        } catch (err) {
          addToast('Failed to load product details.', 'error');
        }
      };
      getProduct();
    } else {
      try {
        const saved = localStorage.getItem(DRAFT_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setFormData(prev => ({ ...prev, ...parsed }));
          addToast('Draft restored — continue where you left off.', 'info');
        }
      } catch {
        // ignore corrupt data
      }
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ── Save Draft ──────────────────────────────────────────────────────────────
  const handleSaveDraft = () => {
    if (isEditing) return; // Disable draft when editing
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
      addToast('Draft saved! Your progress has been stored locally.', 'success');
    } catch {
      addToast('Could not save draft. Storage may be full.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.stock) {
      alert("Please fill all required fields: name, description, price, stock, category.");
      return;
    }
    
    // Cover image is required only when creating new product
    if (!isEditing && !coverImage) {
      alert("Please upload a cover image.");
      return;
    }
    
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      if (coverImage) data.append('coverImage', coverImage);
      
      detailImages.forEach(img => {
        if (img) data.append('detailImages', img);
      });

      if (isEditing) {
        await updateProduct(id, data);
        addToast('Product updated successfully!', 'success');
        navigate('/admin/products');
      } else {
        await createProduct(data);
        localStorage.removeItem(DRAFT_KEY);
        addToast('Product published successfully!', 'success');
        navigate('/admin/products');
      }
    } catch (error) {
      console.error(error);
      addToast(error.message || `Failed to ${isEditing ? 'update' : 'create'} product`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen py-8 md:py-12 text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <ProductPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onPublish={() => document.querySelector('form')?.requestSubmit()}
        formData={formData}
        coverImage={coverImage}
        isEditing={isEditing}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-foreground mb-2">{isEditing ? 'Edit Product' : 'Add Product'}</h1>
            <p className="text-muted-foreground font-medium text-sm">{isEditing ? 'Update details of your existing product' : 'Create a new exhibit for your Digital Atelier'}</p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => navigate('/admin/products')} className="px-5 py-2.5 text-xs font-black tracking-widest uppercase rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-transparent hover:border-border/50">
              Back to Products
            </button>
            {!isEditing && (
              <button type="button" onClick={handleSaveDraft} className="px-5 py-2.5 text-xs font-black tracking-widest uppercase rounded-xl text-primary hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/20">
                Save Draft
              </button>
            )}
            <button type="button" onClick={() => setIsPreviewOpen(true)} className="px-6 py-2.5 text-xs font-black tracking-widest uppercase rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm">
              {isEditing ? 'Preview Edit' : 'Preview'}
            </button>
            <button type="submit" disabled={loading} onClick={() => document.querySelector('form')?.requestSubmit()} className="cursor-pointer px-6 py-2.5 text-xs font-black tracking-widest uppercase rounded-xl border border-primary text-primary hover:bg-primary/5 transition-all shadow-sm">
              {loading ? "Publishing..." : isEditing ? 'Publish Edit' : 'Publish Product'}
            </button>
          </div>
        </div>

        {/* Layout */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Left Column (Main Specs) */}
          <div className="lg:col-span-2">
            <BasicDetails formData={formData} handleChange={handleChange} />
            <Pricing formData={formData} handleChange={handleChange} />
            <Inventory formData={formData} handleChange={handleChange} />
            <Condition formData={formData} handleChange={handleChange} />
            <Shipping formData={formData} handleChange={handleChange} />
          </div>

          {/* Right Column (Sidebar Specs) */}
          <div className="lg:col-span-1">
            <MediaUpload coverImage={coverImage} setCoverImage={setCoverImage} detailImages={detailImages} setDetailImages={setDetailImages} isEditing={isEditing} formData={formData} />
            <Organization formData={formData} handleChange={handleChange} />
            <TechnicalDetails formData={formData} handleChange={handleChange} />

            {/* Requested Replaced Code block directly embedded */}
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
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
            
            <button disabled={loading} type="submit" className="w-full px-6 py-4 text-sm font-black tracking-widest uppercase rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50">
              {loading ? "Publishing..." : isEditing ? "Publish Edit" : "Publish Product"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default AddProduct;
