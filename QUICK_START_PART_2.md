# PART 2: Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide helps you test and use the PART 2 features: Rankings, Data Governance, and Mobile-Optimized APIs.

---

## Prerequisites

✅ PART 1 completed (2,500+ funds loaded)  
✅ Server running: `npm run dev`  
✅ MongoDB connected

---

## 1. Test Rankings API

### Get Top 20 Funds (All Categories)

```bash
curl http://localhost:3002/api/rankings/top?limit=20
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Top 20 funds retrieved successfully",
  "data": [
    {
      "fundId": "INF200K01VN3",
      "name": "HDFC Flexi Cap Fund - Direct - Growth",
      "rank": 1,
      "returns": { "1Y": 28.5, "3Y": 22.3 },
      "score": 92,
      "aum": 12500,
      "category": "equity",
      "schemeType": "direct",
      "fundHouse": "HDFC Mutual Fund"
    }
    // ... 19 more funds
  ],
  "metadata": {
    "count": 20,
    "methodology": "Composite score: 50% returns, 30% risk-adjusted, 20% consistency"
  }
}
```

### Get Top 10 Equity Funds

```bash
curl http://localhost:3002/api/rankings/category/equity?limit=10
```

### Get Detailed Rankings (Expandable Data)

```bash
curl "http://localhost:3002/api/rankings/top?limit=5&details=true"
```

**Notice:** Response includes `details` object with full returns, risk metrics, manager info, and costs.

---

## 2. Test Mobile-Optimized Responses

### Summary Mode (Default - ~2KB per fund)

```bash
curl http://localhost:3002/api/rankings/top?limit=5
```

**Payload Size:** ~10KB for 5 funds

### Details Mode (~5KB per fund)

```bash
curl "http://localhost:3002/api/rankings/top?limit=5&details=true"
```

**Payload Size:** ~25KB for 5 funds

**Use Case:**

- Summary: Initial load, mobile dashboard, scrolling lists
- Details: User taps to expand, detail page

---

## 3. Test Risk-Adjusted Rankings

### Top 50 by Sharpe/Sortino Ratio

```bash
curl http://localhost:3002/api/rankings/risk-adjusted?limit=50
```

### Risk-Adjusted Equity Funds Only

```bash
curl "http://localhost:3002/api/rankings/risk-adjusted?limit=20&category=equity"
```

---

## 4. Test Rolling Return Rankings

### 3-Year Rolling Returns

```bash
curl http://localhost:3002/api/rankings/rolling/3y?limit=100
```

### 5-Year Rolling Returns (Equity Only)

```bash
curl "http://localhost:3002/api/rankings/rolling/5y?limit=50&category=equity"
```

---

## 5. Test Dashboard View

### All Category Leaders (Mobile Dashboard)

```bash
curl http://localhost:3002/api/rankings/all-categories?limit=5
```

**Response:** Top 5 funds from each of the 9 SEBI categories in one API call.

**Use Case:** Home screen dashboard showing category leaders.

---

## 6. Test Data Governance

### Validate Specific Fund

```bash
curl http://localhost:3002/api/governance/validate/INF200K01VN3
```

**Response:**

```json
{
  "fundId": "INF200K01VN3",
  "fundName": "HDFC Flexi Cap Fund",
  "isValid": true,
  "confidence": 95,
  "issues": [],
  "lastValidated": "2025-12-20T10:00:00.000Z"
}
```

### Check Freshness Report

```bash
curl http://localhost:3002/api/governance/freshness
```

Returns funds with stale data (NAV >7 days old, AUM >60 days old).

---

## 7. Understand Caching

### First Request (Uncached - ~5 seconds)

```bash
time curl http://localhost:3002/api/rankings/top?limit=100
```

### Second Request (Cached - <100ms)

```bash
time curl http://localhost:3002/api/rankings/top?limit=100
```

**Cache TTL:** 6 hours

### Clear Cache (Admin Operation)

```bash
curl -X POST http://localhost:3002/api/rankings/refresh
```

---

## 8. Test Filtering Options

### Direct Plans Only

```bash
curl "http://localhost:3002/api/rankings/top?limit=20&schemeType=direct"
```

### High AUM Funds (>1000 crores)

```bash
curl "http://localhost:3002/api/rankings/top?limit=20&minAUM=1000"
```

### Category + Scheme Type

```bash
curl "http://localhost:3002/api/rankings/top?limit=20&category=equity&schemeType=direct"
```

---

## 9. Scheduled Jobs

### View Cron Job Logs

Background jobs run automatically:

1. **Daily Ranking Recalculation** (1:00 AM IST)
   - Clears cache
   - Pre-calculates top 20/50/100
   - Calculates all category leaders
   - Warms cache for next day

2. **Weekly Data Governance** (Sunday 2:00 AM IST)
   - Validates all funds
   - Generates freshness report
   - Auto-hides incomplete funds (Zero-NA policy)

3. **Hourly Cache Refresh**
   - Refreshes most-accessed rankings
   - Keeps mobile dashboard data fresh

**Check Logs:**

```bash
# Look for [CRON] prefixed logs
npm run dev
```

---

## 10. Common Use Cases

### Use Case 1: Mobile Dashboard

**Goal:** Show top 5 funds from each category

```bash
curl http://localhost:3002/api/rankings/all-categories?limit=5
```

**Frontend Implementation:**

```jsx
// React example
const Dashboard = () => {
  const { data } = useSWR('/api/rankings/all-categories?limit=5');

  return (
    <div>
      {Object.entries(data.data).map(([category, funds]) => (
        <CategorySection key={category} category={category} funds={funds} />
      ))}
    </div>
  );
};
```

### Use Case 2: Fund Listing with Sort

**Goal:** User selects sort option

```bash
# Sort by overall score
curl http://localhost:3002/api/rankings/top?limit=50

# Sort by risk-adjusted
curl http://localhost:3002/api/rankings/risk-adjusted?limit=50

# Sort by 3Y returns
curl http://localhost:3002/api/rankings/rolling/3y?limit=50
```

### Use Case 3: Category Filtering

**Goal:** User selects "Equity" category

```bash
curl http://localhost:3002/api/rankings/category/equity?limit=20
```

**Then sub-category:**

```bash
curl http://localhost:3002/api/rankings/subcategory/equity/large_cap?limit=10
```

### Use Case 4: Fund Detail Expansion

**Goal:** User taps fund card to see details

```bash
# Initial load (summary)
curl http://localhost:3002/api/rankings/top?limit=1

# User taps → Fetch details
curl "http://localhost:3002/api/rankings/top?limit=1&details=true"
```

---

## 11. Performance Benchmarks

### Expected Response Times

| Endpoint           | Cached | Uncached |
| ------------------ | ------ | -------- |
| Top 20             | <50ms  | <500ms   |
| Top 100            | <100ms | <5s      |
| Category Leaders   | <50ms  | <300ms   |
| Risk-Adjusted (50) | <80ms  | <2s      |
| All Categories     | <200ms | <8s      |

### Payload Sizes

| Mode    | Per Fund | 20 Funds | 100 Funds |
| ------- | -------- | -------- | --------- |
| Summary | ~2KB     | ~40KB    | ~200KB    |
| Details | ~5KB     | ~100KB   | ~500KB    |

---

## 12. Error Handling Examples

### No Funds Match Criteria

```bash
curl "http://localhost:3002/api/rankings/top?limit=20&minAUM=100000"
```

**Response:**

```json
{
  "success": true,
  "message": "No funds match the criteria",
  "data": [],
  "metadata": {
    "criteria": { "limit": 20, "minAUM": 100000 },
    "suggestion": "Try relaxing filters or selecting different category"
  }
}
```

### Invalid Category

```bash
curl http://localhost:3002/api/rankings/category/invalid_category
```

**Response:**

```json
{
  "success": false,
  "message": "Invalid category",
  "validCategories": ["equity", "debt", "hybrid", ...]
}
```

---

## 13. Testing Checklist

### Core Functionality

- [ ] Top 20/50/100 funds return valid data
- [ ] Category leaders work for all 9 categories
- [ ] Risk-adjusted rankings sort correctly
- [ ] Rolling returns (2Y/3Y/5Y) work
- [ ] Dashboard view returns all categories

### Mobile Optimization

- [ ] Summary mode is default
- [ ] Details mode returns expanded data
- [ ] Payload sizes match expectations
- [ ] Response times are acceptable

### Data Quality

- [ ] Only funds with completeness ≥70 appear
- [ ] All returned funds have isPubliclyVisible: true
- [ ] Returns are within reasonable ranges
- [ ] AUM and manager info present

### Caching

- [ ] Second request is significantly faster
- [ ] Cache persists for 6 hours
- [ ] Cache refresh clears all cached rankings

---

## 14. Troubleshooting

### Issue: "Ranking service not initialized"

**Solution:**

```bash
# Check server logs for:
# ✅ Ranking and data governance services initialized
```

If not present, verify server initialization in `server-simple.ts`.

### Issue: Empty rankings

**Cause:** No funds with completeness ≥70 or AUM ≥100 crores

**Solution:**

```bash
# Run AMFI import to load funds
npm run import:comprehensive-amfi
```

### Issue: Slow rankings (>10s)

**Cause:** Large result set, no cache

**Solution:**

- Reduce limit parameter
- Wait for cache warming (runs at 1:00 AM daily)
- Or manually warm cache:
  ```bash
  curl http://localhost:3002/api/rankings/top?limit=20
  curl http://localhost:3002/api/rankings/top?limit=50
  curl http://localhost:3002/api/rankings/top?limit=100
  ```

---

## 15. Next Steps

1. ✅ Test all ranking endpoints
2. ✅ Verify mobile payload optimization
3. ✅ Check data governance reports
4. ✅ Monitor cache performance
5. ⏭️ Integrate with frontend
6. ⏭️ Deploy to production
7. ⏭️ Monitor real-world usage

---

## API Endpoints Summary

```
# Rankings
GET  /api/rankings/top
GET  /api/rankings/category/:category
GET  /api/rankings/subcategory/:category/:subcategory
GET  /api/rankings/risk-adjusted
GET  /api/rankings/rolling/:period
GET  /api/rankings/all-categories
POST /api/rankings/refresh

# Data Governance
GET  /api/governance/validate/:fundId
GET  /api/governance/validate-all
GET  /api/governance/outliers/:category
GET  /api/governance/freshness
POST /api/governance/auto-hide

# Market Indices (from PART 1)
GET  /api/market-indices
GET  /api/market-indices/:indexId
POST /api/market-indices/refresh

# News (from PART 1)
GET  /api/news
GET  /api/news/category/:category
GET  /api/news/search
POST /api/news/refresh
```

---

**Ready to build the frontend!** 🎉

For detailed implementation, see [PART_2_IMPLEMENTATION_COMPLETE.md](./PART_2_IMPLEMENTATION_COMPLETE.md)
