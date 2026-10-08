export class GreenApiNetworkError extends Error {
  constructor() {
    super('Не удалось подключиться к apiUrl');
    this.name = 'GreenApiNetworkError';
  }
}

export class GreenApiHttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'GreenApiHttpError';
    this.status = status;
  }
}

export const checkIsAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError';

export const checkIsUnauthorizedStatus = (status: number): boolean => status === 401 || status === 403;

export const checkIsUnauthorizedError = (error: unknown): boolean =>
  error instanceof GreenApiHttpError && checkIsUnauthorizedStatus(error.status);
