# Voltify Deployment Configuration Guide

## ✅ Current Status
- **Frontend:** Vercel deployment ready
- **Backend:** Render deployment ready
- **Database:** MongoDB Atlas ready

---

## 🚀 VERCEL DEPLOYMENT (Frontend)

### Step 1: Set Environment Variables in Vercel

Go to your Vercel project → **Settings** → **Environment Variables**

Add this variable:

```
VITE_API_URL=https://voltify-1-1.onrender.com
```

**IMPORTANT:** Do NOT include `/api` at the end. The frontend routes handle this.

### Step 2: Verify Build Settings

In Vercel Project Settings:
- **Framework:** Vite
- **Build Command:** `npm run build` (should be auto-detected)
- **Output Directory:** `dist`
- **Root Directory:** `./client`

### Step 3: Redeploy

After setting environment variables, redeploy:
```
git push origin main
```

---

## 🚀 RENDER DEPLOYMENT (Backend)

### Step 1: Set Environment Variables in Render

Go to your Render service → **Environment** → **Environment Variables**

Required variables:

```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=https://voltify-1.vercel.app
```

### Step 2: Verify Build Settings

In Render:
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Node Version:** 18.x (or latest)

### Step 3: Redeploy

Push to trigger redeploy:
```
git push origin main
```

---

## 🔍 Debugging Production Errors

### Error: ERR_CONNECTION_REFUSED

**Problem:** Frontend can't connect to backend

**Check:**
1. Verify Render backend is running: Visit `https://voltify-1-1.onrender.com/api/products` in browser
   - Should return JSON products
   - If 404 or error, backend needs restart

2. Verify Vercel has correct API URL:
   - Vercel Dashboard → Environment Variables
   - Check `VITE_API_URL=https://voltify-1-1.onrender.com`

3. Clear browser cache and hard reload (Ctrl+Shift+R)

### Error: CORS Policy

**Problem:** Cross-Origin blocked by browser

**Solution:** Already fixed in server.js with:
```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL || [...],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
};
```

Make sure `FRONTEND_URL=https://voltify-1.vercel.app` is set in Render.

### Error: Google OAuth Network Error

**Problem:** "Google login error: Network Error"

**Check:**
1. Backend is running
2. `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in Render
3. Google Console project has correct redirect URIs:
   - `https://voltify-1.vercel.app` (frontend)
   - `https://voltify-1-1.onrender.com` (backend)

---

## 📱 LOCAL TESTING

To test locally before deploying:

```bash
# Terminal 1 - Backend
cd server
npm install
# Make sure .env has PORT=5004
npm run dev

# Terminal 2 - Frontend
cd client
npm install
# Vite config already proxies /api to localhost:5004
npm run dev
```

Open `http://localhost:3000` in browser.

---

## 🔐 Security Checklist

- [ ] JWT_SECRET is set to a strong random string
- [ ] MONGODB_URI uses password protection
- [ ] API keys (Razorpay, Google, Cloudinary) are NOT in code
- [ ] FRONTEND_URL matches your Vercel domain
- [ ] CORS only allows your Vercel domain
- [ ] Google Console has correct redirect URIs
- [ ] Environment variables are NOT committed to git

---

## 📊 Monitoring

### Vercel Logs
```
Vercel Dashboard → your-project → Deployments → Logs
```

### Render Logs
```
Render Dashboard → your-service → Logs
```

Check for:
- MongoDB connection errors
- API route errors
- CORS issues
- Missing environment variables

---

## 🆘 Common Issues & Fixes

| Issue | Solution |
|---|---|
| 404 on API calls | Verify backend running on Render |
| CORS errors | Check FRONTEND_URL in Render env vars |
| Google login fails | Verify Google Client ID in Render |
| Payments fail | Check Razorpay keys in Render |
| Image uploads fail | Check Cloudinary credentials in Render |

---

## 📞 Next Steps

1. Set Vercel `VITE_API_URL` environment variable
2. Set all Render environment variables (copy from above)
3. Redeploy both (push to main)
4. Test login, products, cart, checkout
5. Monitor logs for any errors

