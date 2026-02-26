import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import MainLayout from './layouts/MainLayout';
import HeroSection from './components/HeroSection';
import { ProductGrid } from './components/ProductGrid';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import AddressesPage from './pages/AddressesPage';
import WishlistPage from './pages/WishlistPage';
import './index.css';

function HomePage() {
  return (
    <MainLayout>
      <div className="relative">
        <HeroSection />
        <div className="lg:pr-6">
          <ProductGrid />
        </div>
      </div>
    </MainLayout>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
          <Route path="/product/:id" element={<MainLayout><ProductDetailPage /></MainLayout>} />
          <Route path="/category/:category" element={<MainLayout><CategoryPage /></MainLayout>} />
          <Route path="/admin" element={<MainLayout><AdminDashboard /></MainLayout>} />
          <Route path="/orders" element={<MainLayout><OrdersPage /></MainLayout>} />
          <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
          <Route path="/addresses" element={<MainLayout><AddressesPage /></MainLayout>} />
          <Route path="/wishlist" element={<MainLayout><WishlistPage /></MainLayout>} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
