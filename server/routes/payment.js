import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { verifyToken } from '../middleware/auth.js';
import dotenv from 'dotenv';
import Order from '../models/Order.js';

dotenv.config();

const router = express.Router();

// Initialize Razorpay instance with error checking
let razorpay;

try {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  
  console.log('🔵 Razorpay Initialization Attempt:');
  console.log('   RAZORPAY_KEY_ID present:', !!keyId);
  console.log('   RAZORPAY_KEY_SECRET present:', !!keySecret);
  
  if (!keyId || !keySecret) {
    console.warn('⚠️  WARNING: Razorpay credentials not found in environment variables!');
    console.warn('   → Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment');
    console.warn('   → For Render: Add to Environment Variables in Render Dashboard');
    console.warn('   → Current RAZORPAY_KEY_ID:', keyId ? '✓ Set' : '✗ Missing');
    console.warn('   → Current RAZORPAY_KEY_SECRET:', keySecret ? '✓ Set' : '✗ Missing');
  } else {
    razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
    console.log('✓ Razorpay SDK initialized with credentials');
    console.log('   Key ID starts with:', keyId.substring(0, 8) + '...');
  }
} catch (error) {
  console.error('❌ Failed to initialize Razorpay SDK:', error.message);
  console.error('   Stack:', error.stack);
}

// Health check endpoint for payment service
router.get('/health', (req, res) => {
  const status = {
    status: 'Payment service active',
    razorpayInitialized: !!razorpay,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID ? '✓ Configured' : '✗ Missing',
    razorpaySecret: process.env.RAZORPAY_KEY_SECRET ? '✓ Configured' : '✗ Missing',
    timestamp: new Date().toISOString(),
  };
  
  console.log('🏥 [Health Check]', status);
  res.json(status);
});

// Test Razorpay connection
router.get('/test', async (req, res) => {
  console.log('🧪 [Test] Razorpay connection test initiated');
  
  try {
    if (!razorpay) {
      return res.status(500).json({ 
        message: 'Razorpay not initialized',
        keyId: process.env.RAZORPAY_KEY_ID ? '✓ Set' : '✗ Missing',
        secret: process.env.RAZORPAY_KEY_SECRET ? '✓ Set' : '✗ Missing'
      });
    }

    // Try to fetch account details - this validates credentials
    console.log('📡 [Test] Attempting to fetch account details from Razorpay...');
    const account = await razorpay.customers.all({ count: 1 });
    
    console.log('✓ [Test] Razorpay connection successful');
    res.json({ 
      message: 'Razorpay connection successful',
      razorpayInitialized: true,
      accountAccess: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ [Test Error]', {
      message: error.message,
      statusCode: error.statusCode,
      description: error.description,
    });
    
    res.status(500).json({ 
      message: 'Razorpay connection test failed',
      error: {
        message: error.message,
        statusCode: error.statusCode,
        description: error.description,
        suggestion: error.statusCode === 401 ? 'Invalid Razorpay credentials' : 'Check Razorpay account'
      }
    });
  }
});

// Create order for payment
router.post('/create-order', verifyToken, async (req, res) => {
  try {
    const { amount, items, userEmail, userName, userPhone } = req.body;

    console.log('📥 [Payment Request] Received:', {
      amount,
      itemsCount: items?.length,
      userEmail,
      userName,
      razorpayInitialized: !!razorpay,
      timestamp: new Date().toISOString(),
    });

    // Check if Razorpay is initialized
    if (!razorpay) {
      console.error('❌ [Error] Razorpay SDK not initialized');
      console.error('   Credentials status:', {
        keyId: process.env.RAZORPAY_KEY_ID ? '✓ Set' : '✗ Missing',
        keySecret: process.env.RAZORPAY_KEY_SECRET ? '✓ Set' : '✗ Missing',
      });
      return res.status(500).json({ 
        message: 'Razorpay service not initialized. Check server environment variables.',
      });
    }

    // Validate input
    if (!amount || !items || !userEmail) {
      console.warn('⚠️  [Validation] Missing required fields');
      return res.status(400).json({ message: 'Missing required fields: amount, items, userEmail' });
    }

    // Check maximum allowed amount
    const maxAmountPaise = parseInt(process.env.RAZORPAY_MAX_AMOUNT_PAISE || '5000000', 10);
    const amountPaise = Math.round(Number(amount) * 100);

    if (amountPaise > maxAmountPaise) {
      console.warn('⚠️  [Validation] Amount exceeds maximum');
      return res.status(400).json({ 
        message: `Amount exceeds maximum allowed (₹${(maxAmountPaise/100).toLocaleString()})` 
      });
    }

    // Create Razorpay order
    const options = {
      amount: amountPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userEmail,
        userName,
        items: JSON.stringify(items),
      },
    };

    console.log('🔵 [Razorpay] Creating order with:', { amount: amountPaise, currency: 'INR', receipt: options.receipt });

    const razorpayOrder = await razorpay.orders.create(options);

    console.log('✓ [Success] Razorpay order created:', razorpayOrder.id);

    res.json({
      orderId: razorpayOrder.id,
      amount: amount,
      keyId: process.env.RAZORPAY_KEY_ID,
      email: userEmail,
      name: userName,
      phone: userPhone,
    });
  } catch (error) {
    console.error('❌ [Error] Payment creation failed');
    console.error('   Error Type:', error.constructor.name);
    console.error('   Message:', error.message);
    console.error('   Status Code:', error.statusCode);
    console.error('   Code:', error.code);
    console.error('   Description:', error.description);
    console.error('   Full Error:', JSON.stringify(error, null, 2));
    
    // Handle specific error cases
    if (error.statusCode === 401) {
      console.error('   → 401 Unauthorized: Invalid Razorpay credentials');
      return res.status(500).json({ 
        message: 'Razorpay authentication failed. Check API credentials on Render.',
        details: '401 Unauthorized - verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET'
      });
    }
    
    if (error.statusCode === 400) {
      return res.status(400).json({ 
        message: `Razorpay validation error: ${error.description || error.message}` 
      });
    }
    
    if (error.message?.includes('ECONNREFUSED')) {
      return res.status(500).json({ message: 'Cannot reach Razorpay service' });
    }
    
    // Fallback error response
    res.status(500).json({ 
      message: error.description || error.message || 'Failed to create payment order',
      errorType: error.constructor.name,
      timestamp: new Date().toISOString()
    });
  }
});

// Verify payment
router.post('/verify-payment', verifyToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items, amount, shippingInfo } = req.body;

    // Validate inputs
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment details' });
    }

    // Check if key is configured
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: 'Payment service not configured' });
    }

    // Verify signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      console.error('Signature mismatch:', { generated: generatedSignature, received: razorpay_signature });
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Payment is verified, create order in database
    // Normalize items to match Order schema: products -> [{ productId, quantity, price }]
    const products = (items || []).map((it) => ({
      productId: it._id || it.productId || it.id,
      quantity: it.quantity || 1,
      price: it.price || it.unitPrice || 0,
    }));

    const order = new Order({
      userId: req.userId,
      products,
      shippingInfo: shippingInfo || {},
      totalAmount: amount,
    });

    await order.save();

    console.log('Order saved successfully:', order._id);

    res.json({
      message: 'Payment verified successfully',
      order,
    });
  } catch (error) {
    console.error('Error verifying payment:', error.message || error);
    res.status(500).json({ message: 'Failed to verify payment. Check server logs.' });
  }
});

export default router;
