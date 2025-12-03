# 🎨 Google OAuth Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         GOOGLE OAUTH COMPLETE FLOW                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐      ┌──────────────┐      ┌──────────────┐      ┌──────────┐
│   Frontend   │      │    Google    │      │   Backend    │      │ MongoDB  │
│ (React/Next) │      │    OAuth     │      │  (Express)   │      │  users   │
└──────┬───────┘      └──────┬───────┘      └──────┬───────┘      └────┬─────┘
       │                     │                     │                    │
       │ 1. User clicks     │                     │                    │
       │ "Sign in with      │                     │                    │
       │  Google" button    │                     │                    │
       │────────────────────>│                    │                    │
       │                     │                     │                    │
       │ 2. Google shows    │                     │                    │
       │    account picker  │                     │                    │
       │<────────────────────│                    │                    │
       │                     │                     │                    │
       │ 3. User selects    │                     │                    │
       │    account &       │                     │                    │
       │    grants access   │                     │                    │
       │────────────────────>│                    │                    │
       │                     │                     │                    │
       │ 4. Google returns  │                     │                    │
       │    ID token        │                     │                    │
       │<────────────────────│                    │                    │
       │                     │                     │                    │
       │ 5. POST /api/auth/google                │                    │
       │    { idToken: "..." }                    │                    │
       │─────────────────────────────────────────>│                    │
       │                     │                     │                    │
       │                     │ 6. Verify token    │                    │
       │                     │<────────────────────│                    │
       │                     │                     │                    │
       │                     │ 7. Token valid ✓   │                    │
       │                     │    Return user info│                    │
       │                     │─────────────────────>                   │
       │                     │                     │                    │
       │                     │                     │ 8. Check if user  │
       │                     │                     │    exists by      │
       │                     │                     │    googleId       │
       │                     │                     │───────────────────>│
       │                     │                     │                    │
       │                     │                     │ 9. User found     │
       │                     │                     │    OR create new  │
       │                     │                     │<───────────────────│
       │                     │                     │                    │
       │                     │                     │ 10. Save/Update   │
       │                     │                     │     user data     │
       │                     │                     │───────────────────>│
       │                     │                     │                    │
       │                     │                     │ 11. User saved ✓  │
       │                     │                     │<───────────────────│
       │                     │                     │                    │
       │                     │ 12. Generate JWT    │                    │
       │                     │     tokens          │                    │
       │                     │     (access +       │                    │
       │                     │      refresh)       │                    │
       │                     │                     │                    │
       │ 13. Return response │                     │                    │
       │     {               │                     │                    │
       │       user: {...},  │                     │                    │
       │       tokens: {...} │                     │                    │
       │     }               │                     │                    │
       │<─────────────────────────────────────────│                    │
       │                     │                     │                    │
       │ 14. Store tokens    │                     │                    │
       │     in localStorage │                     │                    │
       │                     │                     │                    │
       │ 15. Redirect to     │                     │                    │
       │     home page       │                     │                    │
       │                     │                     │                    │
       │ ✅ USER LOGGED IN   │                     │                    │
       │                     │                     │                    │
```

---

## 🗄️ MongoDB User Document Structure

```
users Collection
├── _id: ObjectId("...")
├── userId: "550e8400-e29b-41d4-a716-446655440000"  ← Generated UUID
├── googleId: "102837465940283746594"                ← From Google
├── email: "user@gmail.com"                          ← From Google
├── emailVerified: true                              ← Always true
├── authMethod: "google"                             ← Auth type
├── password: null                                   ← No password
├── name: "John Doe"                                 ← Full name
├── firstName: "John"                                ← First name
├── lastName: "Doe"                                  ← Last name
├── picture: "https://lh3.googleusercontent.com/..." ← Photo URL
├── phone: null
├── preferences: {
│   ├── theme: "light"
│   ├── language: "en"
│   ├── currency: "INR"
│   ├── riskProfile: "moderate"
│   └── notifications: {
│       ├── email: true
│       ├── push: true
│       ├── priceAlerts: true
│       └── newsAlerts: true
│   }
├── kyc: {
│   ├── status: "pending"
│   ├── panNumber: null
│   ├── aadharNumber: null
│   └── verifiedAt: null
│ }
├── subscription: {
│   ├── plan: "free"
│   ├── startDate: null
│   ├── endDate: null
│   └── autoRenew: false
│ }
├── refreshTokens: [
│   └── "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." ← JWT tokens
│ ]
├── lastLogin: ISODate("2025-12-03T10:30:00.000Z")
├── loginHistory: [
│   └── {
│       ├── timestamp: ISODate("2025-12-03T10:30:00.000Z")
│       ├── ip: "192.168.1.100"
│       └── userAgent: "Mozilla/5.0..."
│   }
│ ]
├── isActive: true
├── isBlocked: false
├── createdAt: ISODate("2025-12-03T10:30:00.000Z")
└── updatedAt: ISODate("2025-12-03T10:30:00.000Z")
```

---

## 🔧 Tech Stack Breakdown

```
┌─────────────────────────────────────────────────────────┐
│                    BACKEND STACK                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌─────────────────┐                 │
│  │  Express.js  │  │   TypeScript    │                 │
│  │  Web Server  │  │  Type Safety    │                 │
│  └──────────────┘  └─────────────────┘                 │
│                                                          │
│  ┌──────────────────────────────────────┐              │
│  │    google-auth-library (npm)         │              │
│  │    • Verifies Google ID tokens       │              │
│  │    • Extracts user information       │              │
│  └──────────────────────────────────────┘              │
│                                                          │
│  ┌──────────────────────────────────────┐              │
│  │    jsonwebtoken (npm)                │              │
│  │    • Generates access tokens         │              │
│  │    • Generates refresh tokens        │              │
│  └──────────────────────────────────────┘              │
│                                                          │
│  ┌──────────────────────────────────────┐              │
│  │    bcrypt (npm)                      │              │
│  │    • Password hashing                │              │
│  │    • For email/password auth         │              │
│  └──────────────────────────────────────┘              │
│                                                          │
│  ┌──────────────────────────────────────┐              │
│  │    MongoDB                           │              │
│  │    • Stores user data                │              │
│  │    • Collection: users               │              │
│  └──────────────────────────────────────┘              │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   FRONTEND STACK                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────┐              │
│  │    @react-oauth/google (npm)         │              │
│  │    • Google OAuth React library      │              │
│  │    • Handles OAuth popup             │              │
│  │    • Returns ID token                │              │
│  └──────────────────────────────────────┘              │
│                                                          │
│  ┌──────────────────────────────────────┐              │
│  │    axios (npm)                       │              │
│  │    • HTTP client                     │              │
│  │    • Sends requests to backend       │              │
│  └──────────────────────────────────────┘              │
│                                                          │
│  ┌──────────────────────────────────────┐              │
│  │    localStorage                      │              │
│  │    • Stores JWT tokens               │              │
│  │    • Stores user data                │              │
│  └──────────────────────────────────────┘              │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Example

```javascript
// === STEP 1: Frontend sends request ===
POST http://localhost:3002/api/auth/google
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjdlM..."
}

// === STEP 2: Backend verifies with Google ===
// Using google-auth-library
const ticket = await client.verifyIdToken({
  idToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjdlM...",
  audience: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
});

// === STEP 3: Google returns user info ===
{
  sub: "102837465940283746594",      // Google ID
  email: "user@gmail.com",
  email_verified: true,
  name: "John Doe",
  given_name: "John",
  family_name: "Doe",
  picture: "https://lh3.googleusercontent.com/a/..."
}

// === STEP 4: Backend creates/updates user in MongoDB ===
await db.collection('users').insertOne({
  userId: "550e8400-e29b-41d4-a716-446655440000",
  googleId: "102837465940283746594",
  email: "user@gmail.com",
  emailVerified: true,
  authMethod: "google",
  name: "John Doe",
  firstName: "John",
  lastName: "Doe",
  picture: "https://lh3.googleusercontent.com/a/...",
  // ... rest of fields
});

// === STEP 5: Backend generates JWT tokens ===
const accessToken = jwt.sign(
  { userId, email, name, type: 'access' },
  JWT_SECRET,
  { expiresIn: '15m' }
);

const refreshToken = jwt.sign(
  { userId, email, name, type: 'refresh' },
  JWT_REFRESH_SECRET,
  { expiresIn: '7d' }
);

// === STEP 6: Backend returns response ===
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
      "preferences": { /* ... */ },
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

// === STEP 7: Frontend stores tokens ===
localStorage.setItem('accessToken', tokens.accessToken);
localStorage.setItem('refreshToken', tokens.refreshToken);
localStorage.setItem('user', JSON.stringify(user));

// === STEP 8: Redirect to home ===
window.location.href = '/';

// ✅ USER IS NOW LOGGED IN
```

---

## 🎯 Quick Commands

```bash
# Start backend
cd e:\mutual-funds-backend
npm run dev

# Test backend
curl http://localhost:3002/health

# Run diagnostics
node test-google-oauth-comprehensive.js

# Check MongoDB
mongosh "mongodb+srv://rakeshd01042024_db_user:Rakesh1234@mutualfunds.l7zeno9.mongodb.net/"
use test
db.users.find().pretty()
```

---

## ✅ Status Summary

| Component            | Status       | Details               |
| -------------------- | ------------ | --------------------- |
| Backend Code         | ✅ Ready     | Fully implemented     |
| MongoDB Schema       | ✅ Ready     | All fields defined    |
| Environment Vars     | ✅ Ready     | All configured        |
| Google OAuth Setup   | ✅ Ready     | Credentials set       |
| JWT Token Generation | ✅ Ready     | Working               |
| User Creation/Update | ✅ Ready     | Working               |
| Backend Server       | 🔧 Start     | Run `npm run dev`     |
| Frontend Code        | 🔧 Implement | Use provided examples |

---

**📖 See complete implementation guide in:** `GOOGLE_OAUTH_COMPLETE_SOLUTION.md`
