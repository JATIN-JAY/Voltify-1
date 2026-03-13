import React from 'react';
import { motion } from 'framer-motion';

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, isLoading = false, isDangerous = false }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl max-w-sm w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#2a2a2a]">
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-[#aaaaaa]">{message}</p>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#2a2a2a] flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-[#aaaaaa] hover:bg-[#2a2a2a] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${
              isDangerous
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-voltify-gold/20 text-voltify-gold hover:bg-voltify-gold/30'
            }`}
          >
            {isLoading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmationModal;
