import React, { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ModalContext } from '../context/ModalContext';
import { useOrders } from '../hooks';
import { Card, Alert, Button } from '../components/shared';
import { getGenericSocialMeta } from '../utils/socialMetaTags';

/**
 * OrdersPage Component - Refactored with shared UI components
 * Uses useOrders hook for fetching and managing order data
 */
export default function OrdersPage() {
  const { openModal } = useContext(ModalContext);
  const { user, orders, loading, message } = useOrders();

  // Debug: Log orders data structure for troubleshooting
  useEffect(() => {
    if (orders.length > 0) {
      console.log('Orders data:', orders);
      if (orders[0].products && orders[0].products.length > 0) {
        console.log('First product structure:', orders[0].products[0]);
        console.log('Product data:', {
          productId: orders[0].products[0].productId,
          hasImage: !!orders[0].products[0].productId?.image,
          hasName: !!orders[0].products[0].productId?.name,
        });
      }
    }
  }, [orders]);

  // Not logged in view
  if (!user) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center py-24 bg-voltify-dark"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className="max-w-md w-full text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h2 className="text-3xl font-black tracking-tight mb-2 text-voltify-light">Please log in</h2>
          <p className="text-voltify-light/60 mb-6">You need to be logged in to view your orders.</p>
          <button onClick={() => openModal('login')}>
            <Button variant="primary" size="lg">
              Go to Login
            </Button>
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Orders | Voltify</title>
        <meta name="description" content="View your Voltify order history with tracking information and details." />
        
        {/* Open Graph & Twitter Card Meta Tags */}
        {getGenericSocialMeta(
          'My Orders | Voltify',
          'View your Voltify order history with tracking information and details.'
        ).map((meta, idx) => (
          meta.name ? (
            <meta key={idx} name={meta.name} content={meta.content} />
          ) : (
            <meta key={idx} property={meta.property} content={meta.content} />
          )
        ))}
        
        {/* JSON-LD BreadcrumbList Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": `${window.location.origin}/`
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Orders",
                "item": window.location.href
              }
            ]
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-voltify-dark py-12 md:py-24 orders-page orders-container">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-black tracking-tight text-voltify-light">My Orders</h1>
          <p className="text-voltify-light/60 text-lg mt-2">Orders placed by {user?.name}</p>
        </motion.div>

        {/* Error Alert */}
        {message.text && (
          <Alert type={message.type} message={message.text} />
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-voltify-gold"></div>
            </div>
            <p className="text-voltify-light/60 mt-4">Loading orders...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Card className="bg-[#1f1c19] border border-voltify-border/20 rounded-2xl">
              <Card.Body className="text-center py-16">
                <svg className="w-16 h-16 mx-auto text-voltify-gold/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-voltify-light text-lg">You have no orders yet.</p>
                <p className="text-voltify-light/60 text-sm mt-2">Start shopping to create your first order</p>
                <Link to="/" className="mt-6 inline-block">
                  <Button variant="primary">
                    Continue Shopping
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </motion.div>
        )}

        {/* Orders List */}
        {!loading && orders.length > 0 && (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {orders.map((order, idx) => (
              <motion.div 
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="bg-[#1f1c19] hover:border-voltify-gold/40 transition-all border border-voltify-border/20 rounded-2xl">
                  <Card.Body>
                    {/* Order Header */}
                    <div className="flex items-start justify-between mb-6 pb-6 border-b border-voltify-border/20">
                      <div>
                        <div className="text-xs font-semibold uppercase text-voltify-light/60 mb-1 tracking-wide">Order ID</div>
                        <div className="flex items-center gap-3">
                          <p className="font-mono font-semibold text-voltify-light text-lg">
                            #ORD-{order._id.slice(-4).toUpperCase()}
                          </p>
                          {/* Status Badge */}
                          <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                            order.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400' :
                            order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-amber-500/20 text-amber-400'
                          }`}>
                            {order.status || 'Processing'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold uppercase text-voltify-light/60 mb-1 tracking-wide">Placed</div>
                        <p className="text-voltify-light font-semibold">
                          {new Date(order.createdAt).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {/* Order Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Products */}
                      <div className="lg:col-span-2">
                        <h3 className="font-bold text-voltify-light mb-4 text-sm uppercase tracking-wide">Items Ordered</h3>
                        <div className="space-y-4 border-b border-voltify-border/20 pb-6 lg:border-b-0 lg:pb-0">
                          {order.products?.map((product, pidx) => {
                            // Get product name and image from populated product data
                            const productData = product.productId || {};
                            const productName = productData.name || product.name || 'Product';
                            const productImage = productData.image || product.image;
                            
                            // Debug: log product data on first product of each order
                            if (pidx === 0) {
                              console.log(`📦 Order ${order._id} - Product #${pidx}:`, {
                                productId: productData._id,
                                name: productName,
                                image: productImage,
                                hasImage: !!productImage,
                                imageType: typeof productImage,
                              });
                            }

                            return (
                            <motion.div 
                              key={pidx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: pidx * 0.05 }}
                              className="flex gap-4 justify-between items-start"
                            >
                              <div className="flex gap-4 flex-grow">
                                {/* Product Image Container with Fallback Icon */}
                                <div 
                                  className="flex-shrink-0 rounded-lg bg-[#2a2a2a] flex items-center justify-center overflow-hidden relative"
                                  style={{
                                    width: '64px',
                                    height: '64px',
                                    minWidth: '64px',
                                    minHeight: '64px',
                                  }}
                                >
                                  <img
                                    src={productImage || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgba(232,160,32,0.4)" stroke-width="1.5"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-4.22 4.125-9.25 4.125S2 8.653 2 6.375m18.25 0c0-2.278-4.22-4.125-9.25-4.125S2 4.097 2 6.375m18.25 0v11.25c0 2.278-4.22 4.125-9.25 4.125s-9.25-1.847-9.25-4.125V6.375M4.5 12.75h15"/%3E%3C/svg%3E'}
                                    alt={`${productName} order item - Buy on Voltify`}
                                    width={64}
                                    height={64}
                                    loading="lazy"
                                    title={`Image: ${productImage ? 'Loading...' : 'No image available'}`}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'contain',
                                      mixBlendMode: 'normal !important',
                                      filter: 'none',
                                      opacity: 1,
                                    }}
                                    onError={(e) => {
                                      console.warn(`❌ Product image failed to load: ${productImage}`);
                                      // Replace with fallback SVG icon with grey color
                                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgba(168,168,168,0.5)" stroke-width="1.5"%3E%3Crect x="3" y="3" width="18" height="18" rx="2"/%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"/%3E%3Cpath d="M21 15l-5-5L5 21"/%3E%3C/svg%3E';
                                      e.target.style.opacity = '1';
                                    }}
                                    onLoad={() => {
                                      console.log(`✓ Order product image loaded: ${productName}`);
                                    }}
                                  />
                                </div>

                                {/* Product Details */}
                                <div className="flex-grow">
                                  <h4 className="font-semibold text-white mb-1">
                                    {productName}
                                  </h4>
                                  <p className="text-sm text-[#aaaaaa]">
                                    Quantity: <span className="font-semibold">{product.quantity}</span>
                                  </p>
                                </div>
                              </div>

                              {/* Price & Track Button */}
                              <div className="text-right flex-shrink-0 flex flex-col items-end gap-3">
                                <div>
                                  <p className="font-bold text-white">
                                    ₹{Math.round(product.price * product.quantity).toLocaleString('en-IN')}
                                  </p>
                                  <p className="text-sm text-[#aaaaaa]">
                                    ₹{Math.round(product.price).toLocaleString('en-IN')} each
                                  </p>
                                </div>
                                <button className="px-4 py-2 bg-voltify-gold/20 hover:bg-voltify-gold/30 text-voltify-gold text-xs font-semibold rounded-lg transition-colors">
                                  Track Order
                                </button>
                              </div>
                            </motion.div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="bg-[#1e1e1e] rounded-xl p-6 border border-voltify-border/30 h-fit">
                        <h3 className="font-bold text-white mb-5 text-sm uppercase tracking-wide">Summary</h3>
                        <div className="space-y-5">
                          {/* Recipient */}
                          <div>
                            <p className="text-xs font-semibold uppercase text-voltify-light/60 mb-2 tracking-wide">Delivery To</p>
                            <p className="font-semibold text-white">
                              {order.shippingInfo?.fullName || 'N/A'}
                            </p>
                            <p className="text-sm text-voltify-light/60 mt-1 line-clamp-2">
                              {order.shippingInfo?.address || 'N/A'}
                            </p>
                          </div>

                          {/* Total */}
                          <div className="border-t border-voltify-border/30 pt-5">
                            <p className="text-xs font-semibold uppercase text-voltify-light/60 mb-2 tracking-wide">Total Amount</p>
                            <p className="text-3xl font-bold text-voltify-gold">
                              ₹{Math.round(order.totalAmount).toLocaleString('en-IN') || '0'}
                            </p>
                          </div>

                          {/* Status */}
                          {order.status && (
                            <div className="border-t border-voltify-border/30 pt-5">
                              <p className="text-xs font-semibold uppercase text-voltify-light/60 mb-2 tracking-wide">Order Status</p>
                              <span className={`inline-block px-4 py-2 text-sm font-semibold rounded-full ${
                                order.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400' :
                                order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-amber-500/20 text-amber-400'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
    </>
  );
}
