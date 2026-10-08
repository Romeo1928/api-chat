export class GreenApiNetworkError extends Error {
  constructor() {
    super('Не удалось подключиться к apiUrl');
    this.name = 'GreenApiNetworkError';
  }
}

export const checkIsAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError';
