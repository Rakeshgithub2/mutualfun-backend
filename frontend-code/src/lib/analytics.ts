// Google Analytics Configuration and Utilities
// Measurement ID: G-6V6F9P27P8

// Get the measurement ID from environment variables
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
  process.env.VITE_GA_MEASUREMENT_ID ||
  process.env.REACT_APP_GA_MEASUREMENT_ID ||
  'G-6V6F9P27P8';

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

/**
 * Track page views
 * @param url - The page URL to track
 */
export const pageview = (url: string): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

/**
 * Track custom events
 * @param action - The action being tracked
 * @param category - The event category
 * @param label - Optional event label
 * @param value - Optional numeric value
 */
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
}): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

/**
 * Track search events
 * @param query - The search query
 * @param resultsCount - Optional number of results
 */
export const trackSearch = (query: string, resultsCount?: number): void => {
  event({
    action: 'search',
    category: 'Search',
    label: query,
    value: resultsCount,
  });
};

/**
 * Track fund view events
 * @param fundId - The fund ID
 * @param fundName - The fund name
 */
export const trackFundView = (fundId: string, fundName: string): void => {
  event({
    action: 'view_fund',
    category: 'Funds',
    label: `${fundId} - ${fundName}`,
  });
};

/**
 * Track fund comparison events
 * @param fundIds - Array of fund IDs being compared
 */
export const trackFundComparison = (fundIds: string[]): void => {
  event({
    action: 'compare_funds',
    category: 'Comparison',
    label: fundIds.join(','),
    value: fundIds.length,
  });
};

/**
 * Track watchlist actions
 * @param action - 'add' or 'remove'
 * @param fundId - The fund ID
 */
export const trackWatchlistAction = (
  action: 'add' | 'remove',
  fundId: string
): void => {
  event({
    action: action === 'add' ? 'add_to_watchlist' : 'remove_from_watchlist',
    category: 'Watchlist',
    label: fundId,
  });
};

/**
 * Track authentication events
 * @param action - 'login', 'signup', or 'logout'
 * @param provider - 'email' or 'google'
 */
export const trackAuth = (
  action: 'login' | 'signup' | 'logout',
  provider?: 'email' | 'google'
): void => {
  event({
    action,
    category: 'Authentication',
    label: provider,
  });
};

/**
 * Track filter application
 * @param filterType - The type of filter applied
 * @param filterValue - The filter value
 */
export const trackFilter = (filterType: string, filterValue: string): void => {
  event({
    action: 'apply_filter',
    category: 'Filters',
    label: `${filterType}: ${filterValue}`,
  });
};

/**
 * Track sort actions
 * @param sortField - The field being sorted
 * @param sortOrder - 'asc' or 'desc'
 */
export const trackSort = (
  sortField: string,
  sortOrder: 'asc' | 'desc'
): void => {
  event({
    action: 'sort',
    category: 'Sorting',
    label: `${sortField} - ${sortOrder}`,
  });
};

/**
 * Track export actions
 * @param exportType - The type of export (e.g., 'pdf', 'csv')
 * @param dataType - What was exported (e.g., 'fund_details', 'comparison')
 */
export const trackExport = (exportType: string, dataType: string): void => {
  event({
    action: 'export',
    category: 'Export',
    label: `${dataType} as ${exportType}`,
  });
};

/**
 * Track errors
 * @param errorMessage - The error message
 * @param errorLocation - Where the error occurred
 */
export const trackError = (
  errorMessage: string,
  errorLocation: string
): void => {
  event({
    action: 'error',
    category: 'Errors',
    label: `${errorLocation}: ${errorMessage}`,
  });
};
