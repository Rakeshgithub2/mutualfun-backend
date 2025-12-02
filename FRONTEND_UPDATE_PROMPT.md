# Complete Frontend Integration Prompt for Authentication System

Copy and paste this entire prompt to your frontend AI assistant or give to your frontend developer.

---

## 🎯 Objective

Integrate authentication system (Email/Password + Google Sign-In) into the React/Next.js frontend application that connects to the backend API at `http://localhost:3002/api`.

---

## 📋 Backend API Endpoints (Already Working)

The backend provides these authentication endpoints:

1. **POST** `/api/auth/register` - Register new user
   - Body: `{ name, email, password }`
   - Response: `{ statusCode: 201, message, data: { user, tokens } }`

2. **POST** `/api/auth/login` - Login with email/password
   - Body: `{ email, password }`
   - Response: `{ statusCode: 200, message, data: { user, tokens } }`

3. **POST** `/api/auth/google` - Google Sign-In
   - Body: `{ idToken }`
   - Response: `{ statusCode: 200, message, data: { user, tokens } }`

4. **POST** `/api/auth/refresh` - Refresh access token
   - Body: `{ refreshToken }`
   - Response: `{ data: { tokens: { accessToken } } }`

---

## 🔑 Configuration Details

### Environment Variables (Create `.env` file):

```env
REACT_APP_API_URL=http://localhost:3002/api
REACT_APP_BACKEND_URL=http://localhost:3002
REACT_APP_GOOGLE_CLIENT_ID=336417139932-cofvfoqgqch4uub4kt9krimj1mhosilc.apps.googleusercontent.com
```

For Next.js, use `NEXT_PUBLIC_` prefix instead of `REACT_APP_`.

### Google OAuth Configuration:

- **Client ID**: `336417139932-cofvfoqgqch4uub4kt9krimj1mhosilc.apps.googleusercontent.com`
- **Authorized JavaScript origins** (in Google Cloud Console):
  - `http://localhost:5001` (your frontend)
  - `https://mutual-fun-frontend-osed.vercel.app` (production frontend)
- **Authorized redirect URIs** (in Google Cloud Console):
  - `http://localhost:3002/api/auth/google/callback` (backend callback - NOT frontend!)

---

## 📦 Required Dependencies

Install these packages:

```bash
npm install axios @react-oauth/google react-router-dom
```

---

## 🛠️ Implementation Requirements

### 1. Create API Service (`src/services/api.js`)

Create an axios instance with:

- Base URL from environment variable
- Request interceptor to add JWT token from localStorage
- Response interceptor to handle 401 errors and automatically refresh tokens
- When token refresh fails, clear localStorage and redirect to `/login`

### 2. Create Auth Service (`src/services/authService.js`)

Implement these methods:

- `register(name, email, password)` - Call POST `/auth/register`, store tokens in localStorage
- `login(email, password)` - Call POST `/auth/login`, store tokens in localStorage
- `googleSignIn(idToken)` - Call POST `/auth/google`, store tokens in localStorage
- `logout()` - Clear tokens from localStorage
- `getCurrentUser()` - Get user from localStorage
- `isAuthenticated()` - Check if accessToken exists

Store these in localStorage:

- `accessToken` - JWT access token
- `refreshToken` - JWT refresh token
- `user` - Serialized user object (id, email, name, role)

### 3. Create Auth Context (`src/contexts/AuthContext.jsx`)

Create React Context with:

- State: `user`, `loading`
- Methods: `register`, `login`, `googleSignIn`, `logout`
- Property: `isAuthenticated` (boolean)
- Load user from localStorage on mount
- Export `useAuth()` hook

### 4. Create Protected Route Component (`src/components/ProtectedRoute.jsx`)

- Check `isAuthenticated` from `useAuth()`
- Show loading spinner while checking auth
- Redirect to `/login` if not authenticated
- Render children if authenticated

### 5. Create Login Page (`src/pages/Login.jsx`)

Features needed:

- Email and password input fields
- Form validation (email format, required fields)
- Call `login()` from `useAuth()`
- Display error messages
- Integrate Google Sign-In button using `@react-oauth/google`
- On success, navigate to `/dashboard`
- Link to registration page
- Show loading state during authentication

### 6. Create Register Page (`src/pages/Register.jsx`)

Features needed:

- Name, email, password, confirm password fields
- Form validation (matching passwords, min 8 characters, email format)
- Call `register()` from `useAuth()`
- Display error messages
- Integrate Google Sign-In button
- On success, navigate to `/dashboard`
- Link to login page
- Show loading state during registration

### 7. Create Dashboard Page (`src/pages/Dashboard.jsx`)

Features needed:

- Display logged-in user info (name, email, role, id)
- Logout button that calls `logout()` and redirects to `/login`
- This should be a protected route

### 8. Update App Entry Point

Wrap the entire app with:

1. `GoogleOAuthProvider` (with clientId from env)
2. `BrowserRouter` (or your router)
3. `AuthProvider` (your auth context)

### 9. Setup Routes

Create these routes:

- `/` - Redirect to `/login`
- `/login` - Login page (public)
- `/register` - Register page (public)
- `/dashboard` - Dashboard page (protected with `ProtectedRoute`)

---

## 🎨 UI/UX Requirements

### Form Styling:

- Use Tailwind CSS or your existing design system
- Center forms on the page (full height)
- Add proper spacing and padding
- Use consistent color scheme (e.g., indigo for primary buttons)
- Rounded corners on inputs and buttons
- Clear visual feedback for errors (red background/text)
- Disable buttons during loading

### Google Sign-In Button:

- Use the official Google button from `@react-oauth/google`
- Place below login/register form with "Or continue with" divider
- Enable One Tap login if desired

### Error Handling:

- Display API errors in a red alert box above the form
- Clear errors when user types or submits again
- Show specific error messages from backend

### Loading States:

- Disable submit button during API calls
- Show "Signing in..." or "Creating account..." text
- Optional: Add spinner icon

---

## 🔒 Security Best Practices

1. **Token Storage**: Store in localStorage (not sessionStorage for persistence)
2. **Automatic Token Refresh**: Implement in axios response interceptor
3. **Protected Routes**: Always wrap authenticated pages with `ProtectedRoute`
4. **Logout on Errors**: Clear tokens and redirect on auth failures
5. **Password Validation**: Enforce minimum 8 characters
6. **HTTPS in Production**: Use secure connections for all API calls

---

## 📝 Backend Response Format

All API responses follow this structure:

**Success Response:**

```json
{
  "statusCode": 200 | 201,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "692f1c956c9e0d3ee25796f7",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  },
  "timestamp": "2025-12-02T17:06:29.645Z"
}
```

**Error Response:**

```json
{
  "error": "Invalid email or password",
  "statusCode": 401
}
```

---

## ✅ Testing Checklist

After implementation, test these scenarios:

### Registration:

- [ ] User can register with valid name, email, password
- [ ] Shows error for passwords < 8 characters
- [ ] Shows error for invalid email format
- [ ] Shows error for mismatched passwords
- [ ] Shows error for duplicate email
- [ ] Redirects to dashboard on success
- [ ] Stores tokens in localStorage

### Login:

- [ ] User can login with correct credentials
- [ ] Shows error for wrong password
- [ ] Shows error for non-existent email
- [ ] Redirects to dashboard on success
- [ ] Updates tokens in localStorage

### Google Sign-In:

- [ ] Google button appears and is clickable
- [ ] Opens Google authentication popup
- [ ] Completes authentication and redirects to dashboard
- [ ] Works for both new and existing users
- [ ] Stores tokens in localStorage

### Protected Routes:

- [ ] Cannot access `/dashboard` without login
- [ ] Redirects to `/login` if not authenticated
- [ ] Can access dashboard after login
- [ ] Logout button works and redirects to login
- [ ] Tokens are cleared on logout

### Token Refresh:

- [ ] API calls include Authorization header
- [ ] Expired tokens are automatically refreshed
- [ ] Failed refresh redirects to login
- [ ] User stays logged in after token refresh

---

## 🚀 Production Deployment (Vercel)

When deploying to Vercel:

1. **Add Environment Variables in Vercel Dashboard:**

   ```
   REACT_APP_API_URL=https://your-backend.vercel.app/api
   REACT_APP_BACKEND_URL=https://your-backend.vercel.app
   REACT_APP_GOOGLE_CLIENT_ID=336417139932-cofvfoqgqch4uub4kt9krimj1mhosilc.apps.googleusercontent.com
   ```

2. **Update Google Cloud Console:**
   - Add your Vercel URL to "Authorized JavaScript origins"
   - Example: `https://mutual-fun-frontend-osed.vercel.app`

3. **Backend CORS:**
   - Backend is already configured for: `https://mutual-fun-frontend-osed.vercel.app`

---

## 💡 Example Code Snippets

### Axios Instance with Interceptors:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${process.env.REACT_APP_API_URL}/auth/refresh`,
            { refreshToken }
          );
          localStorage.setItem('accessToken', data.data.tokens.accessToken);
          error.config.headers.Authorization = `Bearer ${data.data.tokens.accessToken}`;
          return api(error.config);
        } catch (e) {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Google Login Handler:

```javascript
const handleGoogleSuccess = async (credentialResponse) => {
  const result = await googleSignIn(credentialResponse.credential);
  if (result.success) {
    navigate('/dashboard');
  } else {
    setError(result.error);
  }
};

<GoogleLogin
  onSuccess={handleGoogleSuccess}
  onError={() => setError('Google sign-in failed')}
  useOneTap
/>;
```

---

## 🎯 Summary

**What you need to build:**

1. API service with axios (auto token refresh)
2. Auth service (register, login, googleSignIn, logout)
3. Auth context provider (React Context)
4. Protected route component
5. Login page with Google Sign-In button
6. Register page with Google Sign-In button
7. Dashboard page showing user info
8. Route configuration with public and protected routes

**What's already done on backend:**

- ✅ All API endpoints working and tested
- ✅ JWT token generation
- ✅ Password hashing with bcrypt
- ✅ MongoDB user storage
- ✅ Google OAuth verification
- ✅ CORS configured for your frontend URL
- ✅ Token refresh endpoint

**Next step:**
Start by creating the API service and auth service, then build the UI components.

---

## 📞 Backend API Details

**Base URL**: `http://localhost:3002/api` (or `https://your-backend.vercel.app/api` in production)

**CORS Enabled For**:

- http://localhost:5001
- http://localhost:3000
- http://localhost:3001
- https://mf-frontend-coral.vercel.app
- https://mutual-fun-frontend-osed.vercel.app

**Authentication Backend Status**: ✅ Fully tested and working
**Test Results**: All tests passing (run `node test-auth-simple.js` to verify)

---

This prompt contains everything needed to implement the complete authentication system on your frontend. Good luck! 🚀
