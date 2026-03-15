import { useState, useCallback, useMemo, useEffect } from 'react';
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
 * Supports both creating new products and editing existing ones
 * Encapsulates form logic, validation, and API interactions
 */
export const useProductForm = (onProductCreated, productToEdit = null) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { imagePreview, uploading, error: uploadError, uploadImage, clearImage, setError: setUploadError } = useImageUpload();
  const [isEditing] = useState(!!productToEdit);

  const token = localStorage.getItem('token');

  // Initialize form with product data when editing
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || '',
        price: productToEdit.price || '',
        category: productToEdit.category || 'Mobiles',
        brand: productToEdit.brand || '',
        description: productToEdit.description || '',
        imageUrl: productToEdit.image || '',
        featured: productToEdit.featured || false,
      });
    }
  }, [productToEdit]);

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
    // Check if image is still uploading
    if (uploading) {
      return 'Please wait for image upload to complete';
    }

    // Individual field validation with trimming
    const errors = [];

    // Name validation
    if (!formData.name || !formData.name.trim()) {
      errors.push('Product name is required');
    }

    // Price validation - allow 0, must not be empty string
    if (formData.price === '' || formData.price === null || formData.price === undefined) {
      errors.push('Price is required');
    } else if (Number(formData.price) < 0) {
      errors.push('Price cannot be negative');
    }

    // Category validation
    if (!formData.category || !formData.category.trim()) {
      errors.push('Category is required');
    }

    // Brand validation
    if (!formData.brand || !formData.brand.trim()) {
      errors.push('Brand is required');
    }

    // Description validation
    if (!formData.description || !formData.description.trim()) {
      errors.push('Description is required');
    }

    // Image validation
    if (!formData.imageUrl || !formData.imageUrl.trim()) {
      errors.push('Product image is required');
    }

    if (errors.length > 0) {
      return errors.join('. ');
    }

    return null;
  }, [formData, uploading]);

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
        let response;
        
        if (isEditing && productToEdit) {
          // Update existing product
          response = await api.put(`/products/${productToEdit._id}`, formData, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMessage({ type: 'success', text: 'Product updated successfully!' });
        } else {
          // Create new product
          response = await api.post('/products', formData, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMessage({ type: 'success', text: 'Product created successfully!' });
          setFormData(INITIAL_FORM_STATE);
          clearImage();
        }

        if (onProductCreated) {
          onProductCreated(response.data.product);
        }

        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } catch (err) {
        const errorMsg = err.response?.data?.message || (isEditing ? 'Failed to update product' : 'Failed to create product');
        setMessage({ type: 'error', text: errorMsg });
      } finally {
        setLoading(false);
      }
    },
    [formData, validateForm, token, onProductCreated, clearImage, isEditing, productToEdit]
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
    isEditing,
  };
};
