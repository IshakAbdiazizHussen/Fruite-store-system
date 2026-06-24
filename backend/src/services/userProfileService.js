const fs = require("fs/promises");
const path = require("path");

const AdminUser = require("../models/AdminUser");
const { PROFILE_IMAGE_UPLOAD_DIR } = require("../middleware/profileImageUpload");
const { toSafeUser } = require("../utils/userView");

const PROFILE_IMAGE_PUBLIC_PREFIX = "/uploads/profile-images/";

async function getCurrentUserProfile(userId) {
  const user = await AdminUser.findById(userId);

  if (!user || !user.isActive) {
    const error = new Error("Authenticated user is not available.");
    error.statusCode = 404;
    throw error;
  }

  return toSafeUser(user);
}

async function uploadProfileImage(userId, file, { replaceExisting }) {
  if (!file) {
    const error = new Error("Profile image file is required.");
    error.statusCode = 400;
    throw error;
  }

  const user = await AdminUser.findById(userId);

  if (!user || !user.isActive) {
    await deleteUploadedFile(file.path);
    const error = new Error("Authenticated user is not available.");
    error.statusCode = 404;
    throw error;
  }

  if (user.profile_image_url && !replaceExisting) {
    await deleteUploadedFile(file.path);
    const error = new Error("Profile image already exists. Use update to replace it.");
    error.statusCode = 409;
    throw error;
  }

  const nextProfileImageUrl = `${PROFILE_IMAGE_PUBLIC_PREFIX}${path.basename(file.filename)}`;
  const previousProfileImageUrl = user.profile_image_url;

  try {
    user.profile_image_url = nextProfileImageUrl;
    await user.save();
  } catch (error) {
    await deleteUploadedFile(file.path);
    throw error;
  }

  await deleteStoredProfileImage(previousProfileImageUrl);

  return toSafeUser(user);
}

async function removeProfileImage(userId) {
  const user = await AdminUser.findById(userId);

  if (!user || !user.isActive) {
    const error = new Error("Authenticated user is not available.");
    error.statusCode = 404;
    throw error;
  }

  const previousProfileImageUrl = user.profile_image_url;
  user.profile_image_url = null;
  await user.save();
  await deleteStoredProfileImage(previousProfileImageUrl);

  return toSafeUser(user);
}

async function deleteStoredProfileImage(profileImageUrl) {
  const storedPath = resolveStoredProfileImagePath(profileImageUrl);
  if (!storedPath) {
    return;
  }

  await deleteUploadedFile(storedPath);
}

function resolveStoredProfileImagePath(profileImageUrl) {
  if (!profileImageUrl || !profileImageUrl.startsWith(PROFILE_IMAGE_PUBLIC_PREFIX)) {
    return null;
  }

  const filename = path.basename(profileImageUrl);
  return path.join(PROFILE_IMAGE_UPLOAD_DIR, filename);
}

async function deleteUploadedFile(filePath) {
  if (!filePath) {
    return;
  }

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

module.exports = {
  getCurrentUserProfile,
  uploadProfileImage,
  removeProfileImage,
};
