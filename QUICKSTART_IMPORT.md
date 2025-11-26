# Quick Start: Fund Data Import 🚀

## Prerequisites

1. ✅ MongoDB running (local or remote)
2. ✅ Internet connection (for fetching data)
3. ✅ Node.js 18+ installed

## Step 1: Connect to Database

Make sure your `.env` file has the MongoDB connection:

```env
DATABASE_URL=mongodb://localhost:27017/mutual_funds_db
```

## Step 2: Run Initial Import

```bash
cd mutual-funds-backend

# Import all funds (150 total: 50 ETFs + 100 Mutual Funds)
npm run import:all
```

This will take **5-10 minutes** and import:

- ✅ 50 ETFs (Indian + US)
- ✅ 100 Mutual Funds (Indian)
- ✅ 40+ Fund Managers
- ✅ Latest NAV data

## Step 3: Import Historical Prices (Optional)

```bash
# Import 1-year history for popular funds
npm run import:prices -- SPY QQQ NIFTYBEES.NS GOLDBEES.NS
```

## Step 4: Verify Import

Check MongoDB:

```javascript
// Connect to MongoDB shell
mongosh

use mutual_funds_db

// Check counts
db.funds.countDocuments()        // Should be ~150
db.fundManagers.countDocuments() // Should be ~40-45
db.fundPrices.countDocuments()   // Varies (if history imported)

// Sample fund
db.funds.findOne({ fundId: 'SPY' })

// Sample manager
db.fundManagers.findOne()
```

## Step 5: Test API (if backend is running)

```bash
# Get all funds
curl http://localhost:3001/api/funds | jq

# Get specific fund
curl http://localhost:3001/api/funds/SPY | jq

# Get fund managers
curl http://localhost:3001/api/fund-managers | jq
```

## Daily Updates (Automated)

Add to `src/index.ts`:

```typescript
import { navUpdateScheduler } from './services/schedulers/nav-update.scheduler';

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  navUpdateScheduler.start(); // 👈 Add this line
});
```

This will automatically:

- Update NAVs daily at 6 PM IST
- Import price history weekly
- Calculate statistics daily at 7 PM IST

## Manual Updates

```bash
# Update all NAVs manually
npm run import:update-navs
```

## Sample Data Preview

After import, you'll have:

### 🇮🇳 Indian ETFs

- NIFTYBEES.NS (Nifty 50)
- BANKBEES.NS (Bank Nifty)
- GOLDBEES.NS (Gold)
- JUNIORBEES.NS (Nifty Next 50)

### 🇺🇸 US ETFs

- SPY (S&P 500)
- QQQ (Nasdaq-100)
- GLD (Gold)
- ARKK (Innovation)

### 📊 Mutual Funds

- HDFC Top 100 Fund
- ICICI Prudential Bluechip
- SBI Large Cap Fund
- Axis Mid Cap Fund

### 👥 Fund Managers

- Prashant Jain (HDFC)
- S. Naren (ICICI Prudential)
- Rajeev Thakkar (PPFAS)

## Troubleshooting

**Import taking too long?**

- Reduce limits: `npm run import:funds -- --etfs=20 --mutual-funds=30`

**Network errors?**

- Check internet connection
- Try again after a few minutes
- Yahoo Finance might have rate limits

**No data in DB?**

- Check MongoDB connection
- Check logs for errors
- Verify DATABASE_URL in .env

**Need more funds?**

- Edit `yahoo-finance.importer.ts` to add more symbols
- Increase limits in import command

## What's Next?

1. ✅ Build frontend components using this data
2. ✅ Create fund comparison features
3. ✅ Add portfolio tracking
4. ✅ Implement watchlist functionality
5. ✅ Enable price alerts

All the models and APIs are ready to use! 🎉
