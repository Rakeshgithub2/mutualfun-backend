# 🔄 Google OAuth Flow - Visual Guide

## Complete Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         GOOGLE OAUTH FLOW                            │
└─────────────────────────────────────────────────────────────────────┘

1️⃣  USER CLICKS "LOGIN WITH GOOGLE"
     │
     │  Frontend makes request
     ↓
┌─────────────────────────────────────────────────────────────────────┐
│  GET http://localhost:3002/api/auth/google                          │
│                                                                       │
│  Backend Response:                                                   │
│  {                                                                   │
│    "success": true,                                                  │
│    "data": {                                                         │
│      "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."  │
│    }                                                                 │
│  }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
     │
     │  Frontend redirects user to authUrl
     ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        GOOGLE LOGIN PAGE                             │
│                                                                       │
│  User enters Google credentials                                     │
│  User grants permissions                                            │
└─────────────────────────────────────────────────────────────────────┘
     │
     │  Google redirects with authorization code
     ↓
┌─────────────────────────────────────────────────────────────────────┐
│  GET http://localhost:3002/api/auth/google/callback?code=xxxxx     │
│                                                                       │
│  Backend Actions:                                                    │
│  1. Exchange code for Google access token                           │
│  2. Fetch user info from Google (email, name, picture)             │
│  3. Find or create user in MongoDB                                  │
│  4. Generate JWT tokens (accessToken, refreshToken)                 │
│  5. Redirect to frontend with tokens                                │
└─────────────────────────────────────────────────────────────────────┘
     │
     │  Redirect with tokens
     ↓
┌─────────────────────────────────────────────────────────────────────┐
│  http://localhost:5001/auth/callback?accessToken=xxx&refreshToken=yyy│
│                                                                       │
│  Frontend Actions:                                                   │
│  1. Extract tokens from URL                                         │
│  2. Store in localStorage/cookies                                   │
│  3. Redirect to dashboard                                           │
└─────────────────────────────────────────────────────────────────────┘
     │
     ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        USER DASHBOARD                                │
│                    (User is now logged in)                           │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Details

### Step 1: Get Auth URL

```javascript
// Frontend Code
const response = await fetch('http://localhost:3002/api/auth/google');
const data = await response.json();
window.location.href = data.data.authUrl;
```

### Step 2: Google Authorization

```
URL Parameters sent to Google:
- client_id: Your Google Client ID
- redirect_uri: http://localhost:3002/api/auth/google/callback
- response_type: code
- scope: email profile
- access_type: offline
- prompt: consent
```

### Step 3: Backend Callback Processing

```javascript
// What happens in auth.controller.js googleCallback():

1. Receive authorization code from Google
2. POST to Google token endpoint with:
   - code
   - client_id
   - client_secret
   - redirect_uri
   - grant_type: authorization_code

3. Google returns access_token

4. GET user info from Google:
   - email
   - given_name (firstName)
   - family_name (lastName)
   - picture (profile photo URL)
   - id (googleId)

5. MongoDB Operation:
   - Find user by email
   - If exists: Update with Google data
   - If not: Create new user

6. Generate JWT tokens:
   - accessToken (expires in 1 hour)
   - refreshToken (expires in 7 days)

7. Redirect to frontend with tokens
```

### Step 4: Frontend Callback

```javascript
// Frontend /auth/callback route
const params = new URLSearchParams(window.location.search);
const accessToken = params.get('accessToken');
const refreshToken = params.get('refreshToken');

// Store tokens
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);

// Redirect to dashboard
window.location.href = '/dashboard';
```

---

## 🔐 Token Usage

### Using Access Token for API Calls

```javascript
// Frontend: Making authenticated requests
const response = await fetch('http://localhost:3002/api/auth/profile', {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

### Refreshing Expired Token

```javascript
// When access token expires
const response = await fetch('http://localhost:3002/api/auth/refresh', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${refreshToken}`,
  },
});

const data = await response.json();
const newAccessToken = data.data.accessToken;
localStorage.setItem('accessToken', newAccessToken);
```

---

## 🗂️ Database User Object

### After Google OAuth:

```javascript
{
  _id: ObjectId("..."),
  email: "user@gmail.com",
  firstName: "John",
  lastName: "Doe",
  profilePicture: "https://lh3.googleusercontent.com/a/...",
  authProvider: "google",      // ← Identifies OAuth user
  googleId: "123456789",        // ← Google user ID
  emailVerified: true,          // ← Auto-verified for Google
  role: "user",
  lastLogin: ISODate("2025-12-26T..."),
  createdAt: ISODate("2025-12-26T..."),
  updatedAt: ISODate("2025-12-26T...")
}
```

### After Email/Password Registration:

```javascript
{
  _id: ObjectId("..."),
  email: "user@example.com",
  password: "$2b$10$...",      // ← Hashed password
  firstName: "Jane",
  lastName: "Smith",
  authProvider: "local",        // ← Local authentication
  emailVerified: false,         // ← Needs email verification
  role: "user",
  createdAt: ISODate("2025-12-26T..."),
  updatedAt: ISODate("2025-12-26T...")
}
```

---

## 🎯 Frontend Routes Structure

```
/login
  ├── Email/Password form
  └── "Login with Google" button → Triggers OAuth flow

/auth/callback
  ├── Receives tokens from backend
  ├── Stores in localStorage
  └── Redirects to /dashboard

/auth/error
  ├── Receives error messages
  └── Displays error to user

/dashboard
  ├── Protected route (requires authentication)
  └── Uses accessToken for API calls
```

---

## ⚙️ Configuration Requirements

### Google Cloud Console:

```
Authorized JavaScript origins:
✅ http://localhost:3002
✅ http://localhost:5001

Authorized redirect URIs:
✅ http://localhost:3002/api/auth/google/callback
```

### Environment Variables (.env):

```
✅ GOOGLE_CLIENT_ID
✅ GOOGLE_CLIENT_SECRET
✅ GOOGLE_REDIRECT_URI
✅ FRONTEND_URL
✅ JWT_SECRET
✅ JWT_REFRESH_SECRET
```

---

## 🚦 Error Handling

### Google Redirect Errors:

```
http://localhost:5001/auth/error?message=error+description

Common errors:
- "No authorization code received"
- "Google authentication failed"
- "Invalid credentials"
```

### Frontend Error Handling:

```javascript
// Check for errors in callback
const error = params.get('error');
if (error) {
  // User denied access
  alert('Authentication cancelled');
  window.location.href = '/login';
}

// Check for error route
if (window.location.pathname === '/auth/error') {
  const message = params.get('message');
  // Display error message
}
```

---

## 📈 Success Indicators

✅ Backend starts without errors
✅ GET /api/auth/google returns valid authUrl
✅ Google login page appears
✅ User redirected to frontend with tokens
✅ User created/updated in MongoDB
✅ Protected routes accessible with token
✅ Profile data retrieved correctly

---

**Flow Tested:** ✅
**Security:** ✅
**Documentation:** ✅
**Ready for Production:** After updating production URLs
