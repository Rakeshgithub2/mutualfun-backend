# Frontend "Failed to Fetch" Error - Complete Fix

## Error Details

```
TypeError: Failed to fetch
at fetchFunds (lib\hooks\use-funds.ts:77:34)
```

## Root Cause

The frontend is trying to fetch data from the backend API but failing due to:

1. Missing or incorrect API URL configuration
2. CORS issues (backend already fixed - allows port 5001)
3. Incorrect API endpoint construction

---

## STEP 1: Create/Update Environment Variables

**File: `.env.local` (create this file in your frontend root directory)**

```env
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_FRONTEND_URL=http://localhost:5001
```

**Important Notes:**

- ✅ NO trailing slash: `http://localhost:3002`
- ❌ WRONG: `http://localhost:3002/`
- For production, use: `https://mutualfun-backend.vercel.app`

---

## STEP 2: Fix API URL Configuration

**File: `lib/hooks/use-funds.ts` (or wherever you configure API calls)**

### Find this section (around line 60-80):

**BEFORE (WRONG):**

```typescript
// ❌ Common mistakes:
const apiUrl = 'http://localhost:3002/api/funds'; // hardcoded
const apiUrl = `http://localhost:3002/`; // trailing slash
const apiUrl = process.env.API_URL; // wrong env var name
```

**AFTER (CORRECT):**

```typescript
// ✅ Correct way:
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
const apiUrl = `${API_BASE_URL}/api/funds`;

console.log('🔗 Fetching from:', apiUrl);

const httpResponse = await fetch(apiUrl, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

---

## STEP 3: Fix All API Endpoints

Search your entire frontend codebase and fix these patterns:

### Market Indices

```typescript
// ❌ WRONG
fetch(`${API_BASE_URL}/market-indices`);

// ✅ CORRECT
fetch(`${API_BASE_URL}/api/market-indices`);
```

### Funds List & Details

```typescript
// ❌ WRONG
fetch(`${API_BASE_URL}/funds`);
fetch(`${API_BASE_URL}/funds/${fundId}`);

// ✅ CORRECT
fetch(`${API_BASE_URL}/api/funds`);
fetch(`${API_BASE_URL}/api/funds/${fundId}`);
```

### Search/Autocomplete

```typescript
// ❌ WRONG
fetch(`${API_BASE_URL}/search?q=${query}`);
fetch(`${API_BASE_URL}/suggest?q=${query}`);

// ✅ CORRECT
fetch(`${API_BASE_URL}/api/search/autocomplete?q=${encodeURIComponent(query)}`);
fetch(`${API_BASE_URL}/api/suggest?q=${encodeURIComponent(query)}`);
```

### Authentication

```typescript
// ❌ WRONG
fetch(`${API_BASE_URL}/auth/login`);
fetch(`${API_BASE_URL}/auth/google`);

// ✅ CORRECT
fetch(`${API_BASE_URL}/api/auth/login`);
fetch(`${API_BASE_URL}/api/auth/google`);
```

### Portfolio

```typescript
// ❌ WRONG
fetch(`${API_BASE_URL}/portfolio`);

// ✅ CORRECT
fetch(`${API_BASE_URL}/api/portfolio`);
```

### Comparison

```typescript
// ❌ WRONG
fetch(`${API_BASE_URL}/compare/overlap`);

// ✅ CORRECT
fetch(`${API_BASE_URL}/api/compare/overlap`);
```

---

## STEP 4: Create Centralized API Client (RECOMMENDED)

**File: `lib/api-client.ts` (create this file)**

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
    console.log('🌐 API Base URL:', this.baseUrl);
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('📡 API Request:', url);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      console.log('📥 API Response:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }

  // Funds endpoints
  async getFunds(params?: {
    query?: string;
    type?: string;
    category?: string;
    subCategory?: string;
    risk?: string;
    page?: number;
    limit?: number;
  }) {
    const queryString = new URLSearchParams(
      Object.entries(params || {}).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = String(value);
          }
          return acc;
        },
        {} as Record<string, string>
      )
    ).toString();

    return this.request(`/api/funds${queryString ? `?${queryString}` : ''}`);
  }

  async getFundById(fundId: string) {
    return this.request(`/api/funds/${fundId}`);
  }

  async getPriceHistory(fundId: string, period: string = '1Y') {
    return this.request(`/api/funds/${fundId}/price-history?period=${period}`);
  }

  // Search endpoints
  async getSuggestions(query: string) {
    if (query.length < 2) return { suggestions: [] };
    return this.request(`/api/suggest?q=${encodeURIComponent(query)}`);
  }

  async searchFunds(query: string) {
    return this.request(
      `/api/search/autocomplete?q=${encodeURIComponent(query)}`
    );
  }

  // Market data
  async getMarketIndices() {
    return this.request('/api/market-indices');
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(name: string, email: string, password: string) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async googleAuth(token: string) {
    return this.request('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }
}

export const apiClient = new ApiClient();
```

---

## STEP 5: Update use-funds.ts to Use API Client

**File: `lib/hooks/use-funds.ts`**

```typescript
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export function useFunds(filters?: {
  query?: string;
  type?: string;
  category?: string;
  page?: number;
  limit?: number;
}) {
  const [funds, setFunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 Fetching funds with filters:', filters);

        const response = await apiClient.getFunds(filters);

        console.log('✅ Funds fetched successfully:', response);

        if (response.success && response.data) {
          setFunds(response.data.data || []);
          setPagination(response.data.pagination || null);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('❌ Error fetching funds:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch funds');
      } finally {
        setLoading(false);
      }
    };

    fetchFunds();
  }, [JSON.stringify(filters)]);

  return { funds, loading, error, pagination };
}
```

---

## STEP 6: Verify Backend is Running

**Check if backend is accessible:**

Open browser and test these URLs:

1. `http://localhost:3002/health` - Should return health status
2. `http://localhost:3002/api/funds?limit=5` - Should return fund data

**Or use curl/PowerShell:**

```powershell
# Test health endpoint
curl http://localhost:3002/health

# Test funds endpoint
curl http://localhost:3002/api/funds?limit=5
```

---

## STEP 7: Clear Cache & Restart

1. **Stop your Next.js development server** (Ctrl+C)
2. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   # or on Windows:
   rmdir /s /q .next
   ```
3. **Restart development server:**
   ```bash
   npm run dev
   ```
4. **Hard refresh browser:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

## STEP 8: Debug Checklist

If still getting errors, check these in browser DevTools Console:

### ✅ Correct Console Logs:

```
🌐 API Base URL: http://localhost:3002
🔍 Fetching funds with filters: {...}
📡 API Request: http://localhost:3002/api/funds
📥 API Response: 200
✅ Funds fetched successfully: {...}
```

### ❌ Common Error Patterns:

**CORS Error:**

```
Access to fetch at 'http://localhost:3002/api/funds' from origin
'http://localhost:5001' has been blocked by CORS policy
```

**Fix:** Backend already allows port 5001. Restart backend server.

**404 Error:**

```
📥 API Response: 404
```

**Fix:** Add `/api` prefix to endpoint

**Network Error:**

```
Failed to fetch
TypeError: Failed to fetch
```

**Fix:**

- Check backend is running on port 3002
- Check environment variables are set
- Check no trailing slashes in API_BASE_URL

---

## STEP 9: Production Deployment

**For Vercel/Production, update environment variables:**

### Vercel Dashboard:

1. Go to your project → Settings → Environment Variables
2. Add:
   ```
   Name: NEXT_PUBLIC_API_URL
   Value: https://mutualfun-backend.vercel.app
   Environment: Production, Preview, Development
   ```
3. Redeploy

### Update .env.production:

```env
NEXT_PUBLIC_API_URL=https://mutualfun-backend.vercel.app
```

---

## Complete API Endpoints Reference

```javascript
const API_BASE = 'http://localhost:3002'; // or production URL

// Health Check
GET ${API_BASE}/health

// Market Indices
GET ${API_BASE}/api/market-indices

// Funds
GET ${API_BASE}/api/funds
GET ${API_BASE}/api/funds?query=sbi&limit=20&category=equity
GET ${API_BASE}/api/funds/:fundId
GET ${API_BASE}/api/funds/:fundId/price-history?period=1Y

// Search & Suggestions
GET ${API_BASE}/api/suggest?q=hdfc
GET ${API_BASE}/api/search/autocomplete?q=hdfc

// Authentication
POST ${API_BASE}/api/auth/register
POST ${API_BASE}/api/auth/login
POST ${API_BASE}/api/auth/google
GET ${API_BASE}/api/auth/google/callback

// Portfolio (requires auth token)
GET ${API_BASE}/api/portfolio
POST ${API_BASE}/api/portfolio/invest

// Comparison
POST ${API_BASE}/api/compare/overlap
```

---

## Expected Response Formats

### Funds List Response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Funds retrieved successfully",
  "data": {
    "data": [
      {
        "id": "120503",
        "fundId": "120503",
        "name": "HDFC Equity Fund",
        "currentNav": 856.23,
        "category": "equity",
        "subCategory": "large_cap",
        "risk": "moderately_high",
        "fundHouse": "HDFC",
        "returns": {
          "1year": 15.23,
          "3year": 18.45,
          "5year": 16.78
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 200,
      "itemsPerPage": 20
    }
  }
}
```

### Fund Details Response:

```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "id": "120503",
    "name": "HDFC Equity Fund",
    "currentNav": 856.23,
    "category": "equity",
    "topHoldings": [...],
    "sectorAllocation": [...],
    "managerDetails": {...}
  }
}
```

---

## Quick Test Script

**Create: `test-api-connection.js`**

```javascript
const API_BASE = 'http://localhost:3002';

async function testConnection() {
  try {
    console.log('Testing API connection...\n');

    // Test 1: Health check
    console.log('1. Health Check:');
    const health = await fetch(`${API_BASE}/health`);
    console.log(`   Status: ${health.status}`);
    console.log(`   Data:`, await health.json());

    // Test 2: Funds list
    console.log('\n2. Funds List:');
    const funds = await fetch(`${API_BASE}/api/funds?limit=2`);
    console.log(`   Status: ${funds.status}`);
    const fundsData = await funds.json();
    console.log(`   Found: ${fundsData.data?.data?.length} funds`);

    // Test 3: Market indices
    console.log('\n3. Market Indices:');
    const indices = await fetch(`${API_BASE}/api/market-indices`);
    console.log(`   Status: ${indices.status}`);
    console.log(`   Data:`, await indices.json());

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

testConnection();
```

**Run:**

```bash
node test-api-connection.js
```

---

## Summary Checklist

- [ ] Created `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:3002`
- [ ] Removed trailing slashes from API URLs
- [ ] Added `/api` prefix to all endpoints
- [ ] Created centralized API client (`lib/api-client.ts`)
- [ ] Updated `use-funds.ts` to use API client
- [ ] Backend is running on port 3002
- [ ] Frontend is running on port 5001
- [ ] Cleared Next.js cache (`.next` folder)
- [ ] Hard refreshed browser (Ctrl+Shift+R)
- [ ] Tested API endpoints in browser/curl
- [ ] Checked browser console for correct logs

---

## Need More Help?

If the error persists after following all steps:

1. **Share these details:**
   - Complete error message from browser console
   - Network tab screenshot showing the failed request
   - Your current API URL configuration
   - Backend console logs

2. **Common fixes:**
   - Make sure backend is running: `npm run dev` in backend folder
   - Make sure frontend environment variables are loaded (restart dev server)
   - Check browser console for CORS errors
   - Verify URLs don't have double slashes: `//api/funds`

---

**Backend API is ready and waiting for requests!** ✅  
**CORS is configured to accept requests from port 5001** ✅  
**Just update frontend configuration and restart** 🚀
