# Backend Testing Checklist ✅

## Backend Status: ✅ WORKING

### Verified Working:

- ✅ CORS Configuration (allows frontend origin)
- ✅ Health Endpoint (`/health`)
- ✅ Market Indices API (`/api/market-indices`)
  - Sensex ✅
  - Nifty 50 ✅
  - Nifty Midcap ✅
  - Gift Nifty ✅
- ✅ Funds API (`/api/funds`)
- ✅ Environment Variables Set

### Backend URLs:

- **Production:** `https://mutualfun-backend.vercel.app`
- **Local:** `http://localhost:3002`

---

## Frontend Testing Steps

### 1. Open Frontend

```
https://mutual-fun-frontend-osed.vercel.app
```

### 2. Hard Refresh Browser

- **Windows:** `Ctrl + Shift + R`
- **Mac:** `Cmd + Shift + R`

### 3. Open Developer Console (F12)

### 4. Check for:

- [ ] No CORS errors in console
- [ ] Market indices visible at top
- [ ] Funds data loading
- [ ] Google OAuth working

---

## If Issues Persist

### Frontend Needs to Check:

1. **API Base URL:**

   ```javascript
   const API_URL = 'https://mutualfun-backend.vercel.app';
   ```

2. **Market Indices Endpoint:**

   ```javascript
   // ✅ Correct
   fetch(`${API_URL}/api/market-indices`);

   // ❌ Wrong
   fetch(`${API_URL}/api/market/indices`);
   ```

3. **Funds Endpoint:**
   ```javascript
   // ✅ Correct
   fetch(`${API_URL}/api/funds`);
   ```

---

## Quick Test Commands

### Test Backend from Terminal:

```bash
# Health check
curl https://mutualfun-backend.vercel.app/health

# Market indices
curl https://mutualfun-backend.vercel.app/api/market-indices

# Funds (first 5)
curl https://mutualfun-backend.vercel.app/api/funds?limit=5
```

### Run Verification Script:

```bash
node verify-cors.js
```

---

## What's Next?

### Option A: Frontend Works ✅

If frontend is working after refresh:

- Test all features
- Test Google OAuth login
- Test portfolio features

### Option B: Frontend Still Has Issues ❌

Share your frontend code/repo and I'll:

1. Fix API endpoint URLs
2. Update configuration
3. Fix any integration issues

---

## Environment Variables Set

### Local (.env):

```env
FRONTEND_URL=http://localhost:5001
ALLOWED_ORIGINS=http://localhost:5001,http://localhost:3000,http://localhost:3001,https://mutual-fun-frontend-osed.vercel.app
```

### Vercel (Production):

```env
FRONTEND_URL=https://mutual-fun-frontend-osed.vercel.app
ALLOWED_ORIGINS=https://mutual-fun-frontend-osed.vercel.app,http://localhost:5001,http://localhost:3000
```

Make sure these are set in Vercel Dashboard → Settings → Environment Variables
