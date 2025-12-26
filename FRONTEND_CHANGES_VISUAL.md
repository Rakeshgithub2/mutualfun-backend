# 🎯 FRONTEND CHANGES - VISUAL GUIDE

## 📊 THE PROBLEM

```
┌─────────────────────────────────────────────────────────────┐
│                    CURRENT SETUP (BROKEN)                   │
└─────────────────────────────────────────────────────────────┘

Frontend Code:
┌──────────────────────────────────────────────────────────────┐
│ const API_BASE_URL = 'https://mutualfun-backend.vercel.app/api' │
│                                                            ↑  │
│                                            EXTRA /api HERE!│  │
└──────────────────────────────────────────────────────────────┘
                              +
Your API Call:
┌──────────────────────────────────────────────────────────────┐
│ axios.post(`${API_BASE_URL}/api/auth/register`, data)       │
│                            ↑                                 │
│                    /api in the path                          │
└──────────────────────────────────────────────────────────────┘
                              =
Final URL Sent to Backend:
┌──────────────────────────────────────────────────────────────┐
│ https://mutualfun-backend.vercel.app/api/api/auth/register  │
│                                      ↑   ↑                   │
│                                duplicate /api                │
│                                                              │
│ Result: 404 NOT FOUND ❌                                     │
└──────────────────────────────────────────────────────────────┘
```

---

## ✅ THE SOLUTION

```
┌─────────────────────────────────────────────────────────────┐
│                    CORRECT SETUP (FIXED)                    │
└─────────────────────────────────────────────────────────────┘

Frontend Code:
┌──────────────────────────────────────────────────────────────┐
│ const API_BASE_URL = 'https://mutualfun-backend.vercel.app' │
│                                                              │
│                              NO /api suffix ✅               │
└──────────────────────────────────────────────────────────────┘
                              +
Your API Call:
┌──────────────────────────────────────────────────────────────┐
│ axios.post(`${API_BASE_URL}/api/auth/register`, data)       │
│                            ↑                                 │
│                    /api in the path                          │
└──────────────────────────────────────────────────────────────┘
                              =
Final URL Sent to Backend:
┌──────────────────────────────────────────────────────────────┐
│ https://mutualfun-backend.vercel.app/api/auth/register      │
│                                      ↑                       │
│                                correct path                  │
│                                                              │
│ Result: 200 OK ✅                                            │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔍 WHERE TO MAKE CHANGES

```
Your Frontend Project Structure:
📁 my-frontend/
├── 📁 src/
│   ├── 📁 api/
│   │   └── 📄 axios.ts          ← CHANGE HERE! 🎯
│   │   └── 📄 api.ts            ← OR HERE! 🎯
│   ├── 📁 config/
│   │   └── 📄 api.ts            ← OR HERE! 🎯
│   │   └── 📄 constants.ts      ← OR HERE! 🎯
│   ├── 📁 lib/
│   │   └── 📄 axios.ts          ← OR HERE! 🎯
│   ├── 📁 services/
│   │   └── 📄 apiClient.ts      ← OR HERE! 🎯
│   └── 📁 utils/
│       └── 📄 api.ts            ← OR HERE! 🎯
├── 📄 .env                      ← AND HERE! 🎯
└── 📄 .env.production           ← AND HERE! 🎯
```

---

## 📝 CODE CHANGES NEEDED

### CHANGE #1: API Client File

**Find this code:**

```typescript
// ❌ WRONG - Remove /api from here
const API_BASE_URL = 'https://mutualfun-backend.vercel.app/api';
```

**Change to:**

```typescript
// ✅ CORRECT - No /api suffix
const API_BASE_URL = 'https://mutualfun-backend.vercel.app';
```

---

### CHANGE #2: Environment Variables

**File: `.env` or `.env.production`**

**Change from:**

```env
❌ VITE_API_URL=https://mutualfun-backend.vercel.app/api
```

**Change to:**

```env
✅ VITE_API_URL=https://mutualfun-backend.vercel.app
```

---

### CHANGE #3: Vercel Dashboard

1. Go to: https://vercel.com
2. Select your frontend project
3. Click "Settings" → "Environment Variables"
4. Find `VITE_API_URL` or `REACT_APP_API_URL`
5. Change value to: `https://mutualfun-backend.vercel.app` (no `/api`)
6. Click "Save"
7. Click "Redeploy" tab → "Redeploy"

---

### CHANGE #4: Google Console

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your OAuth client ID
3. Under "Authorized JavaScript origins", add:
   ```
   http://localhost:3000
   https://mutual-fun-frontend-osed.vercel.app
   ```
4. Under "Authorized redirect URIs", add:
   ```
   http://localhost:3002/api/auth/google/callback
   https://mutualfun-backend.vercel.app/api/auth/google/callback
   https://mutual-fun-frontend-osed.vercel.app/auth/callback
   ```
5. Save (wait 5-10 minutes)

---

## 🧪 HOW TO VERIFY IT'S FIXED

### Open Browser DevTools (F12)

1. Click "Network" tab
2. Try to register/login
3. Look at the request URL:

```
✅ CORRECT:
https://mutualfun-backend.vercel.app/api/auth/register

❌ WRONG (if still broken):
https://mutualfun-backend.vercel.app/api/api/auth/register
                                 ↑   ↑
                            duplicate /api
```

---

## 📊 COMPLETE FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                         USER ACTION                          │
│              (Clicks "Sign Up" or "Login")                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND API CALL                         │
│                                                              │
│  api.post('/api/auth/register', { email, password, name })  │
│           ↑                                                  │
│    Path starts with /api                                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    AXIOS BASE URL                            │
│                                                              │
│  baseURL: 'https://mutualfun-backend.vercel.app'            │
│                                                              │
│  ✅ NO /api suffix here!                                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    COMBINED URL                              │
│                                                              │
│  https://mutualfun-backend.vercel.app/api/auth/register     │
│                                       ↑                      │
│                                   correct!                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND RECEIVES                          │
│                                                              │
│  Route: POST /api/auth/register                             │
│  Status: 200 OK ✅                                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    RESPONSE TO FRONTEND                      │
│                                                              │
│  { success: true, user: {...}, tokens: {...} }              │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚡ QUICK REFERENCE

| What          | Old (Wrong)                                | New (Correct)                          |
| ------------- | ------------------------------------------ | -------------------------------------- |
| **Base URL**  | `https://mutualfun-backend.vercel.app/api` | `https://mutualfun-backend.vercel.app` |
| **Final URL** | `.../api/api/auth/register` ❌             | `.../api/auth/register` ✅             |
| **Status**    | 404 Not Found                              | 200 OK                                 |

---

## 🎯 CHECKLIST

**In Your Frontend Code:**

- [ ] Remove `/api` from `API_BASE_URL` variable
- [ ] Check it's not in any constants file
- [ ] Update `.env` file
- [ ] Commit and push changes

**In Vercel Dashboard:**

- [ ] Update environment variables
- [ ] Remove `/api` from values
- [ ] Redeploy

**In Google Console:**

- [ ] Add `https://mutual-fun-frontend-osed.vercel.app` to origins
- [ ] Add redirect URIs
- [ ] Save and wait 5-10 minutes

**Test:**

- [ ] Check Network tab - URLs should not have `/api/api`
- [ ] Test register - should work
- [ ] Test login - should work
- [ ] Test Google sign-in - should work
- [ ] No CORS errors in console

---

## 🚀 AFTER FIXING

```
✅ Registration works
✅ Login works
✅ Google OAuth works
✅ No 404 errors
✅ No CORS errors
✅ All API calls successful
```

---

**Bottom Line:**

Your frontend has `/api` in the base URL. Remove it!

```diff
- const API_BASE_URL = 'https://mutualfun-backend.vercel.app/api';
+ const API_BASE_URL = 'https://mutualfun-backend.vercel.app';
```

That's the main fix! 🎉
