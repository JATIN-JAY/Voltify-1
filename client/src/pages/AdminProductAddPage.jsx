import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAdminDashboard } from '../hooks';
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
  );
};

export default AdminProductAddPage;
