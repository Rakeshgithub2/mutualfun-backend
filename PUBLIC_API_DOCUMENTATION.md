# Public APIs Documentation

Complete documentation for all public APIs that replace mock data with real database queries.

## Base URL

```
http://localhost:3002/api
```

---

## 1. GET /funds

Search, filter, paginate, and retrieve mutual funds/ETFs list.

### Endpoint

```
GET /api/funds
```

### Query Parameters

| Parameter | Type   | Required | Default | Description                                                                 |
| --------- | ------ | -------- | ------- | --------------------------------------------------------------------------- |
| query     | string | No       | -       | Search query for fund name, description                                     |
| type      | string | No       | -       | Filter by fund type: `mutual_fund`, `etf`                                   |
| category  | string | No       | -       | Filter by category: `equity`, `debt`, `hybrid`, `commodity`, `etf`, `index` |
| page      | number | No       | 1       | Page number for pagination                                                  |
| limit     | number | No       | 20      | Number of results per page (max 100)                                        |

### Request Examples

```bash
# Search for SBI funds
GET /api/funds?query=sbi

# Filter by type and category
GET /api/funds?type=mutual_fund&category=equity

# Paginated results
GET /api/funds?query=sbi&limit=20&page=1

# ETFs only
GET /api/funds?type=etf&limit=50
```

### Response Schema

```json
{
  "success": true,
  "message": "Funds retrieved successfully",
  "data": [
    {
      "id": "fundId123",
      "fundId": "fundId123",
      "name": "SBI Bluechip Fund",
      "category": "equity",
      "subCategory": "Large Cap",
      "fundType": "mutual_fund",
      "fundHouse": "SBI Mutual Fund",
      "currentNav": 85.45,
      "previousNav": 84.2,
      "navDate": "2024-01-15T00:00:00.000Z",
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
      "aum": 45000000000,
      "expenseRatio": 1.25,
      "ratings": {
        "morningstar": 4,
        "crisil": 5,
        "valueResearch": 4
      },
      "popularity": 156
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8,
    "hasMore": true
  }
}
```

### Usage

This endpoint **replaces all mock fund lists** throughout the application:

- Homepage fund listings
- Search results page
- Category-wise fund lists
- Fund house listings
- Top performers sections

---

## 2. GET /funds/:id

Get complete details of a specific fund.

### Endpoint

```
GET /api/funds/:id
```

### Path Parameters

| Parameter | Type   | Required | Description    |
| --------- | ------ | -------- | -------------- |
| id        | string | Yes      | Unique fund ID |

### Request Example

```bash
GET /api/funds/fundId123
```

### Response Schema

```json
{
  "success": true,
  "message": "Fund details retrieved successfully",
  "data": {
    "id": "fundId123",
    "fundId": "fundId123",
    "name": "SBI Bluechip Fund",
    "category": "equity",
    "subCategory": "Large Cap",
    "fundType": "mutual_fund",
    "fundHouse": "SBI Mutual Fund",
    "launchDate": "2006-02-15T00:00:00.000Z",

    "currentNav": 85.45,
    "previousNav": 84.2,
    "navDate": "2024-01-15T00:00:00.000Z",
    "navChange": 1.25,
    "navChangePercent": 1.48,

    "aum": 45000000000,
    "expenseRatio": 1.25,
    "exitLoad": 1.0,
    "minInvestment": 5000,
    "sipMinAmount": 500,

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
      "standardDeviation": 12.34,
      "beta": 0.95,
      "alpha": 2.34,
      "rSquared": 0.89,
      "sortino": 1.67
    },

    "topHoldings": [
      {
        "name": "Reliance Industries",
        "ticker": "RELIANCE.NS",
        "percentage": 8.45,
        "sector": "Energy",
        "value": 3802500000
      },
      {
        "name": "HDFC Bank",
        "ticker": "HDFCBANK.NS",
        "percentage": 7.23,
        "sector": "Financials",
        "value": 3253500000
      }
    ],

    "sectorAllocation": [
      {
        "sector": "Financials",
        "percentage": 28.45
      },
      {
        "sector": "Technology",
        "percentage": 18.23
      },
      {
        "sector": "Energy",
        "percentage": 15.67
      }
    ],

    "fundManager": "Prashant Jain",
    "managerDetails": {
      "id": "managerId123",
      "name": "Prashant Jain",
      "experience": 25,
      "qualification": "MBA, CFA",
      "fundsManaged": 12,
      "totalAum": 180000000000,
      "avgReturn": 16.45,
      "bio": "Veteran fund manager with 25+ years of experience..."
    },

    "ratings": {
      "morningstar": 4,
      "crisil": 5,
      "valueResearch": 4
    },

    "popularity": 156,
    "tags": ["large cap", "bluechip", "equity"],
    "lastUpdated": "2024-01-15T18:30:00.000Z"
  }
}
```

### Data Included

- ✅ Basic fund information
- ✅ Current NAV with change calculations
- ✅ Financial metrics (AUM, expense ratio, exit load, min investment)
- ✅ Complete performance returns (all periods)
- ✅ Comprehensive risk metrics
- ✅ **Top 10 holdings** with ticker, percentage, sector
- ✅ **Sector allocation** breakdown
- ✅ **Manager information** (name, experience, qualifications, track record)
- ✅ Ratings from multiple agencies
- ✅ Popularity and metadata

### Usage

This endpoint **replaces static detail pages**:

- Fund detail page (`/funds/[id]`)
- Portfolio holdings details
- Comparison tool data source
- Investment flow fund information

---

## 3. GET /funds/:id/price-history

Get historical NAV/price data for charting.

### Endpoint

```
GET /api/funds/:id/price-history
```

### Path Parameters

| Parameter | Type   | Required | Description    |
| --------- | ------ | -------- | -------------- |
| id        | string | Yes      | Unique fund ID |

### Query Parameters

| Parameter | Type   | Required | Default | Description                                |
| --------- | ------ | -------- | ------- | ------------------------------------------ |
| period    | string | No       | 1Y      | Time period: `1M`, `3M`, `1Y`, `5Y`, `ALL` |
| from      | string | No       | -       | Custom start date (ISO format)             |
| to        | string | No       | -       | Custom end date (ISO format)               |

### Request Examples

```bash
# Last 1 month data
GET /api/funds/fundId123/price-history?period=1M

# Last 3 months
GET /api/funds/fundId123/price-history?period=3M

# Last 1 year (default)
GET /api/funds/fundId123/price-history?period=1Y

# Last 5 years
GET /api/funds/fundId123/price-history?period=5Y

# All available data
GET /api/funds/fundId123/price-history?period=ALL

# Custom date range
GET /api/funds/fundId123/price-history?from=2023-01-01&to=2023-12-31
```

### Response Schema

```json
{
  "success": true,
  "message": "Price history retrieved successfully",
  "data": {
    "fundId": "fundId123",
    "period": "1Y",
    "startDate": "2023-01-15T00:00:00.000Z",
    "endDate": "2024-01-15T00:00:00.000Z",
    "dataPoints": 252,
    "data": [
      {
        "date": "2023-01-15T00:00:00.000Z",
        "nav": 72.45,
        "open": 72.3,
        "high": 72.89,
        "low": 72.15,
        "close": 72.45,
        "volume": 125000
      },
      {
        "date": "2023-01-16T00:00:00.000Z",
        "nav": 73.12,
        "open": 72.45,
        "high": 73.45,
        "low": 72.4,
        "close": 73.12,
        "volume": 135000
      }
    ]
  }
}
```

### Period Details

| Period | Description          | Data Points (approx) |
| ------ | -------------------- | -------------------- |
| 1M     | Last 30 days         | ~22 (trading days)   |
| 3M     | Last 90 days         | ~65                  |
| 1Y     | Last 365 days        | ~252                 |
| 5Y     | Last 5 years         | ~1260                |
| ALL    | Since fund inception | Variable             |

### Usage

This endpoint is used for:

- Fund detail page charts
- Performance comparison charts
- Portfolio performance tracking
- Technical analysis tools
- Returns calculation

---

## 4. GET /suggest

Fuzzy search autocomplete for fund names.

### Endpoint

```
GET /api/suggest
```

### Query Parameters

| Parameter | Type   | Required | Description                         |
| --------- | ------ | -------- | ----------------------------------- |
| q         | string | Yes      | Search query (minimum 2 characters) |

### Request Examples

```bash
# Search for "sb"
GET /api/suggest?q=sb

# Search for "hdfc"
GET /api/suggest?q=hdfc

# Search for "nifty"
GET /api/suggest?q=nifty

# Supports 1-2 word queries
GET /api/suggest?q=sbi blue
```

### Response Schema

```json
{
  "success": true,
  "message": "Suggestions retrieved successfully",
  "data": {
    "query": "sb",
    "count": 8,
    "suggestions": [
      {
        "id": "fundId123",
        "fundId": "fundId123",
        "name": "SBI Bluechip Fund",
        "category": "equity",
        "fundType": "mutual_fund",
        "fundHouse": "SBI Mutual Fund",
        "currentNav": 85.45,
        "returns": {
          "oneYear": 18.34,
          "threeYear": 15.67
        }
      },
      {
        "id": "fundId124",
        "fundId": "fundId124",
        "name": "SBI Small Cap Fund",
        "category": "equity",
        "fundType": "mutual_fund",
        "fundHouse": "SBI Mutual Fund",
        "currentNav": 125.78,
        "returns": {
          "oneYear": 25.67,
          "threeYear": 22.45
        }
      }
    ]
  }
}
```

### Features

- ✅ **Fuzzy search**: Matches partial words
- ✅ **Fast response**: Returns top 10 matches
- ✅ **1-2 word queries**: Supports multi-word search
- ✅ **Active funds only**: Only suggests currently active funds
- ✅ **Minimal data**: Returns only essential fields for performance

### Usage

This endpoint is **required for**:

- **Fund Compare**: Autocomplete fund selection
- **Fund Overlap**: Search and select funds
- **Search Bar**: Homepage and global search autocomplete
- **Investment flows**: Quick fund selection

---

## Error Responses

All endpoints return consistent error responses:

### 400 Bad Request - Validation Error

```json
{
  "error": "Validation error",
  "details": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["query"],
      "message": "Required"
    }
  ]
}
```

### 404 Not Found

```json
{
  "error": "Fund not found"
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

## Testing the APIs

### Using cURL

```bash
# Get all funds
curl http://localhost:3002/api/funds

# Search funds
curl "http://localhost:3002/api/funds?query=sbi&limit=10"

# Get fund details
curl http://localhost:3002/api/funds/fundId123

# Get price history
curl "http://localhost:3002/api/funds/fundId123/price-history?period=1Y"

# Get suggestions
curl "http://localhost:3002/api/suggest?q=hdfc"
```

### Using PowerShell

```powershell
# Get all funds
Invoke-RestMethod -Uri "http://localhost:3002/api/funds"

# Search funds
Invoke-RestMethod -Uri "http://localhost:3002/api/funds?query=sbi&type=mutual_fund"

# Get fund details
Invoke-RestMethod -Uri "http://localhost:3002/api/funds/fundId123"

# Get suggestions
Invoke-RestMethod -Uri "http://localhost:3002/api/suggest?q=sb"
```

### Using the provided test script

```powershell
# Test all APIs
cd mutual-funds-backend
.\test-api.ps1
```

---

## Integration with Frontend

### Example: Fund List Component

```typescript
// Replace mock data with API call
const fetchFunds = async (filters: FundFilters) => {
  const params = new URLSearchParams({
    query: filters.query || '',
    type: filters.type || '',
    category: filters.category || '',
    page: String(filters.page || 1),
    limit: String(filters.limit || 20),
  });

  const response = await fetch(`${API_BASE_URL}/api/funds?${params}`);

  const result = await response.json();
  return result.data; // Array of funds
};
```

### Example: Fund Detail Page

```typescript
const fetchFundDetails = async (fundId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/funds/${fundId}`);

  const result = await response.json();
  return result.data; // Complete fund details
};
```

### Example: Chart Data

```typescript
const fetchPriceHistory = async (fundId: string, period: string) => {
  const response = await fetch(
    `${API_BASE_URL}/api/funds/${fundId}/price-history?period=${period}`
  );

  const result = await response.json();
  return result.data.data; // Array of price points
};
```

### Example: Autocomplete

```typescript
const fetchSuggestions = async (query: string) => {
  if (query.length < 2) return [];

  const response = await fetch(
    `${API_BASE_URL}/api/suggest?q=${encodeURIComponent(query)}`
  );

  const result = await response.json();
  return result.data.suggestions;
};
```

---

## Performance Notes

- All endpoints use MongoDB indexes for optimal query performance
- Pagination is implemented to handle large datasets efficiently
- Price history data is cached where appropriate
- Suggestions endpoint returns max 10 results for fast autocomplete
- Full-text search uses MongoDB text indexes

---

## Next Steps

1. **Import Fund Data**: Run `npm run import:all` to populate the database with 150+ real funds
2. **Test APIs**: Use the test scripts to verify all endpoints work correctly
3. **Update Frontend**: Replace all mock data calls with these new API endpoints
4. **Enable Caching**: Consider adding Redis caching for frequently accessed data
5. **Add Monitoring**: Set up logging and monitoring for API usage

---

## Summary

✅ **GET /api/funds** - Replaces all mock fund lists with search, filter, pagination
✅ **GET /api/funds/:id** - Returns complete fund details with manager info, holdings, sectors
✅ **GET /api/funds/:id/price-history** - Provides chart data for 1M, 3M, 1Y, 5Y periods
✅ **GET /api/suggest** - Fuzzy search autocomplete for fund names

All endpoints return **real database data** and replace mock implementations completely.
