import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ModalContext } from '../context/ModalContext';
import { useProfile } from '../hooks';
import { Card, Input, Button, Alert } from '../components/shared';
import { getGenericSocialMeta } from '../utils/socialMetaTags';

/**
 * ProfilePage Component - Refactored with shared UI components
 * Uses useProfile hook for all form logic and state management
 */
export default function ProfilePage() {
  const { openModal } = useContext(ModalContext);
  const {
    user,
    editing,
    saving,
    message,
    draft,
    handleInputChange,
    startEditing,
    cancelEditing,
    handleSubmit,
  } = useProfile();

  // Not logged in view
  if (!user) {
    return (
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
          <h2 className="text-3xl font-black tracking-tight mb-2 text-voltify-light">Please Log In</h2>
          <p className="text-voltify-light/60 mb-6">You need to be logged in to edit your profile.</p>
          <button onClick={() => openModal('login')}>
            <Button variant="primary" size="lg">
              Go to Login
            </Button>
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Profile | Voltify</title>
        <meta name="description" content="Manage your Voltify profile, view your orders and addresses." />
        
        {/* Open Graph & Twitter Card Meta Tags */}
        {getGenericSocialMeta(
          'My Profile | Voltify',
          'Manage your Voltify profile, view your orders and addresses.'
        ).map((meta, idx) => (
          meta.name ? (
            <meta key={idx} name={meta.name} content={meta.content} />
          ) : (
            <meta key={idx} property={meta.property} content={meta.content} />
          )
        ))}
        
        {/* JSON-LD BreadcrumbList Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": `${window.location.origin}/`
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Profile",
                "item": window.location.href
              }
            ]
          })}
        </script>
      </Helmet>
      <div className="min-h-screen bg-voltify-dark py-12 md:py-24">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-4xl font-black tracking-tight text-voltify-light">My Profile</h1>
          {!editing && (
            <Button
              onClick={startEditing}
              variant="primary"
              size="sm"
            >
              Edit Profile
            </Button>
          )}
        </motion.div>

        {/* Alert Messages */}
        {message.text && (
          <Alert type={message.type} message={message.text} />
        )}

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-[#1f1c19] border border-voltify-border/20 rounded-2xl">
            <Card.Body className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <Input
                    label="Full Name"
                    type="text"
                    name="name"
                    value={editing ? draft.name : user.name}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={editing ? '' : 'bg-voltify-dark/40 cursor-not-allowed text-voltify-light/50'}
                  />
                </div>

                {/* Email Field (Read-only) */}
                <div>
                  <Input
                    label="Email Address"
                    type="email"
                    value={user.email}
                    disabled
                    className="bg-voltify-dark/40 cursor-not-allowed text-voltify-light/50"
                  />
                  <p className="text-xs text-voltify-light/50 mt-2">Email cannot be changed</p>
                </div>

                {/* Phone Field */}
                <div>
                  <Input
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    value={editing ? draft.phone : user.phone}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className={editing ? '' : 'bg-voltify-dark/40 cursor-not-allowed text-voltify-light/50'}
                    placeholder="+91 XXXXXXXXXX"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t border-voltify-border/20">
                  {editing ? (
                    <>
                      <Button
                        onClick={cancelEditing}
                        variant="secondary"
                        size="md"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        isLoading={saving}
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </>
                  ) : null}
                </div>
              </form>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Additional Links */}
        {!editing && (
          <motion.div
            className="mt-8 grid grid-cols-2 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/addresses">
              <Card className="bg-[#1f1c19] cursor-pointer hover:border-voltify-gold/40 transition-all duration-300 border border-voltify-border/20 rounded-2xl">
                <Card.Body className="text-center py-8 px-6">
                  <svg className="w-8 h-8 mx-auto mb-3 text-voltify-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h3 className="font-semibold text-voltify-light">Addresses</h3>
                  <p className="text-sm text-voltify-light/60 mt-2">Manage delivery addresses</p>
                </Card.Body>
              </Card>
            </Link>

            <Link to="/orders">
              <Card className="bg-[#1f1c19] cursor-pointer hover:border-voltify-gold/40 transition-all duration-300 border border-voltify-border/20 rounded-2xl">
                <Card.Body className="text-center py-8 px-6">
                  <svg className="w-8 h-8 mx-auto mb-3 text-voltify-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <h3 className="font-semibold text-voltify-light">Orders</h3>
                  <p className="text-sm text-voltify-light/60 mt-2">View your order history</p>
                </Card.Body>
              </Card>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
    </>
  );
};
