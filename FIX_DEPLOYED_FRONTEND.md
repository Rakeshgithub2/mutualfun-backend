# FIX DEPLOYED FRONTEND - Vercel Edition

## 🚨 Critical Issue Identified

Your **Vercel-deployed frontend** shows "0 of 0 funds" because it's configured to call `localhost:3002`, which **doesn't exist in production**.

From your URL: `mutual-fun-frontend-osed.vercel.app/equity?category=mid-cap`

---

## 🎯 Step-by-Step Fix

### Step 1: Deploy Your Backend First

Your backend MUST be publicly accessible. Choose one:

#### Option A: Deploy Backend to Vercel (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your backend repository: `Rakeshgithub2/mutualfun-backend`
4. **Project Settings:**
   - Framework Preset: **Other**
   - Build Command: `npm run build` (or leave empty if no build)
   - Output Directory: `.` (leave default)
   - Install Command: `npm install`

5. **Environment Variables** (CRITICAL):

   ```bash
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=mongodb+srv://rakeshd01042024_db_user:***@mutualfunds.l7zeno9.mongodb.net/mutual-funds?appName=mutualfunds
   REDIS_URL=your_redis_url
   ALLOWED_ORIGINS=https://mutual-fun-frontend-osed.vercel.app,http://localhost:3000
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   JWT_SECRET=your_jwt_secret
   ```

6. Click **Deploy**

7. **Get your backend URL**: `https://your-backend-name.vercel.app`

#### Option B: Deploy to Render.com (Alternative)

1. Go to [render.com](https://render.com)
2. New Web Service
3. Connect GitHub repo
4. Settings:
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start` or `npm run dev:simple`
   - Add all environment variables

---

### Step 2: Fix Frontend Environment Variables

Once backend is deployed:

1. **Go to Vercel Dashboard**
2. **Select your frontend project**: `mutual-fun-frontend-osed`
3. **Settings** → **Environment Variables**

4. **Add/Update these variables:**

```bash
# CRITICAL - Must be your deployed backend URL
VITE_API_URL=https://your-backend-name.vercel.app/api
NEXT_PUBLIC_API_URL=https://your-backend-name.vercel.app/api

# If using Next.js
NEXT_PUBLIC_BACKEND_URL=https://your-backend-name.vercel.app

# Google OAuth (if needed)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com
```

**Important:** Add these for ALL environments:

- ✅ Production
- ✅ Preview
- ✅ Development

5. **Redeploy Frontend:**
   - Go to **Deployments** tab
   - Click on latest deployment
   - Click **⋯** (three dots) → **Redeploy**

---

### Step 3: Fix Frontend Code (Local First)

Navigate to your frontend folder:

```bash
cd "E:\mutual fund"
```

#### A. Check/Create Environment Files

**Create `.env.local`** (for local development):

```bash
# For local testing
VITE_API_URL=http://localhost:3002/api
NEXT_PUBLIC_API_URL=http://localhost:3002/api
```

**Create `.env.production`** (for deployment):

```bash
# For production - update after deploying backend
VITE_API_URL=https://your-backend-name.vercel.app/api
NEXT_PUBLIC_API_URL=https://your-backend-name.vercel.app/api
```

#### B. Find and Fix API Configuration

**Search for API base URL configuration:**

```bash
# In your frontend folder, run:
grep -r "localhost:3001\|localhost:3002\|localhost:5001" src/
# OR use VS Code search (Ctrl+Shift+F) to find these
```

**Common locations to check:**

- `src/config/api.ts`
- `src/config/constants.ts`
- `src/lib/api.ts`
- `src/utils/api.ts`
- `.env` or `.env.local`

**Fix the API URL:**

```typescript
// ❌ WRONG - Hardcoded localhost
const API_URL = 'http://localhost:3002/api';

// ✅ CORRECT - Use environment variable
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:3002/api';
```

#### C. Fix Category Parameter Issue

Your URL shows: `?category=mid-cap`  
Backend needs: `?category=equity&subCategory=Mid Cap`

**Find the equity page file** (likely `app/equity/page.tsx` or `pages/equity.tsx`):

```typescript
// ❌ WRONG - Sends wrong parameter
const fetchFunds = async () => {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category'); // Gets 'mid-cap'

  const response = await fetch(`${API_URL}/funds?category=${category}`);
  // This sends: /api/funds?category=mid-cap (WRONG!)
};

// ✅ CORRECT - Parse category correctly
const fetchFunds = async (category: string, subCategory?: string) => {
  const params = new URLSearchParams();
  params.append('category', category.toLowerCase()); // 'equity'
  if (subCategory) {
    params.append('subCategory', subCategory); // 'Mid Cap'
  }
  params.append('limit', '20');

  const url = `${API_URL}/funds?${params.toString()}`;
  const response = await fetch(url);
  // This sends: /api/funds?category=equity&subCategory=Mid Cap (CORRECT!)
};

// Usage when Mid Cap button is clicked:
fetchFunds('equity', 'Mid Cap');
```

**Update button handlers:**

```typescript
// Find where buttons are defined (Large Cap, Mid Cap, etc.)

// ❌ WRONG
<button onClick={() => router.push('/equity?category=mid-cap')}>
  Mid Cap
</button>

// ✅ CORRECT
<button onClick={() => {
  setCategory('equity')
  setSubCategory('Mid Cap')
  fetchFunds('equity', 'Mid Cap')
}}>
  Mid Cap
</button>
```

---

### Step 4: Test Locally First

Before redeploying, test locally:

1. **Start Backend Locally:**

   ```bash
   cd E:\mutual-funds-backend
   npm run dev:simple
   # Wait for: ✅ Server running on http://localhost:3002
   ```

2. **Start Frontend Locally:**

   ```bash
   cd "E:\mutual fund"
   npm run dev
   # Should start on http://localhost:3000 or similar
   ```

3. **Test in Browser:**
   - Open http://localhost:3000 (or your frontend port)
   - Click "Mid Cap" button
   - **Press F12** → **Network Tab**
   - Should see request to: `http://localhost:3002/api/funds?category=equity&subCategory=Mid Cap`
   - Should get 200 status with data

4. **Check Console Tab:**
   - Should see: `✅ Fetched X funds`
   - No CORS errors
   - No 404 errors

---

### Step 5: Deploy Fixed Version

Once working locally:

1. **Commit changes:**

   ```bash
   cd "E:\mutual fund"
   git add .
   git commit -m "Fix API URL and category parameters"
   git push origin main
   ```

2. **Vercel will auto-deploy** (if connected to GitHub)
   - Or manually trigger deployment in Vercel dashboard

3. **Verify deployment:**
   - Wait for deployment to complete
   - Visit: `https://mutual-fun-frontend-osed.vercel.app/equity`
   - Click "Mid Cap"
   - Should now see funds!

---

## 🔍 Quick Diagnostic Commands

### Check Frontend API Configuration

```bash
cd "E:\mutual fund"

# Search for API URL configuration
grep -r "API_URL\|BACKEND_URL\|localhost:300" src/ .env*

# Check environment files
cat .env.local
cat .env.production

# Check for hardcoded URLs
grep -r "http://localhost" src/
```

### Check What's Being Called

In your browser (F12):

1. **Network Tab:**
   - Filter: `Fetch/XHR`
   - Click "Mid Cap" button
   - Look for requests to `/api/funds` or `/funds`
   - Check the **full URL** - is it localhost or your deployed backend?
   - Check **Status** - 200 (good), 404/500 (bad), Failed (CORS/network)

2. **Console Tab:**
   - Look for error messages
   - Look for `console.log` statements showing what's being fetched

---

## 📋 Checklist

- [ ] Backend deployed and publicly accessible
- [ ] Got backend URL (e.g., `https://xyz.vercel.app`)
- [ ] Updated Vercel environment variables with backend URL
- [ ] Removed hardcoded `localhost` URLs from frontend code
- [ ] Fixed category parameters (`equity` + `Mid Cap` not `mid-cap`)
- [ ] Tested locally - both backend and frontend running
- [ ] Committed and pushed frontend changes
- [ ] Redeployed frontend on Vercel
- [ ] Verified on deployed URL - funds now showing

---

## 🆘 If Still Not Working

### Scenario 1: Backend Not Deployed Yet

**Temporary Fix**: Use backend on local machine with ngrok:

```bash
# Install ngrok: https://ngrok.com/download

# In one terminal - run backend
cd E:\mutual-funds-backend
npm run dev:simple

# In another terminal - expose backend
ngrok http 3002

# Copy the ngrok URL (e.g., https://abc123.ngrok.io)
# Add to Vercel environment variables:
VITE_API_URL=https://abc123.ngrok.io/api
```

### Scenario 2: CORS Errors

Update backend `.env`:

```bash
ALLOWED_ORIGINS=https://mutual-fun-frontend-osed.vercel.app,https://your-backend.vercel.app
```

Restart backend after changing.

### Scenario 3: Still Shows 0 Funds

Check in browser console:

- What URL is being called?
- What's the response?
- Any errors?

Share screenshots of:

1. Network tab (showing the request)
2. Console tab (showing errors)
3. The actual API response (click on the request in Network tab)

---

## 🚀 Expected Working State

After fixes:

1. ✅ Backend deployed at: `https://your-backend.vercel.app`
2. ✅ Frontend calls: `https://your-backend.vercel.app/api/funds`
3. ✅ Category params: `?category=equity&subCategory=Mid Cap`
4. ✅ Response: `200 OK` with `{ success: true, data: [...], pagination: {...} }`
5. ✅ UI shows: "Showing 20 of 4459 funds"

---

## 📞 Next Steps

1. **Deploy backend** to get public URL
2. **Share backend URL** with me
3. I'll help update frontend configuration
4. Test and verify

**OR**

Share your frontend repository URL, and I can review the code to identify exact issues.
