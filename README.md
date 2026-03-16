# Voltify - Premium E-Commerce Platform

A full-featured e-commerce platform with advanced merchant capabilities, modern UI/UX, and production-ready architecture. Built with React 18, Node.js, and MongoDB, featuring Google OAuth, Razorpay payments, and an admin dashboard for managing products and orders.

## ✨ Core Features

### For Customers
- **Account Management** - JWT + Google OAuth authentication, profile management, address management
- **Product Discovery** - Browse by categories, search with filters, view detailed product pages with SEO slugs
- **Shopping Experience** - Dynamic cart with localStorage persistence, wishlist functionality, quantity management
- **Payments** - Seamless Razorpay integration for secure transactions
- **Order Tracking** - View order history with detailed status tracking
- **Reviews & Feedback** - Customer feedback submission and ratings system

### For Sellers
- **Merchant Dashboard** - Register and manage seller accounts
- **Product Management** - Add/edit/delete products with image upload via Cloudinary
- **Order Management** - View and manage seller orders
- **Earnings Tracking** - Monitor commission-based earnings
- **Inventory Control** - Manage product stock and availability

### For Admins
- **Admin Dashboard** - Full platform oversight and management
- **Product Administration** - CRUD operations, bulk management, stock control
- **Order Management** - Process, track, and fulfill all platform orders
- **Seller Management** - Approve/manage seller accounts and commissions
- **User Management** - Manage customer and seller accounts

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with Express.js 4.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JsonWebToken) + Google OAuth Library
- **Security**: bcryptjs for password hashing, CORS enabled
- **Payment**: Razorpay SDK integration
- **Image Storage**: Cloudinary for media management
- **Image Processing**: Sharp for optimization
- **Email**: Nodemailer for transactional emails
- **File Upload**: Multer middleware
- **Environment**: dotenv for configuration

### Frontend
- **Framework**: React 18 with Vite bundler
- **Styling**: Tailwind CSS 3.x + custom CSS
- **Routing**: React Router DOM v6
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Authentication**: Google OAuth (@react-oauth/google)
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React for scalable SVG icons
- **SEO**: React Helmet Async for meta tags
- **JWT Decoding**: jwt-decode for token parsing

## 📁 Project Structure

```
Voltify/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── SellerProduct.js
│   │   ├── Seller.js
│   │   ├── Order.js
│   │   ├── SellerEarnings.js
│   │   └── Feedback.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── google-auth.js
│   │   ├── products.js
│   │   ├── sellers.js
│   │   ├── orders.js
│   │   ├── payment.js
│   │   └── feedback.js
│   ├── middleware/
│   │   └── auth.js
│   ├── utils/
│   │   ├── imageOptimization.js
│   │   ├── productDataUtils.js
│   │   └── slugify.js
│   ├── server.js
│   ├── seed.js
│   ├── create-admin.js
│   ├── migrate-slugs.js
│   ├── package.json
│   └── .env
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── HeroSection.jsx
    │   │   ├── ProductGrid.jsx
    │   │   ├── ProductForm.jsx
    │   │   ├── RazorpayCheckout.jsx
    │   │   ├── AdminSidebar.jsx
    │   │   ├── ConfirmationModal.jsx
    │   │   ├── SearchOverlay.jsx
    │   │   └── shared/
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── ProductDetailPage.jsx
    │   │   ├── CartPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── AdminProductsPage.jsx
    │   │   ├── AdminProductAddPage.jsx
    │   │   ├── AdminProductEditPage.jsx
    │   │   ├── BecomeSellerPage.jsx
    │   │   ├── SellerStatusPage.jsx
    │   │   ├── WishlistPage.jsx
    │   │   ├── OrdersPage.jsx
    │   │   └── ProfilePage.jsx
    │   ├── context/
    │   │   ├── CartContext.jsx
    │   │   ├── GoogleAuthContext.jsx
    │   │   ├── ModalContext.jsx
    │   │   └── Spotlight.jsx
    │   ├── hooks/
    │   │   ├── useLogin.js
    │   │   ├── useRegister.js
    │   │   ├── useAdminDashboard.js
    │   │   ├── useProductForm.js
    │   │   ├── useFeedback.js
    │   │   └── [15+ custom hooks]
    │   ├── layouts/
    │   │   └── MainLayout.jsx
    │   ├── styles/
    │   ├── utils/
    │   ├── constants/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── vite.config.js
    ├── tailwind.config.js
    ├── package.json
    └── index.html
```


## 🚀 Quick Start

### Prerequisites
- Node.js v16+ and npm
- MongoDB (local or MongoDB Atlas cloud connection)
- Cloudinary account (for image uploads)
- Razorpay account (for payments)
- Google OAuth credentials (optional, for social login)

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Create `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/voltify
   JWT_SECRET=your_jwt_secret_key_here
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Seed the database:**
   ```bash
   node seed.js
   ```

5. **Create admin account:**
   ```bash
   node create-admin.js
   ```

6. **Start the backend:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

   Backend runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   Frontend runs on `http://localhost:3000`

## 🔑 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login with JWT
- `POST /api/auth/google` - Google OAuth authentication
- `POST /api/auth/logout` - Logout user

### Products Routes
- `GET /api/products` - Get all products with filters
- `GET /api/products/:slug` - Get product by slug (SEO-friendly)
- `GET /api/products/category/:category` - Get products by category
- `POST /api/products` - Create product (admin/seller)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders Routes
- `POST /api/orders` - Create order (JWT required)
- `GET /api/orders` - Get user/seller orders (JWT required)
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status

### Payments Routes
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment signature

### Sellers Routes
- `POST /api/sellers/register` - Register as seller
- `GET /api/sellers/:id` - Get seller details
- `PUT /api/sellers/:id` - Update seller profile
- `GET /api/sellers/:id/earnings` - Get seller earnings

### Feedback Routes
- `POST /api/feedback` - Submit customer feedback
- `GET /api/feedback` - Get all feedback

## 🎨 Design Features

- **Modern Premium UI** - Clean, professional design with smooth animations
- **Responsive Layout** - Mobile-first design that scales to all devices
- **Dark/Light Theme** - Support for theme preferences
- **Smooth Animations** - Framer Motion for delightful interactions
- **Accessibility** - WCAG compliant with proper color contrast and ARIA labels
- **SEO Optimized** - URL slugs, meta tags, structured data
- **Image Optimization** - Cloudinary integration with Sharp compression

## 🔐 Authentication & Security

**User Authentication Flow:**
1. User registers/logs in with email and password
2. Password is securely hashed using bcryptjs
3. JWT token issued and stored in localStorage
4. Token sent in Authorization header for protected routes
5. Google OAuth for single-sign-on alternative

**Security Best Practices:**
- JWT tokens with expiration
- Password hashing with bcryptjs
- CORS enabled for frontend domain only
- Input validation on server side
- Secure Razorpay payment processing
- Environment variables for sensitive data
- Role-based access control (user, seller, admin)

## 🛍️ Shopping Experience

**Cart Management:**
- Global cart state using Context API
- Persistent storage in localStorage
- Real-time quantity and price updates
- Add/remove/update cart items
- Cart badge showing item count

**Checkout Process:**
1. Review cart items and totals
2. Enter/select shipping address
3. Process payment via Razorpay
4. Order confirmation and tracking
5. Email confirmation sent to customer

## 💰 Payment Processing

- **Razorpay Integration** - Secure payment gateway for Indian merchants
- **Order Verification** - Cryptographic signature validation
- **Multiple Payment Methods** - Support for cards, UPI, wallets
- **Instant Notifications** - Real-time order status updates

## 📊 Admin & Seller Dashboards

**Admin Features:**
- Product CRUD with bulk operations
- Order management and fulfillment
- Seller account approval and management
- Commission tracking and payouts
- User analytics and reports
- System-wide inventory control

**Seller Features:**
- Product listing and management
- Order tracking with customer details
- Earnings dashboard with commission breakdown
- Inventory monitoring
- Sales analytics
- Payout management

## 📱 Responsive Breakpoints

- **Mobile** (default) - Full width, stacked layout
- **Tablet** (md: 768px) - 2-column layouts
- **Desktop** (lg: 1024px) - 3-4 column layouts
- **Large Desktop** (xl: 1280px) - Full multi-column layouts

## 🔧 Development Guide

**Key Technologies:**
- **State Management**: React Context API for global state
- **Component Library**: 20+ reusable components
- **Custom Hooks**: 15+ hooks for common functionality
- **API Integration**: Axios with interceptors for JWT
- **Form Handling**: Custom validation with error messages
- **Image Upload**: Cloudinary with drag-and-drop support

**Testing the Features:**

1. **Customer Flow:**
   - Register/Login
   - Browse products and categories
   - Add items to cart and wishlist
   - Complete checkout with Razorpay
   - View order history

2. **Seller Flow:**
   - Register as seller
   - Add products with images
   - Manage inventory
   - View orders and earnings
   - Track sales

3. **Admin Flow:**
   - Access admin dashboard
   - Manage all products and orders
   - Approve seller registrations
   - View analytics

## 📦 Database Models

- **User** - Customer accounts with authentication
- **Product** - Product catalog with metadata and images
- **SellerProduct** - Products added by sellers
- **Seller** - Merchant accounts and commissions
- **Order** - Customer orders with items and status
- **SellerEarnings** - Commission tracking for sellers
- **Feedback** - Customer reviews and ratings

## 🎯 Key Features Implemented

✅ JWT + Google OAuth authentication  
✅ Role-based access control (Customer, Seller, Admin)  
✅ Product catalog with SEO-friendly slugs  
✅ Advanced cart and wishlist system  
✅ Razorpay payment integration  
✅ Order tracking and management  
✅ Admin dashboard  
✅ Seller dashboard  
✅ Image uploads to Cloudinary  
✅ Customer feedback system  
✅ Responsive mobile design  
✅ Email notifications  
✅ Search and filtering  
✅ Category browsing  
✅ Inventory management  

## 📚 Documentation

- [Quick Start Guide](./QUICKSTART.md)
- [Admin Setup](./ADMIN_SETUP.md)
- [Google OAuth Setup](./GOOGLE_OAUTH_SETUP.md)
- [React Optimizations](./REACT_OPTIMIZATIONS.md)

## 🚀 Deployment Ready

This project is built with production in mind:
- Environment-based configuration
- Image optimization with Sharp
- Cloudinary CDN for fast delivery
- Secure payment processing
- JWT with token expiration
- Database indexing for performance
- Error handling and logging
- CORS and security headers
- Ready for Docker containerization

## 📄 License

Open source project for educational and commercial use.

---

**Built with modern best practices for enterprise e-commerce** ✨
