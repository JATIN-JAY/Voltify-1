import React from 'react';
import Footer from '../components/Footer';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0f0f0f' }}>
      {/* Add padding-top to account for fixed navbar + promo strip */}
      <main className="flex-1 pt-24">
        {children}
      </main>

      <Footer />
    </div>
  );
}
