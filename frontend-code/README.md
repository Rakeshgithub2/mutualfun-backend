# 📊 Google Analytics Integration Files

This directory contains ready-to-use Google Analytics implementation files for your frontend application.

## 📋 Configuration

- **Measurement ID**: `G-6V6F9P27P8`
- **Stream ID**: `13188643413`

---

## 📁 Directory Structure

```
frontend-code/
├── .env.example                          # Environment variables template
├── index.html                            # React HTML with GA scripts
├── ANALYTICS_USAGE_EXAMPLES.md          # Component implementation examples
├── README.md                             # This file
└── src/
    ├── lib/
    │   └── analytics.ts                  # Analytics utilities & tracking functions
    ├── components/
    │   ├── GoogleAnalytics.tsx          # GA component (Next.js)
    │   └── AnalyticsPageTracker.tsx     # Page view tracker (Next.js)
    ├── pages/
    │   ├── layout-nextjs-example.tsx    # Next.js layout example
    │   └── app-react-example.tsx        # React App example
    └── types/
        └── gtag.d.ts                     # TypeScript declarations
```

---

## 🚀 Quick Setup

### For Next.js Project

1. **Copy files to your project:**

   ```bash
   # Copy analytics utilities
   cp src/lib/analytics.ts your-project/lib/

   # Copy components
   cp src/components/GoogleAnalytics.tsx your-project/components/
   cp src/components/AnalyticsPageTracker.tsx your-project/components/

   # Copy TypeScript types
   cp src/types/gtag.d.ts your-project/types/
   ```

2. **Create `.env.local`:**

   ```env
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-6V6F9P27P8
   ```

3. **Update `app/layout.tsx`:**

   ```tsx
   import GoogleAnalytics from '@/components/GoogleAnalytics';
   import AnalyticsPageTracker from '@/components/AnalyticsPageTracker';

   export default function RootLayout({ children }) {
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

### For React (Vite) Project

1. **Copy files:**

   ```bash
   # Copy analytics utilities
   cp src/lib/analytics.ts your-project/src/lib/

   # Copy HTML template
   cp index.html your-project/

   # Copy TypeScript types
   cp src/types/gtag.d.ts your-project/src/types/
   ```

2. **Create `.env`:**

   ```env
   VITE_GA_MEASUREMENT_ID=G-6V6F9P27P8
   ```

3. **Update `App.tsx`:**

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

### For Create React App

1. **Copy files:**

   ```bash
   cp src/lib/analytics.ts your-project/src/lib/
   cp src/types/gtag.d.ts your-project/src/types/
   ```

2. **Add GA scripts to `public/index.html`:**

   ```html
   <head>
     <!-- Google Analytics -->
     <script
       async
       src="https://www.googletagmanager.com/gtag/js?id=G-6V6F9P27P8"
     ></script>
     <script>
       window.dataLayer = window.dataLayer || [];
       function gtag() {
         dataLayer.push(arguments);
       }
       gtag('js', new Date());
       gtag('config', 'G-6V6F9P27P8');
     </script>
   </head>
   ```

3. **Create `.env`:**
   ```env
   REACT_APP_GA_MEASUREMENT_ID=G-6V6F9P27P8
   ```

---

## 📝 Available Tracking Functions

### `analytics.ts` exports:

```typescript
// Page views
pageview(url: string): void

// Custom events
event({ action, category, label?, value? }): void

// Pre-configured tracking functions
trackSearch(query: string, resultsCount?: number): void
trackFundView(fundId: string, fundName: string): void
trackFundComparison(fundIds: string[]): void
trackWatchlistAction(action: 'add' | 'remove', fundId: string): void
trackAuth(action: 'login' | 'signup' | 'logout', provider?: 'email' | 'google'): void
trackFilter(filterType: string, filterValue: string): void
trackSort(sortField: string, sortOrder: 'asc' | 'desc'): void
trackExport(exportType: string, dataType: string): void
trackError(errorMessage: string, errorLocation: string): void
```

---

## 💡 Usage Examples

### Search Tracking

```tsx
import { trackSearch } from '@/lib/analytics';

const handleSearch = (query: string, results: Fund[]) => {
  trackSearch(query, results.length);
};
```

### Fund View Tracking

```tsx
import { trackFundView } from '@/lib/analytics';

useEffect(() => {
  if (fund) {
    trackFundView(fund.fundId, fund.name);
  }
}, [fund]);
```

### Authentication Tracking

```tsx
import { trackAuth } from '@/lib/analytics';

const handleGoogleLogin = async () => {
  await loginWithGoogle();
  trackAuth('login', 'google');
};
```

### Error Tracking

```tsx
import { trackError } from '@/lib/analytics';

try {
  await fetchFunds();
} catch (error) {
  trackError(error.message, 'FundsList');
  throw error;
}
```

See `ANALYTICS_USAGE_EXAMPLES.md` for more detailed examples.

---

## 🧪 Testing

### 1. Check GA is loaded

Open browser console:

```javascript
console.log(typeof window.gtag); // should output "function"
```

### 2. Test an event

```javascript
gtag('event', 'test_event', {
  event_category: 'Test',
  event_label: 'Manual Test',
});
```

### 3. Check Google Analytics

1. Go to [Google Analytics](https://analytics.google.com/)
2. Navigate to Reports → Realtime
3. You should see your test events

---

## 🔒 Privacy Considerations

1. **Cookie Consent**: Consider implementing a cookie consent banner before loading GA
2. **PII Protection**: Never track personally identifiable information
3. **Production Only**: The Next.js implementation only loads GA in production
4. **GDPR/CCPA**: Ensure compliance with data protection regulations

---

## 📦 File Descriptions

### `src/lib/analytics.ts`

Core analytics utilities with TypeScript support. Includes:

- Type-safe event tracking
- Pre-configured functions for common actions
- Environment variable handling for all frameworks

### `src/components/GoogleAnalytics.tsx`

Next.js component that loads GA scripts:

- Uses Next.js Script component for optimal loading
- Only loads in production
- Proper script strategy for performance

### `src/components/AnalyticsPageTracker.tsx`

Automatic page view tracking for Next.js App Router:

- Tracks route changes
- Handles search parameters
- Client-side only (uses 'use client')

### `index.html`

Ready-to-use HTML template for React:

- GA scripts in head
- Proper script order
- Works with Vite and CRA

### `src/types/gtag.d.ts`

TypeScript declarations for gtag:

- Type safety for gtag calls
- Intellisense support
- Proper Window interface extension

---

## 📊 What Gets Tracked

### Automatically Tracked

- ✅ Page views
- ✅ Sessions
- ✅ User engagement

### Available for Manual Tracking

- ✅ Search queries & results
- ✅ Fund detail views
- ✅ Fund comparisons
- ✅ Watchlist operations
- ✅ User authentication
- ✅ Filters & sorts
- ✅ Data exports
- ✅ Errors

---

## 🎯 Best Practices

1. **Consistent Naming**: Use consistent names for events and categories
2. **Meaningful Labels**: Use descriptive labels that help with analysis
3. **Don't Overtrack**: Only track meaningful user interactions
4. **Test First**: Always test in development before production
5. **Monitor Regularly**: Check GA reports to understand user behavior

---

## 📚 Additional Documentation

- **`../GOOGLE_ANALYTICS_SETUP.md`** - Complete setup guide
- **`../GOOGLE_ANALYTICS_QUICK_START.md`** - Quick reference
- **`ANALYTICS_USAGE_EXAMPLES.md`** - Real-world examples
- **`../GOOGLE_ANALYTICS_IMPLEMENTATION_COMPLETE.md`** - Implementation summary

---

## 🆘 Troubleshooting

### GA not loading?

- Check environment variables are set correctly
- Verify GA script in Network tab
- Check for console errors

### Events not showing?

- Verify gtag function exists: `console.log(typeof window.gtag)`
- Check GA Realtime reports (not standard reports - they have delays)
- Ensure measurement ID is correct

### TypeScript errors?

- Ensure `gtag.d.ts` is in your types folder
- Check `tsconfig.json` includes the types folder
- Restart TypeScript server in VS Code

---

## ✅ Ready to Use

All files are production-ready and tested. Simply copy them to your project and follow the quick setup guide for your framework.

For questions or issues, refer to the main documentation files in the parent directory.
