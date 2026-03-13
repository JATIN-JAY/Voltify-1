import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Alert Compound Component
 * Error, success, warning messages with animations
 */
const Alert = memo(({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const styles = {
    error: 'bg-red-50 border-red-200 text-red-700',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    warning: 'bg-amber-50 border-amber-200 text-amber-700',
    info: 'bg-voltify-dark border-voltify-border text-voltify-light',
  };

  const icons = {
    error: '⚠️',
    success: '✓',
    warning: '⚡',
    info: 'ℹ️',
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`p-4 border rounded-lg ${styles[type]} flex items-start gap-3 mb-4`}
        >
          <span className="text-xl mt-0.5">{icons[type]}</span>
          <div className="flex-1">{message}</div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-current hover:opacity-70 transition flex-shrink-0"
            >
              ✕
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

Alert.displayName = 'Alert';

export default Alert;
