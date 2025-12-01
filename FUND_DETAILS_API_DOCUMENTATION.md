# Fund Details API Documentation

## Overview

This document describes the enhanced Fund Details API that returns comprehensive fund information including top 15 holdings (real companies), sector allocation for donut charts, and detailed fund manager information.

## Endpoint

### GET /api/funds/:fundId

Get complete details for a specific mutual fund.

**URL Parameters:**

- `fundId` (string, required) - The unique identifier of the fund

**Response Format:**

```json
{
  "success": true,
  "message": "Fund details retrieved successfully",
  "data": {
    // Basic Information
    "id": "673e1234567890abcdef1234",
    "fundId": "HDFC_TOP100_DIR",
    "name": "HDFC Top 100 Fund Direct Plan Growth",
    "category": "equity",
    "subCategory": "Large Cap",
    "fundType": "mutual_fund",
    "fundHouse": "HDFC Mutual Fund",
    "launchDate": "2010-01-15T00:00:00.000Z",

    // NAV Information
    "currentNav": 285.5,
    "previousNav": 282.75,
    "navDate": "2025-11-19T00:00:00.000Z",
    "navChange": 2.75,
    "navChangePercent": 0.97,

    // Financial Metrics
    "aum": 45000,
    "expenseRatio": 1.25,
    "exitLoad": 1.0,
    "minInvestment": 5000,
    "sipMinAmount": 500,

    // Performance Returns (all in percentage)
    "returns": {
      "day": 0.97,
      "week": 2.15,
      "month": 5.42,
      "threeMonth": 8.75,
      "sixMonth": 12.3,
      "oneYear": 18.45,
      "threeYear": 15.2,
      "fiveYear": 13.85,
      "sinceInception": 12.95
    },

    // Risk Metrics
    "riskMetrics": {
      "sharpeRatio": 0.85,
      "standardDeviation": 16.5,
      "beta": 0.95,
      "alpha": 2.1,
      "rSquared": 0.88,
      "sortino": 1.12
    },

    // Top 15 Holdings (Real Companies)
    "topHoldings": [
      {
        "name": "Reliance Industries",
        "ticker": "RELIANCE",
        "percentage": 8.5,
        "sector": "Energy",
        "value": 3825000000,
        "quantity": 0
      },
      {
        "name": "HDFC Bank",
        "ticker": "HDFCBANK",
        "percentage": 7.2,
        "sector": "Financial Services",
        "value": 3240000000,
        "quantity": 0
      },
      {
        "name": "Infosys",
        "ticker": "INFY",
        "percentage": 6.8,
        "sector": "IT",
        "value": 3060000000,
        "quantity": 0
      }
      // ... up to 15 holdings
    ],
    "holdingsCount": 15,

    // Sector Allocation (for Donut Chart)
    "sectorAllocation": [
      {
        "sector": "Financial Services",
        "percentage": 25.5,
        "value": 11475000000
      },
      {
        "sector": "IT",
        "percentage": 18.2,
        "value": 8190000000
      },
      {
        "sector": "Energy",
        "percentage": 12.8,
        "value": 5760000000
      },
      {
        "sector": "Consumer Goods",
        "percentage": 10.5,
        "value": 4725000000
      },
      {
        "sector": "Healthcare",
        "percentage": 8.9,
        "value": 4005000000
      }
    ],
    "sectorAllocationCount": 5,

    // Fund Manager Details
    "fundManager": "Prashant Jain",
    "fundManagerId": "MGR_001",
    "managerDetails": {
      "id": "673e1234567890abcdef5678",
      "managerId": "MGR_001",
      "name": "Prashant Jain",
      "bio": "Experienced fund manager with 28 years in equity markets",
      "experience": 28,
      "qualification": ["MBA", "CFA"],
      "designation": "CIO - Equity",
      "currentFundHouse": "HDFC Mutual Fund",
      "joinedDate": "1995-01-01T00:00:00.000Z",
      "fundsManaged": 5,
      "totalAumManaged": 125000,
      "averageReturns": {
        "oneYear": 19.5,
        "threeYear": 16.2,
        "fiveYear": 14.8
      },
      "awards": [
        {
          "title": "Best Equity Fund Manager",
          "year": 2023,
          "organization": "Morningstar"
        }
      ],
      "linkedin": "https://linkedin.com/in/prashant-jain",
      "twitter": "@prashjain"
    },

    // Ratings
    "ratings": {
      "morningstar": 4.0,
      "crisil": 4.0,
      "valueResearch": 4.0
    },

    // Metadata
    "popularity": 95,
    "tags": ["Large Cap", "Bluechip", "Long Term", "SIP"],
    "lastUpdated": "2025-11-19T00:00:00.000Z"
  }
}
```

## Frontend Integration Guide

### 1. Display Top 15 Holdings (Real Companies)

The `topHoldings` array contains up to 15 real company investments. Each holding includes:

- Company name (e.g., "Reliance Industries")
- Stock ticker symbol (e.g., "RELIANCE")
- Percentage of portfolio
- Sector classification
- Value in rupees

**UI Component Example:**

```jsx
<div className="holdings-section">
  <h3>Top 15 Holdings (Real Companies)</h3>
  <p className="subtitle">
    Real-world company investments - {data.holdingsCount} holdings shown
  </p>

  {data.topHoldings.length > 0 ? (
    <table className="holdings-table">
      <thead>
        <tr>
          <th>Company</th>
          <th>Ticker</th>
          <th>Sector</th>
          <th>% of Portfolio</th>
          <th>Value (₹)</th>
        </tr>
      </thead>
      <tbody>
        {data.topHoldings.map((holding, index) => (
          <tr key={index}>
            <td>{holding.name}</td>
            <td>{holding.ticker}</td>
            <td>{holding.sector}</td>
            <td>{holding.percentage.toFixed(2)}%</td>
            <td>₹{(holding.value / 10000000).toFixed(2)} Cr</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <div className="no-data">No holdings data available</div>
  )}
</div>
```

### 2. Display Sector Allocation (Donut Chart)

The `sectorAllocation` array is formatted for donut/pie chart visualization. Each sector includes:

- Sector name
- Percentage of portfolio
- Calculated value from AUM

**Chart Component Example (using Recharts):**

```jsx
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

<div className="sector-allocation">
  <h3>Sector Allocation</h3>
  <p className="subtitle">Portfolio distribution across sectors</p>

  {data.sectorAllocation.length > 0 ? (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data.sectorAllocation}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ sector, percentage }) => `${sector}: ${percentage}%`}
          outerRadius={120}
          fill="#8884d8"
          dataKey="percentage"
        >
          {data.sectorAllocation.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => [
            `${value}% (₹${(props.payload.value / 10000000).toFixed(2)} Cr)`,
            props.payload.sector,
          ]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  ) : (
    <div className="no-data">No sector allocation data available</div>
  )}
</div>;
```

### 3. Display Fund Manager Details

The `managerDetails` object contains comprehensive information about the fund manager.

**UI Component Example:**

```jsx
<div className="fund-manager-section">
  <h3>Fund Manager Details</h3>

  {data.managerDetails ? (
    <div className="manager-card">
      <div className="manager-header">
        <h4>{data.managerDetails.name}</h4>
        <span className="designation">{data.managerDetails.designation}</span>
      </div>

      <div className="manager-info">
        <div className="info-row">
          <span className="label">Experience:</span>
          <span className="value">{data.managerDetails.experience} years</span>
        </div>

        <div className="info-row">
          <span className="label">Qualification:</span>
          <span className="value">
            {data.managerDetails.qualification.join(', ')}
          </span>
        </div>

        <div className="info-row">
          <span className="label">Current Fund House:</span>
          <span className="value">{data.managerDetails.currentFundHouse}</span>
        </div>

        <div className="info-row">
          <span className="label">Funds Managed:</span>
          <span className="value">{data.managerDetails.fundsManaged}</span>
        </div>

        <div className="info-row">
          <span className="label">Total AUM:</span>
          <span className="value">
            ₹{data.managerDetails.totalAumManaged.toFixed(2)} Cr
          </span>
        </div>
      </div>

      {data.managerDetails.bio && (
        <div className="manager-bio">
          <h5>Biography</h5>
          <p>{data.managerDetails.bio}</p>
        </div>
      )}

      <div className="manager-returns">
        <h5>Average Returns</h5>
        <div className="returns-grid">
          <div className="return-item">
            <span className="period">1 Year</span>
            <span className="return">
              {data.managerDetails.averageReturns.oneYear}%
            </span>
          </div>
          <div className="return-item">
            <span className="period">3 Year</span>
            <span className="return">
              {data.managerDetails.averageReturns.threeYear}%
            </span>
          </div>
          <div className="return-item">
            <span className="period">5 Year</span>
            <span className="return">
              {data.managerDetails.averageReturns.fiveYear}%
            </span>
          </div>
        </div>
      </div>

      {data.managerDetails.awards && data.managerDetails.awards.length > 0 && (
        <div className="manager-awards">
          <h5>Awards & Recognition</h5>
          <ul>
            {data.managerDetails.awards.map((award, index) => (
              <li key={index}>
                {award.title} - {award.organization} ({award.year})
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="social-links">
        {data.managerDetails.linkedin && (
          <a
            href={data.managerDetails.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        )}
        {data.managerDetails.twitter && (
          <a
            href={`https://twitter.com/${data.managerDetails.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
        )}
      </div>
    </div>
  ) : (
    <div className="no-data">
      Fund Manager: {data.fundManager || 'Information not available'}
    </div>
  )}
</div>
```

## Error Handling

### No Holdings Data

If `topHoldings` is empty or undefined:

```jsx
{
  data.topHoldings.length === 0 && (
    <div className="alert alert-info">
      No holdings data available. This fund may be new or holdings data is being
      updated.
    </div>
  );
}
```

### No Sector Allocation

If `sectorAllocation` is empty or undefined:

```jsx
{
  data.sectorAllocation.length === 0 && (
    <div className="alert alert-info">
      No sector allocation data available. Portfolio distribution information is
      being updated.
    </div>
  );
}
```

### No Manager Details

If `managerDetails` is null:

```jsx
{
  !data.managerDetails && (
    <div className="alert alert-info">
      Fund Manager: {data.fundManager}
      <br />
      Detailed information not available.
    </div>
  );
}
```

## Example API Call

```javascript
// Fetch fund details
const fetchFundDetails = async (fundId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/funds/${fundId}`, {
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if needed
        // 'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch fund details');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching fund details:', error);
    throw error;
  }
};

// Usage
const fundData = await fetchFundDetails('HDFC_TOP100_DIR');
console.log('Holdings:', fundData.topHoldings);
console.log('Sectors:', fundData.sectorAllocation);
console.log('Manager:', fundData.managerDetails);
```

## Notes

1. **Real Companies**: The `topHoldings` array contains actual company investments, not mock data. Display ticker symbols for credibility.

2. **Donut Chart**: Use the `percentage` field from `sectorAllocation` for the chart. The `value` field is calculated from AUM for display purposes.

3. **Manager Details**: If `managerDetails` is null, fallback to the `fundManager` string field which contains the manager name.

4. **Data Freshness**: Check `lastUpdated` field to show users when the data was last refreshed.

5. **Percentages**: All percentage values in holdings and sector allocation are already calculated and ready to display.
