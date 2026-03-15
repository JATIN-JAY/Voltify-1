import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAdminDashboard } from '../hooks';
import { getGenericSocialMeta } from '../utils/socialMetaTags';
import AdminSidebar from '../components/AdminSidebar';
import ProductForm from '../components/ProductForm';

const AdminProductAddPage = () => {
  const navigate = useNavigate();
  const { handleProductCreated } = useAdminDashboard();

  const categories = ['Mobiles', 'Tablets', 'Audio', 'Phone Case', 'Accessories'];

  const handleSuccess = (product) => {
    handleProductCreated(product);
    navigate('/admin/products');
  };

  return (
    <>
      <Helmet>
        <title>Add New Product | Admin - Voltify</title>
        <meta name="description" content="Add a new product to your Voltify store catalog." />
        {getGenericSocialMeta(
          'Add New Product | Admin - Voltify',
          'Add a new product to your Voltify store catalog.'
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
            <h1 className="text-4xl font-black tracking-tight text-white mb-3">Add New Product</h1>
            <p className="text-[#aaaaaa]">Create a new product in your catalog</p>
          </motion.div>

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl"
          >
            <ProductForm
              onProductCreated={handleSuccess}
              categories={categories}
            />
          </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminProductAddPage;
