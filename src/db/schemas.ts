import { Collection, Db, IndexDescription } from 'mongodb';

/**
 * MongoDB Schema Definitions for Mutual Funds Platform
 * Production-ready schemas with comprehensive indexing
 */

// ==================== FUND SCHEMAS ====================

export interface Fund {
  _id?: string;
  fundId: string; // Unique identifier (e.g., ISIN, ticker)
  name: string;
  category: 'equity' | 'debt' | 'hybrid' | 'commodity' | 'etf' | 'index';
  subCategory: string; // e.g., "Large Cap", "Mid Cap", "Gold ETF"
  fundType: 'mutual_fund' | 'etf';

  // Basic Info
  fundHouse: string;
  launchDate: Date;
  aum: number; // Assets Under Management (in crores)
  expenseRatio: number;
  exitLoad: number;
  minInvestment: number;
  sipMinAmount: number;

  // Manager Info
  fundManagerId?: string; // Reference to fund_managers collection
  fundManager: string; // Manager name for quick access

  // Performance
  returns: {
    day: number;
    week: number;
    month: number;
    threeMonth: number;
    sixMonth: number;
    oneYear: number;
    threeYear: number;
    fiveYear: number;
    sinceInception: number;
  };

  // Risk Metrics
  riskMetrics: {
    sharpeRatio: number;
    standardDeviation: number;
    beta: number;
    alpha: number;
    rSquared: number;
    sortino: number;
  };

  // Holdings (top 10-15)
  holdings: Array<{
    name: string;
    ticker?: string;
    percentage: number;
    sector: string;
    quantity?: number;
    value?: number;
  }>;

  // Sector Allocation
  sectorAllocation: Array<{
    sector: string;
    percentage: number;
  }>;

  // Current Price
  currentNav: number;
  previousNav: number;
  navDate: Date;

  // Ratings
  ratings: {
    morningstar?: number;
    crisil?: number;
    valueResearch?: number;
  };

  // Search & Discovery
  tags: string[];
  searchTerms: string[]; // For fuzzy search
  popularity: number; // For ranking

  // Metadata
  isActive: boolean;
  dataSource: string; // 'AMFI', 'Yahoo', 'Manual'
  lastUpdated: Date;
  createdAt: Date;
}

export interface FundPrice {
  _id?: string;
  fundId: string;
  date: Date;
  nav: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
  changePercent: number;
  createdAt: Date;
}

// ==================== FUND MANAGER SCHEMAS ====================

export interface FundManager {
  _id?: string;
  managerId: string;
  name: string;
  bio: string;
  experience: number; // years
  qualification: string[];

  // Current Role
  currentFundHouse: string;
  designation: string;
  joinedDate: Date;

  // Track Record
  fundsManaged: Array<{
    fundId: string;
    fundName: string;
    startDate: Date;
    endDate?: Date;
    aum: number;
    returns: {
      oneYear: number;
      threeYear: number;
      fiveYear: number;
    };
  }>;

  totalAumManaged: number;
  averageReturns: {
    oneYear: number;
    threeYear: number;
    fiveYear: number;
  };

  // Ratings & Recognition
  awards: Array<{
    title: string;
    year: number;
    organization: string;
  }>;

  // Contact & Social
  email?: string;
  linkedin?: string;
  twitter?: string;

  // Metadata
  isActive: boolean;
  lastUpdated: Date;
  createdAt: Date;
}

// ==================== USER SCHEMAS ====================

export interface User {
  _id?: string;
  userId: string;

  // Authentication Methods
  // Google OAuth
  googleId?: string; // Optional now - only for Google users
  
  // Email/Password Auth
  email: string;
  password?: string; // Hashed password for email/password users
  emailVerified: boolean;
  authMethod: 'google' | 'email' | 'both'; // Track authentication method

  // Profile
  name: string;
  firstName: string;
  lastName: string;
  picture?: string;
  phone?: string;

  // Preferences
  preferences: {
    theme: 'light' | 'dark';
    language: 'en' | 'hi';
    currency: string;
    riskProfile: 'conservative' | 'moderate' | 'aggressive';
    notifications: {
      email: boolean;
      push: boolean;
      priceAlerts: boolean;
      newsAlerts: boolean;
    };
  };

  // KYC Status
  kyc: {
    status: 'pending' | 'verified' | 'rejected';
    panNumber?: string;
    aadharNumber?: string;
    verifiedAt?: Date;
  };

  // Subscription
  subscription: {
    plan: 'free' | 'basic' | 'premium';
    startDate?: Date;
    endDate?: Date;
    autoRenew: boolean;
  };

  // Security
  refreshTokens: string[]; // For JWT refresh
  lastLogin: Date;
  loginHistory: Array<{
    timestamp: Date;
    ip: string;
    userAgent: string;
  }>;

  // Metadata
  isActive: boolean;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== WATCHLIST & PORTFOLIO ====================

export interface Watchlist {
  _id?: string;
  userId: string;
  fundId: string;
  fundName: string;
  addedAt: Date;

  // Price Alerts
  priceAlerts: Array<{
    type: 'above' | 'below' | 'change_percent';
    value: number;
    isActive: boolean;
    triggeredAt?: Date;
  }>;

  notes?: string;
}

export interface Portfolio {
  _id?: string;
  userId: string;
  portfolioId: string;
  name: string;

  holdings: Array<{
    fundId: string;
    fundName: string;
    investmentType: 'sip' | 'lumpsum' | 'both';

    // SIP Details
    sipAmount?: number;
    sipDate?: number; // Day of month
    sipStartDate?: Date;
    sipCount?: number;

    // Lumpsum Details
    lumpsumInvestments: Array<{
      amount: number;
      date: Date;
      nav: number;
      units: number;
    }>;

    // Totals
    totalInvested: number;
    totalUnits: number;
    currentValue: number;
    currentNav: number;
    returns: number;
    returnsPercent: number;
    xirr: number;

    addedAt: Date;
    lastUpdated: Date;
  }>;

  // Portfolio Summary
  totalInvested: number;
  currentValue: number;
  totalReturns: number;
  returnsPercent: number;
  xirr: number;

  // Allocation
  categoryAllocation: Array<{
    category: string;
    value: number;
    percentage: number;
  }>;

  sectorAllocation: Array<{
    sector: string;
    value: number;
    percentage: number;
  }>;

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== COMPARISON & OVERLAP ====================

export interface ComparisonHistory {
  _id?: string;
  userId?: string;
  fundIds: string[];
  results: {
    overlapScore: number;
    jaccardSimilarity: number;
    commonHoldings: Array<{
      name: string;
      ticker?: string;
      percentages: number[]; // For each fund
      sector: string;
    }>;
    sectorOverlap: Array<{
      sector: string;
      percentages: number[];
    }>;
    performanceComparison: Array<{
      fundId: string;
      returns: any;
      risk: any;
    }>;
  };
  createdAt: Date;
}

// ==================== CACHING & RATE LIMITING ====================

export interface CacheEntry {
  _id?: string;
  key: string;
  value: any;
  ttl: number; // Seconds
  expiresAt: Date;
  createdAt: Date;
}

export interface RateLimit {
  _id?: string;
  identifier: string; // IP or userId
  endpoint: string;
  count: number;
  windowStart: Date;
  windowEnd: Date;
}

export interface ApiCallLog {
  _id?: string;
  service: string; // 'yahoo_finance', 'amfi', 'rapidapi'
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  success: boolean;
  errorMessage?: string;
  rateLimit?: {
    remaining: number;
    reset: Date;
  };
  timestamp: Date;
}

// ==================== GOALS ====================

export interface Goal {
  _id?: string;
  userId: string;
  goalId: string;
  title: string;
  description: string;

  // Financial Details
  targetAmount: number;
  currentSavings: number;
  monthlyInvestment: number;
  timeframe: number; // years

  // Suggested Funds
  suggestedFunds: Array<{
    fundId: string;
    fundName: string;
    allocationPercent: number;
    sipAmount: number;
  }>;

  // Progress
  status: 'active' | 'completed' | 'paused';
  progress: number; // percentage
  projectedCompletionDate: Date;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// ==================== INDEX DEFINITIONS ====================

export const indexes = {
  funds: [
    { key: { fundId: 1 }, unique: true },
    { key: { name: 'text', searchTerms: 'text', tags: 'text' } }, // Full-text search
    { key: { category: 1, subCategory: 1 } },
    { key: { fundHouse: 1 } },
    { key: { fundManagerId: 1 } },
    { key: { 'returns.oneYear': -1 } },
    { key: { 'returns.threeYear': -1 } },
    { key: { aum: -1 } },
    { key: { popularity: -1 } },
    { key: { isActive: 1, lastUpdated: -1 } },
    { key: { navDate: -1 } },
    { key: { amfiCode: 1 }, sparse: true }, // Allow null values
    // Compound indexes for common queries
    { key: { category: 1, 'returns.oneYear': -1 } },
    { key: { isActive: 1, category: 1, aum: -1 } },
  ],

  fundPrices: [
    { key: { fundId: 1, date: -1 }, unique: true },
    { key: { fundId: 1, date: 1 } }, // For historical queries
    { key: { date: -1 } },
  ],

  fundManagers: [
    { key: { managerId: 1 }, unique: true },
    { key: { name: 'text', bio: 'text' } },
    { key: { currentFundHouse: 1 } },
    { key: { experience: -1 } },
    { key: { totalAumManaged: -1 } },
    { key: { isActive: 1 } },
  ],

  users: [
    { key: { userId: 1 }, unique: true },
    { key: { googleId: 1 }, unique: true, sparse: true },
    { key: { email: 1 }, unique: true },
    { key: { authMethod: 1 } },
    { key: { createdAt: -1 } },
    { key: { isActive: 1 } },
  ],

  watchlists: [
    { key: { userId: 1, fundId: 1 }, unique: true },
    { key: { userId: 1, addedAt: -1 } },
    { key: { fundId: 1 } },
  ],

  portfolios: [
    { key: { userId: 1, portfolioId: 1 }, unique: true },
    { key: { userId: 1, isActive: 1 } },
    { key: { 'holdings.fundId': 1 } },
  ],

  comparisonHistory: [
    { key: { userId: 1, createdAt: -1 } },
    { key: { fundIds: 1 } },
    { key: { createdAt: -1 }, expireAfterSeconds: 2592000 }, // 30 days TTL
  ],

  cacheEntries: [
    { key: { key: 1 }, unique: true },
    { key: { expiresAt: 1 }, expireAfterSeconds: 0 }, // TTL index
  ],

  rateLimits: [
    { key: { identifier: 1, endpoint: 1, windowStart: 1 } },
    { key: { windowEnd: 1 }, expireAfterSeconds: 0 }, // TTL index
  ],

  apiCallLogs: [
    { key: { service: 1, timestamp: -1 } },
    { key: { timestamp: -1 } },
    { key: { timestamp: -1 }, expireAfterSeconds: 2592000 }, // 30 days TTL
  ],

  goals: [
    { key: { userId: 1, goalId: 1 }, unique: true },
    { key: { userId: 1, status: 1 } },
    { key: { userId: 1, createdAt: -1 } },
  ],
};

// ==================== COLLECTION HELPERS ====================

export async function createIndexes(db: Db): Promise<void> {
  console.log('Creating MongoDB indexes...');

  const collections = Object.keys(indexes) as Array<keyof typeof indexes>;

  for (const collectionName of collections) {
    const collection = db.collection(collectionName);
    const indexSpecs = indexes[collectionName];

    try {
      for (const indexSpec of indexSpecs) {
        await collection.createIndex(indexSpec.key as any, {
          unique: (indexSpec as any).unique,
          expireAfterSeconds: (indexSpec as any).expireAfterSeconds,
        });
      }
      console.log(`✓ Indexes created for ${collectionName}`);
    } catch (error) {
      console.error(`✗ Error creating indexes for ${collectionName}:`, error);
    }
  }

  console.log('All indexes created successfully!');
}

export function getCollections(db: Db) {
  return {
    funds: db.collection<Fund>('funds'),
    fundPrices: db.collection<FundPrice>('fundPrices'),
    fundManagers: db.collection<FundManager>('fundManagers'),
    users: db.collection<User>('users'),
    watchlists: db.collection<Watchlist>('watchlists'),
    portfolios: db.collection<Portfolio>('portfolios'),
    comparisonHistory: db.collection<ComparisonHistory>('comparisonHistory'),
    cacheEntries: db.collection<CacheEntry>('cacheEntries'),
    rateLimits: db.collection<RateLimit>('rateLimits'),
    apiCallLogs: db.collection<ApiCallLog>('apiCallLogs'),
    goals: db.collection<Goal>('goals'),
  };
}
