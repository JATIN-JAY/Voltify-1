import express from 'express';
import Order from '../models/Order.js';
import { verifyToken, checkAdmin } from '../middleware/auth.js';

const router = express.Router();

// Create order
router.post('/', verifyToken, async (req, res) => {
  try {
    const { products, shippingInfo, totalAmount } = req.body;

    const order = new Order({
      userId: req.userId,
      products,
      shippingInfo,
      totalAmount,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user orders
router.get('/', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).populate('products.productId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin sales summary
router.get('/admin/summary', verifyToken, checkAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    const totalOrders = orders.length;
    const totalSales = orders.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    );
    const averageOrderValue = totalOrders ? totalSales / totalOrders : 0;

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email');

    res.json({
      totalOrders,
      totalSales,
      averageOrderValue,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
