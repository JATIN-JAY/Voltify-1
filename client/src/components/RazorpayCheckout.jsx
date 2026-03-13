import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api';

const RazorpayCheckout = ({ cartItems, totalPrice, shippingInfo, user, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState('idle'); // idle, processing, verifying

  const handlePayment = async () => {
    console.log('🔵 Payment button clicked', {
      hasUser: !!user,
      hasCart: cartItems.length > 0,
      isLoading: loading,
      paymentStep,
    });

    if (!user) {
      console.warn('❌ No user logged in');
      onError('Please log in to continue');
      return;
    }

    if (cartItems.length === 0) {
      console.warn('❌ Cart is empty');
      onError('Cart is empty');
      return;
    }

    setLoading(true);
    setPaymentStep('processing');

    try {
      const token = localStorage.getItem('token');

      // Check if token exists (auth check)
      if (!token) {
        console.error('❌ No token in localStorage');
        throw new Error('No authentication token found. Please log in again.');
      }

      console.log('📤 Creating Razorpay order...');

      // Step 1: Create order in Razorpay (use api instance which handles auth headers)
      const orderResponse = await api.post(
        '/payment/create-order',
        {
          amount: totalPrice,
          items: cartItems,
          userEmail: shippingInfo.email,
          userName: shippingInfo.fullName,
          userPhone: shippingInfo.zipCode, // Using zipCode as placeholder for phone
        }
      );

      const { orderId, keyId } = orderResponse.data;

      console.log('✓ Razorpay order created:', { orderId, keyId });

      if (!orderId || !keyId) {
        throw new Error('Server did not return order details');
      }

      // Step 2: Load Razorpay script
      console.log('📥 Loading Razorpay script...');
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onerror = () => {
        console.error('❌ Failed to load Razorpay script');
        setLoading(false);
        setPaymentStep('idle');
        onError('Failed to load Razorpay. Please check your internet connection.');
      };
      script.onload = () => {
        console.log('✓ Razorpay script loaded');
        if (window.Razorpay) {
          console.log('🚀 Opening Razorpay checkout...');
          openRazorpayCheckout(orderId, keyId);
        } else {
          console.error('❌ Razorpay not available in window');
          setLoading(false);
          setPaymentStep('idle');
          onError('Razorpay script failed to load');
        }
      };
      document.body.appendChild(script);
    } catch (error) {
      setLoading(false);
      setPaymentStep('idle');
      console.error('❌ Payment error:', error);
      
      // Better error messaging
      let errorMessage = 'Failed to create payment order';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('Error message:', errorMessage);
      onError(errorMessage);
    }
  };

  const openRazorpayCheckout = (orderId, keyId) => {
    try {
      const options = {
        key: keyId,
        order_id: orderId,
        currency: 'INR',
        name: 'Voltify',
        description: 'Purchase from Voltify',
        image: 'https://via.placeholder.com/150x150?text=Voltify',
        prefill: {
          name: shippingInfo.fullName || '',
          email: shippingInfo.email || '',
          contact: shippingInfo.zipCode || '', // Phone number field
        },
        theme: {
          color: '#4f46e5', // Indigo color matching your brand
        },
        handler: async (response) => {
          // Step 3: Verify payment
          setPaymentStep('verifying');
          try {
            const verifyResponse = await api.post(
              '/payment/verify-payment',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                items: cartItems,
                amount: totalPrice,
                shippingInfo,
              }
            );

            setLoading(false);
            setPaymentStep('idle');
            onSuccess(verifyResponse.data);
          } catch (error) {
            setLoading(false);
            setPaymentStep('idle');
            console.error('Payment verification error:', error);
            
            // Better error messaging
            let errorMessage = 'Payment verification failed';
            if (error.response?.data?.message) {
              errorMessage = error.response.data.message;
            } else if (error.message) {
              errorMessage = error.message;
            }
            
            onError(errorMessage);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setPaymentStep('idle');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setLoading(false);
      setPaymentStep('idle');
      console.error('Razorpay checkout error:', error);
      onError('Failed to open payment gateway. Please try again.');
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handlePayment}
      disabled={loading || cartItems.length === 0}
      whileHover={!loading && cartItems.length > 0 ? { scale: 1.02 } : {}}
      whileTap={!loading && cartItems.length > 0 ? { scale: 0.98 } : {}}
      className={`relative w-full px-6 py-3.5 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 overflow-hidden group ${
        loading || cartItems.length === 0
          ? 'bg-slate-200 text-slate-500 cursor-not-allowed opacity-60'
          : 'bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:shadow-luxury active:scale-95'
      }`}
    >
      {/* Animated background for loading state */}
      {loading && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-800/80 animate-pulse"></div>
      )}
      
      <div className="relative flex items-center justify-center gap-2.5">
        {loading ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{paymentStep === 'verifying' ? 'Verifying...' : 'Processing...'}</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            <span>Proceed to Payment</span>
          </>
        )}
      </div>
    </motion.button>
  );
};

export default RazorpayCheckout;
