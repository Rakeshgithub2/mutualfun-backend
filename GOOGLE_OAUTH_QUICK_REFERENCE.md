# 🎯 Google OAuth Quick Reference

## Backend API Endpoint

```
POST http://localhost:3002/api/auth/google
Content-Type: application/json

{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI..." // From Google OAuth
}
```

## Success Response

```json
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
      "preferences": { ... },
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

## Frontend Integration (1 Minute Setup)

### 1. Install Package

```bash
npm install @react-oauth/google axios
```

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
