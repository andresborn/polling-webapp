export type AppError =
  | { kind: "bad_request"; message: string; status: 400; issues?: unknown }
  | { kind: "forbidden"; message: string; status: 403 }
  | { kind: "not_found"; message: string; status: 404 }
  | { kind: "internal_server_error"; message: string; status: 500 };

export const AppError = {
  badRequest: (message: string, issues?: unknown): AppError => ({
    kind: "bad_request",
    message,
    status: 400,
    issues,
  }),
  forbidden: (message: string): AppError => ({
    kind: "forbidden",
    message,
    status: 403,
  }),
  notFound: (message: string): AppError => ({
    kind: "not_found",
    message,
    status: 404,
  }),
  internalServerError: (message: string): AppError => ({
    kind: "internal_server_error",
    message,
    status: 500,
  }),
};

export type Result<T, E = AppError> = { ok: true; data: T } | {
  ok: false;
  error: E;
};

// Helper functions for discriminated union
export const ok = <T>(data: T): Result<T, never> => ({ ok: true, data });
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });
