const MAX_ERROR_MESSAGE_LENGTH = 200;

export const truncateErrorMessage = (message: string): string => {
  if (message.length <= MAX_ERROR_MESSAGE_LENGTH) {
    return message;
  }

  return `${message.slice(0, MAX_ERROR_MESSAGE_LENGTH)}…`;
};

export const mapHttpStatusError = (status: number, message: string): string => {
  if (status === 401 || status === 403) {
    return 'Неверный idInstance или apiTokenInstance';
  }

  return message;
};

export const mapCaughtApiError = (error: unknown, fallbackMessage: string): string => {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallbackMessage;
};
