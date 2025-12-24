# 🚀 GOOGLE OAUTH LOGIN - COMPLETE SETUP GUIDE

## ✅ Current Backend Configuration

Your backend is already configured with:

- Authorized JavaScript origins: `http://localhost:5001`, `http://localhost:3002`
- Authorized redirect URI: `http://localhost:3002/api/auth/google/callback`

---

## 📋 STEP-BY-STEP FRONTEND SETUP

### Step 1: Install Required Packages

```bash
npm install @react-oauth/google axios
# or
yarn add @react-oauth/google axios
```

### Step 2: Create Environment File

Create a `.env` file in your frontend root:

**For Vite (React + Vite):**

```env
VITE_API_URL=http://localhost:3002
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
```

**For Create React App:**

```env
REACT_APP_API_URL=http://localhost:3002
REACT_APP_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
```

**For Next.js:**

```env
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
```

> ⚠️ Replace `YOUR_CLIENT_ID` with your actual Google Client ID

### Step 3: Wrap App with GoogleOAuthProvider

**For React (src/main.jsx or src/index.js):**

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID; // Vite
// or: process.env.REACT_APP_GOOGLE_CLIENT_ID; // Create React App

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

**For Next.js (app/layout.jsx):**

```jsx
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        >
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
```

### Step 4: Setup Routes

**For React Router (src/App.jsx):**

```jsx
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AuthSuccess from './pages/AuthSuccess';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/success" element={<AuthSuccess />} />
    </Routes>
  );
}

export default App;
```

**For Next.js:**

- Create `app/page.jsx` (home page)
- Create `app/login/page.jsx` (login page)
- Create `app/auth/success/page.jsx` (auth success page)

### Step 5: Create Login Page

**Create src/pages/LoginPage.jsx:**

```jsx
import React from 'react';
import GoogleLoginButton from '../components/GoogleLoginButton';

function LoginPage() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome to Mutual Funds</h1>
        <p style={styles.subtitle}>Sign in to continue</p>

        <GoogleLoginButton />

        <p style={styles.footer}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px',
  },
  footer: {
    fontSize: '12px',
    color: '#999',
    marginTop: '30px',
    lineHeight: '1.5',
  },
};

export default LoginPage;
```

### Step 6: Copy Components to Your Project

Copy these files from the backend folder to your frontend:

1. **GoogleLoginButton Component:**
   - Source: `frontend-google-login-button-updated.jsx`
   - Destination: `src/components/GoogleLoginButton.jsx`

2. **Auth Success Page:**
   - Source: `frontend-auth-success-component.jsx`
   - Destination: `src/pages/AuthSuccess.jsx` (React Router)
   - Or: `app/auth/success/page.jsx` (Next.js)

### Step 7: Configure Frontend to Run on Port 5001

**For Vite (vite.config.js):**

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5001,
  },
});
```

**For Create React App:**
Create/update `.env`:

```
PORT=5001
```

**For Next.js (package.json):**

```json
{
  "scripts": {
    "dev": "next dev -p 5001"
  }
}
```

### Step 8: Create Protected Route Hook

**Create src/hooks/useAuth.js:**

```javascript
import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');

    if (accessToken && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return { user, isAuthenticated, loading, logout };
}
```

**Usage in HomePage:**

```jsx
import { useAuth } from '../hooks/useAuth';

function HomePage() {
  const { user, isAuthenticated, loading, logout } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## 🎯 TESTING YOUR SETUP

### 1. Start Backend

```bash
cd mutual-funds-backend
npm run dev
# Should be running on http://localhost:3002
```

### 2. Start Frontend

```bash
cd mutual-funds-frontend
npm run dev
# Should be running on http://localhost:5001
```

### 3. Test Login Flow

1. Open `http://localhost:5001/login`
2. Click "Sign in with Google"
3. Complete Google authentication
4. Should redirect to home page (`http://localhost:5001/`)
5. Check browser console for success messages
6. Verify user data in localStorage

### 4. Verify Stored Data

Open browser console and run:

```javascript
console.log('Access Token:', localStorage.getItem('accessToken'));
console.log('User:', JSON.parse(localStorage.getItem('user')));
```

---

## 🔧 TROUBLESHOOTING

### Issue 1: "Google OAuth is not configured"

**Solution:** Verify `.env` in backend has:

```
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

### Issue 2: CORS Error

**Solution:** Add to backend `.env`:

```
ALLOWED_ORIGINS=http://localhost:5001,http://localhost:5173
```

### Issue 3: Redirect URI Mismatch

**Error:** `redirect_uri_mismatch`

**Solution:** In Google Cloud Console, ensure redirect URI is exactly:

```
http://localhost:3002/api/auth/google/callback
```

### Issue 4: Frontend Not Loading Button

**Solution:** Check if `GOOGLE_CLIENT_ID` is in your frontend `.env`:

```bash
# For Vite
echo $VITE_GOOGLE_CLIENT_ID

# For Create React App
echo $REACT_APP_GOOGLE_CLIENT_ID
```

### Issue 5: "Cannot connect to server"

**Solution:**

1. Verify backend is running: `http://localhost:3002/health`
2. Check `VITE_API_URL` in frontend `.env`
3. Ensure no firewall blocking

---

## 📦 PRODUCTION DEPLOYMENT

### Frontend Environment Variables (Production)

**Vercel/Netlify/Other hosting:**

```env
VITE_API_URL=https://your-backend-domain.com
VITE_GOOGLE_CLIENT_ID=your-production-client-id.apps.googleusercontent.com
```

### Update Google Cloud Console

Add production URLs:

**Authorized JavaScript origins:**

- `https://your-frontend-domain.com`
- `https://your-backend-domain.com`

**Authorized redirect URIs:**

- `https://your-backend-domain.com/api/auth/google/callback`

---

## ✅ COMPLETE CHECKLIST

- [ ] Installed `@react-oauth/google` and `axios`
- [ ] Created `.env` file with `GOOGLE_CLIENT_ID` and `API_URL`
- [ ] Wrapped app with `GoogleOAuthProvider`
- [ ] Created login page with `GoogleLoginButton`
- [ ] Created auth success page (`/auth/success`)
- [ ] Added routes for `/`, `/login`, `/auth/success`
- [ ] Configured frontend to run on port 5001
- [ ] Copied GoogleLoginButton component
- [ ] Copied AuthSuccess component
- [ ] Created `useAuth` hook for protected routes
- [ ] Tested login flow end-to-end
- [ ] Verified user data in localStorage
- [ ] Tested logout functionality

---

## 🎉 YOU'RE DONE!

Your Google OAuth login is now configured to:

1. ✅ Show Google Sign-In button on login page
2. ✅ Authenticate with Google
3. ✅ Send ID token to backend
4. ✅ Receive JWT tokens and user data
5. ✅ Store tokens in localStorage
6. ✅ Redirect to home page
7. ✅ Display user information

**Next Steps:**

- Implement protected routes using `useAuth` hook
- Add logout functionality to header/nav
- Implement token refresh logic
- Add profile page to edit user details

---

## 📞 SUPPORT

If you encounter issues:

1. Check browser console for errors
2. Check backend terminal for error messages
3. Verify all environment variables are set
4. Test backend endpoint directly: `http://localhost:3002/health`
5. Ensure Google Cloud Console configuration matches exactly
