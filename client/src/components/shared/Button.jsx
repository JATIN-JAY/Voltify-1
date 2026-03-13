import React, { memo } from 'react';
import { motion } from 'framer-motion';

/**
 * Button Compound Component with variants
 * Supports primary, secondary, danger variants with loading states
 */
const Button = memo(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  animate = true,
  ...props
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 inline-flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-voltify-gold text-voltify-dark hover:shadow-lg disabled:opacity-50 hover:bg-voltify-gold/90',
    secondary: 'bg-voltify-dark/50 text-voltify-light border border-voltify-border hover:bg-voltify-dark/70 disabled:opacity-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50',
    ghost: 'text-voltify-light hover:bg-voltify-dark/30 disabled:opacity-50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const Component = animate ? motion.button : 'button';
  
  return (
    <Component
      {...(animate && {
        whileHover: !disabled ? { scale: 1.02 } : {},
        whileTap: !disabled ? { scale: 0.98 } : {},
      })}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      )}
      {children}
    </Component>
  );
});

Button.displayName = 'Button';

export default Button;
