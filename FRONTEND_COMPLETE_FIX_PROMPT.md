# 🚨 FRONTEND EMERGENCY FIX - Copy This Entire Prompt

**Problem Identified:** Your frontend has a **double slash bug** (`//market-indices`) and missing `/api` prefix in URLs.

**Copy this entire prompt and paste it in GitHub Copilot when working in your FRONTEND folder.**

---

## 🔴 CRITICAL ISSUES TO FIX

### Issue 1: Double Slash in URLs

```
❌ WRONG: https://mutualfun-backend.vercel.app//market-indices
✅ CORRECT: https://mutualfun-backend.vercel.app/api/market-indices
```

### Issue 2: Missing `/api` Prefix

All backend routes need `/api` prefix.

---

## 🎯 STEP-BY-STEP FIX INSTRUCTIONS

### STEP 1: Find API Configuration File

Search for files containing API configuration:

- `src/config/api.js`
- `src/config/config.js`
- `src/constants/api.js`
- `src/constants.js`
- `src/utils/api.js`
- `src/lib/api.js`

**Search command:** Look for files with `API_URL`, `BASE_URL`, `API_BASE`, or similar.

### STEP 2: Fix the API Base URL

**Find this code:**

```javascript
// ❌ WRONG - Has trailing slash
const API_BASE_URL = 'https://mutualfun-backend.vercel.app/';
const API_URL = 'https://mutualfun-backend.vercel.app/';
const BASE_URL = 'https://mutualfun-backend.vercel.app/';
```

**Replace with:**

```javascript
// ✅ CORRECT - No trailing slash
const API_BASE_URL = 'https://mutualfun-backend.vercel.app';
```

### STEP 3: Fix ALL API Endpoint Calls

Find and fix ALL these patterns in your code:

#### Market Indices

```javascript
// ❌ WRONG
fetch(`${API_BASE_URL}/market-indices`);
fetch(`${API_BASE_URL}market-indices`);

// ✅ CORRECT
fetch(`${API_BASE_URL}/api/market-indices`);
```

#### Funds

```javascript
// ❌ WRONG
fetch(`${API_BASE_URL}/funds`);
fetch(`${API_BASE_URL}/funds/${id}`);

// ✅ CORRECT
fetch(`${API_BASE_URL}/api/funds`);
fetch(`${API_BASE_URL}/api/funds/${id}`);
```

#### Authentication

```javascript
// ❌ WRONG
fetch(`${API_BASE_URL}/auth/login`);
fetch(`${API_BASE_URL}/auth/register`);
fetch(`${API_BASE_URL}/auth/google`);

// ✅ CORRECT
fetch(`${API_BASE_URL}/api/auth/login`);
fetch(`${API_BASE_URL}/api/auth/register`);
fetch(`${API_BASE_URL}/api/auth/google`);
```

#### Portfolio

```javascript
// ❌ WRONG
fetch(`${API_BASE_URL}/portfolio`);
fetch(`${API_BASE_URL}/portfolio/invest`);

// ✅ CORRECT
fetch(`${API_BASE_URL}/api/portfolio`);
fetch(`${API_BASE_URL}/api/portfolio/invest`);
```

#### Search/Autocomplete

```javascript
// ❌ WRONG
fetch(`${API_BASE_URL}/search/autocomplete`);

// ✅ CORRECT
fetch(`${API_BASE_URL}/api/search/autocomplete`);
```

#### Comparison/Overlap

```javascript
// ❌ WRONG
fetch(`${API_BASE_URL}/compare/overlap`);

// ✅ CORRECT
fetch(`${API_BASE_URL}/api/compare/overlap`);
```

### STEP 4: Fix Environment Variables

**Check these files:**

- `.env`
- `.env.local`
- `.env.production`

**For Vite (React/Vue):**

```env
# ✅ CORRECT - No trailing slash
VITE_API_URL=https://mutualfun-backend.vercel.app
VITE_FRONTEND_URL=https://mutual-fun-frontend-osed.vercel.app
```

**For Next.js:**

```env
# ✅ CORRECT - No trailing slash
NEXT_PUBLIC_API_URL=https://mutualfun-backend.vercel.app
NEXT_PUBLIC_FRONTEND_URL=https://mutual-fun-frontend-osed.vercel.app
```

**For Create React App:**

```env
# ✅ CORRECT - No trailing slash
REACT_APP_API_URL=https://mutualfun-backend.vercel.app
REACT_APP_FRONTEND_URL=https://mutual-fun-frontend-osed.vercel.app
```

### STEP 5: Search and Replace Globally

Run these searches across your ENTIRE frontend codebase:

#### Search 1: Find trailing slashes

**Find:** `mutualfun-backend.vercel.app/`
**Replace:** `mutualfun-backend.vercel.app`

#### Search 2: Find endpoints without /api prefix

**Find these patterns:**

- `${API_BASE_URL}/funds`
- `${API_BASE_URL}/auth`
- `${API_BASE_URL}/portfolio`
- `${API_BASE_URL}/market-indices`
- `${API_BASE_URL}/search`
- `${API_BASE_URL}/compare`

**Add `/api` after `API_BASE_URL`:**

- `${API_BASE_URL}/api/funds`
- `${API_BASE_URL}/api/auth`
- `${API_BASE_URL}/api/portfolio`
- `${API_BASE_URL}/api/market-indices`
- `${API_BASE_URL}/api/search`
- `${API_BASE_URL}/api/compare`

#### Search 3: Find localhost URLs

**Find and remove:**

- `localhost:3002`
- `localhost:3000`
- `localhost:3001`
- `http://localhost`

**Replace ALL with:**

```javascript
${API_BASE_URL}/api/...
```

### STEP 6: Update Vercel Environment Variables

1. Go to **Vercel Dashboard**
2. Select your **frontend project**
3. Go to **Settings** → **Environment Variables**
4. Add/Update these variables:

```
Variable Name: VITE_API_URL (or NEXT_PUBLIC_API_URL or REACT_APP_API_URL)
Value: https://mutualfun-backend.vercel.app
Environment: Production, Preview, Development

Variable Name: VITE_FRONTEND_URL (or appropriate prefix)
Value: https://mutual-fun-frontend-osed.vercel.app
Environment: Production, Preview, Development
```

5. Click **Save**
6. Go to **Deployments** tab
7. Click **Redeploy** on the latest deployment

---

## 📋 COMPLETE API ENDPOINT REFERENCE

Use this as a checklist to verify ALL endpoints:

### ✅ Correct Backend Endpoints:

```javascript
const API_BASE = 'https://mutualfun-backend.vercel.app';

// Health Check
GET ${API_BASE}/health

// Market Indices
GET ${API_BASE}/api/market-indices

// Funds
GET ${API_BASE}/api/funds
GET ${API_BASE}/api/funds/:fundId
GET ${API_BASE}/api/funds?category=equity&limit=20

// Authentication
POST ${API_BASE}/api/auth/register
POST ${API_BASE}/api/auth/login
POST ${API_BASE}/api/auth/google
GET ${API_BASE}/api/auth/google/callback

// Portfolio
GET ${API_BASE}/api/portfolio
POST ${API_BASE}/api/portfolio/invest

// Search
GET ${API_BASE}/api/search/autocomplete?q=hdfc

// Comparison
POST ${API_BASE}/api/compare/overlap
```

---

## 🔍 FILES TO CHECK

Search for and update these files:

### 1. Configuration Files

- [ ] `src/config/api.js` or `src/config/config.js`
- [ ] `src/constants/api.js` or `src/constants.js`
- [ ] `src/utils/api.js`
- [ ] `src/lib/api.js`

### 2. Service Files

- [ ] `src/services/marketService.js`
- [ ] `src/services/fundService.js`
- [ ] `src/services/authService.js`
- [ ] `src/services/portfolioService.js`
- [ ] `src/services/api.js`

### 3. Component Files

Search all `.jsx`, `.tsx`, `.vue`, `.js` files for:

- [ ] `fetch(` calls
- [ ] `axios.get(` calls
- [ ] `axios.post(` calls
- [ ] Hardcoded API URLs

### 4. Environment Files

- [ ] `.env`
- [ ] `.env.local`
- [ ] `.env.production`
- [ ] `.env.development`

---

## 🧪 TESTING AFTER FIXES

### Test 1: Check API URL in Code

```javascript
// In browser console or your code
console.log('API Base URL:', API_BASE_URL);
// Should print: https://mutualfun-backend.vercel.app (NO trailing slash)
```

### Test 2: Test Market Indices Endpoint

```javascript
// In browser console
fetch('https://mutualfun-backend.vercel.app/api/market-indices')
  .then((res) => res.json())
  .then((data) => console.log('Market data:', data));
```

**Expected result:** Should return market indices data with Nifty, Sensex, etc.

### Test 3: Check Network Tab

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Reload page
4. Check all API calls:
   - [ ] URLs should have single `/` (not `//`)
   - [ ] All endpoints should have `/api/` prefix
   - [ ] Should return 200 status (not 308 redirect)
   - [ ] No CORS errors

### Test 4: Check Console

1. Open browser console (F12)
2. Should see **NO errors** like:
   - ❌ `CORS policy` errors
   - ❌ `ERR_FAILED`
   - ❌ `308 Permanent Redirect`
   - ❌ `//market-indices` (double slash)

---

## 🚨 COMMON MISTAKES TO AVOID

### Mistake 1: Trailing Slash

```javascript
// ❌ WRONG
const API_URL = 'https://mutualfun-backend.vercel.app/';

// Result: https://mutualfun-backend.vercel.app//api/funds (double slash!)
```

### Mistake 2: Missing /api Prefix

```javascript
// ❌ WRONG
fetch(`${API_URL}/funds`); // Missing /api

// ✅ CORRECT
fetch(`${API_URL}/api/funds`); // Has /api prefix
```

### Mistake 3: Hardcoded URLs

```javascript
// ❌ WRONG
fetch('http://localhost:3002/api/funds');

// ✅ CORRECT
fetch(`${API_BASE_URL}/api/funds`);
```

### Mistake 4: Old Environment Variables

```javascript
// ❌ WRONG - Using wrong env var
const API_URL = process.env.REACT_APP_BACKEND_URL; // Doesn't exist

// ✅ CORRECT - Using correct env var
const API_URL =
  process.env.VITE_API_URL || 'https://mutualfun-backend.vercel.app';
```

---

## 🎯 AUTOMATED FIX SCRIPT

If you have many files to fix, use this find-and-replace strategy:

### VS Code Global Search & Replace:

1. **Press:** `Ctrl + Shift + H` (Windows) or `Cmd + Shift + H` (Mac)

2. **Find:** `mutualfun-backend\.vercel\.app/`
   **Replace:** `mutualfun-backend.vercel.app`
   **Click:** Replace All

3. **Find:** `\$\{API_BASE_URL\}/funds`
   **Replace:** `${API_BASE_URL}/api/funds`
   **Enable:** Regex mode
   **Click:** Replace All

4. **Find:** `\$\{API_BASE_URL\}/auth`
   **Replace:** `${API_BASE_URL}/api/auth`
   **Click:** Replace All

5. **Find:** `\$\{API_BASE_URL\}/portfolio`
   **Replace:** `${API_BASE_URL}/api/portfolio`
   **Click:** Replace All

6. **Find:** `\$\{API_BASE_URL\}/market-indices`
   **Replace:** `${API_BASE_URL}/api/market-indices`
   **Click:** Replace All

7. **Find:** `\$\{API_BASE_URL\}/search`
   **Replace:** `${API_BASE_URL}/api/search`
   **Click:** Replace All

8. **Find:** `\$\{API_BASE_URL\}/compare`
   **Replace:** `${API_BASE_URL}/api/compare`
   **Click:** Replace All

---

## ✅ DEPLOYMENT STEPS

After fixing all code:

1. **Commit changes:**

   ```bash
   git add .
   git commit -m "fix: Remove trailing slash and add /api prefix to all endpoints"
   git push
   ```

2. **Update Vercel Environment Variables:**
   - Go to Vercel Dashboard
   - Settings → Environment Variables
   - Ensure no trailing slashes in URLs
   - Redeploy

3. **Hard Refresh Browser:**
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`
   - Or use Incognito mode

4. **Clear Browser Cache:**
   - Chrome: Settings → Privacy → Clear browsing data
   - Select "Cached images and files"
   - Click Clear data

---

## 🎯 FINAL VERIFICATION CHECKLIST

After all fixes, verify:

- [ ] ✅ API Base URL has NO trailing slash
- [ ] ✅ All endpoints have `/api/` prefix
- [ ] ✅ No `//` (double slashes) in any URL
- [ ] ✅ No localhost URLs in production code
- [ ] ✅ Environment variables updated in Vercel
- [ ] ✅ Frontend redeployed on Vercel
- [ ] ✅ Browser cache cleared
- [ ] ✅ Hard refresh performed (Ctrl+Shift+R)
- [ ] ✅ Network tab shows 200 status (not 308)
- [ ] ✅ No CORS errors in console
- [ ] ✅ Market indices loading correctly
- [ ] ✅ Funds list showing data
- [ ] ✅ All features working

---

## 🆘 IF STILL NOT WORKING

### Quick Debug:

1. **Test backend directly in browser:**
   Open: `https://mutualfun-backend.vercel.app/api/market-indices`
   - If this works → Problem is in frontend
   - If this fails → Problem is in backend

2. **Check exact URL being called:**
   - Open Network tab in browser
   - Look at the actual URL being requested
   - Should be: `https://mutualfun-backend.vercel.app/api/market-indices`
   - Should NOT be: `https://mutualfun-backend.vercel.app//market-indices`

3. **Check response status:**
   - 200 = Success ✅
   - 308 = Redirect (wrong URL with trailing slash) ❌
   - 404 = Not found (wrong endpoint) ❌
   - CORS error = URL issue ❌

---

## 📞 QUICK REFERENCE

### Backend Base URL:

```
https://mutualfun-backend.vercel.app
```

**(NO trailing slash!)**

### All Endpoints Format:

```
https://mutualfun-backend.vercel.app/api/{endpoint}
```

### Example Correct URLs:

- `https://mutualfun-backend.vercel.app/api/market-indices`
- `https://mutualfun-backend.vercel.app/api/funds`
- `https://mutualfun-backend.vercel.app/api/auth/login`
- `https://mutualfun-backend.vercel.app/api/portfolio`

---

## 🎬 START FIXING NOW!

**Your immediate action plan:**

1. ✅ Find your API config file
2. ✅ Remove trailing slash from base URL
3. ✅ Add `/api` prefix to all endpoints
4. ✅ Update environment variables
5. ✅ Search and replace globally
6. ✅ Test in browser console
7. ✅ Commit and push changes
8. ✅ Redeploy on Vercel
9. ✅ Hard refresh browser
10. ✅ Verify all features working

---

**Copy this entire prompt, go to your FRONTEND workspace, and paste it to GitHub Copilot to fix everything!**
