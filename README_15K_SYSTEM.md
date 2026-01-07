# 15,000+ Mutual Funds System - Complete Setup

## 🎯 System Overview

Your mutual fund platform is configured to:

- **Store 15,000+ funds** in MongoDB Atlas
- **Automatic updates** with different schedules based on data type
- **Real-time data** during market hours
- **Organized by category**: equity (40%), debt (35%), commodity (25%)

---

## 📊 MongoDB Atlas Configuration

**Connection String**:

```
mongodb+srv://rakeshd01042024_db_user:Rakesh1234@mutualfunds.l7zeno9.mongodb.net/mutualfunds
```

**Database**: `mutualfunds`  
**Collection**: `funds`  
**Expected Documents**: 15,000+

---

## 🚀 Quick Start

### Option 1: One-Command Setup (Windows)

```bash
cd mutual-funds-backend
setup-15k-funds.bat
```

### Option 2: Manual Setup

```bash
cd mutual-funds-backend
npm install
npm run setup:15k
```

This will:

1. ✅ Add MongoDB indexes for performance
2. ✅ Fetch all 15,000+ funds from AMFI
3. ✅ Verify database contains all funds
4. ✅ Initialize automated update schedules

---

## ⏰ Automated Update Schedule

### Daily Updates

- **NAV (Net Asset Value)**: Every 1 hour
  - Fetches latest NAV from AMFI
  - Updates all 15,000+ funds
  - Cron: `0 * * * *` (every hour)

- **Daily Returns**: Daily at 6 PM IST
  - Calculates 1-day, 1-month returns
  - Updates performance metrics
  - Cron: `0 18 * * *`

- **Market Indices**: Every 5 minutes (9 AM - 4 PM IST, Mon-Fri)
  - NIFTY 50, SENSEX, etc.
  - Real-time during market hours
  - Cron: `*/5 9-16 * * 1-5`

### Weekly Updates

- **Weekly Returns**: Calculated in daily update job
  - 7-day performance tracking

### Monthly Updates (1st of every month at 2 AM IST)

- **Long-term Returns**: 3Y, 5Y, 10Y
- **AUM (Assets Under Management)**
- **Expense Ratio**
- Cron: `0 2 1 * *`

### Quarterly Updates (Jan, Apr, Jul, Oct - 1st at 3 AM IST)

- **Holdings**: Top holdings by fund
- **Sector Allocation**: Distribution across sectors
- Cron: `0 3 1 1,4,7,10 *`

### Semi-Annual Updates (Jan, Jul - 1st at 4 AM IST)

- **Fund Managers**: Manager information and experience
- Cron: `0 4 1 1,7 *`

---

## 📁 Database Organization

All funds are stored in a single collection (`funds`) with proper categorization:

```javascript
{
  scheme_code: "123456",           // Unique identifier
  scheme_name: "Fund Name",        // Full fund name
  amc: "AMC Name",                 // Asset Management Company

  // CATEGORIES (lowercase, no spaces)
  category: "equity",              // equity | debt | commodity
  subcategory: "largecap",         // largecap, midcap, liquid, gold, etc.

  // DAILY UPDATES
  nav: 125.50,                     // Current NAV
  nav_date: "02-Jan-2026",         // NAV date

  // PERFORMANCE DATA
  returns: {
    oneday: 0.5,                   // Daily (Updated daily)
    oneweek: 1.2,                  // Weekly (Updated daily)
    onemonth: 3.5,                 // Monthly (Updated daily)
    oneyear: 15.3,                 // 1Y (Updated monthly)
    threeyear: 45.8,               // 3Y (Updated monthly)
    fiveyear: 85.2,                // 5Y (Updated monthly)
    tenyear: 150.5                 // 10Y (Updated monthly)
  },

  // MONTHLY UPDATES
  aum: 5000,                       // AUM in crores
  expense_ratio: 1.25,             // Expense ratio %

  // QUARTERLY UPDATES
  holdings: [],                    // Top holdings
  sectors: [],                     // Sector allocation

  // SEMI-ANNUAL UPDATES
  fund_manager: {
    name: "Manager Name",
    experience: 15
  },

  // METADATA
  last_updated: Date,              // Last update timestamp
  isin_div: "INF...",             // ISIN codes
  isin_reinv: "INF...",
  isin_growth: "INF..."
}
```

---

## 🔧 Available Commands

### Setup & Ingestion

```bash
npm run setup:15k        # Complete setup (indexes + ingestion + verify)
npm run ingest:funds     # Fetch all 15,000+ funds from AMFI
npm run indexes:add      # Add MongoDB indexes
```

### Verification & Monitoring

```bash
npm run verify:15k       # Verify database has 15,000+ funds
npm run monitor:system   # Check system health and update status
```

### Manual Updates

```bash
npm run update:nav       # Update NAV for all funds
npm run update:returns   # Update returns for all funds
```

### Server

```bash
npm run dev             # Start backend (includes auto-updates)
```

---

## ✅ Verification Checklist

After running setup, verify everything works:

### 1. Check Fund Count

```bash
npm run verify:15k
```

Expected output:

```
✅ TOTAL FUNDS: 15,000+
✅ EQUITY: ~6,000 (40%)
✅ DEBT: ~5,250 (35%)
✅ COMMODITY: ~3,750 (25%)
```

### 2. Monitor System Health

```bash
npm run monitor:system
```

Shows:

- Total fund count
- Category distribution
- Last update times
- Data quality metrics
- Top performing funds

### 3. Check MongoDB Atlas

1. Go to: https://cloud.mongodb.com/
2. Navigate to: mutualfunds → funds collection
3. Verify: 15,000+ documents

### 4. Test API Endpoints

Start backend:

```bash
npm run dev
```

Test endpoints:

```bash
# All equity funds
curl http://localhost:3002/api/funds/equity

# All debt funds
curl http://localhost:3002/api/funds/debt

# All commodity funds
curl http://localhost:3002/api/funds/commodity

# Specific fund by scheme code
curl http://localhost:3002/api/funds/123456
```

### 5. Check Auto-Updates

Start the backend and check logs for cron job initialization:

```
✅ Scheduled: NAV update every 1 hour
✅ Scheduled: Daily returns at 6 PM IST
✅ Scheduled: Monthly updates on 1st at 2 AM IST
✅ Scheduled: Holdings update quarterly at 3 AM IST
✅ Scheduled: Fund manager update semi-annually at 4 AM IST
✅ Scheduled: Market indices every 5 minutes (9 AM-4 PM, Mon-Fri IST)
```

---

## 🐛 Troubleshooting

### Problem: Only 202 funds showing

**Cause**: Old seed scripts had pagination limits

**Solution**: Run the new ingestion engine

```bash
npm run ingest:funds
```

### Problem: NAV not updating

**Cause**: Cron jobs not running

**Solution**: Ensure backend is running

```bash
npm run dev
```

Cron jobs initialize automatically when server starts.

### Problem: Data seems stale

**Solution**: Manually trigger updates

```bash
npm run update:nav      # Update NAV
npm run update:returns  # Update returns
```

### Problem: MongoDB connection fails

**Solution**: Check .env file has correct connection string

```env
DATABASE_URL="mongodb+srv://rakeshd01042024_db_user:Rakesh1234@mutualfunds.l7zeno9.mongodb.net/mutualfunds?retryWrites=true&w=majority&appName=mutualfunds"
```

---

## 📈 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     AMFI Data Source                     │
│           https://www.amfiindia.com/spages/              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Ingestion Engine (No Limits)                │
│  • Fetches ALL funds (loops until empty)                 │
│  • Categorizes: equity, debt, commodity                  │
│  • BulkWrite with upsert (no overwrites)                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│           MongoDB Atlas (mutualfunds.funds)              │
│  • 15,000+ fund documents                                │
│  • Indexed: scheme_code, category, subcategory           │
│  • Optimized queries                                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 Cron Job Scheduler                       │
│  ├─ NAV: Hourly                                          │
│  ├─ Daily Returns: 6 PM IST                              │
│  ├─ Monthly: Long-term returns, AUM                      │
│  ├─ Quarterly: Holdings, sectors                         │
│  ├─ Semi-annual: Fund managers                           │
│  └─ Market Indices: Every 5 min (trading hours)          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 Express API Server                       │
│  • GET /api/funds/:category                              │
│  • GET /api/funds/:schemeCode                            │
│  • Pagination support                                    │
│  • Real-time data                                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 Next.js Frontend                         │
│  • Category pages with pagination                        │
│  • Fund detail pages                                     │
│  • Market indices ticker                                 │
│  • Load Next 100 buttons                                 │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Features

### ✅ No Pagination Limits

- Ingestion engine loops until AMFI API returns empty
- Fetches ALL available funds without hard limits

### ✅ Proper Categorization

- **Lowercase naming**: equity, debt, commodity
- **Subcategories**: largecap, midcap, smallcap, liquid, gold, silver, etc.
- **No spaces, no plurals**

### ✅ BulkWrite with Upsert

- Efficient database operations
- No data overwrites
- Handles 15,000+ funds smoothly

### ✅ Real-time Updates

- Different schedules for different data types
- Market indices update every 5 minutes during trading hours
- NAV updates every hour

### ✅ Data Quality

- Verification scripts
- System monitoring
- Validation checks

---

## 📞 Support

If you encounter issues:

1. **Check system status**:

   ```bash
   npm run monitor:system
   ```

2. **Re-run setup**:

   ```bash
   npm run setup:15k
   ```

3. **Verify database**:

   ```bash
   npm run verify:15k
   ```

4. **Check logs**: Backend logs show all cron job executions

---

## 🎉 Success Criteria

Your system is working correctly when:

- ✅ MongoDB has 15,000+ fund documents
- ✅ Verification script passes all checks
- ✅ Category distribution: ~40% equity, ~35% debt, ~25% commodity
- ✅ NAV updates hourly
- ✅ Market indices update every 5 minutes (trading hours)
- ✅ API endpoints return proper data
- ✅ Frontend displays all funds with pagination

---

**Your mutual fund platform is now production-ready with 15,000+ funds and automated updates! 🚀**
