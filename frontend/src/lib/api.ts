const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

function isFormData(val: unknown): val is FormData {
  return (
    typeof FormData !== "undefined" &&
    (val instanceof FormData ||
      (val !== null && typeof val === "object" && (val as { constructor?: { name?: string } }).constructor?.name === "FormData") ||
      Object.prototype.toString.call(val) === "[object FormData]")
  )
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isFD = isFormData(options.body)
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    ...options,
    headers: isFD
      ? options.headers
      : { "Content-Type": "application/json", ...options.headers },
  })

  const json = await res.json().catch(() => null)
  if (!res.ok) throw new ApiError(res.status, json?.message || "Request failed")
  return json?.data as T
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: isFormData(body) ? body : JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: isFormData(body) ? body : JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: isFormData(body) ? body : JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
}
