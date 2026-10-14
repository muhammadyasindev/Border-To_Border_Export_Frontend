/**
 * Safe API request utility for Border Export Hub Frontend.
 * Robustly parses responses, automatically attaches credentials & Bearer tokens,
 * and gracefully catches 502/503/HTML proxy errors without throwing JSON syntax errors.
 */

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

export function getAuthToken() {
  try {
    return localStorage.getItem("bg_auth_token") || "";
  } catch (e) {
    return "";
  }
}

export function setAuthToken(token) {
  try {
    if (token) {
      localStorage.setItem("bg_auth_token", token);
    } else {
      localStorage.removeItem("bg_auth_token");
    }
  } catch (e) {}
}

export function buildApiUrl(path) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (!API_BASE_URL) return cleanPath;
  return `${API_BASE_URL}${cleanPath}`;
}

export async function safeFetch(input, init = {}) {
  const url = typeof input === "string" ? buildApiUrl(input) : input;

  const headers = new Headers(init.headers || {});

  // Add default content-type for non-FormData bodies
  if (!(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Fallback Bearer token authorization header if present in localStorage
  const token = getAuthToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const fetchOptions = {
    ...init,
    headers,
    credentials: init.credentials || "include",
  };

  try {
    const res = await fetch(url, fetchOptions);
    const contentType = res.headers.get("content-type") || "";

    let data = null;
    if (contentType.includes("application/json")) {
      data = await res.json().catch(() => null);
    } else {
      const text = await res.text().catch(() => "");
      if (res.status === 502) {
        return {
          ok: false,
          status: 502,
          error: "Backend API is waking up or temporarily unavailable (502 Bad Gateway). Please retry in a few moments.",
        };
      }
      if (res.status === 503) {
        return {
          ok: false,
          status: 503,
          error: "Service is temporarily unavailable (503). Please retry shortly.",
        };
      }
      return {
        ok: false,
        status: res.status,
        error: text.length > 200 || text.includes("<!DOCTYPE") ? `Server returned HTTP ${res.status}` : (text || `Server error ${res.status}`),
      };
    }

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        data,
        error: data?.error || data?.message || `Request failed (${res.status})`,
      };
    }

    return { ok: true, status: res.status, data };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: err?.message || "Network request failed. Please check your connection.",
    };
  }
}
