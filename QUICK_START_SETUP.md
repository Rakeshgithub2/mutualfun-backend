# 🚀 Quick Start Guide

## Prerequisites Checklist

Before starting, ensure you have:

- ✅ Node.js v18+ installed
- ✅ MongoDB Atlas account (or local MongoDB)
- ✅ Redis installed (or Redis Cloud account)
- ✅ Git installed

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment Variables

Create `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mutual-funds?retryWrites=true&w=majority

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# External API Configuration (Optional)
AMFI_NAV_API_URL=https://www.amfiindia.com/spages/NAVAll.txt
NSE_API_URL=https://www.nseindia.com/api

# Email Configuration (Optional - for reminders)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## Step 3: Verify MongoDB Atlas Connection

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (Free M0 tier is sufficient for testing)
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for testing)
5. Get connection string and add to `.env`

## Step 4: Verify Redis Connection

### Option A: Local Redis

```bash
# Install Redis (Windows - via WSL or download installer)
# Linux/Mac
brew install redis  # Mac
sudo apt install redis  # Ubuntu

# Start Redis
redis-server
```

### Option B: Redis Cloud

1. Sign up at [Redis Cloud](https://redis.com/try-free/)
2. Create a free database
3. Get connection details and add to `.env`

## Step 5: Test Connection

```bash
# Check health endpoint
node -e "
const dbConfig = require('./src/config/db.config');
const redisConfig = require('./src/config/redis.config');

(async () => {
  try {
    await dbConfig.connect();
    await redisConfig.connect();
    console.log('✅ All connections successful!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
})();
"
```

## Step 6: Start the Server

```bash
# Production mode
npm start

# Development mode (with nodemon)
npm run dev
```

Expected output:

```
🚀 Server started on port 3000
✅ MongoDB connected successfully
✅ Redis connected successfully
✅ All database indexes created
✅ Scheduler initialized - 3 jobs scheduled
```

## Step 7: Verify APIs

### Test Health Check

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "success": true,
  "status": "healthy",
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

### Test Market Status

```bash
curl http://localhost:3000/api/market/status
```

### Test Fund Categories (will be empty until data import)

```bash
curl http://localhost:3000/api/funds/categories
```

### Test User Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

Save the `accessToken` from the response.

### Test Protected Endpoint

```bash
curl http://localhost:3000/api/watchlist \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Step 8: Run Full Test Suite

```bash
node test-api.js
```

This will test all major endpoints and create sample data.

## Common Issues & Solutions

### Issue: MongoDB Connection Failed

**Solution:**

- Check if IP is whitelisted in MongoDB Atlas
- Verify connection string format
- Ensure username/password are URL-encoded
- Check network/firewall settings

### Issue: Redis Connection Failed

**Solution:**

- Verify Redis is running: `redis-cli ping` (should return PONG)
- Check REDIS_HOST and REDIS_PORT in .env
- For Redis Cloud, ensure you're using the correct endpoint

### Issue: Port Already in Use

**Solution:**

```bash
# Change PORT in .env to different value (e.g., 3001)
# Or kill process using port 3000
lsof -ti:3000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :3000   # Windows (then kill PID)
```

### Issue: Module Not Found

**Solution:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: JWT Secret Not Set

**Solution:**
Generate secure secrets:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Add both JWT_SECRET and JWT_REFRESH_SECRET to .env

## Next Steps

### 1. Import Fund Data

Once basic APIs are working, you need to populate the database:

```bash
# Create data import scripts or use provided scripts
node scripts/import-funds.js
node scripts/import-nav-history.js
```

### 2. Test Cron Jobs

Verify automated jobs are running:

- Check logs for "Daily NAV job completed"
- Check logs for "Market indices updated"
- Verify Redis cache is being populated

### 3. Production Deployment

See `DEPLOYMENT_CHECKLIST.md` for complete production setup.

### 4. Frontend Integration

Use `API_DOCUMENTATION.md` to integrate with your frontend application.

## Monitoring

### Check Logs

```bash
# Development
npm run dev  # Shows live logs

# Production (with PM2)
pm2 logs mutual-funds-backend
```

### Monitor Redis

```bash
redis-cli
> KEYS *
> GET fund:119551
```

### Monitor MongoDB

```bash
# Use MongoDB Compass or Atlas UI
# Or via CLI:
mongosh "your-connection-string"
> use mutual-funds
> db.funds.countDocuments()
> db.users.find()
```

## API Documentation

Full API documentation available in:

- `API_DOCUMENTATION.md` - Complete endpoint reference
- `CONTROLLERS_ROUTES_COMPLETE.md` - Implementation details

## Support

If you encounter issues:

1. Check the error logs in console
2. Verify all environment variables are set
3. Ensure MongoDB and Redis are accessible
4. Check firewall/network settings
5. Review the documentation files

## Success Checklist

After completing setup, you should have:

- ✅ Server running on configured port
- ✅ MongoDB connected with indexes created
- ✅ Redis connected and caching working
- ✅ Health check returning success
- ✅ User registration/login working
- ✅ Protected endpoints accessible with JWT
- ✅ Market status API working
- ✅ Cron jobs scheduled (check logs)

## 🎉 You're Ready!

Your mutual funds backend is now running. Start building your frontend or import fund data to see the full system in action!
