/**
 * Safe API request utility for BorderGlow Frontend.
 * Robustly parses responses and gracefully catches 502/503/HTML proxy errors
 * without throwing JSON syntax errors.
 */

export interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
}

export async function safeFetch<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(input, init);
    const contentType = res.headers.get("content-type") || "";

    let data: any = null;
    if (contentType.includes("application/json")) {
      data = await res.json().catch(() => null);
    } else {
      const text = await res.text().catch(() => "");
      if (res.status === 502) {
        return {
          ok: false,
          status: 502,
          error: "Backend API is waking up or temporarily unavailable (502 Bad Gateway). Please try again in a few moments.",
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
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      error: err?.message || "Network request failed. Please check your connection.",
    };
  }
}
