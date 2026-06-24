function toSafeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt,
    profile_image_url: user.profile_image_url || null,
  };
}

module.exports = {
  toSafeUser,
};
