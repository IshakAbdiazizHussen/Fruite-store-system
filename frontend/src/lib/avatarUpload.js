"use client";

const MAX_AVATAR_DIMENSION = 640;
const AVATAR_QUALITY = 0.82;

export function isDefaultAvatar(avatar) {
  return !avatar || avatar === "/Ilwaad-manager.png";
}

export function getAvatarSource(avatar) {
  return isDefaultAvatar(avatar) ? null : avatar;
}

export async function optimizeAvatarFile(file) {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);
  const { width, height } = getScaledDimensions(image.width, image.height);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to process the selected image.");
  }

  context.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", AVATAR_QUALITY);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Unable to read the selected image."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load the selected image."));
    image.src = src;
  });
}

function getScaledDimensions(width, height) {
  const longestSide = Math.max(width, height);
  if (longestSide <= MAX_AVATAR_DIMENSION) {
    return { width, height };
  }

  const scale = MAX_AVATAR_DIMENSION / longestSide;
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}
