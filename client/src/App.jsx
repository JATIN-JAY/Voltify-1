import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CartProvider } from './context/CartContext';
import { ModalProvider } from './context/ModalContext';
import Navbar from './components/Navbar';
import PromoStrip from './components/PromoStrip';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import './index.css';

// Lazy load heavy route components for code-splitting
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminProductsPage = lazy(() => import('./pages/AdminProductsPage'));
const AdminProductAddPage = lazy(() => import('./pages/AdminProductAddPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AddressesPage = lazy(() => import('./pages/AddressesPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const BecomeSellerPage = lazy(() => import('./pages/BecomeSellerPage'));
const SellerStatusPage = lazy(() => import('./pages/SellerStatusPage'));

/**
 * Loading fallback for lazy-loaded routes
 * Shows minimal skeleton during code chunk loading (typically <500ms)
 */
function RouteLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-48 mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-64"></div>
      </div>
    </div>
  );
}

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  if (!googleClientId) {
    console.error('Google Client ID is not configured in .env.local');
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId || ''}>
      <CartProvider>
        <ModalProvider>
          <Router>
            <Navbar />
            <PromoStrip variant="dark" />
            <LoginModal />
            <SignupModal />
          <div className="pt-[20px] md:pt-[24px]">
            <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Seller routes */}
              <Route path="/become-seller" element={<BecomeSellerPage />} />
              <Route path="/seller/status" element={<SellerStatusPage />} />

              {/* Product routes */}
              <Route path="/product/:id" element={<MainLayout><ProductDetailPage /></MainLayout>} />
              <Route path="/category/:category" element={<MainLayout><CategoryPage /></MainLayout>} />

              {/* User routes */}
              <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
              <Route path="/orders" element={<MainLayout><OrdersPage /></MainLayout>} />
              <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
              <Route path="/addresses" element={<MainLayout><AddressesPage /></MainLayout>} />
              <Route path="/wishlist" element={<MainLayout><WishlistPage /></MainLayout>} />

              {/* Admin routes */}
              <Route path="/admin" element={<MainLayout><AdminDashboard /></MainLayout>} />
              <Route path="/admin/products" element={<MainLayout><AdminProductsPage /></MainLayout>} />
              <Route path="/admin/products/add" element={<MainLayout><AdminProductAddPage /></MainLayout>} />
            </Routes>
          </Suspense>
          </div>
        </Router>
      </ModalProvider>
    </CartProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
