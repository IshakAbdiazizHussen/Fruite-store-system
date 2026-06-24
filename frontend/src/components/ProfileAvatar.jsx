"use client";

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

  return (
    <div
      className={`flex items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white p-2 shadow-[0_10px_24px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900 ${sizeClassName} ${frameClassName}`}
    >
      <img
        src={resolvedSrc}
        alt={alt}
        className={`h-full w-full rounded-full object-contain object-center ${imageClassName}`}
      />
    </div>
  );
}
