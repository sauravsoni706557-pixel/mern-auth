import jwt from "jsonwebtoken";

// Short-lived token - ye har protected API request ke saath frontend se aata hai
export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
  });
};

// Long-lived token - ye sirf naya access token maangne ke kaam aata hai
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  });
};

// Refresh token ko httpOnly cookie mein set karne ke liye common options
export const refreshCookieOptions = {
  httpOnly: true, // JavaScript (document.cookie) se ye cookie access nahi ho sakti - XSS se bachav
  secure: process.env.NODE_ENV === "production", // production mein sirf HTTPS pe bheji jaayegi
  sameSite: "strict", // CSRF attacks se bachne ke liye
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 din (milliseconds mein)
  path: "/api/auth/refresh", // cookie sirf refresh route ke liye bhejni hai, har request ke saath nahi
};
