const fs = require("fs");
const path = require("path");
const multer = require("multer");

const PROFILE_IMAGE_UPLOAD_DIR = path.resolve(__dirname, "../../uploads/profile-images");
const MAX_PROFILE_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

fs.mkdirSync(PROFILE_IMAGE_UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination(_req, _file, callback) {
    callback(null, PROFILE_IMAGE_UPLOAD_DIR);
  },
  filename(req, file, callback) {
    const extension = path.extname(file.originalname || "").toLowerCase();
    const safeExtension = ALLOWED_EXTENSIONS.has(extension) ? extension : ".jpg";
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    callback(null, `user-${req.auth.user.id}-${uniqueSuffix}${safeExtension}`);
  },
});

function fileFilter(_req, file, callback) {
  const extension = path.extname(file.originalname || "").toLowerCase();
  const isAllowedType =
    ALLOWED_MIME_TYPES.has(String(file.mimetype || "").toLowerCase()) &&
    ALLOWED_EXTENSIONS.has(extension);

  if (!isAllowedType) {
    const error = new Error("Only jpg, jpeg, png, and webp image files are allowed.");
    error.statusCode = 400;
    callback(error);
    return;
  }

  callback(null, true);
}

const uploader = multer({
  storage,
  limits: {
    fileSize: MAX_PROFILE_IMAGE_SIZE_BYTES,
  },
  fileFilter,
});

function profileImageUpload(req, res, next) {
  uploader.single("profile_image")(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      const uploadError = new Error(
        error.code === "LIMIT_FILE_SIZE"
          ? "Profile image must be 5MB or smaller."
          : "Invalid profile image upload."
      );
      uploadError.statusCode = 400;
      next(uploadError);
      return;
    }

    if (error) {
      next(error);
      return;
    }

    next();
  });
}

module.exports = {
  profileImageUpload,
  PROFILE_IMAGE_UPLOAD_DIR,
};
