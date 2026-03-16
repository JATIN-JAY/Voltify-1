import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  isAdmin: user.isAdmin,
  phone: user.phone || '',
  addresses: user.addresses || [],
  wishlist: user.wishlist || [],
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('wishlist');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: buildUserResponse(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (typeof name === 'string' && name.trim()) {
      user.name = name.trim();
    }

    if (phone !== undefined) {
      user.phone = String(phone || '').trim();
    }

    await user.save();
    const updated = await User.findById(req.userId).select('-password').populate('wishlist');

    res.json({ user: buildUserResponse(updated) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/addresses', verifyToken, async (req, res) => {
  try {
    const { addresses } = req.body;

    if (!Array.isArray(addresses)) {
      return res.status(400).json({ message: 'addresses must be an array' });
    }

    const normalized = addresses.map((item) => ({
      fullName: String(item?.fullName || '').trim(),
      address: String(item?.address || '').trim(),
      city: String(item?.city || '').trim(),
      zipCode: String(item?.zipCode || '').trim(),
    }));

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.addresses = normalized;
    await user.save();

    const updated = await User.findById(req.userId).select('-password').populate('wishlist');
    res.json({ user: buildUserResponse(updated) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/wishlist', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('wishlist');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ wishlist: user.wishlist || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/wishlist/:productId', verifyToken, async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const alreadyExists = user.wishlist.some((id) => String(id) === productId);
    if (!alreadyExists) {
      user.wishlist.push(productId);
      await user.save();
    }

    const updated = await User.findById(req.userId).populate('wishlist');
    res.json({ wishlist: updated.wishlist || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/wishlist/:productId', verifyToken, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.wishlist = user.wishlist.filter((id) => String(id) !== productId);
    await user.save();

    const updated = await User.findById(req.userId).populate('wishlist');
    res.json({ wishlist: updated.wishlist || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;
