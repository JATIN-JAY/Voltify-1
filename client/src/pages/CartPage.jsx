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
      <div className="min-h-screen bg-voltify-dark pt-20 pb-12">
        <motion.div 
          className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.svg 
            className="w-24 h-24 mx-auto text-voltify-gold/30 mb-6"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </motion.svg>
          <h2 className="text-4xl font-bold tracking-tight text-voltify-light mb-4">Cart is Empty</h2>
          <p className="text-voltify-light/70 text-lg mb-8">Discover amazing tech products and start your shopping experience.</p>
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
        className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-voltify-dark rounded-2xl shadow-2xl max-w-md w-full p-8 text-center space-y-6 border border-voltify-border"
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
              <div className="absolute inset-0 bg-voltify-gold/20 rounded-full animate-pulse"></div>
              <svg className="w-16 h-16 text-voltify-gold relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </motion.div>

          {/* Success Message */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-voltify-light">Order Placed!</h2>
            <p className="text-voltify-light/70">Thank you for your purchase. Your order has been confirmed.</p>
          </div>

          {/* Order ID */}
          <div className="bg-voltify-dark/80 rounded-xl p-6 border border-voltify-gold/20 text-voltify-light">
            <p className="text-sm text-voltify-light/60 mb-2">Order ID</p>
            <p className="text-2xl font-bold font-mono break-all text-voltify-gold">{orderId}</p>
          </div>

          {/* Info Text */}
          <p className="text-sm text-voltify-light/70">
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
    <div className="min-h-screen bg-voltify-dark pt-20 pb-12 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-voltify-light mb-6">Shopping Cart</h1>

        {error && (
          <Alert type="error" message={error} />
        )}

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card className="bg-voltify-dark/80 border border-voltify-border">
              <Card.Body>
                <div>
                  {cartItems.map((item) => {
                    // Ensure image URL is valid, include full URLs
                    const imageUrl = item.image && item.image.trim() ? item.image : 'https://via.placeholder.com/150?text=No+Image';
                    
                    return (
                    <div key={item._id} className="flex flex-col sm:flex-row gap-4 pb-6 border-b border-voltify-border/30 last:border-b-0 last:pb-0 hover:bg-voltify-dark/40 transition">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-voltify-dark flex items-center justify-center border border-voltify-border/20 cart-item">
                        <img
                          src={imageUrl}
                          alt={item.name}
                          className="w-full h-full object-contain p-1"
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

                      <div className="flex-1 flex flex-col">
                        <div>
                          <h3 className="font-semibold text-voltify-light line-clamp-2">{item.name}</h3>
                          {item.variant && (
                            <p className="text-voltify-light/60 text-sm mt-1">{item.variant}</p>
                          )}
                        </div>

                        <div className="mt-auto flex flex-col-reverse sm:flex-col">
                          <div className="flex items-center justify-between gap-3 mt-3 sm:mt-0">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center border border-voltify-border rounded hover:bg-voltify-dark/60 transition font-semibold text-voltify-light/80"
                              >
                                −
                              </button>
                              <span className="w-10 text-center font-semibold text-voltify-light">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center border border-voltify-border rounded hover:bg-voltify-dark/60 transition font-semibold text-voltify-light/80"
                              >
                                +
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="font-semibold text-voltify-gold">
                                ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                              </p>
                              <p className="text-xs text-voltify-light/60">₹{Number(item.price).toLocaleString('en-IN')} each</p>
                            </div>
                          </div>

                          <Button
                            onClick={() => removeFromCart(item._id)}
                            variant="danger"
                            size="sm"
                            className="sm:hidden mt-2 w-full"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>

                      <Button
                        onClick={() => removeFromCart(item._id)}
                        variant="danger"
                        size="sm"
                        className="hidden sm:flex flex-shrink-0"
                      >
                        Remove
                      </Button>
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
            <Card className="bg-voltify-dark/80 border border-voltify-border">
              <Card.Body>
                <h2 className="font-semibold text-lg text-voltify-light mb-4">Order Summary</h2>
                <div className="space-y-3 pb-4 border-b border-voltify-border/30">
                  <div className="flex justify-between text-voltify-light/80">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{Number(totalPrice).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-voltify-light/80">
                    <span>Shipping</span>
                    <span className="font-medium text-voltify-gold">Free</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-lg text-voltify-light pt-4">
                  <span>Total</span>
                  <span className="text-voltify-gold">₹{Number(totalPrice).toLocaleString('en-IN')}</span>
                </div>
              </Card.Body>
            </Card>

            {/* Shipping Info */}
            <Card className="bg-voltify-dark/80 border border-voltify-border">
              <Card.Body>
                <h2 className="font-semibold text-lg text-voltify-light mb-5">Shipping Info</h2>
                <div className="space-y-4">
                  <input name="fullName" value={shippingInfo.fullName} onChange={handleShippingChange} required hidden />
                  <input name="email" value={shippingInfo.email} onChange={handleShippingChange} required hidden />

                  {/* Visible inputs using shared Input component */}
                  <div className="hidden">
                    {/* These fields are pre-filled with user data but hidden from display */}
                  </div>

                  <label className="block text-sm font-semibold text-voltify-light mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={shippingInfo.fullName}
                    readOnly
                    className="w-full px-4 py-2.5 bg-voltify-dark border border-voltify-border rounded-lg text-voltify-light/80 text-sm"
                  />

                  <label className="block text-sm font-semibold text-voltify-light mb-2 mt-3">
                    Email
                  </label>
                  <input
                    type="email"
                    value={shippingInfo.email}
                    readOnly
                    className="w-full px-4 py-2.5 bg-voltify-dark border border-voltify-border rounded-lg text-voltify-light/80 text-sm"
                  />

                  {/* Address Input */}
                  <div>
                    <label className="block text-sm font-semibold text-voltify-light mb-2">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      required
                      className="w-full px-4 py-2.5 bg-voltify-dark border border-voltify-border rounded-lg text-voltify-light focus:ring-2 focus:ring-voltify-gold focus:border-transparent resize-none placeholder-voltify-light/40"
                      rows="2"
                      placeholder="Enter your full address"
                    />
                  </div>

                  {/* City & Zip Code */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-voltify-light mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-2.5 bg-voltify-dark border border-voltify-border rounded-lg text-voltify-light focus:ring-2 focus:ring-voltify-gold focus:border-transparent placeholder-voltify-light/40"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-voltify-light mb-2">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-2.5 bg-voltify-dark border border-voltify-border rounded-lg text-voltify-light focus:ring-2 focus:ring-voltify-gold focus:border-transparent placeholder-voltify-light/40"
                        placeholder="Zip Code"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <RazorpayCheckout
                      cartItems={cartItems}
                      totalPrice={totalPrice}
                      shippingInfo={shippingInfo}
                      user={user}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}