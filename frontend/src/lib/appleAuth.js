"use client";

import { apiRequest } from "@/lib/apiClient";

const APPLE_JS_URL = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";

function loadAppleSdk() {
  if (window.AppleID?.auth) return Promise.resolve(window.AppleID);

  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-apple-sign-in="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(window.AppleID), { once: true });
      existing.addEventListener("error", () => reject(new Error("Apple Sign in could not be loaded.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = APPLE_JS_URL;
    script.async = true;
    script.dataset.appleSignIn = "true";
    script.onload = () => window.AppleID?.auth
      ? resolve(window.AppleID)
      : reject(new Error("Apple Sign in could not be loaded."));
    script.onerror = () => reject(new Error("Apple Sign in could not be loaded."));
    document.head.appendChild(script);
  });
}

function getAppleErrorMessage(error) {
  const code = error?.error || error?.message || "";
  if (String(code).includes("user_cancelled_authorize") || String(code).includes("popup_closed")) {
    return "Apple sign-in was cancelled.";
  }
  return "Apple sign-in could not be completed. Please try again.";
}

/**
 * Uses Apple's browser SDK. Only public values (Services ID, redirect URI,
 * state, nonce) are given to the browser; the private client secret stays on
 * the API while it exchanges and verifies the authorization code.
 */
export async function signInWithApple() {
  const [configuration, AppleID] = await Promise.all([
    apiRequest("/auth/apple/config"),
    loadAppleSdk(),
  ]);

  try {
    AppleID.auth.init({
      clientId: configuration.clientId,
      scope: "name email",
      redirectURI: configuration.redirectURI,
      state: configuration.state,
      nonce: configuration.nonce,
      usePopup: true,
    });
    const response = await AppleID.auth.signIn();
    const authorization = response?.authorization;
    if (!authorization?.code || !authorization?.id_token || authorization.state !== configuration.state) {
      throw new Error("Apple returned an incomplete sign-in response.");
    }

    return apiRequest("/auth/apple/complete", {
      method: "POST",
      body: JSON.stringify({
        code: authorization.code,
        idToken: authorization.id_token,
        state: authorization.state,
        user: response.user || null,
      }),
    });
  } catch (error) {
    if (error?.message?.startsWith("Apple returned")) throw error;
    throw new Error(getAppleErrorMessage(error));
  }
}
