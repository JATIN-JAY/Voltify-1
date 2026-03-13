import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleAuthContext } from '../context/GoogleAuthContext';
import { useLogin } from '../hooks';
import { Card, Input, Button, Alert } from '../components/shared';

/**
 * LoginPage Component - Refactored with shared UI components
 * Uses useLogin hook for all form logic and state management
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const { handleGoogleLogin } = useContext(GoogleAuthContext);
  const {
    formData,
    handleInputChange,
    showPassword,
    togglePasswordVisibility,
    loading,
    message,
    handleSubmit,
  } = useLogin();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const result = await handleGoogleLogin(credentialResponse.credential);
      // Redirect to admin dashboard if user is admin, otherwise to home
      const redirectPath = result.user?.isAdmin ? '/admin' : '/';
      navigate(redirectPath);
    } catch (err) {
      console.error('Google login failed:', err);
    }
  };

  const handleGoogleError = () => {
    console.log('Google login failed');
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 pt-20 px-4 flex items-center justify-center relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-slate-200/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-200/30 rounded-full blur-3xl"></div>
      
      <motion.div 
        className="w-full max-w-md relative z-10"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
      >
        <Card className="bg-white border-slate-100">
          <Card.Body className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Welcome Back</h1>
              <p className="text-slate-600">Access your Voltify account</p>
=======
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-apple-lg p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600">Log in to your Voltify account</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
>>>>>>> d640514180f76c3456a769d97429584aaf1125bc
            </div>

            {message.text && (
              <Alert 
                type={message.type} 
                message={message.text}
              />
            )}

            {/* Google Sign-In Button */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">
                Quick Login
              </label>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="signin_with"
                width="100%"
                theme="outline"
                locale="en"
              />
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with email</span>
              </div>
            </div>

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
                <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-600 hover:text-slate-900 focus:outline-none transition"
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
                variant="primary"
                size="md"
                isLoading={loading}
                className="w-full"
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <p className="text-center text-slate-600 text-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-slate-900 hover:text-slate-700 transition"
              >
                Sign up
              </Link>
            </p>
          </Card.Body>
        </Card>
      </motion.div>
    </div>
  );
}
