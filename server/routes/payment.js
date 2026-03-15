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
  res.json({
    status: 'Payment service healthy',
    razorpayInitialized: !!razorpay,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID ? '✓ Configured' : '✗ Missing',
    razorpaySecret: process.env.RAZORPAY_KEY_SECRET ? '✓ Configured' : '✗ Missing',
    timestamp: new Date().toISOString(),
  });
});

// Create order for payment
router.post('/create-order', verifyToken, async (req, res) => {
  try {
    const { amount, items, userEmail, userName, userPhone } = req.body;

    // Log the request details
    console.log('📥 Payment request received:', {
      hasUser: !!verifyToken,
      amount,
      userEmail,
      razorpayInitialized: !!razorpay,
      env: process.env.NODE_ENV,
    });

    // Check if Razorpay is initialized
    if (!razorpay) {
      console.error('❌ Razorpay not initialized');
      console.error('Razorpay state:', {
        keyId: process.env.RAZORPAY_KEY_ID ? '✓ Set' : '✗ Missing',
        keySecret: process.env.RAZORPAY_KEY_SECRET ? '✓ Set' : '✗ Missing',
      });
      return res.status(500).json({ 
        message: 'Payment service not configured. Razorpay initialization failed.',
        debug: process.env.NODE_ENV === 'development' ? {
          razorpayKeyId: process.env.RAZORPAY_KEY_ID ? '✓ Set' : '✗ Missing',
          razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET ? '✓ Set' : '✗ Missing',
        } : undefined
      });
    }

    // Validate input
    if (!amount || !items || !userEmail) {
      return res.status(400).json({ message: 'Missing required fields: amount, items, userEmail' });
    }

    // Check maximum allowed amount (useful for test mode limits)
    const maxAmountPaise = parseInt(process.env.RAZORPAY_MAX_AMOUNT_PAISE || '5000000', 10); // default ₹50,000
    const amountPaise = Math.round(Number(amount) * 100);

    if (amountPaise > maxAmountPaise) {
      return res.status(400).json({ 
        message: `Amount exceeds maximum allowed for payments (₹${(maxAmountPaise/100).toLocaleString()}). Try a smaller amount or update RAZORPAY_MAX_AMOUNT_PAISE in server .env for testing.` 
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

    console.log('Creating Razorpay order with options:', { amount: amountPaise, currency: 'INR', userEmail });

    const razorpayOrder = await razorpay.orders.create(options);

    console.log('✓ Razorpay order created successfully:', razorpayOrder.id);

    res.json({
      orderId: razorpayOrder.id,
      amount: amount,
      keyId: process.env.RAZORPAY_KEY_ID,
      email: userEmail,
      name: userName,
      phone: userPhone,
    });
  } catch (error) {
    console.error('❌ Error creating Razorpay order:', {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      description: error.description,
      response: error.response,
      fullError: error.toString(),
      stack: error.stack,
    });
    
    // Handle 401 Unauthorized - Invalid credentials
    if (error.statusCode === 401) {
      console.error('❌ Razorpay API Authentication Failed (401 Unauthorized)');
      console.error('Verify that RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Render environment variables match your Razorpay account');
      return res.status(500).json({ 
        message: 'Payment service authentication failed. Invalid Razorpay credentials.',
        debug: 'Check that RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are correctly set on Render'
      });
    }
    
    if (error.description) {
      return res.status(400).json({ message: `Razorpay Error: ${error.description}` });
    }
    
    if (error.message?.includes('ECONNREFUSED')) {
      return res.status(500).json({ message: 'Cannot connect to Razorpay. Check internet connection.' });
    }
    
    if (error.message?.includes('Invalid API key')) {
      return res.status(500).json({ message: 'Invalid Razorpay API credentials. Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env' });
    }
    
    res.status(500).json({ 
      message: `Failed to create order: ${error.message || 'Unknown error'}`, 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      statusCode: error.statusCode
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
