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

export const apiRequest = async (path: string, init?: RequestInit) => {
  const response = await fetch(`/api${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response));
  }

  return response;
};

export const apiFetch = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await apiRequest(path, init);
  return response.json();
};
