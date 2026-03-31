"use client";

export const defaultAvatarPosition = {
  x: 50,
  y: 50,
  scale: 1,
};

export function normalizeAvatarPosition(position) {
  return {
    x: Number.isFinite(position?.x) ? position.x : defaultAvatarPosition.x,
    y: Number.isFinite(position?.y) ? position.y : defaultAvatarPosition.y,
    scale: Number.isFinite(position?.scale) ? position.scale : defaultAvatarPosition.scale,
  };
}

export function getAvatarImageStyle(position) {
  const normalized = normalizeAvatarPosition(position);

  return {
    objectPosition: `${normalized.x}% ${normalized.y}%`,
    transform: `scale(${normalized.scale})`,
    transformOrigin: "center",
  };
}
