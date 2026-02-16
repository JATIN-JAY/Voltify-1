import React, { useState } from 'react';
import api from '../api';

const RazorpayCheckout = ({ cartItems, totalPrice, shippingInfo, user, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      onError('Please log in to continue');
      return;
    }

    if (cartItems.length === 0) {
      onError('Cart is empty');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      // Step 1: Create order in Razorpay
      const orderResponse = await api.post(
        '/payment/create-order',
        {
          amount: totalPrice,
          items: cartItems,
          userEmail: shippingInfo.email,
          userName: shippingInfo.fullName,
          userPhone: shippingInfo.zipCode, // Using zipCode as placeholder for phone
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { orderId, keyId } = orderResponse.data;

      if (!orderId || !keyId) {
        throw new Error('Server did not return order details');
      }

      // Step 2: Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onerror = () => {
        setLoading(false);
        onError('Failed to load Razorpay. Please check your internet connection.');
      };
      script.onload = () => {
        if (window.Razorpay) {
          openRazorpayCheckout(orderId, keyId, token);
        } else {
          setLoading(false);
          onError('Razorpay script failed to load');
        }
      };
      document.body.appendChild(script);
    } catch (error) {
      setLoading(false);
      console.error('Payment error:', error);
      onError(error.response?.data?.message || error.message || 'Failed to create payment order');
    }
  };

  const openRazorpayCheckout = (orderId, keyId, token) => {
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
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            setLoading(false);
            onSuccess(verifyResponse.data);
          } catch (error) {
            setLoading(false);
            console.error('Payment verification error:', error);
            onError(error.response?.data?.message || 'Payment verification failed');
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setLoading(false);
      console.error('Razorpay checkout error:', error);
      onError('Failed to open payment gateway. Please try again.');
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading || cartItems.length === 0}
      className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
    >
      {loading ? 'Processing...' : '💳 Pay with Razorpay'}
    </button>
  );
};

export default RazorpayCheckout;
