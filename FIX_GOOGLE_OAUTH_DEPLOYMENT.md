# 🚨 CRITICAL: Google OAuth & CORS Fix - DEPLOYMENT ERRORS

## Problem
- ❌ Google signin works locally but fails on Vercel
- ❌ Error: `Access to XMLHttpRequest at http://localhost:5004... blocked by CORS`
- ❌ Frontend trying to use localhost:5004 from production

## Root Cause
**Vercel is NOT reading the `VITE_API_URL` environment variable** because:
1. `.env.production` files are NOT automatically used by Vercel
2. You must explicitly set environment variables in Vercel Dashboard

---

## ✅ FIX - 3 Steps to Fix Google OAuth in Production

### Step 1: Set Vercel Environment Variable
1. Go to **https://vercel.com/dashboard**
2. Click your **Voltify-1** project
3. Go to **Settings** → **Environment Variables**
4. Add NEW variable:
   ```
   Name: VITE_API_URL
   Value: https://voltify-1-1.onrender.com
   ```
   *(No /api at the end)*

5. Make sure it's added to: **Production**, **Preview**, **Development**
6. Click "Save"

### Step 2: Verify Render Backend Environment Variables

Go to **https://render.com/dashboard** → your backend service → **Environment**

Verify these are set (CRITICAL for CORS):
```
FRONTEND_URL=https://voltify-1.vercel.app
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_secret
MONGODB_URI=your_connection_string
```

### Step 3: Update Google Cloud Console OAuth Redirect URIs

1. Go to **https://console.cloud.google.com/**
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click your Web Application OAuth Client
5. Add these **Authorized redirect URIs**:
   ```
   https://voltify-1.vercel.app
   https://voltify-1-1.onrender.com
   http://localhost:3000
   http://localhost:5004
   ```
6. Save

---

## 🔄 After Making Changes

### Redeploy Vercel
```bash
# Simply push to main - Vercel auto-deploys
git push origin main

# OR
# Go to Vercel Dashboard → Deployments → Click "Redeploy" on latest
```

### Redeploy Render
1. Go to **https://render.com/dashboard**
2. Click your backend service
3. Click **Manual Deploy** button
4. Wait for "Deploy successful"

---

## 🧪 Test Google OAuth

1. Open **https://voltify-1.vercel.app**
2. Click **"Sign in with Google"**
3. Should work without CORS errors

Check browser console (F12) for any remaining errors.

---

## 🛠️ Debugging Checklist

If still not working:

| Check | How to Debug |
|---|---|
| API URL is set in Vercel | Vercel Dashboard → Settings → Environment Variables |
| CORS is enabled on backend | Open `https://voltify-1-1.onrender.com/api/products` in browser - should show JSON |
| Google OAuth Redirect URIs | Google Console → APIs & Services → Credentials → Check redirect URIs |
| Backend env variables | Render Dashboard → Environment → all 8+ variables are set |
| Network error in console | Check Render logs: `https://render.com/dashboard` → your service → Logs |

---

## 📝 Environment Variables Summary

### Vercel (Frontend) - Production
```
VITE_API_URL=https://voltify-1-1.onrender.com
```

### Render (Backend) - Production
```
FRONTEND_URL=https://voltify-1.vercel.app
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
MONGODB_URI=xxx
JWT_SECRET=xxx
RAZORPAY_KEY_ID=xxx
RAZORPAY_KEY_SECRET=xxx
CLOUDINARY_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

---

## 🎯 Why This Fix Works

| Before | After |
|---|---|
| Frontend tries localhost:5004 from Vercel | Frontend uses https://voltify-1-1.onrender.com |
| CORS blocks the request | CORS allows Vercel domain |
| Google OAuth fails silently | Google auth works perfectly |

