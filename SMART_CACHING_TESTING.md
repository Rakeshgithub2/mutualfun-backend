# 🧪 SMART CACHING SYSTEM - TESTING GUIDE

## Quick Test Commands

### 1. Test Smart Search (Existing Fund)

```bash
curl "http://localhost:3002/api/funds/smart-search?q=HDFC"
```

**Expected Response:**

```json
{
  "success": true,
  "source": "database",
  "cached": true,
  "query": "HDFC",
  "data": [
    /* array of funds */
  ],
  "count": 10
}
```

**Response Time:** ~20-50ms ⚡

---

### 2. Test Smart Search by Scheme Code (New Fund)

```bash
# First time - fetches from external API
curl "http://localhost:3002/api/funds/smart-search?schemeCode=119551"
```

**Expected Response:**

```json
{
  "success": true,
  "source": "live-api",
  "cached": false,
  "provider": "MFAPI",
  "message": "Fund fetched from external API and saved to database",
  "data": {
    "schemeCode": "119551",
    "schemeName": "HDFC Top 100 Fund - Direct Plan - Growth",
    "amc": { "name": "HDFC Mutual Fund" },
    "category": "Equity",
    "nav": { "value": 825.5, "date": "2025-12-27T00:00:00.000Z" },
    "status": "Active",
    "dataSource": "MFAPI",
    "lastFetched": "2025-12-28T10:30:00.000Z"
  }
}
```

**Response Time:** ~1-2 seconds 🌐

---

### 3. Test Same Scheme Code Again

```bash
# Second time - returns from database
curl "http://localhost:3002/api/funds/smart-search?schemeCode=119551"
```

**Expected Response:**

```json
{
  "success": true,
  "source": "database",
  "cached": true,
  "data": {
    /* same fund data */
  }
}
```

**Response Time:** ~20-50ms ⚡ (100x faster!)

---

### 4. Test Batch Import

```bash
curl -X POST "http://localhost:3002/api/funds/batch-import" \
  -H "Content-Type: application/json" \
  -d '{
    "schemeCodes": ["119551", "119552", "119553", "119554", "119555"]
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Batch import completed",
  "results": {
    "total": 5,
    "successful": 4,
    "failed": 0,
    "skipped": 1,
    "funds": [
      { "schemeCode": "119552", "name": "HDFC Mid Cap Fund" },
      { "schemeCode": "119553", "name": "HDFC Small Cap Fund" },
      { "schemeCode": "119554", "name": "HDFC Balanced Fund" },
      { "schemeCode": "119555", "name": "HDFC Tax Saver Fund" }
    ],
    "errors": []
  }
}
```

---

### 5. Test Error Handling - Invalid Scheme Code

```bash
curl "http://localhost:3002/api/funds/smart-search?schemeCode=999999"
```

**Expected Response:**

```json
{
  "success": false,
  "error": "Fund not found",
  "message": "No fund found with scheme code: 999999",
  "searchedIn": ["database", "mfapi"]
}
```

---

### 6. Test Missing Query Parameter

```bash
curl "http://localhost:3002/api/funds/smart-search"
```

**Expected Response:**

```json
{
  "success": false,
  "error": "Missing search parameter",
  "message": "Provide either \"q\" (search query) or \"schemeCode\""
}
```

---

## 📊 Performance Benchmarks

### Expected Response Times

| Scenario               | First Time   | Subsequent | Speed Increase  |
| ---------------------- | ------------ | ---------- | --------------- |
| Database search        | 20-50ms      | 20-50ms    | Same            |
| Scheme code (cached)   | 20-50ms      | 20-50ms    | Same            |
| Scheme code (new)      | 1-2 seconds  | 20-50ms    | **100x faster** |
| Batch import (5 funds) | 5-10 seconds | N/A        | N/A             |

---

## 🔍 Testing Checklist

- [ ] Smart search by name returns results
- [ ] Smart search by scheme code (existing) returns from database
- [ ] Smart search by scheme code (new) fetches from API
- [ ] Second search of same code returns from database (fast)
- [ ] Batch import successfully imports multiple funds
- [ ] Error handling works for invalid scheme codes
- [ ] Missing parameters return proper error messages
- [ ] Response includes correct "source" field
- [ ] Console logs show fetch operations
- [ ] Database contains newly imported funds

---

## 🐛 Debugging

### Check Backend Logs

Look for these log messages:

```
🔍 Smart search initiated: query="HDFC", code=""
✅ Found in database: HDFC Top 100 Fund
```

Or:

```
🔍 Smart search initiated: query="", code="119551"
❌ Scheme code 119551 not found in database
🌐 Fetching from MFAPI: 119551
💾 Saving new fund to database: HDFC Top 100 Fund
✅ Fund saved and returned from API: HDFC Top 100 Fund
```

### Check MongoDB

```javascript
// Check if fund was saved
db.funds.findOne({ schemeCode: '119551' });

// Count total funds
db.funds.countDocuments();

// Find recently added funds
db.funds.find({ dataSource: 'MFAPI' }).sort({ lastFetched: -1 }).limit(10);
```

---

## 🎯 Test with Frontend

### React Component Test

```tsx
import { smartSearchBySchemeCode } from '../api/funds.api';

const TestComponent = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testSmartSearch = async () => {
    setLoading(true);
    const startTime = Date.now();

    try {
      const response = await smartSearchBySchemeCode('119551');
      const endTime = Date.now();

      setResult({
        ...response,
        responseTime: endTime - startTime,
      });
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={testSmartSearch}>Test Smart Search</button>
      {loading && <p>Loading...</p>}
      {result && (
        <div>
          <p>Source: {result.source}</p>
          <p>Cached: {result.cached ? 'Yes' : 'No'}</p>
          <p>Response Time: {result.responseTime}ms</p>
          <pre>{JSON.stringify(result.data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
```

---

## ✅ Success Indicators

Your implementation is working correctly if:

1. ✅ First search by scheme code takes ~1-2 seconds
2. ✅ Second search of same code takes ~20-50ms
3. ✅ Response includes correct "source" field
4. ✅ MongoDB contains the newly imported fund
5. ✅ Console shows MFAPI fetch logs
6. ✅ Batch import successfully imports multiple funds
7. ✅ Error messages are clear and helpful
8. ✅ Invalid scheme codes return 404 with proper message

---

## 🚀 Production Testing

Before deploying to production:

1. Test with 100+ scheme codes
2. Verify rate limiting works
3. Check memory usage during batch import
4. Test concurrent requests
5. Verify cache invalidation
6. Check error recovery
7. Monitor API quota usage
8. Test with slow network

---

**All tests passing? Your smart caching system is production-ready! 🎉**
