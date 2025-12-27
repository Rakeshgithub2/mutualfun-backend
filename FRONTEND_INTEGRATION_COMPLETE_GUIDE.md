# 🎯 Complete Frontend Integration Guide - Mutual Funds Backend API

## Backend Status Summary

- ✅ **4,459 mutual funds** with complete data (fundManager, holdings, returns, ratings, NAV, AUM, etc.)
- ✅ Google OAuth authentication (GET + POST methods)
- ✅ Market indices API with live data
- ✅ Fund comparison and overlap analysis
- ✅ CORS configured for localhost:3000, 5001, 5173
- ✅ Running on port **3002** (Dev) | **Vercel** (Prod)

---

## 🔧 Environment Setup

### Frontend `.env` or `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3002
# Production: NEXT_PUBLIC_API_URL=https://mutualfun-backend.vercel.app

NEXT_PUBLIC_GOOGLE_CLIENT_ID=336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com
NEXT_PUBLIC_APP_URL=http://localhost:5001
```

---

## 📡 Complete API Reference

### Base URL

```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
```

### 1. API Client Helper (`lib/api.js`)

```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Important for auth
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'API Error');
  }

  return data;
}
```

---

## 🔐 Authentication APIs

### Register

```javascript
POST /api/auth/register
Body: { email: string, password: string, name: string }

const response = await apiCall('/api/auth/register', {
  method: 'POST',
  body: JSON.stringify({ email, password, name })
});

// Response: { success: true, data: { user, accessToken, refreshToken } }
```

### Login

```javascript
POST /api/auth/login
Body: { email: string, password: string }

const response = await apiCall('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});

// Response: { success: true, data: { user, accessToken, refreshToken } }
```

### Google OAuth (Method 1: Redirect)

```javascript
GET /api/auth/google (initiates OAuth flow)

// Redirect user to backend
function loginWithGoogle() {
  window.location.href = `${API_BASE_URL}/api/auth/google`;
  // Backend redirects to Google → back to /api/auth/google/callback → frontend
}
```

### Google OAuth (Method 2: Token Exchange)

```javascript
POST / api / auth / google;
Body: {
  token: string;
} // Google credential token

// Using @react-oauth/google
import { GoogleLogin } from '@react-oauth/google';

<GoogleLogin
  onSuccess={async (credentialResponse) => {
    const response = await apiCall('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token: credentialResponse.credential }),
    });
    // Response: { success: true, data: { user, accessToken, refreshToken } }
  }}
/>;
```

---

## 📊 Funds APIs

### Get All Funds (Paginated & Filterable)

```javascript
GET /api/funds?page=1&limit=50&category=equity&subCategory=Mid Cap&fundHouse=HDFC&search=growth

const params = new URLSearchParams({
  page: 1,
  limit: 50,
  category: 'equity',      // Optional: equity, debt, hybrid, commodity
  subCategory: 'Mid Cap',  // Optional
  fundHouse: 'HDFC',       // Optional
  search: 'growth'         // Optional: searches fund names
});

const response = await apiCall(`/api/funds?${params}`);

/* Response Structure:
{
  success: true,
  data: [
    {
      _id: "67...",
      fundId: "FUND001",
      name: "HDFC Mid-Cap Opportunities Fund - Direct Plan - Growth",
      fundHouse: "HDFC",
      fundManager: "Chirag Setalvad",
      category: "equity",
      subCategory: "Mid Cap",
      currentNav: 189.45,
      previousNav: 187.32,
      navDate: "2025-12-26T00:00:00.000Z",
      returns: {
        oneYear: 42.5,
        threeYear: 28.3,
        fiveYear: 22.1
      },
      aum: 45000,
      expenseRatio: 0.68,
      riskLevel: "HIGH",
      riskMetrics: { volatility: 15.2, sharpeRatio: 1.8 },
      ratings: { morningstar: 4, valueResearch: 5 },
      holdings: [
        { name: "Reliance Industries", percentage: 8.5, sector: "Energy" }
      ],
      sectorAllocation: [
        { sector: "Banking", percentage: 25.5 }
      ],
      minInvestment: 5000,
      sipMinAmount: 500,
      exitLoad: 1.0,
      tags: ["equity", "mid-cap"],
      popularity: 95,
      isActive: true
    }
    // ... 49 more funds (if limit=50)
  ],
  pagination: {
    page: 1,
    limit: 50,
    total: 4459,
    totalPages: 90,
    hasNext: true,
    hasPrev: false
  }
}
*/

// ⚠️ IMPORTANT: Access funds via response.data (NOT response.data.data)
const funds = response.data;
```

### Get Fund by ID

```javascript
GET /api/funds/:fundId

const response = await apiCall(`/api/funds/FUND001`);
// Can use fundId, amfiCode, or name

/* Response:
{
  success: true,
  data: {
    fundId: "FUND001",
    name: "...",
    fundManager: "...",
    // ... all fund details
  }
}
*/

const fund = response.data;
```

---

## 📈 Market Indices APIs

### Get All Indices

```javascript
GET / api / market / indices;

const response = await apiCall('/api/market/indices');

/* Response:
{
  success: true,
  data: [
    {
      symbol: "NIFTY50",
      name: "Nifty 50",
      value: 21500.50,
      change: 125.30,
      changePercent: 0.59,
      lastUpdated: "2025-12-27T10:30:00.000Z"
    }
  ],
  timestamp: "2025-12-27T10:30:15.000Z"
}
*/
```

### Get Market Summary (Top 5)

```javascript
GET / api / market / summary;

const response = await apiCall('/api/market/summary');
// Returns top 5 broad market indices
```

### Get Market Status

```javascript
GET / api / market / status;

const response = await apiCall('/api/market/status');

/* Response:
{
  success: true,
  data: {
    isOpen: true,
    message: "Market is currently open",
    nextOpen: null, // or ISO timestamp when closed
    timestamp: "2025-12-27T10:30:00.000Z"
  }
}
*/
```

### Get Specific Index

```javascript
GET /api/market/indices/:symbol

const response = await apiCall('/api/market/indices/NIFTY50');
```

---

## 🔄 Comparison & Analysis APIs

### Compare Multiple Funds

```javascript
POST /api/compare
Body: { fundIds: string[] }

const response = await apiCall('/api/compare', {
  method: 'POST',
  body: JSON.stringify({
    fundIds: ['FUND001', 'FUND002', 'FUND003']
  })
});
```

### Check Portfolio Overlap

```javascript
POST /api/overlap
Body: { fundIds: string[] }

const response = await apiCall('/api/overlap', {
  method: 'POST',
  body: JSON.stringify({
    fundIds: ['FUND001', 'FUND002']
  })
});
```

---

## 🎨 React Component Examples

### 1. Funds List with Pagination

```javascript
import { useState, useEffect } from 'react';
import apiCall from '../lib/api';

export default function FundsList() {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 50,
    category: '',
    search: '',
  });

  useEffect(() => {
    fetchFunds();
  }, [filters]);

  const fetchFunds = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      const response = await apiCall(`/api/funds?${params}`);

      setFunds(response.data); // Direct access to data array
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Mutual Funds ({pagination.total})</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search funds..."
        value={filters.search}
        onChange={(e) =>
          setFilters({ ...filters, search: e.target.value, page: 1 })
        }
      />

      {/* Category Filter */}
      <select
        value={filters.category}
        onChange={(e) =>
          setFilters({ ...filters, category: e.target.value, page: 1 })
        }
      >
        <option value="">All Categories</option>
        <option value="equity">Equity</option>
        <option value="debt">Debt</option>
        <option value="hybrid">Hybrid</option>
        <option value="commodity">Commodity</option>
      </select>

      {/* Funds Grid */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="funds-grid">
          {funds.map((fund) => (
            <div key={fund.fundId} className="fund-card">
              <h3>{fund.name}</h3>
              <p>
                <strong>Manager:</strong> {fund.fundManager}
              </p>
              <p>
                <strong>NAV:</strong> ₹{fund.currentNav}
              </p>
              <p>
                <strong>1Y Return:</strong> {fund.returns?.oneYear}%
              </p>
              <p>
                <strong>AUM:</strong> ₹{fund.aum} Cr
              </p>
              <p>
                <strong>Risk:</strong> {fund.riskLevel}
              </p>
              <button onClick={() => router.push(`/funds/${fund.fundId}`)}>
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={!pagination.hasPrev}
          onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
        >
          Previous
        </button>
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          disabled={!pagination.hasNext}
          onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

### 2. Fund Detail Page

```javascript
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import apiCall from '../lib/api';

export default function FundDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [fund, setFund] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchFund();
  }, [id]);

  const fetchFund = async () => {
    try {
      const response = await apiCall(`/api/funds/${id}`);
      setFund(response.data); // Single fund object
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!fund) return <div>Fund not found</div>;

  return (
    <div>
      <h1>{fund.name}</h1>

      <section className="overview">
        <h2>Overview</h2>
        <div className="grid">
          <div>
            <label>Fund House</label>
            <p>{fund.fundHouse}</p>
          </div>
          <div>
            <label>Fund Manager</label>
            <p>{fund.fundManager}</p>
          </div>
          <div>
            <label>Category</label>
            <p>
              {fund.category} - {fund.subCategory}
            </p>
          </div>
          <div>
            <label>Current NAV</label>
            <p>₹{fund.currentNav}</p>
          </div>
          <div>
            <label>AUM</label>
            <p>₹{fund.aum} Crores</p>
          </div>
          <div>
            <label>Expense Ratio</label>
            <p>{fund.expenseRatio}%</p>
          </div>
          <div>
            <label>Risk Level</label>
            <p>{fund.riskLevel}</p>
          </div>
          <div>
            <label>Min Investment</label>
            <p>₹{fund.minInvestment}</p>
          </div>
          <div>
            <label>Min SIP</label>
            <p>₹{fund.sipMinAmount}</p>
          </div>
        </div>
      </section>

      <section className="returns">
        <h2>Returns</h2>
        <div className="returns-grid">
          <div>
            <span>1 Year</span>
            <strong>{fund.returns?.oneYear}%</strong>
          </div>
          <div>
            <span>3 Year</span>
            <strong>{fund.returns?.threeYear}%</strong>
          </div>
          <div>
            <span>5 Year</span>
            <strong>{fund.returns?.fiveYear}%</strong>
          </div>
        </div>
      </section>

      {fund.holdings?.length > 0 && (
        <section className="holdings">
          <h2>Top Holdings</h2>
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Sector</th>
                <th>Allocation</th>
              </tr>
            </thead>
            <tbody>
              {fund.holdings.map((holding, i) => (
                <tr key={i}>
                  <td>{holding.name}</td>
                  <td>{holding.sector}</td>
                  <td>{holding.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {fund.sectorAllocation?.length > 0 && (
        <section className="sectors">
          <h2>Sector Allocation</h2>
          {fund.sectorAllocation.map((sector, i) => (
            <div key={i} className="sector-bar">
              <span>{sector.sector}</span>
              <div className="bar">
                <div
                  className="fill"
                  style={{ width: `${sector.percentage}%` }}
                />
              </div>
              <span>{sector.percentage}%</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
```

### 3. Market Indices Component

```javascript
import { useState, useEffect } from 'react';
import apiCall from '../lib/api';

export default function MarketIndices() {
  const [indices, setIndices] = useState([]);
  const [marketStatus, setMarketStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 120000); // Refresh every 2 min
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [indicesRes, statusRes] = await Promise.all([
        apiCall('/api/market/summary'),
        apiCall('/api/market/status'),
      ]);

      setIndices(indicesRes.data);
      setMarketStatus(statusRes.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="market-widget">
      <div className="status">
        <span className={marketStatus?.isOpen ? 'open' : 'closed'}>
          {marketStatus?.message}
        </span>
      </div>

      <div className="indices">
        {indices.map((index) => (
          <div key={index.symbol} className="index">
            <span className="name">{index.name}</span>
            <span className="value">{index.value?.toFixed(2)}</span>
            <span className={index.change >= 0 ? 'gain' : 'loss'}>
              {index.change >= 0 ? '▲' : '▼'}
              {Math.abs(index.change).toFixed(2)}({index.changePercent}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 4. Auth Context Provider

```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import apiCall from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing session
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const { user, accessToken, refreshToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const register = async (email, password, name) => {
    const response = await apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });

    const { user, accessToken, refreshToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const googleLogin = async (googleToken) => {
    const response = await apiCall('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token: googleToken }),
    });

    const { user, accessToken, refreshToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, googleLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### 5. Google Login Button

```javascript
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

export default function GoogleLoginButton() {
  const { googleLogin } = useAuth();

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            await googleLogin(credentialResponse.credential);
            console.log('Login successful');
          } catch (error) {
            console.error('Login failed:', error);
          }
        }}
        onError={() => console.error('Google login failed')}
        useOneTap
      />
    </GoogleOAuthProvider>
  );
}
```

---

## ⚠️ Common Issues & Solutions

### 1. "Invalid response format" / "No fund data"

**Problem**: Accessing `response.data.data` instead of `response.data`  
**Solution**:

```javascript
// ❌ Wrong
const funds = response.data.data;

// ✅ Correct
const funds = response.data;
```

### 2. CORS Errors

**Problem**: Frontend running on non-whitelisted port  
**Solution**: Backend allows ports 3000, 5001, 5173. Use one of these or update backend CORS config.

### 3. "Route not found" for /auth/google

**Problem**: Using wrong HTTP method  
**Solution**:

- GET `/api/auth/google` - Initiates OAuth (redirects to Google)
- POST `/api/auth/google` - Exchanges token

### 4. Market indices not updating

**Problem**: Wrong endpoint  
**Solution**: Use `/api/market/summary` or `/api/market/indices`

### 5. Fund manager missing

**Problem**: Viewing cached/old data  
**Solution**: All 4,459 funds now have `fundManager` field. Clear cache.

---

## 📋 Integration Checklist

**Setup**

- [ ] Install `@react-oauth/google` package
- [ ] Create `.env` with API_URL and Google Client ID
- [ ] Create `lib/api.js` helper
- [ ] Create `context/AuthContext.js`

**Components**

- [ ] Funds list page with pagination
- [ ] Fund detail page showing all fields
- [ ] Market indices component
- [ ] Google login button
- [ ] Search and filter components

**Testing**

- [ ] Register/login works
- [ ] Google OAuth works
- [ ] Funds list loads 4,459 funds
- [ ] Fund detail shows fundManager
- [ ] Market indices update
- [ ] Pagination works
- [ ] Search/filter works
- [ ] No CORS errors
- [ ] No "route not found" errors

---

## 🧪 Testing Commands

```bash
# Health check
curl http://localhost:3002/api/health

# Get first 5 funds
curl "http://localhost:3002/api/funds?limit=5"

# Get specific fund
curl http://localhost:3002/api/funds/FUND001

# Market summary
curl http://localhost:3002/api/market/summary

# Market status
curl http://localhost:3002/api/market/status
```

---

## 📊 Response Structure Reference

### Funds List Response

```typescript
{
  success: boolean;
  data: Fund[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

### Fund Detail Response

```typescript
{
  success: boolean;
  data: Fund;
}
```

### Market Indices Response

```typescript
{
  success: boolean;
  data: MarketIndex[];
  timestamp: string;
}
```

### Auth Response

```typescript
{
  success: boolean;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  }
}
```

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install @react-oauth/google

# Update .env
echo "NEXT_PUBLIC_API_URL=http://localhost:3002" >> .env.local
echo "NEXT_PUBLIC_GOOGLE_CLIENT_ID=336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com" >> .env.local

# Start development
npm run dev
```

---

## ✅ Success Criteria

After integration:

1. ✅ 4,459 funds displayed with pagination
2. ✅ Each fund shows fundManager field
3. ✅ Fund details page shows holdings, sectors, returns
4. ✅ Market indices visible and updating
5. ✅ Google OAuth login functional
6. ✅ Search and filters working
7. ✅ No CORS or route errors
8. ✅ All API calls return correct data structure

---

**Backend is live with 4,459 funds ready for integration!**  
**Base URL**: `http://localhost:3002` (Dev) | `https://mutualfun-backend.vercel.app` (Prod)
