import { useState, useCallback } from 'react';
import api from '../api';

/**
 * Custom hook for image upload via backend to Cloudinary
 * Handles file upload, preview, and error states
 */
export const useImageUpload = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const uploadImage = useCallback(async (file) => {
    if (!file) return null;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const response = await api.post('/products/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      const imageUrl = response.data.imageUrl;
      setImagePreview(imageUrl);
      return imageUrl;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to upload image. Please try again.';
      setError(errorMsg);
      console.error(err);
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  const clearImage = useCallback(() => {
    setImagePreview(null);
    setError('');
  }, []);

  return { imagePreview, uploading, error, uploadImage, clearImage, setError };
};
