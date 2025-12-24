# ✅ Deployment Checklist - Backend

## 📋 Pre-Deployment

- [ ] All code changes committed to Git
- [ ] `.env` file NOT committed (in `.gitignore`)
- [ ] Database has fund data
- [ ] MongoDB Atlas network access allows all IPs (0.0.0.0/0)

---

## 🔐 Vercel Environment Variables Setup

Go to: Vercel Dashboard → Your Backend Project → Settings → Environment Variables

### Critical (Must Have):

- [ ] `DATABASE_URL` - MongoDB connection string
- [ ] `JWT_SECRET` - Random 64-character string
- [ ] `JWT_REFRESH_SECRET` - Different random 64-character string
- [ ] `NODE_ENV=production`

### Recommended:

- [ ] `ALLOWED_ORIGINS` - Your frontend URL(s)
- [ ] `FRONTEND_URL` - Main frontend URL

### Optional:

- [ ] `GOOGLE_CLIENT_ID` - For OAuth
- [ ] `GOOGLE_CLIENT_SECRET` - For OAuth
- [ ] `EMAIL_SERVICE=gmail` - For email
- [ ] `EMAIL_USER` - Gmail address
- [ ] `EMAIL_PASSWORD` - Gmail app password
- [ ] `ADMIN_EMAIL` - Admin email address

---

## 🚀 Deployment

- [ ] Push to GitHub main branch
- [ ] Vercel auto-builds and deploys
- [ ] Check Vercel deployment logs for errors
- [ ] **Important**: Redeploy after adding environment variables

---

## ✅ Post-Deployment Testing

### Basic Health Checks:

- [ ] `/health` returns 200 OK

  ```
  https://your-backend.vercel.app/health
  ```

- [ ] `/api/debug` shows correct config
  ```
  https://your-backend.vercel.app/api/debug
  ```
  Should show:
  - `hasDatabaseUrl: true`
  - `hasJwtSecret: true`
  - `nodeEnv: "production"`

### Authentication:

- [ ] Register new user works

  ```
  POST /api/auth/register
  ```

- [ ] Login returns tokens

  ```
  POST /api/auth/login
  ```

- [ ] Cookies are set in browser (check DevTools → Application → Cookies)

### Search & Funds:

- [ ] Autocomplete returns results

  ```
  GET /api/suggest?q=nip
  ```

- [ ] Search works

  ```
  GET /api/funds/search?query=nippon
  ```

- [ ] Top funds work

  ```
  GET /api/funds?top=20
  GET /api/funds?top=50
  GET /api/funds?top=100
  ```

- [ ] Fund details work
  ```
  GET /api/funds/{fundId}
  ```

### CORS:

- [ ] Frontend can make requests (no CORS errors in browser console)
- [ ] OPTIONS preflight requests succeed
- [ ] Cookies work cross-origin

---

## 🐛 Common Issues Checklist

### If Authentication Fails:

- [ ] `NODE_ENV=production` is set in Vercel
- [ ] `JWT_SECRET` and `JWT_REFRESH_SECRET` are different values
- [ ] Secrets are at least 32 characters long
- [ ] Frontend uses `withCredentials: true`

### If CORS Errors:

- [ ] Frontend domain added to `ALLOWED_ORIGINS`
- [ ] No trailing slash in URLs
- [ ] `api/index.ts` handles origin correctly

### If Database Errors:

- [ ] `DATABASE_URL` is correct (check for typos)
- [ ] MongoDB Atlas → Network Access allows `0.0.0.0/0`
- [ ] Database user has read/write permissions
- [ ] Collection `funds` has data

### If Search Returns Nothing:

- [ ] Database connected (check Vercel logs)
- [ ] Funds collection has documents with `isActive: true`
- [ ] MongoDB indexes are built

---

## 📊 Performance Checks

- [ ] API responds in < 2 seconds
- [ ] Search autocomplete feels instant (< 300ms)
- [ ] Fund details load quickly
- [ ] No timeout errors in Vercel logs

---

## 🔒 Security Checks

- [ ] No sensitive data in Vercel logs
- [ ] Environment variables not exposed
- [ ] JWT secrets are long and random
- [ ] Cookies have `httpOnly`, `secure`, `sameSite` flags
- [ ] CORS only allows trusted origins

---

## 📱 Frontend Integration Checklist

- [ ] Frontend has `NEXT_PUBLIC_API_URL` set
- [ ] Axios configured with `withCredentials: true`
- [ ] Auth tokens stored in localStorage
- [ ] Login redirects work
- [ ] Protected routes check authentication
- [ ] Token refresh on 401 errors

---

## 🎯 Feature Testing

### Search:

- [ ] Type "nip" → See Nippon funds
- [ ] Type "sb" → See SBI funds
- [ ] Suggestions appear in real-time
- [ ] Clicking suggestion navigates to fund

### Top Funds:

- [ ] Top 20 button shows 20 funds
- [ ] Top 50 button shows 50 funds
- [ ] Top 100 button shows 100 funds
- [ ] Funds sorted by returns

### Fund Details:

- [ ] "View Details" button works
- [ ] Fund page shows all information
- [ ] Manager details visible
- [ ] Chart loads correctly

### Comparison:

- [ ] Select 2+ funds
- [ ] Comparison loads
- [ ] Overlap calculation shows
- [ ] Common holdings displayed

---

## 📝 Documentation Checklist

- [ ] BACKEND_PRODUCTION_FIXES.md - Read for technical details
- [ ] VERCEL_ENV_SETUP.md - Used for environment setup
- [ ] API_FRONTEND_REFERENCE.md - Shared with frontend team
- [ ] BACKEND_FIXES_SUMMARY.md - Quick overview

---

## 🔄 Rollback Plan

If deployment fails:

1. Check Vercel deployment logs
2. Revert to previous deployment in Vercel dashboard
3. Fix issues locally
4. Test locally before redeploying

---

## ✨ Success Criteria

Deployment is successful when:

- ✅ All API endpoints respond correctly
- ✅ Authentication works from frontend
- ✅ Search suggestions work in real-time
- ✅ Top funds load correctly
- ✅ Fund details pages open
- ✅ No CORS errors in browser console
- ✅ No errors in Vercel logs
- ✅ Performance is acceptable (< 2s response)

---

## 📞 If Something Goes Wrong

1. Check Vercel Functions logs
2. Check browser DevTools console
3. Check Network tab in DevTools
4. Verify environment variables
5. Test endpoints directly in browser/Postman
6. Check MongoDB Atlas logs

---

## 🎉 Post-Launch

- [ ] Monitor Vercel logs for errors
- [ ] Check MongoDB usage
- [ ] Monitor API response times
- [ ] Collect user feedback
- [ ] Plan next iteration

---

**Print this checklist and mark items as you complete them!**

**Last Updated**: December 19, 2025
