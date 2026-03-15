import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import api from '../api';
import { getGenericSocialMeta } from '../utils/socialMetaTags';
import AdminSidebar from '../components/AdminSidebar';
import { Alert } from '../components/shared';

/**
 * AdminOrders Component - View and manage all orders in the system
 * Admin-only page for monitoring and managing customer orders
 */
export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get('/orders/admin/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setMessage({ 
          type: 'error', 
          text: error.response?.data?.message || 'Failed to load orders' 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, [token]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getTotalPrice = (products) => {
    if (!Array.isArray(products)) return 0;
    return products.reduce((sum, p) => {
      const price = p.productId?.price || p.price || 0;
      const quantity = p.quantity || 1;
      return sum + (price * quantity);
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex">
        <AdminSidebar />
        <main className="flex-1" style={{ marginLeft: '220px' }}>
          <div className="p-8 flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-voltify-gold"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>All Orders | Admin - Voltify</title>
        <meta name="description" content="View and manage all customer orders in your Voltify admin dashboard." />
        {getGenericSocialMeta(
          'All Orders | Admin - Voltify',
          'View and manage all customer orders.'
        ).map((meta, idx) => (
          meta.name ? (
            <meta key={idx} name={meta.name} content={meta.content} />
          ) : (
            <meta key={idx} property={meta.property} content={meta.content} />
          )
        ))}
      </Helmet>
      <div className="min-h-screen bg-[#0f0f0f] flex">
        <AdminSidebar />
        <main className="flex-1" style={{ marginLeft: '220px' }}>
          <div className="p-8">
          {/* Header */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black tracking-tight text-white mb-2">All Orders</h1>
            <p className="text-[#aaaaaa]">Manage customer orders across the platform</p>
          </motion.div>

          {/* Alert Messages */}
          {message.text && (
            <motion.div
              className={`mb-8 p-4 rounded-lg border ${
                message.type === 'error'
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {message.text}
            </motion.div>
          )}

          {/* Empty State */}
          {orders.length === 0 ? (
            <motion.div
              className="text-center py-12 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-[#aaaaaa] text-lg">No orders found</p>
            </motion.div>
          ) : (
            <motion.div
              className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#2a2a2a]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#0f0f0f] border-b border-[#2a2a2a]">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-[#aaaaaa] uppercase text-xs tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-[#aaaaaa] uppercase text-xs tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-[#aaaaaa] uppercase text-xs tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-[#aaaaaa] uppercase text-xs tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-[#aaaaaa] uppercase text-xs tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-[#aaaaaa] uppercase text-xs tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a2a2a]">
                    {orders.map((order) => (
                      <motion.tr
                        key={order._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hover:bg-[#252525] transition"
                      >
                        <td className="px-6 py-4 font-mono text-voltify-gold text-xs">
                          {order._id?.substring(0, 8)}
                        </td>
                        <td className="px-6 py-4 text-white">
                          <div className="font-semibold">{order.userId?.email || 'Unknown User'}</div>
                          <div className="text-[#aaaaaa] text-xs mt-1">
                            {order.userId?.name || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#aaaaaa]">
                          {Array.isArray(order.products) ? order.products.length : 0} item(s)
                        </td>
                        <td className="px-6 py-4 font-semibold text-voltify-gold">
                          ₹{Math.round(getTotalPrice(order.products)).toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === 'delivered'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : order.status === 'cancelled'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {order.status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#aaaaaa] text-xs">
                          {formatDate(order.createdAt)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Summary */}
          {orders.length > 0 && (
            <motion.div
              className="mt-8 p-6 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-white font-semibold mb-4">Summary</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-[#0f0f0f] rounded-lg">
                  <p className="text-[#aaaaaa] text-sm mb-2">Total Orders</p>
                  <p className="text-2xl font-bold text-white">{orders.length}</p>
                </div>
                <div className="p-4 bg-[#0f0f0f] rounded-lg">
                  <p className="text-[#aaaaaa] text-sm mb-2">Total Revenue</p>
                  <p className="text-2xl font-bold text-voltify-gold">
                    ₹{orders
                      .reduce((sum, order) => sum + getTotalPrice(order.products), 0)
                      .toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="p-4 bg-[#0f0f0f] rounded-lg">
                  <p className="text-[#aaaaaa] text-sm mb-2">Avg Order Value</p>
                  <p className="text-2xl font-bold text-white">
                    ₹{orders.length > 0
                      ? Math.round(
                          orders.reduce((sum, order) => sum + getTotalPrice(order.products), 0) /
                            orders.length
                        ).toLocaleString('en-IN')
                      : '0'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          </div>
        </main>
      </div>
    </>
  );
}
