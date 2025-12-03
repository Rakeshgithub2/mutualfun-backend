# 🚀 Frontend: Google OAuth Implementation with Home Page Redirect

## ✅ Current Status

- ✅ Backend is running on `http://localhost:3002`
- ✅ Backend API endpoint ready: `POST /api/auth/google`
- ✅ MongoDB storing user data in `users` collection
- ✅ JWT tokens being generated

## 🎯 What You Need to Implement

Implement Google OAuth login that redirects users to home page after successful authentication.

---

## 📦 Step 1: Install Required Packages

```bash
npm install @react-oauth/google axios
```

---

## 🔧 Step 2: Create Environment Variables

Create or update `.env` file:

```env
# For Vite
VITE_GOOGLE_CLIENT_ID=336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com
VITE_BACKEND_URL=http://localhost:3002

# For Create React App
REACT_APP_GOOGLE_CLIENT_ID=336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com
REACT_APP_BACKEND_URL=http://localhost:3002

# For Next.js
NEXT_PUBLIC_GOOGLE_CLIENT_ID=336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com
NEXT_PUBLIC_BACKEND_URL=http://localhost:3002
```

---

## 🎨 Step 3: Wrap Your App with Google OAuth Provider

### For React (Vite/CRA) - Update `main.jsx` or `App.jsx`

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  process.env.REACT_APP_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
```

### For Next.js - Update `app/layout.jsx` or `pages/_app.js`

```jsx
'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
```

---

## 🔐 Step 4: Create Google Login Component

Create `src/components/GoogleLoginButton.jsx`:

```jsx
import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// For Next.js use: import { useRouter } from 'next/navigation';

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  process.env.REACT_APP_BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'http://localhost:3002';

function GoogleLoginButton() {
  const navigate = useNavigate();
  // For Next.js use: const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    console.log('🔐 Google authentication successful');

    try {
      // Send ID token to backend
      console.log('📤 Sending token to backend...');
      const response = await axios.post(
        `${BACKEND_URL}/api/auth/google`,
        { idToken: credentialResponse.credential },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('✅ Backend response:', response.data);

      // Extract user and tokens
      const { user, tokens } = response.data.data;

      // Store authentication data
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      console.log('✅ Tokens stored successfully');
      console.log('👤 User:', user.name, user.email);

      // Show success message
      alert(`Welcome ${user.name}! Redirecting to home page...`);

      // ✅ REDIRECT TO HOME PAGE
      navigate('/');
      // For Next.js use: router.push('/');

      // Optional: Force reload to update auth state
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('❌ Login failed:', error);

      let errorMessage = 'Login failed. Please try again.';

      if (error.response) {
        // Backend error
        errorMessage = error.response.data.error || errorMessage;
        console.error('Backend error:', error.response.data);
      } else if (error.request) {
        // Network error
        errorMessage =
          'Cannot connect to server. Is backend running on port 3002?';
        console.error('Network error - backend not responding');
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('❌ Google login failed');
    alert('Google login failed. Please try again.');
  };

  return (
    <div style={{ position: 'relative' }}>
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            color: 'white',
          }}
        >
          <div
            style={{
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 1s linear infinite',
            }}
          ></div>
          <p style={{ marginTop: '20px' }}>Logging in...</p>
        </div>
      )}

      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap={false}
        theme="filled_blue"
        size="large"
        text="signin_with"
        shape="rectangular"
      />
    </div>
  );
}

export default GoogleLoginButton;
```

**Add this CSS for spinner animation to your `index.css` or `App.css`:**

```css
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```

---

## 📄 Step 5: Use in Your Login Page

Create or update `src/pages/LoginPage.jsx`:

```jsx
import React from 'react';
import GoogleLoginButton from '../components/GoogleLoginButton';

function LoginPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <h1 style={{ marginBottom: '30px', color: '#333' }}>
          Login to Mutual Funds Platform
        </h1>

        <GoogleLoginButton />

        <div
          style={{
            margin: '20px 0',
            color: '#666',
            position: 'relative',
          }}
        >
          <span
            style={{
              backgroundColor: 'white',
              padding: '0 10px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            or
          </span>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '1px',
              backgroundColor: '#ddd',
              zIndex: 0,
            }}
          ></div>
        </div>

        {/* Add your email/password login form here if needed */}
        <p style={{ color: '#666', fontSize: '14px', marginTop: '20px' }}>
          By continuing, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
```

---

## 🛡️ Step 6: Create Protected Route Component (Optional)

Create `src/components/ProtectedRoute.jsx`:

```jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
// For Next.js, use a different approach with middleware

function ProtectedRoute({ children }) {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
```

**Use in your routes:**

```jsx
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      {/* Other protected routes */}
    </Routes>
  );
}
```

---

## 🧪 Step 7: Test the Implementation

### Test Checklist:

1. **Start Backend** (if not running):

   ```bash
   cd e:\mutual-funds-backend
   npm run dev
   ```

   Verify: `http://localhost:3002/health` returns OK

2. **Start Frontend**:

   ```bash
   npm run dev
   ```

3. **Test Google Login**:
   - Go to login page
   - Click "Sign in with Google" button
   - Select your Google account
   - Check browser console for logs
   - After success, should redirect to home page (`/`)

4. **Verify in Browser Console**:

   ```javascript
   // Check if tokens are stored
   console.log(localStorage.getItem('accessToken'));
   console.log(localStorage.getItem('user'));
   ```

5. **Verify in MongoDB**:
   ```bash
   mongosh "mongodb+srv://rakeshd01042024_db_user:Rakesh1234@mutualfunds.l7zeno9.mongodb.net/"
   use mutual_funds_db
   db.users.find().pretty()
   ```

---

## 🐛 Troubleshooting

### Error: "Cannot connect to server"

**Solution:** Backend not running. Start it with `npm run dev`

### Error: "CORS error"

**Solution:** Backend already configured for `localhost:3000`, `localhost:5000`, `localhost:3001`. If using different port, update backend `src/app.ts`

### Error: "Google token verification failed"

**Solution:** Check if you're using correct Client ID in `.env`

### User not redirected after login

**Solution:** Check browser console for errors. Make sure `navigate('/')` or `router.push('/')` is being called.

### Tokens not in localStorage

**Solution:** Check if backend response is successful. Look for `response.data.data.tokens`

---

## 📊 What Gets Stored in MongoDB

After successful Google login, this user document is created in `users` collection:

```javascript
{
  userId: "550e8400-e29b-41d4-a716-446655440000",
  googleId: "102837465940283746594",
  email: "user@gmail.com",
  emailVerified: true,
  authMethod: "google",
  name: "John Doe",
  firstName: "John",
  lastName: "Doe",
  picture: "https://lh3.googleusercontent.com/a/...",
  preferences: {
    theme: "light",
    language: "en",
    currency: "INR",
    riskProfile: "moderate",
    notifications: { email: true, push: true, priceAlerts: true, newsAlerts: true }
  },
  kyc: { status: "pending" },
  subscription: { plan: "free", autoRenew: false },
  refreshTokens: ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."],
  lastLogin: ISODate("2025-12-03T..."),
  loginHistory: [{ timestamp, ip, userAgent }],
  isActive: true,
  isBlocked: false,
  createdAt: ISODate("2025-12-03T..."),
  updatedAt: ISODate("2025-12-03T...")
}
```

---

## ✅ Expected Flow

```
1. User visits /login page
   ↓
2. Clicks "Sign in with Google" button
   ↓
3. Google popup opens → User selects account
   ↓
4. Frontend receives ID token from Google
   ↓
5. Frontend sends token to: POST http://localhost:3002/api/auth/google
   ↓
6. Backend verifies token with Google
   ↓
7. Backend creates/updates user in MongoDB
   ↓
8. Backend returns JWT tokens + user data
   ↓
9. Frontend stores tokens in localStorage
   ↓
10. Frontend redirects to home page (/)
    ↓
11. ✅ User is logged in and on home page!
```

---

## 📝 Summary

**What you implemented:**

- ✅ Google OAuth login button
- ✅ Token exchange with backend
- ✅ User data storage in localStorage
- ✅ **Automatic redirect to home page after successful login**
- ✅ Loading state and error handling
- ✅ Protected routes (optional)

**Backend is handling:**

- ✅ Google token verification
- ✅ User creation/update in MongoDB
- ✅ JWT token generation
- ✅ Login history tracking

**The key redirect line:**

```javascript
navigate('/'); // This redirects to home page
```

That's it! After implementing this, users will be redirected to your home page immediately after successful Google login. 🚀
