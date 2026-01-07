# 📰 Real News API Setup Guide

## ⚠️ IMPORTANT: No Mock Data

This system is configured for **REAL NEWS ONLY**. Mock data has been removed.

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Get FREE NewsAPI.org Key

1. **Visit**: https://newsapi.org/register
2. **Sign up** with your email (free tier: 100 requests/day)
3. **Copy your API key** from the dashboard

### Step 2: Update .env File

Open `c:\MF root folder\mutual-funds-backend\.env` and update:

```env
NEWS_API_KEY=YOUR_ACTUAL_KEY_HERE
```

Replace `YOUR_ACTUAL_KEY_HERE` with the API key you got from NewsAPI.org

### Step 3: Fetch News

Run the news update job:

```powershell
cd "c:\MF root folder\mutual-funds-backend"
node jobs/update-news.job.js
```

You should see:

```
📰 Starting news update job...
📥 Fetching news from yesterday...
✅ Fetched 20 news articles from yesterday
✅ Inserted 20 new articles
📊 Total news in database: 20
```

---

## ✅ Verification

### Test the API:

```powershell
# Check if news is loaded
curl http://localhost:3002/api/news
```

You should see 20 real financial news articles.

---

## 🔧 How It Works

### Daily News Updates

- **Job**: `jobs/update-news.job.js`
- **Schedule**: Daily at 6:00 AM IST
- **Fetches**: 20 latest financial news from yesterday
- **Categories**: Stock market, mutual funds, gold, general finance
- **Query**: Indian financial news (Sensex, Nifty, mutual funds, investments)

### API Endpoints

- `GET /api/news` - List all news (mixed or by category)
- `GET /api/news/:id` - Get specific article details

### Data Flow

```
NewsAPI.org → update-news.job.js → MongoDB → Backend API → Frontend
```

---

## 📊 NewsAPI.org Free Tier Limits

| Feature             | Free Tier     |
| ------------------- | ------------- |
| Requests/Day        | 100           |
| Requests/Month      | ~3,000        |
| Results per request | Up to 100     |
| Article age         | Up to 1 month |
| Commercial use      | ❌ No         |

**Perfect for development and testing!**

---

## 🆚 API Alternatives

If you need more requests or production use:

### 1. **GNews API** (Free Tier)

- **Website**: https://gnews.io/
- **Free Tier**: 100 requests/day
- **Commercial**: ✅ Yes
- **Setup**: Similar to NewsAPI.org

### 2. **NewsData.io** (Free Tier)

- **Website**: https://newsdata.io/
- **Free Tier**: 200 requests/day
- **Note**: Your previous key expired

### 3. **Paid Plans**

For production/commercial use:

- **NewsAPI.org Business**: $449/month (100,000 requests)
- **GNews Paid**: $19/month (10,000 articles)

---

## 🐛 Troubleshooting

### ❌ Error: "Invalid API key"

**Solution**:

1. Check .env file has correct key
2. Restart backend server: `.\start-backend.ps1`
3. Verify key at https://newsapi.org/account

### ❌ Error: "Rate limit exceeded"

**Solution**:

- Free tier: 100 requests/day
- Wait 24 hours or upgrade plan
- Run job only once per day

### ❌ No news showing on frontend

**Solution**:

1. Check database: `node check-db-data.js`
2. Run news job manually: `node jobs/update-news.job.js`
3. Restart backend: `.\start-backend.ps1`

### ❌ Articles show "Content not available"

**Reason**: NewsAPI.org free tier limits full article content
**Solution**:

- User clicks "Read Full Article" button → Opens source URL
- Upgrade to paid plan for full content access
- This is normal for free tier

---

## 📝 Manual News Update

Run anytime to fetch fresh news:

```powershell
cd "c:\MF root folder\mutual-funds-backend"
node jobs/update-news.job.js
```

---

## ✨ What You Get

Each news article includes:

- ✅ Title
- ✅ Description
- ✅ Content preview (free tier limits full content)
- ✅ Source name
- ✅ Category (stock/mutualfund/gold/finance)
- ✅ Publication date
- ✅ Source URL (for full article)
- ✅ Image (if available)

---

## 🎯 Next Steps

1. ✅ Get your FREE API key from https://newsapi.org/register
2. ✅ Update `.env` file with your key
3. ✅ Run `node jobs/update-news.job.js`
4. ✅ Visit http://localhost:5001/news to see real news!

---

## 💡 Pro Tips

1. **Schedule Job**: The job runs automatically daily at 6 AM IST (configured in backend)
2. **Cache**: News is cached in Redis for faster loading
3. **Categories**: News auto-categorized based on content (stock/mutualfund/gold)
4. **Source Links**: Users can click "Read Full Article" to visit source
5. **Fresh Daily**: Database is cleared and refreshed daily with latest 20 articles

---

## 📧 Need Help?

If you get stuck:

1. Check error logs in terminal
2. Verify API key is active at NewsAPI.org dashboard
3. Ensure backend server is running
4. Test API endpoint: `http://localhost:3002/api/news`

---

**✨ You're ready to fetch real financial news! ✨**
