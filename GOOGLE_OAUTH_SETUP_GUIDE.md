# Google OAuth Setup Guide

## 🎯 Complete Setup Instructions

### Step 1: Google Cloud Console Configuration

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/apis/credentials
   - Make sure you're logged in with your Google account

2. **Select or Create a Project**
   - If you don't have a project, create one
   - Select your project from the dropdown at the top

3. **Enable Google+ API**
   - Go to: https://console.cloud.google.com/apis/library
   - Search for "Google+ API"
   - Click "ENABLE"

4. **Create OAuth 2.0 Credentials**
   - Go back to: https://console.cloud.google.com/apis/credentials
   - Click "CREATE CREDENTIALS" → "OAuth client ID"
   - If prompted, configure the OAuth consent screen first

5. **Configure OAuth Consent Screen** (if needed)
   - Click "CONFIGURE CONSENT SCREEN"
   - Select "External" user type → Click "CREATE"
   - Fill in the required fields:
     - App name: "Mutual Funds App" (or your app name)
     - User support email: Your email
     - Developer contact: Your email
   - Click "SAVE AND CONTINUE"
   - Skip "Scopes" for now → Click "SAVE AND CONTINUE"
   - Add test users if in testing mode → Click "SAVE AND CONTINUE"

6. **Create OAuth Client ID**
   - Application type: Select "Web application"
   - Name: "Mutual Funds Backend"

   **Authorized JavaScript origins:**

   ```
   http://localhost:3002
   http://localhost:5001
   ```

   **Authorized redirect URIs - ADD THESE EXACT URLs:**

   ```
   http://localhost:3002/api/auth/google/callback
   ```

   - Click "CREATE"
   - Copy your Client ID and Client Secret
   - Update these in your `.env` file

### Step 2: Backend Environment Variables

Your `.env` file should have these variables:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3002/api/auth/google/callback

# Frontend URL (where to redirect after successful auth)
FRONTEND_URL=http://localhost:5001
```

### Step 3: API Endpoints

The backend now exposes these clean endpoints:

#### 1. Initiate Google OAuth

```
GET http://localhost:3002/api/auth/google
```

**Response:**

```json
{
  "success": true,
  "data": {
    "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
  }
}
```

#### 2. Google Callback (Automatic)

```
GET http://localhost:3002/api/auth/google/callback?code=...
```

This endpoint:

- Receives the authorization code from Google
- Exchanges it for an access token
- Gets user info from Google
- Creates or updates user in your database
- Generates JWT tokens
- Redirects to frontend with tokens

**Redirect URL:**

```
http://localhost:5001/auth/callback?accessToken=...&refreshToken=...
```

### Step 4: Frontend Integration

In your frontend, implement the OAuth flow:

```javascript
// 1. Start OAuth flow
const initiateGoogleLogin = async () => {
  try {
    const response = await fetch('http://localhost:3002/api/auth/google');
    const data = await response.json();

    if (data.success) {
      // Redirect user to Google login
      window.location.href = data.data.authUrl;
    }
  } catch (error) {
    console.error('OAuth initiation failed:', error);
  }
};

// 2. Handle callback (on your /auth/callback route)
const handleAuthCallback = () => {
  const params = new URLSearchParams(window.location.search);
  const accessToken = params.get('accessToken');
  const refreshToken = params.get('refreshToken');

  if (accessToken && refreshToken) {
    // Store tokens
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    // Redirect to dashboard
    window.location.href = '/dashboard';
  } else {
    // Handle error
    const error = params.get('message');
    console.error('Auth failed:', error);
  }
};

// 3. Handle error (on your /auth/error route)
const handleAuthError = () => {
  const params = new URLSearchParams(window.location.search);
  const errorMessage = params.get('message');
  // Show error to user
};
```

### Step 5: Testing the Flow

1. **Start your backend:**

   ```bash
   npm run dev
   ```

2. **Test the OAuth initiation:**

   ```bash
   curl http://localhost:3002/api/auth/google
   ```

   You should get a response with an `authUrl`.

3. **Test complete flow:**
   - Open the `authUrl` in your browser
   - Login with Google
   - You should be redirected to your frontend with tokens

### Step 6: User Data Structure

After successful OAuth, users are stored in MongoDB with this structure:

```javascript
{
  _id: ObjectId,
  email: "user@gmail.com",
  firstName: "John",
  lastName: "Doe",
  profilePicture: "https://lh3.googleusercontent.com/...",
  authProvider: "google",
  googleId: "123456789",
  emailVerified: true,
  role: "user",
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Production Deployment

When deploying to production:

1. **Update Google Cloud Console:**
   - Add production redirect URI:
     ```
     https://your-backend-domain.com/api/auth/google/callback
     ```

2. **Update .env file:**

   ```env
   GOOGLE_REDIRECT_URI=https://your-backend-domain.com/api/auth/google/callback
   FRONTEND_URL=https://your-frontend-domain.com
   ```

3. **Add authorized origins:**
   ```
   https://your-backend-domain.com
   https://your-frontend-domain.com
   ```

## 📋 URLs Summary for Google Console

**Add these exact URLs to your Google Cloud Console:**

### Development:

```
Authorized JavaScript origins:
- http://localhost:3002
- http://localhost:5001

Authorized redirect URIs:
- http://localhost:3002/api/auth/google/callback
```

### Production (when ready):

```
Authorized JavaScript origins:
- https://your-backend-domain.com
- https://your-frontend-domain.com

Authorized redirect URIs:
- https://your-backend-domain.com/api/auth/google/callback
```

## 🔧 Troubleshooting

### Error: "redirect_uri_mismatch"

- **Solution:** Make sure the redirect URI in Google Console EXACTLY matches the one in your .env file
- Check for trailing slashes, http vs https, etc.

### Error: "access_denied"

- **Solution:** User cancelled the login or your app is in testing mode and user is not added as a test user

### No tokens in callback

- **Solution:** Check backend logs for errors
- Verify Google Client ID and Secret are correct
- Ensure MongoDB is connected

## 📞 Support

If you encounter issues:

1. Check backend console logs
2. Verify all URLs match exactly
3. Ensure Google+ API is enabled
4. Confirm OAuth consent screen is configured

---

**Last Updated:** December 26, 2025
**Backend Port:** 3002
**Frontend Port:** 5001
