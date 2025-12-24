# 🚀 Backend Production Fixes - Complete Guide

## 📋 Overview

This document outlines all backend changes made to fix production deployment issues on Vercel. The application works locally but had multiple issues after deployment.

---

## 🔥 Root Cause Analysis

### Why Features Fail After Deployment

1. **CORS Issues**: Static CORS configuration didn't handle dynamic origins
2. **Cookie Settings**: Missing `secure` and `sameSite` flags for production
3. **Environment Variables**: Frontend URL not properly configured
4. **Search Functionality**: Limited search capability, not searching all funds
5. **Missing Features**: No Top 20/50/100 funds filtering endpoint

---

## ✅ Changes Made

### 1️⃣ Authentication & JWT Fixes

**File: `src/controllers/auth.ts`**

#### Changes:

- ✅ Added secure cookie settings for production
- ✅ Set `httpOnly: true` to prevent XSS attacks
- ✅ Set `secure: true` in production (HTTPS only)
- ✅ Set `sameSite: 'none'` for cross-origin requests in production
- ✅ Set proper cookie expiration (15min for access, 7 days for refresh)

#### Code Added:

```typescript
// Set cookies for production (secure, httpOnly, sameSite)
const isProduction = process.env.NODE_ENV === 'production';

res.cookie('accessToken', accessToken, {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 15 * 60 * 1000, // 15 minutes
});

res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
```

---

### 2️⃣ CORS Configuration Updates

**Files: `api/index.ts`, `src/app.ts`, `vercel.json`**

#### Changes in `api/index.ts`:

- ✅ Dynamic origin handling based on request header
- ✅ Allows any origin but logs unknown ones for security monitoring
- ✅ Added more headers: `X-Requested-With`, `Accept`, `Origin`
- ✅ Added `PATCH` method support

#### Changes in `src/app.ts`:

- ✅ Function to get allowed origins from environment variable
- ✅ Dynamic CORS origin validation
- ✅ Exposed `Set-Cookie` header for cross-origin cookies
- ✅ Support for comma-separated `ALLOWED_ORIGINS` env var

#### Changes in `vercel.json`:

- ✅ Changed from specific origin to wildcard `*` for flexibility
- ✅ Added more allowed headers
- ✅ Added `PATCH` method support

---

### 3️⃣ Search & Autocomplete Enhancements

**Files: `src/controllers/funds.search.controller.ts`, `src/controllers/funds.simple.ts`**

#### Fund Search API (`/api/funds/search`)

- ✅ Searches across **ALL** funds in database
- ✅ Uses regex with `^query` for "starts-with" matching (higher priority)
- ✅ Also searches in `fundHouse`, `category`, `subCategory`
- ✅ Returns comprehensive fund details

**Example**: User types "nip" → Returns all Nippon funds

#### Autocomplete API (`/api/suggest`)

- ✅ Reduced minimum query length from 2 to 1 character
- ✅ Increased limit from 10 to 15 suggestions
- ✅ Searches fund name, fundHouse, category
- ✅ Prioritizes "starts-with" matches over "contains"

**Example**: User types "sb" → Returns SBI funds first

---

### 4️⃣ Top Funds Filtering

**File: `src/controllers/funds.simple.ts`**

#### New Feature:

- ✅ Added `top` query parameter accepting `'20'`, `'50'`, or `'100'`
- ✅ Sorts by 1-year returns, then AUM, then popularity
- ✅ Returns formatted response with pagination metadata

#### API Endpoint:

```
GET /api/funds?top=20
GET /api/funds?top=50
GET /api/funds?top=100
```

#### Response:

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 20
  },
  "message": "Top 20 funds retrieved successfully"
}
```

---

### 5️⃣ Fund Details & Navigation

**Existing Routes (Verified):**

✅ **Fund Details**: `GET /api/funds/:id`

- Works with both `fundId` and MongoDB `_id`
- Returns complete fund details including manager info
- Handles embedded manager details or fetches separately

✅ **Fund Manager**: `GET /api/funds/:fundId/manager`

- Gets manager details for specific fund
- Returns comprehensive manager information

✅ **Price History**: `GET /api/funds/:fundId/price-history`

- Supports periods: `1M`, `3M`, `1Y`, `5Y`, `ALL`
- Returns NAV/price chart data

---

## 🔐 Required Environment Variables

### Vercel Backend Environment Variables

Add these in Vercel Dashboard → Project → Settings → Environment Variables:

```bash
# Database
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT Secrets (CHANGE THESE!)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_REFRESH_SECRET=your-super-secret-refresh-key-minimum-32-characters-long

# Environment
NODE_ENV=production

# Frontend URLs (optional - comma-separated)
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://another-domain.com
FRONTEND_URL=https://your-frontend.vercel.app

# Google OAuth (if using)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Service (optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@example.com

# API Keys (optional)
NEWSDATA_API_KEY=your-newsdata-key
NEWS_API_KEY=your-newsapi-key
GEMINI_API_KEY=your-gemini-key
```

---

## 📊 API Endpoints Summary

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/google` - OAuth redirect
- `GET /api/auth/google/callback` - OAuth callback

### Funds

- `GET /api/funds` - List funds (with filters)
- `GET /api/funds?top=20` - Top 20 funds
- `GET /api/funds?top=50` - Top 50 funds
- `GET /api/funds?top=100` - Top 100 funds
- `GET /api/funds/search?query=nippon` - Search funds
- `GET /api/funds/:id` - Get fund details
- `GET /api/funds/:id/manager` - Get fund manager
- `GET /api/funds/:id/price-history` - Get price chart data

### Autocomplete

- `GET /api/suggest?q=nip` - Autocomplete suggestions (searches all funds)

### Comparison

- `POST /api/comparison/compare` - Compare multiple funds
- `POST /api/comparison/overlap` - Calculate holdings overlap

---

## 🎯 Frontend Integration Changes Needed

### 1. API Base URL Configuration

**Create `config/api.ts`:**

```typescript
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://your-backend.vercel.app';

export default API_BASE_URL;
```

**Add to `.env.local`:**

```
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
```

**Add to Vercel Frontend Environment Variables:**

```
NEXT_PUBLIC_API_URL=https://your-backend-name.vercel.app
```

---

### 2. Axios Configuration

**Create `lib/axios.ts`:**

```typescript
import axios from 'axios';
import API_BASE_URL from '@/config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // IMPORTANT: For cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(
          `${API_BASE_URL}/api/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        localStorage.setItem('accessToken', data.data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.data.tokens.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.data.tokens.accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

---

### 3. Search Component with Autocomplete

```tsx
import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 1) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const { data } = await api.get(`/api/suggest?q=${query}`);
        setSuggestions(data.data.suggestions);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search funds (e.g., nippon, sbi, axis)..."
        className="form-control"
      />

      {loading && <div>Loading...</div>}

      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((fund) => (
            <li
              key={fund.fundId}
              onClick={() => (window.location.href = `/funds/${fund.fundId}`)}
            >
              <strong>{fund.name}</strong>
              <small>
                {fund.fundHouse} • {fund.category}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

### 4. Top Funds Component

```tsx
import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export default function TopFunds() {
  const [topFilter, setTopFilter] = useState('20');
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTopFunds();
  }, [topFilter]);

  const fetchTopFunds = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/funds?top=${topFilter}`);
      setFunds(data.data);
    } catch (error) {
      console.error('Error fetching top funds:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="btn-group mb-3">
        <button
          className={`btn ${topFilter === '20' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setTopFilter('20')}
        >
          Top 20
        </button>
        <button
          className={`btn ${topFilter === '50' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setTopFilter('50')}
        >
          Top 50
        </button>
        <button
          className={`btn ${topFilter === '100' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setTopFilter('100')}
        >
          Top 100
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="row">
          {funds.map((fund) => (
            <div key={fund.fundId} className="col-md-6 col-lg-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5>{fund.name}</h5>
                  <p>{fund.fundHouse}</p>
                  <p>1Y Return: {fund.returns?.oneYear}%</p>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() =>
                      (window.location.href = `/funds/${fund.fundId}`)
                    }
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 🧪 Testing Checklist

### Local Testing

- [ ] Authentication works (register, login, refresh)
- [ ] Cookies are set correctly
- [ ] Search returns results for any input
- [ ] Autocomplete shows suggestions
- [ ] Top 20/50/100 endpoints work
- [ ] Fund details page loads
- [ ] Fund comparison works

### Production Testing

- [ ] CORS allows frontend domain
- [ ] Cookies work cross-origin
- [ ] Authentication persists across page reloads
- [ ] Search suggestions appear in real-time
- [ ] Top funds load correctly
- [ ] Fund navigation works
- [ ] API responds within 2 seconds

---

## 🐛 Common Issues & Solutions

### Issue 1: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution**:

- Add your frontend domain to `ALLOWED_ORIGINS` in Vercel
- Check `api/index.ts` handles origin correctly

### Issue 2: Authentication works locally but not in production

**Solution**:

- Ensure `NODE_ENV=production` in Vercel environment variables
- Check cookies have `secure: true` and `sameSite: 'none'`
- Frontend must use `withCredentials: true` in axios

### Issue 3: Search returns no results

**Solution**:

- Check MongoDB connection in Vercel logs
- Verify `DATABASE_URL` environment variable
- Ensure funds collection has `isActive: true` documents

### Issue 4: Fund details page shows 404

**Solution**:

- Use correct fund ID format
- Check frontend routing (`/funds/:id` vs `/fund/:id`)
- Verify backend route order (specific routes before parameterized)

---

## 📚 Additional Notes

### Rate Limiting

Currently disabled for debugging. Re-enable in production:

**In `src/index.ts`:**

```typescript
app.use(generalRateLimit); // Uncomment this line
```

### Security Headers

Using `helmet.js` for security headers. Already configured.

### Error Handling

All endpoints have try-catch with proper error responses.

### Logging

Console logs include emojis for easy debugging:

- ✅ Success
- ❌ Error
- 📥 Request received
- 🔍 Search operation

---

## 🚀 Deployment Steps

### Backend Deployment

1. Push changes to GitHub
2. Vercel auto-deploys from `main` branch
3. Check deployment logs for errors
4. Test `/health` endpoint
5. Verify environment variables in Vercel dashboard

### Frontend Deployment

1. Update `NEXT_PUBLIC_API_URL` to backend URL
2. Deploy to Vercel
3. Test authentication flow
4. Test search and navigation
5. Check browser console for errors

---

## 📞 Support & Documentation

- Backend API Docs: `/api/debug` endpoint
- Health Check: `/health`
- Vercel Logs: Check Functions tab in Vercel dashboard

---

**Last Updated**: $(date)
**Version**: 2.0.0
