# 🎯 FRONTEND QUICK START GUIDE

> **The fastest way to get your frontend working with the backend**

---

## ⚡ 5-MINUTE SETUP

### 1. Environment Variable (30 seconds)

Create `.env.local`:

```bash
VITE_API_URL=http://localhost:3002/api
```

### 2. Install Axios (30 seconds)

```bash
npm install axios
```

### 3. Create API File (2 minutes)

**File**: `src/api/funds.js` or `funds.ts`

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

export const fetchFunds = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.category)
    params.append('category', filters.category.toLowerCase());
  if (filters.page) params.append('page', filters.page);
  params.append('limit', filters.limit || 20);

  const response = await axios.get(`${API_URL}/funds?${params}`);
  return response.data;
};

export const fetchFundDetails = async (fundId) => {
  const response = await axios.get(`${API_URL}/funds/${fundId}/details`);
  return response.data.data;
};

export const fetchMarketIndices = async () => {
  const response = await axios.get(`${API_URL}/market/summary`);
  return response.data.data;
};
```

### 4. Create Component (2 minutes)

**File**: `src/components/FundList.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { fetchFunds } from '../api/funds';

export const FundList = () => {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFunds();
  }, []);

  const loadFunds = async () => {
    try {
      setLoading(true);
      const response = await fetchFunds({ page: 1, limit: 20 });
      setFunds(response.data);
      console.log('✅ Loaded', response.pagination.total, 'total funds');
    } catch (err) {
      setError(err.message);
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading funds...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Mutual Funds ({funds.length})</h1>
      <div className="grid grid-cols-3 gap-4">
        {funds.map((fund) => (
          <div key={fund.fundId} className="border p-4 rounded">
            <h3 className="font-bold">{fund.name}</h3>
            <p>NAV: ₹{fund.currentNav.toFixed(2)}</p>
            <p>1Y Return: {fund.returns.oneYear.toFixed(2)}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 5. Test (30 seconds)

```bash
# Start backend (separate terminal)
cd backend && npm run dev:direct

# Start frontend
npm run dev
```

Open browser → Should see 20 funds displayed!

---

## 🔥 MOST COMMON ISSUES

### Issue: "Network Error"

```javascript
// Check backend is running
fetch('http://localhost:3002/health')
  .then((r) => r.text())
  .then(console.log); // Should print "OK"
```

### Issue: "No funds showing"

```javascript
// Debug in component
useEffect(() => {
  fetchFunds({ page: 1, limit: 5 })
    .then((response) => {
      console.log('✅ Response:', response);
      console.log('✅ Data:', response.data);
      console.log('✅ Total:', response.pagination.total);
    })
    .catch((err) => console.error('❌ Error:', err));
}, []);
```

### Issue: CORS Error

In backend `.env`, add your frontend port:

```bash
ALLOWED_ORIGINS=http://localhost:5173
```

---

## 📊 BACKEND API CHEATSHEET

### Get All Funds

```javascript
GET /api/funds?page=1&limit=20
// Returns: { success: true, data: [...], pagination: {...} }
```

### Filter by Category

```javascript
GET /api/funds?category=equity&page=1
// Categories: equity, debt, hybrid, commodity, index, elss
```

### Get Fund Details

```javascript
GET /api/funds/:fundId/details
// Returns: Full fund info + sectors + holdings + manager
```

### Market Indices

```javascript
GET / api / market / summary;
// Returns: Nifty, Sensex, Bank Nifty with live values
```

### Search

```javascript
GET /api/search/suggest?query=hdfc
// Returns: Matching funds
```

---

## ✅ EXPECTED RESULTS

After setup:

- ✅ Backend returns 4,485 total funds
- ✅ Frontend displays 20 funds per page
- ✅ Pagination shows correct total count
- ✅ Console logs show API responses
- ✅ No CORS errors

---

## 🎯 NEXT STEPS

Once basic list works:

1. **Add Filters**: Category dropdown, subcategory, sort
2. **Add Pagination**: Previous/Next buttons
3. **Add Details Page**: Click fund → Show full details
4. **Add Market Dashboard**: Display live indices at top
5. **Add Search**: Autocomplete search box
6. **Styling**: Use Tailwind/MUI for better UI

---

## 📄 FULL IMPLEMENTATION

For complete components with all features, see:

- **FRONTEND_IMPLEMENTATION_COMPLETE_GUIDE.md** (Full guide with all components)
- **FRONTEND_FIX_PROMPT_COMPLETE.md** (Original detailed specification)

---

## 🆘 DEBUGGING COMMANDS

```bash
# Test backend health
curl http://localhost:3002/health

# Test API directly
curl "http://localhost:3002/api/funds?limit=5"

# Check backend logs
# Look in backend terminal for any errors

# Check frontend network requests
# Open DevTools → Network tab → Look for /api/funds
```

---

## 💡 PRO TIPS

1. **Always check backend first**: `http://localhost:3002/health`
2. **Use browser DevTools**: Console + Network tab are your friends
3. **Start simple**: Get basic list working, then add filters
4. **Log everything**: Use `console.log` to debug API responses
5. **Read backend logs**: Backend terminal shows all API calls

---

**Time to working frontend**: ~5 minutes  
**Backend status**: ✅ Working (4,485 funds ready)  
**Start now**: Copy code above and test!
