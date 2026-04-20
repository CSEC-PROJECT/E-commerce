import { useState, useEffect, useCallback } from 'react';
import { productsApi } from '../lib/apiClient';

export const useProducts = ({
  searchQuery,
  tabSearchQuery,
  categoryFilter,
  statusFilter,
  priceFilter,
  currentPage,
  itemsPerPage,
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Combine search queries
      const search = [searchQuery, tabSearchQuery].filter(Boolean).join(' ').trim();
      const category = categoryFilter !== 'All Categories' ? categoryFilter : undefined;
      const status = statusFilter !== 'Any Status' ? statusFilter : undefined;
      
      let minPrice, maxPrice;
      if (priceFilter !== 'Any Price') {
        if (priceFilter === 'Under $50') maxPrice = 50;
        else if (priceFilter === '$50 - $100') { minPrice = 50; maxPrice = 100; }
        else if (priceFilter === '$100 - $200') { minPrice = 100; maxPrice = 200; }
        else if (priceFilter === '$200 - $500') { minPrice = 200; maxPrice = 500; }
        else if (priceFilter === '$500+') minPrice = 500;
      }

      const response = await productsApi.getProducts({
        search: search || undefined,
        category,
        status,
        minPrice,
        maxPrice,
        page: currentPage,
        limit: itemsPerPage
      });

      setProducts(response.products || []);
      
      if (response.pages) {
        setTotalPages(response.pages);
      } else if (response.total !== undefined && response.limit !== undefined) {
        setTotalPages(Math.ceil(response.total / response.limit) || 1);
      } else {
        setTotalPages(1);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [
    searchQuery,
    tabSearchQuery,
    categoryFilter,
    statusFilter,
    priceFilter,
    currentPage,
    itemsPerPage
  ]);

  useEffect(() => {
    // 300ms debounce for search query typing
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const deleteProduct = async (id) => {
    try {
      await productsApi.deleteProduct(id);
      // Optimistically remove from UI
      setProducts(prev => prev.filter(p => (p._id || p.id) !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to delete product' };
    }
  };

  return {
    products,
    loading,
    error,
    totalPages,
    deleteProduct,
    refetch: fetchProducts
  };
};
