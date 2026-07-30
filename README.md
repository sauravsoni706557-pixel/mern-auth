# MERN Authentication System

A complete MERN Stack Authentication project built using **MongoDB, Express.js, React.js, and Node.js**. This application provides secure user authentication using **JWT Access Token**, **Refresh Token**, **HTTP-Only Cookies**, and protected routes.

---

## Live Demo

### Frontend (Vercel)

https://mern-auth-nine-nu.vercel.app

### Backend API (Render)

https://mern-auth-hjou.onrender.com

### GitHub Repository

https://github.com/sauravsoni706557-pixel/mern-auth

---

# Project Overview

This project demonstrates a complete authentication system built with the MERN Stack.

Users can:

- Create a new account
- Login securely
- Stay logged in using Refresh Tokens
- Access protected dashboard routes
- Logout securely

Authentication is implemented using JWT tokens and HTTP-Only Cookies for better security.

---

# Features

- User Registration
- User Login
- JWT Authentication
- Access Token
- Refresh Token
- HTTP-Only Cookies
- Protected Routes
- Automatic Token Refresh
- Password Hashing using bcrypt
- MongoDB Atlas Database
- REST API
- React Context API
- Axios Interceptors
- CORS Configuration
- Secure Logout
- Deployment on Render & Vercel

---

# Tech Stack

## Frontend

- React.js
- Vite
- React Router DOM
- Axios
- Context API

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs
- cookie-parser
- cors
- dotenv

---

# Project Structure

```
mern-auth/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── vite.config.js
│   └── .env
│
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/sauravsoni706557-pixel/mern-auth.git
```

Move into project folder

```bash
cd mern-auth
```

---

# Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file.

Example:

```env
MONGO_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_secret

REFRESH_TOKEN_SECRET=your_refresh_secret

ACCESS_TOKEN_EXPIRY=15m

REFRESH_TOKEN_EXPIRY=7d

PORT=5000

CLIENT_URL=http://localhost:5173

NODE_ENV=development
```

Run Backend

```bash
npm run dev
```

---

# Frontend Setup

```bash
cd frontend
npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

Run Frontend

```bash
npm run dev
```

---

# Authentication Flow

1. User Signup
2. Password stored after hashing using bcrypt
3. User Login
4. Backend generates:
   - Access Token
   - Refresh Token
5. Refresh Token stored inside HTTP-Only Cookie
6. Access Token stored in memory
7. Protected API uses JWT verification
8. Expired Access Token automatically refreshed
9. User Logout clears refresh token

---

# API Endpoints

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/auth/signup | Register User |
| POST | /api/auth/login | Login User |
| POST | /api/auth/refresh | Refresh Access Token |
| POST | /api/auth/logout | Logout User |
| GET | /api/auth/me | Get Logged In User |

---

# Environment Variables

## Backend

```env
MONGO_URI=

ACCESS_TOKEN_SECRET=

REFRESH_TOKEN_SECRET=

ACCESS_TOKEN_EXPIRY=15m

REFRESH_TOKEN_EXPIRY=7d

PORT=5000

CLIENT_URL=

NODE_ENV=development
```

## Frontend

```env
VITE_API_URL=
```

---

# Deployment

## Backend

Render

https://render.com

## Frontend

Vercel

https://vercel.com

## Database

MongoDB Atlas

https://www.mongodb.com/atlas

---

# Security Features

- JWT Authentication
- Password Hashing
- HTTP-Only Cookies
- Protected Routes
- Token Refresh
- Secure Logout
- CORS Enabled
- Environment Variables

---

# Future Improvements

- Forgot Password
- Reset Password
- Email Verification
- User Profile
- Change Password
- Admin Dashboard
- User Roles
- Image Upload
- Two Factor Authentication

---

# Author

**Saurav Soni**

Web Developer

GitHub

https://github.com/sauravsoni706557-pixel

---

# License

This project is created for learning and educational purposes.
