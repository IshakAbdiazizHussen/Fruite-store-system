const AdminUser = require("../models/AdminUser");
const { authConfig } = require("../config/auth");
const { verifyToken } = require("../utils/password");

async function authenticate(req, _res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
    const cookieToken = req.cookies?.[authConfig.cookieName] || "";
    const token = bearerToken || cookieToken;

    if (!token) {
      const error = new Error("Authentication required.");
      error.statusCode = 401;
      throw error;
    }

    const payload = verifyToken(token, authConfig.secret);
    const user = await AdminUser.findById(payload.sub).lean();

    if (!user || !user.isActive) {
      const error = new Error("Authenticated user is not available.");
      error.statusCode = 401;
      throw error;
    }

    req.auth = {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };

    next();
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 401;
      error.message = "Invalid or expired authentication token.";
    }
    next(error);
  }
}

module.exports = authenticate;
