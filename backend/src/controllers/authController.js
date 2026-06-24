const { authConfig } = require("../config/auth");
const { asyncHandler } = require("./resourceController");
const { loginAdmin } = require("../services/authService");
const {
  getCurrentUserProfile,
  uploadProfileImage,
  removeProfileImage,
} = require("../services/userProfileService");

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
  const user = await getCurrentUserProfile(req.auth.user.id);
  res.status(200).json({ user });
});

const logout = asyncHandler(async (_req, res) => {
  res.clearCookie(authConfig.cookieName, cookieOptions);
  res.status(200).json({
    ok: true,
  });
});

const uploadImage = asyncHandler(async (req, res) => {
  const user = await uploadProfileImage(req.auth.user.id, req.file, { replaceExisting: false });
  res.status(200).json({ user });
});

const replaceImage = asyncHandler(async (req, res) => {
  const user = await uploadProfileImage(req.auth.user.id, req.file, { replaceExisting: true });
  res.status(200).json({ user });
});

const removeImage = asyncHandler(async (req, res) => {
  const user = await removeProfileImage(req.auth.user.id);
  res.status(200).json({ user });
});

module.exports = {
  login,
  logout,
  me,
  uploadImage,
  replaceImage,
  removeImage,
};
