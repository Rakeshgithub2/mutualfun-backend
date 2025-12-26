# 🔥 OAUTH + API ROUTING FIX - COMPLETE GUIDE

## 🎯 Issues Fixed

1. ✅ Google OAuth origin error
2. ✅ Duplicate `/api/api` path
3. ✅ CORS 403 errors
4. ✅ Backend CORS configuration

---

## 📋 TASK 1: Fix Google OAuth Console Settings

### Step 1: Go to Google Cloud Console

Visit: https://console.cloud.google.com/apis/credentials

### Step 2: Select Your OAuth 2.0 Client ID

Find: `336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com`

### Step 3: Add Authorized JavaScript Origins

Click "Edit" and add these origins:

```
http://localhost:3000
http://localhost:5001
https://mutual-fun-frontend-osed.vercel.app
```

**IMPORTANT:** Do NOT include trailing slashes!

### Step 4: Add Authorized Redirect URIs

Add these redirect URIs:

```
http://localhost:3002/api/auth/google/callback
http://localhost:3000/auth/callback
https://mutualfun-backend.vercel.app/api/auth/google/callback
https://mutual-fun-frontend-osed.vercel.app/auth/callback
```

### Step 5: Save Changes

Click "Save" - changes take 5-10 minutes to propagate.

---

## 📋 TASK 2: Fix Frontend API Base URL

### Problem: Duplicate `/api/api`

Your frontend is calling:

```
https://mutualfun-backend.vercel.app/api/api/auth/register
                                     ↑    ↑
                                duplicate /api
```

### ✅ SOLUTION: Update Frontend API Client

**File: `src/api/axios.ts` or `src/config/api.ts` (or similar)**

```typescript
// ❌ WRONG - Has /api in base URL
const API_BASE_URL = 'https://mutualfun-backend.vercel.app/api';

// ✅ CORRECT - No /api in base URL
const API_BASE_URL = 'https://mutualfun-backend.vercel.app';

// OR for local development
const API_BASE_URL = import.meta.env.PROD
  ? 'https://mutualfun-backend.vercel.app'
  : 'http://localhost:3002';
```

### Frontend Environment Variables

**File: `.env` or `.env.production`**

```env
# ✅ CORRECT - No /api suffix
VITE_API_URL=https://mutualfun-backend.vercel.app
REACT_APP_API_URL=https://mutualfun-backend.vercel.app

# For local development
VITE_API_URL_DEV=http://localhost:3002
```

### API Client Usage

```typescript
// Your API calls should look like this:
axios.post(`${API_BASE_URL}/api/auth/register`, data);
axios.post(`${API_BASE_URL}/api/auth/login`, data);
axios.post(`${API_BASE_URL}/api/auth/google`, data);

// NOT like this:
// axios.post(`${API_BASE_URL}/auth/register`, data); ❌
```

---

## 📋 TASK 3: Backend CORS Configuration (ALREADY FIXED! ✅)

Your backend already has proper CORS configuration in two places:

### 1. **app.ts** (Main App - Vercel Deployment)

**File: `src/app.ts`**

Already configured correctly:

```typescript
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:5001',
        'http://localhost:3000',
        'http://localhost:3001',
        'https://mf-frontend-coral.vercel.app',
        'https://mutual-fun-frontend-osed.vercel.app',
      ];

      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn('CORS blocked origin:', origin);
        callback(null, true); // Allow but log
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
    ],
    exposedHeaders: ['Set-Cookie'],
  })
);
```

✅ **Status: Already includes your frontend domain!**

### 2. **server.ts** (Local Development Server)

**File: `src/server.ts`**

Uses environment config:

```typescript
app.use(
  cors({
    origin: config.cors.allowedOrigins,
    credentials: true,
  })
);
```

### 3. **Update .env** (Just to be sure)

**File: `.env`**

Make sure this includes your domains:

```env
ALLOWED_ORIGINS=http://localhost:5001,http://localhost:3000,http://localhost:3001,http://localhost:5173,http://localhost:4173,https://mutual-fun-frontend-osed.vercel.app
```

✅ **Status: Already configured!**

---

## 🎯 FRONTEND CHANGES REQUIRED

### Yes, you need to update your frontend! Here's what:

### 1. **Update API Base URL**

Find your API client file (usually in `src/api/`, `src/config/`, or `src/lib/`):

**Common file names:**

- `axios.ts` or `axios.js`
- `api.ts` or `api.js`
- `apiClient.ts`
- `config.ts`
- `constants.ts`

**Change this:**

```typescript
// ❌ WRONG
export const API_BASE_URL = 'https://mutualfun-backend.vercel.app/api';

// ✅ CORRECT
export const API_BASE_URL = 'https://mutualfun-backend.vercel.app';
```

### 2. **Update Environment Variables**

**File: `.env.production` or `.env`**

```env
# ✅ Add or update these
VITE_API_URL=https://mutualfun-backend.vercel.app
REACT_APP_API_URL=https://mutualfun-backend.vercel.app

# For Google OAuth
VITE_GOOGLE_CLIENT_ID=336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com
REACT_APP_GOOGLE_CLIENT_ID=336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com
```

### 3. **Rebuild and Redeploy Frontend**

After making changes:

```bash
# Build
npm run build

# Deploy to Vercel
vercel --prod

# OR let Vercel auto-deploy from GitHub
git add .
git commit -m "fix: Update API base URL to prevent duplicate /api"
git push origin main
```

### 4. **Verify Environment Variables in Vercel**

Go to: https://vercel.com → Your Project → Settings → Environment Variables

Add/Update:

- `VITE_API_URL` = `https://mutualfun-backend.vercel.app`
- `REACT_APP_API_URL` = `https://mutualfun-backend.vercel.app`
- `VITE_GOOGLE_CLIENT_ID` = `336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com`

Then redeploy.

---

## 🧪 Testing After Changes

### Test 1: Check API Calls

Open browser DevTools → Network tab:

```
✅ CORRECT:
https://mutualfun-backend.vercel.app/api/auth/register
https://mutualfun-backend.vercel.app/api/auth/login

❌ WRONG:
https://mutualfun-backend.vercel.app/api/api/auth/register
```

### Test 2: Check CORS Headers

In DevTools → Network → Select any request → Headers:

```
Response Headers should show:
✅ Access-Control-Allow-Origin: https://mutual-fun-frontend-osed.vercel.app
✅ Access-Control-Allow-Credentials: true
```

### Test 3: Test Google OAuth

1. Click "Sign in with Google" button
2. Should NOT see: "The given origin is not allowed"
3. Should redirect to Google sign-in page
4. After signing in, should redirect back successfully

---

## ✅ CHECKLIST

### Backend (Already Done! ✅)

- [x] CORS configured in `app.ts`
- [x] CORS configured in `server.ts`
- [x] `ALLOWED_ORIGINS` set in `.env`
- [x] Multiple origins supported
- [x] Credentials enabled

### Google Console (You Need to Do This!)

- [ ] Add `http://localhost:3000` to Authorized JavaScript origins
- [ ] Add `https://mutual-fun-frontend-osed.vercel.app` to origins
- [ ] Add redirect URIs for both localhost and production
- [ ] Save and wait 5-10 minutes

### Frontend (You Need to Do This!)

- [ ] Remove `/api` from `API_BASE_URL` in your API client
- [ ] Update environment variables
- [ ] Redeploy frontend to Vercel
- [ ] Add environment variables in Vercel dashboard

---

## 📊 Before vs After

### Before (Broken):

```
Frontend API Base: https://mutualfun-backend.vercel.app/api
API Call: /api/auth/register
Full URL: https://mutualfun-backend.vercel.app/api/api/auth/register ❌
                                                  ↑    ↑
                                            duplicate /api
```

### After (Fixed):

```
Frontend API Base: https://mutualfun-backend.vercel.app
API Call: /api/auth/register
Full URL: https://mutualfun-backend.vercel.app/api/auth/register ✅
```

---

## 🎯 Summary

| Problem              | Solution                      | Status            |
| -------------------- | ----------------------------- | ----------------- |
| Google OAuth blocked | Add origins to Google Console | ⚠️ You need to do |
| Duplicate `/api/api` | Remove `/api` from base URL   | ⚠️ You need to do |
| CORS 403             | Backend already configured    | ✅ Already done   |
| Environment vars     | Update Vercel settings        | ⚠️ You need to do |

---

## 📝 Quick Frontend Fix Example

If you're using React + Vite:

**File: `src/config/api.ts` or `src/lib/axios.ts`**

```typescript
// BEFORE ❌
const API_URL = 'https://mutualfun-backend.vercel.app/api';

// AFTER ✅
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Usage (API calls)
api.post('/api/auth/register', data); // ✅ /api is in the path, not baseURL
api.post('/api/auth/login', data);
api.post('/api/auth/google', { idToken });
```

---

## 🚀 Deploy

After making frontend changes:

```bash
# Commit
git add .
git commit -m "fix: Remove duplicate /api from base URL and update CORS origins"
git push origin main

# Vercel will auto-deploy
# OR manually: vercel --prod
```

---

**Your backend is already fixed! You just need to:**

1. ✅ Update Google Console
2. ✅ Fix frontend API base URL
3. ✅ Redeploy frontend
