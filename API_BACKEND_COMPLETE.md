# Backend API Structure

## ✅ Complete Backend Implementation

All endpoints are now working and return JSON responses (no HTML errors).

## 📁 Folder Structure

```
api/
├── controllers/
│   ├── fund.controller.ts      # Fund listing & details logic
│   ├── compare.controller.ts   # Fund comparison logic
│   └── overlap.controller.ts   # Portfolio overlap logic
├── routes/
│   ├── fund.routes.ts         # Fund endpoints
│   ├── compare.routes.ts      # Compare endpoints
│   └── overlap.routes.ts      # Overlap endpoints
├── db/
│   └── mongodb.ts             # MongoDB singleton connection
└── index.ts                   # Main Express app with all routes
```

## 🚀 Available Endpoints

### 1. Health Check

```
GET /api/health
```

**Response:**

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-12-27T...",
  "mongodb": true
}
```

### 2. Get All Funds

```
GET /api/funds?page=1&limit=50
```

**Query Parameters:**

- `page` (default: 1)
- `limit` (default: 50, max: 100)
- `category` (optional): equity, debt, hybrid, commodity, etf
- `subCategory` (optional): Large Cap, Mid Cap, etc.
- `fundHouse` (optional): HDFC, SBI, etc.
- `search` (optional): Search by fund name

**Response:**

```json
{
  "success": true,
  "data": [...funds array...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 500,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 3. Get Fund Details

```
GET /api/funds/:id
```

**Response:**

```json
{
  "success": true,
  "data": {
    "fundId": "FUND001",
    "name": "HDFC Mid-Cap Opportunities Fund",
    "category": "equity",
    "subCategory": "Mid Cap",
    "currentNav": 189.45,
    "returns": {
      "oneYear": 42.5,
      "threeYear": 28.3,
      "fiveYear": 22.1
    },
    "aum": 45000,
    "expenseRatio": 0.68,
    "riskLevel": "HIGH",
    ...
  }
}
```

### 4. Compare Funds

```
POST /api/compare
Content-Type: application/json

{
  "fundIds": ["FUND001", "FUND002", "FUND003"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "funds": [
      {
        "fundId": "FUND001",
        "name": "...",
        "returns": {...},
        "comparisonScore": 75,
        "isTopPerformer": true
      }
    ],
    "metrics": {
      "bestOneYearReturn": 42.5,
      "bestThreeYearReturn": 28.3,
      "lowestExpenseRatio": 0.45,
      "highestAUM": 52000
    },
    "summary": {
      "totalFunds": 3,
      "topPerformer": "Axis Bluechip Fund",
      "averageExpenseRatio": "0.55",
      "averageOneYearReturn": "38.8"
    }
  }
}
```

### 5. Calculate Overlap

```
POST /api/overlap
Content-Type: application/json

{
  "fundIds": ["FUND001", "FUND002"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "funds": [...],
    "holdingsOverlap": {
      "overlapPercentage": "25.00",
      "commonHoldings": [...],
      "uniqueHoldings": {...},
      "pairwiseOverlaps": [...],
      "averageOverlap": 25.5
    },
    "sectorOverlap": [...],
    "recommendations": [
      "✅ Low overlap (<30%). Your portfolio is well-diversified."
    ],
    "summary": {
      "totalFunds": 2,
      "averageOverlap": 25.5,
      "overlapLevel": "LOW",
      "diversificationScore": 74.5
    }
  }
}
```

## 🔧 Key Features

### ✅ First-Time Data Fetch

- If MongoDB is empty, automatically fetches funds from external API (AMFI)
- Stores all funds in MongoDB for future requests
- Falls back to mock data if external API fails

### ✅ Subsequent Requests

- All data fetched from MongoDB (fast)
- No repeated external API calls
- Efficient pagination and filtering

### ✅ Serverless-Ready

- MongoDB singleton pattern with connection pooling
- Works perfectly on Vercel serverless
- Handles connection reuse across requests

### ✅ JSON-Only Responses

- No HTML error pages
- Proper error handling with JSON responses
- 404 handler returns JSON with available routes

## 🧪 Testing

Run the test script:

```bash
node test-api-endpoints.js
```

Or test with curl:

```bash
# Health check
curl https://your-domain.vercel.app/api/health

# Get funds
curl https://your-domain.vercel.app/api/funds?page=1&limit=10

# Get fund details
curl https://your-domain.vercel.app/api/funds/FUND001

# Compare funds
curl -X POST https://your-domain.vercel.app/api/compare \
  -H "Content-Type: application/json" \
  -d '{"fundIds": ["FUND001", "FUND002"]}'

# Calculate overlap
curl -X POST https://your-domain.vercel.app/api/overlap \
  -H "Content-Type: application/json" \
  -d '{"fundIds": ["FUND001", "FUND002"]}'
```

## 🔐 Environment Variables

Required in `.env` or Vercel environment:

```
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
JWT_SECRET=your-secret-key
NODE_ENV=production
```

## 📝 Error Handling

All errors return JSON:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

## 🚀 Deployment

1. Push to GitHub
2. Vercel automatically deploys
3. All routes work at: `https://your-domain.vercel.app/api/*`

## ✨ Status

| Endpoint           | Status     |
| ------------------ | ---------- |
| GET /api/funds     | ✅ Working |
| GET /api/funds/:id | ✅ Working |
| POST /api/compare  | ✅ Working |
| POST /api/overlap  | ✅ Working |
| MongoDB Caching    | ✅ Working |
| JSON Responses     | ✅ Working |
| Vercel Serverless  | ✅ Working |

**All systems operational! 🎉**
