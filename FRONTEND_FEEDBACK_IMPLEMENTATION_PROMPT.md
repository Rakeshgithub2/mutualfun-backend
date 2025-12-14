# Frontend Feedback System Implementation - Complete Prompt

## 🎯 Overview

Implement a complete feedback system in the frontend that integrates with the backend feedback API. The system must automatically include registered users' email addresses and send all feedback notifications to **rakesh27082003@gmail.com**.

---

## 📋 Backend API Contract

### Endpoint

**POST** `${apiUrl}/feedback`

### Request Body

```typescript
{
  feedbackType: 'bug' | 'feature' | 'general',  // Required, default: 'general'
  rating: number,                                // Required, 0-5 stars
  name: string,                                  // Required, min 1 char
  email: string | null,                          // Required for logged-in users
  message: string,                               // Required, min 1 char
  userId: string | null                          // Automatically from auth context
}
```

### Response

```typescript
// Success (201)
{
  success: true,
  message: "Feedback received successfully. Thank you for your input!",
  feedbackId: string
}

// Error (400/429/500)
{
  error: string,
  success: false
}
```

### Rate Limiting

- **5 submissions per hour per IP address**
- Returns 429 status when exceeded

---

## ✅ Implementation Requirements

### 1. **Auto-populate Email for Logged-in Users**

**CRITICAL:** If a user is logged in, their registered email MUST be automatically included in the feedback submission.

```typescript
// Get user data from auth context
const user = useAuth(); // or however you access logged-in user
const userEmail = user?.email || user?.user?.email;
const userId = user?.userId || user?.user?.userId;

// Auto-fill email field if user is logged in
const feedbackData = {
  feedbackType: selectedType,
  rating: starRating,
  name: user?.name || formName,
  email: userEmail || formEmail, // Use registered email if available
  message: feedbackMessage,
  userId: userId || null,
};
```

### 2. **Feedback Form Fields**

Create a feedback form with these components:

#### a) **Feedback Type Selector** (Required)

```tsx
// Three options with icons
- 🐛 Bug Report
- ✨ Feature Request
- 💬 General Feedback

// Default: 'general'
const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'general'>('general');
```

#### b) **Star Rating Component** (Required, 0-5)

```tsx
// Interactive star rating
const [rating, setRating] = useState(0);

// Display 5 stars, allow user to click to rate
// Show hover effect and filled/empty states
// Allow 0 stars (no rating) through to 5 stars
```

#### c) **Name Field** (Required)

```tsx
// Auto-fill from user profile if logged in
// Allow editing
// Placeholder: "Your Name"
// Validation: minimum 1 character
const [name, setName] = useState(user?.name || '');
```

#### d) **Email Field** (Required for logged-in users)

```tsx
// AUTO-POPULATE from user profile if logged in
// Make readonly/disabled if user is logged in
// Required field with email validation
// Placeholder: "your.email@example.com"
const [email, setEmail] = useState(user?.email || '');

// Show message if user is logged in:
// "Using your registered email: {user.email}"
```

#### e) **Message Field** (Required)

```tsx
// Multi-line textarea
// Minimum 1 character
// Placeholder varies by feedback type:
//   - Bug: "Describe the bug you encountered..."
//   - Feature: "Describe the feature you'd like to see..."
//   - General: "Share your thoughts with us..."
// Show character count (optional)
const [message, setMessage] = useState('');
```

### 3. **Validation Logic**

```typescript
const validateFeedback = () => {
  const errors = [];

  // Message is required
  if (!message.trim()) {
    errors.push('Message is required');
  }

  // Name is required
  if (!name.trim()) {
    errors.push('Name is required');
  }

  // Email validation
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Invalid email format');
  }

  // For logged-in users, email is required
  if (userId && !email) {
    errors.push('Email is required for registered users');
  }

  // Rating must be 0-5
  if (rating < 0 || rating > 5) {
    errors.push('Rating must be between 0 and 5');
  }

  return errors;
};
```

### 4. **Submit Function**

```typescript
const handleSubmitFeedback = async () => {
  try {
    // Validate
    const errors = validateFeedback();
    if (errors.length > 0) {
      showErrorToast(errors.join(', '));
      return;
    }

    // Show loading state
    setIsSubmitting(true);

    // Prepare data
    const feedbackData = {
      feedbackType: feedbackType,
      rating: rating,
      name: name.trim(),
      email: email?.trim() || null,
      message: message.trim(),
      userId: userId || null,
    };

    // Submit to backend
    const response = await fetch(`${apiUrl}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle errors
      if (response.status === 429) {
        showErrorToast('Too many submissions. Please try again later.');
      } else {
        showErrorToast(data.error || 'Failed to submit feedback');
      }
      return;
    }

    // Success
    showSuccessToast('Thank you for your feedback! 🎉');

    // Reset form
    setFeedbackType('general');
    setRating(0);
    setMessage('');
    if (!userId) {
      setName('');
      setEmail('');
    }

    // Close modal/form
    onClose();
  } catch (error) {
    console.error('Error submitting feedback:', error);
    showErrorToast('Network error. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};
```

### 5. **UI/UX Enhancements**

#### Success State

```tsx
// Show success message with animation
"✅ Thank you for your feedback! We'll review it shortly.";

// Auto-close modal after 2 seconds (optional)
setTimeout(() => onClose(), 2000);
```

#### Loading State

```tsx
// Disable submit button while loading
<button disabled={isSubmitting}>
  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
</button>

// Show spinner/loading indicator
```

#### Error State

```tsx
// Show inline error messages
{
  errors.name && <span className="error">{errors.name}</span>;
}
{
  errors.email && <span className="error">{errors.email}</span>;
}
{
  errors.message && <span className="error">{errors.message}</span>;
}
```

#### Rate Limit Warning

```tsx
// If 429 error, show clear message
"You've submitted too much feedback recently. Please try again in 1 hour.";
```

### 6. **Component Structure Example**

```tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext'; // Your auth context

interface FeedbackFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth(); // Get logged-in user

  const [feedbackType, setFeedbackType] = useState<
    'bug' | 'feature' | 'general'
  >('general');
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-populate user data when logged in
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const userId = user?.userId || user?.id || null;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

  // ... validation and submit logic from above

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="feedback-form">
        <h2>Share Your Feedback</h2>

        {/* Feedback Type */}
        <div className="feedback-type-selector">
          <button
            className={feedbackType === 'bug' ? 'active' : ''}
            onClick={() => setFeedbackType('bug')}
          >
            🐛 Bug Report
          </button>
          <button
            className={feedbackType === 'feature' ? 'active' : ''}
            onClick={() => setFeedbackType('feature')}
          >
            ✨ Feature Request
          </button>
          <button
            className={feedbackType === 'general' ? 'active' : ''}
            onClick={() => setFeedbackType('general')}
          >
            💬 General Feedback
          </button>
        </div>

        {/* Star Rating */}
        <div className="rating-section">
          <label>Rate Your Experience</label>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={rating >= star ? 'filled' : 'empty'}
              >
                ⭐
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            required
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email {userId && '*'}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            disabled={!!userId} // Readonly if logged in
            required={!!userId}
          />
          {userId && (
            <small className="text-muted">Using your registered email</small>
          )}
        </div>

        {/* Message */}
        <div className="form-group">
          <label>Message *</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              feedbackType === 'bug'
                ? 'Describe the bug you encountered...'
                : feedbackType === 'feature'
                  ? "Describe the feature you'd like to see..."
                  : 'Share your thoughts with us...'
            }
            rows={5}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitFeedback}
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
```

---

## 🎨 Design Guidelines

### Colors

- **Bug:** Red theme (#dc2626)
- **Feature:** Green theme (#059669)
- **General:** Blue theme (#667eea)

### Accessibility

- All form fields must have labels
- Error messages must be announced to screen readers
- Keyboard navigation support
- Focus indicators on interactive elements

### Responsive Design

- Mobile-friendly layout
- Touch-friendly star rating (min 44x44px tap targets)
- Readable font sizes (min 16px on mobile)

---

## 🔒 Security Notes

1. **Never bypass email for logged-in users** - This is critical for tracking
2. **Client-side validation** - Validate before sending to reduce failed requests
3. **Sanitize inputs** - Backend handles this, but good practice on frontend too
4. **Rate limiting awareness** - Show clear message when limit is reached

---

## 🧪 Testing Checklist

### Test Cases

- [ ] Submit feedback as anonymous user (without login)
- [ ] Submit feedback as logged-in user (email auto-populated)
- [ ] Submit with each feedback type (bug, feature, general)
- [ ] Submit with different ratings (0-5 stars)
- [ ] Try submitting without required fields (should show errors)
- [ ] Try submitting with invalid email format (should show error)
- [ ] Submit 6 times quickly (should hit rate limit on 6th)
- [ ] Verify email received at rakesh27082003@gmail.com
- [ ] Check email includes correct user email
- [ ] Test on mobile and desktop
- [ ] Test keyboard navigation
- [ ] Test with screen reader

---

## 📧 Email Notification Details

When feedback is submitted, an email is automatically sent to:

- **Recipient:** rakesh27082003@gmail.com
- **Subject:** New Feedback: [TYPE] - Rating ⭐⭐⭐
- **Reply-To:** User's email (if provided)

The email includes:

- Feedback type with emoji badge
- Star rating
- User name
- User email
- User ID (if logged in)
- Full message
- Timestamp

---

## 🚀 Quick Implementation Steps

1. **Create FeedbackForm component** with all required fields
2. **Add auth context integration** to auto-populate user data
3. **Implement star rating component** (0-5 stars)
4. **Add feedback type selector** (bug/feature/general)
5. **Implement validation** for all fields
6. **Create submit handler** with API integration
7. **Add loading/success/error states** with proper UI feedback
8. **Style the component** according to design guidelines
9. **Add to your app** (header, footer, or FAB button)
10. **Test thoroughly** with checklist above

---

## 📍 Where to Add Feedback Button

### Option 1: Footer

```tsx
<footer>
  {/* ...existing footer content... */}
  <button onClick={() => setFeedbackModalOpen(true)}>💬 Send Feedback</button>
</footer>
```

### Option 2: Floating Action Button (FAB)

```tsx
<button
  className="feedback-fab"
  onClick={() => setFeedbackModalOpen(true)}
  style={{
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1000,
  }}
>
  💬 Feedback
</button>
```

### Option 3: Header/Navigation

```tsx
<nav>
  {/* ...existing nav items... */}
  <button onClick={() => setFeedbackModalOpen(true)}>Feedback</button>
</nav>
```

---

## ✅ Final Checklist

Before deploying:

- [ ] Email auto-populates for logged-in users
- [ ] All validation rules are enforced
- [ ] Error messages are user-friendly
- [ ] Success confirmation is shown
- [ ] Rate limiting is handled gracefully
- [ ] Component is accessible (WCAG 2.1 AA)
- [ ] Mobile responsive
- [ ] Tested on multiple browsers
- [ ] Console logs removed from production code
- [ ] API URL is from environment variable

---

## 🎉 Expected Behavior

1. User clicks "Feedback" button
2. Modal opens with feedback form
3. If logged in: name and email are pre-filled and email is readonly
4. User selects feedback type (bug/feature/general)
5. User rates their experience (0-5 stars)
6. User writes their message
7. User clicks "Submit Feedback"
8. Form validates and shows errors if any
9. Request is sent to backend
10. Success message shown
11. Email notification sent to rakesh27082003@gmail.com
12. Form resets and modal closes

**That's it! The feedback system is now fully integrated.** 🚀
