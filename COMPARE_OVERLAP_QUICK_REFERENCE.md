# Compare & Overlap APIs - Quick Reference

## ✅ Implementation Complete

Two powerful APIs for fund comparison and portfolio overlap analysis.

---

## 🎯 Endpoints

| Endpoint       | Method | Purpose                                              |
| -------------- | ------ | ---------------------------------------------------- |
| `/api/compare` | POST   | Complete fund comparison with returns, risk, overlap |
| `/api/overlap` | POST   | Holdings overlap analysis with unique stocks         |

---

## 📋 Quick Usage

### POST /api/compare

```bash
curl -X POST http://localhost:3002/api/compare \
  -H "Content-Type: application/json" \
  -d '{"fundIds": ["fund1", "fund2"]}'
```

**Returns:**

- ✅ Pairwise comparisons (2-5 funds)
- ✅ Common holdings (top 20)
- ✅ Sector overlap (top 15)
- ✅ Return correlation
- ✅ Jaccard similarity
- ✅ Weighted overlap
- ✅ Overall metrics & insights

---

### POST /api/overlap

```bash
curl -X POST http://localhost:3002/api/overlap \
  -H "Content-Type: application/json" \
  -d '{"fundIds": ["fund1", "fund2", "fund3"]}'
```

**Returns:**

- ✅ Common holdings (top 30)
- ✅ Unique holdings per fund (top 10)
- ✅ Pairwise overlaps
- ✅ Jaccard similarity
- ✅ Weighted overlap
- ✅ Overall metrics & insights

---

## 🔑 Key Metrics Explained

### Jaccard Similarity

- Measures unique holdings overlap
- Formula: |A ∩ B| / |A ∪ B| × 100
- Range: 0-100%
- **Higher = More common stocks**

### Weighted Overlap

- Considers allocation percentages
- Formula: Σ min(weight_A, weight_B)
- Range: 0-100%
- **Reflects actual portfolio overlap**

### Return Correlation

- Statistical correlation of returns
- Range: -1.0 to 1.0
- **1.0 = Perfect correlation**
- **0.0 = No correlation**
- **-1.0 = Negative correlation**

---

## 📊 Response Structure

### /compare Response

```json
{
  "funds": [...],              // Fund summaries
  "pairwiseComparisons": [...], // All pairs analyzed
  "commonHoldings": [...],      // Top 20 common stocks
  "sectorOverlap": [...],       // Top 15 sectors
  "overallMetrics": {
    "avgJaccardSimilarity": 65.45,
    "avgWeightedOverlap": 72.34,
    "avgReturnCorrelation": 0.856,
    "totalCommonHoldings": 42
  },
  "insights": {
    "mostSimilarPair": {...},
    "leastSimilarPair": {...},
    "highestCorrelation": {...}
  }
}
```

### /overlap Response

```json
{
  "funds": [...],              // Fund summaries
  "pairwiseOverlaps": [...],   // All pairs analyzed
  "commonHoldings": [...],      // Top 30 common stocks
  "uniqueHoldings": [...],      // Unique per fund
  "overallMetrics": {
    "totalCommonHoldings": 42,
    "avgJaccardSimilarity": 65.45,
    "avgWeightedOverlap": 72.34,
    "maxOverlap": 85.67,
    "minOverlap": 45.23
  },
  "insights": {
    "mostOverlappingPair": {...},
    "leastOverlappingPair": {...},
    "mostDiverseFund": {...}
  }
}
```

---

## 🎯 Use Cases

### /compare

- Portfolio diversification decisions
- Complete fund analysis
- Return correlation assessment
- Sector concentration analysis
- Investment due diligence

### /overlap

- Portfolio overlap check
- Consolidation decisions
- Unique holdings identification
- Diversification optimization
- Risk management

---

## 🧪 Testing

```powershell
# Run test script
cd mutual-funds-backend
.\test-compare-overlap.ps1
```

**Test Coverage:**

- ✅ Compare 2-3 funds
- ✅ Overlap analysis
- ✅ Validation (min/max funds)
- ✅ Error handling
- ✅ Invalid fund IDs

---

## 💻 Frontend Integration

```typescript
// lib/api-client.ts
async compareFunds(fundIds: string[]) {
  const response = await fetch(`${API_URL}/api/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fundIds }),
  });
  return response.json();
}

async calculateOverlap(fundIds: string[]) {
  const response = await fetch(`${API_URL}/api/overlap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fundIds }),
  });
  return response.json();
}
```

---

## ⚡ Validation Rules

- ✅ Minimum: 2 funds
- ✅ Maximum: 5 funds
- ✅ All fund IDs must exist
- ✅ Request body required
- ✅ Valid JSON format

---

## 🔄 Comparison: /compare vs /overlap

| Feature            | /compare | /overlap |
| ------------------ | -------- | -------- |
| Common Holdings    | Top 20   | Top 30   |
| Unique Holdings    | ❌ No    | ✅ Yes   |
| Sector Analysis    | ✅ Yes   | ❌ No    |
| Return Correlation | ✅ Yes   | ❌ No    |
| Performance Data   | ✅ Yes   | ❌ No    |
| Jaccard Similarity | ✅ Yes   | ✅ Yes   |
| Weighted Overlap   | ✅ Yes   | ✅ Yes   |

---

## 📁 Files

### Created

1. ✅ `src/controllers/comparison.controller.ts` (500+ lines)
   - compareFunds implementation
   - calculateOverlap implementation
   - Helper functions for calculations

2. ✅ `COMPARE_OVERLAP_API_DOCUMENTATION.md` (700+ lines)
   - Complete API reference
   - Request/response schemas
   - Frontend integration examples

3. ✅ `test-compare-overlap.ps1`
   - Comprehensive test script
   - Validation tests
   - Error handling tests

### Modified

1. ✅ `src/routes/comparison.ts`
   - Removed old Prisma-based code
   - Added new endpoint routes
   - Clean implementation

---

## 📚 Documentation

- **Full Docs**: `COMPARE_OVERLAP_API_DOCUMENTATION.md`
- **Quick Ref**: This file
- **Test Script**: `test-compare-overlap.ps1`

---

## ✅ Summary

**Both APIs are production-ready:**

1. ✅ Complete implementation with 500+ lines
2. ✅ Comprehensive calculations:
   - Jaccard similarity
   - Weighted overlap
   - Return correlation
   - Common holdings analysis
   - Sector overlap
   - Unique holdings identification
3. ✅ Proper validation with Zod
4. ✅ Error handling for all cases
5. ✅ No TypeScript errors
6. ✅ Extensive documentation
7. ✅ Test script provided
8. ✅ Frontend integration examples

**Ready to use!** 🚀
