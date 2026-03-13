import { useState, useContext, useCallback } from 'react';
import { CartContext } from '../context/CartContext';

/**
 * Custom hook for managing user profile editing
 * Encapsulates form state, validation, and submission logic
 * 
 * @returns {Object} Profile state and handlers
 */
export const useProfile = () => {
  const { user, loginUser } = useContext(CartContext);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [draft, setDraft] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  // Handle field changes
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Start editing mode
  const startEditing = useCallback(() => {
    setDraft({
      name: user?.name || '',
      phone: user?.phone || '',
    });
    setEditing(true);
    setMessage({ type: '', text: '' });
  }, [user]);

  // Cancel editing
  const cancelEditing = useCallback(() => {
    setDraft({
      name: user?.name || '',
      phone: user?.phone || '',
    });
    setEditing(false);
    setMessage({ type: '', text: '' });
  }, [user]);

  // Validate form
  const validateForm = useCallback(() => {
    if (!draft.name.trim()) {
      setMessage({ type: 'error', text: 'Name cannot be empty' });
      return false;
    }
    if (!draft.phone.trim()) {
      setMessage({ type: 'error', text: 'Phone number cannot be empty' });
      return false;
    }
    return true;
  }, [draft]);

  // Save profile
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!validateForm()) return;

    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const updatedUser = {
        ...(user || {}),
        name: draft.name,
        phone: draft.phone,
      };
      if (token) updatedUser.token = token;
      
      loginUser(updatedUser);
      setEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  }, [user, draft, loginUser, validateForm]);

  return {
    user,
    editing,
    saving,
    message,
    draft,
    handleInputChange,
    startEditing,
    cancelEditing,
    handleSubmit,
  };
};
