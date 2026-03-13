import { useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { CartContext } from '../context/CartContext';

/**
 * Custom hook for managing login form state and submission
 * Encapsulates all login logic: form state, validation, API calls, error handling
 * 
 * @returns {Object} Login form state and handlers
 */
export const useLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();
  const { loginUser } = useContext(CartContext);

  // Handle input changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      console.log('📤 Attempting to login...');
      const response = await api.post('/auth/login', formData);
      
      console.log('✓ Login response received:', {
        hasToken: !!response.data.token,
        hasUser: !!response.data.user,
        tokenLength: response.data.token?.length,
      });

      if (!response.data.token) {
        throw new Error('Server did not return authentication token');
      }

      const userData = {
        ...response.data.user,
        token: response.data.token,
      };
      
      console.log('📝 Calling loginUser with userData...');
      loginUser(userData);
      
      setMessage({ type: 'success', text: 'Login successful!' });
      
      // Redirect to admin dashboard if user is admin, otherwise to home
      const redirectPath = userData.isAdmin ? '/admin' : '/';
      setTimeout(() => navigate(redirectPath), 500);
    } catch (err) {
      console.error('❌ Login error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  }, [formData, loginUser, navigate]);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setFormData({ email: '', password: '' });
    setShowPassword(false);
    setMessage({ type: '', text: '' });
  }, []);

  return {
    formData,
    handleInputChange,
    showPassword,
    togglePasswordVisibility,
    loading,
    message,
    handleSubmit,
    resetForm,
  };
};
