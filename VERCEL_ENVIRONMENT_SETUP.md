# 🔧 Vercel Environment Variables Setup Guide

## 🚨 Critical Issue

**Error:** "Database not initialized. Call connect() first."

**Root Cause:** The `DATABASE_URL` environment variable is **NOT set in Vercel**.

## ✅ Solution: Set Environment Variables in Vercel

### Step 1: Go to Vercel Dashboard

1. Open: https://vercel.com/dashboard
2. Select your project: **mutualfun-backend**
3. Click on **Settings** tab
4. Click on **Environment Variables** in the left sidebar

### Step 2: Add Required Environment Variables

Add these environment variables one by one:

#### 🔴 CRITICAL (Required for app to work)

**1. DATABASE_URL** (MongoDB Connection)

```
Key: DATABASE_URL
Value: mongodb+srv://rakeshd01042024_db_user:Rakesh1234@mutualfunds.l7zeno9.mongodb.net/?appName=mutualfunds
Environment: Production, Preview, Development (check all)
```

**2. JWT_SECRET** (Authentication)

```
Key: JWT_SECRET
Value: your-super-secret-jwt-key-change-this-in-production-12345678
Environment: Production, Preview, Development (check all)
```

**3. JWT_REFRESH_SECRET** (Refresh Tokens)

```
Key: JWT_REFRESH_SECRET
Value: your-super-secret-refresh-jwt-key-change-this-in-production-87654321
Environment: Production, Preview, Development (check all)
```

**4. NODE_ENV** (Environment)

```
Key: NODE_ENV
Value: production
Environment: Production only
```

#### 🟡 RECOMMENDED (For full functionality)

**5. FRONTEND_URL** (CORS)

```
Key: FRONTEND_URL
Value: https://mutual-fun-frontend-osed.vercel.app
Environment: Production, Preview, Development
```

**6. GOOGLE_CLIENT_ID** (OAuth Login)

```
Key: GOOGLE_CLIENT_ID
Value: your-google-client-id.apps.googleusercontent.com
Environment: Production, Preview, Development
```

**7. GOOGLE_CLIENT_SECRET** (OAuth Login)

```
Key: GOOGLE_CLIENT_SECRET
Value: your-google-client-secret
Environment: Production, Preview, Development
```

#### 🟢 OPTIONAL (Additional features)

**8. REDIS_URL** (Caching - optional)

```
Key: REDIS_URL
Value: redis://your-redis-url:6379
Environment: Production, Preview, Development
```

**9. GEMINI_API_KEY** (AI Features)

```
Key: GEMINI_API_KEY
Value: your-gemini-api-key-here
Environment: Production, Preview, Development
```

**10. NEWS_API_KEY** (News Features)

```
Key: NEWS_API_KEY
Value: your-news-api-key-here
Environment: Production, Preview, Development
```

### Step 3: Save and Redeploy

After adding the environment variables:

1. Click **Save** for each variable
2. Go to **Deployments** tab
3. Find the latest deployment
4. Click the **"..."** menu
5. Select **"Redeploy"**
6. Wait 2-3 minutes for deployment to complete

## 🧪 Verify Environment Variables

After deployment, test these endpoints:

**1. Check Environment (Diagnostic)**

```
GET https://mutualfun-backend.vercel.app/api/debug
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2025-11-27T...",
  "environment": "production",
  "config": {
    "hasDatabaseUrl": true,
    "hasJwtSecret": true,
    "hasJwtRefreshSecret": true,
    "nodeEnv": "production"
  }
}
```

**2. Check Health**

```
GET https://mutualfun-backend.vercel.app/health
```

**3. Test Funds API**

```
GET https://mutualfun-backend.vercel.app/api/funds?limit=5
```

Should return fund data (not 500 error).

## 🔒 Security Best Practices

### Generate Strong Secrets

For production, generate strong random secrets:

```bash
# Generate JWT_SECRET (32 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT_REFRESH_SECRET (32 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Replace the example values with these generated secrets.

### Google OAuth Setup

To get Google OAuth credentials:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Create a new project (if needed)
3. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
4. Application type: **Web application**
5. Authorized redirect URIs:
   - `https://mutualfun-backend.vercel.app/api/auth/google/callback`
   - `http://localhost:3000/api/auth/google/callback` (for local dev)
6. Copy the Client ID and Client Secret
7. Add them to Vercel environment variables

## 📋 Quick Checklist

After setting up environment variables:

- [ ] DATABASE_URL is set (MongoDB connection string)
- [ ] JWT_SECRET is set (strong random string)
- [ ] JWT_REFRESH_SECRET is set (strong random string)
- [ ] NODE_ENV is set to "production"
- [ ] Redeployed the application
- [ ] Tested `/api/debug` endpoint (all values should be `true`)
- [ ] Tested `/api/funds?limit=5` (should return data)
- [ ] No more "Database not initialized" errors
- [ ] Frontend can fetch funds successfully
- [ ] Login/signup works

## 🐛 Troubleshooting

### Still getting "Database not initialized" error?

1. **Check if variables are set:**
   - Go to Vercel → Settings → Environment Variables
   - Verify DATABASE_URL exists
   - Check if it's enabled for Production environment

2. **Check deployment:**
   - Go to Vercel → Deployments
   - Make sure latest deployment shows "Ready"
   - Check deployment logs for errors

3. **Test diagnostic endpoint:**

   ```
   curl https://mutualfun-backend.vercel.app/api/debug
   ```

   Should show `"hasDatabaseUrl": true`

4. **Redeploy after adding variables:**
   Environment variables only take effect after redeployment

### Database connection string format

Make sure your MongoDB connection string is in this format:

```
mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

For MongoDB Atlas:

- Replace `username` with your MongoDB username
- Replace `password` with your MongoDB password
- Replace `cluster.mongodb.net` with your cluster URL
- Optionally add `dbname` (database name)

### Can't find your MongoDB connection string?

1. Go to: https://cloud.mongodb.com/
2. Sign in to your account
3. Click on your cluster
4. Click **"Connect"**
5. Choose **"Connect your application"**
6. Copy the connection string
7. Replace `<password>` with your actual password
8. Paste into Vercel environment variables

## 🎯 Expected Outcome

After completing this setup:

✅ No more 500 errors  
✅ Database connects successfully  
✅ Funds API returns data  
✅ Login/signup works  
✅ Frontend can fetch all data  
✅ Google OAuth works (if configured)

## 📞 Need Help?

If you're still experiencing issues:

1. Check Vercel deployment logs
2. Check browser console for specific errors
3. Test the `/api/debug` endpoint
4. Verify MongoDB cluster is running (MongoDB Atlas dashboard)
5. Check if IP address is whitelisted in MongoDB Atlas (allow 0.0.0.0/0 for all IPs)

---

**Last Updated:** 2025-11-27
