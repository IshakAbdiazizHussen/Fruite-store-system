const { authConfig } = require("../config/auth");
const { asyncHandler } = require("./resourceController");
const { loginAdmin } = require("../services/authService");

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: false,
  maxAge: authConfig.tokenTtlSeconds * 1000,
};

const login = asyncHandler(async (req, res) => {
  const result = await loginAdmin(req.body || {});

  res.cookie(authConfig.cookieName, result.token, cookieOptions);
  res.status(200).json(result);
});

const me = asyncHandler(async (req, res) => {
  res.status(200).json({
    user: req.auth.user,
  });
});

const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(authConfig.cookieName, cookieOptions);
  res.status(200).json({
    ok: true,
  });
});

module.exports = {
  login,
  logout,
  me,
};
