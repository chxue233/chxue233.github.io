export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const base = import.meta.env.VITE_OAUTH_SERVER_URL;
  
  // If OAuth is not configured, return a safe fallback
  if (!oauthPortalUrl || !appId || !base) {
    // Return current origin as fallback to prevent crashes
    return `${window.location.origin}/login`;
  }

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  try {
    const url = new URL(`${oauthPortalUrl}/app-auth`);
    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");

    return new URL('/login', base).toString();
  } catch (error) {
    // Fallback if URL construction fails
    console.warn('Failed to construct login URL:', error);
    return `${window.location.origin}/login`;
  }
};
