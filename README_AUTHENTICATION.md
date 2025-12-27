# 📚 Authentication Documentation Index

## 🎯 Quick Access

### For Setting Up Google OAuth:

1. **[GOOGLE_CONSOLE_URLS.md](GOOGLE_CONSOLE_URLS.md)** ⭐ START HERE
   - Copy-paste URLs for Google Console
   - Quick checklist
   - 2-minute setup guide

2. **[GOOGLE_OAUTH_SETUP_GUIDE.md](GOOGLE_OAUTH_SETUP_GUIDE.md)**
   - Complete step-by-step instructions
   - Detailed explanations
   - Troubleshooting guide

### For Understanding the Flow:

3. **[OAUTH_FLOW_VISUAL_GUIDE.md](OAUTH_FLOW_VISUAL_GUIDE.md)**
   - Visual diagrams
   - Data flow details
   - Code examples

### For Testing:

4. **[test-oauth-setup.js](test-oauth-setup.js)**
   - Automated test script
   - Validates configuration
   - Run: `node test-oauth-setup.js`

5. **[setup-oauth.bat](setup-oauth.bat)** (Windows)
   - Quick start script
   - Run: Double-click the file

### Summary:

6. **[AUTHENTICATION_REBUILD_SUMMARY.md](AUTHENTICATION_REBUILD_SUMMARY.md)**
   - What was changed
   - Complete overview
   - API endpoints reference

---

## 🚀 Quick Start (3 Steps)

### 1️⃣ Configure Google Console

```
Go to: https://console.cloud.google.com/apis/credentials

Add redirect URI:
http://localhost:3002/api/auth/google/callback
```

### 2️⃣ Update Environment Variables

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3002/api/auth/google/callback
FRONTEND_URL=http://localhost:5001
```

### 3️⃣ Test the Setup

```bash
npm run dev
node test-oauth-setup.js
```

---

## 📁 Code Files

### Backend Implementation:

- **[src/routes/auth.routes.js](src/routes/auth.routes.js)**
  - Authentication routes with Google OAuth

- **[src/controllers/auth.controller.js](src/controllers/auth.controller.js)**
  - `googleAuth()` - Initiates OAuth flow
  - `googleCallback()` - Handles Google callback

- **[src/models/User.model.js](src/models/User.model.js)**
  - User schema with OAuth support

- **[.env](.env)**
  - Environment configuration

---

## 🎯 URLs for Google Console

### Copy These Exact URLs:

**Authorized JavaScript Origins:**

```
http://localhost:3002
http://localhost:5001
```

**Authorized Redirect URIs:**

```
http://localhost:3002/api/auth/google/callback
```

---

## 🔗 API Endpoints

### Public Endpoints:

```
POST /api/auth/register         - Email/password registration
POST /api/auth/login           - Email/password login
GET  /api/auth/google          - Get Google OAuth URL
GET  /api/auth/google/callback - Google callback (automatic)
POST /api/auth/refresh         - Refresh access token
```

### Protected Endpoints (require JWT):

```
GET  /api/auth/profile         - Get user profile
PUT  /api/auth/profile         - Update user profile
POST /api/auth/change-password - Change password
POST /api/auth/logout          - Logout
```

---

## 🎨 Frontend Integration

### 1. Initiate Google Login:

```javascript
const response = await fetch('http://localhost:3002/api/auth/google');
const data = await response.json();
window.location.href = data.data.authUrl;
```

### 2. Handle Callback (on /auth/callback route):

```javascript
const params = new URLSearchParams(window.location.search);
const accessToken = params.get('accessToken');
const refreshToken = params.get('refreshToken');

localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);

window.location.href = '/dashboard';
```

### 3. Use Token for API Calls:

```javascript
const response = await fetch('http://localhost:3002/api/auth/profile', {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

---

## ✅ Testing Checklist

- [ ] Backend starts without errors (`npm run dev`)
- [ ] Test script runs successfully (`node test-oauth-setup.js`)
- [ ] Redirect URI added to Google Console
- [ ] Environment variables configured in .env
- [ ] GET /api/auth/google returns valid URL
- [ ] Complete OAuth flow works in browser
- [ ] User created in MongoDB after OAuth
- [ ] JWT tokens received in frontend
- [ ] Protected routes work with token

---

## 🆘 Troubleshooting

### Common Issues:

**"redirect_uri_mismatch"**

- URI in Google Console must exactly match .env
- Check: `http://localhost:3002/api/auth/google/callback`

**"Backend not responding"**

- Ensure backend is running: `npm run dev`
- Check port 3002 is not in use

**"No tokens received"**

- Check backend console for errors
- Verify MongoDB connection
- Confirm Google credentials are correct

**"User not created in database"**

- Check MongoDB connection string in .env
- Verify database name is correct
- Look for errors in backend logs

For detailed troubleshooting, see [GOOGLE_OAUTH_SETUP_GUIDE.md](GOOGLE_OAUTH_SETUP_GUIDE.md)

---

## 🔐 Security Features

✅ JWT-based authentication
✅ Separate access and refresh tokens
✅ Password hashing with bcrypt (10 rounds)
✅ Rate limiting on auth endpoints
✅ CORS protection
✅ Secure token exchange with Google
✅ Environment-based configuration
✅ Email verification for Google users

---

## 📊 User Data Structure

### Google OAuth User:

```javascript
{
  email: "user@gmail.com",
  firstName: "John",
  lastName: "Doe",
  profilePicture: "https://lh3.googleusercontent.com/...",
  authProvider: "google",
  googleId: "123456789",
  emailVerified: true,
  role: "user"
}
```

### Email/Password User:

```javascript
{
  email: "user@example.com",
  password: "$2b$10$...", // Hashed
  firstName: "Jane",
  lastName: "Smith",
  authProvider: "local",
  emailVerified: false,
  role: "user"
}
```

---

## 🚀 Production Deployment

### Update Google Console:

```
Add production redirect URI:
https://your-backend-domain.com/api/auth/google/callback

Add authorized origins:
https://your-backend-domain.com
https://your-frontend-domain.com
```

### Update .env:

```env
GOOGLE_REDIRECT_URI=https://your-backend-domain.com/api/auth/google/callback
FRONTEND_URL=https://your-frontend-domain.com
NODE_ENV=production
```

---

## 📞 Support & Resources

### Documentation Files:

1. [GOOGLE_CONSOLE_URLS.md](GOOGLE_CONSOLE_URLS.md) - Quick reference
2. [GOOGLE_OAUTH_SETUP_GUIDE.md](GOOGLE_OAUTH_SETUP_GUIDE.md) - Complete guide
3. [OAUTH_FLOW_VISUAL_GUIDE.md](OAUTH_FLOW_VISUAL_GUIDE.md) - Visual diagrams
4. [AUTHENTICATION_REBUILD_SUMMARY.md](AUTHENTICATION_REBUILD_SUMMARY.md) - Overview

### Test Scripts:

- `test-oauth-setup.js` - Configuration validator
- `setup-oauth.bat` - Quick start (Windows)

### External Resources:

- [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- [Google OAuth 2.0 Docs](https://developers.google.com/identity/protocols/oauth2)
- [JWT.io](https://jwt.io) - Token decoder

---

## 📝 Version Information

**Status:** ✅ Production Ready
**Last Updated:** December 26, 2025
**Backend Port:** 3002
**Frontend Port:** 5001
**Authentication Methods:** Email/Password + Google OAuth
**Token Type:** JWT (JSON Web Tokens)
**Database:** MongoDB

---

## 🎯 What's New in This Rebuild

✨ **Clean Implementation**

- Removed all old authentication documentation
- Rebuilt from scratch with clear structure
- Added comprehensive documentation

✨ **Google OAuth Support**

- Complete OAuth 2.0 implementation
- Automatic user creation/update
- Profile picture support
- Email verification

✨ **Better Documentation**

- Step-by-step setup guides
- Visual flow diagrams
- Copy-paste ready URLs
- Troubleshooting section

✨ **Testing Tools**

- Automated test script
- Quick start batch file
- Configuration validator

---

**Need help? Start with [GOOGLE_CONSOLE_URLS.md](GOOGLE_CONSOLE_URLS.md)**
