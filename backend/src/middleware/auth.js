const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function clearSessionCookie(res) {
  res.clearCookie('bookstore_session', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
}

function readCookie(req, name) {
  const cookies = req.headers.cookie || '';
  const pair = cookies.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  if (!pair) return null;
  try { return decodeURIComponent(pair.slice(name.length + 1)); } catch { return null; }
}

function authenticateToken(req, res, next) {
  if (!JWT_SECRET) return res.status(500).json({ success: false, message: "Authentication is not configured" });
  const authHeader = req.headers["authorization"];
  const token = (authHeader && /^Bearer\s+(.+)$/i.exec(authHeader)?.[1]) || readCookie(req, 'bookstore_session');

  if (!token) {
    clearSessionCookie(res);
    return res.status(401).json({ success: false, message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      clearSessionCookie(res);
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
    req.user = user;
    if (readCookie(req, 'bookstore_session') && req.method !== 'GET' && req.method !== 'HEAD') {
      const expectedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:4173';
      if (req.headers.origin && req.headers.origin !== expectedOrigin) {
        return res.status(403).json({ success: false, message: 'Request origin is not allowed' });
      }
    }
    next();
  });
}

function authorizeRoles(...allowedRoles) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    try {
      // Read the current role from MongoDB so demotions take effect immediately,
      // even while a previously issued JWT remains valid.
      const User = require('../models/userModel');
      const user = await User.findById(req.user.id).select('role');
      if (!user) return res.status(401).json({ success: false, message: 'Account no longer exists' });
      req.user.role = user.role;
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ success: false, message: "Access denied: insufficient permissions" });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

// ሁለቱም ፋንክሽኖች መውጣታቸውን አረጋግጥ
module.exports = {
  authenticateToken,
  authorizeRoles,
};
