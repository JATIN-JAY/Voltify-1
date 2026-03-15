import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdminDashboard } from '../hooks';
import { getGenericSocialMeta } from '../utils/socialMetaTags';
import AdminSidebar from '../components/AdminSidebar';
import ProductForm from '../components/ProductForm';
import api from '../api';

const AdminProductEditPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { handleProductCreated } = useAdminDashboard();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = ['Mobiles', 'Tablets', 'Audio', 'Phone Case', 'Accessories'];

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Failed to load product';
        setError(errorMsg);
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleSuccess = (updatedProduct) => {
    handleProductCreated(updatedProduct);
    navigate('/admin/products');
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading Product... | Admin - Voltify</title>
        </Helmet>
        <div className="min-h-screen bg-[#0f0f0f] flex">
          <AdminSidebar />
          <main className="flex-1" style={{ marginLeft: '220px' }}>
            <div className="p-8 text-center">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-voltify-gold"></div>
              </div>
              <p className="text-[#aaaaaa] mt-4">Loading product...</p>
            </div>
          </main>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Error Loading Product | Admin - Voltify</title>
        </Helmet>
        <div className="min-h-screen bg-[#0f0f0f] flex">
          <AdminSidebar />
          <main className="flex-1" style={{ marginLeft: '220px' }}>
            <div className="p-8">
              <motion.div
                className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-lg font-semibold mb-4">Error Loading Product</p>
                <p className="mb-4">{error}</p>
                <button
                  onClick={() => navigate('/admin/products')}
                  className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                >
                  Back to Products
                </button>
              </motion.div>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Edit Product | Admin - Voltify</title>
        <meta name="description" content="Edit product details in your Voltify store catalog." />
        {getGenericSocialMeta(
          'Edit Product | Admin - Voltify',
          'Edit product details in your Voltify store catalog.'
        ).map((meta, idx) => (
          meta.name ? (
            <meta key={idx} name={meta.name} content={meta.content} />
          ) : (
            <meta key={idx} property={meta.property} content={meta.content} />
          )
        ))}
      </Helmet>
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
              <h1 className="text-4xl font-black tracking-tight text-white mb-3">Edit Product</h1>
              <p className="text-[#aaaaaa]">Update the product details below</p>
            </motion.div>

            {/* Product Form */}
            <motion.div 
              className="max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ProductForm onProductCreated={handleSuccess} categories={categories} productToEdit={product} />
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminProductEditPage;
