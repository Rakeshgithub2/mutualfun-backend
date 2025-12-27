# FRONTEND AUTHENTICATION IMPLEMENTATION GUIDE

## 🎯 Backend Status: ✅ FULLY WORKING

The backend authentication system is complete and deployed at:
**`https://mutualfun-backend.vercel.app/api`**

---

## 📋 AVAILABLE AUTHENTICATION ENDPOINTS

### 1️⃣ **Email/Password Registration**
- **Endpoint:** `POST /api/auth/register`
- **Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```
- **Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": "uuid-here",
      "email": "john@example.com",
      "name": "John Doe",
      "firstName": "John",
      "lastName": "Doe",
      "emailVerified": false,
      "authMethod": "email",
      "preferences": {
        "theme": "light",
        "language": "en",
        "currency": "INR",
        "riskProfile": "moderate"
      },
      "subscription": {
        "plan": "free"
      },
      "kyc": {
        "status": "pending"
      }
    }
  }
}
```

---

### 2️⃣ **Email/Password Login**
- **Endpoint:** `POST /api/auth/login`
- **Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```
- **Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": "uuid-here",
      "email": "john@example.com",
      "name": "John Doe",
      "firstName": "John",
      "lastName": "Doe",
      "picture": null,
      "emailVerified": false,
      "authMethod": "email",
      "preferences": { /* same as above */ },
      "subscription": { /* same as above */ },
      "kyc": { /* same as above */ }
    }
  }
}
```

---

### 3️⃣ **Google OAuth Login**
- **Endpoint:** `POST /api/auth/google`
- **Request Body:**
```json
{
  "token": "google-id-token-from-credential-response"
}
```
- **Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": "uuid-here",
      "email": "john@gmail.com",
      "name": "John Doe",
      "firstName": "John",
      "lastName": "Doe",
      "picture": "https://lh3.googleusercontent.com/...",
      "emailVerified": true,
      "authMethod": "google",
      "preferences": { /* same as above */ },
      "subscription": { /* same as above */ },
      "kyc": { /* same as above */ }
    }
  }
}
```

---

## 🔨 FRONTEND IMPLEMENTATION TASKS

### ✅ **Task 1: Create Registration Form**

**File:** `components/auth/RegisterForm.jsx` (or `.tsx`)

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // or Next.js useRouter

export default function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://mutualfun-backend.vercel.app/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user data
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        // Redirect to home page
        navigate('/home'); // or '/dashboard'
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="First Name"
        value={formData.firstName}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password (min 8 characters)"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
        minLength={8}
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
```

---

### ✅ **Task 2: Create Login Form**

**File:** `components/auth/LoginForm.jsx`

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://mutualfun-backend.vercel.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user data
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        // Redirect to home page
        navigate('/home');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

---

### ✅ **Task 3: Implement Google OAuth**

**File:** `components/auth/GoogleLoginButton.jsx`

**Step 1:** Install Google OAuth library
```bash
npm install @react-oauth/google
```

**Step 2:** Setup Google OAuth in your app

**File:** `_app.js` or `layout.jsx` (Root component)
```jsx
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function App({ children }) {
  return (
    <GoogleOAuthProvider clientId="336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com">
      {children}
    </GoogleOAuthProvider>
  );
}
```

**Step 3:** Create Google Login Button

```jsx
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

export default function GoogleLoginButton() {
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch('https://mutualfun-backend.vercel.app/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: credentialResponse.credential // Google ID token
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token and user data
        localStorage.setItem('accessToken', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        // Redirect to home page
        navigate('/home');
      } else {
        console.error('Google login failed:', data.message);
      }
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={handleGoogleError}
      useOneTap
    />
  );
}
```

---

### ✅ **Task 4: Create Auth Context/Store**

**File:** `context/AuthContext.jsx`

```jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user and token from localStorage on mount
    const savedToken = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

---

### ✅ **Task 5: Create Protected Route Component**

**File:** `components/auth/ProtectedRoute.jsx`

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

**Usage in routes:**
```jsx
<Route 
  path="/home" 
  element={
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  } 
/>
```

---

### ✅ **Task 6: Create API Helper with Auth Headers**

**File:** `utils/api.js`

```javascript
const API_BASE_URL = 'https://mutualfun-backend.vercel.app/api';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('accessToken');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid - logout
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw new Error(data.error || 'API request failed');
  }

  return data;
}
```

---

## 🎨 **Complete Authentication Page Example**

**File:** `pages/auth/SignIn.jsx`

```jsx
import { useState } from 'react';
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';
import GoogleLoginButton from '../../components/auth/GoogleLoginButton';

export default function SignInPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
        
        {/* Google OAuth Button */}
        <GoogleLoginButton />
        
        <div className="divider">OR</div>
        
        {/* Email/Password Form */}
        {isLogin ? <LoginForm /> : <RegisterForm />}
        
        {/* Toggle between Login/Register */}
        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
}
```

---

## 🔒 **Error Handling Reference**

### Common Error Responses:

```javascript
// 400 - Validation Error
{
  "success": false,
  "error": "Email and password are required"
}

// 400 - User exists
{
  "success": false,
  "error": "User with this email already exists"
}

// 401 - Invalid credentials
{
  "success": false,
  "error": "Invalid email or password"
}

// 401 - Invalid Google token
{
  "success": false,
  "message": "Invalid Google token"
}

// 500 - Server error
{
  "success": false,
  "error": "Internal server error"
}
```

---

## ✅ **Testing Checklist**

- [ ] Registration form works with firstName, lastName, email, password
- [ ] Registration validates email format
- [ ] Registration requires password minimum 8 characters
- [ ] Registration shows error messages
- [ ] Registration redirects to /home on success
- [ ] Login form works with email and password
- [ ] Login shows error for invalid credentials
- [ ] Login redirects to /home on success
- [ ] Google OAuth button appears
- [ ] Google login creates/logs in user
- [ ] Google login redirects to /home on success
- [ ] Token stored in localStorage
- [ ] User data stored in localStorage
- [ ] Protected routes redirect to login if not authenticated
- [ ] Logout clears token and user data

---

## 🚀 **Summary**

**Backend provides:**
- ✅ Registration endpoint
- ✅ Login endpoint
- ✅ Google OAuth endpoint
- ✅ JWT token generation
- ✅ User data storage in MongoDB
- ✅ Password hashing with bcrypt
- ✅ CORS configured for your frontend

**Frontend needs to:**
1. Create registration form
2. Create login form
3. Implement Google OAuth button
4. Store token in localStorage
5. Redirect to /home after successful auth
6. Create protected routes
7. Add Authorization header for authenticated requests

**Backend URL:** `https://mutualfun-backend.vercel.app/api`

**Google Client ID:** `336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com`

All authentication is working on the backend - just implement the frontend according to this guide! 🎉
