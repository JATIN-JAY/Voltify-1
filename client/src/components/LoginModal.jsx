import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useLogin } from '../hooks';
import { Card, Input, Button, Alert } from './shared';
import { ModalContext } from '../context/ModalContext';

/**
 * LoginModal Component - Popup modal for user login
 * Uses useLogin hook for form logic and state management
 */
export default function LoginModal() {
  const { openModals, closeModal, switchModal } = useContext(ModalContext);
  const {
    formData,
    handleInputChange,
    showPassword,
    togglePasswordVisibility,
    loading,
    message,
    handleSubmit: handleLoginSubmit,
  } = useLogin();

  const isOpen = openModals.login;

  // Handle Google login response
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Send credential to backend
      const response = await axios.post('http://localhost:5004/api/auth/google/signin', {
        token: credentialResponse.credential
      });

      if (response.data.token) {
        // Store JWT token (use 'token' key to match CartContext convention)
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Close modal and redirect
        closeModal('login');
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleGoogleError = () => {
    console.log('Google Login Failed');
  };

  const handleSubmit = async (e) => {
    await handleLoginSubmit(e);
    // Close modal on successful login - the hook handles this
    if (!message.text || message.type === 'success') {
      closeModal('login');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => closeModal('login')}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <motion.div
              className="relative w-full max-w-md bg-voltify-dark rounded-2xl shadow-2xl border border-voltify-border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => closeModal('login')}
                className="absolute top-4 right-4 z-10 p-2 text-voltify-light/50 hover:text-voltify-light hover:bg-voltify-dark/50 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="p-8 space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <h1 className="text-3xl font-black tracking-tight text-voltify-light">Welcome Back</h1>
                  <p className="text-voltify-light/60">Access your Voltify account</p>
                </div>

                {message.text && (
                  <Alert 
                    type={message.type} 
                    message={message.text}
                  />
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    required
                  />

                  <div>
                    <label className="block text-sm font-semibold text-voltify-light mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        required
                        containerClassName="mb-0"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-voltify-light/50 hover:text-voltify-light focus:outline-none transition"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                            <path d="M15.171 13.576l1.414 1.414A1 1 0 0016.586 16a1 1 0 001.414-1.414l-1.414-1.414" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    variant="primary"
                    size="md"
                    className="w-full"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                                {/* Google Auth Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-voltify-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-voltify-dark text-voltify-light/60">Or continue with</span>
                  </div>
                </div>

                {/* Google Sign In Button */}
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap
                  />
                </div>

                {/* Footer */}
                <div className="space-y-4 border-t border-voltify-border pt-6">
                  <p className="text-sm text-voltify-light/60">
                    Don't have an account?{' '}
                    <button
                      onClick={() => switchModal('login', 'signup')}
                      className="text-voltify-gold font-bold hover:text-yellow-500 transition-colors"
                    >
                      Create one
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
