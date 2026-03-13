import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { CartContext } from '../context/CartContext';

/**
 * Custom hook for admin dashboard operations
 * Manages products, sales data, and admin actions
 * 
 * @returns {Object} Admin state and action handlers
 */
export const useAdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(CartContext);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [salesSummary, setSalesSummary] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  const token = localStorage.getItem('token');

  // Auth check
  useEffect(() => {
    if (!user || (!user.isAdmin && user.email !== 'admin@voltify.com')) {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data);
      setMessage({ type: '', text: '' });
    } catch (err) {
      console.error('Products fetch error:', err);
      setMessage({ type: 'error', text: 'Failed to load products' });
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch sales summary
  const fetchSalesSummary = useCallback(async () => {
    try {
      const response = await api.get('/orders/admin/summary', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSalesSummary(response.data);
    } catch (err) {
      console.error('Sales summary error:', err);
      setSalesSummary(null);
    }
  }, [token]);

  // Initial data load
  useEffect(() => {
    if (user?.isAdmin || user?.email === 'admin@voltify.com') {
      fetchProducts();
      fetchSalesSummary();
    }
  }, [user, fetchProducts, fetchSalesSummary]);

  // Add new product to list
  const handleProductCreated = useCallback((newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    setMessage({ type: 'success', text: 'Product created successfully!' });
  }, []);

  // Toggle featured status
  const toggleFeatured = useCallback(async (productId, currentFeaturedStatus) => {
    try {
      await api.put(
        `/products/${productId}`,
        { featured: !currentFeaturedStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId ? { ...p, featured: !currentFeaturedStatus } : p
        )
      );
      setMessage({ type: 'success', text: 'Product updated' });
    } catch (err) {
      console.error('Toggle featured error:', err);
      setMessage({ type: 'error', text: 'Failed to update product' });
    }
  }, [token]);

  // Delete product
  const deleteProduct = useCallback(async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      setDeleteLoading(productId);
      await api.delete(`/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts((prev) => prev.filter((p) => p._id !== productId));
      setMessage({ type: 'success', text: 'Product deleted successfully' });
    } catch (err) {
      console.error('Delete error:', err);
      setMessage({ type: 'error', text: 'Failed to delete product' });
    } finally {
      setDeleteLoading(null);
    }
  }, [token]);

  return {
    user,
    products,
    loading,
    message,
    salesSummary,
    deleteLoading,
    handleProductCreated,
    toggleFeatured,
    deleteProduct,
  };
};
