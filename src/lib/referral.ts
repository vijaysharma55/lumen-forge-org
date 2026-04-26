/**
 * Reads a `ref` query param from the current URL and stores it in sessionStorage
 * so it survives navigation across the public site. Used to auto-fill referral_code
 * on inquiry & coordinator application forms.
 */
const KEY = "mpfh_referral_code";

export function captureReferralFromUrl() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  if (ref && /^[A-Za-z0-9_-]{3,40}$/.test(ref)) {
    sessionStorage.setItem(KEY, ref.toUpperCase());
  }
}

export function getReferralCode(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(KEY);
}

export function clearReferralCode() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}
