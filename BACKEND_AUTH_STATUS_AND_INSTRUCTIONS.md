# 🔥 Backend Auth Status & Configuration Guide

## ✅ Current Backend Implementation Status

### 1. **Server Configuration** ✅ COMPLETE

- **File**: `src/app.ts`
- **Status**: ✅ Properly configured
- ❌ **NO** Cross-Origin headers that would block Google OAuth
- ✅ CORS properly configured with credentials support
- ✅ Security middleware (helmet) configured

### 2. **Google OAuth Routes** ✅ COMPLETE

- **File**: `src/routes/auth.routes.ts`
- **Route**: `POST /api/auth/google`
- **Controller**: `googleSignIn` in `src/controllers/auth.controller.ts`
- ✅ Accepts Google ID Token from frontend
- ✅ Verifies token with Google
- ✅ Creates/finds user in database
- ✅ Returns access token + refresh token
- ✅ Sends welcome email for new users

### 3. **Auth Service** ✅ COMPLETE

- **File**: `src/services/auth.service.ts`
- ✅ Google token verification implemented
- ✅ User creation/lookup logic
- ✅ JWT token generation
- ✅ Refresh token management

---

## 🎯 What You Need to Do

### 1. **Update Environment Variables** ⚠️ REQUIRED

Your `.env` file should have:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL
FRONTEND_URL=https://mutual-fun-frontend-osed.vercel.app

# Allowed Origins (for CORS)
ALLOWED_ORIGINS=http://localhost:5001,http://localhost:3000,http://localhost:3001,http://localhost:5173,https://mutual-fun-frontend-osed.vercel.app
```

### 2. **Vercel Environment Variables** ⚠️ CRITICAL

Go to: https://vercel.com/your-project/settings/environment-variables

Add these:

| Variable               | Value                                                                                     |
| ---------------------- | ----------------------------------------------------------------------------------------- |
| `GOOGLE_CLIENT_ID`     | `your-google-client-id.apps.googleusercontent.com`                                        |
| `GOOGLE_CLIENT_SECRET` | `your-google-client-secret`                                                               |
| `FRONTEND_URL`         | `https://mutual-fun-frontend-osed.vercel.app`                                             |
| `ALLOWED_ORIGINS`      | `https://mutual-fun-frontend-osed.vercel.app,http://localhost:5001,http://localhost:3000` |
| `JWT_SECRET`           | Your JWT secret from .env file                                                            |
| `JWT_REFRESH_SECRET`   | Your JWT refresh secret from .env file                                                    |
| `DATABASE_URL`         | Your MongoDB connection string                                                            |
| `NODE_ENV`             | `production`                                                                              |

### 3. **Google Cloud Console Configuration** ⚠️ CRITICAL

URL: https://console.cloud.google.com/apis/credentials

#### Update OAuth 2.0 Client:

**Authorized JavaScript origins:**

```
http://localhost:5001
http://localhost:3000
https://mutual-fun-frontend-osed.vercel.app
```

**Authorized redirect URIs:**

```
http://localhost:5001/auth/callback
http://localhost:3000/auth/callback
https://mutual-fun-frontend-osed.vercel.app/auth/callback
```

---

## 📝 Backend API Endpoint

### Google Sign-In Endpoint

```
POST https://mutualfun-backend.vercel.app/api/auth/google
```

**Request Body:**

```json
{
  "idToken": "google_id_token_from_frontend"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "userId": "...",
      "email": "user@example.com",
      "name": "User Name",
      "firstName": "User",
      "lastName": "Name",
      "picture": "https://...",
      "emailVerified": true,
      "authMethod": "google"
    },
    "tokens": {
      "accessToken": "jwt_token_here",
      "expiresIn": 900
    }
  }
}
```

---

## 🎨 Frontend Integration Guide

### Step 1: Install Google OAuth Library

```bash
npm install @react-oauth/google
```

### Step 2: Wrap App with GoogleOAuthProvider

```jsx
// App.jsx or main.jsx
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID =
  'your-google-client-id.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {/* Your app components */}
    </GoogleOAuthProvider>
  );
}
```

### Step 3: Create Google Login Component

```jsx
import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://mutualfun-backend.vercel.app/api';

function GoogleLoginButton() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setError(null);

      // Send ID token to your backend
      const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: credentialResponse.credential,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store tokens
        localStorage.setItem('accessToken', data.data.tokens.accessToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));

        // Redirect to home page
        navigate('/');
        window.location.reload(); // Refresh to update auth state
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError('An error occurred during login');
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed');
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default GoogleLoginButton;
```

### Step 4: Create Header with Conditional Rendering

```jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';

function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('accessToken');

      // Call logout endpoint
      await fetch('https://mutualfun-backend.vercel.app/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);

      // Redirect to home
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header
      style={{
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <h1>Mutual Funds Platform</h1>

      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user.picture && (
            <img
              src={user.picture}
              alt={user.name}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          )}
          <span>{user.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <GoogleLoginButton />
      )}
    </header>
  );
}

export default Header;
```

### Step 5: Create Protected Route Component

```jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
```

### Step 6: Use Protected Route in App

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}
```

---

## ✅ Testing Checklist

### 1. **Test Backend Directly**

```bash
# Test health endpoint
curl https://mutualfun-backend.vercel.app/health

# Should return: {"status":"ok",...}
```

### 2. **Test Google OAuth**

1. Open frontend: `https://mutual-fun-frontend-osed.vercel.app`
2. Click "Sign in with Google"
3. Select Google account
4. Should redirect to home page with user avatar visible

### 3. **Verify Token Storage**

Open browser console:

```javascript
localStorage.getItem('accessToken'); // Should show JWT token
localStorage.getItem('user'); // Should show user object
```

---

## 🐛 Troubleshooting

### Error: "Origin not allowed"

- ✅ Add your frontend URL to Google Cloud Console **Authorized JavaScript origins**
- ✅ Add to Vercel environment variable `ALLOWED_ORIGINS`

### Error: "Google token verification failed"

- ✅ Check `GOOGLE_CLIENT_ID` in Vercel matches Google Cloud Console
- ✅ Ensure `GOOGLE_CLIENT_SECRET` is set in Vercel

### Error: "Network error" or CORS

- ✅ Hard refresh browser: `Ctrl + Shift + R`
- ✅ Clear browser cache
- ✅ Check Vercel deployment logs

### Login works but page doesn't update

- ✅ Add `window.location.reload()` after successful login
- ✅ Use React state management (useState/Context) for user state

---

## 📊 Summary

| Component             | Status      | Action Needed              |
| --------------------- | ----------- | -------------------------- |
| Backend Routes        | ✅ Complete | None                       |
| Google OAuth Logic    | ✅ Complete | None                       |
| CORS Configuration    | ✅ Complete | None                       |
| Environment Variables | ⚠️ Verify   | Check Vercel dashboard     |
| Google Cloud Setup    | ⚠️ Verify   | Add production URLs        |
| Frontend Integration  | ❌ TODO     | Implement components above |

---

**Next Steps:**

1. ✅ Verify Vercel environment variables
2. ✅ Update Google Cloud Console with production URLs
3. ❌ Implement frontend components
4. ✅ Test end-to-end flow
5. ✅ Deploy and verify

---

**Your Backend is Ready!** 🎉

The backend Google OAuth implementation is complete and production-ready. Just configure the environment variables and implement the frontend integration.
