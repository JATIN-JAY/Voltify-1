import React, { memo } from 'react';

/**
 * Input Compound Component
 * Unified input styling across the application
 */
const Input = memo(({
  label,
  error,
  type = 'text',
  size = 'md',
  className = '',
  containerClassName = '',
  ...props
}) => {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-semibold text-voltify-light mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`
          w-full ${sizes[size]}
          border border-voltify-border rounded-lg bg-voltify-dark/50 text-voltify-light
          focus:outline-none focus:ring-2 focus:ring-voltify-gold focus:border-transparent
          placeholder:text-voltify-light/30
          transition-all duration-200
          disabled:bg-voltify-dark/30 disabled:text-voltify-light/40 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
