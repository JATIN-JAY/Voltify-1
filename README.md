# Voltify — Premium Tech Marketplace

> Curated premium tech for creators, builders, and visionaries.

🔗 **Live Demo:** https://voltify-1.vercel.app  
📁 **Repo:** https://github.com/JATIN-JAY/Voltify-1

![Voltify](https://img.shields.io/badge/Status-Live-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-18-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Deployed](https://img.shields.io/badge/Deployed-Vercel%20%2B%20Render-black)

---

## What is Voltify?

Voltify is a full-stack multi-vendor e-commerce marketplace for premium tech
products — phones, tablets, audio, and accessories. Built with a focus on
performance, SEO, mobile responsiveness, and a distinctive dark amber brand
identity. Designed to support buyers, sellers, and admins with completely
separate experiences and role-based access control.

---

## Features

### Customer
- Browse 50+ premium products across Mobiles, Tablets, Audio, Accessories
- Product detail pages with multi-image gallery and sticky image layout
- Color and storage variant selector
- Pincode-based delivery date checker
- No Cost EMI display on high-value products
- Shopping cart with real-time total calculation
- Razorpay payment gateway integration
- Order history with status tracking
- Google OAuth and JWT email authentication
- Wishlist management
- Live search overlay with trending searches
- Fully mobile-responsive with hamburger drawer navigation

### Admin
- Product management — add, edit, delete, toggle featured status
- Featured product limit enforcement (max 5 products)
- Sales overview with total revenue, order count, average order value
- Dark themed admin panel with sidebar navigation
- Order management dashboard with status updates
- Admin-only protected routes with middleware

### Multi-Vendor Marketplace (Phase 2 — In Development)
- Seller registration and onboarding with business verification
- Multi-step seller registration — business details, bank account, document upload
- Dedicated seller dashboard — manage listings, track orders, view earnings
- Admin approval workflow — sellers and products require approval before going live
- Automated commission calculation per category:
  - Mobiles 5% · Tablets 6% · Audio 7% · Accessories 8%
- Seller tier system — Basic, Verified, Premium with progressive commission discounts
- 7-day automated payout settlement with transaction history
- Public store pages at /store/[storename] with seller ratings
- Commission reversal on returns and cancellations
- "Become a Seller" CTA in navbar — seller landing page live

### Technical
- SEO optimized — React Helmet dynamic meta tags, JSON-LD structured
  data schemas, auto-generated sitemap.xml, robots.txt
- Auto-scrolling promo banner with pure CSS marquee — zero JS scroll glitches
- Typewriter hero animation with CSS cubic-bezier easing and fallback
- mix-blend-mode: screen image optimization for dark theme
- Role-based access control — buyer, seller, and admin roles
- CI/CD pipeline — GitHub push triggers automatic build and deploy
  on Vercel (frontend) and Render (backend)
- Multi-vendor architecture designed for commission engine,
  seller onboarding, and admin moderation pipeline

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router DOM, Axios |
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Auth | JWT, bcryptjs, Google OAuth 2.0 |
| Payments | Razorpay |
| State Management | Context API |
| SEO | React Helmet Async, JSON-LD, Sitemap |
| Deployment | Vercel (frontend), Render (backend), MongoDB Atlas |

---

## System Architecture
```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (React)                    │
│  Buyer UI  │  Admin Dashboard  │  Seller Dashboard  │
└─────────────────────┬───────────────────────────────┘
                      │ REST API (Axios)
┌─────────────────────▼───────────────────────────────┐
│                  SERVER (Node/Express)               │
│  Auth Routes  │  Product Routes  │  Order Routes    │
│  Admin Routes │  Seller Routes   │  SEO Routes      │
└─────────────────────┬───────────────────────────────┘
                      │ Mongoose ODM
┌─────────────────────▼───────────────────────────────┐
│              DATABASE (MongoDB Atlas)                │
│  Users  │  Products  │  Orders  │  Sellers          │
└─────────────────────────────────────────────────────┘
```

---

## Project Structure
```
Voltify/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── ProductGrid.jsx
│   │   │   ├── PromoStrip.css
│   │   │   ├── SearchOverlay.jsx
│   │   │   ├── Breadcrumb.jsx
│   │   │   ├── FAQSection.jsx
│   │   │   ├── SEOContentBlock.jsx
│   │   │   ├── LoadingSkeletons.jsx
│   │   │   └── SellerRegistrationForm.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CategoryPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── WishlistPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── AdminProductsPage.jsx
│   │   │   ├── AdminProductAddPage.jsx
│   │   │   └── AdminOrders.jsx
│   │   ├── context/             # Cart and Auth context
│   │   ├── hooks/               # Custom React hooks
│   │   └── utils/               # Helper functions
│   └── public/
│       └── robots.txt
└── server/                      # Node.js backend
    ├── models/
    │   ├── User.js
    │   ├── Product.js
    │   └── Order.js
    ├── routes/
    │   ├── auth.js
    │   ├── products.js
    │   ├── orders.js
    │   └── seo.js
    └── middleware/
        └── auth.js
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login and receive JWT |
| POST | /api/auth/google | Google OAuth login |

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/products | Get all products with filters |
| GET | /api/products/:id | Get single product |
| POST | /api/products | Add product (admin) |
| PATCH | /api/products/:id | Update product (admin) |
| PATCH | /api/products/:id/featured | Toggle featured status (admin) |
| DELETE | /api/products/:id | Delete product (admin) |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/orders | Create order (authenticated) |
| GET | /api/orders | Get user orders (authenticated) |

### SEO
| Method | Endpoint | Description |
|---|---|---|
| GET | /sitemap.xml | Dynamic sitemap |
| GET | /robots.txt | Robots configuration |

### Seller — Phase 2
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/seller/register | Seller registration |
| GET | /api/seller/dashboard | Seller earnings and stats |
| PATCH | /api/admin/sellers/:id/approve | Approve seller (admin) |
| GET | /api/admin/sellers | List all sellers (admin) |

---

## Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account or local MongoDB
- Razorpay account for payment testing
- Google Cloud Console project for OAuth

### Backend Setup
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
GOOGLE_CLIENT_ID=your_google_client_id
```
```bash
node seed.js        # seed sample products
npm run dev         # start backend on localhost:5000
```

### Frontend Setup
```bash
cd client
npm install
npm run dev         # start frontend on localhost:3000
```

### Admin Access
See `ADMIN_SETUP.md` for creating an admin account and accessing
the admin dashboard at `/admin`.

---

## Deployment

| Service | Platform | Trigger |
|---|---|---|
| Frontend | Vercel | Auto-deploy on push to main |
| Backend | Render | Auto-deploy on push to main |
| Database | MongoDB Atlas | Always on |

CI/CD Pipeline: Every push to the `main` branch on GitHub
automatically triggers a build and deployment on both
Vercel and Render — zero manual steps required.

---

## Roadmap

- [x] Customer storefront with product catalog
- [x] Shopping cart and Razorpay checkout
- [x] JWT + Google OAuth authentication
- [x] Admin dashboard with product management
- [x] SEO optimization with meta tags and sitemap
- [x] Mobile responsive design
- [x] Wishlist functionality
- [x] Live search overlay
- [ ] Seller onboarding and dashboard (Phase 2)
- [ ] Commission engine and payout system (Phase 2)
- [ ] Seller tier system (Phase 2)
- [ ] Product reviews and ratings (Phase 2)
- [ ] Push notifications (Phase 2)

---

## Author

**Jatin Singh**

Built with React, Node.js, MongoDB, and a lot of iteration.

[GitHub](https://github.com/JATIN-JAY) ·
[Live Project](https://voltify-1.vercel.app)

---

## License

This project is open source and available for educational
and portfolio purposes.
