# 🚀 15,000+ Mutual Funds System - Complete Setup Guide

## Overview

This system fetches, stores, and maintains **15,000+ mutual funds** from AMFI with automatic updates via cron jobs. All category names use **lowercase** convention without spaces or plurals.

---

## 📊 System Architecture

### Database: MongoDB Atlas

**Database Name:** `mutualfunds`  
**Collection:** `funds`

### Category Distribution

```
equity      = 40% (~6,000+ funds)
debt        = 35% (~5,250+ funds)
commodity   = 25% (~3,750+ funds)
────────────────────────────────────
TOTAL       = 15,000+ funds
```

### Subcategories (all lowercase)

**Equity:**

- `largecap` - Large Cap funds
- `midcap` - Mid Cap funds
- `smallcap` - Small Cap funds
- `flexicap` - Flexi Cap funds
- `multicap` - Multi Cap funds
- `indexfund` - Index funds

**Debt:**

- `liquid` - Liquid funds
- `shortterm` - Short Term funds
- `corporatebond` - Corporate Bond funds
- `gilt` - Gilt funds
- `bankingpsu` - Banking & PSU funds
- `creditrisk` - Credit Risk funds

**Commodity:**

- `gold` - Gold funds
- `silver` - Silver funds
- `multicommodity` - Multi-commodity funds

---

## 🗄️ MongoDB Schema

```javascript
{
  "scheme_code": "string",          // Unique identifier
  "scheme_name": "string",          // Fund name
  "amc": "string",                  // Asset Management Company
  "category": "equity|debt|commodity",
  "subcategory": "largecap|midcap|gold|liquid|etc",
  "nav": Number,                    // Current NAV
  "nav_date": "YYYY-MM-DD",
  "aum": Number,                    // Assets Under Management
  "expense_ratio": Number,
  "fund_manager": {
    "name": "string",
    "experience": Number
  },
  "returns": {
    "oneday": Number,
    "onemonth": Number,
    "oneyear": Number,
    "threeyear": Number,
    "fiveyear": Number,
    "tenyear": Number
  },
  "holdings": [],
  "sectors": [],
  "last_updated": "ISODate"
}
```

### Indexes

```javascript
{ scheme_code: 1 }                  // Unique
{ category: 1 }                     // Required
{ subcategory: 1 }                  // Required
{ category: 1, subcategory: 1 }    // Compound
{ amc: 1 }
{ scheme_name: 'text' }            // Full-text search
```

---

## 🚀 Quick Start

### 1. Run Complete Setup

```bash
cd mutual-funds-backend
node scripts/master-setup.js
```

This will:

1. ✅ Add MongoDB indexes
2. ✅ Fetch 15,000+ funds from AMFI
3. ✅ Store in MongoDB with proper categorization
4. ✅ Verify database integrity
5. ✅ Initialize cron jobs

### 2. Verify Installation

```bash
node scripts/verify-funds.js
```

Expected output:

```
📈 TOTAL FUNDS: 15,234
✅ PASSED: Meets minimum requirement of 15,000

✅ EQUITY
   Count: 6,094 (Expected min: 6,000)
   Ratio: 40.0% (Target: 40%)

✅ DEBT
   Count: 5,332 (Expected min: 5,250)
   Ratio: 35.0% (Target: 35%)

✅ COMMODITY
   Count: 3,808 (Expected min: 3,750)
   Ratio: 25.0% (Target: 25%)
```

### 3. Start Backend Server

```bash
npm run dev
```

Server starts on: `http://localhost:3002`

---

## 🕐 Automatic Updates (Cron Jobs)

| Data Type            | Update Frequency               | Schedule           |
| -------------------- | ------------------------------ | ------------------ |
| **NAV**              | Every 1 hour                   | `0 * * * *`        |
| **Daily Returns**    | Daily at 6 PM IST              | `0 18 * * *`       |
| **Monthly Updates**  | 1st of month at 2 AM IST       | `0 2 1 * *`        |
| **Holdings/Sectors** | Quarterly (Jan, Apr, Jul, Oct) | `0 3 1 1,4,7,10 *` |
| **Fund Managers**    | Semi-annually (Jan, Jul)       | `0 4 1 1,7 *`      |
| **Market Indices**   | Every 5 minutes (9 AM-4 PM)    | `*/5 9-16 * * 1-5` |

---

## 🔌 API Endpoints

### Get Funds by Category

```bash
# Get all equity funds
GET /api/funds?category=equity

# Get large cap funds
GET /api/funds?category=equity&subcategory=largecap

# Get debt funds
GET /api/funds?category=debt&subcategory=liquid

# Get commodity funds
GET /api/funds?category=commodity&subcategory=gold
```

### Search Funds

```bash
GET /api/funds/search?q=hdfc
```

### Get Fund Details

```bash
GET /api/funds/:scheme_code
```

### Get Categories

```bash
GET /api/funds/categories
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "category": "equity",
      "count": 6094,
      "subcategories": ["largecap", "midcap", "smallcap", ...]
    },
    ...
  ]
}
```

### Market Indices

```bash
GET /api/market/indices
```

---

## 📝 Manual Operations

### Run Ingestion Only

```bash
node scripts/ingestion-engine.js
```

### Update NAV Manually

```bash
node jobs/update-nav.job.js
```

### Update Returns

```bash
node jobs/update-returns.job.js
```

### Add Indexes

```bash
node scripts/add-indexes.js
```

---

## 🔍 Database Queries

### Count by Category

```javascript
db.funds.countDocuments({ category: 'equity' });
db.funds.countDocuments({ category: 'debt' });
db.funds.countDocuments({ category: 'commodity' });
```

### Get Subcategory Distribution

```javascript
db.funds.aggregate([
  { $match: { category: 'equity' } },
  { $group: { _id: '$subcategory', count: { $sum: 1 } } },
  { $sort: { count: -1 } },
]);
```

### Find Specific Funds

```javascript
// Find all HDFC equity large cap funds
db.funds.find({
  category: 'equity',
  subcategory: 'largecap',
  amc: /hdfc/i,
});
```

---

## 🛠️ Troubleshooting

### Only 202 funds in database?

**Cause:** Old fetch script has pagination limits

**Fix:**

```bash
node scripts/ingestion-engine.js
```

### Categories not matching frontend?

**Issue:** Mixed case vs lowercase

**Fix:** The new system supports both:

- Old: `category: "Equity"`, `subCategory: "Large Cap"`
- New: `category: "equity"`, `subcategory: "largecap"`

API automatically handles both formats.

### Cron jobs not running?

**Check:**

```javascript
const cronScheduler = require('./cron/scheduler');
cronScheduler.getScheduleInfo();
```

---

## 📂 File Structure

```
mutual-funds-backend/
├── scripts/
│   ├── master-setup.js           # Complete setup
│   ├── ingestion-engine.js       # Fetch 15,000+ funds
│   ├── verify-funds.js           # Verify database
│   └── add-indexes.js            # Add MongoDB indexes
├── jobs/
│   ├── update-nav.job.js         # Hourly NAV updates
│   ├── update-returns.job.js     # Daily returns
│   ├── update-holdings.job.js    # Quarterly holdings
│   ├── update-managers.job.js    # Semi-annual managers
│   └── update-indices.job.js     # 5-min indices
├── cron/
│   └── scheduler.js              # Cron job scheduler
└── src/
    ├── models/
    │   └── Fund.model.js         # Fund schema
    └── controllers/
        └── fund.controller.js    # API controllers
```

---

## ✅ Success Criteria

After setup, verify:

- [x] MongoDB shows **15,000+ documents** in `funds` collection
- [x] **equity** >= 6,000 funds (40%)
- [x] **debt** >= 5,250 funds (35%)
- [x] **commodity** >= 3,750 funds (25%)
- [x] All subcategories populated
- [x] Indexes created
- [x] API endpoints working
- [x] Cron jobs scheduled

---

## 🎯 Frontend Integration

Frontend should **NEVER** fetch from AMFI directly. Always use backend API:

```typescript
// ❌ WRONG
fetch('https://www.amfiindia.com/spages/NAVAll.txt');

// ✅ CORRECT
fetch('http://localhost:3002/api/funds?category=equity&subcategory=largecap');
```

---

## 📞 Support

Run verification anytime:

```bash
node scripts/verify-funds.js
```

Re-run setup if needed:

```bash
node scripts/master-setup.js
```

---

## 🔄 Update Workflow

1. **Hourly:** NAV updates automatically
2. **Daily:** Returns calculated at 6 PM IST
3. **Monthly:** AUM, expense ratio updated
4. **Quarterly:** Holdings and sectors refreshed
5. **Semi-annually:** Fund manager information updated

All handled automatically by cron jobs!

---

**🎉 Your 15,000+ fund system is ready!**
