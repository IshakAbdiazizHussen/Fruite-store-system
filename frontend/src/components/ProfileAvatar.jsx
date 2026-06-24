"use client";

import { useEffect, useState } from "react";
import { resolveBackendAssetUrl } from "@/lib/apiClient";

export default function ProfileAvatar({
  src,
  alt,
  sizeClassName = "h-14 w-14",
  frameClassName = "",
  imageClassName = "",
  fallbackSrc = "/manager-profile.png",
}) {
  const resolvedSrc = src ? resolveBackendAssetUrl(src) : fallbackSrc;
  const [displaySrc, setDisplaySrc] = useState(resolvedSrc);

  useEffect(() => {
    let isCancelled = false;

    removeEdgeConnectedWhiteBackground(resolvedSrc)
      .then((nextSrc) => {
        if (!isCancelled) {
          setDisplaySrc(nextSrc || resolvedSrc);
        }
      })
      .catch(() => {
        if (!isCancelled) {
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
        src={displaySrc}
        alt={alt}
        className={`h-full w-full rounded-full object-contain object-center brightness-100 ${imageClassName}`}
      />
    </div>
  );
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

  context.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
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

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load avatar image."));
    image.src = src;
  });
}
