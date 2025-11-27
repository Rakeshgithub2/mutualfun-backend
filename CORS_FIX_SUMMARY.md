# CORS Fix Summary

## Problem

The backend was configured to only allow requests from `https://mf-frontend-coral.vercel.app`, but the new frontend is deployed at `https://mutual-fun-frontend-osed.vercel.app`, causing CORS errors.

## Changes Made

### 1. **vercel.json**

- Changed `Access-Control-Allow-Origin` from hardcoded single origin to `*` to allow all origins
- Removed `Access-Control-Allow-Credentials` header (not compatible with wildcard origin)

### 2. **api/index.ts** (Main Vercel API Entry Point)

- Implemented dynamic CORS origin checking
- Added both old and new frontend URLs to allowed origins list
- Now properly returns the requesting origin in the CORS header

### 3. **api/health.ts** (Health Check Endpoint)

- Implemented dynamic CORS origin checking
- Added both frontend URLs to allowed origins list

### 4. **src/app.ts** (Express App)

- Added `https://mutual-fun-frontend-osed.vercel.app` to the CORS origins array
- Kept backward compatibility with the old URL

### 5. **src/index.ts** (Local Development Server)

- Added both frontend URLs to CORS origins array
- Maintains localhost support for development

## Allowed Origins

The backend now accepts requests from:

- ✅ `https://mf-frontend-coral.vercel.app` (old)
- ✅ `https://mutual-fun-frontend-osed.vercel.app` (new)
- ✅ `http://localhost:3000`
- ✅ `http://localhost:5001`
- ✅ `http://localhost:3001`
- ✅ Any URL set in `FRONTEND_URL` environment variable

## Deployment Steps

### Option 1: Automatic Deployment (Recommended)

If you have auto-deployment enabled on Vercel:

1. Commit these changes to your repository
2. Push to the branch connected to Vercel
3. Vercel will automatically deploy the changes

```bash
git add .
git commit -m "Fix CORS for new frontend URL"
git push
```

### Option 2: Manual Deployment via Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy
vercel --prod
```

### Option 3: Redeploy via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Find your `mutualfun-backend` project
3. Go to "Deployments" tab
4. Click "..." menu on the latest deployment
5. Select "Redeploy"

## Testing the Fix

After deployment, test these endpoints from your frontend:

- `https://mutualfun-backend.vercel.app/health`
- `https://mutualfun-backend.vercel.app/api/funds?limit=10`
- `https://mutualfun-backend.vercel.app/api/auth/login` (POST)

## Additional Recommendations

### 1. Environment Variable Approach (Best Practice)

Instead of hardcoding URLs, set an environment variable in Vercel:

**Vercel Dashboard → Your Project → Settings → Environment Variables:**

- Key: `ALLOWED_ORIGINS`
- Value: `https://mutual-fun-frontend-osed.vercel.app,https://mf-frontend-coral.vercel.app,http://localhost:3000,http://localhost:5001`

### 2. Security Considerations

- The `vercel.json` now uses `*` for CORS which is permissive
- Consider switching back to explicit origins after confirming the new URL
- For production, only allow your actual production frontend URLs

### 3. Credentials with CORS

Note: When using `credentials: true`, you cannot use wildcard (`*`) origins. The current implementation in `api/index.ts` and `api/health.ts` properly handles this by checking the origin and returning it explicitly.

## Troubleshooting

If CORS errors persist after deployment:

1. **Clear browser cache**: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. **Check deployment logs**: Verify the new code was deployed
3. **Check browser console**: Look for the exact CORS error message
4. **Verify origin**: Make sure you're accessing from the correct URL
5. **Check Network tab**: Look at the response headers to see what CORS headers are being sent

## Files Modified

- ✅ `vercel.json`
- ✅ `api/index.ts`
- ✅ `api/health.ts`
- ✅ `src/app.ts`
- ✅ `src/index.ts`
