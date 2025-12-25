# 🎯 COMPLETE FRONTEND IMPLEMENTATION PROMPT

> **Copy this entire prompt and use it to implement frontend changes**

---

# Context

You are a **senior React/Next.js developer** working on a **mutual fund information website**. The backend API has been updated and is now production-ready on Vercel. Your task is to implement the frontend to work seamlessly with this backend.

---

# Backend API Information

**Backend URL**: `https://your-backend-name.vercel.app`

**Important**: All API calls MUST use `withCredentials: true` for authentication cookies to work!

---

# Required Changes (Complete Implementation)

## 1️⃣ ENVIRONMENT CONFIGURATION

### Create/Update `.env.local` (for local development)

```bash
NEXT_PUBLIC_API_URL=http://localhost:3002
```

### Add to Vercel Frontend Environment Variables

Go to Vercel Dashboard → Your Frontend Project → Settings → Environment Variables

```bash
NEXT_PUBLIC_API_URL=https://your-backend-name.vercel.app
```

⚠️ **Important**: No trailing slash in the URL!

---

## 2️⃣ AXIOS CONFIGURATION (CRITICAL)

### Create `lib/axios.ts` or `lib/api.ts`

```typescript
import axios from 'axios';

// Get API URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ⚠️ CRITICAL: Required for cookies to work cross-origin
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor - Add auth token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token refresh automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          // No refresh token, redirect to login
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Try to refresh the token
        const { data } = await axios.post(
          `${API_BASE_URL}/api/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        // Save new tokens
        const { accessToken, refreshToken: newRefreshToken } = data.data.tokens;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Update the failed request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear storage and redirect to login
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// Also export the base URL for direct use if needed
export { API_BASE_URL };
```

**Usage in components**:

```typescript
import api from '@/lib/axios';

// Use it like normal axios
const response = await api.get('/api/funds');
const data = await api.post('/api/auth/login', { email, password });
```

---

## 3️⃣ AUTHENTICATION IMPLEMENTATION

### Create `lib/auth.ts` (Authentication Service)

```typescript
import api from './axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  age?: number;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

class AuthService {
  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/api/auth/register', data);
    const authData = response.data.data;

    // Store tokens
    this.storeTokens(authData.tokens);

    return authData;
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/api/auth/login', credentials);
    const authData = response.data.data;

    // Store tokens
    this.storeTokens(authData.tokens);

    return authData;
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token;
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Store tokens and user data
   */
  private storeTokens(tokens: {
    accessToken: string;
    refreshToken: string;
  }): void {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  /**
   * Google OAuth Login
   */
  googleLogin(): void {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
  }
}

export const authService = new AuthService();
```

---

### Create Login Page: `app/login/page.tsx` or `pages/login.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, password });

      // Store user data
      localStorage.setItem('user', JSON.stringify(response.user));

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    authService.googleLogin();
  };

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6 col-lg-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Sign In</h2>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <div className="text-center my-3">
                <span className="text-muted">OR</span>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="btn btn-outline-secondary w-100"
                disabled={loading}
              >
                <i className="bi bi-google me-2"></i>
                Sign in with Google
              </button>

              <div className="text-center mt-3">
                <a href="/register">Don't have an account? Sign up</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 4️⃣ SEARCH AUTOCOMPLETE IMPLEMENTATION

### Create `components/SearchBar.tsx`

```typescript
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

interface FundSuggestion {
  id: string;
  fundId: string;
  name: string;
  fundHouse: string;
  category: string;
  subCategory: string;
  currentNav: number;
  returns: {
    oneYear: number;
    threeYear: number;
  };
  aum: number;
}

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<FundSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions with debounce
  useEffect(() => {
    if (query.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/suggest?q=${encodeURIComponent(query)}`);
        setSuggestions(response.data.data.suggestions || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce API calls
    const debounceTimer = setTimeout(fetchSuggestions, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSuggestionClick = (fundId: string) => {
    setShowSuggestions(false);
    setQuery('');
    router.push(`/funds/${fundId}`);
  };

  return (
    <div className="search-bar-container" ref={wrapperRef}>
      <div className="input-group">
        <span className="input-group-text">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search funds (e.g., nippon, sbi, axis...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowSuggestions(true)}
        />
        {loading && (
          <span className="input-group-text">
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </span>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown card position-absolute w-100 mt-1" style={{ zIndex: 1000, maxHeight: '400px', overflowY: 'auto' }}>
          <ul className="list-group list-group-flush">
            {suggestions.map((fund) => (
              <li
                key={fund.fundId}
                className="list-group-item list-group-item-action"
                onClick={() => handleSuggestionClick(fund.fundId)}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="mb-1">{fund.name}</h6>
                    <small className="text-muted">
                      {fund.fundHouse} • {fund.category}
                      {fund.subCategory && ` • ${fund.subCategory}`}
                    </small>
                  </div>
                  <div className="text-end">
                    <div className="badge bg-success">
                      {fund.returns?.oneYear?.toFixed(2)}% (1Y)
                    </div>
                    <div className="text-muted small mt-1">
                      ₹{fund.currentNav?.toFixed(2)}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showSuggestions && query && suggestions.length === 0 && !loading && (
        <div className="card position-absolute w-100 mt-1" style={{ zIndex: 1000 }}>
          <div className="card-body text-center text-muted">
            No funds found for "{query}"
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 5️⃣ TOP FUNDS IMPLEMENTATION

### Create `components/TopFunds.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

interface Fund {
  id: string;
  fundId: string;
  name: string;
  fundHouse: string;
  category: string;
  subCategory: string;
  currentNav: number;
  returns: {
    oneYear?: number;
    threeYear?: number;
    fiveYear?: number;
  };
  aum: number;
  expenseRatio: number;
  riskLevel: string;
}

export default function TopFunds() {
  const router = useRouter();
  const [topFilter, setTopFilter] = useState<'20' | '50' | '100'>('20');
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTopFunds();
  }, [topFilter]);

  const fetchTopFunds = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get(`/api/funds?top=${topFilter}`);
      setFunds(response.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load top funds');
      console.error('Error fetching top funds:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (fundId: string) => {
    router.push(`/funds/${fundId}`);
  };

  return (
    <div className="top-funds-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Top Performing Funds</h2>

        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn ${topFilter === '20' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setTopFilter('20')}
          >
            Top 20
          </button>
          <button
            type="button"
            className={`btn ${topFilter === '50' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setTopFilter('50')}
          >
            Top 50
          </button>
          <button
            type="button"
            className={`btn ${topFilter === '100' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setTopFilter('100')}
          >
            Top 100
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading top {topFilter} funds...</p>
        </div>
      ) : (
        <div className="row g-3">
          {funds.map((fund, index) => (
            <div key={fund.fundId} className="col-12 col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-primary">#{index + 1}</span>
                    <span className={`badge ${
                      fund.riskLevel === 'HIGH' ? 'bg-danger' :
                      fund.riskLevel === 'MEDIUM' ? 'bg-warning' : 'bg-success'
                    }`}>
                      {fund.riskLevel}
                    </span>
                  </div>

                  <h5 className="card-title">{fund.name}</h5>
                  <p className="text-muted small mb-3">
                    {fund.fundHouse}
                  </p>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">NAV</span>
                      <strong>₹{fund.currentNav?.toFixed(2)}</strong>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">1Y Return</span>
                      <strong className="text-success">
                        {fund.returns?.oneYear?.toFixed(2)}%
                      </strong>
                    </div>
                    {fund.returns?.threeYear && (
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted small">3Y Return</span>
                        <strong className="text-success">
                          {fund.returns.threeYear.toFixed(2)}%
                        </strong>
                      </div>
                    )}
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted small">AUM</span>
                      <span>₹{(fund.aum / 1000).toFixed(1)}K Cr</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted small">Expense Ratio</span>
                      <span>{fund.expenseRatio?.toFixed(2)}%</span>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary w-100"
                    onClick={() => handleViewDetails(fund.fundId)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && funds.length === 0 && (
        <div className="alert alert-info text-center">
          No funds available at the moment.
        </div>
      )}
    </div>
  );
}
```

---

## 6️⃣ FUND DETAILS PAGE

### Create `app/funds/[id]/page.tsx` or `pages/funds/[id].tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';

interface Fund {
  id: string;
  fundId: string;
  name: string;
  fundHouse: string;
  category: string;
  subCategory: string;
  fundType: string;
  currentNav: number;
  navDate: string;
  returns: {
    oneMonth?: number;
    threeMonth?: number;
    sixMonth?: number;
    oneYear?: number;
    threeYear?: number;
    fiveYear?: number;
  };
  aum: number;
  expenseRatio: number;
  exitLoad: string;
  minimumInvestment: number;
  riskLevel: string;
  fundManager?: {
    id: string;
    name: string;
    experience: number;
    qualification: string[];
    totalAumManaged: number;
  };
  holdings?: Array<{
    ticker: string;
    name: string;
    percentage: number;
    sector: string;
  }>;
  sectorAllocation?: Array<{
    sector: string;
    percentage: number;
  }>;
}

export default function FundDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const fundId = params?.id as string;

  const [fund, setFund] = useState<Fund | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (fundId) {
      fetchFundDetails();
    }
  }, [fundId]);

  const fetchFundDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get(`/api/funds/${fundId}`);
      setFund(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load fund details');
      console.error('Error fetching fund details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading fund details...</p>
        </div>
      </div>
    );
  }

  if (error || !fund) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error || 'Fund not found'}
        </div>
        <button className="btn btn-primary" onClick={() => router.back()}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Back Button */}
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => router.back()}
      >
        <i className="bi bi-arrow-left me-2"></i>
        Back
      </button>

      {/* Fund Header */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h1 className="h3 mb-2">{fund.name}</h1>
              <p className="text-muted mb-1">{fund.fundHouse}</p>
              <div className="d-flex gap-2">
                <span className="badge bg-primary">{fund.category}</span>
                {fund.subCategory && (
                  <span className="badge bg-secondary">{fund.subCategory}</span>
                )}
                <span className={`badge ${
                  fund.riskLevel === 'HIGH' ? 'bg-danger' :
                  fund.riskLevel === 'MEDIUM' ? 'bg-warning' : 'bg-success'
                }`}>
                  {fund.riskLevel} Risk
                </span>
              </div>
            </div>
            <div className="text-end">
              <h2 className="h4 mb-0">₹{fund.currentNav?.toFixed(2)}</h2>
              <small className="text-muted">NAV as of {fund.navDate}</small>
            </div>
          </div>
        </div>
      </div>

      {/* Returns Card */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Returns</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            {fund.returns?.oneMonth && (
              <div className="col-6 col-md-4">
                <div className="text-center">
                  <h3 className="text-success">{fund.returns.oneMonth.toFixed(2)}%</h3>
                  <p className="text-muted mb-0">1 Month</p>
                </div>
              </div>
            )}
            {fund.returns?.threeMonth && (
              <div className="col-6 col-md-4">
                <div className="text-center">
                  <h3 className="text-success">{fund.returns.threeMonth.toFixed(2)}%</h3>
                  <p className="text-muted mb-0">3 Months</p>
                </div>
              </div>
            )}
            {fund.returns?.oneYear && (
              <div className="col-6 col-md-4">
                <div className="text-center">
                  <h3 className="text-success">{fund.returns.oneYear.toFixed(2)}%</h3>
                  <p className="text-muted mb-0">1 Year</p>
                </div>
              </div>
            )}
            {fund.returns?.threeYear && (
              <div className="col-6 col-md-4">
                <div className="text-center">
                  <h3 className="text-success">{fund.returns.threeYear.toFixed(2)}%</h3>
                  <p className="text-muted mb-0">3 Years</p>
                </div>
              </div>
            )}
            {fund.returns?.fiveYear && (
              <div className="col-6 col-md-4">
                <div className="text-center">
                  <h3 className="text-success">{fund.returns.fiveYear.toFixed(2)}%</h3>
                  <p className="text-muted mb-0">5 Years</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fund Details */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0">Fund Information</h5>
            </div>
            <div className="card-body">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td className="text-muted">AUM</td>
                    <td className="text-end"><strong>₹{(fund.aum / 1000).toFixed(2)}K Cr</strong></td>
                  </tr>
                  <tr>
                    <td className="text-muted">Expense Ratio</td>
                    <td className="text-end"><strong>{fund.expenseRatio?.toFixed(2)}%</strong></td>
                  </tr>
                  <tr>
                    <td className="text-muted">Min Investment</td>
                    <td className="text-end"><strong>₹{fund.minimumInvestment?.toLocaleString()}</strong></td>
                  </tr>
                  <tr>
                    <td className="text-muted">Exit Load</td>
                    <td className="text-end"><strong>{fund.exitLoad}</strong></td>
                  </tr>
                  <tr>
                    <td className="text-muted">Fund Type</td>
                    <td className="text-end"><strong>{fund.fundType}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Fund Manager */}
        {fund.fundManager && (
          <div className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header">
                <h5 className="mb-0">Fund Manager</h5>
              </div>
              <div className="card-body">
                <h6>{fund.fundManager.name}</h6>
                <p className="text-muted mb-2">
                  {fund.fundManager.experience} years of experience
                </p>
                {fund.fundManager.qualification && (
                  <p className="mb-2">
                    <strong>Qualifications:</strong> {fund.fundManager.qualification.join(', ')}
                  </p>
                )}
                <p className="mb-0">
                  <strong>Total AUM Managed:</strong> ₹{(fund.fundManager.totalAumManaged / 1000).toFixed(2)}K Cr
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Holdings */}
      {fund.holdings && fund.holdings.length > 0 && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Top Holdings</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Sector</th>
                    <th className="text-end">Allocation</th>
                  </tr>
                </thead>
                <tbody>
                  {fund.holdings.slice(0, 10).map((holding, index) => (
                    <tr key={index}>
                      <td>{holding.name}</td>
                      <td>{holding.sector}</td>
                      <td className="text-end">{holding.percentage.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sector Allocation */}
      {fund.sectorAllocation && fund.sectorAllocation.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Sector Allocation</h5>
          </div>
          <div className="card-body">
            <div className="row">
              {fund.sectorAllocation.map((sector, index) => (
                <div key={index} className="col-md-6 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span>{sector.sector}</span>
                    <strong>{sector.percentage.toFixed(2)}%</strong>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${sector.percentage}%` }}
                      aria-valuenow={sector.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 7️⃣ RESPONSIVE NAVBAR WITH MARKET INDICES

### Create `components/Navbar.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import SearchBar from './SearchBar';
import api from '@/lib/axios';

interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export default function Navbar() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [indices, setIndices] = useState<MarketIndex[]>([]);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
    fetchMarketIndices();
  }, []);

  const fetchMarketIndices = async () => {
    try {
      const response = await api.get('/api/market-indices');
      setIndices(response.data.data || []);
    } catch (error) {
      console.error('Error fetching market indices:', error);
    }
  };

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <>
      {/* Market Indices Bar - Always visible on mobile */}
      <div className="bg-dark text-white py-2">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center overflow-auto">
            {indices.map((index) => (
              <div key={index.name} className="me-4">
                <span className="me-2">{index.name}</span>
                <strong className="me-2">{index.value.toLocaleString()}</strong>
                <span className={index.change >= 0 ? 'text-success' : 'text-danger'}>
                  {index.change >= 0 ? '▲' : '▼'} {Math.abs(index.changePercent).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div className="container">
          <a className="navbar-brand" href="/">
            <strong>MutualFunds</strong>
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link" href="/">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/funds">All Funds</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/compare">Compare</a>
              </li>
              {isAuthenticated && (
                <li className="nav-item">
                  <a className="nav-link" href="/dashboard">Dashboard</a>
                </li>
              )}
            </ul>

            <div className="d-flex align-items-center gap-3">
              <div className="d-none d-lg-block" style={{ width: '300px' }}>
                <SearchBar />
              </div>

              {isAuthenticated ? (
                <button className="btn btn-outline-primary" onClick={handleLogout}>
                  Logout
                </button>
              ) : (
                <button className="btn btn-primary" onClick={() => router.push('/login')}>
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search - Below navbar */}
      <div className="d-lg-none bg-light border-bottom py-2">
        <div className="container">
          <SearchBar />
        </div>
      </div>
    </>
  );
}
```

---

## 8️⃣ FUND COMPARISON

### Create `components/FundComparison.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import SearchBar from './SearchBar';

interface ComparisonFund {
  fundId: string;
  name: string;
  fundHouse: string;
  returns: any;
  riskMetrics: any;
}

export default function FundComparison() {
  const router = useRouter();
  const [selectedFunds, setSelectedFunds] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompare = async () => {
    if (selectedFunds.length < 2) {
      setError('Please select at least 2 funds to compare');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/comparison/compare', {
        fundIds: selectedFunds,
      });
      setComparisonData(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Comparison failed');
      console.error('Comparison error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateOverlap = async () => {
    if (selectedFunds.length < 2) {
      setError('Please select at least 2 funds');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/comparison/overlap', {
        fundIds: selectedFunds,
      });
      // Handle overlap data
      console.log('Overlap data:', response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Overlap calculation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      {/* Back Button */}
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => router.back()}
      >
        <i className="bi bi-arrow-left me-2"></i>
        Back
      </button>

      <h2 className="mb-4">Compare Funds</h2>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {/* Fund Selection */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Select Funds to Compare (2-5)</h5>
          <p className="text-muted">Search and select funds below</p>

          {/* Add fund selection UI here using SearchBar */}
          <div className="mb-3">
            <p>Selected: {selectedFunds.length} fund(s)</p>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-primary"
              onClick={handleCompare}
              disabled={loading || selectedFunds.length < 2}
            >
              {loading ? 'Comparing...' : 'Compare Funds'}
            </button>

            <button
              className="btn btn-outline-primary"
              onClick={handleCalculateOverlap}
              disabled={loading || selectedFunds.length < 2}
            >
              Calculate Overlap
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Results */}
      {comparisonData && (
        <div className="row">
          {comparisonData.funds?.map((fund: ComparisonFund) => (
            <div key={fund.fundId} className="col-md-6 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5>{fund.name}</h5>
                  <p className="text-muted">{fund.fundHouse}</p>
                  {/* Display comparison data */}
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

## 9️⃣ GOOGLE ANALYTICS (✅ CONFIGURED)

**Measurement ID**: `G-6V6F9P27P8` | **Stream ID**: `13188643413`

> 📚 **Complete Guide**: See `GOOGLE_ANALYTICS_SETUP.md` for full implementation
>
> 📦 **Ready-to-use Files**: All files available in `frontend-code/` directory
>
> ⚡ **Quick Start**: See `GOOGLE_ANALYTICS_QUICK_START.md`

### Environment Variables

Add to your `.env` or `.env.local`:

```env
# For Next.js
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-6V6F9P27P8

# For Vite
VITE_GA_MEASUREMENT_ID=G-6V6F9P27P8

# For Create React App
REACT_APP_GA_MEASUREMENT_ID=G-6V6F9P27P8
```

### Quick Setup for Next.js

1. **Copy implementation files**:

   ```bash
   # Copy from frontend-code/ directory
   cp frontend-code/src/lib/analytics.ts your-project/lib/
   cp frontend-code/src/components/GoogleAnalytics.tsx your-project/components/
   cp frontend-code/src/components/AnalyticsPageTracker.tsx your-project/components/
   ```

2. **Update `app/layout.tsx`**:

```typescript
import GoogleAnalytics from '@/components/GoogleAnalytics';
import AnalyticsPageTracker from '@/components/AnalyticsPageTracker';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GoogleAnalytics />
        <AnalyticsPageTracker />
        {children}
      </body>
    </html>
  );
}
```

### Quick Setup for React (Vite)

1. **Copy files**:

   ```bash
   cp frontend-code/src/lib/analytics.ts your-project/src/lib/
   cp frontend-code/index.html your-project/
   ```

2. **Update `App.tsx`**:

```typescript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageview } from './lib/analytics';

function App() {
  const location = useLocation();

  useEffect(() => {
    pageview(location.pathname + location.search);
  }, [location]);

  return <div>{/* Your app */}</div>;
}
```

### Available Tracking Functions

The `analytics.ts` utility provides these pre-configured functions:

```typescript
import {
  pageview, // Track page views
  event, // Track custom events
  trackSearch, // Track search queries
  trackFundView, // Track fund detail views
  trackFundComparison, // Track fund comparisons
  trackWatchlistAction, // Track watchlist add/remove
  trackAuth, // Track login/signup/logout
  trackFilter, // Track filter applications
  trackSort, // Track sorting
  trackExport, // Track exports
  trackError, // Track errors
} from '@/lib/analytics';
```

### Usage Examples

```typescript
// Track search
trackSearch('HDFC Equity', resultsCount);

// Track fund view
trackFundView(fund.fundId, fund.name);

// Track comparison
trackFundComparison(['FUND123', 'FUND456']);

// Track watchlist
trackWatchlistAction('add', fundId);

// Track authentication
trackAuth('login', 'google');

// Track errors
trackError(error.message, 'ComponentName');
```

### Complete Documentation

- **`GOOGLE_ANALYTICS_SETUP.md`** - Full setup guide
- **`GOOGLE_ANALYTICS_QUICK_START.md`** - Quick reference
- **`frontend-code/ANALYTICS_USAGE_EXAMPLES.md`** - Component examples
- **`frontend-code/README.md`** - Implementation guide

---

## 🔟 ERROR BOUNDARY (Recommended)

### Create `components/ErrorBoundary.tsx`

```typescript
'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="container py-5">
          <div className="alert alert-danger">
            <h4>Something went wrong</h4>
            <p>{this.state.error?.message}</p>
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Setup (30 minutes)

- [ ] Create `.env.local` with `NEXT_PUBLIC_API_URL`
- [ ] Add environment variable to Vercel
- [ ] Create `lib/axios.ts` with interceptors
- [ ] Create `lib/auth.ts` service

### Phase 2: Authentication (1 hour)

- [ ] Create login page
- [ ] Create register page
- [ ] Test login flow
- [ ] Verify tokens are stored
- [ ] Test token refresh

### Phase 3: Search & Navigation (2 hours)

- [ ] Create `SearchBar` component
- [ ] Add to navbar
- [ ] Test autocomplete
- [ ] Verify suggestions work from 1 character
- [ ] Test clicking suggestions

### Phase 4: Fund Pages (2 hours)

- [ ] Create `TopFunds` component
- [ ] Add Top 20/50/100 buttons
- [ ] Create fund details page
- [ ] Test "View Details" navigation
- [ ] Add back button to every page

### Phase 5: Comparison (1 hour)

- [ ] Create comparison page
- [ ] Add fund selection
- [ ] Test compare API
- [ ] Test overlap calculation

### Phase 6: UI/UX (2 hours)

- [ ] Add responsive navbar
- [ ] Show market indices (Nifty, Sensex)
- [ ] Test mobile layout
- [ ] Ensure all text is readable
- [ ] Add loading states
- [ ] Add error handling

### Phase 7: Testing (1 hour)

- [ ] Test on mobile
- [ ] Test on tablet
- [ ] Test on desktop
- [ ] Test all API calls
- [ ] Check browser console for errors
- [ ] Verify cookies work

---

## 🎯 CRITICAL POINTS

### ⚠️ Must-Haves:

1. **`withCredentials: true`** in axios config
2. **Token refresh** interceptor
3. **Environment variables** set correctly
4. **Error handling** for all API calls
5. **Loading states** for better UX
6. **Responsive design** (mobile-first)
7. **Back button** on all pages

### ⚡ Performance:

- Debounce search (300ms)
- Cache fund details
- Lazy load images
- Use React.memo where needed

### 🎨 UI/UX:

- Bootstrap 5 for responsive grid
- Mobile-friendly touch targets
- Clear error messages
- Loading spinners
- Success feedback

---

## 🧪 TESTING ENDPOINTS

After implementation, test these in browser:

```bash
# Login
POST https://your-backend.vercel.app/api/auth/login

# Search
GET https://your-backend.vercel.app/api/suggest?q=nip

# Top Funds
GET https://your-backend.vercel.app/api/funds?top=20

# Fund Details
GET https://your-backend.vercel.app/api/funds/FUND001
```

---

## 📞 TROUBLESHOOTING

### Issue: CORS Error

**Fix**: Check `withCredentials: true` in axios config

### Issue: 401 Unauthorized

**Fix**: Check token is in localStorage and Authorization header

### Issue: Search not working

**Fix**: Verify API_URL is correct, check network tab

### Issue: Cookies not set

**Fix**: Backend must have `sameSite: 'none'` and `secure: true`

---

## ✅ SUCCESS CRITERIA

Implementation is successful when:

- ✅ Users can sign in and stay logged in
- ✅ Search shows suggestions in real-time
- ✅ Top 20/50/100 buttons work
- ✅ Fund details page loads correctly
- ✅ Comparison feature works
- ✅ Mobile layout is responsive
- ✅ No console errors
- ✅ All features work on mobile, tablet, desktop

---

**This is your complete implementation guide. Follow it step by step!**
