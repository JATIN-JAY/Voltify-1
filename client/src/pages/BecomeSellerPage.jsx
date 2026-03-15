import React from 'react';
import { Helmet } from 'react-helmet-async';
import SellerRegistrationForm from '../components/SellerRegistrationForm';
import { getGenericSocialMeta } from '../utils/socialMetaTags';

/**
 * Page wrapper for Seller Registration
 */
const BecomeSellerPage = () => {
  return (
    <>
      <Helmet>
        <title>Become a Seller | Voltify</title>
        <meta name="description" content="Register as a seller on Voltify. Access millions of buyers, grow your business, and increase your revenue with our seller platform." />
        
        {/* Open Graph & Twitter Card Meta Tags */}
        {getGenericSocialMeta(
          'Become a Seller | Voltify',
          'Register as a seller on Voltify and grow your business.'
        ).map((meta, idx) => (
          meta.name ? (
            <meta key={idx} name={meta.name} content={meta.content} />
          ) : (
            <meta key={idx} property={meta.property} content={meta.content} />
          )
        ))}
      </Helmet>
      <SellerRegistrationForm />
    </>
  );
};

export default BecomeSellerPage;
