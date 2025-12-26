# ⚡ FRONTEND CHANGES REQUIRED - QUICK GUIDE

## 🎯 YES, YOU NEED TO MAKE THESE FRONTEND CHANGES:

---

## 1. 📝 UPDATE API BASE URL (CRITICAL!)

### Find Your API Client File

Look for one of these files in your frontend:

- `src/api/axios.ts` or `src/api/axios.js`
- `src/config/api.ts` or `src/config/api.js`
- `src/lib/axios.ts`
- `src/utils/api.ts`
- `src/services/api.ts`

### Change This:

```typescript
// ❌ WRONG - Has /api in base URL
const API_BASE_URL = 'https://mutualfun-backend.vercel.app/api';

// ✅ CORRECT - Remove /api from base URL
const API_BASE_URL = 'https://mutualfun-backend.vercel.app';
```

### Why?

Your backend routes are mounted at `/api`, so:

- Backend has: `/api/auth/register`
- Frontend base URL should be: `https://mutualfun-backend.vercel.app`
- Full URL becomes: `https://mutualfun-backend.vercel.app/api/auth/register` ✅

If your base URL includes `/api`, you get:

- `https://mutualfun-backend.vercel.app/api` + `/api/auth/register`
- = `https://mutualfun-backend.vercel.app/api/api/auth/register` ❌ (404 error!)

---

## 2. 📝 UPDATE ENVIRONMENT VARIABLES

### File: `.env` or `.env.production`

```env
# ✅ CHANGE TO THIS (Remove /api suffix)
VITE_API_URL=https://mutualfun-backend.vercel.app
REACT_APP_API_URL=https://mutualfun-backend.vercel.app

# For local development
VITE_API_URL_DEV=http://localhost:3002

# Google OAuth (if not already set)
VITE_GOOGLE_CLIENT_ID=336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com
REACT_APP_GOOGLE_CLIENT_ID=336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com
```

---

## 3. 📝 UPDATE VERCEL ENVIRONMENT VARIABLES

Go to: https://vercel.com → Your Project → Settings → Environment Variables

Add/Update these:

| Key                     | Value                                                                      |
| ----------------------- | -------------------------------------------------------------------------- |
| `VITE_API_URL`          | `https://mutualfun-backend.vercel.app`                                     |
| `REACT_APP_API_URL`     | `https://mutualfun-backend.vercel.app`                                     |
| `VITE_GOOGLE_CLIENT_ID` | `336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com` |

**IMPORTANT:** After adding variables, click "Redeploy" in Vercel!

---

## 4. 🔧 FIX GOOGLE OAUTH CONSOLE

Go to: https://console.cloud.google.com/apis/credentials

### Add Authorized JavaScript Origins:

```
http://localhost:3000
https://mutual-fun-frontend-osed.vercel.app
```

### Add Authorized Redirect URIs:

```
http://localhost:3002/api/auth/google/callback
http://localhost:3000/auth/callback
https://mutualfun-backend.vercel.app/api/auth/google/callback
https://mutual-fun-frontend-osed.vercel.app/auth/callback
```

**Save and wait 5-10 minutes for changes to take effect.**

---

## 5. 🚀 REBUILD & REDEPLOY FRONTEND

```bash
# Commit changes
git add .
git commit -m "fix: Remove /api from base URL to prevent duplicate path"
git push origin main

# Vercel will auto-deploy
# OR manually:
npm run build
vercel --prod
```

---

## ✅ EXAMPLE: Complete API Client Code

### React + Vite Example:

**File: `src/lib/axios.ts`**

```typescript
import axios from 'axios';

// ✅ CORRECT - No /api in base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Usage in Components:

```typescript
import { api } from '@/lib/axios';

// Register
await api.post('/api/auth/register', {
  email,
  password,
  name,
});

// Login
await api.post('/api/auth/login', {
  email,
  password,
});

// Google Sign-In
await api.post('/api/auth/google', {
  idToken,
});
```

---

## 🧪 TEST AFTER DEPLOYMENT

### 1. Check Network Tab (DevTools)

Click Register/Login and check the URLs:

```
✅ CORRECT:
https://mutualfun-backend.vercel.app/api/auth/register
https://mutualfun-backend.vercel.app/api/auth/login

❌ WRONG (if you see this, base URL still has /api):
https://mutualfun-backend.vercel.app/api/api/auth/register
```

### 2. Check CORS

In Network tab → Select request → Headers:

Should see:

```
Access-Control-Allow-Origin: https://mutual-fun-frontend-osed.vercel.app ✅
Access-Control-Allow-Credentials: true ✅
```

### 3. Test Google OAuth

1. Click "Sign in with Google"
2. Should NOT see: "The given origin is not allowed"
3. Should redirect to Google sign-in
4. Should redirect back and login successfully

---

## 📊 WHAT CHANGES IN YOUR FRONTEND

| File            | What to Change              | Example                                             |
| --------------- | --------------------------- | --------------------------------------------------- |
| API Client      | Remove `/api` from base URL | `'https://mutualfun-backend.vercel.app'`            |
| `.env`          | Update API URL variable     | `VITE_API_URL=https://mutualfun-backend.vercel.app` |
| Vercel Settings | Add environment variables   | Set in dashboard                                    |
| Google Console  | Add authorized origins      | Add frontend domains                                |

---

## ⚡ QUICK CHECKLIST

- [ ] Remove `/api` from API base URL in frontend code
- [ ] Update `.env` file
- [ ] Update Vercel environment variables
- [ ] Add origins to Google Console
- [ ] Commit and push changes
- [ ] Redeploy frontend on Vercel
- [ ] Test in browser (check Network tab)
- [ ] Test Google OAuth button

---

## 🎉 AFTER THESE CHANGES

✅ No more 404 errors  
✅ No more duplicate `/api/api`  
✅ Google OAuth works  
✅ CORS errors fixed  
✅ All API calls work correctly

---

**Bottom Line:**

Your **backend is already correct**! You just need to:

1. Fix frontend API base URL (remove `/api`)
2. Update Google Console
3. Redeploy

That's it! 🚀
