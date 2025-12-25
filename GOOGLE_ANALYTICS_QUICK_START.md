# 🚀 Google Analytics Quick Reference

**Measurement ID**: `G-6V6F9P27P8`  
**Stream ID**: `13188643413`

---

## ⚡ Quick Setup (5 minutes)

### Next.js

1. **Add to `.env.local`**:

   ```env
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-6V6F9P27P8
   ```

2. **Copy files**:
   - `frontend-code/src/lib/analytics.ts` → `lib/analytics.ts`
   - `frontend-code/src/components/GoogleAnalytics.tsx` → `components/GoogleAnalytics.tsx`
   - `frontend-code/src/components/AnalyticsPageTracker.tsx` → `components/AnalyticsPageTracker.tsx`

3. **Update `app/layout.tsx`**:

   ```tsx
   import GoogleAnalytics from '@/components/GoogleAnalytics';
   import AnalyticsPageTracker from '@/components/AnalyticsPageTracker';

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           <GoogleAnalytics />
           <AnalyticsPageTracker />
           {children}
         </body>
       </html>
     );
   }
   ```

### React (Vite/CRA)

1. **Add to `.env`**:

   ```env
   VITE_GA_MEASUREMENT_ID=G-6V6F9P27P8
   # OR for CRA:
   REACT_APP_GA_MEASUREMENT_ID=G-6V6F9P27P8
   ```

2. **Copy files**:
   - `frontend-code/src/lib/analytics.ts` → `src/lib/analytics.ts`
   - `frontend-code/index.html` → `index.html` (replace existing)

3. **Update `App.tsx`**:

   ```tsx
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

---

## 📝 Common Usage

```tsx
import {
  trackSearch,
  trackFundView,
  trackFundComparison,
  trackWatchlistAction,
  trackAuth,
  trackFilter,
  trackSort,
  trackExport,
  trackError,
} from '@/lib/analytics';

// Search
trackSearch('HDFC Equity', 15);

// Fund view
trackFundView('FUND123', 'HDFC Top 100 Fund');

// Comparison
trackFundComparison(['FUND123', 'FUND456', 'FUND789']);

// Watchlist
trackWatchlistAction('add', 'FUND123');
trackWatchlistAction('remove', 'FUND123');

// Auth
trackAuth('login', 'email');
trackAuth('signup', 'google');
trackAuth('logout');

// Filters
trackFilter('category', 'Equity');
trackFilter('aum', '>1000cr');

// Sorting
trackSort('returns', 'desc');

// Export
trackExport('pdf', 'fund_details');

// Errors
trackError('Failed to load data', 'FundsList');
```

---

## ✅ Testing

1. **Browser Console**:

   ```js
   gtag('event', 'test', { event_category: 'Test' });
   ```

2. **Google Analytics**: Reports → Realtime

3. **Verify**: See yourself in the realtime report

---

## 📁 Files Included

- `GOOGLE_ANALYTICS_SETUP.md` - Complete setup guide
- `frontend-code/src/lib/analytics.ts` - Analytics utilities
- `frontend-code/src/components/GoogleAnalytics.tsx` - Next.js component
- `frontend-code/src/components/AnalyticsPageTracker.tsx` - Page tracker
- `frontend-code/index.html` - React HTML template
- `frontend-code/ANALYTICS_USAGE_EXAMPLES.md` - Usage examples
- `GOOGLE_ANALYTICS_QUICK_START.md` - This file

---

## 🔒 Privacy Notes

- Only loads in production (not in development)
- Consider adding cookie consent
- Don't track PII (personally identifiable information)

---

## 🚀 You're Ready!

Your Google Analytics is configured and ready to use. See `GOOGLE_ANALYTICS_SETUP.md` for detailed instructions and `ANALYTICS_USAGE_EXAMPLES.md` for implementation examples.
