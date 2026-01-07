# ⚡ QUICK REFERENCE - System Status & Commands

## ✅ VERIFIED COMPONENTS

### Backend API (Port 3002)

- ✅ `/api/funds` - Get all funds with filters
- ✅ `/api/funds/search` - Search funds
- ✅ `/api/market/indices` - Get 11 market indices
- ✅ `/api/market/history/:symbol` - Historical chart data
- ✅ All endpoints configured with proper data transformation

### Database (MongoDB)

- ✅ 14,199 active funds
- ✅ All funds have names (schemeName field)
- ✅ NAV data in correct format ({value, date})
- ✅ 11 market indices (NIFTY50, SENSEX, BANKNIFTY, FINNIFTY, NIFTYMIDCAP, NIFTYSMALLCAP, NIFTYIT, NIFTYFMCG, NIFTYAUTO, NIFTYPHARMA, GIFTNIFTY)
- ⚠️ Returns data needs update (currently 0%)

### Frontend Pages (Port 5001)

- ✅ Home page: `/`
- ✅ Equity pages: `/equity?category=large-cap`
- ✅ Fund details: `/equity/[id]`, `/debt/[id]`, `/commodity/[id]`
- ✅ Market indices: `/market`
- ✅ Index details: `/market/[symbol]` with full info (What/Why/How/Use Cases)

### Market Index Detail Pages

All 11 indices have complete information:

| Symbol        | Full Name                | Info Page   |
| ------------- | ------------------------ | ----------- |
| NIFTY50       | NIFTY 50                 | ✅ Complete |
| SENSEX        | S&P BSE SENSEX           | ✅ Complete |
| BANKNIFTY     | NIFTY Bank               | ✅ Complete |
| FINNIFTY      | NIFTY Financial Services | ✅ Added    |
| NIFTYMIDCAP   | NIFTY Midcap 100         | ✅ Complete |
| NIFTYSMALLCAP | NIFTY Smallcap 100       | ✅ Complete |
| NIFTYIT       | NIFTY IT                 | ✅ Complete |
| NIFTYFMCG     | NIFTY FMCG               | ✅ Added    |
| NIFTYAUTO     | NIFTY Auto               | ✅ Added    |
| NIFTYPHARMA   | NIFTY Pharma             | ✅ Added    |
| GIFTNIFTY     | GIFT Nifty               | ✅ Added    |

---

## 🚀 STARTUP COMMANDS

### Quick Start (Automated)

```powershell
.\start-system.ps1
```

Automatically starts both backend and frontend, runs verification.

### Manual Start

**Terminal 1 - Backend:**

```bash
cd "c:\MF root folder\mutual-funds-backend"
npm start
```

**Terminal 2 - Frontend:**

```bash
cd "c:\MF root folder\mutual fund"
npm run dev
```

---

## 🔄 DATA UPDATE COMMANDS

### Update Fund Returns (NAV + Returns Data)

**Quick Test (2 funds):**

```bash
node run-update-returns.js 2
```

**Small Batch (100 funds, 5-8 min):**

```bash
node run-update-returns.js 100
```

**Medium Batch (500 funds, 20-25 min):**

```bash
node run-update-returns.js 500
```

**Full Update (All 14,199 funds, 4-5 hours):**

```bash
node run-update-returns.js
```

**Interactive Menu:**

```powershell
.\update-returns.ps1
```

---

## 🔍 VERIFICATION COMMANDS

### Check System Health

```bash
node verify-system.js
```

Tests:

- Backend API endpoints
- Database connections
- Fund data quality
- Market indices availability
- Frontend routing

### Check Returns Data Status

```bash
node check-returns-status.js
```

Shows:

- How many funds have returns data
- Percentage complete
- Breakdown by category
- Sample fund with data
- Recommendations

---

## 🌐 ACCESS URLS

### Backend

- Health: http://localhost:3002/api/health
- All Funds: http://localhost:3002/api/funds?limit=10
- Large Cap: http://localhost:3002/api/funds?category=equity&subCategory=largecap&limit=10
- Market Indices: http://localhost:3002/api/market/indices
- Search: http://localhost:3002/api/funds/search?q=hdfc

### Frontend

- Home: http://localhost:5001/
- Equity: http://localhost:5001/equity?category=large-cap
- Market: http://localhost:5001/market
- NIFTY 50: http://localhost:5001/market/NIFTY50
- FIN NIFTY: http://localhost:5001/market/FINNIFTY
- GIFT NIFTY: http://localhost:5001/market/GIFTNIFTY

---

## 🛠️ TROUBLESHOOTING

### Backend not starting

```bash
# Kill existing process
Get-Process node | Where-Object {$_.Path -like "*mutual-funds-backend*"} | Stop-Process -Force

# Start fresh
npm start
```

### Frontend shows 0.00% returns

```bash
# Update fund returns data
node run-update-returns.js 100

# Clear cache
node clear-redis-cache.js

# Restart backend
npm start

# Hard refresh browser
Ctrl + Shift + R
```

### Market indices not showing

```bash
# Check database
node verify-system.js

# Should show "Market indices in DB: 11"
# If 0, backend needs restart
```

### Fund detail pages error

```bash
# Check if backend transformation is working
Invoke-RestMethod -Uri 'http://localhost:3002/api/funds?limit=1' | ConvertTo-Json -Depth 5

# Should show: name, currentNav (number), returns object
```

---

## 📊 EXPECTED BEHAVIOR

### Fund Cards

- ✅ Show fund name (not blank)
- ✅ Show NAV value (₹XXX.XX)
- ⚠️ Returns may show 0.00% (need update)
- ✅ View Details button works
- ✅ Compare button works
- ✅ Overlap button works

### Market Indices Ticker

- ✅ Shows all 11 indices
- ✅ Real values from backend
- ✅ Updates every 2 hours (when backend running)
- ✅ Clickable to detail page

### Market Index Detail Pages

- ✅ Shows current value, change%, high/low
- ✅ Historical chart with period filters (1D, 6M, 1Y, 3Y, 5Y, 10Y)
- ✅ Full description (What, Why, How, Use Cases)
- ✅ Launch date and base year
- ✅ Composition details

---

## 📝 SCRIPTS CREATED

| Script                    | Purpose                 | Usage                            |
| ------------------------- | ----------------------- | -------------------------------- |
| `verify-system.js`        | Complete health check   | `node verify-system.js`          |
| `run-update-returns.js`   | Update fund returns     | `node run-update-returns.js 100` |
| `check-returns-status.js` | Check data completeness | `node check-returns-status.js`   |
| `start-system.ps1`        | Auto-start both servers | `.\start-system.ps1`             |
| `update-returns.ps1`      | Interactive update menu | `.\update-returns.ps1`           |
| `clear-redis-cache.js`    | Clear Redis cache       | `node clear-redis-cache.js`      |

---

## ⚡ QUICK WORKFLOW

### Daily Use

1. Run `.\start-system.ps1` once
2. Access http://localhost:5001
3. Backend auto-updates data (scheduled tasks)

### After Adding New Funds

1. `node run-update-returns.js 50` (update new funds)
2. `node clear-redis-cache.js` (clear cache)
3. `Ctrl + Shift + R` (refresh browser)

### System Check

1. `node verify-system.js`
2. Review output
3. Fix any issues listed

---

## 📌 KEY FILES

### Backend

- `services/fetch-fund-returns.service.js` - Returns fetching logic
- `services/scheduled-tasks.service.js` - Auto-update scheduler
- `src/controllers/fund.controller.js` - Data transformation
- `src/controllers/marketIndex.controller.js` - Market indices API

### Frontend

- `app/market/[symbol]/page.tsx` - Market index detail pages
- `app/equity/[id]/page.tsx` - Fund detail pages
- `components/market-indices.tsx` - Market indices ticker
- `lib/hooks/use-funds.ts` - Fund data fetching

---

## ✅ ALL SYSTEMS GO!

Everything is configured and ready. Just run:

```powershell
.\start-system.ps1
```

Then open: **http://localhost:5001**

---

**Last Updated:** January 1, 2026  
**System Status:** ✅ Fully Verified & Ready
