# 🎯 GOOGLE OAUTH - QUICK REFERENCE

> **✅ CONFIGURED:** Backend ready with redirect URI: `http://localhost:3002/api/auth/google/callback`

---

## 🚀 20-MINUTE SETUP

### 1️⃣ Install (1 min)

```bash
npm install @react-oauth/google axios
```

### 2️⃣ Environment Variables (2 min)

**Create frontend/.env:**

```env
VITE_API_URL=http://localhost:3002
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
```

### 3️⃣ Wrap App (3 min)

**src/main.jsx:**

```jsx
import { GoogleOAuthProvider } from '@react-oauth/google';

<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
  <App />
</GoogleOAuthProvider>;
```

### 4️⃣ Copy Components (5 min)

- `frontend-google-login-button-updated.jsx` → `src/components/GoogleLoginButton.jsx`
- `frontend-auth-success-component.jsx` → `src/pages/AuthSuccess.jsx`

### 5️⃣ Add Routes (2 min)

```jsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/auth/success" element={<AuthSuccess />} />
</Routes>
```

### 6️⃣ Configure Port 5001 (1 min)

**vite.config.js:**

```javascript
export default defineConfig({
  server: { port: 5001 },
});
```

### 7️⃣ Test! (2 min)

```bash
npm run dev  # Opens http://localhost:5001
```

---

## 🔑 KEY CONFIGURATIONS

| Setting           | Value                                          |
| ----------------- | ---------------------------------------------- |
| **Frontend Port** | 5001                                           |
| **Backend Port**  | 3002                                           |
| **Login Page**    | http://localhost:5001/login                    |
| **Home Page**     | http://localhost:5001/                         |
| **Auth Callback** | http://localhost:3002/api/auth/google/callback |

**Google Cloud Console:**

- **Authorized Origins:** `http://localhost:5001`, `http://localhost:3002`
- **Redirect URI:** `http://localhost:3002/api/auth/google/callback`

---

## 📝 BACKEND API ENDPOINT

```
POST http://localhost:3002/api/auth/google
Content-Type: application/json

{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI..." // From Google OAuth
}
```

**Success Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "userId": "676733fc6d3e14f2e5ef2f88",
      "email": "user@gmail.com",
      "name": "John Doe",
      "role": "USER"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 900
    }
  }
}
```

---

## 🎯 USER FLOW

```
Login Page → Click Google Button → Google Auth →
Backend Verification → JWT Tokens → Redirect Home
```

1. User visits `/login`
2. Clicks "Sign in with Google"
3. Google popup authentication
4. Frontend sends ID token to backend
5. Backend verifies and creates/updates user
6. Backend returns JWT tokens
7. Frontend stores tokens in localStorage
8. **Frontend redirects to home page (`/`)**

---

## 💾 STORED DATA

After login, localStorage contains:

```javascript
accessToken: "eyJhbGci..."
refreshToken: "eyJhbGci..."
user: {"id":"...","email":"...","name":"..."}
```

---

## 🧪 TESTING

```bash
# Backend health check
curl http://localhost:3002/health

# Frontend running
curl http://localhost:5001

# Check environment
echo $VITE_GOOGLE_CLIENT_ID
```

**In browser console:**

```javascript
console.log(localStorage.getItem('accessToken'));
console.log(JSON.parse(localStorage.getItem('user')));
```

---

## ✅ SUCCESS CHECKLIST

After successful login:

- [x] Redirects to `http://localhost:5001/`
- [x] Console shows `✅ User logged in`
- [x] localStorage has tokens and user data
- [x] Home page displays user name/email

---

## 🛠️ TROUBLESHOOTING

| Error                   | Solution                                                 |
| ----------------------- | -------------------------------------------------------- |
| CORS error              | Add `http://localhost:5001` to backend `ALLOWED_ORIGINS` |
| `redirect_uri_mismatch` | Verify URI in Google Console                             |
| Button not showing      | Check `VITE_GOOGLE_CLIENT_ID` in .env                    |
| "Cannot connect"        | Backend must be running on port 3002                     |

---

## 📦 FILES TO COPY

From backend folder to your frontend:

1. **GoogleLoginButton.jsx**
   - Source: `frontend-google-login-button-updated.jsx`
   - Destination: `src/components/GoogleLoginButton.jsx`
   - Purpose: Google Sign-In button with full logic

2. **AuthSuccess.jsx**
   - Source: `frontend-auth-success-component.jsx`
   - Destination: `src/pages/AuthSuccess.jsx`
   - Purpose: Handles OAuth callback and redirects to home

---

## 🔐 PROTECTED ROUTES

**Create src/hooks/useAuth.js:**

```javascript
export function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return { user, isAuthenticated, logout };
}
```

**Usage:**

```jsx
function HomePage() {
  const { user, isAuthenticated, logout } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <div>
      <h1>Welcome {user.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## 🎉 COMPLETE!

**Your Google OAuth is ready when:**

- ✅ Frontend runs on port 5001
- ✅ Backend runs on port 3002
- ✅ Login button appears
- ✅ Login redirects to home page
- ✅ User data displays correctly

**See full guide:** `GOOGLE_OAUTH_SETUP_COMPLETE.md`

### 2. Wrap App

```jsx
import { GoogleOAuthProvider } from '@react-oauth/google';

<GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com">
  <App />
</GoogleOAuthProvider>;
```

### 3. Add Button

```jsx
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

<GoogleLogin
  onSuccess={async (credentialResponse) => {
    const response = await axios.post('http://localhost:3002/api/auth/google', {
      idToken: credentialResponse.credential,
    });

    localStorage.setItem('accessToken', response.data.data.tokens.accessToken);
    localStorage.setItem(
      'refreshToken',
      response.data.data.tokens.refreshToken
    );
    localStorage.setItem('user', JSON.stringify(response.data.data.user));

    window.location.href = '/';
  }}
  onError={() => alert('Login failed')}
/>;
```

## MongoDB Storage

**Collection**: `users`

**Key Fields**:

- `userId` - Unique identifier (UUID)
- `googleId` - Google account ID
- `email` - User email (verified)
- `name`, `firstName`, `lastName` - User name
- `picture` - Google profile photo URL
- `authMethod` - "google" (or "email" or "both")
- `emailVerified` - Always `true` for Google
- `preferences` - User settings
- `kyc` - KYC status
- `subscription` - Subscription plan
- `refreshTokens` - Array of JWT refresh tokens
- `lastLogin` - Last login timestamp
- `loginHistory` - Array of login records
- `createdAt`, `updatedAt` - Timestamps

## Technologies Used

**Backend:**

- `google-auth-library` - Verifies Google ID tokens
- `jsonwebtoken` - JWT token generation
- `bcrypt` - Password hashing
- `MongoDB` - User data storage
- `Express.js` + `TypeScript`

**Frontend:**

- `@react-oauth/google` - Google OAuth React library
- `axios` - HTTP client

## Testing

### Check if backend is running:

```bash
curl http://localhost:3002/health
```

### Test Google OAuth endpoint:

```bash
curl -X POST http://localhost:3002/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"idToken":"fake_token"}'
```

Expected: Error about invalid token (proves endpoint works)

### Verify in MongoDB:

```bash
mongosh "mongodb+srv://rakeshd01042024_db_user:Rakesh1234@mutualfunds.l7zeno9.mongodb.net/"
use test
db.users.find().pretty()
```

## Troubleshooting

| Problem                   | Solution                                      |
| ------------------------- | --------------------------------------------- |
| CORS error                | Add frontend URL to `src/app.ts` CORS origins |
| Token verification failed | Check Google credentials in `.env`            |
| Backend not responding    | Run `npm run dev` in backend folder           |
| User not in database      | Check MongoDB connection string               |

## Environment Variables (.env)

```env
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI=http://localhost:3002/api/auth/google/callback
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
DATABASE_URL=mongodb+srv://...
FRONTEND_URL=http://localhost:5001
```

## Status

✅ **Backend Implementation**: Complete and working  
✅ **MongoDB Schema**: Correct and tested  
✅ **Environment Variables**: Configured  
🔧 **Frontend Integration**: Needs implementation

**Next Step**: Implement frontend code using the examples in `GOOGLE_OAUTH_COMPLETE_SOLUTION.md`
