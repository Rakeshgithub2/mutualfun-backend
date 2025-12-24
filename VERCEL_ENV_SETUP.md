# 🔐 Vercel Environment Variables Setup

## Required Environment Variables for Backend

Go to Vercel Dashboard → Your Backend Project → Settings → Environment Variables

### 🗄️ Database (REQUIRED)

```bash
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

**How to get**:

1. MongoDB Atlas → Clusters → Connect
2. Choose "Connect your application"
3. Copy connection string
4. Replace `<password>` with actual password

---

### 🔑 JWT Secrets (REQUIRED)

```bash
JWT_SECRET=your-super-long-secret-key-minimum-32-characters-recommended-64-chars
JWT_REFRESH_SECRET=another-super-long-secret-key-minimum-32-characters-different-from-above
```

**How to generate secure secrets**:

```bash
# In terminal (Linux/Mac)
openssl rand -hex 64

# Or in Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or in PowerShell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))
```

⚠️ **IMPORTANT**:

- Use different secrets for JWT_SECRET and JWT_REFRESH_SECRET
- Never commit these to Git
- Generate new ones for production

---

### 🌐 Environment & CORS (REQUIRED)

```bash
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend.vercel.app
FRONTEND_URL=https://your-frontend.vercel.app
```

**Multiple Origins** (comma-separated):

```bash
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-staging.vercel.app
```

---

### 🔐 Google OAuth (OPTIONAL - If Using Google Sign-In)

```bash
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-AbCdEfGhIjKlMnOpQrStUvWxYz
```

**How to get**:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URIs:
   - `https://your-backend.vercel.app/api/auth/google/callback`
   - `http://localhost:3002/api/auth/google/callback` (for testing)
4. Copy Client ID and Client Secret

---

### 📧 Email Service (OPTIONAL - For Notifications)

```bash
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
ADMIN_EMAIL=admin@example.com
```

**How to get Gmail App Password**:

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Factor Authentication
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Generate password for "Mail"
5. Copy 16-character password

---

### 📰 News APIs (OPTIONAL - For Financial News)

```bash
NEWS_API_KEY=your-newsapi-key-here
NEWSDATA_API_KEY=your-newsdata-key-here
```

**How to get**:

- NewsAPI: https://newsapi.org/register
- NewsData.io: https://newsdata.io/register

---

### 🤖 AI Features (OPTIONAL - For AI Recommendations)

```bash
GEMINI_API_KEY=AIzaSy...your-gemini-key
```

**How to get**:

- Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create API key
- Copy key

---

## 📋 Quick Copy Template

Copy this template and fill in your values:

```bash
# === REQUIRED ===
DATABASE_URL=mongodb+srv://...
JWT_SECRET=
JWT_REFRESH_SECRET=
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend.vercel.app
FRONTEND_URL=https://your-frontend.vercel.app

# === OPTIONAL ===
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
EMAIL_SERVICE=gmail
EMAIL_USER=
EMAIL_PASSWORD=
ADMIN_EMAIL=
NEWS_API_KEY=
NEWSDATA_API_KEY=
GEMINI_API_KEY=
```

---

## ✅ Verification Steps

After adding environment variables:

1. **Redeploy**: Vercel → Deployments → Redeploy
2. **Test Health**: `https://your-backend.vercel.app/health`
3. **Test Debug**: `https://your-backend.vercel.app/api/debug`
4. **Check Logs**: Vercel → Functions → Check for errors

### Expected Debug Response:

```json
{
  "status": "ok",
  "timestamp": "2025-12-19T...",
  "environment": "production",
  "config": {
    "hasDatabaseUrl": true,
    "hasJwtSecret": true,
    "hasJwtRefreshSecret": true,
    "nodeEnv": "production"
  }
}
```

---

## 🚨 Common Mistakes

### ❌ Wrong: Including quotes in Vercel UI

```bash
DATABASE_URL="mongodb://..."  # DON'T DO THIS
```

### ✅ Correct: No quotes needed

```bash
DATABASE_URL=mongodb://...
```

---

### ❌ Wrong: Same secret for JWT and Refresh

```bash
JWT_SECRET=abc123
JWT_REFRESH_SECRET=abc123  # BAD SECURITY
```

### ✅ Correct: Different secrets

```bash
JWT_SECRET=long-random-string-1
JWT_REFRESH_SECRET=different-long-random-string-2
```

---

### ❌ Wrong: Hardcoded localhost in production

```bash
FRONTEND_URL=http://localhost:3000  # WON'T WORK IN PRODUCTION
```

### ✅ Correct: Use actual Vercel URL

```bash
FRONTEND_URL=https://your-frontend.vercel.app
```

---

## 🔄 Updating Environment Variables

1. Go to Vercel Dashboard
2. Select your backend project
3. Settings → Environment Variables
4. Click "Edit" on the variable you want to change
5. Update value
6. Click "Save"
7. **IMPORTANT**: Redeploy for changes to take effect

---

## 🎯 Priority Order

**Start with these 4 (MINIMUM to work)**:

1. `DATABASE_URL`
2. `JWT_SECRET`
3. `JWT_REFRESH_SECRET`
4. `NODE_ENV=production`

**Add these for better functionality**: 5. `ALLOWED_ORIGINS` 6. `FRONTEND_URL`

**Add rest as needed**: 7. OAuth, Email, APIs (optional features)

---

## 📞 Troubleshooting

### "MongoNetworkError" or "MongooseServerSelectionError"

- ✅ Check `DATABASE_URL` is correct
- ✅ Check MongoDB Atlas → Network Access allows all IPs (0.0.0.0/0)
- ✅ Check database user has correct permissions

### "JsonWebTokenError" or "TokenExpiredError"

- ✅ Check `JWT_SECRET` and `JWT_REFRESH_SECRET` are set
- ✅ Make sure they're different values
- ✅ Verify they're at least 32 characters

### CORS Errors

- ✅ Check `ALLOWED_ORIGINS` includes your frontend domain
- ✅ Check `FRONTEND_URL` is correct
- ✅ Verify frontend domain matches exactly (no trailing slash)

---

## 🔗 Related Documentation

- [Vercel Environment Variables Docs](https://vercel.com/docs/concepts/projects/environment-variables)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)

---

**Last Updated**: December 19, 2025
