# 🚀 API Quick Reference for Frontend Developers

## Base URL

- **Local**: `http://localhost:3002`
- **Production**: `https://your-backend.vercel.app`

> **Important**: Always use `withCredentials: true` in axios for authentication to work!

---

## 🔐 Authentication APIs

### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "minimum8characters",
  "name": "John Doe",
  "age": 25,
  "riskLevel": "MEDIUM"
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER"
    },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc..."
    }
  },
  "message": "User registered successfully"
}
```

---

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "minimum8characters"
}
```

**Response**: Same as Register

**Cookies Set**:

- `accessToken` (15 min expiry)
- `refreshToken` (7 days expiry)

---

### Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

---

### Google OAuth

```http
GET /api/auth/google
```

Redirects to Google login

```http
GET /api/auth/google/callback?code=...
```

Handles callback from Google

---

## 🔍 Search & Autocomplete

### Autocomplete Suggestions (Real-time)

```http
GET /api/suggest?q=nip
```

**What it does**:

- Searches ALL funds in database
- Typing "nip" → Returns Nippon funds
- Typing "sb" → Returns SBI funds
- Minimum 1 character

**Response**:

```json
{
  "success": true,
  "data": {
    "query": "nip",
    "count": 5,
    "suggestions": [
      {
        "id": "fund_id",
        "fundId": "FUND001",
        "name": "Nippon India Growth Fund",
        "category": "equity",
        "subCategory": "Large Cap",
        "fundHouse": "Nippon India Mutual Fund",
        "currentNav": 125.5,
        "returns": {
          "oneYear": 15.5,
          "threeYear": 18.2
        },
        "aum": 5000
      }
    ]
  }
}
```

---

### Advanced Search

```http
GET /api/funds/search?query=nippon&limit=10
```

**Query Parameters**:

- `query` (required): Search term
- `limit` (optional): Results limit (default: 10, max: 50)

**Response**: Similar to suggestions but more detailed

---

## 📊 Fund Listing & Filters

### Get All Funds (Paginated)

```http
GET /api/funds?page=1&limit=20
```

**Query Parameters**:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `category`: Filter by category (`equity`, `debt`, `hybrid`, `commodity`)
- `subCategory`: Filter by subcategory
- `sort`: Sort field

---

### Top Funds ⭐ NEW

```http
GET /api/funds?top=20
GET /api/funds?top=50
GET /api/funds?top=100
```

**What it does**:

- Returns top performing funds
- Sorted by 1-year returns, then AUM

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": "fund_id",
      "fundId": "FUND001",
      "name": "Top Performing Fund",
      "category": "equity",
      "fundHouse": "ABC Mutual Fund",
      "currentNav": 150.25,
      "returns": {
        "oneYear": 25.5,
        "threeYear": 22.3,
        "fiveYear": 20.1
      },
      "aum": 10000,
      "expenseRatio": 1.2,
      "riskLevel": "HIGH"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 20
  }
}
```

---

### Filter by Category

```http
GET /api/funds?category=equity&limit=50
GET /api/funds?category=commodity&limit=20
```

---

### Filter by SubCategory

```http
GET /api/funds?subCategory=Large Cap&limit=30
```

---

## 📄 Fund Details

### Get Fund by ID

```http
GET /api/funds/:fundId
```

**Example**: `/api/funds/FUND001` or `/api/funds/507f1f77bcf86cd799439011`

**Response**:

```json
{
  "success": true,
  "data": {
    "id": "fund_id",
    "fundId": "FUND001",
    "name": "Sample Growth Fund",
    "fundHouse": "ABC Mutual Fund",
    "category": "equity",
    "subCategory": "Large Cap",
    "fundType": "OPEN_ENDED",
    "currentNav": 125.5,
    "navDate": "2025-12-19",
    "returns": {
      "oneMonth": 2.5,
      "threeMonth": 5.2,
      "sixMonth": 8.5,
      "oneYear": 15.5,
      "threeYear": 18.2,
      "fiveYear": 16.8
    },
    "aum": 5000,
    "expenseRatio": 1.2,
    "exitLoad": "1% if redeemed before 1 year",
    "minimumInvestment": 5000,
    "riskLevel": "MEDIUM",
    "fundManager": {
      "id": "manager_id",
      "name": "John Manager",
      "experience": 15,
      "qualification": ["MBA", "CFA"],
      "totalAumManaged": 50000
    },
    "holdings": [
      {
        "ticker": "RELIANCE",
        "name": "Reliance Industries",
        "percentage": 8.5,
        "sector": "Energy"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "Technology",
        "percentage": 25
      }
    ]
  }
}
```

---

### Get Fund Manager Details

```http
GET /api/funds/:fundId/manager
```

**Response**:

```json
{
  "success": true,
  "data": {
    "managerId": "MGR001",
    "name": "John Manager",
    "bio": "Experienced fund manager...",
    "experience": 15,
    "qualification": ["MBA Finance", "CFA Level III"],
    "designation": "Senior Fund Manager",
    "currentFundHouse": "ABC Mutual Fund",
    "fundsManaged": 10,
    "totalAumManaged": 50000,
    "averageReturns": {
      "oneYear": 16.5,
      "threeYear": 19.2,
      "fiveYear": 17.8
    }
  }
}
```

---

### Get Price History

```http
GET /api/funds/:fundId/price-history?period=1Y
```

**Query Parameters**:

- `period`: `1M`, `3M`, `1Y` (default), `5Y`, `ALL`
- `from`: Custom start date (YYYY-MM-DD)
- `to`: Custom end date (YYYY-MM-DD)

**Response**:

```json
{
  "success": true,
  "data": {
    "fundId": "FUND001",
    "period": "1Y",
    "dataPoints": 365,
    "data": [
      {
        "date": "2024-12-19",
        "nav": 125.5,
        "open": 124.0,
        "high": 126.0,
        "low": 123.5,
        "close": 125.5
      }
    ]
  }
}
```

---

## 🔄 Fund Comparison

### Compare Multiple Funds

```http
POST /api/comparison/compare
Content-Type: application/json

{
  "fundIds": ["FUND001", "FUND002", "FUND003"]
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "funds": [
      {
        "fundId": "FUND001",
        "name": "Fund A",
        "returns": {...},
        "riskMetrics": {...}
      }
    ],
    "summary": {
      "bestReturns": "FUND001",
      "lowestRisk": "FUND002"
    }
  }
}
```

---

### Calculate Holdings Overlap

```http
POST /api/comparison/overlap
Content-Type: application/json

{
  "fundIds": ["FUND001", "FUND002"]
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "overlapPercentage": 45.5,
    "commonHoldings": [
      {
        "ticker": "RELIANCE",
        "name": "Reliance Industries",
        "heldBy": [
          {
            "fundId": "FUND001",
            "percentage": 8.5
          },
          {
            "fundId": "FUND002",
            "percentage": 7.2
          }
        ]
      }
    ]
  }
}
```

---

## 📈 Market Indices

```http
GET /api/market-indices
```

Returns: Nifty 50, Sensex, Nifty Midcap, etc.

---

## 💬 Feedback System

```http
POST /api/feedback
Content-Type: application/json

{
  "name": "User Name",
  "email": "user@example.com",
  "subject": "Feedback Subject",
  "message": "Your feedback message",
  "rating": 5
}
```

---

## 🎯 Frontend Implementation Examples

### React Hook for Search

```tsx
import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export function useSearch(query: string) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 1) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
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

  return { suggestions, loading };
}
```

---

### Usage in Component

```tsx
export default function SearchBar() {
  const [query, setQuery] = useState('');
  const { suggestions, loading } = useSearch(query);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search funds (nip, sb, axis...)"
      />

      {loading && <div>Loading...</div>}

      <ul>
        {suggestions.map((fund) => (
          <li
            key={fund.fundId}
            onClick={() => navigate(`/funds/${fund.fundId}`)}
          >
            {fund.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

### Axios Configuration (MUST HAVE)

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // ⚠️ CRITICAL for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## 🔔 Error Responses

All errors follow this format:

```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "details": [] // Optional validation errors
}
```

**Common Status Codes**:

- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found
- `409` - Conflict (e.g., email already exists)
- `500` - Server Error

---

## ✅ Best Practices

1. **Always use `withCredentials: true`** in axios
2. **Debounce search** queries (300ms recommended)
3. **Cache fund details** to reduce API calls
4. **Handle loading states** for better UX
5. **Store tokens** in localStorage and cookies
6. **Refresh tokens** automatically on 401 errors
7. **Show error messages** to users
8. **Use TypeScript** for type safety

---

## 🧪 Testing Endpoints

Use this Postman collection or test directly in browser:

```javascript
// Test in browser console
fetch('https://your-backend.vercel.app/api/suggest?q=nip')
  .then((r) => r.json())
  .then(console.log);
```

---

## 📞 Support

- Health Check: `/health`
- Debug Info: `/api/debug`
- API Status: Check Vercel logs

---

**Last Updated**: December 19, 2025
