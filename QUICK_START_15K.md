# Quick Start - 15,000+ Funds System

## 🚀 One-Command Setup (Windows)

```bash
quick-start.bat
```

Or manually:

```bash
npm install
node scripts/master-setup.js
```

## 📊 What Gets Set Up

1. **MongoDB Indexes** - Performance optimization
2. **15,000+ Funds Ingestion** - Fetches all funds from AMFI
3. **Database Verification** - Validates proper distribution
4. **Cron Jobs** - Automatic updates

## ✅ Expected Results

- **Total Funds**: 15,000+
- **Equity**: ~40% (6,000+ funds)
  - largecap, midcap, smallcap, flexicap, multicap, indexfund
- **Debt**: ~35% (5,250+ funds)
  - liquid, shortterm, corporatebond, gilt, bankingpsu, creditrisk
- **Commodity**: ~25% (3,750+ funds)
  - gold, silver, multicommodity

## 🔄 Automatic Updates

Once set up, the system automatically updates:

- **NAV**: Every hour (0 \* \* \* \*)
- **Returns**: Daily at 6 PM (0 18 \* \* \*)
- **Holdings**: Quarterly (0 0 1 _/3 _)
- **Fund Managers**: Semi-annually (0 0 1 1,7 \*)
- **Market Indices**: Every 5 minutes during trading hours (_/5 9-16 _ \* 1-5)

## 🛠️ Available Commands

### Setup & Verification

```bash
npm run setup:15k        # Run complete setup
npm run ingest:funds     # Fetch all funds from AMFI
npm run verify:15k       # Verify 15,000+ funds
npm run indexes:add      # Add MongoDB indexes
```

### Manual Updates

```bash
npm run update:nav       # Update all NAVs
npm run update:returns   # Update all returns
```

### Development

```bash
npm run dev             # Start backend server
cd ../mutual fund && npm run dev  # Start frontend
```

## 📋 Verification Steps

1. **Check Total Funds**:

   ```bash
   npm run verify:15k
   ```

2. **Check MongoDB**:
   - Open MongoDB Atlas
   - Navigate to mutualfunds database → funds collection
   - Should see 15,000+ documents

3. **Test API Endpoints**:

   ```bash
   curl http://localhost:5000/api/funds/equity
   curl http://localhost:5000/api/funds/debt
   curl http://localhost:5000/api/funds/commodity
   ```

4. **Test Frontend**:
   - Visit http://localhost:3000/equity
   - Should see 100 funds initially
   - Click "Load Next 100" to see more
   - Fund cards should link to /equity/{schemeCode}

## 🔍 Troubleshooting

### Issue: Still seeing only 200-500 funds

**Solution**: The old seed scripts had pagination limits. Use the new ingestion engine:

```bash
npm run ingest:funds
```

### Issue: Fund detail pages show 404

**Solution**: Frontend now uses `schemeCode` instead of `id`. Already fixed in latest code.

### Issue: Market indices not updating

**Solution**: Changed from 2-hour to 5-minute refresh. Already fixed in latest code.

### Issue: Cron jobs not running

**Check**:

1. Ensure `node-cron` is installed: `npm install`
2. Cron jobs initialize when backend starts
3. Check logs for cron execution messages

## 📂 Key Files

- **scripts/ingestion-engine.js** - Fetches ALL funds (no limits)
- **scripts/verify-funds.js** - Validates database
- **scripts/master-setup.js** - Orchestrates setup
- **cron/scheduler.js** - Manages all cron jobs
- **jobs/\*.job.js** - Individual update jobs

## 🎯 Next Steps

1. ✅ Run `quick-start.bat` or `npm run setup:15k`
2. ✅ Verify with `npm run verify:15k`
3. ✅ Start backend: `npm run dev`
4. ✅ Start frontend: `cd ../mutual fund && npm run dev`
5. ✅ Visit http://localhost:3000/equity

## 🔒 Production Deployment

When deploying to production:

1. **Environment Variables**: Set `MONGODB_URI` in your hosting platform
2. **Cron Jobs**: The scheduler initializes automatically when backend starts
3. **Initial Setup**: Run `npm run setup:15k` once after deployment
4. **Verification**: Monitor `npm run verify:15k` to ensure 15,000+ funds

## 📊 MongoDB Schema

```javascript
{
  scheme_code: String,  // Unique identifier
  scheme_name: String,  // Fund name
  category: String,     // equity, debt, commodity (lowercase)
  subcategory: String,  // largecap, liquid, gold, etc. (lowercase)
  nav: Number,
  date: Date,
  returns_1y: Number,
  returns_3y: Number,
  returns_5y: Number,
  aum: Number,
  expense_ratio: Number,
  fund_managers: [String],
  holdings: Array,
  last_updated: Date
}
```

## 🏗️ Architecture

```
Backend (Node.js/Express)
├── scripts/
│   ├── ingestion-engine.js      // Unlimited AMFI fetching
│   ├── master-setup.js          // Setup orchestration
│   ├── verify-funds.js          // Database validation
│   └── add-indexes.js           // MongoDB indexes
├── cron/
│   └── scheduler.js             // Cron job manager
├── jobs/
│   ├── update-nav.job.js        // Hourly NAV updates
│   ├── update-returns.job.js    // Daily returns updates
│   ├── update-holdings.job.js   // Quarterly holdings updates
│   ├── update-managers.job.js   // Semi-annual manager updates
│   └── update-indices.job.js    // 5-minute market indices
└── src/
    ├── models/Fund.model.js     // Mongoose schema
    └── controllers/fund.controller.js  // API endpoints

Frontend (Next.js/React)
├── app/
│   ├── equity/page.tsx          // Equity funds with pagination
│   ├── debt/page.tsx            // Debt funds with pagination
│   └── commodity/page.tsx       // Commodity funds with pagination
└── components/
    ├── fund-card.tsx            // Fund card (uses schemeCode)
    ├── fund-list.tsx            // Fund list with pagination
    └── market-indices.tsx       // 5-minute refresh
```

## 💡 Key Improvements

1. **Unlimited Fetching**: Loops until API returns empty, no hard limits
2. **BulkWrite with Upsert**: Prevents overwrites, handles 15,000+ efficiently
3. **Lowercase Normalization**: Consistent category naming throughout
4. **Backward Compatibility**: API supports both old and new naming conventions
5. **Progressive Loading**: Frontend shows 100 funds initially, "Load Next 100" button
6. **Real-time Updates**: Market indices refresh every 5 minutes during trading hours
7. **Proper Indexing**: MongoDB indexes on scheme_code, category, subcategory

---

**System Ready**: Your mutual fund platform is now equipped to handle 15,000+ funds with automatic updates and production-ready architecture! 🎉
