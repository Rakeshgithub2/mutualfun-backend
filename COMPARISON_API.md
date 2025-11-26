# Fund Comparison & Overlap Analysis API

## Overview

Advanced fund comparison algorithm with holdings overlap, sector overlap, and returns correlation analysis.

## Algorithm Features

### 1. Holdings Overlap Analysis

Uses **Jaccard Index** and **weighted overlap** to measure portfolio similarity:

- **Jaccard Index**: `J = |Intersection| / |Union|`
  - Measures set similarity between holdings
  - Range: 0 (no overlap) to 1 (identical holdings)
- **Weighted Overlap**: Sum of `min(weight_A, weight_B)` for common holdings
  - Accounts for position sizes
  - More accurate than simple Jaccard for mutual funds
- **Top N Holdings**: Configurable (default: 50)
  - Focus on largest positions that drive returns
  - Reduces noise from minor holdings

### 2. Sector Overlap Analysis

Uses **Cosine Similarity** to measure sector allocation similarity:

```
cosine_similarity = (A · B) / (||A|| × ||B||)
```

- Treats sector weights as vectors
- Range: 0 (completely different) to 1 (identical allocation)
- Also computes **percent overlap**: sum of `min(sector_A, sector_B)`

### 3. Returns Correlation

Calculates **Pearson Correlation** on daily returns:

```
ρ = Σ[(xi - x̄)(yi - ȳ)] / √[Σ(xi - x̄)² × Σ(yi - ȳ)²]
```

- Measures how funds move together
- High correlation (>0.8) = poor diversification
- Periods: 3m, 6m, 1y, 3y (default: 1y)
- Requires minimum 30 overlapping data points

## API Endpoint

### POST `/api/comparison/compare`

Compare 2-5 mutual funds with advanced overlap analysis.

#### Request Body

```json
{
  "fundIds": ["FUND001", "FUND002"],
  "topNHoldings": 50,
  "correlationPeriod": "1y",
  "includeCorrelation": true
}
```

**Parameters:**

- `fundIds` (required): Array of 2-5 fund IDs
- `topNHoldings` (optional): Number of top holdings to analyze (default: 50)
- `correlationPeriod` (optional): One of `"3m"`, `"6m"`, `"1y"`, `"3y"` (default: `"1y"`)
- `includeCorrelation` (optional): Calculate returns correlation (default: `true`)

#### Response

```json
{
  "success": true,
  "data": {
    "funds": [
      {
        "fundId": "FUND001",
        "name": "HDFC Top 100 Fund",
        "fundHouse": "HDFC Mutual Fund",
        "category": "equity",
        "subCategory": "Large Cap",
        "currentNav": 845.32,
        "aum": 35000,
        "expenseRatio": 1.85,
        "returns": { "oneYear": 12.5, "threeYear": 15.2, "fiveYear": 14.8 },
        "riskMetrics": { "sharpeRatio": 1.2, "beta": 0.95 }
      },
      {
        "fundId": "FUND002",
        "name": "ICICI Bluechip Fund",
        "fundHouse": "ICICI Prudential Mutual Fund",
        "category": "equity",
        "subCategory": "Large Cap",
        "currentNav": 78.45,
        "aum": 28500,
        "expenseRatio": 2.0,
        "returns": { "oneYear": 11.8, "threeYear": 14.5, "fiveYear": 13.9 },
        "riskMetrics": { "sharpeRatio": 1.1, "beta": 1.02 }
      }
    ],
    "holdingsOverlap": {
      "jaccard": 0.3214,
      "weightedOverlap": 42.75,
      "commonHoldings": [
        {
          "ticker": "RELIANCE",
          "name": "Reliance Industries Ltd",
          "weightA": 8.5,
          "weightB": 7.2,
          "minWeight": 7.2
        },
        {
          "ticker": "HDFCBANK",
          "name": "HDFC Bank Ltd",
          "weightA": 6.8,
          "weightB": 8.1,
          "minWeight": 6.8
        }
      ],
      "uniqueToFundA": 28,
      "uniqueToFundB": 32,
      "totalHoldingsA": 50,
      "totalHoldingsB": 50
    },
    "sectorOverlap": {
      "cosineSimilarity": 0.8542,
      "percentOverlap": 67.35,
      "commonSectors": [
        {
          "sector": "financial services",
          "weightA": 32.5,
          "weightB": 35.2,
          "difference": 2.7
        },
        {
          "sector": "information technology",
          "weightA": 18.3,
          "weightB": 16.8,
          "difference": 1.5
        },
        {
          "sector": "energy",
          "weightA": 12.1,
          "weightB": 10.5,
          "difference": 1.6
        }
      ],
      "sectorsA": {
        "financial services": 32.5,
        "information technology": 18.3,
        "energy": 12.1,
        "consumer goods": 8.7,
        "healthcare": 6.2
      },
      "sectorsB": {
        "financial services": 35.2,
        "information technology": 16.8,
        "energy": 10.5,
        "consumer goods": 9.1,
        "automobile": 5.8
      }
    },
    "returnsCorrelation": {
      "period": "1y",
      "correlation": 0.8234,
      "dataPoints": 252,
      "startDate": "2023-11-18T00:00:00.000Z",
      "endDate": "2024-11-18T00:00:00.000Z"
    }
  },
  "cached": false
}
```

#### Error Responses

**400 Bad Request:**

```json
{
  "success": false,
  "message": "Please provide 2-5 fund IDs to compare"
}
```

**404 Not Found:**

```json
{
  "success": false,
  "message": "Some funds not found or inactive"
}
```

**500 Internal Server Error:**

```json
{
  "success": false,
  "message": "Failed to compare funds",
  "error": "Error details"
}
```

## Multiple Fund Comparison (3+ Funds)

When comparing 3+ funds, the API returns **pairwise comparisons**:

```json
{
  "funds": [...],
  "pairwiseComparisons": [
    {
      "fundPair": ["FUND001", "FUND002"],
      "funds": [...],
      "holdingsOverlap": {...},
      "sectorOverlap": {...},
      "returnsCorrelation": {...}
    },
    {
      "fundPair": ["FUND001", "FUND003"],
      "funds": [...],
      "holdingsOverlap": {...},
      "sectorOverlap": {...},
      "returnsCorrelation": {...}
    },
    {
      "fundPair": ["FUND002", "FUND003"],
      "funds": [...],
      "holdingsOverlap": {...},
      "sectorOverlap": {...},
      "returnsCorrelation": {...}
    }
  ],
  "totalComparisons": 3
}
```

For N funds: `totalComparisons = N × (N-1) / 2`

## Interpretation Guide

### Jaccard Index

- **0.0 - 0.2**: Low overlap, good diversification
- **0.2 - 0.4**: Moderate overlap, some diversification
- **0.4 - 0.7**: High overlap, limited diversification
- **0.7 - 1.0**: Very high overlap, redundant holdings

### Weighted Overlap

- **0 - 20%**: Minimal overlap by portfolio weight
- **20 - 40%**: Moderate overlap
- **40 - 60%**: Significant overlap
- **60 - 100%**: Substantial overlap, similar portfolios

### Cosine Similarity (Sectors)

- **0.0 - 0.5**: Different sector allocation strategies
- **0.5 - 0.7**: Somewhat similar sector focus
- **0.7 - 0.9**: Very similar sector allocation
- **0.9 - 1.0**: Nearly identical sector weights

### Pearson Correlation (Returns)

- **-1.0 to -0.5**: Strong negative correlation (rare, good for hedging)
- **-0.5 to 0.2**: Low/no correlation (good diversification)
- **0.2 to 0.6**: Moderate positive correlation
- **0.6 to 0.8**: High positive correlation
- **0.8 to 1.0**: Very high correlation (poor diversification)

## UI Components

### 1. Venn Diagram Visualization

Display three key metrics:

- Unique holdings in Fund A
- Common holdings (intersection)
- Unique holdings in Fund B

```tsx
<div className="grid grid-cols-3 gap-4">
  <div>Unique to A: {uniqueToFundA}</div>
  <div>Common: {commonHoldings.length}</div>
  <div>Unique to B: {uniqueToFundB}</div>
</div>
```

### 2. Top 10 Common Holdings Table

Show holdings with side-by-side weights:

| Holding             | Fund A Weight | Fund B Weight | Min Weight |
| ------------------- | ------------- | ------------- | ---------- |
| Reliance Industries | 8.5%          | 7.2%          | 7.2%       |
| HDFC Bank           | 6.8%          | 8.1%          | 6.8%       |

### 3. Correlation Heatmap

For 3+ funds, display correlation matrix:

```
       FUND1  FUND2  FUND3
FUND1   1.00   0.82   0.65
FUND2   0.82   1.00   0.71
FUND3   0.65   0.71   1.00
```

Use color coding:

- 🟢 Green (0.0-0.4): Good diversification
- 🟡 Yellow (0.4-0.7): Moderate correlation
- 🔴 Red (0.7-1.0): High correlation, poor diversification

## Caching Strategy

- Cache key format: `comparison:v2:{fundIds}:{topN}:{period}:{includeCorr}`
- TTL: 1 hour (3600 seconds)
- Sorted fundIds to ensure consistent cache keys

## Performance Notes

- Holdings comparison: O(N × M) where N, M = number of holdings
- Sector comparison: O(S) where S = unique sectors
- Correlation calculation: O(D) where D = data points
- Typical response time: 100-300ms (cached), 500-1500ms (uncached with correlation)
- Minimum 30 data points required for correlation

## Future Enhancements

1. **Free-text search integration**: Resolve "large cap growth" → fundIds
2. **Correlation heatmap API**: Dedicated endpoint for N×N matrix
3. **Time-series correlation**: Show how correlation changes over time
4. **Factor exposure analysis**: Compare factor loadings (size, value, momentum)
5. **Risk-adjusted overlap**: Weight by Sharpe ratio or alpha
6. **Machine learning clustering**: Auto-detect similar funds

## Example Usage

### cURL

```bash
curl -X POST https://api.mutualfunds.com/api/comparison/compare \
  -H "Content-Type: application/json" \
  -d '{
    "fundIds": ["INF204KA1SS6", "INF109K01VF6"],
    "topNHoldings": 50,
    "correlationPeriod": "1y",
    "includeCorrelation": true
  }'
```

### JavaScript (Fetch)

```javascript
const response = await fetch('/api/comparison/compare', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fundIds: ['INF204KA1SS6', 'INF109K01VF6'],
    topNHoldings: 50,
    correlationPeriod: '1y',
    includeCorrelation: true,
  }),
});

const data = await response.json();
console.log('Jaccard Index:', data.data.holdingsOverlap.jaccard);
console.log('Correlation:', data.data.returnsCorrelation.correlation);
```

## References

- Jaccard Index: https://en.wikipedia.org/wiki/Jaccard_index
- Cosine Similarity: https://en.wikipedia.org/wiki/Cosine_similarity
- Pearson Correlation: https://en.wikipedia.org/wiki/Pearson_correlation_coefficient
