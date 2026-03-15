import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import googleAuthRoutes from './routes/google-auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import paymentRoutes from './routes/payment.js';
import sellerRoutes from './routes/sellers.js';
import Product from './models/Product.js';

dotenv.config();

const app = express();

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is missing in server/.env');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.set('bufferCommands', false);

mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

mongoose.connection.on('error', (err) => {
  console.error('MongoDB runtime error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth/google', googleAuthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/sellers', sellerRoutes);

// Sitemap XML route - for Google SEO
app.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || 'https://voltify.in';
    
    // Fetch all products from database
    const products = await Product.find({ slug: { $exists: true, $ne: null } }, { slug: 1, category: 1, updatedAt: 1 });
    
    // Generate XML sitemap
    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Homepage - highest priority, daily updates
    xmlContent += `  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`;

    // Category pages - high priority, daily updates
    const categories = ['mobiles', 'tablets', 'audio', 'accessories'];
    categories.forEach(category => {
      xmlContent += `  <url>
    <loc>${baseUrl}/${category}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    // Product pages - medium priority, weekly updates
    products.forEach(product => {
      if (product.slug && product.category) {
        const categorySlug = product.category.toLowerCase().replace(/\s+/g, '-');
        const lastModDate = product.updatedAt 
          ? product.updatedAt.toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];
        
        xmlContent += `  <url>
    <loc>${baseUrl}/${categorySlug}/${product.slug}</loc>
    <lastmod>${lastModDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
      }
    });

    // Static pages
    const staticPages = [
      { path: '/become-a-seller', priority: 0.7, changefreq: 'monthly' },
    ];
    
    staticPages.forEach(page => {
      xmlContent += `  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    });

    xmlContent += `</urlset>`;

    res.type('application/xml');
    res.send(xmlContent);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Robots.txt route - for search engine crawlers
app.get('/robots.txt', (req, res) => {
  const robotsContent = `# Voltify Robots.txt - SEO Configuration
# Allows search engine crawlers to index the site efficiently

# Allow all crawlers by default
User-agent: *
Allow: /

# Disallow admin paths (protected routes)
Disallow: /admin/
Disallow: /admin

# Disallow checkout and cart paths (user-specific pages)
Disallow: /cart
Disallow: /checkout

# Disallow authentication pages (to prevent indexing user flows)
Disallow: /login
Disallow: /register

# Disallow address and profile pages (user-specific data)
Disallow: /addresses
Disallow: /profile

# Disallow order pages (user-specific data)
Disallow: /orders

# Disallow wishlist pages (user-specific data)
Disallow: /wishlist

# Point to sitemap for better indexing
Sitemap: ${process.env.FRONTEND_URL || 'https://voltify.in'}/sitemap.xml

# Crawl delay (optional - be respectful to server)
# Crawl-delay: 1

# Specific rules for Google
User-agent: Googlebot
Allow: /
Crawl-delay: 0

# Specific rules for Bing
User-agent: Bingbot
Allow: /
Crawl-delay: 1

# Bad bots to block
User-agent: MJ12bot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /
`;
  res.type('text/plain');
  res.send(robotsContent);
});

// Basic route
app.get('/api', (req, res) => {
  res.json({ message: 'E-Commerce API' });
});

const PORT = parseInt(process.env.PORT, 10) || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} already in use. Stop the running process or change PORT in .env.`);
    process.exit(1);
  }
  console.error('Server error:', err);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down server...');
  server.close(() => process.exit(0));
});
