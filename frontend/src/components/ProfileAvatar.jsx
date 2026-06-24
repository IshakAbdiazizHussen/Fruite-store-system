"use client";

import { useEffect, useState } from "react";
import { resolveBackendAssetUrl } from "@/lib/apiClient";

const processedAvatarCache = new Map();
const PROFILE_AVATAR_CACHE_PREFIX = "fruit_store_processed_avatar:";

export default function ProfileAvatar({
  src,
  alt,
  sizeClassName = "h-14 w-14",
  frameClassName = "",
  imageClassName = "",
  fallbackSrc = "/manager-profile.png",
}) {
  const resolvedSrc = src ? resolveBackendAssetUrl(src) : fallbackSrc;
  const [displaySrc, setDisplaySrc] = useState(() => getCachedAvatar(resolvedSrc) || null);

  useEffect(() => {
    let isCancelled = false;
    const cachedAvatar = getCachedAvatar(resolvedSrc);

    if (cachedAvatar) {
      setDisplaySrc(cachedAvatar);
      return () => {
        isCancelled = true;
      };
    }

    removeEdgeConnectedWhiteBackground(resolvedSrc)
      .then((nextSrc) => {
        if (!isCancelled) {
          const finalSrc = nextSrc || resolvedSrc;
          setCachedAvatar(resolvedSrc, finalSrc);
          setDisplaySrc(finalSrc);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setCachedAvatar(resolvedSrc, resolvedSrc);
          setDisplaySrc(resolvedSrc);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [resolvedSrc]);

  return (
    <div
      className={`flex items-center justify-center overflow-hidden rounded-full border border-slate-200/80 bg-slate-50 p-2 shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition-[background-color,border-color,box-shadow] duration-300 ease-in-out dark:border-blue-400/20 dark:bg-slate-900 dark:shadow-[0_0_0_1px_rgba(96,165,250,0.12),0_18px_40px_rgba(2,6,23,0.45)] ${sizeClassName} ${frameClassName}`}
    >
      <img
        src={displaySrc || resolvedSrc}
        alt={alt}
        className={`h-full w-full rounded-full object-contain object-center brightness-100 transition-opacity duration-300 ease-in-out ${displaySrc ? "opacity-100" : "opacity-0"} ${imageClassName}`}
      />
    </div>
  );
}

function getCachedAvatar(src) {
  if (!src) {
    return null;
  }

  const memoryCached = processedAvatarCache.get(src);
  if (memoryCached) {
    return memoryCached;
  }

  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(`${PROFILE_AVATAR_CACHE_PREFIX}${src}`);
    if (stored) {
      processedAvatarCache.set(src, stored);
      return stored;
    }
  } catch {
    return null;
  }

  return null;
}

function setCachedAvatar(src, value) {
  if (!src || !value) {
    return;
  }

  processedAvatarCache.set(src, value);

  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(`${PROFILE_AVATAR_CACHE_PREFIX}${src}`, value);
  } catch {
    // Ignore cache write failures to keep rendering resilient.
  }
}

async function removeEdgeConnectedWhiteBackground(src) {
  const image = await loadImage(src);
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return src;
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imageData;
  const visited = new Uint8Array(width * height);
  const queue = [];

  enqueueBorderPixels(width, height, queue, visited, data);

  while (queue.length) {
    const index = queue.shift();
    const offset = index * 4;
    const alpha = data[offset + 3];

    if (!alpha || !isNearWhite(data[offset], data[offset + 1], data[offset + 2], alpha)) {
      continue;
    }

    data[offset + 3] = 0;

    const x = index % width;
    const y = Math.floor(index / width);

    enqueueNeighbor(x - 1, y, width, height, queue, visited);
    enqueueNeighbor(x + 1, y, width, height, queue, visited);
    enqueueNeighbor(x, y - 1, width, height, queue, visited);
    enqueueNeighbor(x, y + 1, width, height, queue, visited);
  }

  softenWhiteHalo(data, width, height);

  context.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
}

function softenWhiteHalo(data, width, height) {
  const nextAlpha = new Uint8ClampedArray(width * height);

  for (let index = 0; index < width * height; index += 1) {
    nextAlpha[index] = data[index * 4 + 3];
  }

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const index = y * width + x;
      const offset = index * 4;
      const alpha = data[offset + 3];

      if (!alpha || !touchesTransparentNeighbor(data, x, y, width, height)) {
        continue;
      }

      const red = data[offset];
      const green = data[offset + 1];
      const blue = data[offset + 2];

      if (!isSoftWhiteHalo(red, green, blue, alpha)) {
        continue;
      }

      const whiteness = (red + green + blue) / 3;
      const retainedAlpha = Math.max(0, Math.min(255, Math.round(255 - (whiteness - 210) * 5.5)));
      nextAlpha[index] = Math.min(nextAlpha[index], retainedAlpha);
    }
  }

  for (let index = 0; index < width * height; index += 1) {
    data[index * 4 + 3] = nextAlpha[index];
  }
}

function enqueueBorderPixels(width, height, queue, visited, data) {
  for (let x = 0; x < width; x += 1) {
    enqueueIfNearWhite(x, 0, width, height, queue, visited, data);
    enqueueIfNearWhite(x, height - 1, width, height, queue, visited, data);
  }

  for (let y = 0; y < height; y += 1) {
    enqueueIfNearWhite(0, y, width, height, queue, visited, data);
    enqueueIfNearWhite(width - 1, y, width, height, queue, visited, data);
  }
}

function enqueueIfNearWhite(x, y, width, height, queue, visited, data) {
  const index = y * width + x;
  const offset = index * 4;
  const alpha = data[offset + 3];

  if (
    alpha &&
    isNearWhite(data[offset], data[offset + 1], data[offset + 2], alpha) &&
    !visited[index]
  ) {
    visited[index] = 1;
    queue.push(index);
  }
}

function enqueueNeighbor(x, y, width, height, queue, visited) {
  if (x < 0 || y < 0 || x >= width || y >= height) {
    return;
  }

  const index = y * width + x;
  if (visited[index]) {
    return;
  }

  visited[index] = 1;
  queue.push(index);
}

function isNearWhite(red, green, blue, alpha) {
  return alpha > 0 && red >= 240 && green >= 240 && blue >= 240;
}

function isSoftWhiteHalo(red, green, blue, alpha) {
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const saturation = max - min;
  const brightness = (red + green + blue) / 3;

  return alpha > 0 && brightness >= 225 && saturation <= 28;
}

function touchesTransparentNeighbor(data, x, y, width, height) {
  for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
    for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
      if (offsetX === 0 && offsetY === 0) {
        continue;
      }

      const neighborIndex = ((y + offsetY) * width + (x + offsetX)) * 4;
      if (data[neighborIndex + 3] === 0) {
        return true;
      }
    }
  }

  return false;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load avatar image."));
    image.src = src;
  });
}
