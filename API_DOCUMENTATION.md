# 🚀 API Documentation - Mutual Funds Backend

## Base URL

```
http://localhost:3000/api
```

---

## 📋 Table of Contents

1. [Authentication APIs](#authentication-apis)
2. [Fund APIs](#fund-apis)
3. [Market Index APIs](#market-index-apis)
4. [Watchlist APIs](#watchlist-apis)
5. [Goal APIs](#goal-apis)
6. [Reminder APIs](#reminder-apis)
7. [Error Responses](#error-responses)
8. [Rate Limiting](#rate-limiting)

---

## 🔐 Authentication APIs

### Register User

```http
POST /api/auth/register
```

**Body:**

```json
{
  "email": "user@example.com",
  "password": "StrongPass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "64a7b2c3d4e5f6g7h8i9j0k1",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Login

```http
POST /api/auth/login
```

**Body:**

```json
{
  "email": "user@example.com",
  "password": "StrongPass123!"
}
```

**Response:** Same as register

### Refresh Token

```http
POST /api/auth/refresh
Headers: Authorization: Bearer <refresh_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGc..."
  }
}
```

### Get Profile

```http
GET /api/auth/profile
Headers: Authorization: Bearer <access_token>
```

### Update Profile

```http
PUT /api/auth/profile
Headers: Authorization: Bearer <access_token>
```

**Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+919876543210"
}
```

### Change Password

```http
POST /api/auth/change-password
Headers: Authorization: Bearer <access_token>
```

**Body:**

```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

---

## 💰 Fund APIs

### Get All Funds (Paginated)

```http
GET /api/funds?page=1&limit=20&category=Equity&subCategory=Large Cap&amc=HDFC
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `category` (optional): Filter by category
- `subCategory` (optional): Filter by subcategory
- `amc` (optional): Filter by AMC name
- `status` (optional): Filter by status (default: Active)

**Response:**

```json
{
  "success": true,
  "source": "cache",
  "data": [
    {
      "schemeCode": "119551",
      "schemeName": "HDFC Balanced Advantage Fund - Direct Plan - Growth",
      "amc": {
        "name": "HDFC Mutual Fund",
        "code": "HDFC"
      },
      "category": "Hybrid",
      "subCategory": "Balanced Advantage",
      "nav": {
        "value": 385.75,
        "date": "2024-12-20",
        "change": 1.25,
        "changePercent": 0.32
      },
      "aum": 45000,
      "returns": {
        "1D": 0.32,
        "1W": 1.25,
        "1M": 2.45,
        "3M": 5.67,
        "6M": 10.23,
        "1Y": 18.45,
        "3Y": 12.34,
        "5Y": 14.56
      },
      "expenseRatio": 0.45,
      "exitLoad": "1% if redeemed within 1 year",
      "fundManager": {
        "name": "Prashant Jain",
        "experience": 25
      },
      "minInvestment": {
        "lumpsum": 5000,
        "sip": 500
      },
      "status": "Active"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 125,
    "totalItems": 2500,
    "itemsPerPage": 20,
    "hasNextPage": true,
    "hasPrevPage": false,
    "nextPage": 2,
    "prevPage": null
  }
}
```

### Get Fund by Scheme Code

```http
GET /api/funds/:schemeCode
```

**Example:**

```http
GET /api/funds/119551
```

### Search Funds

```http
GET /api/funds/search?q=hdfc equity
```

**Query Parameters:**

- `q` (required): Search query (minimum 2 characters)
- `page`, `limit`: Pagination parameters

### Get Funds by Category

```http
GET /api/funds/category/Equity?page=1&limit=20
```

### Get Funds by Subcategory

```http
GET /api/funds/subcategory/Large%20Cap?page=1&limit=20
```

### Get Top Performing Funds

```http
GET /api/funds/top-performers?period=1Y&category=Equity&limit=10
```

**Query Parameters:**

- `period` (optional): 1D, 1W, 1M, 3M, 6M, 1Y, 3Y, 5Y (default: 1Y)
- `category` (optional): Filter by category
- `limit` (optional): Number of funds (default: 10)

### Get Fund Categories

```http
GET /api/funds/categories
```

**Response:**

```json
{
  "success": true,
  "source": "cache",
  "data": [
    {
      "category": "Equity",
      "count": 850,
      "subcategories": [
        "Large Cap",
        "Mid Cap",
        "Small Cap",
        "Multi Cap",
        "Flexi Cap"
      ]
    },
    {
      "category": "Debt",
      "count": 650,
      "subcategories": ["Liquid", "Ultra Short Duration", "Corporate Bond"]
    },
    {
      "category": "Hybrid",
      "count": 450,
      "subcategories": [
        "Balanced Advantage",
        "Aggressive Hybrid",
        "Conservative Hybrid"
      ]
    }
  ]
}
```

### Get Fund NAV History

```http
GET /api/funds/:schemeCode/nav?days=365
```

**Query Parameters:**

- `days` (optional): Number of days (default: 365)

**Response:**

```json
{
  "success": true,
  "source": "cache",
  "data": [
    {
      "schemeCode": "119551",
      "nav": 385.75,
      "date": "2024-12-20",
      "change": 1.25,
      "changePercent": 0.32,
      "isTradingDay": true
    }
  ],
  "meta": {
    "schemeCode": "119551",
    "days": 365,
    "count": 252
  }
}
```

### Get Fund Holdings

```http
GET /api/funds/:schemeCode/holdings
```

**Response:**

```json
{
  "success": true,
  "source": "cache",
  "data": {
    "schemeCode": "119551",
    "asOfDate": "2024-09-30",
    "topHoldings": [
      {
        "name": "HDFC Bank Ltd",
        "percentage": 8.5,
        "sector": "Financial Services"
      }
    ],
    "sectorAllocation": [
      {
        "sector": "Financial Services",
        "percentage": 25.5
      }
    ],
    "assetAllocation": {
      "equity": 65.5,
      "debt": 30.5,
      "cash": 4.0
    }
  }
}
```

---

## 📊 Market Index APIs

### Get All Market Indices

```http
GET /api/market/indices
```

**Response:**

```json
{
  "success": true,
  "source": "cache",
  "data": [
    {
      "symbol": "NIFTY50",
      "name": "Nifty 50",
      "value": 21500.75,
      "change": 125.5,
      "changePercent": 0.59,
      "open": 21400.0,
      "high": 21550.25,
      "low": 21380.5,
      "close": 21500.75,
      "volume": 250000000,
      "marketStatus": "OPEN",
      "category": "BROAD",
      "lastUpdated": "2024-12-20T15:30:00.000Z"
    }
  ],
  "marketStatus": {
    "status": "OPEN",
    "message": "Market is currently open",
    "nextEvent": "Market closes at 3:30 PM IST"
  }
}
```

### Get Specific Market Index

```http
GET /api/market/indices/:symbol
```

**Example:**

```http
GET /api/market/indices/NIFTY50
```

### Get Broad Market Indices

```http
GET /api/market/indices/broad
```

Returns: NIFTY50, SENSEX, NIFTY100, NIFTY500

### Get Sectoral Indices

```http
GET /api/market/indices/sectoral
```

Returns: BANKNIFTY, NIFTYIT, NIFTYPHARMA, etc.

### Get Market Status

```http
GET /api/market/status
```

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "OPEN",
    "message": "Market is currently open",
    "currentTime": "2024-12-20T14:30:00.000Z",
    "marketOpen": "09:15:00",
    "marketClose": "15:30:00",
    "isPreOpen": false,
    "isTradingDay": true,
    "nextTradingDay": "2024-12-23",
    "timeUntilClose": "1 hour",
    "sessionInfo": {
      "preOpen": "09:00 AM - 09:15 AM",
      "normalTrading": "09:15 AM - 03:30 PM"
    }
  }
}
```

### Get Market Summary

```http
GET /api/market/summary
```

---

## ⭐ Watchlist APIs

_All watchlist APIs require authentication_

### Get User Watchlist

```http
GET /api/watchlist
Headers: Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true,
  "source": "cache",
  "data": {
    "userId": "64a7b2c3d4e5f6g7h8i9j0k1",
    "funds": [
      {
        "schemeCode": "119551",
        "addedAt": "2024-12-15T10:30:00.000Z",
        "notes": "Long term investment"
      }
    ]
  }
}
```

### Add Fund to Watchlist

```http
POST /api/watchlist
Headers: Authorization: Bearer <access_token>
```

**Body:**

```json
{
  "schemeCode": "119551"
}
```

### Remove Fund from Watchlist

```http
DELETE /api/watchlist/:schemeCode
Headers: Authorization: Bearer <access_token>
```

### Clear Entire Watchlist

```http
DELETE /api/watchlist
Headers: Authorization: Bearer <access_token>
```

### Check if Fund is in Watchlist

```http
GET /api/watchlist/check/:schemeCode
Headers: Authorization: Bearer <access_token>
```

---

## 🎯 Goal APIs

_All goal APIs require authentication_

### Get All User Goals

```http
GET /api/goals
Headers: Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true,
  "source": "cache",
  "data": [
    {
      "_id": "64a7b2c3d4e5f6g7h8i9j0k1",
      "userId": "64a7b2c3d4e5f6g7h8i9j0k1",
      "name": "Retirement Fund",
      "description": "Building retirement corpus",
      "category": "RETIREMENT",
      "targetAmount": 10000000,
      "currentAmount": 2500000,
      "targetDate": "2045-12-31",
      "status": "ACTIVE",
      "linkedFunds": [
        {
          "schemeCode": "119551",
          "allocation": 60
        }
      ],
      "monthlyContribution": 25000,
      "expectedReturnRate": 12,
      "progressPercentage": 25,
      "daysRemaining": 7680,
      "monthsRemaining": 256
    }
  ]
}
```

### Get Goal by ID

```http
GET /api/goals/:id
Headers: Authorization: Bearer <access_token>
```

### Create New Goal

```http
POST /api/goals
Headers: Authorization: Bearer <access_token>
```

**Body:**

```json
{
  "name": "Retirement Fund",
  "description": "Building retirement corpus",
  "targetAmount": 10000000,
  "currentAmount": 0,
  "targetDate": "2045-12-31",
  "category": "RETIREMENT",
  "linkedFunds": [
    {
      "schemeCode": "119551",
      "allocation": 60
    }
  ],
  "monthlyContribution": 25000,
  "expectedReturnRate": 12
}
```

**Categories:** RETIREMENT, EDUCATION, HOME, VEHICLE, VACATION, EMERGENCY_FUND, WEALTH_CREATION, OTHER

### Update Goal

```http
PUT /api/goals/:id
Headers: Authorization: Bearer <access_token>
```

**Body:** Any fields from the create goal request

### Update Goal Progress

```http
PATCH /api/goals/:id/progress
Headers: Authorization: Bearer <access_token>
```

**Body:**

```json
{
  "currentAmount": 2500000
}
```

### Delete Goal

```http
DELETE /api/goals/:id
Headers: Authorization: Bearer <access_token>
```

### Get Goal Statistics

```http
GET /api/goals/stats
Headers: Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "ACTIVE",
      "count": 5,
      "totalTarget": 25000000,
      "totalCurrent": 8500000
    },
    {
      "_id": "ACHIEVED",
      "count": 2,
      "totalTarget": 1000000,
      "totalCurrent": 1050000
    }
  ]
}
```

---

## ⏰ Reminder APIs

_All reminder APIs require authentication_

### Get All User Reminders

```http
GET /api/reminders?status=PENDING
Headers: Authorization: Bearer <access_token>
```

**Query Parameters:**

- `status` (optional): PENDING, SENT, COMPLETED, CANCELLED

### Get Reminder by ID

```http
GET /api/reminders/:id
Headers: Authorization: Bearer <access_token>
```

### Create New Reminder

```http
POST /api/reminders
Headers: Authorization: Bearer <access_token>
```

**Body:**

```json
{
  "type": "SIP",
  "title": "Monthly SIP Payment",
  "description": "Pay SIP for HDFC Balanced Advantage Fund",
  "reminderDate": "2024-01-05T09:00:00.000Z",
  "frequency": "MONTHLY",
  "notifyVia": {
    "email": true,
    "push": true
  },
  "linkedFunds": ["119551"],
  "sipDetails": {
    "amount": 5000,
    "date": 5,
    "schemeCode": "119551"
  }
}
```

**Types:** SIP, GOAL_REVIEW, REBALANCE, DOCUMENT, CUSTOM
**Frequencies:** ONCE, DAILY, WEEKLY, MONTHLY, QUARTERLY, YEARLY

### Update Reminder

```http
PUT /api/reminders/:id
Headers: Authorization: Bearer <access_token>
```

### Mark Reminder as Completed

```http
PATCH /api/reminders/:id/complete
Headers: Authorization: Bearer <access_token>
```

### Delete Reminder

```http
DELETE /api/reminders/:id
Headers: Authorization: Bearer <access_token>
```

### Get Upcoming Reminders

```http
GET /api/reminders/upcoming?days=7
Headers: Authorization: Bearer <access_token>
```

---

## ❌ Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error Type",
  "message": "Detailed error message"
}
```

**Common HTTP Status Codes:**

- `400` - Bad Request (validation errors, missing fields)
- `401` - Unauthorized (invalid/expired token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate entry)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## 🚦 Rate Limiting

### Free Users

- **General APIs:** 100 requests per 15 minutes
- **Search APIs:** 20 requests per minute
- **Auth APIs:** 5 attempts per 15 minutes
- **Export APIs:** 5 requests per hour

### Premium Users

- **General APIs:** 1000 requests per 15 minutes
- Other limits: Same as free users

**Rate Limit Headers:**

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

**Rate Limit Exceeded Response:**

```json
{
  "success": false,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Try again in 15 minutes."
}
```

---

## 🔒 Authentication

Most endpoints require JWT authentication. Include the access token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Expiry:**

- Access Token: 15 minutes
- Refresh Token: 7 days

**Refreshing Tokens:**
When access token expires, use the refresh token endpoint to get a new access token.

---

## 📝 Notes

1. **Caching:** Most GET endpoints use Redis caching for faster responses
2. **Pagination:** Default limit is 20, maximum is 100
3. **Timezone:** All dates/times are in IST (Asia/Kolkata)
4. **Market Hours:** Real-time data available during market hours (9:15 AM - 3:30 PM IST, Mon-Fri)
5. **NAV Updates:** Fund NAVs are updated daily at 9:30 PM IST
6. **Search:** Full-text search supports partial matches and fuzzy search

---

## 🧪 Testing

### Health Check

```http
GET /health
```

**Response:**

```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-12-20T10:00:00.000Z",
  "services": {
    "database": {
      "connected": true,
      "database": "mutual-funds"
    },
    "cache": {
      "connected": true,
      "status": "ready"
    }
  }
}
```

### API Info

```http
GET /
```

**Response:**

```json
{
  "success": true,
  "message": "Mutual Funds Backend API",
  "version": "1.0.0",
  "documentation": "/api/docs",
  "endpoints": {
    "auth": "/api/auth",
    "funds": "/api/funds",
    "marketIndices": "/api/market",
    "watchlist": "/api/watchlist",
    "goals": "/api/goals",
    "reminders": "/api/reminders"
  }
}
```
