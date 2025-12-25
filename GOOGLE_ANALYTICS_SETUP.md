# 📊 Google Analytics Setup Guide

## Configuration Details

- **Measurement ID**: `G-6V6F9P27P8`
- **Stream ID**: `13188643413`

---

## 🚀 Quick Setup for Next.js

### Step 1: Add Environment Variable

Add to your `.env.local` file in the frontend project:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-6V6F9P27P8
```

### Step 2: Update Root Layout

Update your `app/layout.tsx` or `app/layout.jsx`:

```typescript
import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Step 3: Create Analytics Utility (Optional but Recommended)

Create `lib/analytics.ts` or `utils/analytics.ts`:

```typescript
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
```

### Step 4: Track Page Views on Route Change (Optional)

For Next.js App Router, create a component `components/Analytics.tsx`:

```typescript
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview } from '@/lib/analytics';

export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      pageview(pathname + searchParams.toString());
    }
  }, [pathname, searchParams]);

  return null;
}
```

Then add it to your root layout:

```typescript
import Analytics from '@/components/Analytics';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>{/* Google Analytics scripts here */}</head>
      <body>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
```

---

## 🎯 For React (Vite/Create React App)

### Step 1: Add Environment Variable

**For Vite** (`.env`):

```env
VITE_GA_MEASUREMENT_ID=G-6V6F9P27P8
```

**For Create React App** (`.env`):

```env
REACT_APP_GA_MEASUREMENT_ID=G-6V6F9P27P8
```

### Step 2: Update index.html

Add to the `<head>` section of `public/index.html` or `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mutual Funds Platform</title>

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
  <body>
    <div id="root"></div>
  </body>
</html>
```

### Step 3: Create Analytics Utility

Create `src/utils/analytics.js` or `src/utils/analytics.ts`:

```typescript
// For Vite
export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// For Create React App
// export const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
```

### Step 4: Track Page Views in App Component

Update your main App component:

```typescript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageview } from './utils/analytics';

function App() {
  const location = useLocation();

  useEffect(() => {
    pageview(location.pathname + location.search);
  }, [location]);

  return (
    // Your app components
  );
}

export default App;
```

---

## 📝 Usage Examples

### Track Search Events

```typescript
import { event } from '@/lib/analytics';

const handleSearch = (query: string) => {
  event({
    action: 'search',
    category: 'Search',
    label: query,
  });
};
```

### Track Fund View

```typescript
import { event } from '@/lib/analytics';

const trackFundView = (fundId: string, fundName: string) => {
  event({
    action: 'view_fund',
    category: 'Funds',
    label: `${fundId} - ${fundName}`,
  });
};
```

### Track Fund Comparison

```typescript
import { event } from '@/lib/analytics';

const trackFundComparison = (fundIds: string[]) => {
  event({
    action: 'compare_funds',
    category: 'Comparison',
    label: fundIds.join(','),
    value: fundIds.length,
  });
};
```

### Track Watchlist Actions

```typescript
import { event } from '@/lib/analytics';

const trackWatchlistAdd = (fundId: string) => {
  event({
    action: 'add_to_watchlist',
    category: 'Watchlist',
    label: fundId,
  });
};

const trackWatchlistRemove = (fundId: string) => {
  event({
    action: 'remove_from_watchlist',
    category: 'Watchlist',
    label: fundId,
  });
};
```

### Track User Authentication

```typescript
import { event } from '@/lib/analytics';

const trackLogin = (provider: 'email' | 'google') => {
  event({
    action: 'login',
    category: 'Authentication',
    label: provider,
  });
};

const trackSignup = (provider: 'email' | 'google') => {
  event({
    action: 'signup',
    category: 'Authentication',
    label: provider,
  });
};
```

---

## 🔍 Testing Your Setup

### 1. Check in Browser Console

After implementation, open your browser console and type:

```javascript
gtag('event', 'test_event', {
  event_category: 'Test',
  event_label: 'Testing GA Setup',
});
```

### 2. Use Google Analytics Realtime Report

1. Go to [Google Analytics](https://analytics.google.com/)
2. Navigate to your property
3. Go to **Reports** → **Realtime**
4. Visit your website
5. You should see yourself in the realtime report

### 3. Use Google Tag Assistant

Install the [Tag Assistant Chrome Extension](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk) to verify your tags are firing correctly.

---

## ⚠️ Important Notes

### 1. Cookie Consent

Consider implementing cookie consent before loading Google Analytics:

```typescript
'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function GoogleAnalytics() {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    // Check if user has given consent
    const hasConsent = localStorage.getItem('ga-consent') === 'true';
    setConsent(hasConsent);
  }, []);

  if (!consent) return null;

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-6V6F9P27P8"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-6V6F9P27P8');
        `}
      </Script>
    </>
  );
}
```

### 2. Production vs Development

Only load Google Analytics in production:

```typescript
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const isProduction = process.env.NODE_ENV === 'production';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {isProduction && GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {/* GA script */}
            </Script>
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## 🚀 Deployment Checklist

- [ ] Environment variable `NEXT_PUBLIC_GA_MEASUREMENT_ID` or `VITE_GA_MEASUREMENT_ID` set
- [ ] Google Analytics scripts added to root layout/index.html
- [ ] Page view tracking implemented
- [ ] Custom event tracking implemented (optional)
- [ ] Testing completed in development
- [ ] Verified in Google Analytics Realtime report
- [ ] Cookie consent implemented (if required)
- [ ] Production environment variable configured

---

## 📚 Additional Resources

- [Google Analytics Documentation](https://developers.google.com/analytics)
- [Next.js with Google Analytics](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
- [React Google Analytics Guide](https://github.com/react-ga/react-ga)

---

## ✅ Summary

Your Google Analytics is configured with:

- **Measurement ID**: G-6V6F9P27P8
- **Stream ID**: 13188643413

Follow the framework-specific instructions above to integrate it into your frontend application.
