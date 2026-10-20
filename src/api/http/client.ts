export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const readErrorMessage = async (response: Response) => {
  const body: unknown = await response.json().catch(() => null);

  return typeof body === "object" &&
    body !== null &&
    "message" in body &&
    typeof body.message === "string"
    ? body.message
    : response.statusText;
};

const sendRequest = (path: string, init?: RequestInit) =>
  fetch(`/api${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

const NO_REFRESH_PATHS = ["/auth/login", "/auth/refresh", "/auth/logout"];

let refreshPromise: Promise<boolean> | null = null;

// requests that get a 401 at the same time share one refresh: a refresh token works only once
const refreshSession = () => {
  refreshPromise ??= sendRequest("/auth/refresh", { method: "POST" })
    .then((response) => response.ok)
    .catch(() => false)
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

export const apiRequest = async (path: string, init?: RequestInit) => {
  let response = await sendRequest(path, init);

  if (response.status === 401 && !NO_REFRESH_PATHS.includes(path) && (await refreshSession())) {
    response = await sendRequest(path, init);
  }

  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response));
  }

  return response;
};

export const apiFetch = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await apiRequest(path, init);
  return response.json();
};
