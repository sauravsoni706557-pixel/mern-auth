import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
  refreshCookieOptions,
} from "../utils/generateTokens.js";

// POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Sab fields fill karo" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Is email se account pehle se hai" });
    }

    // Password hashing User model ke andar pre-save hook mein ho jaayegi
    const user = await User.create({ name, email, password });

    return res.status(201).json({
      message: "Signup successful",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email ya password galat hai" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email ya password galat hai" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Refresh token ka hash DB mein save kar rahe hain (rotation/reuse-detection ke liye)
    user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await user.save();

    // Refresh token httpOnly cookie mein - JS se access nahi hoga (secure)
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    // Access token response body mein - frontend ise memory/state mein rakhega
    return res.status(200).json({
      message: "Login successful",
      accessToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/auth/refresh
// Jab access token expire ho jaata hai, frontend ye endpoint call karta hai
export const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Refresh token nahi mila, dobara login karo" });
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Refresh token invalid/expired hai" });
      }

      const user = await User.findById(decoded.userId);
      if (!user || !user.refreshTokenHash) {
        return res.status(403).json({ message: "User nahi mila" });
      }

      const isSameToken = await bcrypt.compare(token, user.refreshTokenHash);
      if (!isSameToken) {
        // Ye token database wale se match nahi kar raha - possible reuse/theft
        return res.status(403).json({ message: "Refresh token match nahi hua" });
      }

      // Naya access token bana kar bhej do
      const newAccessToken = generateAccessToken(user._id);
      return res.status(200).json({ accessToken: newAccessToken });
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/auth/logout
export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      // Decode karke us user ka refreshTokenHash clear kar do (DB-side invalidation)
      try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        await User.findByIdAndUpdate(decoded.userId, { refreshTokenHash: null });
      } catch (e) {
        // token already invalid ho sakta hai, ignore karke aage badho
      }
    }
    res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
    return res.status(200).json({ message: "Logout ho gaya" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/auth/me  (protected route - dashboard ke liye dummy data)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password -refreshTokenHash");
    if (!user) return res.status(404).json({ message: "User nahi mila" });
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
