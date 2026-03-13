import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAdminDashboard } from '../hooks';
import AdminSidebar from '../components/AdminSidebar';

/**
 * AdminDashboard Component - Redesigned with sidebar navigation
 * Shows only metrics and recent orders
 */
const AdminDashboard = () => {
  const {
    user,
    loading,
    message,
    salesSummary,
  } = useAdminDashboard();

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1" style={{ marginLeft: '220px' }}>
        <div className="p-8">
          {/* Header */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-black tracking-tight text-white mb-3">Dashboard</h1>
            <p className="text-[#aaaaaa] text-lg">Welcome, {user?.name}! Here's your sales performance.</p>
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

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-voltify-gold"></div>
              </div>
              <p className="text-[#aaaaaa] mt-4">Loading dashboard...</p>
            </div>
          ) : (
            <>
              {/* Metric Cards */}
              {salesSummary && (
                <motion.section 
                  className="mb-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { 
                        label: 'Total Sales', 
                        value: `₹${(salesSummary.totalSales || 0).toLocaleString('en-IN')}`,
                      },
                      { 
                        label: 'Total Orders', 
                        value: salesSummary.totalOrders || 0,
                      },
                      { 
                        label: 'Avg Order Value', 
                        value: `₹${Math.round(salesSummary.averageOrderValue || 0).toLocaleString('en-IN')}`,
                      }
                    ].map((stat, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + idx * 0.05 }}
                        className="bg-[#1a1a1a] rounded-xl p-6 border-l-4 border-voltify-gold"
                      >
                        <p className="text-xs font-semibold uppercase text-[#666666] mb-3 tracking-wider">{stat.label}</p>
                        <p className="text-4xl font-black text-voltify-gold">{stat.value}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Recent Orders Table */}
              {salesSummary?.recentOrders?.length > 0 && (
                <motion.section
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#2a2a2a]">
                    <div className="p-6 border-b border-[#2a2a2a]">
                      <h2 className="text-2xl font-black text-white">Recent Orders</h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-[#0f0f0f] border-b border-[#2a2a2a]">
                          <tr>
                            <th className="px-6 py-4 text-left font-semibold text-[#aaaaaa] uppercase text-xs tracking-wider">Order ID</th>
                            <th className="px-6 py-4 text-left font-semibold text-[#aaaaaa] uppercase text-xs tracking-wider">Customer</th>
                            <th className="px-6 py-4 text-left font-semibold text-[#aaaaaa] uppercase text-xs tracking-wider">Email</th>
                            <th className="px-6 py-4 text-left font-semibold text-[#aaaaaa] uppercase text-xs tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left font-semibold text-[#aaaaaa] uppercase text-xs tracking-wider">Date</th>
                            <th className="px-6 py-4 text-right font-semibold text-[#aaaaaa] uppercase text-xs tracking-wider">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2a2a2a]">
                          {salesSummary.recentOrders.map((order, idx) => (
                            <motion.tr 
                              key={order._id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + idx * 0.02 }}
                              className="hover:bg-[#252525] transition"
                            >
                              <td className="px-6 py-4 font-semibold text-white">
                                #{order._id.slice(-4).toUpperCase()}
                              </td>
                              <td className="px-6 py-4 text-white">
                                {order.userId?.name || 'Unknown'}
                              </td>
                              <td className="px-6 py-4 text-[#aaaaaa]">
                                {order.userId?.email || '—'}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                                  order.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400' :
                                  order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400' :
                                  'bg-amber-500/20 text-amber-400'
                                }`}>
                                  {order.status || 'Processing'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-[#aaaaaa]">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 font-semibold text-voltify-gold text-right">
                                ₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.section>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
