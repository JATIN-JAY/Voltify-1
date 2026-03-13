import { useState, useCallback, useMemo } from 'react';
import api from '../api';
import { useImageUpload } from './useImageUpload';

const INITIAL_FORM_STATE = {
  name: '',
  price: '',
  category: 'Mobiles',
  brand: '',
  description: '',
  imageUrl: '',
  featured: false,
};

const BRANDS_BY_CATEGORY = {
  Mobiles: ['Apple', 'Samsung', 'Google Pixel', 'OnePlus', 'Xiaomi', 'iQOO', 'Motorola'],
  Tablets: ['Apple', 'Samsung', 'OnePlus', 'Lenovo', 'iPad', 'Huawei'],
  Audio: ['Apple', 'Samsung', 'Sony', 'JBL', 'Boat', 'Beats', 'Sennheiser'],
  'Phone Case': ['Spigen', 'OtterBox', 'Anker', 'Belkin', 'Samsung'],
  Accessories: ['Anker', 'Belkin', 'Samsung', 'Spigen', 'OtterBox'],
};

/**
 * Custom hook for managing product form state and submission
 * Encapsulates form logic, validation, and API interactions
 */
export const useProductForm = (onProductCreated) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { imagePreview, uploading, error: uploadError, uploadImage, clearImage, setError: setUploadError } = useImageUpload();

  const token = localStorage.getItem('token');

  // Memoized brands for current category
  const availableBrands = useMemo(() => {
    return BRANDS_BY_CATEGORY[formData.category] || [];
  }, [formData.category]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      // Reset brand when category changes
      ...(name === 'category' && { brand: '' }),
    }));
  }, []);

  const handleImageUpload = useCallback(async (file) => {
    const imageUrl = await uploadImage(file);
    if (imageUrl) {
      setFormData((prev) => ({ ...prev, imageUrl }));
      setMessage({ type: 'success', text: 'Image uploaded successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  }, [uploadImage]);

  const validateForm = useCallback(() => {
    const required = ['name', 'price', 'category', 'brand', 'description', 'imageUrl'];
    const missing = required.filter((field) => !formData[field]);
    
    if (missing.length > 0) {
      return 'Please fill in all required fields';
    }
    return null;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setMessage({ type: '', text: '' });

      const validationError = validateForm();
      if (validationError) {
        setMessage({ type: 'error', text: validationError });
        return;
      }

      setLoading(true);

      try {
        const response = await api.post('/products', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMessage({ type: 'success', text: 'Product created successfully!' });
        setFormData(INITIAL_FORM_STATE);
        clearImage();

        if (onProductCreated) {
          onProductCreated(response.data.product);
        }

        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Failed to create product';
        setMessage({ type: 'error', text: errorMsg });
      } finally {
        setLoading(false);
      }
    },
    [formData, validateForm, token, onProductCreated, clearImage]
  );

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    clearImage();
    setMessage({ type: '', text: '' });
  }, [clearImage]);

  return {
    formData,
    handleInputChange,
    handleImageUpload,
    handleSubmit,
    resetForm,
    loading,
    uploading,
    message,
    imagePreview,
    uploadError,
    setUploadError,
    availableBrands,
  };
};
