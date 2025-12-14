# 🔐 Google OAuth Setup Guide

## 📋 Google Console Configuration

### Step 1: Go to Google Cloud Console

Visit: https://console.cloud.google.com/apis/credentials

### Step 2: Configure OAuth Consent Screen

1. Go to **OAuth consent screen**
2. Select **External** user type
3. Fill in:
   - App name: **Mutual Funds Platform**
   - User support email: **rakeshd01042024@gmail.com**
   - Developer contact: **rakeshd01042024@gmail.com**
4. Add scopes:
   - `openid`
   - `email`
   - `profile`
5. Save and continue

### Step 3: Create OAuth 2.0 Client ID

Go to **Credentials** → **Create Credentials** → **OAuth Client ID**

**Application type:** Web application

---

## 🌐 URIs to Add to Google Console

### **For Local Development:**

#### Authorized JavaScript origins:

```
http://localhost:5001
http://localhost:3002
```

#### Authorized redirect URIs:

```
http://localhost:3002/api/auth/google/callback
```

---

### **For Production Deployment:**

#### Authorized JavaScript origins:

```
https://yourdomain.com
https://www.yourdomain.com
https://mutual-fun-frontend-osed.vercel.app
```

#### Authorized redirect URIs:

```
https://your-backend-domain.com/api/auth/google/callback
https://your-backend-domain.vercel.app/api/auth/google/callback
```

---

## ⚙️ Backend Configuration (Already Done ✅)

Your `.env` file should have:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3002/api/auth/google/callback
FRONTEND_URL=http://localhost:5001
```

**Backend Endpoint:** Already working at `http://localhost:3002/api/auth/google`

---

## 🎨 Frontend Implementation

### Option 1: Using Google Button (Recommended)

Create a `GoogleLoginButton.tsx` or `GoogleLoginButton.jsx` component:

```tsx
import React from 'react';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    // Redirect to backend OAuth endpoint
    window.location.href = 'http://localhost:3002/api/auth/google';
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="google-login-btn"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 20px',
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: '500',
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20">
        <path
          fill="#4285F4"
          d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"
        />
        <path
          fill="#34A853"
          d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z"
        />
        <path
          fill="#FBBC05"
          d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z"
        />
        <path
          fill="#EA4335"
          d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z"
        />
      </svg>
      Continue with Google
    </button>
  );
};

export default GoogleLoginButton;
```

### Option 2: Using react-google-login Library

Install the package:

```bash
npm install @react-oauth/google
```

Then create:

```tsx
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Send the credential to your backend
      const response = await fetch('http://localhost:3002/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store tokens
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect to home page
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="login-container">
        <h1>Login to Mutual Funds Platform</h1>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => console.log('Login Failed')}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
```

---

## 📄 Auth Success Page (Required)

Create `/auth/success` route in your frontend to handle the redirect from backend.

**File:** `pages/auth/success.tsx` or `src/pages/AuthSuccess.jsx`

```tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router'; // or use react-router-dom

const AuthSuccess = () => {
  const router = useRouter();

  useEffect(() => {
    const { accessToken, refreshToken, user } = router.query;

    if (accessToken && refreshToken && user) {
      // Store tokens in localStorage
      localStorage.setItem('accessToken', accessToken as string);
      localStorage.setItem('refreshToken', refreshToken as string);
      localStorage.setItem('user', user as string);

      // Show success message
      console.log('✅ Login successful!');

      // Redirect to home page after 1 second
      setTimeout(() => {
        router.push('/'); // Change '/' to your home page route
      }, 1000);
    } else {
      // If no tokens, redirect to login
      console.error('❌ Authentication failed');
      router.push('/login');
    }
  }, [router.query]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <div className="spinner"></div>
      <h2>🎉 Login Successful!</h2>
      <p>Redirecting to home page...</p>
    </div>
  );
};

export default AuthSuccess;
```

**For React Router (non-Next.js):**

```tsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const user = searchParams.get('user');

    if (accessToken && refreshToken && user) {
      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', user);

      console.log('✅ Login successful!');

      // Redirect to home page
      setTimeout(() => {
        navigate('/'); // Your home page route
      }, 1000);
    } else {
      console.error('❌ Authentication failed');
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <div className="spinner"></div>
      <h2>🎉 Login Successful!</h2>
      <p>Redirecting to home page...</p>
    </div>
  );
};

export default AuthSuccess;
```

---

## 🔄 Complete Flow

### Step-by-Step Process:

1. **User clicks "Login with Google"** button on your frontend
2. **Frontend redirects** to: `http://localhost:3002/api/auth/google`
3. **Backend redirects** to: Google OAuth consent screen
4. **User authorizes** on Google
5. **Google redirects back** to: `http://localhost:3002/api/auth/google/callback?code=...`
6. **Backend processes** the authorization code:
   - Exchanges code for tokens with Google
   - Verifies the user's identity
   - Creates/updates user in MongoDB
   - Generates JWT tokens
7. **Backend redirects** to: `http://localhost:5001/auth/success?accessToken=...&refreshToken=...&user=...`
8. **Frontend `/auth/success` page**:
   - Extracts tokens from URL
   - Saves tokens to localStorage
   - Redirects to home page (`/`)

---

## 🎯 Quick Setup Checklist

### Backend (Already Done ✅)

- [x] Google OAuth credentials in `.env`
- [x] OAuth route at `/api/auth/google`
- [x] Callback route at `/api/auth/google/callback`
- [x] User creation/update logic
- [x] JWT token generation

### Frontend (You Need to Do)

- [ ] Add "Login with Google" button
- [ ] Create `/auth/success` route
- [ ] Handle token storage
- [ ] Redirect to home page after login

### Google Console (You Need to Do)

- [ ] Add JavaScript origins
- [ ] Add redirect URIs
- [ ] Test OAuth flow

---

## 🧪 Testing

### 1. **Test Local Flow:**

- Click "Login with Google" button
- You should be redirected to Google
- After approving, you should land on `/auth/success`
- Tokens should be saved to localStorage
- You should be redirected to home page

### 2. **Check Browser Console:**

- Look for "✅ Login successful!" message
- Verify tokens in localStorage

### 3. **Check Backend Logs:**

- You should see "🎉 Google OAuth completed successfully"

---

## 🔧 Troubleshooting

### Error: "redirect_uri_mismatch"

**Solution:** Make sure `http://localhost:3002/api/auth/google/callback` is added to Google Console's Authorized redirect URIs

### Error: "origin_mismatch"

**Solution:** Add `http://localhost:5001` to Authorized JavaScript origins

### Tokens not appearing in localStorage

**Solution:** Check browser console for errors, ensure `/auth/success` route exists

### Redirect to home not working

**Solution:** Make sure you're using the correct router (useRouter for Next.js, useNavigate for React Router)

---

## 📱 Production Deployment

### Update `.env` for Production:

```env
GOOGLE_REDIRECT_URI=https://your-backend.vercel.app/api/auth/google/callback
FRONTEND_URL=https://mutual-fun-frontend-osed.vercel.app
```

### Update Google Console:

Add production URLs to Authorized origins and redirect URIs

---

## ✅ Summary

**Google Console URIs (Local Development):**

- **JavaScript Origins:** `http://localhost:5001`, `http://localhost:3002`
- **Redirect URI:** `http://localhost:3002/api/auth/google/callback`

**Frontend Routes Needed:**

- `/auth/success` - Handles OAuth callback and redirects to home

**After Login:**

- User automatically redirects to `/` (home page)
- Tokens saved in localStorage
- User data available throughout the app

**That's it! Your Google OAuth is ready to use! 🚀**
