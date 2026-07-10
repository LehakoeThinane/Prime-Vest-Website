const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const ACCESS_TOKEN_KEY = "pv_access_token";
const REFRESH_TOKEN_KEY = "pv_refresh_token";

export function getTokens() {
  if (typeof window === "undefined") return { access: null, refresh: null };
  return {
    access: window.localStorage.getItem(ACCESS_TOKEN_KEY),
    refresh: window.localStorage.getItem(REFRESH_TOKEN_KEY),
  };
}

export function setTokens(access: string, refresh: string) {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, access);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function clearTokens() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function isLoggedIn() {
  return !!getTokens().access;
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error("Invalid email or password");
  }
  const data = await res.json();
  setTokens(data.access, data.refresh);
  return data;
}

export async function register(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
) {
  const res = await fetch(`${API_URL}/api/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      first_name: firstName ?? "",
      last_name: lastName ?? "",
    }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body ? JSON.stringify(body) : "Registration failed");
  }
  return res.json();
}

export async function requestPasswordReset(email: string) {
  const res = await fetch(`${API_URL}/api/auth/password-reset/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error("Failed to request password reset");
  return res.json();
}

export async function confirmPasswordReset(uid: string, token: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/password-reset/confirm/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid, token, password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.non_field_errors?.[0] ?? "Reset link is invalid or expired");
  }
  return res.json();
}

async function refreshAccessToken(): Promise<string | null> {
  const { refresh } = getTokens();
  if (!refresh) return null;

  const res = await fetch(`${API_URL}/api/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) {
    clearTokens();
    return null;
  }
  const data = await res.json();
  window.localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
  return data.access;
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  const { access } = getTokens();

  const doFetch = (token: string | null) =>
    fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(options.headers ?? {}),
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  let res = await doFetch(access);

  if (res.status === 401) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      res = await doFetch(newAccess);
    }
  }

  return res;
}

async function apiJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await apiFetch(path, options);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ?? (body ? JSON.stringify(body) : `Request failed (${res.status})`));
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// Public (unauthenticated) content endpoints callable from client components.
async function publicJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ?? (body ? JSON.stringify(body) : `Request failed (${res.status})`));
  }
  return res.json();
}

export function submitContactForm(payload: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  return publicJson("/api/content/contact/", { method: "POST", body: JSON.stringify(payload) });
}

export function subscribeToNewsletter(email: string) {
  return publicJson("/api/content/newsletter/subscribe/", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function searchSite(query: string) {
  return publicJson(`/api/content/search/?q=${encodeURIComponent(query)}`);
}

export const getInvestmentProductsClient = () =>
  publicJson<InvestmentProduct[]>("/api/investments/products/");

export const getSiteSettingsClient = () => publicJson<SiteSettings>("/api/content/site-settings/");

// Authenticated dashboard endpoints.
import type {
  AdminStats,
  ChatMessage,
  ChatThread,
  Deposit,
  Earning,
  Investment,
  InvestmentProduct,
  Me,
  Notification,
  PortfolioSummary,
  Profile,
  SiteSettings,
  Withdrawal,
} from "./types";

export const getMe = () => apiJson<Me>("/api/auth/me/");
export const getProfile = () => apiJson<Profile>("/api/auth/profile/");
export const updateProfile = (payload: Record<string, unknown>) =>
  apiJson<Profile>("/api/auth/profile/", { method: "PATCH", body: JSON.stringify(payload) });

export const getMyInvestments = () => apiJson<Investment[]>("/api/investments/");
export const createInvestment = (productId: number, amount: string) =>
  apiJson<Investment>("/api/investments/", {
    method: "POST",
    body: JSON.stringify({ product_id: productId, amount }),
  });
export const getPortfolioSummary = () => apiJson<PortfolioSummary>("/api/investments/portfolio/summary/");

export const getDeposits = () => apiJson<Deposit[]>("/api/transactions/deposits/");
export const createDeposit = (amount: string, method: "bank_transfer" | "crypto", notes = "") =>
  apiJson<Deposit>("/api/transactions/deposits/", {
    method: "POST",
    body: JSON.stringify({ amount, method, notes }),
  });

export const getWithdrawals = () => apiJson<Withdrawal[]>("/api/transactions/withdrawals/");
export const createWithdrawal = (
  amount: string,
  method: "bank_transfer" | "crypto",
  bankDetails = ""
) =>
  apiJson<Withdrawal>("/api/transactions/withdrawals/", {
    method: "POST",
    body: JSON.stringify({ amount, method, bank_details: bankDetails }),
  });

export const getEarningsSummary = () =>
  apiJson<{ total_earnings: string; earnings: Earning[] }>("/api/transactions/earnings/");

export const getNotifications = () => apiJson<Notification[]>("/api/notifications/");
export const markNotificationRead = (id: number) =>
  apiJson<Notification>(`/api/notifications/${id}/read/`, { method: "POST" });
export const markAllNotificationsRead = () =>
  apiJson<{ marked_read: number }>("/api/notifications/read-all/", { method: "POST" });

export const getChatThread = () => apiJson<ChatThread>("/api/chat/thread/");
export const sendChatMessage = (body: string) =>
  apiJson<ChatMessage>("/api/chat/thread/", { method: "POST", body: JSON.stringify({ body }) });

export const initializePaystackDeposit = (amount: string) =>
  apiJson<{ authorization_url: string; reference: string }>("/api/payments/paystack/initialize/", {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
export const verifyPaystackDeposit = (reference: string) =>
  apiJson<{ reference: string; status: string; amount: string }>(
    `/api/payments/paystack/verify/${reference}/`
  );

export const getAdminStats = () => apiJson<AdminStats>("/api/admin/stats/");
