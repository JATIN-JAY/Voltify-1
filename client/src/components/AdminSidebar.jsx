import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Products', icon: '📦' },
    { path: '/admin/orders', label: 'Orders', icon: '🛒' },
    { path: '/admin/customers', label: 'Customers', icon: '👥' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <motion.aside
      className="fixed left-0 top-0 h-screen bg-[#0f0f0f] border-r border-[#2a2a2a] overflow-y-auto"
      style={{ width: '220px' }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      {/* Logo/Branding */}
      <div className="p-6 border-b border-[#2a2a2a]">
        <h1 className="text-xl font-black text-white tracking-tight">
          <span className="text-voltify-gold">Volt</span>ify
        </h1>
        <p className="text-xs text-[#666666] mt-1">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-semibold ${
                active
                  ? 'bg-voltify-gold/20 text-voltify-gold border-l-2 border-voltify-gold'
                  : 'text-[#aaaaaa] hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-4 h-px bg-[#2a2a2a]"></div>

      {/* Logout Button */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <span className="text-base">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
