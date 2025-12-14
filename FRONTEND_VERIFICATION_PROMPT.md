# 🔍 FRONTEND COMPLETE VERIFICATION & FIX PROMPT

Copy and paste this entire prompt to GitHub Copilot when working in your frontend folder:

---

## CONTEXT

I have a **Mutual Funds Platform** with:

- **Backend:** `https://mutualfun-backend.vercel.app` (✅ Working, CORS fixed)
- **Frontend:** `https://mutual-fun-frontend-osed.vercel.app` (Needs verification)

The backend APIs are **fully working** and verified. I need you to:

1. **Cross-check ALL frontend API integrations**
2. **Verify all endpoints are using correct URLs**
3. **Test all features and fix any issues**
4. **Ensure data is loading correctly**

---

## ✅ BACKEND STATUS (VERIFIED WORKING)

### Available APIs:

1. **Health Check:** `GET /health`
2. **Market Indices:** `GET /api/market-indices` ✅
   - Returns: Sensex, Nifty 50, Nifty Midcap, Gift Nifty
3. **Funds:**
   - `GET /api/funds` - All funds with filters
   - `GET /api/funds/:id` - Single fund details
4. **Auth:**
   - `POST /api/auth/register` - User registration
   - `POST /api/auth/login` - Email/password login
   - `POST /api/auth/google` - Google OAuth
   - `GET /api/auth/google/callback` - OAuth callback
5. **Portfolio:**
   - `GET /api/portfolio` - User's portfolio
   - `POST /api/portfolio/invest` - Make investment
6. **Comparison:**
   - `POST /api/compare/overlap` - Fund overlap comparison
7. **Search:**
   - `GET /api/search/autocomplete` - Fund search suggestions

### Backend Base URL:

```javascript
const API_BASE_URL = 'https://mutualfun-backend.vercel.app';
```

### CORS Configuration:

- ✅ Backend allows: `https://mutual-fun-frontend-osed.vercel.app`
- ✅ Backend allows: `http://localhost:5001`, `http://localhost:3000`
- ✅ All CORS headers properly set

---

## 🎯 YOUR TASKS

### TASK 1: Verify API Configuration Files

**Find and check these files:**

1. `constants.js`, `config.js`, `api.js`, or similar configuration files
2. `.env`, `.env.local`, `.env.production` files
3. Any API client/service files

**Verify:**

- [ ] API base URL is: `https://mutualfun-backend.vercel.app`
- [ ] NO trailing slash in base URL
- [ ] All API endpoints match backend routes

**Common Issues to Fix:**

```javascript
// ❌ WRONG
const API_URL = 'https://mutualfun-backend.vercel.app/'; // trailing slash
const API_URL = 'http://localhost:3002'; // local URL in production

// ✅ CORRECT
const API_URL = 'https://mutualfun-backend.vercel.app';
```

---

### TASK 2: Fix Market Indices Integration

**Issue:** Market indices (Nifty 50, Sensex, Midcap) not showing at top

**Find code that fetches market indices and fix:**

```javascript
// ❌ WRONG ENDPOINT
fetch(`${API_URL}/api/market/indices`);

// ✅ CORRECT ENDPOINT
fetch(`${API_URL}/api/market-indices`);
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "sensex": {
      "name": "S&P BSE Sensex",
      "value": 82000,
      "change": 150,
      "changePercent": 0.18
    },
    "nifty50": {
      "name": "Nifty 50",
      "value": 25000,
      "change": 50,
      "changePercent": 0.2
    },
    "niftyMidcap": {
      "name": "Nifty Midcap 100",
      "value": 58000,
      "change": -100,
      "changePercent": -0.17
    },
    "giftNifty": {
      "name": "Gift Nifty",
      "value": 25050,
      "change": 60,
      "changePercent": 0.24
    }
  }
}
```

**What to check:**

- [ ] Fetching from correct endpoint
- [ ] Handling response correctly
- [ ] Displaying all 4 indices
- [ ] Showing change (positive/negative) with colors
- [ ] Auto-refreshing data periodically

---

### TASK 3: Verify Funds Data Integration

**Endpoints to check:**

1. **All Funds (with filters):**

```javascript
// GET /api/funds
// Query params: category, subCategory, risk, limit, skip, sortBy

// Example
fetch(`${API_URL}/api/funds?limit=20&category=equity`);
```

2. **Fund Details:**

```javascript
// GET /api/funds/:fundId
fetch(`${API_URL}/api/funds/120503`);
```

**Check:**

- [ ] Funds list loading correctly
- [ ] Filters working (category, risk, etc.)
- [ ] Pagination working
- [ ] Fund details page working
- [ ] Search functionality working
- [ ] No CORS errors in console

---

### TASK 4: Verify Google OAuth Integration

**Backend OAuth URLs:**

- Initiate: `GET https://mutualfun-backend.vercel.app/api/auth/google`
- Callback: `GET https://mutualfun-backend.vercel.app/api/auth/google/callback`

**Frontend OAuth token endpoint:**

```javascript
// POST /api/auth/google
// Body: { token: "google_id_token" }

fetch(`${API_URL}/api/auth/google`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token: googleIdToken }),
});
```

**Check:**

- [ ] Google OAuth button visible
- [ ] Clicking redirects to Google
- [ ] After Google login, redirects back to frontend
- [ ] Token stored in localStorage/cookies
- [ ] User logged in successfully
- [ ] Success page shows user info

**Common Issues:**

```javascript
// ❌ WRONG - Using local URL
window.location.href = 'http://localhost:3002/api/auth/google';

// ✅ CORRECT - Using production URL
window.location.href = 'https://mutualfun-backend.vercel.app/api/auth/google';
```

---

### TASK 5: Verify All API Calls

**Search for ALL API calls in your codebase:**

1. Find all `fetch()`, `axios.get()`, `axios.post()`, etc.
2. Ensure ALL use the correct base URL
3. Check for hardcoded URLs

**Common patterns to find and fix:**

```javascript
// Find these patterns:
fetch('http://localhost:3002/api/...');
fetch('http://localhost:3000/api/...');
axios.get('http://...');

// Replace with:
fetch(`${API_BASE_URL}/api/...`);
```

**Run a search for:**

- `localhost:3002`
- `localhost:3000`
- `localhost:3001`
- `127.0.0.1`

And replace ALL with: `https://mutualfun-backend.vercel.app`

---

### TASK 6: Check Environment Variables

**If using Vite (React/Vue):**

```env
# .env.production
VITE_API_URL=https://mutualfun-backend.vercel.app
VITE_FRONTEND_URL=https://mutual-fun-frontend-osed.vercel.app
```

**If using Next.js:**

```env
# .env.production
NEXT_PUBLIC_API_URL=https://mutualfun-backend.vercel.app
NEXT_PUBLIC_FRONTEND_URL=https://mutual-fun-frontend-osed.vercel.app
```

**If using Create React App:**

```env
# .env.production
REACT_APP_API_URL=https://mutualfun-backend.vercel.app
REACT_APP_FRONTEND_URL=https://mutual-fun-frontend-osed.vercel.app
```

**Check:**

- [ ] Environment variables set correctly
- [ ] Using correct prefix (VITE*, NEXT_PUBLIC*, REACT*APP*)
- [ ] Variables accessible in code
- [ ] Deployed to Vercel with correct env vars

---

### TASK 7: Test All Features

**Create a comprehensive test and fix any issues:**

1. **Homepage:**
   - [ ] Market indices showing at top
   - [ ] Market indices updating values
   - [ ] Hero section visible
   - [ ] Fund categories showing

2. **Funds List Page:**
   - [ ] Funds loading and displaying
   - [ ] Category filters working
   - [ ] Risk filters working
   - [ ] Search working
   - [ ] Pagination working
   - [ ] Clicking fund opens details

3. **Fund Details Page:**
   - [ ] Fund info loading
   - [ ] Manager details showing
   - [ ] Returns/performance showing
   - [ ] Holdings showing
   - [ ] Invest button working

4. **Authentication:**
   - [ ] Register form working
   - [ ] Login form working
   - [ ] Google OAuth button working
   - [ ] After login, user info showing
   - [ ] Logout working
   - [ ] Protected routes working

5. **Portfolio (if logged in):**
   - [ ] Portfolio page accessible
   - [ ] Investments showing
   - [ ] Add investment working
   - [ ] Portfolio summary showing

6. **Comparison:**
   - [ ] Compare funds feature working
   - [ ] Overlap calculation working
   - [ ] Results displaying correctly

7. **Search & Autocomplete:**
   - [ ] Search bar working
   - [ ] Autocomplete suggestions showing
   - [ ] Clicking suggestion navigates correctly

---

### TASK 8: Check Browser Console

**Open browser console (F12) and verify:**

- [ ] NO CORS errors
- [ ] NO 404 errors for API calls
- [ ] NO authentication errors (unless logged out)
- [ ] API calls returning 200 status
- [ ] Data loading correctly

**Common Console Errors to Fix:**

```
❌ "Access to fetch at '...' from origin '...' has been blocked by CORS"
   → Check if using correct API URL

❌ "404 Not Found: /api/market/indices"
   → Should be /api/market-indices (with hyphen)

❌ "Failed to fetch"
   → Check internet connection, API URL, CORS
```

---

### TASK 9: Verify Vercel Deployment

**Check Vercel Environment Variables:**

1. Go to Vercel Dashboard → Your Frontend Project
2. Go to **Settings** → **Environment Variables**
3. Ensure these are set:

```
VITE_API_URL=https://mutualfun-backend.vercel.app
VITE_FRONTEND_URL=https://mutual-fun-frontend-osed.vercel.app
```

(Use appropriate prefix for your framework)

4. After adding/updating env vars, **Redeploy**

---

### TASK 10: Create Verification Report

**After fixing everything, create a report:**

```markdown
# Frontend Verification Report

## ✅ Fixed Issues

1. Changed API base URL from localhost to production
2. Fixed market indices endpoint from /market/indices to /market-indices
3. Updated Google OAuth redirect URLs
4. Fixed environment variables
5. [List all fixes made]

## ✅ Verified Working

- [ ] Market indices loading (Nifty, Sensex, Midcap)
- [ ] Funds list loading
- [ ] Fund details loading
- [ ] Search working
- [ ] Filters working
- [ ] Google OAuth working
- [ ] Login/Register working
- [ ] Portfolio working
- [ ] No CORS errors
- [ ] No console errors

## 🐛 Known Issues (if any)

- [List any remaining issues]

## 📊 Test Results

- Total API endpoints tested: [number]
- Working endpoints: [number]
- Failed endpoints: [number]
- Overall status: [Working/Needs fixes]
```

---

## 🚨 CRITICAL CHECKLIST

Before saying "done", verify:

- [ ] ✅ All API calls use: `https://mutualfun-backend.vercel.app`
- [ ] ✅ NO localhost URLs in production code
- [ ] ✅ Market indices endpoint is: `/api/market-indices` (hyphen)
- [ ] ✅ Google OAuth uses production backend URL
- [ ] ✅ Environment variables set in Vercel
- [ ] ✅ Hard refresh frontend (Ctrl+Shift+R)
- [ ] ✅ No CORS errors in browser console
- [ ] ✅ No 404 errors in network tab
- [ ] ✅ All data loading on live site
- [ ] ✅ Market indices updating with real values

---

## 📝 FILES TO CHECK AND MODIFY

Search for and update these file patterns:

1. **Config/Constants files:**
   - `src/config/api.js`
   - `src/constants/config.js`
   - `src/utils/api.js`
   - `src/services/api.service.js`
   - Any file with API configuration

2. **Environment files:**
   - `.env`
   - `.env.local`
   - `.env.production`

3. **Service/API files:**
   - `src/services/*`
   - `src/api/*`
   - Files that make API calls

4. **Component files:**
   - Search all `.jsx`, `.tsx`, `.vue` files for hardcoded URLs
   - Look for `fetch(`, `axios.get(`, `axios.post(`

5. **OAuth/Auth files:**
   - Google OAuth components
   - Login/Register components
   - Auth service files

---

## 🎯 EXPECTED FINAL STATE

After all fixes, the frontend should:

1. ✅ Display market indices at top (Nifty 50, Sensex, Midcap, Gift Nifty)
2. ✅ Load funds list without errors
3. ✅ Show fund details when clicked
4. ✅ Search and filters work smoothly
5. ✅ Google OAuth works end-to-end
6. ✅ Login/Register works
7. ✅ Portfolio features work for logged-in users
8. ✅ No CORS errors in console
9. ✅ No 404 errors in network tab
10. ✅ All data displays correctly

---

## 💡 DEBUGGING TIPS

If something doesn't work:

1. **Open Browser DevTools (F12)**
   - Check Console for errors
   - Check Network tab for failed requests
   - Look at request URLs and responses

2. **Hard Refresh**
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

3. **Clear Cache**
   - Chrome: Settings → Privacy → Clear browsing data
   - Or use Incognito/Private mode

4. **Check Vercel Logs**
   - Go to Vercel Dashboard
   - Check deployment logs for build errors

5. **Test Backend Directly**
   - Open: `https://mutualfun-backend.vercel.app/api/market-indices`
   - Should return JSON data
   - If this works, issue is in frontend

---

## ✨ START VERIFICATION NOW

**Please:**

1. Search for ALL API configuration files
2. Find ALL hardcoded URLs (localhost, wrong domains)
3. Update ALL API calls to use correct backend URL
4. Fix market indices endpoint
5. Fix Google OAuth URLs
6. Test ALL features
7. Verify in browser (no console errors)
8. Create verification report

**Let me know what you find and what fixes you made!**
