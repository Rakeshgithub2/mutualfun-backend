# 🔧 Google OAuth Fix Guide

## ❌ Current Error

```json
{
  "error": "Authentication failed",
  "details": "invalid_client",
  "hint": "Check backend terminal for full error details"
}
```

This is a **BACKEND ERROR** caused by mismatched redirect URIs in Google Cloud Console.

---

## ✅ Required Changes in Google Cloud Console

### Step 1: Update "Authorized JavaScript origins"

**Currently shows:** `http://localhost:5001`

**Should have:**

- `http://localhost:5001` ✅ (your frontend)
- `http://localhost:3002` (optional - can add for testing)

### Step 2: Update "Authorized redirect URIs"

**Currently shows:**

- `http://localhost:3002/api/auth/google/callback` ✅
- `http://localhost:3002/auth/google/callback` ❌ **REMOVE THIS ONE**

**Should ONLY have:**

- `http://localhost:3002/api/auth/google/callback` ✅ (backend callback)

### Step 3: Save and Wait

1. Click **"Save"** button at the bottom
2. **Wait 5 minutes** for Google to propagate changes
3. Restart your backend server after 5 minutes

---

## 🎯 How Google OAuth Should Work

### Current Flow (What You Want):

1. **User clicks "Sign in with Google" on frontend (localhost:5001)**
   - Frontend shows Google login popup
   - User selects Gmail account
   - User clicks "Continue"

2. **Google redirects to backend (localhost:3002/api/auth/google/callback)**
   - Backend receives authorization code
   - Backend exchanges code for user info
   - Backend creates/updates user in MongoDB
   - Backend generates JWT tokens

3. **Backend redirects to frontend with tokens**
   - Frontend receives tokens in URL
   - Frontend stores tokens in localStorage
   - Frontend redirects to home page
   - User is logged in ✅

### Why Numbers (32, 54) Appear:

This suggests your frontend is trying to display a response object instead of handling it properly. The frontend code needs to:

1. Handle the Google OAuth response
2. Send the `idToken` to backend POST `/api/auth/google`
3. Store the JWT tokens from backend
4. Redirect to home page

---

## 🔍 Backend Configuration (Already Fixed)

Your backend `.env` file now has:

```env
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_FROM_CLOUD_CONSOLE
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_FROM_CLOUD_CONSOLE
GOOGLE_REDIRECT_URI=http://localhost:3002/api/auth/google/callback
FRONTEND_URL=https://mutual-fun-frontend-osed.vercel.app
```

✅ Backend is correctly configured!

---

## 📝 Frontend Implementation (What's Missing)

Your frontend needs to implement the Google Sign-In flow properly. Here's what to add:

### Option A: Using @react-oauth/google (Recommended)

```jsx
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

// In your Login component:
const handleGoogleSuccess = async (credentialResponse) => {
  try {
    // Send idToken to backend
    const response = await fetch('http://localhost:3002/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: credentialResponse.credential }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store tokens
      localStorage.setItem('accessToken', data.data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      // Redirect to home page
      window.location.href = '/home'; // or navigate('/home') with react-router
    } else {
      console.error('Login failed:', data.error);
      alert('Login failed: ' + data.error);
    }
  } catch (error) {
    console.error('Google sign-in error:', error);
    alert('Google sign-in failed. Please try again.');
  }
};

// In your JSX:
<GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
  <GoogleLogin
    onSuccess={handleGoogleSuccess}
    onError={() => {
      console.error('Google Login Failed');
      alert('Google login failed. Please try again.');
    }}
    useOneTap={true} // This shows the "select account" popup
  />
</GoogleOAuthProvider>;
```

### Option B: Using Google's JavaScript Library

```html
<!-- Add to your HTML head -->
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

```jsx
// Initialize Google Sign-In
useEffect(() => {
  google.accounts.id.initialize({
    client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    callback: handleGoogleCallback,
  });

  google.accounts.id.renderButton(
    document.getElementById('googleSignInButton'),
    {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      width: 300,
    }
  );
}, []);

const handleGoogleCallback = async (response) => {
  try {
    const res = await fetch('http://localhost:3002/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: response.credential }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('accessToken', data.data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      window.location.href = '/home';
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// In JSX:
<div id="googleSignInButton"></div>;
```

---

## 🧪 Testing Steps

### 1. Update Google Cloud Console

- Add `http://localhost:5001` to "Authorized JavaScript origins"
- Remove `http://localhost:3002/auth/google/callback` from redirect URIs
- Keep only `http://localhost:3002/api/auth/google/callback`
- Save and wait 5 minutes

### 2. Restart Backend

```bash
# Stop current server
Stop-Process -Name node -Force

# Start backend
npx tsx src/server-simple.ts
```

### 3. Test Frontend Flow

1. Go to `http://localhost:5001/login`
2. Click "Sign in with Google" button
3. **You should see:** Google account selection popup
4. Select your Gmail account
5. Click "Continue"
6. **Backend should:** Receive callback, create user, generate tokens
7. **Frontend should:** Receive tokens, store them, redirect to home page

### 4. Verify Login Success

- Check browser localStorage for `accessToken`, `refreshToken`, and `user`
- Check you're redirected to home page
- Check your avatar/name appears in the UI

---

## 🐛 Debugging Tips

### Check Backend Logs

The backend prints detailed logs. Look for:

```
🔵 Google OAuth Callback Started
✅ Authorization code received
✅ Tokens received from Google
✅ ID token verified
✅ User upserted successfully
✅ JWT tokens generated
✅ Redirecting to frontend success page
```

### Check Frontend Console

Open browser DevTools (F12) and look for:

- Any error messages in Console tab
- Network tab - check the POST request to `/api/auth/google`
- Look for the response body

### Common Issues

**"invalid_client" error:**

- Redirect URI mismatch in Google Cloud Console
- Wait 5 minutes after making changes
- Clear browser cache

**Numbers appearing (32, 54):**

- Frontend is not handling the response correctly
- Missing `handleGoogleSuccess` function
- Check you're using the correct response structure

**No Google popup:**

- Client ID is wrong
- "Authorized JavaScript origins" missing frontend URL
- Browser is blocking popups

---

## ✅ Final Checklist

- [ ] Google Cloud Console has `http://localhost:5001` in "Authorized JavaScript origins"
- [ ] Google Cloud Console has ONLY `http://localhost:3002/api/auth/google/callback` in redirect URIs
- [ ] Saved changes and waited 5 minutes
- [ ] Backend restarted with correct configuration
- [ ] Frontend has Google Sign-In button with proper handler
- [ ] Frontend sends `idToken` to POST `/api/auth/google`
- [ ] Frontend stores tokens and redirects on success

---

## 🚀 Expected Result

When working correctly:

1. ✅ Click "Sign in with Google"
2. ✅ See popup with "Choose an account"
3. ✅ Select your Gmail account
4. ✅ See "Continue as [Your Name]"
5. ✅ Click Continue
6. ✅ Popup closes
7. ✅ Redirected to home page
8. ✅ User avatar/name appears in navigation
9. ✅ User is logged in

---

**Next Step:** Make the changes in Google Cloud Console, wait 5 minutes, then test the flow!
