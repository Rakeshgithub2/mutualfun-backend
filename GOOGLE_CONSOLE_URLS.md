# 🎯 QUICK REFERENCE: Google Console URLs

## Copy and Paste These URLs into Google Cloud Console

### Go To:

**https://console.cloud.google.com/apis/credentials**

---

## 📍 Authorized JavaScript Origins

```
http://localhost:3002
http://localhost:5001
```

---

## 🔄 Authorized Redirect URIs

### ⚠️ THIS IS THE MOST IMPORTANT - COPY EXACTLY:

```
http://localhost:3002/api/auth/google/callback
```

---

## ✅ Setup Checklist

- [ ] Go to https://console.cloud.google.com/apis/credentials
- [ ] Click on your OAuth 2.0 Client ID
- [ ] Under "Authorized JavaScript origins", add:
  - `http://localhost:3002`
  - `http://localhost:5001`
- [ ] Under "Authorized redirect URIs", add:
  - `http://localhost:3002/api/auth/google/callback`
- [ ] Click "SAVE"
- [ ] Copy your Client ID and Client Secret
- [ ] Update .env file with credentials

---

## 🔐 Environment Variables Required

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3002/api/auth/google/callback
FRONTEND_URL=http://localhost:5001
```

---

## 🚀 API Endpoints (Backend)

### Get Google Auth URL:

```
GET http://localhost:3002/api/auth/google
```

### Callback (Automatic):

```
GET http://localhost:3002/api/auth/google/callback
```

---

## 📱 Frontend Routes to Create

### Success Callback:

```
/auth/callback
```

Receives: `?accessToken=...&refreshToken=...`

### Error Handler:

```
/auth/error
```

Receives: `?message=error+message`

---

## 🎨 Production URLs (When Ready)

Replace `localhost` with your actual domains:

### Authorized JavaScript Origins:

```
https://your-backend-domain.com
https://your-frontend-domain.com
```

### Authorized Redirect URIs:

```
https://your-backend-domain.com/api/auth/google/callback
```

---

**Port Reference:**

- Backend: `3002`
- Frontend: `5001`
