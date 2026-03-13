import React, { createContext, useState, useCallback } from 'react';
import api from '../api';

export const GoogleAuthContext = createContext();

export function GoogleAuthProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = useCallback(async (credential) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/google/signin', {
        token: credential
      });

      // Store token and user
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Google auth failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <GoogleAuthContext.Provider value={{ handleGoogleLogin, loading, error }}>
      {children}
    </GoogleAuthContext.Provider>
  );
}
