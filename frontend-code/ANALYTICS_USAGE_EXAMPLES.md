# Example: Usage of Google Analytics in Your Components

## Environment Variables

Add to your `.env` or `.env.local`:

```env
# For Next.js
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-6V6F9P27P8

# For Vite
VITE_GA_MEASUREMENT_ID=G-6V6F9P27P8

# For Create React App
REACT_APP_GA_MEASUREMENT_ID=G-6V6F9P27P8
```

---

## 1. Search Component Example

```tsx
import React, { useState } from 'react';
import { trackSearch } from '@/lib/analytics';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    // Perform search
    const results = await searchFunds(query);

    // Track search event
    trackSearch(query, results.length);
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search funds..."
      />
      <button type="submit">Search</button>
    </form>
  );
}
```

---

## 2. Fund Details Page Example

```tsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { trackFundView } from '@/lib/analytics';

export default function FundDetailsPage() {
  const { fundId } = useParams();
  const [fund, setFund] = useState(null);

  useEffect(() => {
    // Fetch fund details
    fetchFundDetails(fundId).then((data) => {
      setFund(data);

      // Track fund view
      trackFundView(data.fundId, data.name);
    });
  }, [fundId]);

  return (
    <div>
      {fund && (
        <>
          <h1>{fund.name}</h1>
          <p>{fund.category}</p>
          {/* Other fund details */}
        </>
      )}
    </div>
  );
}
```

---

## 3. Fund Comparison Example

```tsx
import React from 'react';
import { trackFundComparison } from '@/lib/analytics';

export default function CompareFunds() {
  const [selectedFunds, setSelectedFunds] = useState<string[]>([]);

  const handleCompare = () => {
    if (selectedFunds.length >= 2) {
      // Track comparison
      trackFundComparison(selectedFunds);

      // Navigate to comparison page
      navigate(`/compare?funds=${selectedFunds.join(',')}`);
    }
  };

  return (
    <div>
      <h2>Select Funds to Compare</h2>
      {/* Fund selection UI */}
      <button onClick={handleCompare} disabled={selectedFunds.length < 2}>
        Compare {selectedFunds.length} Funds
      </button>
    </div>
  );
}
```

---

## 4. Watchlist Example

```tsx
import React from 'react';
import { trackWatchlistAction } from '@/lib/analytics';

export default function WatchlistButton({ fundId }: { fundId: string }) {
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const toggleWatchlist = async () => {
    if (isInWatchlist) {
      await removeFromWatchlist(fundId);
      trackWatchlistAction('remove', fundId);
      setIsInWatchlist(false);
    } else {
      await addToWatchlist(fundId);
      trackWatchlistAction('add', fundId);
      setIsInWatchlist(true);
    }
  };

  return (
    <button onClick={toggleWatchlist}>
      {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
    </button>
  );
}
```

---

## 5. Authentication Example

```tsx
import React from 'react';
import { trackAuth } from '@/lib/analytics';

export default function LoginPage() {
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await login(email, password);

      // Track successful login
      trackAuth('login', 'email');

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const response = await googleLogin(credentialResponse);

      // Track Google login
      trackAuth('login', 'google');

      navigate('/dashboard');
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin(email, password);
        }}
      >
        {/* Login form */}
      </form>
      <GoogleLogin onSuccess={handleGoogleLogin} />
    </div>
  );
}
```

---

## 6. Filter Example

```tsx
import React from 'react';
import { trackFilter } from '@/lib/analytics';

export default function FundFilters() {
  const handleCategoryFilter = (category: string) => {
    trackFilter('category', category);
    // Apply filter
    applyFilter({ category });
  };

  const handleAUMFilter = (minAUM: number) => {
    trackFilter('aum', `>${minAUM}`);
    // Apply filter
    applyFilter({ minAUM });
  };

  return (
    <div>
      <select onChange={(e) => handleCategoryFilter(e.target.value)}>
        <option value="">All Categories</option>
        <option value="equity">Equity</option>
        <option value="debt">Debt</option>
        <option value="hybrid">Hybrid</option>
      </select>
    </div>
  );
}
```

---

## 7. Sort Example

```tsx
import React, { useState } from 'react';
import { trackSort } from '@/lib/analytics';

export default function FundsList() {
  const [sortField, setSortField] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string) => {
    const newOrder =
      field === sortField && sortOrder === 'asc' ? 'desc' : 'asc';

    // Track sort action
    trackSort(field, newOrder);

    setSortField(field);
    setSortOrder(newOrder);

    // Apply sorting
    sortFunds(field, newOrder);
  };

  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => handleSort('name')}>Name</th>
          <th onClick={() => handleSort('returns')}>Returns</th>
          <th onClick={() => handleSort('aum')}>AUM</th>
        </tr>
      </thead>
      {/* Table body */}
    </table>
  );
}
```

---

## 8. Error Tracking Example

```tsx
import React, { useEffect } from 'react';
import { trackError } from '@/lib/analytics';

export default function DataFetchComponent() {
  useEffect(() => {
    fetchData().catch((error) => {
      // Track error
      trackError(error.message, 'DataFetchComponent');

      // Show error to user
      showErrorMessage(error.message);
    });
  }, []);

  return <div>{/* Component content */}</div>;
}

// Or use an Error Boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Track error
    trackError(error.message, errorInfo.componentStack || 'Unknown');
  }

  render() {
    return this.props.children;
  }
}
```

---

## 9. Export Example

```tsx
import React from 'react';
import { trackExport } from '@/lib/analytics';

export default function ExportButton({ data, fundId }: any) {
  const handleExportPDF = () => {
    // Track export
    trackExport('pdf', 'fund_details');

    // Generate PDF
    generatePDF(data, fundId);
  };

  const handleExportCSV = () => {
    trackExport('csv', 'fund_comparison');

    // Generate CSV
    generateCSV(data);
  };

  return (
    <div>
      <button onClick={handleExportPDF}>Export as PDF</button>
      <button onClick={handleExportCSV}>Export as CSV</button>
    </div>
  );
}
```

---

## 10. Custom Hook Example

```tsx
import { useEffect } from 'react';
import { event } from '@/lib/analytics';

// Custom hook for tracking time on page
export function usePageTimeTracking(pageName: string) {
  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      event({
        action: 'time_on_page',
        category: 'Engagement',
        label: pageName,
        value: timeSpent,
      });
    };
  }, [pageName]);
}

// Usage
export default function FundDetailsPage() {
  usePageTimeTracking('Fund Details');

  return <div>{/* Page content */}</div>;
}
```

---

## Testing Your Implementation

### 1. Browser Console Test

```javascript
// Open browser console and run:
window.gtag('event', 'test_event', {
  event_category: 'Test',
  event_label: 'Testing Analytics',
});
```

### 2. Check Network Tab

1. Open DevTools → Network tab
2. Filter by "gtag" or "google-analytics"
3. Interact with your app
4. Verify that events are being sent

### 3. Google Analytics Realtime

1. Go to Google Analytics
2. Navigate to Reports → Realtime
3. Interact with your app
4. See events appear in realtime

---

## Best Practices

1. **Don't Track PII**: Never track personally identifiable information
2. **Be Consistent**: Use consistent naming for events and categories
3. **Track User Intent**: Focus on tracking what users are trying to accomplish
4. **Meaningful Labels**: Use descriptive labels that help you analyze later
5. **Test First**: Always test in development before deploying
6. **Respect Privacy**: Implement cookie consent if required in your region
