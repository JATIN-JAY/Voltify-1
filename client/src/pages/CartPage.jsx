import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import { Button, Alert, Card } from '../components/shared';
import RazorpayCheckout from '../components/RazorpayCheckout';

/**
 * CartPage Component - Refactored with shared UI components
 * Uses shared Button, Alert, and Card components for consistent styling
 */
export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, user } = useContext(CartContext);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    zipCode: '',
  });
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const navigate = useNavigate();

  const totalPrice = getTotalPrice();

  // Scroll to top when cart page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Debug cart items
  useEffect(() => {
    console.log('🛒 Cart items loaded:', cartItems.map(item => ({
      id: item._id,
      name: item.name,
      hasImage: !!item.image,
      imageUrl: item.image
    })));
  }, [cartItems]);

  // Auto-clear errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentSuccess = async (response) => {
    try {
      setOrderId(response.order._id);
      setOrderSuccess(true);
    } catch (error) {
      setError('Error processing order after payment');
    }
  };

  const handlePaymentError = (errorMsg) => {
    setError(errorMsg);
  };

  const handleContinueShopping = () => {
    setOrderSuccess(false);
    setOrderId('');
    navigate('/');
  };

  // Empty Cart View
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-24 pb-12">
        <motion.div 
          className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.svg 
            className="w-24 h-24 mx-auto text-slate-300 mb-6"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </motion.svg>
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">Cart is Empty</h2>
          <p className="text-slate-600 text-lg mb-8">Discover amazing tech products and start your shopping experience.</p>
          <Button variant="primary" size="lg" onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </motion.div>
      </div>
    );
  }

  // Order Success Modal
  if (orderSuccess) {
    return (
      <motion.div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center space-y-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          {/* Success Icon */}
          <motion.div 
            className="flex justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-100 rounded-full animate-pulse"></div>
              <svg className="w-16 h-16 text-emerald-600 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </motion.div>

          {/* Success Message */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Order Placed!</h2>
            <p className="text-slate-600">Thank you for your purchase. Your order has been confirmed.</p>
          </div>

          {/* Order ID */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white">
            <p className="text-sm text-slate-300 mb-2">Order ID</p>
            <p className="text-2xl font-bold font-mono break-all">{orderId}</p>
          </div>

          {/* Info Text */}
          <p className="text-sm text-slate-600">
            We've sent a confirmation email with your order details. Track your order in your profile.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={handleContinueShopping}
              variant="primary"
              size="md"
              className="w-full"
            >
              Continue Shopping
            </Button>
            <Button
              onClick={() => navigate('/orders')}
              variant="secondary"
              size="md"
              className="w-full"
            >
              View My Orders
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-24 pb-12 cart-container light-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-8">Shopping Cart</h1>

        {error && (
          <Alert type="error" message={error} />
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="bg-white">
              <Card.Body>
                <div>
                  {cartItems.map((item) => {
                    // Ensure image URL is valid, include full URLs
                    const imageUrl = item.image && item.image.trim() ? item.image : 'https://via.placeholder.com/150?text=No+Image';
                    
                    return (
                    <div key={item._id} className="flex gap-6 pb-6 border-b border-slate-200 last:border-b-0 last:pb-0 hover:bg-slate-50/50 transition">
                      <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-[#f5f5f5] flex items-center justify-center shadow-sm border border-slate-200 cart-item">
                        <img
                          src={imageUrl}
                          alt={item.name}
                          className="w-full h-full object-contain p-2"
                          style={{ maxWidth: '100%', maxHeight: '100%' }}
                          loading="lazy"
                          onError={(e) => {
                            console.warn('❌ Image failed to load:', imageUrl);
                            e.target.src = 'https://via.placeholder.com/150?text=Product';
                          }}
                          onLoad={(e) => {
                            console.log('✓ Image loaded:', imageUrl);
                          }}
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">{item.name}</h3>
                        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{item.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center border border-slate-300 rounded-lg hover:bg-slate-100 transition font-semibold text-slate-600"
                            >
                              −
                            </button>
                            <span className="w-12 text-center font-semibold text-slate-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center border border-slate-300 rounded-lg hover:bg-slate-100 transition font-semibold text-slate-600"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold text-slate-900">
                              ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                            </p>
                            <p className="text-sm text-slate-600">₹{Number(item.price).toLocaleString('en-IN')} each</p>
                          </div>

                          <Button
                            onClick={() => removeFromCart(item._id)}
                            variant="danger"
                            size="sm"
                            className="ml-4"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Order Summary & Shipping */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <Card className="bg-white">
              <Card.Body>
                <h2 className="font-semibold text-lg text-slate-900 mb-4">Order Summary</h2>
                <div className="space-y-2 pb-4 border-b border-slate-200">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>₹{Number(totalPrice).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-lg text-slate-900 pt-4">
                  <span>Total</span>
                  <span>₹{Number(totalPrice).toLocaleString('en-IN')}</span>
                </div>
              </Card.Body>
            </Card>

            {/* Shipping Info */}
            <Card className="bg-white">
              <Card.Body>
                <h2 className="font-semibold text-lg text-slate-900 mb-5">Shipping Info</h2>
                <div className="space-y-4">
                  <input name="fullName" value={shippingInfo.fullName} onChange={handleShippingChange} required hidden />
                  <input name="email" value={shippingInfo.email} onChange={handleShippingChange} required hidden />

                  {/* Visible inputs using shared Input component */}
                  <div className="hidden">
                    {/* These fields are pre-filled with user data but hidden from display */}
                  </div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.fullName}
                    readOnly
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm"
                  />

                  <label className="block text-sm font-semibold text-slate-700 mb-2 mt-3">
                    Email
                  </label>
                  <input
                    type="email"
                    value={shippingInfo.email}
                    readOnly
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm"
                  />

                  {/* Address Input */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      required
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
                      rows="2"
                      placeholder="Enter your full address"
                    />
                  </div>

                  {/* City & Zip Code */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                        placeholder="Zip Code"
                      />
                    </div>
                  </div>

                  <RazorpayCheckout
                    cartItems={cartItems}
                    totalPrice={totalPrice}
                    shippingInfo={shippingInfo}
                    user={user}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}