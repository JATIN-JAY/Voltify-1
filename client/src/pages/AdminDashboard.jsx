import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { CartContext } from '../context/CartContext';
import ProductForm from '../components/ProductForm';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [salesSummary, setSalesSummary] = useState(null);
  const [salesError, setSalesError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  const token = localStorage.getItem('token');

  // Only show admin dashboard to admins
  useEffect(() => {
    if (!user || (!user.isAdmin && user.email !== 'admin@voltify.com')) {
      navigate('/');
      return;
    }

    fetchProducts();
    fetchSalesSummary();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesSummary = async () => {
    try {
      const response = await api.get('/orders/admin/summary', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSalesSummary(response.data);
      setSalesError('');
    } catch (err) {
      setSalesError('Failed to load sales summary');
      console.error(err);
    }
  };

  const handleProductCreated = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  const handleToggleFeatured = async (productId, currentFeaturedStatus) => {
    try {
      const response = await api.put(
        `/products/${productId}`,
        { featured: !currentFeaturedStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the product in the list
      setProducts(
        products.map((p) =>
          p._id === productId ? { ...p, featured: !currentFeaturedStatus } : p
        )
      );
    } catch (err) {
      setError('Failed to update product featured status');
      console.error(err);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      setDeleteLoading(productId);
      await api.delete(`/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(products.filter((p) => p._id !== productId));
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const categories = ['Mobiles', 'Tablets', 'Audio', 'Phone Case', 'Accessories'];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome, {user?.name}! Manage your products below.</p>
        </div>

        {/* Sales Summary */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Sales Overview</h2>

          {salesError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
              {salesError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ₹{(salesSummary?.totalSales || 0).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {salesSummary?.totalOrders || 0}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-sm text-gray-500">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ₹{Math.round(salesSummary?.averageOrderValue || 0).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {salesSummary?.recentOrders?.length ? (
            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                        Customer
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                        Email
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {salesSummary.recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td className="px-4 py-2 text-sm text-gray-800">
                          {order.userId?.name || 'Unknown'}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {order.userId?.email || '—'}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-800 text-right">
                          ₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>

        {/* Product Form */}
        <div className="mb-12">
          <ProductForm
            onProductCreated={handleProductCreated}
            categories={categories}
          />
        </div>

        {/* Products List */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Products List</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No products yet. Create your first product above!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Brand
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Price
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                      Featured
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.brand}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                        ₹{product.price.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(product._id, product.featured)}
                          className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                            product.featured
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {product.featured ? '★ Featured' : 'Not Featured'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          disabled={deleteLoading === product._id}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 text-sm"
                        >
                          {deleteLoading === product._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
