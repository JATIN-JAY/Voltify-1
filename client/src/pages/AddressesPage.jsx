import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import { ModalContext } from '../context/ModalContext';

export default function AddressesPage() {
  const { user, loginUser } = useContext(CartContext);
  const { openModal } = useContext(ModalContext);
  const initial = user?.addresses || [];
  const [addresses, setAddresses] = useState(initial);
  const [form, setForm] = useState({ fullName: '', address: '', city: '', zipCode: '' });

  const saveAddresses = (next) => {
    const token = localStorage.getItem('token');
    const updatedUser = { ...(user || {}), addresses: next };
    if (token) updatedUser.token = token;
    loginUser(updatedUser);
    setAddresses(next);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const next = [...addresses, form];
    saveAddresses(next);
    setForm({ fullName: '', address: '', city: '', zipCode: '' });
  };

  const handleRemove = (idx) => {
    const next = addresses.filter((_, i) => i !== idx);
    saveAddresses(next);
  };

  if (!user) return (
    <motion.div 
      className="min-h-screen bg-voltify-dark flex items-center justify-center py-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div 
        className="max-w-md w-full text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-display font-bold mb-2 text-voltify-light">Please Log In</h2>
        <p className="text-voltify-light/60 mb-6">You need to be logged in to manage addresses.</p>
        <motion.button 
          onClick={() => openModal('login')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block px-8 py-3 btn-primary"
        >
          Go to Login
        </motion.button>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-voltify-dark py-12 md:py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.h1 
          className="text-4xl font-display font-bold text-voltify-light mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          My Addresses
        </motion.h1>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Saved Addresses */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-voltify-light mb-6">Saved Addresses</h2>
            {addresses.length === 0 ? (
              <div className="text-voltify-light/60">No saved addresses yet.</div>
            ) : (
              <div className="space-y-4">
                {addresses.map((a, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-[#1f1c19] p-6 rounded-2xl border border-voltify-border/20 hover:border-voltify-gold/40 transition duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-voltify-light">{a.fullName}</div>
                        <div className="text-sm text-voltify-light/60 mt-2">{a.address}, {a.city} - {a.zipCode}</div>
                      </div>
                      <motion.button 
                        onClick={() => handleRemove(idx)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-red-400 hover:text-red-300 font-semibold text-sm px-3 py-1 hover:bg-red-950/20 rounded-lg transition"
                      >
                        Remove
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Add New Address */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold text-voltify-light mb-6">Add New Address</h2>
            <form onSubmit={handleAdd} className="bg-[#1f1c19] p-6 rounded-2xl border border-voltify-border/20 space-y-4">
              <input 
                placeholder="Full name" 
                value={form.fullName} 
                onChange={(e) => setForm({ ...form, fullName: e.target.value })} 
                required
                className="w-full px-4 py-2 bg-voltify-dark/40 border border-voltify-border/20 rounded-lg text-voltify-light placeholder-voltify-light/40 focus:outline-none focus:border-voltify-gold/40" 
              />
              <input 
                placeholder="Street address" 
                value={form.address} 
                onChange={(e) => setForm({ ...form, address: e.target.value })} 
                required
                className="w-full px-4 py-2 bg-voltify-dark/40 border border-voltify-border/20 rounded-lg text-voltify-light placeholder-voltify-light/40 focus:outline-none focus:border-voltify-gold/40" 
              />
              <input 
                placeholder="City" 
                value={form.city} 
                onChange={(e) => setForm({ ...form, city: e.target.value })} 
                required
                className="w-full px-4 py-2 bg-voltify-dark/40 border border-voltify-border/20 rounded-lg text-voltify-light placeholder-voltify-light/40 focus:outline-none focus:border-voltify-gold/40" 
              />
              <input 
                placeholder="Zip code" 
                value={form.zipCode} 
                onChange={(e) => setForm({ ...form, zipCode: e.target.value })} 
                required
                className="w-full px-4 py-2 bg-voltify-dark/40 border border-voltify-border/20 rounded-lg text-voltify-light placeholder-voltify-light/40 focus:outline-none focus:border-voltify-gold/40" 
              />
              <div className="pt-2">
                <motion.button 
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 btn-primary"
                >
                  Add Address
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
