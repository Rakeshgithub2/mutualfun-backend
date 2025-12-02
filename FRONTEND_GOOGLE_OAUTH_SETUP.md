# 🚀 Frontend Setup for Google OAuth

## ❌ Current Issue

After Google login, you see:

```
ERR_CONNECTION_REFUSED - localhost refused to connect
```

**Why?** Backend is redirecting to `http://localhost:5001/auth/success` but:

1. Frontend server is not running, OR
2. Frontend doesn't have `/auth/success` route

---

## ✅ Solution

### Step 1: Start Your Frontend Server

```bash
cd path/to/your/frontend
npm run dev
```

Make sure it runs on **port 5001**. If it uses a different port, update it to 5001 or change the backend `.env` FRONTEND_URL.

---

### Step 2: Create Auth Success Page

**For React Router (Create React App / Vite):**

Create file: `src/pages/AuthSuccess.jsx`

```jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const userString = searchParams.get('user');

    if (accessToken && refreshToken && userString) {
      try {
        // Store in localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem(
          'user',
          JSON.parse(decodeURIComponent(userString))
        );

        // Redirect to home
        setTimeout(() => {
          navigate('/'); // or '/home' or '/dashboard'
          window.location.reload();
        }, 500);
      } catch (error) {
        console.error('Error:', error);
        navigate('/login');
      }
    } else {
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
      }}
    >
      <div>Completing sign in...</div>
    </div>
  );
}
```

---

**For Next.js:**

Create file: `pages/auth/success.js` or `app/auth/success/page.js`

```jsx
'use client'; // if using app router

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const userString = searchParams.get('user');

    if (accessToken && refreshToken && userString) {
      try {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', userString);

        setTimeout(() => {
          router.push('/');
          window.location.reload();
        }, 500);
      } catch (error) {
        console.error('Error:', error);
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [searchParams, router]);

  return <div>Completing sign in...</div>;
}
```

---

### Step 3: Add Route to Your Router

**React Router (in `App.jsx` or `main.jsx`):**

```jsx
import AuthSuccess from './pages/AuthSuccess';

// In your Routes:
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/auth/success" element={<AuthSuccess />} />
  <Route path="/" element={<Home />} />
  {/* other routes */}
</Routes>;
```

**Next.js:** Routes are automatic based on file location ✅

---

### Step 4: Update Your Home/Dashboard Component

After login, show the user's avatar and name:

```jsx
import { useEffect, useState } from 'react';

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <nav>
        {/* Sign In button replaced with user avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={user.profilePicture || '/default-avatar.png'}
            alt={user.name}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
            }}
          />
          <span>{user.name}</span>
        </div>
      </nav>

      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

---

### Step 5: Update Your Navigation/Header Component

Replace "Sign In" button with user info when logged in:

```jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  return (
    <nav>
      {!user ? (
        <button onClick={() => navigate('/login')}>Sign In</button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={user.profilePicture || '/default-avatar.png'}
            alt={user.name}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
            }}
          />
          <span>{user.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
}
```

---

## 🧪 Testing Flow

1. ✅ Start backend: `npx tsx src/server-simple.ts` (port 3002)
2. ✅ Start frontend: `npm run dev` (port 5001)
3. ✅ Go to: `http://localhost:5001/login`
4. ✅ Click "Sign in with Google"
5. ✅ Select Gmail account (you'll see the numbers - this is normal during Google's account selection)
6. ✅ Click "Continue"
7. ✅ Backend redirects to: `http://localhost:5001/auth/success?accessToken=...&refreshToken=...&user=...`
8. ✅ AuthSuccess page stores tokens and redirects to home
9. ✅ Home page shows user avatar instead of "Sign In" button

---

## 🐛 Troubleshooting

**Still seeing ERR_CONNECTION_REFUSED?**

- Check frontend is running: `http://localhost:5001`
- Check browser console for errors
- Verify the route `/auth/success` exists

**Numbers showing (40, 32, 11)?**

- This is Google's internal account selection UI
- It's normal during OAuth flow
- Just select the correct account

**Not redirecting to home after login?**

- Check browser console for JavaScript errors
- Verify localStorage has `accessToken`, `refreshToken`, and `user`
- Check your home route path matches (/ or /home or /dashboard)

**Avatar not showing?**

- Check `user.profilePicture` is not null
- Use a fallback default avatar image
- Verify localStorage has user data

---

## ✅ Expected Result

After completing these steps:

- ✅ User clicks Google Sign-In
- ✅ Selects account and continues
- ✅ Redirects to home page
- ✅ "Sign In" button replaced with user avatar and name
- ✅ User can see their profile picture
- ✅ User can logout and return to login page

---

**Backend is ready! ✅ Now implement the frontend changes above.**
