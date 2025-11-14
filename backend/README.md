# bbb-backend

Clone .env.example variables to create an .env file and update variables accordingly

## Email Verification Setup

This backend includes email verification functionality using Gmail SMTP. To enable email verification, you need to configure the following environment variables in your `.env` file:

### Required Environment Variables for Email Verification

```env
# Gmail SMTP Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-specific-password

# Optional: Application Configuration
APP_NAME=Booty Fitness
FRONTEND_URL=http://localhost:3000
```

### Setting up Gmail App Password

1. Enable 2-Step Verification on your Google Account
2. Go to [Google Account Settings](https://myaccount.google.com/)
3. Navigate to Security → 2-Step Verification → App passwords
4. Generate a new app password for "Mail"
5. Use this 16-character password as `GMAIL_APP_PASSWORD`

**Note:** Do NOT use your regular Gmail password. You must use an App Password for security.

### Email Verification Endpoints

- `GET /api/users/verify-email?token=<verification_token>` - Verify email address using token
- `POST /api/users/resend-verification` - Resend verification email (body: `{ "email": "user@example.com" }`)

### Registration Flow

When a user registers:
1. A verification token is generated and stored with the user
2. A verification email is sent to the user's email address
3. The user clicks the verification link in the email
4. The token is validated and the email is marked as verified
5. Tokens expire after 24 hours

### User Model Changes

The user model now includes:
- `isEmailVerified` (Boolean, default: false)
- `emailVerificationToken` (String)
- `emailVerificationTokenExpiry` (Date)