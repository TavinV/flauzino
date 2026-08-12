/**
 * API client — fetch com Bearer token e refresh automático.
 *
 * accessToken vive em memória; refreshToken em localStorage. Num 401 o
 * client tenta UMA vez POST /auth/refresh e repete a request original.
 * Se o refresh falhar, dispara logout global (o AuthProvider redireciona).
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

const REFRESH_KEY = "visage.refreshToken";
const USER_KEY = "visage.user";

export interface ApiValidationIssue {
  path: string;
  message: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly issues?: ApiValidationIssue[];

  constructor(status: number, code: string, message: string, issues?: ApiValidationIssue[]) {
    super(message);
    this.status = status;
    this.code = code;
    this.issues = issues;
  }
}

// ── Token store (módulo, compartilhado com o AuthProvider) ───────────────────

let accessToken: string | null = null;
let onSessionExpired: (() => void) | null = null;

export const tokenStore = {
  getAccess: () => accessToken,
  setAccess: (token: string | null) => {
    accessToken = token;
  },
  getRefresh: (): string | null => {
    if (typeof window === "undefined") return null;
    return (
      window.localStorage.getItem(REFRESH_KEY) ?? window.sessionStorage.getItem(REFRESH_KEY)
    );
  },
  /**
   * "Lembrar de mim": com remember=true o token vive em localStorage
   * (sobrevive ao fechamento do navegador); com false, em sessionStorage.
   * Sem o argumento (rotação de token), mantém o storage atual.
   */
  setRefresh: (token: string | null, remember?: boolean) => {
    if (typeof window === "undefined") return;
    if (!token) {
      window.localStorage.removeItem(REFRESH_KEY);
      window.sessionStorage.removeItem(REFRESH_KEY);
      return;
    }
    const inSessionOnly =
      window.sessionStorage.getItem(REFRESH_KEY) !== null &&
      window.localStorage.getItem(REFRESH_KEY) === null;
    const useLocal = remember ?? !inSessionOnly;
    window.localStorage.removeItem(REFRESH_KEY);
    window.sessionStorage.removeItem(REFRESH_KEY);
    (useLocal ? window.localStorage : window.sessionStorage).setItem(REFRESH_KEY, token);
  },
  getStoredUser: <T,>(): T | null => {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  setStoredUser: (user: unknown | null) => {
    if (typeof window === "undefined") return;
    if (user) window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    else window.localStorage.removeItem(USER_KEY);
  },
  setSessionExpiredHandler: (handler: (() => void) | null) => {
    onSessionExpired = handler;
  },
};

// ── Refresh (deduplicado — várias requests 401 compartilham a mesma promise) ──

let refreshPromise: Promise<boolean> | null = null;

/**
 * Troca o refreshToken salvo por um novo par de tokens. Deduplicado no nível
 * do módulo: chamadas concorrentes (StrictMode, várias requests 401)
 * compartilham a mesma promise — essencial porque o backend rotaciona o
 * refresh token a cada uso.
 */
export async function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = tokenStore.getRefresh();
      if (!refreshToken) return false;
      try {
        const res = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
        if (!res.ok) return false;
        const body = (await res.json()) as {
          data: { accessToken: string; refreshToken: string };
        };
        tokenStore.setAccess(body.data.accessToken);
        tokenStore.setRefresh(body.data.refreshToken);
        return true;
      } catch {
        return false;
      }
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

// ── Fetch principal ───────────────────────────────────────────────────────────

async function parseError(res: Response): Promise<ApiError> {
  let code = "unknown_error";
  let message = `Erro ${res.status}`;
  let issues: ApiValidationIssue[] | undefined;
  try {
    const body = await res.json();
    if (body?.error) message = body.error;
    if (body?.code) code = body.code;
    if (Array.isArray(body?.issues)) issues = body.issues;
  } catch {
    // resposta sem corpo JSON (ex.: 429 do rate limiter)
  }
  return new ApiError(res.status, code, message, issues);
}

async function rawFetch(path: string, init: RequestInit): Promise<Response> {
  const headers = new Headers(init.headers);
  const token = tokenStore.getAccess();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(`${API_URL}${path}`, { ...init, headers });
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res = await rawFetch(path, init);

  if (res.status === 401 && tokenStore.getRefresh()) {
    const refreshed = await refreshSession();
    if (refreshed) {
      res = await rawFetch(path, init);
    } else {
      onSessionExpired?.();
      throw new ApiError(401, "session_expired", "Sessão expirada. Entre novamente.");
    }
  }

  if (!res.ok) throw await parseError(res);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

function jsonInit(method: string, body?: unknown): RequestInit {
  return {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };
}

export const api = {
  get: <T,>(path: string) => apiFetch<T>(path),
  post: <T,>(path: string, body?: unknown) => apiFetch<T>(path, jsonInit("POST", body)),
  put: <T,>(path: string, body?: unknown) => apiFetch<T>(path, jsonInit("PUT", body)),
  patch: <T,>(path: string, body?: unknown) => apiFetch<T>(path, jsonInit("PATCH", body)),
  delete: <T,>(path: string) => apiFetch<T>(path, jsonInit("DELETE")),
};

/**
 * Busca um recurso binário autenticado (ex.: fraud frame JPEG) e devolve um
 * object URL. Um <img src> direto não enviaria o header Authorization.
 * O chamador é responsável por URL.revokeObjectURL.
 */
export async function fetchAuthenticatedBlobUrl(path: string): Promise<string> {
  let res = await rawFetch(path, {});
  if (res.status === 401 && tokenStore.getRefresh()) {
    const refreshed = await refreshSession();
    if (!refreshed) {
      onSessionExpired?.();
      throw new ApiError(401, "session_expired", "Sessão expirada. Entre novamente.");
    }
    res = await rawFetch(path, {});
  }
  if (!res.ok) throw await parseError(res);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

/** Monta uma query string ignorando valores vazios/undefined. */
export function qs(params: Record<string, string | number | boolean | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    search.set(key, String(value));
  }
  const out = search.toString();
  return out ? `?${out}` : "";
}
