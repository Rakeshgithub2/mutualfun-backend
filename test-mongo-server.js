const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');

const DATABASE_URL = 'mongodb://localhost:27017/mutual_funds_db';
const app = express();
const PORT = 3002;

app.use(
  cors({
    origin: ['http://localhost:5001', 'http://localhost:3000'],
    credentials: true,
  })
);
app.use(express.json());

let db = null;
let client = null;

// Connect to MongoDB
async function connectDB() {
  try {
    client = new MongoClient(DATABASE_URL);
    await client.connect();
    db = client.db('mutual_funds_db');
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    return false;
  }
}

// GET /api/funds - Return funds with proper filtering
app.get('/api/funds', async (req, res) => {
  try {
    console.log('📥 GET /api/funds -', req.query);

    if (!db) {
      await connectDB();
    }

    const { category, query, limit = '20', page = '1' } = req.query;
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const skip = (pageNum - 1) * limitNum;

    // Build MongoDB query
    const filter = { isActive: true };

    if (category) {
      // For equity, get funds with proper subcategories (not "Other")
      if (category === 'equity') {
        filter.category = 'equity';
        filter.subCategory = {
          $in: [
            'Large Cap',
            'Mid Cap',
            'Small Cap',
            'Multi Cap',
            'Flexi Cap',
            'ELSS',
            'Sectoral',
            'Thematic',
            'Value Fund',
            'Contra Fund',
            'Dividend Yield',
            'Focused Fund',
            'Large & Mid Cap',
          ],
        };
      } else if (category === 'commodity') {
        filter.category = 'commodity';
      } else {
        filter.category = category;
      }
    }

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { fundHouse: { $regex: query, $options: 'i' } },
      ];
    }

    console.log('🔍 MongoDB filter:', JSON.stringify(filter));

    // Get funds
    const funds = await db
      .collection('funds')
      .find(filter)
      .sort({ popularity: -1 })
      .skip(skip)
      .limit(limitNum)
      .toArray();

    // Get total count
    const total = await db.collection('funds').countDocuments(filter);

    console.log(`✅ Found ${funds.length} funds (total: ${total})`);

    // Transform response
    const transformedFunds = funds.map((fund) => ({
      id: fund._id || fund.fundId,
      fundId: fund.fundId,
      name: fund.name,
      category: fund.category,
      subCategory: fund.subCategory,
      fundType: fund.fundType,
      fundHouse: fund.fundHouse,
      currentNav: fund.currentNav,
      previousNav: fund.previousNav,
      navDate: fund.navDate,
      returns: fund.returns,
      riskMetrics: {
        sharpeRatio: fund.riskMetrics?.sharpeRatio,
        standardDeviation: fund.riskMetrics?.standardDeviation,
      },
      aum: fund.aum,
      expenseRatio: fund.expenseRatio,
      ratings: fund.ratings,
      popularity: fund.popularity,
    }));

    res.json({
      success: true,
      message: 'Funds retrieved successfully',
      data: transformedFunds,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        hasMore: skip + funds.length < total,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching funds:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch funds',
    });
  }
});

// GET /api/funds/:id - Get fund details
app.get('/api/funds/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('📥 GET /api/funds/:id -', id);

    if (!db) await connectDB();

    const fund = await db.collection('funds').findOne({ fundId: id });

    if (!fund) {
      return res.status(404).json({
        success: false,
        error: 'Fund not found',
      });
    }

    res.json({
      success: true,
      message: 'Fund details retrieved successfully',
      data: fund,
    });
  } catch (error) {
    console.error('❌ Error fetching fund:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/suggest - Autocomplete
app.get('/api/suggest', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({
        success: true,
        message: 'Query too short',
        data: { query: q, count: 0, suggestions: [] },
      });
    }

    console.log('📥 GET /api/suggest - query:', q);

    if (!db) await connectDB();

    const suggestions = await db
      .collection('funds')
      .find({
        isActive: true,
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { fundHouse: { $regex: q, $options: 'i' } },
        ],
      })
      .limit(10)
      .toArray();

    const formatted = suggestions.map((fund) => ({
      id: fund._id || fund.fundId,
      fundId: fund.fundId,
      name: fund.name,
      category: fund.category,
      fundType: fund.fundType,
      fundHouse: fund.fundHouse,
      currentNav: fund.currentNav,
      returns: {
        oneYear: fund.returns?.oneYear,
        threeYear: fund.returns?.threeYear,
      },
    }));

    res.json({
      success: true,
      message: 'Suggestions retrieved successfully',
      data: {
        query: q,
        count: formatted.length,
        suggestions: formatted,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching suggestions:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/market-indices - Market indices data
app.get('/api/market-indices', async (req, res) => {
  try {
    console.log('📈 GET /api/market-indices - Request received');

    const marketIndices = [
      {
        id: 'nifty50',
        name: 'NIFTY 50',
        shortName: 'NIFTY',
        value: 19674.25 + (Math.random() - 0.5) * 100,
        change: 125.5 + (Math.random() - 0.5) * 20,
        changePercent: 0.64 + (Math.random() - 0.5) * 0.5,
        high: 19698.4,
        low: 19534.8,
        open: 19548.75,
        previousClose: 19548.75,
        volume: '2.1B',
        marketCap: '₹120.5 Lakh Cr',
        lastUpdated: new Date().toISOString(),
        constituents: 50,
        description: 'Top 50 companies by market capitalization',
      },
      {
        id: 'sensex',
        name: 'S&P BSE SENSEX',
        shortName: 'SENSEX',
        value: 65930.77 + (Math.random() - 0.5) * 100,
        change: 389.45 + (Math.random() - 0.5) * 20,
        changePercent: 0.59 + (Math.random() - 0.5) * 0.5,
        high: 66025.35,
        low: 65541.32,
        open: 65541.32,
        previousClose: 65541.32,
        volume: '1.8B',
        marketCap: '₹285.2 Lakh Cr',
        lastUpdated: new Date().toISOString(),
        constituents: 30,
        description: 'Top 30 companies listed on BSE',
      },
    ];

    res.json({
      success: true,
      message: 'Market indices retrieved successfully',
      data: marketIndices,
      timestamp: new Date().toISOString(),
    });

    console.log('✅ Market indices data sent successfully');
  } catch (error) {
    console.error('❌ Error fetching market indices:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    mongodb: db ? 'connected' : 'disconnected',
  });
});

// Start server
connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Test MongoDB server running on http://0.0.0.0:${PORT}`);
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(
      `📊 Test: http://localhost:${PORT}/api/funds?category=equity&limit=10`
    );
  });
});

// Keep server running without auto-exit
process.on('SIGTERM', () => {
  console.log('SIGTERM received, but keeping server running for development');
});

process.on('SIGINT', () => {
  console.log('SIGINT received, but keeping server running for development');
});
