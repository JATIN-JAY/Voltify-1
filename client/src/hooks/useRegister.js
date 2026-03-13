import { useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { CartContext } from '../context/CartContext';

/**
 * Custom hook for managing registration form state and submission
 * Encapsulates all registration logic: form state, validation, API calls, error handling
 * 
 * @returns {Object} Registration form state and handlers
 */
export const useRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  // Validate form data
  const validateForm = useCallback(() => {
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Name is required' });
      return false;
    }
    if (!formData.email.trim()) {
      setMessage({ type: 'error', text: 'Email is required' });
      return false;
    }
    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return false;
    }
    return true;
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const userData = {
        ...response.data.user,
        token: response.data.token,
      };
      loginUser(userData);
      setMessage({ type: 'success', text: 'Registration successful! Redirecting...' });
      // Redirect to admin dashboard if user is admin, otherwise to home
      const redirectPath = userData.isAdmin ? '/admin' : '/';
      setTimeout(() => navigate(redirectPath), 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, loginUser, navigate]);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setMessage({ type: '', text: '' });
  }, []);

  return {
    formData,
    handleInputChange,
    showPassword,
    togglePasswordVisibility,
    showConfirmPassword,
    toggleConfirmPasswordVisibility,
    loading,
    message,
    handleSubmit,
    resetForm,
  };
};
