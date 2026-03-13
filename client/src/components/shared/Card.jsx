import React, { memo } from 'react';

/**
 * Card Compound Component
 * Flexible card container with optional header and footer
 */
const Card = memo(({ className = '', children, ...props }) => (
  <div
    className={`bg-voltify-dark/90 rounded-2xl shadow-lg border border-voltify-border ${className}`}
    {...props}
  >
    {children}
  </div>
));

Card.displayName = 'Card';

/**
 * Card.Header - Card title section
 */
const CardHeader = memo(({ className = '', children }) => (
  <div className={`px-6 py-4 border-b border-voltify-border ${className}`}>
    {children}
  </div>
));

CardHeader.displayName = 'Card.Header';

/**
 * Card.Body - Main content section
 */
const CardBody = memo(({ className = '', children }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
));

CardBody.displayName = 'Card.Body';

/**
 * Card.Footer - Footer section
 */
const CardFooter = memo(({ className = '', children }) => (
  <div className={`px-6 py-4 border-t border-voltify-border bg-voltify-dark/50 rounded-b-xl ${className}`}>
    {children}
  </div>
));

CardFooter.displayName = 'Card.Footer';

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
