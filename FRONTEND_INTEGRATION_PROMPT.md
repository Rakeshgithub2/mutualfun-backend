# Frontend Integration Prompt for Fund Details Page

## Context

The backend API for fund details has been enhanced to return:

1. Top 15 real company holdings
2. Sector allocation data (for donut chart)
3. Comprehensive fund manager details

API Endpoint: `GET /api/funds/:fundId`

---

## Frontend Implementation Requirements

### Task Overview

Update the Fund Details page to display:

1. **Top 15 Holdings Table** - Real companies with ticker symbols, sectors, and percentages
2. **Sector Allocation Donut Chart** - Visual representation of portfolio distribution
3. **Fund Manager Details Card** - Comprehensive manager information with experience, qualifications, returns, and awards

---

## Step 1: Install Required Dependencies

```bash
npm install recharts
```

---

## Step 2: API Response Structure

The API returns data in this format:

```typescript
interface FundDetailsResponse {
  success: boolean;
  message: string;
  data: {
    // Basic Info
    id: string;
    fundId: string;
    name: string;
    category: string;
    subCategory: string;
    fundHouse: string;
    currentNav: number;
    previousNav: number;

    // Top 15 Holdings (Real Companies)
    topHoldings: Array<{
      name: string;           // e.g., "Reliance Industries"
      ticker: string;         // e.g., "RELIANCE"
      percentage: number;     // e.g., 8.5
      sector: string;         // e.g., "Energy"
      value: number;          // Value in rupees
      quantity: number;
    }>;
    holdingsCount: number;

    // Sector Allocation (for Donut Chart)
    sectorAllocation: Array<{
      sector: string;         // e.g., "Financial Services"
      percentage: number;     // e.g., 25.5
      value: number;          // Calculated from AUM
    }>;
    sectorAllocationCount: number;

    // Fund Manager Details
    fundManager: string;
    fundManagerId: string;
    managerDetails: {
      id: string;
      managerId: string;
      name: string;
      bio: string;
      experience: number;
      qualification: string[];
      designation: string;
      currentFundHouse: string;
      joinedDate: string;
      fundsManaged: number;
      totalAumManaged: number;
      averageReturns: {
        oneYear: number;
        threeYear: number;
        fiveYear: number;
      };
      awards: Array<{
        title: string;
        year: number;
        organization: string;
      }>;
      linkedin?: string;
      twitter?: string;
    } | null;

    // Other fields...
    returns: {...};
    riskMetrics: {...};
  }
}
```

---

## Step 3: Create Holdings Table Component

Create file: `components/HoldingsTable.tsx`

```tsx
interface HoldingsTableProps {
  holdings: Array<{
    name: string;
    ticker: string;
    percentage: number;
    sector: string;
    value: number;
    quantity: number;
  }>;
  count: number;
}

export default function HoldingsTable({ holdings, count }: HoldingsTableProps) {
  if (!holdings || holdings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-2">
          Top 15 Holdings (Real Companies)
        </h3>
        <p className="text-gray-500">No holdings data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold">
          Top 15 Holdings (Real Companies)
        </h3>
        <p className="text-sm text-gray-600">
          Real-world company investments - {count} holdings shown
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ticker
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sector
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                % of Portfolio
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value (₹ Cr)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {holdings.map((holding, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {holding.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    {holding.ticker}
                  </code>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {holding.sector}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                  {holding.percentage.toFixed(2)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">
                  ₹{(holding.value / 10000000).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## Step 4: Create Sector Allocation Chart Component

Create file: `components/SectorAllocationChart.tsx`

```tsx
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface SectorAllocationChartProps {
  sectorData: Array<{
    sector: string;
    percentage: number;
    value: number;
  }>;
  count: number;
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82ca9d',
  '#ffc658',
];

export default function SectorAllocationChart({
  sectorData,
  count,
}: SectorAllocationChartProps) {
  if (!sectorData || sectorData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-2">Sector Allocation</h3>
        <p className="text-gray-500">No sector allocation data available</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded shadow-lg border">
          <p className="font-semibold">{data.sector}</p>
          <p className="text-sm">
            Percentage: <span className="font-medium">{data.percentage}%</span>
          </p>
          <p className="text-sm">
            Value:{' '}
            <span className="font-medium">
              ₹{(data.value / 10000000).toFixed(2)} Cr
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  const renderLabel = (entry: any) => {
    return `${entry.sector}: ${entry.percentage}%`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Sector Allocation</h3>
        <p className="text-sm text-gray-600">
          Portfolio distribution across {count} sectors
        </p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={sectorData}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={renderLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="percentage"
          >
            {sectorData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry: any) =>
              `${entry.payload.sector} (${entry.payload.percentage}%)`
            }
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
```

---

## Step 5: Create Fund Manager Card Component

Create file: `components/FundManagerCard.tsx`

```tsx
interface FundManagerCardProps {
  manager: {
    id: string;
    name: string;
    bio: string;
    experience: number;
    qualification: string[];
    designation: string;
    currentFundHouse: string;
    fundsManaged: number;
    totalAumManaged: number;
    averageReturns: {
      oneYear: number;
      threeYear: number;
      fiveYear: number;
    };
    awards: Array<{
      title: string;
      year: number;
      organization: string;
    }>;
    linkedin?: string;
    twitter?: string;
  } | null;
  fallbackName?: string;
}

export default function FundManagerCard({
  manager,
  fallbackName,
}: FundManagerCardProps) {
  if (!manager) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-2">Fund Manager</h3>
        <p className="text-gray-700">
          {fallbackName || 'Information not available'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Fund Manager Details</h3>

      {/* Header */}
      <div className="border-b pb-4 mb-4">
        <h4 className="text-2xl font-bold text-gray-900">{manager.name}</h4>
        <p className="text-gray-600">{manager.designation}</p>
        <p className="text-sm text-gray-500">{manager.currentFundHouse}</p>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded">
          <p className="text-xs text-gray-600 mb-1">Experience</p>
          <p className="text-xl font-bold text-blue-600">
            {manager.experience} yrs
          </p>
        </div>
        <div className="bg-green-50 p-3 rounded">
          <p className="text-xs text-gray-600 mb-1">Funds Managed</p>
          <p className="text-xl font-bold text-green-600">
            {manager.fundsManaged}
          </p>
        </div>
        <div className="bg-purple-50 p-3 rounded">
          <p className="text-xs text-gray-600 mb-1">Total AUM</p>
          <p className="text-xl font-bold text-purple-600">
            ₹{manager.totalAumManaged.toFixed(0)} Cr
          </p>
        </div>
        <div className="bg-orange-50 p-3 rounded">
          <p className="text-xs text-gray-600 mb-1">Qualification</p>
          <p className="text-sm font-semibold text-orange-600">
            {manager.qualification.join(', ')}
          </p>
        </div>
      </div>

      {/* Biography */}
      {manager.bio && (
        <div className="mb-6">
          <h5 className="font-semibold text-gray-900 mb-2">Biography</h5>
          <p className="text-gray-700 leading-relaxed">{manager.bio}</p>
        </div>
      )}

      {/* Average Returns */}
      <div className="mb-6">
        <h5 className="font-semibold text-gray-900 mb-3">
          Average Returns Track Record
        </h5>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600 mb-1">1 Year</p>
            <p className="text-2xl font-bold text-green-600">
              {manager.averageReturns.oneYear.toFixed(2)}%
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600 mb-1">3 Year</p>
            <p className="text-2xl font-bold text-green-600">
              {manager.averageReturns.threeYear.toFixed(2)}%
            </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600 mb-1">5 Year</p>
            <p className="text-2xl font-bold text-green-600">
              {manager.averageReturns.fiveYear.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Awards */}
      {manager.awards && manager.awards.length > 0 && (
        <div className="mb-6">
          <h5 className="font-semibold text-gray-900 mb-3">
            Awards & Recognition
          </h5>
          <ul className="space-y-2">
            {manager.awards.map((award, index) => (
              <li key={index} className="flex items-start">
                <span className="text-yellow-500 mr-2">🏆</span>
                <div>
                  <p className="font-medium text-gray-900">{award.title}</p>
                  <p className="text-sm text-gray-600">
                    {award.organization} • {award.year}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Social Links */}
      {(manager.linkedin || manager.twitter) && (
        <div className="flex gap-3 pt-4 border-t">
          {manager.linkedin && (
            <a
              href={manager.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" />
              </svg>
              LinkedIn
            </a>
          )}
          {manager.twitter && (
            <a
              href={`https://twitter.com/${manager.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
              Twitter
            </a>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## Step 6: Update Fund Details Page

Update your main fund details page component:

```tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HoldingsTable from './components/HoldingsTable';
import SectorAllocationChart from './components/SectorAllocationChart';
import FundManagerCard from './components/FundManagerCard';

export default function FundDetailsPage() {
  const { fundId } = useParams();
  const [fundData, setFundData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFundDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/funds/${fundId}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch fund details');
        }

        const result = await response.json();
        setFundData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (fundId) {
      fetchFundDetails();
    }
  }, [fundId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading fund details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!fundData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No fund data found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Fund Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {fundData.name}
        </h1>
        <p className="text-lg text-gray-600">{fundData.fundHouse}</p>
        <div className="mt-4 flex gap-4">
          <div>
            <p className="text-sm text-gray-500">Category</p>
            <p className="font-semibold">
              {fundData.category} - {fundData.subCategory}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Current NAV</p>
            <p className="font-semibold text-green-600">
              ₹{fundData.currentNav.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">AUM</p>
            <p className="font-semibold">₹{fundData.aum} Cr</p>
          </div>
        </div>
      </div>

      {/* Top 15 Holdings */}
      <HoldingsTable
        holdings={fundData.topHoldings}
        count={fundData.holdingsCount}
      />

      {/* Sector Allocation Chart */}
      <SectorAllocationChart
        sectorData={fundData.sectorAllocation}
        count={fundData.sectorAllocationCount}
      />

      {/* Fund Manager Details */}
      <FundManagerCard
        manager={fundData.managerDetails}
        fallbackName={fundData.fundManager}
      />
    </div>
  );
}
```

---

## Step 7: Add CSS (if using Tailwind)

Ensure Tailwind CSS is configured in your project. The components above use Tailwind utility classes.

If not using Tailwind, you can add custom CSS or use your existing styling framework.

---

## Testing Checklist

After implementation, test the following:

- [ ] Fund details page loads without errors
- [ ] Top 15 holdings table displays with company names, tickers, sectors, and percentages
- [ ] Sector allocation donut chart renders correctly with proper colors and labels
- [ ] Chart tooltip shows sector name, percentage, and value on hover
- [ ] Fund manager card displays all details: bio, experience, qualifications, returns, awards
- [ ] Social media links (LinkedIn, Twitter) work correctly
- [ ] Empty states display properly when data is not available
- [ ] Page is responsive on mobile, tablet, and desktop
- [ ] Loading state shows while fetching data
- [ ] Error state shows if API call fails

---

## API Endpoint Reference

**Base URL**: `https://your-backend-url.vercel.app` or `http://localhost:3002`

**Endpoint**: `/api/funds/:fundId`

**Method**: `GET`

**Example**:

```bash
GET https://your-backend-url.vercel.app/api/funds/HDFC_TOP100_DIR
```

---

## Notes

1. Replace `${import.meta.env.VITE_API_BASE_URL}` with your actual API base URL
2. The backend already returns all required data in a single API call
3. All percentages are pre-calculated and ready to display
4. Holdings include real company names and ticker symbols
5. Sector allocation values are calculated from AUM automatically

---

## Support

For detailed API documentation, refer to:

- Backend: `FUND_DETAILS_API_DOCUMENTATION.md`
- Changes Summary: `BACKEND_CHANGES_SUMMARY.md`
