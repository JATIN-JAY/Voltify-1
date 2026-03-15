import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAdminDashboard } from '../hooks';
import AdminSidebar from '../components/AdminSidebar';
import ConfirmationModal from '../components/ConfirmationModal';
import ToggleSwitch from '../components/ToggleSwitch';

const AdminProductsPage = () => {
  const {
    products,
    loading,
    deleteLoading,
    message,
    toggleFeatured,
    deleteProduct,
  } = useAdminDashboard();

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [displayMessage, setDisplayMessage] = useState(message);

  // Auto-clear success/warning messages after 4 seconds
  useEffect(() => {
    setDisplayMessage(message);
    if (message.text && (message.type === 'success' || message.type === 'warning')) {
      const timer = setTimeout(() => {
        setDisplayMessage({ type: '', text: '' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleDeleteClick = (productId, productName) => {
    setConfirmDelete(productId);
    setDeleteMessage(`Are you sure you want to delete "${productName}"? This action cannot be undone.`);
  };

  const handleConfirmDelete = async () => {
    await deleteProduct(confirmDelete);
    setConfirmDelete(null);
  };

  // Get short product name (brand + model)
  const getShortName = (fullName) => {
    const parts = fullName.split(' ');
    if (parts.length > 3) {
      return `${parts[0]} ${parts[1]}`;
    }
    return fullName;
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1" style={{ marginLeft: '220px' }}>
        <div className="p-8">
          {/* Header */}
          <motion.div 
            className="mb-8 flex items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <h1 className="text-4xl font-black tracking-tight text-white mb-2">Products</h1>
              <p className="text-[#aaaaaa]">Manage your product catalog</p>
            </div>
            <Link
              to="/admin/products/add"
              className="px-6 py-3 bg-voltify-gold text-black font-bold rounded-lg hover:bg-voltify-gold/90 transition-colors"
            >
              + Add Product
            </Link>
          </motion.div>

          {/* Alert Messages */}
          {displayMessage.text && (
            <motion.div
              className={`mb-8 p-4 rounded-lg border ${
                displayMessage.type === 'error'
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : displayMessage.type === 'warning'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {displayMessage.text}
            </motion.div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-voltify-gold"></div>
              </div>
              <p className="text-[#aaaaaa] mt-4">Loading products...</p>
            </div>
          ) : (
            <>
              {/* Empty State */}
              {products.length === 0 ? (
                <motion.div
                  className="text-center py-12 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-[#aaaaaa] text-lg mb-4">No products yet.</p>
                  <Link
                    to="/admin/products/add"
                    className="inline-block px-6 py-3 bg-voltify-gold/20 text-voltify-gold font-bold rounded-lg hover:bg-voltify-gold/30 transition-colors"
                  >
                    Create your first product
                  </Link>
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
                          <th className="px-6 py-4 text-left font-semibold text-[#aaaaaa] uppercase text-xs tracking-wider">Image</th>
                          <th className="px-6 py-4 text-left font-semibold text-[#aaaaaa] uppercase text-xs tracking-wider">Name</th>
                          <th className="px-6 py-4 text-left font-semibold text-[#aaaaaa] uppercase text-xs tracking-wider">Brand</th>
                          <th className="px-6 py-4 text-left font-semibold text-[#aaaaaa] uppercase text-xs tracking-wider">Category</th>
                          <th className="px-6 py-4 text-left font-semibold text-[#aaaaaa] uppercase text-xs tracking-wider">Price</th>
                          <th className="px-6 py-4 text-center font-semibold text-[#aaaaaa] uppercase text-xs tracking-wider">Featured</th>
                          <th className="px-6 py-4 text-center font-semibold text-[#aaaaaa] uppercase text-xs tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#2a2a2a]">
                        {products.map((product, idx) => (
                          <motion.tr 
                            key={product._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.02 }}
                            className="hover:bg-[#252525] transition"
                          >
                            <td className="px-6 py-4">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-lg bg-[#0f0f0f]"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/64';
                                }}
                              />
                            </td>
                            <td className="px-6 py-4 font-semibold text-white">
                              {getShortName(product.name)}
                            </td>
                            <td className="px-6 py-4 text-[#aaaaaa]">
                              {product.brand}
                            </td>
                            <td className="px-6 py-4 text-[#aaaaaa]">
                              {product.category}
                            </td>
                            <td className="px-6 py-4 font-semibold text-voltify-gold">
                              ₹{product.price.toLocaleString('en-IN')}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <ToggleSwitch
                                isOn={product.featured}
                                onChange={(newState) => toggleFeatured(product._id, newState)}
                                size="sm"
                              />
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Link
                                  to={`/admin/products/${product._id}/edit`}
                                  className="p-2 rounded-lg hover:bg-[#2a2a2a] text-blue-400 hover:text-blue-300 transition-colors"
                                  title="Edit product"
                                >
                                  ✏️
                                </Link>
                                <button
                                  onClick={() => handleDeleteClick(product._id, product.name)}
                                  className="p-2 rounded-lg hover:bg-[#2a2a2a] text-red-400 hover:text-red-300 transition-colors"
                                  title="Delete product"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmDelete !== null}
        title="Delete Product"
        message={deleteMessage}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
        isLoading={deleteLoading === confirmDelete}
        isDangerous={true}
      />
    </div>
  );
};

export default AdminProductsPage;
