# QUICK START GUIDE - Part 1 Implementation

## 🚀 Getting Started

### 1. Prerequisites

- Node.js >= 18.0.0
- MongoDB (local or Atlas)
- NPM packages installed

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Ensure `.env` has:

```env
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/mutual_funds_db
NODE_ENV=production
PORT=8000
```

### 4. Run Comprehensive Fund Import

#### Option A: Import All Funds (2,500-3,000 funds)

```bash
npm run import:comprehensive-amfi
```

**Expected Output:**

```
╔════════════════════════════════════════════════════════════════╗
║   COMPREHENSIVE AMFI IMPORT - Indian Mutual Fund Universe     ║
║   Target: 2,500-3,000 funds from all SEBI-registered AMCs     ║
╚════════════════════════════════════════════════════════════════╝

✅ Connected to MongoDB
🚀 Starting import...
📄 Parsed 2,847 raw fund entries
✅ Import completed successfully
➕ Added: 2,683 funds
🔄 Updated: 164 funds
⏭️  Skipped: 0 funds

📈 DATABASE STATISTICS
═══════════════════════
Total Funds: 2,847
Publicly Visible (Zero-NA): 2,683
Hidden (Incomplete Data): 164

📊 VISIBLE FUNDS BY CATEGORY
═══════════════════════════════
EQUITY              : 1,245 funds
DEBT                : 892 funds
HYBRID              : 378 funds
ELSS                : 45 funds
COMMODITY           : 78 funds
INDEX               : 32 funds
ETF                 : 13 funds
```

#### Option B: Test Import (100 funds)

```bash
npm run import:comprehensive-amfi:test
```

#### Option C: Import Specific AMC

```bash
tsx src/scripts/import-comprehensive-amfi.ts --amc="HDFC Mutual Fund"
```

### 5. Start Server

```bash
npm run dev
# or
npm start
```

### 6. Test API Endpoints

#### Funds API (Zero-NA Policy Enforced)

```bash
# Get all visible funds
curl http://localhost:8000/api/funds

# Get equity funds
curl http://localhost:8000/api/funds?category=equity&limit=50

# Get large cap funds
curl http://localhost:8000/api/funds?subCategory=Large%20Cap

# Search funds
curl http://localhost:8000/api/funds?q=HDFC
```

#### Market Indices API

```bash
# Get all indices
curl http://localhost:8000/api/market-indices

# Response:
{
  "success": true,
  "data": [
    {
      "indexId": "NIFTY_50",
      "name": "Nifty 50",
      "currentValue": 21450.50,
      "change": 70.25,
      "changePercent": 0.33,
      "marketStatus": "open",
      "sanityCheckPassed": true,
      "staleness": 2
    },
    ...
  ]
}
```

#### News API

```bash
# Get latest verified news
curl http://localhost:8000/api/news

# Get mutual fund news
curl http://localhost:8000/api/news/category/mutual_fund

# Search news
curl "http://localhost:8000/api/news/search?q=SEBI"
```

---

## 📊 Data Quality Verification

### Check Fund Completeness

```bash
# Connect to MongoDB
mongosh "mongodb+srv://..."

# Switch to database
use mutual_funds_db

# Check statistics
db.funds.countDocuments()
db.funds.countDocuments({ isPubliclyVisible: true })

# Check completeness distribution
db.funds.aggregate([
  {
    $group: {
      _id: {
        $switch: {
          branches: [
            { case: { $gte: ["$dataCompleteness.completenessScore", 90] }, then: "90-100%" },
            { case: { $gte: ["$dataCompleteness.completenessScore", 80] }, then: "80-90%" },
            { case: { $gte: ["$dataCompleteness.completenessScore", 60] }, then: "60-80%" },
            { case: { $gte: ["$dataCompleteness.completenessScore", 40] }, then: "40-60%" }
          ],
          default: "0-40%"
        }
      },
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
])

# Check category distribution
db.funds.aggregate([
  { $match: { isPubliclyVisible: true } },
  { $group: { _id: "$category", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
```

---

## 🔄 Scheduled Jobs (Recommended)

### 1. Daily AMFI Import (Refresh NAVs)

Add to cron or scheduler:

```bash
# Run daily at 8 PM IST (after market close)
0 20 * * * cd /path/to/backend && npm run import:comprehensive-amfi
```

### 2. Market Indices Refresh

```bash
# Every 5 minutes during market hours
*/5 9-15 * * 1-5 curl -X POST http://localhost:8000/api/market-indices/refresh
```

### 3. News Aggregation

```bash
# Every hour
0 * * * * curl -X POST http://localhost:8000/api/news/refresh
```

---

## 🐛 Troubleshooting

### Issue: Import fails with network timeout

**Solution:**

```bash
# Increase timeout in comprehensive-amfi.importer.ts
timeout: 120000  # 2 minutes
```

### Issue: Zero funds are visible

**Cause:** All funds have completenessScore < 60
**Solution:** Run data enrichment (Part 2) or manually adjust threshold:

```typescript
// In Fund.model.ts
query['dataCompleteness.completenessScore'] = { $gte: 30 }; // Lower threshold temporarily
```

### Issue: Market indices show stale data

**Solution:**

```bash
# Manually refresh
curl -X POST http://localhost:8000/api/market-indices/refresh

# Check staleness
curl http://localhost:8000/api/market-indices | jq '.data[].staleness'
```

### Issue: News not showing

**Solution:**

```bash
# Manually trigger refresh
curl -X POST http://localhost:8000/api/news/refresh

# Check sources
curl http://localhost:8000/api/news | jq '.data[].source' | sort | uniq -c
```

---

## 📈 Performance Optimization

### 1. MongoDB Indexes

Indexes are automatically created. Verify:

```bash
mongosh "mongodb+srv://..."
use mutual_funds_db
db.funds.getIndexes()
db.marketIndices.getIndexes()
db.news.getIndexes()
```

### 2. Cache Configuration

Set up Redis caching (optional):

```env
REDIS_URL=redis://localhost:6379
CACHE_TTL=300  # 5 minutes
```

### 3. API Rate Limiting

Already configured in `src/middleware/rateLimit.ts`:

- Public endpoints: 100 requests/15 minutes
- Authenticated: 1000 requests/15 minutes

---

## 🎯 Success Metrics

After import, you should have:

✅ **2,500-3,000 total funds**  
✅ **60-80% publicly visible** (completenessScore >= 60)  
✅ **All 9 SEBI categories** represented  
✅ **40+ AMCs** covered  
✅ **Market indices** updating every 5 minutes  
✅ **News articles** from 5 verified sources

---

## 🚀 What's Next?

With Part 1 complete, you can now:

1. **Browse complete fund universe** via APIs
2. **View real-time market data** (NIFTY, SENSEX, etc.)
3. **Read verified news** (no promotional content)
4. **Filter by SEBI categories** (Equity, Debt, ELSS, etc.)
5. **Zero-NA experience** (only complete data shown)

**Ready for Part 2:** User features, portfolio tracking, recommendations!

---

## 📞 Support Commands

```bash
# Check import logs
npm run import:comprehensive-amfi 2>&1 | tee import.log

# Validate fund data
mongosh --eval "db.funds.findOne({ isPubliclyVisible: true })" mutual_funds_db

# Test API health
curl http://localhost:8000/health

# Check server logs
npm run dev | grep ERROR
```

---

**Status:** ✅ Part 1 Implementation COMPLETE  
**Data Quality:** Production-Ready with Zero-NA Policy  
**Next:** Part 2 - User Features & Portfolio Management
