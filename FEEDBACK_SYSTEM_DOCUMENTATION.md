# Feedback System Implementation - Complete Documentation

## 📋 Overview

The feedback system allows users to submit feedback (bugs, feature requests, or general comments) and automatically sends email notifications to the admin. All feedback is stored in MongoDB with full CRUD operations and statistics tracking.

---

## 🚀 Features Implemented

### ✅ Complete Feature Set

1. **Feedback Submission (POST /api/feedback)**
   - Accepts: feedbackType, rating, name, email, message, userId
   - Rate limiting: 5 submissions per hour per IP
   - XSS protection with input sanitization
   - Email validation
   - Saves to MongoDB
   - Sends email notification to admin
   - Returns success even if email fails

2. **Get All Feedback (GET /api/feedback)**
   - Paginated results (default: 50, max: 100)
   - Filter by: status, feedbackType, userId
   - Returns total count and pagination info

3. **Get Feedback Statistics (GET /api/feedback/stats/summary)**
   - Total feedback count
   - Breakdown by status (pending/reviewed/resolved)
   - Breakdown by type (bug/feature/general)
   - Average rating

4. **Update Feedback Status (PATCH /api/feedback/:id/status)**
   - Update status to: pending, reviewed, or resolved
   - Validates status values
   - Auto-updates timestamp

5. **Delete Feedback (DELETE /api/feedback/:id)**
   - Removes feedback by ID
   - Admin operation

---

## 📁 Files Created/Modified

### New Files

1. **`src/models/Feedback.model.ts`**
   - MongoDB model for feedback
   - Zod validation schema
   - CRUD operations
   - Statistics aggregation
   - Automatic indexing

2. **`src/routes/feedback.ts`**
   - Complete REST API routes
   - Rate limiting middleware
   - Input sanitization
   - Error handling

### Modified Files

1. **`src/services/emailService.ts`**
   - Added `FeedbackEmailData` interface
   - Added `sendFeedbackNotification()` method
   - Beautiful HTML email template
   - Uses nodemailer with Gmail SMTP

2. **`src/routes/index.ts`**
   - Updated import from `feedback.routes` to `feedback`

3. **`src/server-simple.ts`**
   - Import feedbackModel
   - Initialize feedback indexes on startup

4. **`.env`**
   - Added EMAIL_SERVICE=gmail
   - Added ADMIN_EMAIL=rakesh27082003@gmail.com

5. **`.env.example`**
   - Added email configuration documentation

---

## 🔧 Environment Variables

Add these to your `.env` file:

```env
# Nodemailer Email Configuration (for feedback notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=rakeshd01042024@gmail.com
EMAIL_PASSWORD=mwpayabcaawstzuu
ADMIN_EMAIL=rakesh27082003@gmail.com
```

### 📧 Getting Gmail App Password

1. Go to https://myaccount.google.com/apppasswords
2. Sign in with your Gmail account
3. Click "Create" and select "Mail"
4. Select "Other (Custom name)" and type "Mutual Funds Platform"
5. Click "Generate" - you'll get a 16-character password
6. Copy that password and paste it in EMAIL_PASSWORD (remove spaces)

---

## 📡 API Endpoints

### 1. Submit Feedback

**POST** `/api/feedback`

**Rate Limit:** 5 requests per hour per IP

**Request Body:**

```json
{
  "feedbackType": "bug", // "bug" | "feature" | "general"
  "rating": 4, // 0-5
  "name": "John Doe",
  "email": "john@example.com", // optional, validated
  "message": "Great platform!", // required
  "userId": "user123" // optional
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Feedback received successfully. Thank you for your input!",
  "feedbackId": "507f1f77bcf86cd799439011"
}
```

**Email Sent:**

- To: ADMIN_EMAIL (rakesh27082003@gmail.com)
- Subject: `New Feedback: [BUG] - 4/5 ⭐⭐⭐⭐`
- Beautiful HTML template with all feedback details

---

### 2. Get All Feedback

**GET** `/api/feedback`

**Query Parameters:**

- `status` (optional): "pending" | "reviewed" | "resolved"
- `feedbackType` (optional): "bug" | "feature" | "general"
- `userId` (optional): Filter by user ID
- `limit` (optional): Default 50, max 100
- `skip` (optional): Pagination offset

**Example:**

```
GET /api/feedback?status=pending&limit=20&skip=0
```

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "feedbackType": "bug",
      "rating": 4,
      "name": "John Doe",
      "email": "john@example.com",
      "message": "Found a bug...",
      "userId": "user123",
      "status": "pending",
      "createdAt": "2025-12-14T10:30:00.000Z",
      "updatedAt": "2025-12-14T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 20,
    "skip": 0,
    "hasMore": true
  }
}
```

---

### 3. Get Feedback Statistics

**GET** `/api/feedback/stats/summary`

**Response (200):**

```json
{
  "success": true,
  "stats": {
    "total": 150,
    "byStatus": {
      "pending": 45,
      "reviewed": 60,
      "resolved": 45
    },
    "byType": {
      "bug": 50,
      "feature": 70,
      "general": 30
    },
    "averageRating": 4.35
  }
}
```

---

### 4. Get Single Feedback

**GET** `/api/feedback/:id`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "feedbackType": "bug",
    "rating": 4,
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Found a bug...",
    "userId": "user123",
    "status": "pending",
    "createdAt": "2025-12-14T10:30:00.000Z",
    "updatedAt": "2025-12-14T10:30:00.000Z"
  }
}
```

---

### 5. Update Feedback Status

**PATCH** `/api/feedback/:id/status`

**Request Body:**

```json
{
  "status": "reviewed" // "pending" | "reviewed" | "resolved"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Feedback status updated successfully",
  "status": "reviewed"
}
```

---

### 6. Delete Feedback

**DELETE** `/api/feedback/:id`

**Response (200):**

```json
{
  "success": true,
  "message": "Feedback deleted successfully"
}
```

---

## 🗄️ MongoDB Schema

**Collection:** `feedback`

```typescript
{
  _id: ObjectId,
  feedbackType: "bug" | "feature" | "general",
  rating: number,              // 0-5
  name: string,
  email: string | null,
  message: string,
  userId: string | null,
  status: "pending" | "reviewed" | "resolved",
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `createdAt` (descending) - for chronological sorting
- `status` - for filtering by status
- `userId` - for user-specific queries
- `feedbackType` - for filtering by type

---

## 🔒 Security Features

### 1. Rate Limiting

- **5 submissions per hour per IP address**
- Prevents spam and abuse
- Uses `express-rate-limit` middleware

### 2. Input Sanitization

- Removes `<` and `>` to prevent XSS
- Removes `javascript:` protocol
- Removes event handlers (`onclick=`, etc.)
- Trims whitespace

### 3. Email Validation

- Validates email format using regex
- Rejects invalid email addresses

### 4. Error Handling

- Email failures don't affect feedback submission
- Feedback is always saved to database
- Errors are logged but not exposed to users

---

## 📧 Email Notification

When feedback is submitted, an email is automatically sent to the admin.

### Email Details

- **From:** EMAIL_USER (rakeshd01042024@gmail.com)
- **To:** ADMIN_EMAIL (rakesh27082003@gmail.com)
- **Reply-To:** User's email (if provided)
- **Subject:** `New Feedback: [TYPE] - Rating ⭐⭐⭐`

### Email Template Features

- Beautiful gradient header
- Color-coded feedback type badges:
  - 🐛 Bug (red)
  - ✨ Feature (green)
  - 💬 General (blue)
- Star rating display
- All user information
- Formatted timestamp
- Professional footer

### Email Fallback

- If email fails, feedback is still saved
- Error is logged to console
- User receives success response
- No interruption to user experience

---

## 🧪 Testing

### Test Feedback Submission

```bash
curl -X POST http://localhost:3002/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "feedbackType": "bug",
    "rating": 5,
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test feedback message",
    "userId": "test123"
  }'
```

### Test Get All Feedback

```bash
curl http://localhost:3002/api/feedback
```

### Test Get Statistics

```bash
curl http://localhost:3002/api/feedback/stats/summary
```

### Test Update Status

```bash
curl -X PATCH http://localhost:3002/api/feedback/507f1f77bcf86cd799439011/status \
  -H "Content-Type: application/json" \
  -d '{"status": "reviewed"}'
```

---

## 🎯 Frontend Integration

The frontend is already calling `POST ${apiUrl}/feedback`, so it will work automatically!

### Example Frontend Code

```typescript
const response = await fetch(`${apiUrl}/feedback`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    feedbackType: 'bug',
    rating: 4,
    name: userName,
    email: userEmail,
    message: feedbackMessage,
    userId: currentUserId,
  }),
});

const data = await response.json();
if (data.success) {
  console.log('Feedback submitted!');
}
```

---

## 📊 Console Output

When feedback is received, you'll see:

```
================================================================================
📬 NEW USER FEEDBACK RECEIVED
================================================================================
ID: 507f1f77bcf86cd799439011
Type: bug
Rating: 4/5
Name: John Doe
Email: john@example.com
User ID: user123

Message:
Found a bug in the portfolio page...
================================================================================

✓ Feedback notification email sent to rakesh27082003@gmail.com
```

---

## 🚨 Error Scenarios

### 1. Missing Message

**Request:** `{ "rating": 5 }`  
**Response (400):**

```json
{
  "error": "Message is required",
  "success": false
}
```

### 2. Invalid Email

**Request:** `{ "email": "invalid-email", "message": "test" }`  
**Response (400):**

```json
{
  "error": "Invalid email format",
  "success": false
}
```

### 3. Rate Limit Exceeded

**Response (429):**

```json
{
  "error": "Too many feedback submissions. Please try again later.",
  "retryAfter": "1 hour"
}
```

### 4. Invalid Status Update

**Request:** `{ "status": "invalid" }`  
**Response (400):**

```json
{
  "error": "Invalid status. Must be: pending, reviewed, or resolved",
  "success": false
}
```

---

## ✅ Checklist

- [x] Feedback model created with MongoDB schema
- [x] Email service method for feedback notifications
- [x] POST /api/feedback endpoint with rate limiting
- [x] GET /api/feedback endpoint with pagination
- [x] GET /api/feedback/stats/summary endpoint
- [x] PATCH /api/feedback/:id/status endpoint
- [x] DELETE /api/feedback/:id endpoint
- [x] Input sanitization (XSS protection)
- [x] Email validation
- [x] Error handling (email failures don't affect submission)
- [x] Environment variables configured
- [x] Routes registered in index.ts
- [x] Indexes initialized on server startup
- [x] Beautiful HTML email template
- [x] Console logging for debugging

---

## 🎉 Summary

The complete feedback system is now live! Users can submit feedback through the frontend, and you'll receive beautifully formatted email notifications at **rakesh27082003@gmail.com** for every submission.

All feedback is stored in MongoDB with full CRUD operations, statistics tracking, and admin management capabilities.

**The system is production-ready and includes:**

- Rate limiting for security
- XSS protection
- Email validation
- Graceful error handling
- Professional email templates
- Comprehensive API documentation
