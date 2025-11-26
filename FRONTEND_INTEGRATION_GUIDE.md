# Frontend Integration Guide

How to replace mock data with real APIs in your Next.js frontend.

---

## 🎯 Overview

Replace all mock data calls with these 4 real API endpoints:

1. `GET /api/funds` - Fund lists, search, filters
2. `GET /api/funds/:id` - Fund details page
3. `GET /api/funds/:id/price-history` - Charts
4. `GET /api/suggest` - Autocomplete

---

## ⚙️ Setup

### 1. Create API Client

Create `lib/api-client.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  // GET /api/funds - Search and filter
  async getFunds(params: {
    query?: string;
    type?: string;
    category?: string;
    page?: number;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams(
      Object.entries(params)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, String(v)])
    );

    return this.request(`/api/funds?${searchParams}`);
  }

  // GET /api/funds/:id - Fund details
  async getFundById(fundId: string) {
    return this.request(`/api/funds/${fundId}`);
  }

  // GET /api/funds/:id/price-history - Chart data
  async getPriceHistory(
    fundId: string,
    period: '1M' | '3M' | '1Y' | '5Y' | 'ALL' = '1Y'
  ) {
    return this.request(`/api/funds/${fundId}/price-history?period=${period}`);
  }

  // GET /api/suggest - Autocomplete
  async getSuggestions(query: string) {
    if (query.length < 2) return { suggestions: [] };
    return this.request(`/api/suggest?q=${encodeURIComponent(query)}`);
  }
}

export const apiClient = new ApiClient();
```

### 2. Add Environment Variable

Add to `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3002
```

For production:

```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

---

## 🔄 Replace Mock Data Calls

### 1. Fund List Pages

**Before (Mock Data):**

```typescript
// ❌ Old way - using mock data
import { mockFunds } from '@/data/mock-funds';

export default function FundsPage() {
  const [funds, setFunds] = useState(mockFunds);

  // ...
}
```

**After (Real API):**

```typescript
// ✅ New way - using real API
import { apiClient } from '@/lib/api-client';

export default function FundsPage() {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const data = await apiClient.getFunds({
          page: 1,
          limit: 20,
        });
        setFunds(data);
        setPagination(data.pagination);
      } catch (error) {
        console.error('Failed to fetch funds:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFunds();
  }, []);

  // ...
}
```

### 2. Search Functionality

**Before:**

```typescript
// ❌ Old way - filtering mock data
const filtered = mockFunds.filter((fund) =>
  fund.name.toLowerCase().includes(query.toLowerCase())
);
```

**After:**

```typescript
// ✅ New way - API search
const handleSearch = async (query: string) => {
  setLoading(true);
  try {
    const data = await apiClient.getFunds({
      query,
      page: 1,
      limit: 20,
    });
    setFunds(data);
  } catch (error) {
    console.error('Search failed:', error);
  } finally {
    setLoading(false);
  }
};
```

### 3. Fund Detail Pages

**File:** `app/funds/[id]/page.tsx`

**Before:**

```typescript
// ❌ Old way
const fund = mockFunds.find((f) => f.id === params.id);
```

**After:**

```typescript
// ✅ New way
'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

export default function FundDetailPage({ params }: { params: { id: string } }) {
  const [fund, setFund] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFundDetails = async () => {
      try {
        const data = await apiClient.getFundById(params.id);
        setFund(data);
      } catch (error) {
        console.error('Failed to fetch fund:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFundDetails();
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (!fund) return <div>Fund not found</div>;

  return (
    <div>
      <h1>{fund.name}</h1>
      <p>NAV: ₹{fund.currentNav}</p>

      {/* Manager Info */}
      {fund.managerDetails && (
        <div>
          <h2>Fund Manager</h2>
          <p>{fund.managerDetails.name}</p>
          <p>Experience: {fund.managerDetails.experience} years</p>
        </div>
      )}

      {/* Top Holdings */}
      <div>
        <h2>Top Holdings</h2>
        {fund.topHoldings.map((holding) => (
          <div key={holding.ticker}>
            {holding.name} - {holding.percentage}%
          </div>
        ))}
      </div>

      {/* Sector Allocation */}
      <div>
        <h2>Sector Allocation</h2>
        {fund.sectorAllocation.map((sector) => (
          <div key={sector.sector}>
            {sector.sector} - {sector.percentage}%
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 4. Charts with Price History

**Before:**

```typescript
// ❌ Old way - static data
const chartData = [
  { date: '2023-01', nav: 100 },
  { date: '2023-02', nav: 105 },
  // ...
];
```

**After:**

```typescript
// ✅ New way - dynamic data
import { apiClient } from '@/lib/api-client';

export default function FundChart({ fundId }: { fundId: string }) {
  const [chartData, setChartData] = useState([]);
  const [period, setPeriod] = useState<'1M' | '3M' | '1Y' | '5Y'>('1Y');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getPriceHistory(fundId, period);
        setChartData(data.data); // Array of OHLC data
      } catch (error) {
        console.error('Failed to fetch price history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceHistory();
  }, [fundId, period]);

  return (
    <div>
      {/* Period selector */}
      <div>
        {['1M', '3M', '1Y', '5Y'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p as any)}
            className={period === p ? 'active' : ''}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chart */}
      {loading ? (
        <div>Loading chart...</div>
      ) : (
        <LineChart
          data={chartData.map(d => ({
            date: new Date(d.date).toLocaleDateString(),
            value: d.nav,
          }))}
        />
      )}
    </div>
  );
}
```

### 5. Autocomplete Search Bar

**Before:**

```typescript
// ❌ Old way - filtering mock data
const suggestions = mockFunds
  .filter((f) => f.name.toLowerCase().includes(query.toLowerCase()))
  .slice(0, 10);
```

**After:**

```typescript
// ✅ New way - API autocomplete
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { useDebounce } from '@/hooks/use-debounce';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounce search to avoid too many API calls
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const data = await apiClient.getSuggestions(debouncedQuery);
        setSuggestions(data.suggestions);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search funds..."
      />

      {loading && <div>Searching...</div>}

      {suggestions.length > 0 && (
        <div className="suggestions">
          {suggestions.map((fund) => (
            <div key={fund.id} onClick={() => navigate(`/funds/${fund.id}`)}>
              <div>{fund.name}</div>
              <div>{fund.fundHouse}</div>
              <div>₹{fund.currentNav}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 6. Fund Comparison

**Before:**

```typescript
// ❌ Old way
const fund1 = mockFunds.find((f) => f.id === id1);
const fund2 = mockFunds.find((f) => f.id === id2);
```

**After:**

```typescript
// ✅ New way
const [fund1, setFund1] = useState(null);
const [fund2, setFund2] = useState(null);

useEffect(() => {
  const fetchFunds = async () => {
    const [f1, f2] = await Promise.all([
      apiClient.getFundById(id1),
      apiClient.getFundById(id2),
    ]);
    setFund1(f1);
    setFund2(f2);
  };
  fetchFunds();
}, [id1, id2]);
```

### 7. Category Filtering

**Before:**

```typescript
// ❌ Old way
const equityFunds = mockFunds.filter((f) => f.category === 'equity');
```

**After:**

```typescript
// ✅ New way
const [category, setCategory] = useState('equity');
const [funds, setFunds] = useState([]);

useEffect(() => {
  const fetchFunds = async () => {
    const data = await apiClient.getFunds({
      category,
      limit: 50,
    });
    setFunds(data);
  };
  fetchFunds();
}, [category]);
```

---

## 🎣 React Hooks (Optional)

Create reusable hooks for cleaner code:

### `hooks/use-funds.ts`

```typescript
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export function useFunds(filters: {
  query?: string;
  type?: string;
  category?: string;
  page?: number;
  limit?: number;
}) {
  const [funds, setFunds] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFunds = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiClient.getFunds(filters);
        setFunds(data);
        setPagination(data.pagination);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFunds();
  }, [JSON.stringify(filters)]);

  return { funds, pagination, loading, error };
}
```

### `hooks/use-fund-details.ts`

```typescript
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export function useFundDetails(fundId: string) {
  const [fund, setFund] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFund = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiClient.getFundById(fundId);
        setFund(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (fundId) fetchFund();
  }, [fundId]);

  return { fund, loading, error };
}
```

### Usage with Hooks

```typescript
// Much cleaner!
export default function FundsPage() {
  const { funds, pagination, loading, error } = useFunds({
    category: 'equity',
    limit: 20,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {funds.map(fund => (
        <FundCard key={fund.id} fund={fund} />
      ))}
    </div>
  );
}
```

---

## 🔄 Server Components (Next.js 13+)

For Server Components, fetch directly:

```typescript
// app/funds/page.tsx (Server Component)
import { apiClient } from '@/lib/api-client';

export default async function FundsPage({
  searchParams,
}: {
  searchParams: { query?: string; category?: string };
}) {
  // Fetch on server
  const data = await apiClient.getFunds({
    query: searchParams.query,
    category: searchParams.category,
    limit: 20,
  });

  return (
    <div>
      {data.map(fund => (
        <FundCard key={fund.id} fund={fund} />
      ))}
    </div>
  );
}
```

---

## 🎨 Loading States

Show proper loading states:

```typescript
export default function FundsList() {
  const { funds, loading } = useFunds({ limit: 20 });

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {funds.map(fund => (
        <FundCard key={fund.id} fund={fund} />
      ))}
    </div>
  );
}
```

---

## ✅ Migration Checklist

Replace these files/components:

- [ ] `app/funds/page.tsx` - Fund list
- [ ] `app/funds/[id]/page.tsx` - Fund details
- [ ] `app/search/page.tsx` - Search page
- [ ] `components/fund-list.tsx` - Fund list component
- [ ] `components/search-bar.tsx` - Search autocomplete
- [ ] `components/fund-chart.tsx` - Price history chart
- [ ] `app/compare/page.tsx` - Fund comparison
- [ ] `app/overlap/page.tsx` - Fund overlap
- [ ] Remove `data/mock-funds.json`

---

## 🚀 Testing

1. Start backend:

   ```bash
   cd mutual-funds-backend
   npm run dev
   ```

2. Import data (first time):

   ```bash
   npm run import:all
   ```

3. Test APIs:

   ```bash
   .\test-public-apis.ps1
   ```

4. Start frontend:

   ```bash
   cd ..
   npm run dev
   ```

5. Verify:
   - Fund list shows real data
   - Search works
   - Fund details display correctly
   - Charts show historical data
   - Autocomplete suggests real funds

---

## 📚 Resources

- Full API docs: `PUBLIC_API_DOCUMENTATION.md`
- Quick reference: `PUBLIC_API_QUICK_REFERENCE.md`
- Test script: `test-public-apis.ps1`

---

## 🎯 Summary

✅ Created `lib/api-client.ts` with 4 methods
✅ Replace all mock data imports with API calls
✅ Add loading states and error handling
✅ Use debouncing for search/autocomplete
✅ Test thoroughly before deploying

**Mock data is now completely replaced with real database queries!** 🚀
