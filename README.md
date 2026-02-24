# Voltify - E-Commerce Web Application

A beautiful, beginner-friendly e-commerce web application built with React, Node.js, and MongoDB. The UI is styled to look like the Apple App Store with premium modern design.

## 🎯 Features

- **User Authentication** - Register and login with JWT
- **Product Catalog** - Browse beautiful product grid with images
- **Shopping Cart** - Add/remove items, update quantities
- **Order Management** - Simple checkout with shipping info
- **Responsive Design** - Mobile-first design that works on all devices
- **Modern UI** - Apple App Store style with Tailwind CSS

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- React Router DOM for navigation
- Axios for API calls
- Context API for state management

## 📁 Project Structure

```
zapvi clone/
├── server/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   └── orders.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   └── .env
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── HeroSection.jsx
    │   │   └── ProductGrid.jsx
    │   ├── pages/
    │   │   ├── RegisterPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   └── CartPage.jsx
    │   ├── context/
    │   │   └── CartContext.jsx
    │   ├── layouts/
    │   │   └── MainLayout.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    └── index.html
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or Atlas connection string)
- npm or yarn

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
   
   Edit `.env` file:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_secret_key_here_change_in_production
   ```

4. **Seed the database with sample products:**
   ```bash
   node seed.js
   ```

5. **Start the backend server:**
   ```bash
   npm start
   ```
   
   Or with auto-reload (requires nodemon):
   ```bash
   npm run dev
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a single product

### Orders
- `POST /api/orders` - Create a new order (requires JWT)
- `GET /api/orders` - Get user's orders (requires JWT)

## 🎨 Design Features

The UI is designed with Apple App Store aesthetics:

- **Clean white background** with soft gray accent sections
- **Premium rounded corners** (rounded-2xl, rounded-xl)
- **Smooth hover animations** with scale and shadow effects
- **Gradient accents** using blue and purple
- **Large, high-quality product images**
- **Sticky navigation bar** with cart badge
- **Generous spacing** for a premium feel
- **Modern button styles** with hover states
- **Smooth transitions** on all interactive elements

## 🔐 Authentication Flow

1. User registers with name, email, and password
2. Password is hashed with bcryptjs
3. JWT token is generated and stored in localStorage
4. Token is sent in Authorization header for protected routes
5. User can logout to clear token and session

## 🛒 Cart System

- **Context API** manages cart state globally
- Cart data persists in localStorage
- Add/remove/update quantity functionality
- Real-time total price calculation
- Cart badge shows item count

## 📦 Sample Products

The seed script includes 12 sample products:
- Wireless Headphones
- Smart Watch
- USB-C Charger
- Portable SSD
- Mechanical Keyboard
- Webcam
- Phone Stand
- Desk Lamp
- Power Bank
- Screen Protector
- Laptop Cooling Pad
- USB Hub

All with product images from Unsplash.

## 🔧 Important Files Explained

### Backend

**server.js** - Main server file that:
- Sets up Express app
- Connects to MongoDB
- Mounts all route handlers
- Starts the server on port 5000

**models/User.js** - User schema with name, email, hashed password

**models/Product.js** - Product schema with name, price, description, image

**models/Order.js** - Order schema linking users to products with shipping info

**routes/auth.js** - Register and login endpoints with password hashing

**routes/products.js** - GET endpoints to fetch all/single products

**routes/orders.js** - POST/GET orders (protected with JWT)

**middleware/auth.js** - JWT verification middleware for protected routes

### Frontend

**App.jsx** - Main component with Router and routes setup

**CartContext.jsx** - Global state for user, cart items, and cart functions

**Navbar.jsx** - Sticky navigation with logo, links, cart badge, user menu

**HeroSection.jsx** - Premium hero banner with CTA buttons

**ProductGrid.jsx** - Fetches products from API and displays in grid

**CartPage.jsx** - Shopping cart with items list, quantity controls, checkout form

**RegisterPage.jsx** & **LoginPage.jsx** - Auth forms with error handling

## 🚀 Development Tips

1. **Test authentication:**
   - Register a test user
   - Login and verify token is saved
   - Try logout and login again

2. **Test products:**
   - Add items to cart
   - Verify cart persists after page refresh
   - Check total price calculation

3. **Test checkout:**
   - Make sure you're logged in
   - Fill shipping info
   - Verify order is saved in database

4. **Style tweaks:**
   - Tailwind CSS config in `tailwind.config.js`
   - Custom CSS in `client/src/index.css`
   - Component styles are inline with Tailwind classes

## 📱 Responsive Design

The app is mobile-first:
- **Mobile** (default) - Full width, stacked layout
- **Tablet** (md:) - 2-column layouts
- **Desktop** (lg:) - 3-4 column layouts for products

## 🎓 Learning Notes

This is built to be **beginner-friendly**:
- No complex design patterns (no Redux, MobX, etc.)
- Simple folder structure
- Clear, readable code with comments
- Context API for simple state management
- Straightforward API calls with Axios

## 🔐 Security Notes

For production:
1. Change JWT_SECRET in .env
2. Enable HTTPS
3. Add input validation on backend
4. Implement rate limiting
5. Use environment variables for sensitive data
6. Add CORS restrictions

## 📄 License

This project is open source and available for educational purposes.

---

**Built with ❤️ for beginners**
