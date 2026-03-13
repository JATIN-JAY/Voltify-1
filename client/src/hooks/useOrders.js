import { useState, useEffect, useContext } from 'react';
import api from '../api';
import { CartContext } from '../context/CartContext';

/**
 * Custom hook for fetching and managing user orders
 * Encapsulates API calls, loading state, and error handling
 * 
 * @returns {Object} Orders state and utilities
 */
export const useOrders = () => {
  const { user } = useContext(CartContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await api.get('/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data || []);
        setMessage({ type: '', text: '' });
      } catch (err) {
        console.error('Orders fetch error:', err);
        setMessage({
          type: 'error',
          text: 'Failed to load orders. Please try again.',
        });
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  return {
    user,
    orders,
    loading,
    message,
  };
};
