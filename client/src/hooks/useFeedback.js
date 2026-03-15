import { useState, useEffect } from 'react';
import api from '../api';

export const useFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeedbacks = async (status = 'All', sortBy = 'newest') => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Not authenticated');
        return;
      }

      const query = new URLSearchParams();
      if (status !== 'All') query.append('status', status);
      query.append('sortBy', sortBy);

      const response = await api.get(
        `/feedback/admin/all?${query.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setFeedbacks(response.data.feedbacks || []);
      } else {
        setError(response.data.message || 'Failed to fetch feedbacks');
      }
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await api.get(
        `/feedback/admin/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error('Error fetching feedback stats:', err);
    }
  };

  const updateFeedback = async (id, updates) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await api.put(
        `/feedback/admin/${id}`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Refresh feedbacks
        fetchFeedbacks();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating feedback:', err);
      return false;
    }
  };

  const deleteFeedback = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await api.delete(
        `/feedback/admin/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setFeedbacks(feedbacks.filter(f => f._id !== id));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting feedback:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    fetchStats();
  }, []);

  return {
    feedbacks,
    stats,
    loading,
    error,
    fetchFeedbacks,
    fetchStats,
    updateFeedback,
    deleteFeedback
  };
};
