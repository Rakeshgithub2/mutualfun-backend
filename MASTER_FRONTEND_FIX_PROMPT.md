# 🔥 MASTER FRONTEND FIX PROMPT - COPY THIS ENTIRE PROMPT

---

**Paste this entire prompt to your frontend AI assistant (Claude/ChatGPT/Cursor) or share with your frontend developer:**

---

# FRONTEND FIX - COMPLETE GUIDE

## 🎯 ISSUES TO FIX

1. **API calls returning 404** - URL has duplicate `/api/api/auth/register`
2. **Google OAuth error** - "The given origin is not allowed for the given client ID"
3. **CORS 403 errors** - Frontend domain not authorized

## ✅ SOLUTION - THREE CHANGES NEEDED

---

### CHANGE #1: Fix API Base URL (Remove `/api` suffix)

**Location:** Find your API client configuration file. It's usually in one of these locations:
- `src/api/axios.ts` or `src/api/axios.js`
- `src/lib/axios.ts` or `src/lib/api.ts`
- `src/config/api.ts` or `src/config/constants.ts`
- `src/utils/api.ts` or `src/services/apiClient.ts`

**Find this code:**
```typescript
// ❌ WRONG - Has /api in base URL
const API_BASE_URL = 'https://mutualfun-backend.vercel.app/api';
// or
export const API_URL = 'https://mutualfun-backend.vercel.app/api';
// or
const baseURL = 'https://mutualfun-backend.vercel.app/api';
```

**Change to:**
```typescript
// ✅ CORRECT - Remove /api from base URL
const API_BASE_URL = 'https://mutualfun-backend.vercel.app';
// or
export const API_URL = 'https://mutualfun-backend.vercel.app';
// or
const baseURL = 'https://mutualfun-backend.vercel.app';
```

**Why?** The backend routes are already mounted at `/api`, so:
- Your API calls use: `/api/auth/register`
- Base URL should be: `https://mutualfun-backend.vercel.app`
- Final URL: `https://mutualfun-backend.vercel.app/api/auth/register` ✅

If base URL has `/api`, you get:
- `https://mutualfun-backend.vercel.app/api` + `/api/auth/register`
- = `https://mutualfun-backend.vercel.app/api/api/auth/register` ❌ (404!)

**Complete Example:**

```typescript
// src/lib/axios.ts (or similar file)
import axios from 'axios';

// ✅ CORRECT - No /api suffix
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

**Usage in components stays the same:**
```typescript
// These paths include /api - that's correct!
api.post('/api/auth/register', { email, password, name });
api.post('/api/auth/login', { email, password });
api.post('/api/auth/google', { idToken });
```

---

### CHANGE #2: Update Environment Variables

**File: `.env` or `.env.production` or `.env.local`**

**Change from:**
```env
❌ VITE_API_URL=https://mutualfun-backend.vercel.app/api
❌ REACT_APP_API_URL=https://mutualfun-backend.vercel.app/api
```

**Change to:**
```env
✅ VITE_API_URL=https://mutualfun-backend.vercel.app
✅ REACT_APP_API_URL=https://mutualfun-backend.vercel.app

# For local development
VITE_API_URL_DEV=http://localhost:3002

# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com
REACT_APP_GOOGLE_CLIENT_ID=336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com
```

**Important:** Remove the `/api` suffix from the URL!

---

### CHANGE #3: Update Vercel Environment Variables (If using Vercel)

1. Go to: https://vercel.com
2. Select your frontend project
3. Click **Settings** → **Environment Variables**
4. Find or add these variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `VITE_API_URL` | `https://mutualfun-backend.vercel.app` | Production |
| `REACT_APP_API_URL` | `https://mutualfun-backend.vercel.app` | Production |
| `VITE_GOOGLE_CLIENT_ID` | `336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com` | Production |

5. Click **Save**
6. Go to **Deployments** tab
7. Click **Redeploy** (important!)

---

### CHANGE #4: Fix Google OAuth Console Settings

Go to: https://console.cloud.google.com/apis/credentials

1. Select your OAuth 2.0 Client ID: `336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com`

2. Click **Edit**

3. Under **Authorized JavaScript origins**, add:
   ```
   http://localhost:3000
   http://localhost:5001
   https://mutual-fun-frontend-osed.vercel.app
   ```
   **Important:** No trailing slashes!

4. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:3002/api/auth/google/callback
   http://localhost:3000/auth/callback
   https://mutualfun-backend.vercel.app/api/auth/google/callback
   https://mutual-fun-frontend-osed.vercel.app/auth/callback
   ```

5. Click **Save**

6. **Wait 5-10 minutes** for changes to propagate

---

## 🚀 DEPLOYMENT STEPS

After making all changes:

```bash
# 1. Commit changes
git add .
git commit -m "fix: Remove /api from base URL to prevent duplicate path"

# 2. Push to repository
git push origin main

# 3. Vercel will auto-deploy (if connected)
# OR manually deploy:
npm run build
vercel --prod
```

---

## 🧪 TESTING & VERIFICATION

### Test 1: Check Network Tab (Browser DevTools)

1. Open your frontend in browser
2. Press `F12` to open DevTools
3. Go to **Network** tab
4. Try to register or login
5. Look at the request URL:

**Should see:**
```
✅ CORRECT: https://mutualfun-backend.vercel.app/api/auth/register
❌ WRONG: https://mutualfun-backend.vercel.app/api/api/auth/register
```

If you see `/api/api`, the base URL still has `/api` - fix it!

### Test 2: Check CORS Headers

In Network tab → Select any API request → **Headers** tab:

**Should see:**
```
Response Headers:
✅ Access-Control-Allow-Origin: https://mutual-fun-frontend-osed.vercel.app
✅ Access-Control-Allow-Credentials: true
```

### Test 3: Test Google OAuth

1. Click "Sign in with Google" button
2. Should **NOT** see: "The given origin is not allowed"
3. Should redirect to Google sign-in page
4. Should successfully login and redirect back

### Test 4: Test All Auth Endpoints

- Registration: Should work without 404
- Login: Should work without 404
- Google OAuth: Should work without origin error
- No CORS errors in console

---

## 📊 QUICK REFERENCE

| What | Wrong ❌ | Correct ✅ |
|------|---------|-----------|
| Base URL | `https://mutualfun-backend.vercel.app/api` | `https://mutualfun-backend.vercel.app` |
| Register URL | `.../api/api/auth/register` | `.../api/auth/register` |
| Login URL | `.../api/api/auth/login` | `.../api/auth/login` |
| Status | 404 Not Found | 200 OK |

---

## ✅ CHECKLIST

**In Code:**
- [ ] Found API client file (axios.ts or similar)
- [ ] Removed `/api` from base URL constant
- [ ] Verified API calls still have `/api` in the path
- [ ] Updated `.env` file (removed `/api`)
- [ ] Committed changes

**In Vercel Dashboard:**
- [ ] Updated `VITE_API_URL` (no `/api`)
- [ ] Updated `REACT_APP_API_URL` (no `/api`)
- [ ] Added Google Client ID
- [ ] Clicked "Redeploy"

**In Google Console:**
- [ ] Added `https://mutual-fun-frontend-osed.vercel.app` to JavaScript origins
- [ ] Added redirect URIs
- [ ] Saved changes
- [ ] Waited 5-10 minutes

**Testing:**
- [ ] Checked Network tab - no `/api/api`
- [ ] Registration works (200 OK)
- [ ] Login works (200 OK)
- [ ] Google OAuth works (no origin error)
- [ ] No CORS errors in console

---

## 🎯 EXPECTED RESULTS

After all changes:

✅ Registration API call: `POST https://mutualfun-backend.vercel.app/api/auth/register` → 200 OK
✅ Login API call: `POST https://mutualfun-backend.vercel.app/api/auth/login` → 200 OK  
✅ Google OAuth: Works without "origin not allowed" error
✅ No CORS errors in browser console
✅ All authentication flows working

---

## 🆘 TROUBLESHOOTING

**Still getting 404?**
- Check if base URL still has `/api` somewhere
- Check environment variables (both local and Vercel)
- Clear browser cache and hard refresh (Ctrl+F5)

**Still getting CORS error?**
- Wait 5 minutes - backend might be cold starting
- Check Network tab headers
- Make sure `withCredentials: true` is set in axios

**Google OAuth still blocked?**
- Wait 10 minutes after saving in Google Console
- Clear browser cache
- Try incognito mode
- Verify exact domain spelling in Google Console

**Environment variables not working?**
- Make sure variable names match your framework:
  - Vite uses `VITE_`
  - Create React App uses `REACT_APP_`
- Restart dev server after changing `.env`
- Redeploy on Vercel after changing variables

---

## 📝 SUMMARY

**Main Issue:** Your frontend API base URL includes `/api`, but your API calls also include `/api`, resulting in `/api/api` (404 error).

**Solution:** Remove `/api` from the base URL everywhere:
1. Code: Change base URL to `https://mutualfun-backend.vercel.app`
2. .env: Remove `/api` suffix
3. Vercel: Update environment variables
4. Google Console: Add authorized origins
5. Deploy and test

**That's it!** After these changes, all API calls will work correctly. 🚀

---

**Backend is already configured correctly - no backend changes needed!**
