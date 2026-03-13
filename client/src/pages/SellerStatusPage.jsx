import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import { Card, Button, Alert } from '../components/shared';

/**
 * Seller Status Page - Shows application status and approval timeline
 */
const SellerStatusPage = () => {
  const [seller, setSteller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellerStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/sellers/status', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSteller(response.data.seller);
      } catch (err) {
        if (err.response?.status === 404) {
          setMessage({ 
            type: 'error', 
            text: 'Seller application not found. Please complete the registration.' 
          });
        } else {
          setMessage({ 
            type: 'error', 
            text: 'Failed to fetch seller status' 
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSellerStatus();
    
    // Poll for status updates every 30 seconds
    const pollInterval = setInterval(fetchSellerStatus, 30000);
    
    return () => clearInterval(pollInterval);
  }, []);

  const getStatusIcon = () => {
    if (!seller) return '⏳';
    switch (seller.status) {
      case 'pending':
        return '⏳';
      case 'approved':
        return '✓';
      case 'rejected':
        return '✗';
      default:
        return '?';
    }
  };

  const getStatusText = () => {
    if (!seller) return 'Loading...';
    switch (seller.status) {
      case 'pending':
        return 'Under Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-voltify-dark pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-voltify-light mb-3">Application Status</h1>
          <p className="text-voltify-light/60 text-lg">Track your seller application status</p>
        </motion.div>

        {/* Alert Messages */}
        {message.text && (
          <Alert type={message.type} message={message.text} />
        )}

        {/* Loading State */}
        {loading && (
          <motion.div 
            className="text-center py-12"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="inline-block">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-voltify-gold"></div>
            </div>
            <p className="text-voltify-light/60 mt-4">Loading your application status...</p>
          </motion.div>
        )}

        {/* Status Card */}
        {!loading && seller && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-voltify-dark border border-voltify-border">
              <Card.Body className="space-y-8">
                {/* Status Indicator */}
                <div className="text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block"
                  >
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl ${
                      seller.status === 'pending' ? 'bg-blue-500/20 border-2 border-blue-500/50' :
                      seller.status === 'approved' ? 'bg-green-500/20 border-2 border-green-500/50' :
                      'bg-red-500/20 border-2 border-red-500/50'
                    }`}>
                      {getStatusIcon()}
                    </div>
                  </motion.div>
                  <h2 className={`text-3xl font-black mt-6 ${
                    seller.status === 'pending' ? 'text-blue-400' :
                    seller.status === 'approved' ? 'text-green-400' :
                    'text-red-400'
                  }`}>
                    {getStatusText()}
                  </h2>
                </div>

                {/* Status Details */}
                <div className="bg-voltify-dark/50 rounded-lg p-6 space-y-4">
                  <div className="border-b border-voltify-border pb-4">
                    <p className="text-xs font-semibold text-voltify-light/60 uppercase">Store Information</p>
                    <h3 className="text-2xl font-bold text-voltify-light mt-1">{seller.storeName}</h3>
                    <p className="text-voltify-light/70 mt-2">
                      <strong>GST:</strong> {seller.gstNumber}
                    </p>
                  </div>

                  <div className="border-b border-voltify-border pb-4">
                    <p className="text-xs font-semibold text-voltify-light/60 uppercase">Application Timeline</p>
                    <p className="text-voltify-light/70 mt-2">
                      <strong>Submitted:</strong> {new Date(seller.submittedAt).toLocaleDateString()}
                    </p>
                    {seller.approvedAt && (
                      <p className="text-green-400 mt-1">
                        <strong>✓ Approved:</strong> {new Date(seller.approvedAt).toLocaleDateString()}
                      </p>
                    )}
                    {seller.rejectedAt && (
                      <p className="text-red-400 mt-1">
                        <strong>✗ Rejected:</strong> {new Date(seller.rejectedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {seller.status === 'pending' && (
                    <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                      <p className="text-sm text-blue-200">
                        <strong>⏱️ Approval Timeline:</strong> Your application is being reviewed. We'll notify you via email within 48 hours.
                      </p>
                    </div>
                  )}

                  {seller.status === 'approved' && (
                    <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                      <p className="text-sm text-green-200">
                        <strong>✓ Congratulations!</strong> Your seller account has been approved. You can now start uploading products and managing your storefront.
                      </p>
                    </div>
                  )}

                  {seller.status === 'rejected' && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                      <p className="text-sm text-red-200 mb-2">
                        <strong>✗ Application Rejected</strong>
                      </p>
                      <p className="text-sm text-red-200">
                        <strong>Reason:</strong> {seller.rejectionReason || 'Please contact support for details'}
                      </p>
                      <p className="text-sm text-red-200 mt-2">
                        You can reapply with corrected information. Contact our support team for assistance.
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  {seller.status === 'approved' && (
                    <Button
                      onClick={() => navigate('/seller/dashboard')}
                      className="flex-1"
                    >
                      Go to Seller Dashboard
                    </Button>
                  )}
                  {seller.status === 'rejected' && (
                    <Button
                      onClick={() => navigate('/become-seller')}
                      className="flex-1"
                    >
                      Reapply
                    </Button>
                  )}
                  <Button
                    onClick={() => navigate('/')}
                    variant="secondary"
                    className="flex-1"
                  >
                    Back to Home
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        )}

        {!loading && !seller && !message.text && (
          <Card className="bg-voltify-dark border border-voltify-border">
            <Card.Body className="text-center space-y-6">
              <p className="text-voltify-light/70">You haven't applied as a seller yet.</p>
              <Button
                onClick={() => navigate('/become-seller')}
                className="w-full"
              >
                Start Seller Registration
              </Button>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SellerStatusPage;
