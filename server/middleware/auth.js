import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    console.error('❌ No token provided in Authorization header');
    return res.status(401).json({ message: 'No authentication token provided. Please log in.' });
  }

  try {
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET not configured in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error('❌ Token verification failed:', {
      errorName: error.name,
      errorMessage: error.message,
      tokenLength: token.length,
    });

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid authentication token. Please log in again.' });
    }

    res.status(401).json({ message: 'Authentication failed. Please log in again.' });
  }
};

// Check if user is admin
export const checkAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const adminEmail = process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL.toLowerCase();
    const isAdminEmail = adminEmail && user.email.toLowerCase() === adminEmail;
    if (!user.isAdmin && !isAdminEmail) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
