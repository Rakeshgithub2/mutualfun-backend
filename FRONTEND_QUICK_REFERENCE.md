# 🎯 QUICK REFERENCE - Frontend Integration Details

## 📋 SHARE THIS WITH FRONTEND DEVELOPER

**Main File:** `FRONTEND_INTEGRATION_COMPLETE_PROMPT.md`

---

## 🔑 ESSENTIAL CREDENTIALS & PORTS

### Google OAuth Configuration

```
Client ID: YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
```

⚠️ **IMPORTANT:**

- Client ID is used in FRONTEND (public)
- Client Secret is ONLY for BACKEND (never expose in frontend)

### Backend API Configuration

```
Local Backend URL:  http://localhost:3002
API Endpoint:       /api/auth/google
Method:             POST
Content-Type:       application/json
```

### Port Information

```
Backend Port:       3002
Frontend (Vite):    5173 (default)
Frontend (CRA):     3000 (default)
Frontend (Next.js): 3000 (default)
```

---

## 📦 NPM PACKAGES REQUIRED

```bash
npm install @react-oauth/google axios
```

**What they do:**

- `@react-oauth/google` - Official Google OAuth library for React
- `axios` - HTTP client for making API requests to backend

---

## 🔐 AUTHENTICATION FLOW SUMMARY

```
1. User clicks "Sign in with Google"
2. Google popup appears
3. User selects account
4. Frontend receives Google ID token
5. Frontend sends token to: POST http://localhost:3002/api/auth/google
6. Backend verifies token with Google
7. Backend creates/updates user in MongoDB
8. Backend returns JWT tokens + user data
9. Frontend stores tokens in localStorage
10. User redirected to home page
```

---

## 💾 WHAT BACKEND STORES IN MONGODB

Collection: `users`

**Key Fields Stored:**

- `userId` - Unique UUID
- `googleId` - User's Google account ID
- `email` - User's email (verified by Google)
- `emailVerified` - Always true for Google OAuth
- `authMethod` - "google"
- `name`, `firstName`, `lastName` - User's full name
- `picture` - Google profile photo URL
- `preferences` - User settings (theme, language, notifications, etc.)
- `kyc` - KYC verification status
- `subscription` - Subscription plan
- `refreshTokens` - Array of JWT refresh tokens
- `lastLogin` - Last login timestamp
- `loginHistory` - Array of login records with IP and user agent
- `createdAt`, `updatedAt` - Timestamps

**Full MongoDB document example in:** `FRONTEND_INTEGRATION_COMPLETE_PROMPT.md`

---

## 🔗 BACKEND ENDPOINTS AVAILABLE

### 1. Google OAuth Sign In

```
POST /api/auth/google
Body: { "idToken": "..." }
Returns: { user: {...}, tokens: {...} }
```

### 2. Email/Password Login

```
POST /api/auth/login
Body: { "email": "...", "password": "..." }
Returns: { user: {...}, tokens: {...} }
```

### 3. Email/Password Register

```
POST /api/auth/register
Body: { "email": "...", "password": "...", "name": "..." }
Returns: { user: {...}, tokens: {...} }
```

### 4. Refresh Token

```
POST /api/auth/refresh
Body: { "refreshToken": "..." }
Returns: { accessToken: "...", refreshToken: "..." }
```

### 5. Get Current User (Protected)

```
GET /api/auth/me
Headers: Authorization: Bearer <accessToken>
Returns: { user: {...} }
```

### 6. Logout (Protected)

```
POST /api/auth/logout
Headers: Authorization: Bearer <accessToken>
Returns: { success: true }
```

---

## 🎨 FRONTEND FILES TO CREATE

1. **Environment Variables** (`.env`)
2. **Auth Service** (`src/services/authService.js`)
3. **Auth Context** (`src/contexts/AuthContext.jsx`)
4. **Google Login Button** (`src/components/GoogleLoginButton.jsx`)
5. **Login Page** (`src/pages/LoginPage.jsx`)
6. **Protected Route** (`src/components/ProtectedRoute.jsx`)
7. **App Routes** (`src/App.jsx`)

**Complete code for all files in:** `FRONTEND_INTEGRATION_COMPLETE_PROMPT.md`

---

## ⚡ QUICK START (Copy-Paste Ready)

### Step 1: Environment Variables

```env
# For Vite
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
VITE_BACKEND_URL=http://localhost:3002

# For Create React App
REACT_APP_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
REACT_APP_BACKEND_URL=http://localhost:3002

# For Next.js
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
NEXT_PUBLIC_BACKEND_URL=http://localhost:3002
```

### Step 2: Install Packages

```bash
npm install @react-oauth/google axios
```

### Step 3: Minimal Implementation (If You Want Quick Test)

```jsx
// Wrap your app
import { GoogleOAuthProvider } from '@react-oauth/google';

<GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com">
  <App />
</GoogleOAuthProvider>;

// Add button in login page
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

<GoogleLogin
  onSuccess={async (response) => {
    const { data } = await axios.post('http://localhost:3002/api/auth/google', {
      idToken: response.credential,
    });
    localStorage.setItem('accessToken', data.data.tokens.accessToken);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    window.location.href = '/';
  }}
  onError={() => alert('Login failed')}
/>;
```

---

## 🧪 TESTING CHECKLIST

### Before Starting

- [ ] Backend running: `http://localhost:3002/health` accessible
- [ ] MongoDB connected (check backend logs)

### After Implementation

- [ ] Google button visible on login page
- [ ] Clicking button shows Google account picker
- [ ] After login, tokens appear in localStorage
- [ ] User redirected to home page
- [ ] Protected routes work
- [ ] Logout works

### Verify in Browser Console

```javascript
localStorage.getItem('accessToken'); // Should show JWT token
localStorage.getItem('refreshToken'); // Should show JWT token
localStorage.getItem('user'); // Should show user JSON object
```

---

## 🐛 COMMON ISSUES & SOLUTIONS

### "Cannot connect to server"

**Solution:** Start backend

```bash
cd e:\mutual-funds-backend
npm run dev
```

### CORS Errors

**Solution:** Backend must allow your frontend URL. Already configured for:

- `http://localhost:5001`
- `http://localhost:3000`
- `http://localhost:3001`

If using different port, add it in `backend/src/app.ts`

### "Google token verification failed"

**Solution:** Double-check you're using correct Client ID (not Secret!)

### User Not in Database

**Solution:** Check backend logs for errors, verify MongoDB connection

---

## 🔒 SECURITY IMPORTANT NOTES

1. ✅ **Client ID** - Safe to use in frontend (public)
2. ❌ **Client Secret** - NEVER use in frontend (backend only)
3. ✅ **Store tokens in localStorage** - Required for authenticated requests
4. ✅ **Access token expires in 15 minutes** - Use refresh token
5. ✅ **Refresh token expires in 7 days** - User must re-login

---

## 📊 API REQUEST/RESPONSE EXAMPLE

### Request to Backend

```javascript
POST http://localhost:3002/api/auth/google
Content-Type: application/json

{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjdlM..."
}
```

### Response from Backend

```javascript
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@gmail.com",
      "name": "John Doe",
      "firstName": "John",
      "lastName": "Doe",
      "picture": "https://lh3.googleusercontent.com/a/...",
      "emailVerified": true,
      "authMethod": "google",
      "preferences": { "theme": "light", "language": "en", ... },
      "subscription": { "plan": "free" },
      "kyc": { "status": "pending" }
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900
    }
  }
}
```

---

## 🎯 WHAT HAPPENS BEHIND THE SCENES

1. **Frontend** sends Google ID token to backend
2. **Backend** verifies token using `google-auth-library` npm package
3. **Backend** extracts user info (Google ID, email, name, picture)
4. **Backend** checks if user exists in MongoDB by `googleId` or `email`
5. **Backend** creates new user OR updates existing user
6. **Backend** generates JWT tokens using `jsonwebtoken` npm package
7. **Backend** saves refresh token in user document
8. **Backend** logs login history (timestamp, IP, user agent)
9. **Backend** returns user data and tokens to frontend
10. **Frontend** stores tokens and redirects user

---

## 📞 SUPPORT INFORMATION

### Backend Repository

- Location: `e:\mutual-funds-backend`
- Start: `npm run dev`
- Port: `3002`

### Documentation Files

- Complete Implementation: `FRONTEND_INTEGRATION_COMPLETE_PROMPT.md`
- Quick Reference: This file
- Backend Details: `GOOGLE_OAUTH_COMPLETE_SOLUTION.md`
- Visual Guide: `GOOGLE_OAUTH_VISUAL_GUIDE.md`

### Technologies Used

**Backend:**

- Express.js (web server)
- TypeScript (type safety)
- MongoDB (database)
- google-auth-library (verifies tokens)
- jsonwebtoken (generates JWT)
- bcrypt (password hashing)

**Frontend:**

- @react-oauth/google (Google OAuth)
- axios (HTTP client)
- React Router / Next.js (routing)

---

## ✅ SUMMARY

### What Backend Does (Already Complete)

- ✅ Receives Google ID token
- ✅ Verifies with Google
- ✅ Stores user in MongoDB with all details
- ✅ Generates JWT tokens
- ✅ Tracks login history
- ✅ Returns user data

### What Frontend Needs (To Be Implemented)

1. Install `@react-oauth/google` and `axios`
2. Wrap app with `GoogleOAuthProvider`
3. Add `GoogleLogin` button
4. Send ID token to backend
5. Store tokens in localStorage
6. Redirect to home page

### Data Stored in MongoDB

- Google ID
- Email (verified)
- Name and profile picture
- Preferences
- KYC status
- Subscription plan
- JWT refresh tokens
- Login history with IP addresses
- Timestamps

**Everything frontend developer needs is in:** `FRONTEND_INTEGRATION_COMPLETE_PROMPT.md`

**Estimated implementation time:** 30 minutes
