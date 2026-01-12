# Deployment Fixes - Complete Setup Guide

## ✅ Issues Fixed

### 1. Frontend (Vercel) - FIXED
- ✅ Created `vercel.json` with proper build and environment variable configuration
- ✅ Fixed API base URL detection in `api.ts`
- ✅ Added logging to verify API URL in console

### 2. Backend (Render) - FIXED
- ✅ Fixed `render.json` to use correct start command (`node dist/index.js`)
- ✅ Added proper CORS configuration with origin validation
- ✅ Created `.env.production` template
- ✅ Fixed JWT secret handling (with proper fallback)

### 3. Environment Configuration - FIXED
- ✅ Cleaned up `.env.example` with clear production instructions
- ✅ Added production environment template

---

## 🚀 DEPLOYMENT CHECKLIST

### BACKEND (Render) Setup:

1. **Create PostgreSQL database on Render**
   - Go to Render.com dashboard
   - Create new PostgreSQL instance
   - Copy the connection string

2. **Create Web Service on Render**
   - Connect your GitHub repo (or push code)
   - Set Build Command: `npm install && npm run build && npx prisma db push`
   - Set Start Command: `node dist/index.js`

3. **Set Environment Variables** in Render dashboard:
   ```
   DATABASE_URL=postgresql://user:pass@host:5432/catrix
   JWT_SECRET=<generate-new-secure-random-key>
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

4. **Generate a new JWT_SECRET:**
   ```bash
   # Run in your terminal
   openssl rand -base64 32
   # Copy the output and paste in Render dashboard
   ```

5. **Database Migration:**
   - Render will auto-run `prisma db push` during build
   - Verify tables created: Check Render PostgreSQL dashboard

### FRONTEND (Vercel) Setup:

1. **Add Environment Variable in Vercel**
   - Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://catrix-backend.onrender.com/api`
   - Redeploy after adding variable

2. **Verify Vercel Build**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Node Version: 18 or higher

3. **Check Deployment Logs**
   - Vercel Dashboard → Deployments → View Logs
   - Look for `🔗 API Base URL:` message in console

---

## 🔍 TESTING AFTER DEPLOYMENT

### Test 1: Backend Health Check
```
curl https://catrix-backend.onrender.com/api/health
# Should return: {"status":"OK","timestamp":"..."}
```

### Test 2: Frontend Loads
- Visit: `https://your-frontend.vercel.app`
- Open Browser DevTools (F12)
- Check Console for API URL log: `🔗 API Base URL: https://catrix-backend.onrender.com/api`

### Test 3: Login/Register
- Try creating an account
- Check Network tab in DevTools
- API calls should go to `https://catrix-backend.onrender.com/api/auth/register`
- Should see response with token

### Test 4: Check Render Logs
- Render Dashboard → Backend Service → Logs
- Should show requests from your Vercel domain
- Look for any errors related to CORS or database

---

## ⚠️ COMMON ISSUES & FIXES

### Issue: "Cannot POST /api/auth/register"
**Cause:** API URL not configured in Vercel
**Fix:** Add `VITE_API_URL` environment variable to Vercel and redeploy

### Issue: CORS errors in browser console
**Cause:** Frontend domain not in backend CORS allowlist
**Fix:** Add your Vercel URL to `FRONTEND_URL` environment variable on Render

### Issue: "Invalid JWT Secret" on login
**Cause:** JWT_SECRET not set in Render
**Fix:** Generate new secret with `openssl rand -base64 32` and add to Render

### Issue: Database connection timeout on Render
**Cause:** DATABASE_URL not set or invalid
**Fix:** Copy exact URL from Render PostgreSQL dashboard, test with `psql` if needed

### Issue: Slow first request (30+ seconds)
**Cause:** Render free tier cold starts
**Fix:** Use paid tier or Pinger service to keep it warm

---

## 📋 Files Changed

### Created:
- ✅ `backend/vercel.json` - Frontend build config
- ✅ `backend/.env.production` - Production env template
- ✅ `backend/render.json` - Corrected build/start commands

### Modified:
- ✅ `backend/src/index.ts` - Fixed CORS configuration
- ✅ `backend/src/routes/auth.ts` - Consistent JWT secret handling
- ✅ `backend/.env.example` - Clear documentation
- ✅ `frontend/src/utils/api.ts` - Better API URL handling with logging
- ✅ `frontend/vercel.json` - NEW: Vercel-specific configuration

---

## 🔐 SECURITY NOTES

1. **Never commit `.env` files** - Always use `.env.example` as template
2. **JWT Secret must be unique per environment** - Generate with `openssl rand -base64 32`
3. **CORS is restricted** - Only allows specific origins in production
4. **Change default passwords/secrets** - Don't use example values

---

## 📞 NEXT STEPS

1. Set environment variables on both Render and Vercel
2. Redeploy both services
3. Test using the testing checklist above
4. Monitor logs for errors
5. Check browser DevTools Network tab for API calls

If you're still having issues, check:
- Render backend logs: `Render Dashboard → Services → Logs`
- Vercel frontend logs: `Vercel Dashboard → Deployments → Logs`
- Browser console: `F12 → Console` for errors
- Network tab: `F12 → Network` for failed requests
