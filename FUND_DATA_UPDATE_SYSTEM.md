# Fund Data Update System

## Overview

This system manages two types of data with different update frequencies:

### 1. **STATIC/SEMI-STATIC DATA** (Updates: 3-6 months)

- Fund House Name
- Fund Category & Subcategory
- Scheme Type
- Investment Objective
- Sector Allocations
- Portfolio Holdings
- Fund Manager Details
- Minimum Investment Amounts
- Exit Load Rules

**Storage:** Main `funds` collection
**Update Method:** Manual import from AMFI/fund house websites

---

### 2. **DYNAMIC DATA** (Updates: Real-time/Daily)

#### A. Daily Updates (After Market Close - 6:00 PM IST)

- **NAV (Net Asset Value)**
- **1-Day Returns**
- **1-Week Returns**
- **1-Month Returns**
- **3-Month Returns**
- **6-Month Returns**
- **1-Year Returns**
- **3-Year Returns**
- **5-Year Returns**

**Source:** MFAPI (https://api.mfapi.in)
**Update Frequency:** Daily at 6:00 PM IST (Mon-Fri)
**Script:** `run-update-returns.js`

#### B. Intra-day Updates (During Market Hours)

- **Real-time NAV** (for select popular funds)
- **Quick returns refresh**

**Update Frequency:** Every hour during market hours (9:15 AM - 3:30 PM IST)
**Scope:** Top 100 most popular funds

#### C. Market Indices (Every 2 Hours)

- **NIFTY 50, SENSEX, BANK NIFTY, etc.**
- Current value, change %, high, low
- Only updates during market hours
- Shows last closed value when market is closed

**Update Frequency:** Every 2 hours during market hours (Mon-Fri)
**Script:** Auto-runs via `scheduled-tasks.service.js`

---

## Scripts & Services

### Manual Update Scripts

#### 1. **run-update-returns.js** - Fetch Fund Returns Data

Update NAV and returns for funds:

```bash
# Test with 2 funds
node run-update-returns.js 2

# Update first 50 funds
node run-update-returns.js 50

# Update all funds (takes 4-5 hours)
node run-update-returns.js

# Skip funds that already have returns data
node run-update-returns.js 500 --skip-existing
```

**Time Estimates:**

- 2 funds: ~30 seconds
- 50 funds: ~2-3 minutes
- 500 funds: ~20-25 minutes
- 2000 funds: ~1-1.5 hours
- ALL 14,200 funds: ~4-5 hours

#### 2. **update-returns.ps1** - Interactive Update Manager

PowerShell script with menu:

```powershell
.\update-returns.ps1
```

Options:

1. Quick Test (2 funds)
2. Small Batch (50 funds)
3. Medium Batch (500 funds)
4. Large Batch (2000 funds)
5. Full Update (ALL funds)

---

### Automated Scheduled Tasks

All tasks run automatically when backend server starts.

**File:** `services/scheduled-tasks.service.js`

#### Schedule:

| Task                | Frequency     | Time (IST)        | Days    |
| ------------------- | ------------- | ----------------- | ------- |
| Market Indices      | Every 2 hours | Market hours only | Mon-Fri |
| Fund Returns (Main) | Daily         | 6:00 PM           | Mon-Fri |
| Quick NAV Update    | Hourly        | Market hours only | Mon-Fri |

#### Market Hours:

- **Open:** 9:15 AM IST
- **Close:** 3:30 PM IST
- **Trading Days:** Monday - Friday

---

## Usage Guide

### First Time Setup

1. **Install Dependencies:**

```bash
cd c:\MF root folder\mutual-funds-backend
npm install
```

2. **Initial Data Fetch (IMPORTANT!):**

Run small test first:

```bash
node run-update-returns.js 10
```

If successful, run full update (takes 4-5 hours):

```bash
node run-update-returns.js
```

**Recommended:** Run overnight or during non-peak hours.

3. **Start Backend with Auto-Updates:**

```bash
npm start
```

The scheduled tasks will start automatically!

---

### Daily Operations

Once initial data is loaded:

1. **Backend runs automatically** - Just keep it running
2. **Scheduled tasks handle everything:**
   - Market indices update every 2 hours
   - Fund NAV updates daily at 6 PM
   - Quick updates every hour for popular funds

3. **Manual updates (if needed):**

```bash
# Update specific number of funds
node run-update-returns.js 100

# Or use interactive menu
.\update-returns.ps1
```

---

## Data Flow

```
┌─────────────────────────────────────────────────┐
│           MFAPI (External Source)               │
│        https://api.mfapi.in/mf/:schemeCode      │
└───────────────────┬─────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────────┐
│      fetch-fund-returns.service.js              │
│  - Fetches NAV history                          │
│  - Calculates returns (1D, 1W, 1M, etc.)        │
│  - Batch processing (10 funds at a time)        │
└───────────────────┬─────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────────┐
│           MongoDB - funds collection            │
│  Updates:                                       │
│  - currentNav                                   │
│  - nav.value, nav.date                          │
│  - returns.1Y, returns.3Y, returns.5Y           │
│  - metadata.lastUpdated                         │
└───────────────────┬─────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────────┐
│              Redis Cache (Optional)             │
│  Stores recent queries for fast access          │
└───────────────────┬─────────────────────────────┘
                    │
                    ↓
┌─────────────────────────────────────────────────┐
│           Frontend API Response                 │
│  Returns formatted fund data with:              │
│  - Name, NAV, Returns, AUM, Ratings             │
└─────────────────────────────────────────────────┘
```

---

## Troubleshooting

### Issue: Returns showing 0.00%

**Cause:** Fund data not yet fetched from MFAPI

**Solution:** Run update script:

```bash
node run-update-returns.js 100
```

---

### Issue: Updates not running automatically

**Cause:** Scheduled tasks not started

**Solution:** Restart backend server:

```bash
# Stop current server
Ctrl+C

# Start again
npm start
```

Check console for:

```
✅ Scheduled: Market Indices Update (Every 2 hours, Mon-Fri)
✅ Scheduled: Fund Returns Update (6:00 PM daily, Mon-Fri)
✅ Scheduled: Quick NAV Update (Every hour during market, Mon-Fri)
```

---

### Issue: Market indices not updating

**Cause:** Market is closed OR scheduled task not running

**Check:**

1. Is market open? (9:15 AM - 3:30 PM IST, Mon-Fri)
2. Is backend server running?
3. Check console logs for "Market is CLOSED" message

---

### Issue: Updates taking too long

**Cause:** Processing large number of funds

**Solutions:**

1. Use smaller batches: `node run-update-returns.js 100`
2. Run during off-peak hours
3. Use `--skip-existing` flag to only update new funds

---

## Monitoring

### Check Last Update Time

```javascript
// In MongoDB
db.funds.findOne(
  { subCategory: 'midcap' },
  { name: 1, 'metadata.lastUpdated': 1, returns: 1 }
);
```

### Check Update Statistics

```bash
# Run this to see status
node -e "
const mongoose = require('mongoose');
require('dotenv').config();
const Fund = require('./src/models/Fund.model');

mongoose.connect(process.env.DATABASE_URL).then(async () => {
  const withReturns = await Fund.countDocuments({ 'returns.1Y': { \$exists: true, \$ne: null } });
  const total = await Fund.countDocuments({ status: 'Active' });
  console.log(\`Funds with returns: \${withReturns}/\${total}\`);
  process.exit(0);
});
"
```

---

## Performance Tips

1. **First run:** Do overnight (4-5 hours for all 14,200 funds)
2. **Daily runs:** Only take 20-30 minutes (automated)
3. **Cache:** Redis reduces database load
4. **Rate limiting:** Built-in delays prevent API throttling

---

## API Rate Limits

**MFAPI:**

- No official limits documented
- Service uses 2-second delays between batches
- Processes 10 funds at a time
- Total time: ~2 seconds per fund

**Safety measures:**

- Batch processing
- Error handling
- Retry logic
- Timeout protection (10 seconds per request)

---

## File Structure

```
mutual-funds-backend/
├── services/
│   ├── fetch-fund-returns.service.js    # Main returns fetching service
│   └── scheduled-tasks.service.js       # Auto-update scheduler
├── run-update-returns.js                # Manual update script
├── update-returns.ps1                   # Interactive PowerShell menu
└── FUND_DATA_UPDATE_SYSTEM.md           # This file
```

---

## Next Steps

1. ✅ Run initial update: `node run-update-returns.js 100` (test)
2. ✅ If successful, run full update: `node run-update-returns.js`
3. ✅ Start backend: `npm start`
4. ✅ Verify scheduled tasks are active (check console)
5. ✅ Test frontend to see returns data
6. ✅ Let system run - updates happen automatically!

---

## Support

If issues persist:

1. Check backend console logs
2. Verify MongoDB connection
3. Test MFAPI manually: `curl https://api.mfapi.in/mf/119551`
4. Check Redis connection (optional)
5. Restart backend server

---

**Last Updated:** January 1, 2026
**Version:** 1.0.0
