# 🔐 Authentication & Account Security

AI Job Finder includes a production-ready authentication and account security system designed with scalability, security, and modern user experience in mind.

---

## ✨ Authentication Features

### Email & Password Authentication

* Secure user registration
* Secure login
* Password hashing using **bcrypt**
* JWT-based authentication
* Protected API routes
* Session management
* Persistent login support

---

### Social Authentication

Users can authenticate using:

* Google OAuth 2.0
* GitHub OAuth 2.0

The authentication system is designed to support additional providers such as Microsoft and LinkedIn in the future.

---

### Remember Me

Implements secure persistent authentication using:

* Access Tokens
* Refresh Tokens
* Refresh Token Rotation
* Secure session restoration
* Automatic token refresh
* Session persistence across browser restarts

---

### Email Verification

After registration:

* Users are automatically signed in
* A verification email is sent on request
* One-click verification link
* Secure verification tokens
* Single-use verification links
* Token expiration
* Verification status tracking
* Feature access based on verification status

---

### Forgot Password

Secure password recovery flow including:

* Email verification
* Secure reset link
* One-Time Password (OTP)
* Token expiration
* OTP expiration
* Single-use reset requests
* Rate limiting
* Password validation

---

### Change Password

Available from:

Settings → Security

Security flow:

* Verify current password
* Email OTP verification
* Strong password validation
* Password strength checking
* Session protection
* Automatic invalidation of previous password change requests

---

### Delete Account

Available from:

Settings → Security → Danger Zone

Security flow:

* Current password verification
* Email OTP verification
* Final confirmation requiring the user to type **DELETE**
* Secure account deactivation (soft delete)
* Session revocation
* Automatic logout

---

## 🛡️ Security Features

* bcrypt password hashing
* JWT authentication
* Refresh Token authentication
* Secure refresh token rotation
* HttpOnly cookie support (where applicable)
* Email verification
* OTP verification
* Secure random token generation
* Password strength validation
* Password confirmation validation
* Session revocation
* Automatic logout after account deletion
* Protected API endpoints
* Route guards
* Authentication middleware
* Secure password reset workflow
* Soft account deletion
* Prevention of duplicate social accounts
* Multiple authentication providers
* Rate limiting for sensitive authentication endpoints
* Secure handling of verification and reset tokens

---

## 👤 Account Management

Users can securely manage their account through the Security settings page.

Current features include:

* Login
* Register
* Logout
* Remember Me
* Email Verification
* Forgot Password
* Reset Password
* Change Password
* Delete Account
* Google Sign-In
* GitHub Sign-In

---

## 📧 Email Workflows

The authentication module includes professionally designed HTML email templates for:

* Email Verification
* Password Reset
* Password Change Verification
* Account Deletion Verification

Each email includes:

* Responsive HTML layout
* Branded design
* Security information
* Expiration notices
* One-click actions where applicable

---

## ⚙️ Authentication Architecture

### Frontend

* Next.js 15
* TypeScript
* React Query
* Axios
* Zustand
* React Hook Form
* Zod
* Tailwind CSS
* shadcn/ui

### Backend

* FastAPI
* PostgreSQL
* SQLAlchemy
* Alembic
* JWT
* bcrypt
* OAuth 2.0
* Gmail SMTP

---

## 🏗️ Backend Architecture

The authentication module follows a clean layered architecture.

```text
server/
│
├── routes/
│
├── controllers/
│
├── services/
│
├── repositories/
│
├── models/
│
├── schemas/
│
├── middleware/
│
├── utils/
│
└── database/
```

Responsibilities:

* **Routes** → API endpoints
* **Controllers** → Request & response handling
* **Services** → Business logic
* **Repositories** → Database operations
* **Models** → Database models
* **Schemas** → Request & response validation
* **Middleware** → Authentication and authorization
* **Utils** → Security helpers, JWT utilities, OTP generation, token generation

---

## 🚀 Future Authentication Enhancements

The authentication architecture is designed to support future enhancements, including:

* Microsoft OAuth
* LinkedIn OAuth
* Connected Accounts Management
* Device Management
* Active Sessions Dashboard
* Login History
* Security Notifications
* Account Activity Logs

The modular architecture allows new authentication providers and security features to be integrated without major changes to the existing system.
