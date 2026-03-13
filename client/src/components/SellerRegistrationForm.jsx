import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import { Card, Input, Select, Button, Alert } from './shared';

/**
 * Multi-step seller registration form component
 * Guides users through the seller onboarding process
 */
const SellerRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Step 1: Business Details
    storeName: '',
    businessType: '',
    gstNumber: '',
    description: '',
    
    // Step 2: Bank Details
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    accountType: '',
    
    // Step 3: Documents
    gstCertificate: '',
    idProof: '',
    idProofType: '',
  });

  const [documentPreviews, setDocumentPreviews] = useState({
    gstCertificate: null,
    idProof: null,
  });

  const businessTypeOptions = [
    { label: 'Individual', value: 'Individual' },
    { label: 'Partnership', value: 'Partnership' },
    { label: 'Private Limited', value: 'Private Limited' },
    { label: 'LLP', value: 'LLP' },
    { label: 'Public Limited', value: 'Public Limited' },
  ];

  const accountTypeOptions = [
    { label: 'Savings', value: 'Savings' },
    { label: 'Current', value: 'Current' },
  ];

  const idProofTypeOptions = [
    { label: 'Aadhaar', value: 'Aadhaar' },
    { label: 'PAN', value: 'PAN' },
    { label: 'Passport', value: 'Passport' },
    { label: 'Voter ID', value: 'Voter ID' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const token = localStorage.getItem('token');
      const response = await api.post('/products/upload/image', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      const imageUrl = response.data.imageUrl;
      setFormData(prev => ({ ...prev, [fieldName]: imageUrl }));
      setDocumentPreviews(prev => ({ ...prev, [fieldName]: imageUrl }));
      setMessage({ type: 'success', text: 'Document uploaded successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to upload document' });
    }
  };

  const validateStep1 = () => {
    if (!formData.storeName.trim()) {
      setMessage({ type: 'error', text: 'Store name is required' });
      return false;
    }
    if (!formData.businessType) {
      setMessage({ type: 'error', text: 'Business type is required' });
      return false;
    }
    if (!formData.gstNumber.trim()) {
      setMessage({ type: 'error', text: 'GST number is required' });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.bankName.trim()) {
      setMessage({ type: 'error', text: 'Bank name is required' });
      return false;
    }
    if (!formData.accountHolderName.trim()) {
      setMessage({ type: 'error', text: 'Account holder name is required' });
      return false;
    }
    if (!formData.accountNumber.trim()) {
      setMessage({ type: 'error', text: 'Account number is required' });
      return false;
    }
    if (!formData.ifscCode.trim()) {
      setMessage({ type: 'error', text: 'IFSC code is required' });
      return false;
    }
    if (!formData.accountType) {
      setMessage({ type: 'error', text: 'Account type is required' });
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.gstCertificate) {
      setMessage({ type: 'error', text: 'GST certificate is required' });
      return false;
    }
    if (!formData.idProof) {
      setMessage({ type: 'error', text: 'ID proof is required' });
      return false;
    }
    if (!formData.idProofType) {
      setMessage({ type: 'error', text: 'ID proof type is required' });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setMessage({ type: '', text: '' });
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 3 && !validateStep3()) return;
    
    setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setMessage({ type: '', text: '' });
    if (!validateStep3()) return;

    setLoading(true);
    try {
      const response = await api.post('/sellers/register', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setMessage({ type: 'success', text: 'Application submitted successfully!' });
      setTimeout(() => {
        navigate('/seller/status');
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to submit application';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-voltify-dark pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-voltify-light mb-3">Become a Voltify Seller</h1>
          <p className="text-voltify-light/60 text-lg">Start selling on India's fastest e-commerce platform</p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div className="mb-10 flex justify-between items-center">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                  step <= currentStep
                    ? 'bg-voltify-gold text-voltify-dark'
                    : 'bg-voltify-dark/50 text-voltify-light/60 border border-voltify-border'
                }`}
              >
                {step < currentStep ? '✓' : step}
              </motion.div>
              {step < 4 && (
                <div
                  className={`flex-1 h-1 mx-3 transition-all ${
                    step < currentStep ? 'bg-voltify-gold' : 'bg-voltify-dark/30'
                  }`}
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Alert Messages */}
        {message.text && (
          <Alert type={message.type} message={message.text} />
        )}

        {/* Form Steps */}
        <Card className="bg-voltify-dark border border-voltify-border">
          <Card.Body className="space-y-6">
            {/* Step 1: Business Details */}
            {currentStep === 1 && (
              <motion.div
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-bold text-voltify-light mb-6">Business Details</h2>
                  
                  <Input
                    label="Store Name"
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleInputChange}
                    placeholder="Your store name"
                    containerClassName="mb-4"
                  />

                  <Select
                    label="Business Type"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    options={businessTypeOptions}
                    containerClassName="mb-4"
                  />

                  <Input
                    label="GST Number"
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleInputChange}
                    placeholder="18-character GSTIN"
                    containerClassName="mb-4"
                  />

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-voltify-light">
                      Store Description (Optional)
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 bg-voltify-dark/50 border border-voltify-border rounded-lg text-voltify-light placeholder-voltify-light/40 focus:outline-none focus:ring-2 focus:ring-voltify-gold focus:border-transparent"
                      placeholder="Tell customers about your store"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Bank Details */}
            {currentStep === 2 && (
              <motion.div
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-5"
              >
                <h2 className="text-2xl font-bold text-voltify-light mb-6">Bank Account Details</h2>
                
                <Input
                  label="Bank Name"
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  placeholder="e.g., HDFC Bank"
                  containerClassName="mb-4"
                />

                <Input
                  label="Account Holder Name"
                  type="text"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleInputChange}
                  placeholder="Name on bank account"
                  containerClassName="mb-4"
                />

                <Input
                  label="Account Number"
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  placeholder="Bank account number"
                  containerClassName="mb-4"
                />

                <Input
                  label="IFSC Code"
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleInputChange}
                  placeholder="e.g., HDFC0000123"
                  containerClassName="mb-4"
                />

                <Select
                  label="Account Type"
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleInputChange}
                  options={accountTypeOptions}
                />
              </motion.div>
            )}

            {/* Step 3: Documents */}
            {currentStep === 3 && (
              <motion.div
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-5"
              >
                <h2 className="text-2xl font-bold text-voltify-light mb-6">Upload Documents</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-voltify-light mb-3">
                      GST Certificate
                    </label>
                    <div className="border-2 border-dashed border-voltify-border rounded-lg p-6 text-center hover:border-voltify-gold transition hover:bg-voltify-dark/50">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFileUpload(e, 'gstCertificate')}
                        className="hidden"
                        id="gst-upload"
                      />
                      <label htmlFor="gst-upload" className="cursor-pointer">
                        {documentPreviews.gstCertificate ? (
                          <div>
                            <img src={documentPreviews.gstCertificate} alt="GST" className="max-h-40 mx-auto mb-2" />
                            <p className="text-sm text-voltify-gold">✓ Document uploaded</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-voltify-light/70 font-medium">Click to upload GST certificate</p>
                            <p className="text-xs text-voltify-light/50 mt-1">PDF or Image</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-voltify-light mb-3">
                      ID Proof Type
                    </label>
                    <Select
                      name="idProofType"
                      value={formData.idProofType}
                      onChange={handleInputChange}
                      options={idProofTypeOptions}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-voltify-light mb-3">
                      ID Proof Document
                    </label>
                    <div className="border-2 border-dashed border-voltify-border rounded-lg p-6 text-center hover:border-voltify-gold transition hover:bg-voltify-dark/50">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFileUpload(e, 'idProof')}
                        className="hidden"
                        id="id-upload"
                      />
                      <label htmlFor="id-upload" className="cursor-pointer">
                        {documentPreviews.idProof ? (
                          <div>
                            <img src={documentPreviews.idProof} alt="ID" className="max-h-40 mx-auto mb-2" />
                            <p className="text-sm text-voltify-gold">✓ Document uploaded</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-voltify-light/70 font-medium">Click to upload ID proof</p>
                            <p className="text-xs text-voltify-light/50 mt-1">PDF or Image</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <motion.div
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-5"
              >
                <h2 className="text-2xl font-bold text-voltify-light mb-6">Review Your Information</h2>
                
                <div className="bg-voltify-dark/50 rounded-lg p-6 space-y-4">
                  <div className="border-b border-voltify-border pb-4">
                    <h3 className="font-semibold text-voltify-light mb-2">Business Details</h3>
                    <p className="text-voltify-light/70"><strong>Store Name:</strong> {formData.storeName}</p>
                    <p className="text-voltify-light/70"><strong>Business Type:</strong> {formData.businessType}</p>
                    <p className="text-voltify-light/70"><strong>GST Number:</strong> {formData.gstNumber}</p>
                  </div>

                  <div className="border-b border-voltify-border pb-4">
                    <h3 className="font-semibold text-voltify-light mb-2">Bank Details</h3>
                    <p className="text-voltify-light/70"><strong>Bank:</strong> {formData.bankName}</p>
                    <p className="text-voltify-light/70"><strong>Account Holder:</strong> {formData.accountHolderName}</p>
                    <p className="text-voltify-light/70"><strong>Account Type:</strong> {formData.accountType}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-voltify-light mb-2">Documents</h3>
                    <p className="text-voltify-light/70"><strong>GST Certificate:</strong> ✓ Uploaded</p>
                    <p className="text-voltify-light/70"><strong>ID Proof:</strong> ✓ Uploaded ({formData.idProofType})</p>
                  </div>
                </div>

                <div className="bg-voltify-gold/20 border border-voltify-gold/40 rounded-lg p-4">
                  <p className="text-sm text-voltify-light">
                    <strong>⏱️ Approval Timeline:</strong> Your application will be reviewed within 48 hours. We'll send you an email notification once it's approved or if we need any additional information.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between gap-4 mt-8">
              {currentStep > 1 && (
                <Button
                  onClick={handlePrev}
                  variant="secondary"
                  className="flex-1"
                >
                  Back
                </Button>
              )}
              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  className="flex-1"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  isLoading={loading}
                  disabled={loading}
                  className="flex-1"
                >
                  Submit Application
                </Button>
              )}
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default SellerRegistrationForm;
