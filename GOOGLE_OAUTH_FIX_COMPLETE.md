# 🔧 GOOGLE OAUTH COMPLETE SETUP GUIDE

## ✅ FIXES COMPLETED

### 1. Backend Route Configuration ✅

**Issue:** The main routes file was importing the old `auth.ts` file which didn't have the POST `/api/auth/google` endpoint.

**Solution Applied:**

- Updated [src/routes/index.ts](src/routes/index.ts#L2) to import `auth.routes.ts` instead of `auth.ts`
- Added POST route to both files for redundancy
- Backend now properly handles both:
  - GET `/api/auth/google` - Redirect flow (OAuth2 callback)
  - POST `/api/auth/google` - ID Token verification (frontend direct flow)

### 2. Environment Variables ✅

Your `.env` file should be configured with:

```env
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:3002/api/auth/google/callback
FRONTEND_URL=http://localhost:5001
```

---

## ❌ Current Errors & Solutions

### Error 1: `[GSI_LOGGER]: The given origin is not allowed for the given client ID` (403)

**Cause:** Google Cloud Console doesn't have your frontend URL in the authorized origins list.

**Solution:** Add authorized JavaScript origins in Google Cloud Console:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your OAuth 2.0 Client ID
3. Under **Authorized JavaScript origins**, add:
   ```
   http://localhost:5001
   http://localhost:3000
   http://localhost:3002
   ```
4. Click **Save**
5. **Wait 5-10 minutes** for changes to propagate

### Error 2: `Failed to load resource: 404 on /api/auth/google` ✅ FIXED

**Cause:** Backend was using the old route file without the POST endpoint.

**Solution:** ✅ **COMPLETED** - Updated the route import to use `auth.routes.ts`.

### Error 3: `Cross-Origin-Opener-Policy policy would block the window.postMessage call`

**Cause:** COOP headers blocking Google OAuth popup communication.

**Solution:** Update your frontend Next.js configuration.

---

## 🔧 REMAINING FRONTEND CONFIGURATION

### 1. Google Cloud Console Setup

#### Step 1: Add Authorized JavaScript Origins

1. Visit: https://console.cloud.google.com/apis/credentials
2. Click on your Client ID
3. Under **Authorized JavaScript origins**, add:
   ```
   http://localhost:5001
   http://localhost:3000
   http://localhost:3002
   https://your-production-domain.com
   ```

#### Step 2: Add Authorized Redirect URIs

Add these redirect URIs (if not already present):

```
http://localhost:3002/api/auth/google/callback
http://localhost:5001/auth/success
https://your-production-domain.com/api/auth/google/callback
```

#### Step 3: Save and Wait

- Click **Save**
- **IMPORTANT:** Changes take 5-10 minutes to propagate
- Clear your browser cache after changes

---

### 2. Frontend Environment Variables

Ensure your frontend `.env.local` has:

```env
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_BACKEND_URL=http://localhost:3002
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

**⚠️ IMPORTANT:** The `NEXT_PUBLIC_GOOGLE_CLIENT_ID` must match the backend `GOOGLE_CLIENT_ID` exactly!

---

### 3. Next.js Configuration for COOP Headers

If your frontend doesn't already have COOP headers configured, add this to `next.config.mjs` or `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
        ],
      },
    ];
  },
  // ... rest of your config
};

export default nextConfig;
```

---

## 🚀 RESTART SERVERS

After backend changes are applied, restart both servers:

### Backend (Already Fixed ✅)

```powershell
# Stop current backend (Ctrl+C)
cd e:\mutual-funds-backend
npm run dev
```

### Frontend

```powershell
# Stop current frontend (Ctrl+C)
cd your-frontend-directory
npm run dev
```

---

## ✅ TESTING

### Test 1: Backend Endpoint ✅

Test if POST `/api/auth/google` exists:

```powershell
curl -X POST http://localhost:3002/api/auth/google `
  -H "Content-Type: application/json" `
  -d '{\"idToken\":\"test\"}'
```

**Expected:** `400` or `401` (not 404!)

### Test 2: Google Sign-In Button

1. Open: `http://localhost:5001/auth/login`
2. Click "Sign in with Google"
3. Check browser console for errors
4. Should see Google account picker popup (after Google Cloud Console is configured)

### Test 3: Complete Sign-In Flow

1. Click Google button
2. Select Google account
3. Should redirect to home page
4. Check localStorage for tokens:
   ```javascript
   console.log(localStorage.getItem('accessToken'));
   console.log(localStorage.getItem('user'));
   ```

---

## 🐛 TROUBLESHOOTING

### Error: "404 on /api/auth/google" ✅ FIXED

**Status:** ✅ **RESOLVED** - Backend route is now properly configured.

If you still see this error:

1. Restart backend server
2. Check terminal logs for "Google OAuth Configuration"
3. Verify backend is running on port 3002

### Error: "Origin not allowed" ⚠️ ACTION REQUIRED

**Cause:** Google Cloud Console not configured.

**Fix:**

1. Go to https://console.cloud.google.com/apis/credentials
2. Add `http://localhost:5001` to authorized origins
3. **Wait 5-10 minutes** for changes to propagate
4. Clear browser cache and try again

### Error: "Invalid Google ID token"

**Cause:** Client ID mismatch between frontend and backend.

**Fix:**

1. Verify frontend `.env.local` has your `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
2. Verify backend `.env` has your `GOOGLE_CLIENT_ID`
3. They must be **EXACTLY** the same
4. Restart both servers

### Error: Cross-Origin-Opener-Policy

**Cause:** COOP headers blocking Google OAuth popup.

**Fix:**

1. Update frontend `next.config.mjs` with headers (see above)
2. Restart frontend
3. Clear browser cache

---

## 📋 CHECKLIST

### Backend ✅ COMPLETED

- [x] POST route added to `src/routes/auth.routes.ts`
- [x] Main router updated to use `auth.routes.ts`
- [x] Backup route added to `src/routes/auth.ts`
- [x] `googleSignIn` controller properly implemented
- [x] Environment variables configured in `.env`

### Frontend ⚠️ ACTION REQUIRED

- [ ] Google Cloud Console - Add authorized JavaScript origins
- [ ] Google Cloud Console - Verify redirect URIs
- [ ] Frontend `.env.local` - Add `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- [ ] Frontend `next.config.mjs` - Add COOP headers (if needed)
- [ ] Restart frontend server
- [ ] Clear browser cache

---

## 📞 BACKEND LOGS

The backend has detailed logging. Look for:

```
🔐 Google OAuth Configuration:
  CLIENT_ID: 336417139932-cofv...
  CLIENT_SECRET: GOCSPX-...
  REDIRECT_URI: http://localhost:3002/api/auth/google/callback
  FRONTEND_URL: http://localhost:5001
```

If you see `MISSING!` for any value, check your `.env` file.

---

## 🎉 SUCCESS INDICATORS

You'll know it's working when:

1. ✅ No 404 errors on `/api/auth/google` ✅ FIXED
2. ✅ No "origin not allowed" errors (after Google Cloud Console setup)
3. ✅ Google account picker popup appears
4. ✅ After selecting account, redirects to home page
5. ✅ Tokens are stored in localStorage
6. ✅ User is logged in

---

## 📝 SUMMARY

### What Was Fixed:

1. ✅ Backend route configuration - Now using `auth.routes.ts` with POST endpoint
2. ✅ Environment variables verified and properly configured
3. ✅ Backend code is ready and working

### What You Need to Do:

1. ⚠️ **Configure Google Cloud Console** (add authorized origins)
2. ⚠️ Verify frontend environment variables
3. ⚠️ Add COOP headers to Next.js config (if needed)
4. ⚠️ Restart both servers
5. ⚠️ Test the flow

---

## 🔗 Quick Links

- **Google Cloud Console:** https://console.cloud.google.com/apis/credentials
- **Your Client ID:** Check your Google Cloud Console
- **Backend Logs:** Check terminal running `npm run dev` in `e:\mutual-funds-backend`
- **Frontend:** Should be running on `http://localhost:5001`

---

**Backend is fully configured and ready! Complete the frontend configuration in Google Cloud Console to finish the setup.**
