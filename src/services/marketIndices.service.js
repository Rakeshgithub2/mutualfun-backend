/**
 * MARKET INDICES AUTO-UPDATE SERVICE
 * Updates market indices every 2 hours during market hours
 * On holidays/weekends, returns last cached values
 *
 * Features:
 * - Fetches live data from NSE/BSE
 * - Caches last values for holidays
 * - Updates every 2 hours (9 AM - 3:30 PM on trading days)
 */

const axios = require('axios');
const mongoose = require('mongoose');

// Market Indices Schema
const marketIndexSchema = new mongoose.Schema(
  {
    index: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: Number,
      required: true,
    },
    change: {
      type: Number,
      required: true,
    },
    changePercent: {
      type: Number,
      required: true,
    },
    high: Number,
    low: Number,
    open: Number,
    previousClose: Number,
    volume: Number,
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    isMarketOpen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const MarketIndex = mongoose.model('MarketIndex', marketIndexSchema);

class MarketIndicesService {
  constructor() {
    this.UPDATE_INTERVAL = 2 * 60 * 60 * 1000; // 2 hours
    this.MARKET_OPEN_HOUR = 9;
    this.MARKET_CLOSE_HOUR = 15;
    this.MARKET_CLOSE_MINUTE = 30;
  }

  /**
   * Check if market is open
   */
  isMarketOpen() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    const hour = now.getHours();
    const minute = now.getMinutes();

    // Weekend check
    if (day === 0 || day === 6) {
      return false;
    }

    // Market hours: 9:00 AM to 3:30 PM
    if (hour < this.MARKET_OPEN_HOUR) return false;
    if (hour > this.MARKET_CLOSE_HOUR) return false;
    if (hour === this.MARKET_CLOSE_HOUR && minute > this.MARKET_CLOSE_MINUTE)
      return false;

    return true;
  }

  /**
   * Fetch live market data from NSE
   */
  async fetchNSEData(symbol) {
    try {
      // NSE API endpoint (you may need to adjust based on actual NSE API)
      const url = `https://www.nseindia.com/api/equity-stockIndices?index=${symbol}`;

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          Accept: 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 10000,
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching NSE data for ${symbol}:`, error.message);
      return null;
    }
  }

  /**
   * Fetch from Yahoo Finance as fallback
   */
  async fetchYahooFinanceData(symbol) {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;

      const response = await axios.get(url, {
        timeout: 10000,
      });

      const quote = response.data.chart.result[0];
      const meta = quote.meta;
      const indicators = quote.indicators.quote[0];

      return {
        value: meta.regularMarketPrice,
        change: meta.regularMarketPrice - meta.previousClose,
        changePercent:
          ((meta.regularMarketPrice - meta.previousClose) /
            meta.previousClose) *
          100,
        high: meta.regularMarketDayHigh,
        low: meta.regularMarketDayLow,
        open: indicators.open[0],
        previousClose: meta.previousClose,
        volume: meta.regularMarketVolume,
      };
    } catch (error) {
      console.error(
        `Error fetching Yahoo Finance data for ${symbol}:`,
        error.message
      );
      return null;
    }
  }

  /**
   * Update single index
   */
  async updateIndex(indexName, symbol, yahooSymbol) {
    try {
      const isOpen = this.isMarketOpen();

      // Try NSE first
      let data = await this.fetchNSEData(symbol);

      // Fallback to Yahoo Finance
      if (!data) {
        data = await this.fetchYahooFinanceData(yahooSymbol);
      }

      if (!data) {
        console.log(
          `⚠️  No data available for ${indexName}, using cached values`
        );
        return;
      }

      // Update or create index
      await MarketIndex.findOneAndUpdate(
        { index: indexName },
        {
          index: indexName,
          value: data.value || data.regularMarketPrice,
          change: data.change,
          changePercent: data.changePercent,
          high: data.high,
          low: data.low,
          open: data.open,
          previousClose: data.previousClose,
          volume: data.volume,
          lastUpdated: new Date(),
          isMarketOpen: isOpen,
        },
        { upsert: true, new: true }
      );

      console.log(
        `✅ Updated ${indexName}: ${data.value} (${data.changePercent > 0 ? '+' : ''}${data.changePercent.toFixed(2)}%)`
      );
    } catch (error) {
      console.error(`❌ Error updating ${indexName}:`, error.message);
    }
  }

  /**
   * Update all indices
   */
  async updateAllIndices() {
    console.log(
      `\n🔄 Updating market indices... ${new Date().toLocaleString()}`
    );

    const isOpen = this.isMarketOpen();
    console.log(`📊 Market Status: ${isOpen ? '🟢 OPEN' : '🔴 CLOSED'}`);

    const indices = [
      { name: 'NIFTY 50', symbol: 'NIFTY 50', yahoo: '^NSEI' },
      { name: 'SENSEX', symbol: 'SENSEX', yahoo: '^BSESN' },
      { name: 'NIFTY BANK', symbol: 'NIFTY BANK', yahoo: '^NSEBANK' },
      { name: 'NIFTY IT', symbol: 'NIFTY IT', yahoo: 'NIFTYIT.NS' },
      {
        name: 'NIFTY MIDCAP 100',
        symbol: 'NIFTY MIDCAP 100',
        yahoo: '^NSEMDCP100',
      },
      {
        name: 'NIFTY SMALLCAP 100',
        symbol: 'NIFTY SMALLCAP 100',
        yahoo: '^NSESMLCP100',
      },
    ];

    for (const index of indices) {
      await this.updateIndex(index.name, index.symbol, index.yahoo);
      // Small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log('✅ Market indices update completed\n');
  }

  /**
   * Get all indices (returns cached if market closed)
   */
  async getAllIndices() {
    try {
      const indices = await MarketIndex.find().sort({ index: 1 }).lean();

      if (indices.length === 0) {
        // Return default values if no data
        return this.getDefaultIndices();
      }

      return indices.map((idx) => ({
        index: idx.index,
        value: idx.value,
        change: idx.change,
        changePercent: idx.changePercent,
        high: idx.high,
        low: idx.low,
        open: idx.open,
        previousClose: idx.previousClose,
        lastUpdated: idx.lastUpdated,
        isMarketOpen: idx.isMarketOpen,
      }));
    } catch (error) {
      console.error('Error fetching indices:', error);
      return this.getDefaultIndices();
    }
  }

  /**
   * Default/fallback indices
   */
  getDefaultIndices() {
    return [
      {
        index: 'NIFTY 50',
        value: 21500,
        change: 0,
        changePercent: 0,
        isMarketOpen: false,
      },
      {
        index: 'SENSEX',
        value: 71000,
        change: 0,
        changePercent: 0,
        isMarketOpen: false,
      },
      {
        index: 'NIFTY BANK',
        value: 45000,
        change: 0,
        changePercent: 0,
        isMarketOpen: false,
      },
    ];
  }

  /**
   * Start auto-update service
   */
  startAutoUpdate() {
    console.log('🚀 Starting Market Indices Auto-Update Service');
    console.log(
      `⏰ Update interval: ${this.UPDATE_INTERVAL / 1000 / 60} minutes\n`
    );

    // Initial update
    this.updateAllIndices();

    // Schedule updates every 2 hours
    setInterval(() => {
      if (this.isMarketOpen()) {
        this.updateAllIndices();
      } else {
        console.log(
          `⏸️  Market is closed. Using cached values. Next check at ${new Date(Date.now() + this.UPDATE_INTERVAL).toLocaleTimeString()}`
        );
      }
    }, this.UPDATE_INTERVAL);
  }
}

// Export for use in routes
module.exports = new MarketIndicesService();

// If run directly, start the service
if (require.main === module) {
  const MONGODB_URI =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/mutual-funds';

  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB');
      const service = new MarketIndicesService();
      service.startAutoUpdate();
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err);
      process.exit(1);
    });
}
