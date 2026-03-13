import React from 'react';
import { motion } from 'framer-motion';

const ToggleSwitch = ({ isOn, onChange, disabled = false, size = 'md' }) => {
  const sizes = {
    sm: { width: '40px', height: '24px', knob: '20px', gap: '2px' },
    md: { width: '56px', height: '32px', knob: '28px', gap: '2px' },
    lg: { width: '72px', height: '40px', knob: '36px', gap: '2px' },
  };

  const currentSize = sizes[size];

  return (
    <motion.button
      onClick={() => !disabled && onChange(!isOn)}
      disabled={disabled}
      className={`relative rounded-full transition-colors ${
        isOn ? 'bg-emerald-500' : 'bg-[#2a2a2a]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}`}
      style={{
        width: currentSize.width,
        height: currentSize.height,
        padding: currentSize.gap,
      }}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {/* Knob */}
      <motion.div
        className="absolute top-[2px] left-[2px] bg-white rounded-full"
        style={{
          width: currentSize.knob,
          height: currentSize.knob,
        }}
        initial={false}
        animate={{
          x: isOn ? parseInt(currentSize.width) - parseInt(currentSize.knob) - 4 : 0,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );
};

export default ToggleSwitch;
