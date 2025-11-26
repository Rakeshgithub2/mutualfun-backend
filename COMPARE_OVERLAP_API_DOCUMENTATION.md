# Fund Compare & Overlap APIs Documentation

Complete documentation for fund comparison and portfolio overlap analysis endpoints.

---

## Base URL

```
http://localhost:3002/api
```

---

## 1. POST /compare

Compare multiple funds with detailed analysis including holdings overlap, sector allocation, and return correlation.

### Endpoint

```
POST /api/compare
```

### Request Body

```json
{
  "fundIds": ["abc123", "xyz456"]
}
```

### Request Schema

| Field   | Type     | Required | Description                      |
| ------- | -------- | -------- | -------------------------------- |
| fundIds | string[] | Yes      | Array of 2-5 fund IDs to compare |

### Validation Rules

- Minimum 2 fund IDs required
- Maximum 5 funds can be compared at once
- All fund IDs must exist in the database

### Request Examples

```bash
# Compare 2 funds
curl -X POST http://localhost:3002/api/compare \
  -H "Content-Type: application/json" \
  -d '{"fundIds": ["fund1", "fund2"]}'

# Compare 3 funds
curl -X POST http://localhost:3002/api/compare \
  -H "Content-Type: application/json" \
  -d '{"fundIds": ["fund1", "fund2", "fund3"]}'
```

### Response Schema

```json
{
  "success": true,
  "message": "Funds compared successfully",
  "data": {
    "funds": [
      {
        "id": "fund1",
        "name": "SBI Bluechip Fund",
        "category": "equity",
        "fundType": "mutual_fund",
        "currentNav": 85.45,
        "returns": {
          "day": 1.48,
          "week": 2.31,
          "month": 5.67,
          "threeMonth": 8.92,
          "sixMonth": 12.45,
          "oneYear": 18.34,
          "threeYear": 15.67,
          "fiveYear": 16.89,
          "sinceInception": 14.23
        },
        "riskMetrics": {
          "sharpeRatio": 1.45,
          "standardDeviation": 12.34
        },
        "topHoldings": [
          {
            "name": "Reliance Industries",
            "ticker": "RELIANCE.NS",
            "percentage": 8.45,
            "sector": "Energy"
          }
        ],
        "expenseRatio": 1.25,
        "aum": 45000000000
      }
    ],
    "pairwiseComparisons": [
      {
        "fund1": {
          "id": "fund1",
          "name": "SBI Bluechip Fund"
        },
        "fund2": {
          "id": "fund2",
          "name": "HDFC Top 100 Fund"
        },
        "jaccardSimilarity": 65.45,
        "weightedOverlap": 72.34,
        "returnCorrelation": 0.856,
        "similarity": 68.9
      }
    ],
    "commonHoldings": [
      {
        "ticker": "RELIANCE.NS",
        "name": "Reliance Industries",
        "sector": "Energy",
        "heldBy": [
          {
            "fundId": "fund1",
            "fundName": "SBI Bluechip Fund",
            "percentage": 8.45
          },
          {
            "fundId": "fund2",
            "fundName": "HDFC Top 100 Fund",
            "percentage": 7.23
          }
        ],
        "avgPercentage": 7.84
      }
    ],
    "sectorOverlap": [
      {
        "sector": "Financials",
        "allocations": [
          {
            "fundId": "fund1",
            "fundName": "SBI Bluechip Fund",
            "percentage": 28.45
          },
          {
            "fundId": "fund2",
            "fundName": "HDFC Top 100 Fund",
            "percentage": 25.67
          }
        ],
        "avgPercentage": 27.06,
        "maxDifference": 2.78
      }
    ],
    "overallMetrics": {
      "avgJaccardSimilarity": 65.45,
      "avgWeightedOverlap": 72.34,
      "avgReturnCorrelation": 0.856,
      "totalCommonHoldings": 42
    },
    "insights": {
      "mostSimilarPair": {
        "fund1": { "id": "fund1", "name": "SBI Bluechip Fund" },
        "fund2": { "id": "fund2", "name": "HDFC Top 100 Fund" },
        "similarity": 68.9
      },
      "leastSimilarPair": {
        "fund1": { "id": "fund1", "name": "SBI Bluechip Fund" },
        "fund2": { "id": "fund3", "name": "Axis Small Cap Fund" },
        "similarity": 23.45
      },
      "highestCorrelation": {
        "fund1": { "id": "fund1", "name": "SBI Bluechip Fund" },
        "fund2": { "id": "fund2", "name": "HDFC Top 100 Fund" },
        "returnCorrelation": 0.856
      }
    },
    "comparedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Response Fields Explained

#### Funds Array

- Complete summary of each fund being compared
- Includes top 5 holdings, returns, risk metrics
- Current NAV, expense ratio, AUM

#### Pairwise Comparisons

- **Jaccard Similarity**: Percentage of common holdings (unique tickers)
  - Formula: |A ∩ B| / |A ∪ B| × 100
  - Higher = More common stocks
- **Weighted Overlap**: Considers allocation percentages
  - Formula: Σ min(weight_A, weight_B) for common holdings
  - Reflects actual portfolio overlap
- **Return Correlation**: Statistical correlation of returns
  - Range: -1.0 to 1.0
  - 1.0 = Perfect positive correlation
  - 0.0 = No correlation
  - -1.0 = Perfect negative correlation
- **Similarity**: Average of Jaccard and Weighted Overlap
  - Simple overall similarity score

#### Common Holdings

- Top 20 stocks held by multiple funds
- Shows allocation percentage in each fund
- Average percentage across all funds
- Sorted by average percentage (descending)

#### Sector Overlap

- Top 15 sectors across all funds
- Allocation percentage per fund per sector
- Average allocation and maximum difference
- Identifies sector concentration similarities

#### Overall Metrics

- Aggregated statistics across all pairwise comparisons
- Total count of common holdings
- Average similarity and correlation metrics

#### Insights

- **Most Similar Pair**: Funds with highest similarity score
- **Least Similar Pair**: Most diverse fund combination
- **Highest Correlation**: Pair with strongest return correlation

### Use Cases

1. **Portfolio Diversification**: Identify if multiple funds are too similar
2. **Fund Selection**: Choose complementary funds with low overlap
3. **Investment Analysis**: Understand holdings concentration
4. **Risk Assessment**: Evaluate correlation and sector exposure
5. **Due Diligence**: Compare competing funds in same category

---

## 2. POST /overlap

Calculate holdings overlap between funds. Focuses specifically on portfolio overlap analysis without return correlation.

### Endpoint

```
POST /api/overlap
```

### Request Body

```json
{
  "fundIds": ["abc123", "xyz456"]
}
```

### Request Schema

| Field   | Type     | Required | Description                      |
| ------- | -------- | -------- | -------------------------------- |
| fundIds | string[] | Yes      | Array of 2-5 fund IDs to analyze |

### Validation Rules

- Minimum 2 fund IDs required
- Maximum 5 funds can be analyzed at once
- All fund IDs must exist in the database

### Request Example

```bash
curl -X POST http://localhost:3002/api/overlap \
  -H "Content-Type: application/json" \
  -d '{"fundIds": ["fund1", "fund2", "fund3"]}'
```

### Response Schema

```json
{
  "success": true,
  "message": "Overlap analysis completed successfully",
  "data": {
    "funds": [
      {
        "id": "fund1",
        "name": "SBI Bluechip Fund",
        "category": "equity",
        "totalHoldings": 65,
        "topHoldings": [
          {
            "name": "Reliance Industries",
            "ticker": "RELIANCE.NS",
            "percentage": 8.45,
            "sector": "Energy"
          }
        ]
      }
    ],
    "pairwiseOverlaps": [
      {
        "fund1": {
          "id": "fund1",
          "name": "SBI Bluechip Fund"
        },
        "fund2": {
          "id": "fund2",
          "name": "HDFC Top 100 Fund"
        },
        "jaccardSimilarity": 65.45,
        "weightedOverlap": 72.34,
        "commonHoldingsCount": 42,
        "overlapPercentage": 64.62
      }
    ],
    "commonHoldings": [
      {
        "ticker": "RELIANCE.NS",
        "name": "Reliance Industries",
        "sector": "Energy",
        "heldBy": [
          {
            "fundId": "fund1",
            "fundName": "SBI Bluechip Fund",
            "percentage": 8.45
          },
          {
            "fundId": "fund2",
            "fundName": "HDFC Top 100 Fund",
            "percentage": 7.23
          }
        ],
        "avgPercentage": 7.84
      }
    ],
    "uniqueHoldings": [
      {
        "fundId": "fund1",
        "fundName": "SBI Bluechip Fund",
        "uniqueCount": 23,
        "uniquePercentage": 35.38,
        "topUniqueHoldings": [
          {
            "name": "Zomato",
            "ticker": "ZOMATO.NS",
            "percentage": 2.34,
            "sector": "Consumer Services"
          }
        ]
      }
    ],
    "overallMetrics": {
      "totalCommonHoldings": 42,
      "avgJaccardSimilarity": 65.45,
      "avgWeightedOverlap": 72.34,
      "maxOverlap": 85.67,
      "minOverlap": 45.23
    },
    "insights": {
      "mostOverlappingPair": {
        "fund1": { "id": "fund1", "name": "SBI Bluechip Fund" },
        "fund2": { "id": "fund2", "name": "HDFC Top 100 Fund" },
        "weightedOverlap": 72.34
      },
      "leastOverlappingPair": {
        "fund1": { "id": "fund1", "name": "SBI Bluechip Fund" },
        "fund2": { "id": "fund3", "name": "Axis Small Cap Fund" },
        "weightedOverlap": 12.45
      },
      "mostDiverseFund": {
        "fundId": "fund3",
        "fundName": "Axis Small Cap Fund",
        "uniquePercentage": 78.45
      }
    },
    "analyzedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Response Fields Explained

#### Pairwise Overlaps

- **Jaccard Similarity**: Percentage of common unique holdings
- **Weighted Overlap**: Portfolio allocation overlap
- **Common Holdings Count**: Number of stocks held by both
- **Overlap Percentage**: Common holdings / Total holdings × 100

#### Unique Holdings

- Stocks held by only one fund (not in any other compared fund)
- **Unique Count**: Number of exclusive holdings
- **Unique Percentage**: Portion of portfolio that's unique
- **Top Unique Holdings**: Top 10 exclusive stocks
- Identifies fund's differentiation factor

#### Insights

- **Most Overlapping Pair**: Highest weighted overlap
- **Least Overlapping Pair**: Most diverse combination
- **Most Diverse Fund**: Highest unique holdings percentage

### Use Cases

1. **Portfolio Overlap Check**: Ensure you're not doubling up
2. **Fund Diversification**: Find funds with minimal overlap
3. **Unique Holdings Analysis**: Identify fund's differentiators
4. **Consolidation Decisions**: Determine if multiple funds can be consolidated
5. **Risk Management**: Avoid excessive concentration in same stocks

---

## Comparison: /compare vs /overlap

| Feature                 | /compare            | /overlap                    |
| ----------------------- | ------------------- | --------------------------- |
| **Holdings Analysis**   | ✅ Common holdings  | ✅ Common + unique holdings |
| **Jaccard Similarity**  | ✅ Yes              | ✅ Yes                      |
| **Weighted Overlap**    | ✅ Yes              | ✅ Yes                      |
| **Sector Overlap**      | ✅ Yes              | ❌ No                       |
| **Return Correlation**  | ✅ Yes              | ❌ No                       |
| **Unique Holdings**     | ❌ No               | ✅ Yes                      |
| **Performance Metrics** | ✅ Returns, risk    | ❌ No                       |
| **Best For**            | Complete comparison | Portfolio overlap only      |

**Use /compare when**: You need full analysis with returns and risk
**Use /overlap when**: You only need holdings overlap analysis

---

## Error Responses

### 400 Bad Request - Validation Error

```json
{
  "error": "Validation error",
  "details": [
    {
      "code": "too_small",
      "minimum": 2,
      "path": ["fundIds"],
      "message": "At least 2 fund IDs required"
    }
  ]
}
```

### 404 Not Found

```json
{
  "error": "One or more funds not found",
  "missingCount": 1
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error",
  "message": "Error details..."
}
```

---

## Testing

### PowerShell

```powershell
# Test /compare
$body = @{
    fundIds = @("fund1", "fund2")
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3002/api/compare" `
  -Method Post `
  -Body $body `
  -ContentType "application/json"

# Test /overlap
$body = @{
    fundIds = @("fund1", "fund2", "fund3")
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3002/api/overlap" `
  -Method Post `
  -Body $body `
  -ContentType "application/json"
```

### cURL

```bash
# Test /compare
curl -X POST http://localhost:3002/api/compare \
  -H "Content-Type: application/json" \
  -d '{"fundIds":["fund1","fund2"]}'

# Test /overlap
curl -X POST http://localhost:3002/api/overlap \
  -H "Content-Type: application/json" \
  -d '{"fundIds":["fund1","fund2","fund3"]}'
```

---

## Frontend Integration

### React/Next.js Example

```typescript
// lib/api-client.ts
export class ApiClient {
  // ... other methods

  async compareFunds(fundIds: string[]) {
    const response = await fetch(`${this.baseUrl}/api/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fundIds }),
    });

    const result = await response.json();
    return result.data;
  }

  async calculateOverlap(fundIds: string[]) {
    const response = await fetch(`${this.baseUrl}/api/overlap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fundIds }),
    });

    const result = await response.json();
    return result.data;
  }
}
```

### Usage in Component

```typescript
'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';

export default function FundComparison() {
  const [selectedFunds, setSelectedFunds] = useState<string[]>([]);
  const [comparison, setComparison] = useState(null);

  const handleCompare = async () => {
    if (selectedFunds.length < 2) {
      alert('Select at least 2 funds');
      return;
    }

    const data = await apiClient.compareFunds(selectedFunds);
    setComparison(data);
  };

  return (
    <div>
      {/* Fund selection UI */}
      <button onClick={handleCompare}>Compare Funds</button>

      {comparison && (
        <div>
          <h2>Comparison Results</h2>

          {/* Overall Metrics */}
          <div>
            <p>Average Similarity: {comparison.overallMetrics.avgJaccardSimilarity}%</p>
            <p>Weighted Overlap: {comparison.overallMetrics.avgWeightedOverlap}%</p>
            <p>Common Holdings: {comparison.overallMetrics.totalCommonHoldings}</p>
          </div>

          {/* Common Holdings */}
          <div>
            <h3>Common Holdings</h3>
            {comparison.commonHoldings.map(holding => (
              <div key={holding.ticker}>
                <p>{holding.name} - Avg: {holding.avgPercentage}%</p>
              </div>
            ))}
          </div>

          {/* Sector Overlap */}
          <div>
            <h3>Sector Allocation</h3>
            {comparison.sectorOverlap.map(sector => (
              <div key={sector.sector}>
                <p>{sector.sector} - Avg: {sector.avgPercentage}%</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Performance Notes

- Both endpoints use MongoDB queries for fast retrieval
- Calculations are performed in-memory (no database overhead)
- Pairwise comparisons scale as O(n²) where n = number of funds
- Maximum 5 funds limit prevents performance issues
- Results are not cached (real-time calculation)

---

## Summary

✅ **POST /api/compare** - Complete fund comparison with holdings, sectors, returns, correlation
✅ **POST /api/overlap** - Portfolio overlap analysis with unique holdings identification

Both APIs provide deep insights for:

- Portfolio diversification decisions
- Fund selection and consolidation
- Risk management
- Investment due diligence
