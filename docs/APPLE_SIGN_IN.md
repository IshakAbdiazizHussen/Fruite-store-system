# Sign in with Apple

This project uses the official Apple JavaScript SDK in a popup and validates the response on the Express server. The browser never receives the Apple private key or the generated client secret.

## Flow

1. The login page requests `GET /api/auth/apple/config`.
2. The server generates a short-lived, random state and nonce, stores state in an HTTP-only cookie, and returns only public Apple configuration.
3. The browser loads Apple JS and calls `AppleID.auth.signIn()` with `usePopup: true`.
4. The browser posts the authorization code, identity token, full name (when Apple sends it), and state to `POST /api/auth/apple/complete`.
5. The server compares state against its cookie, exchanges the one-time authorization code using a server-generated client secret, obtains Apple's JWKS, verifies both ID-token signatures, and validates issuer, audience, expiry, nonce, and subject.
6. `appleUserId` is the permanent account key. Email is only used as a one-time, verified-account linking aid and is optional.

Apple supplies a full name only on the initial authorization response. It is sanitized by Mongoose trimming and stored immediately. Apple may provide an anonymized private-relay email or no email for some managed accounts, so the schema allows an absent email.

## Apple Developer configuration

1. In Apple Developer, create or select an App ID with **Sign in with Apple** enabled.
2. Create a **Services ID** for the website. Use that Services ID as `APPLE_CLIENT_ID`.
3. Configure the Services ID’s **Domains and Subdomains** and **Return URLs**. The return URL must exactly equal `APPLE_CALLBACK_URL` and must be HTTPS in production; Apple does not accept `localhost` or an IP address as a production web return URL.
4. Create a Sign in with Apple key, enable it for the App ID, and record its Key ID. Download the `.p8` key once and keep it in your secrets manager.
5. Set the Team ID, Services ID, Key ID, and private key in the backend environment. Never put the `.p8` key or `APPLE_PRIVATE_KEY` in a frontend variable, source control, or browser bundle.
6. Deploy frontend and API on the same registrable site when possible (for example, `app.example.com` and `api.example.com`) and set `FRONTEND_URL` to the public frontend origin. This keeps the short-lived, HTTP-only CSRF state cookie first-party.

## Backend environment

```dotenv
FRONTEND_URL=https://app.example.com
APPLE_CLIENT_ID=com.example.fruitstore.web
APPLE_TEAM_ID=YOUR_TEAM_ID
APPLE_KEY_ID=YOUR_APPLE_KEY_ID
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
APPLE_CALLBACK_URL=https://app.example.com/login
APPLE_OAUTH_STATE_COOKIE_NAME=fruit_store_apple_oauth_state
```

`APPLE_CALLBACK_URL` is a public redirect URI passed to Apple JS and must be registered with Apple. Use the frontend login URL (or another existing frontend page), not an API endpoint. The SDK popup obtains credentials; the app does not need to expose a callback handler at that URL. Keep it stable and registered exactly as entered.

## Testing

Before testing, configure a real HTTPS domain and Apple sandbox/developer account:

1. Run MongoDB and the backend, then start the frontend.
2. Visit the login page in Safari on macOS, Safari on iPhone/iPad, and a supported non-Safari browser.
3. Click Apple once: the button becomes disabled and shows a progress label.
4. Complete authentication. Confirm a user document has a nonempty `appleUserId`, and that repeated login uses the same account even if a later response has no name or email.
5. Cancel the Apple sheet and confirm the login page remains usable with a cancellation message.
6. In browser developer tools, verify no Apple private key/client secret appears in requests or bundles. The completion request must include `code`, `idToken`, and `state`; the API must reject a missing/altered state, nonce, signature, audience, or expired token.
7. Run local static checks:

```bash
node --check backend/src/services/authService.js
node --check backend/src/controllers/authController.js
npm run typecheck --workspace frontend
npm run build --workspace frontend
```

Apple’s official references: [Authenticating users](https://developer.apple.com/documentation/signinwithapple/authenticating-users-with-sign-in-with-apple), [identity token verification](https://developer.apple.com/documentation/signinwithapple/verifying-a-user), and [token validation](https://developer.apple.com/documentation/SigninwithAppleRESTAPI/Generate-and-validate-tokens?changes=_7).
