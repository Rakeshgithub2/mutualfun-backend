# Gmail SMTP Setup for Email Service

This guide explains how to configure Gmail SMTP to send emails from your personal Gmail account to any user.

## Why Gmail SMTP?

- ✅ **Free** - No cost for personal use
- ✅ **Send to any email** - No domain verification needed
- ✅ **500 emails/day** - Sufficient for most applications
- ✅ **Reliable** - Google's infrastructure

## Setup Steps

### 1. Enable 2-Step Verification (if not already enabled)

1. Go to your Google Account: https://myaccount.google.com/
2. Click **Security** in the left sidebar
3. Under "How you sign in to Google", click **2-Step Verification**
4. Follow the steps to enable it

### 2. Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → 2-Step Verification → App passwords (at bottom)
2. Enter your Google password if prompted
3. In "Select app" dropdown, choose **Mail**
4. In "Select device" dropdown, choose **Other (Custom name)**
5. Enter a name like: `MF Analyser Backend`
6. Click **Generate**
7. **Copy the 16-character password** (shown like: `xxxx xxxx xxxx xxxx`)

### 3. Update .env File

Open `.env` file and update these values:

```env
# Gmail SMTP Configuration
GMAIL_USER=rakeshd01042024@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password_here
USE_GMAIL=true
```

**Important:**

- Remove spaces from the app password (use the 16 characters without spaces)
- Keep `USE_GMAIL=true` to use Gmail instead of Resend

### 4. Restart Backend Server

```bash
npm start
```

You should see in the logs:

```
✅ Gmail SMTP configured for: rakeshd01042024@gmail.com
```

## Test Email Sending

After setup, all emails will be sent FROM your Gmail (`rakeshd01042024@gmail.com`) TO any user's registered email address.

### What Emails Will Be Sent:

1. **Welcome Email** - When new user registers
2. **Password Reset OTP** - For password recovery
3. **Reminder Confirmation** - When user creates a reminder
4. **Reminder Notification** - At scheduled reminder time
5. **KYC Status Updates** - KYC verification emails

### Limits:

- **500 emails per day** (Gmail free tier)
- If you exceed this, upgrade to Google Workspace or use another service

## Troubleshooting

### Error: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Solution:** Make sure you're using an **App Password**, not your regular Gmail password.

### Error: "Less secure app access"

**Solution:** Enable 2-Step Verification first, then generate App Password.

### Still not working?

1. Verify 2-Step Verification is enabled
2. Double-check the App Password (no spaces, 16 characters)
3. Make sure `USE_GMAIL=true` in .env
4. Restart the backend server

## Security Notes

- ✅ App Passwords are specific to applications (not your main password)
- ✅ You can revoke App Passwords anytime from Google Account settings
- ⚠️ Never commit .env file to Git (already in .gitignore)
- ⚠️ Never share your App Password publicly

## Alternative: Google Workspace

For production with higher limits:

- Google Workspace: 2000 emails/day
- Custom domain support
- Better deliverability

## Need Help?

If you face issues, check:

1. https://support.google.com/accounts/answer/185833 (App Passwords guide)
2. https://support.google.com/mail/answer/7126229 (SMTP settings)
