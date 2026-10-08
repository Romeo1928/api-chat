import { checkIsAbortError, GreenApiNetworkError } from 'src/modules/common/api/greenApi/errors';
import { mapHttpStatusError, truncateErrorMessage } from 'src/modules/common/api/greenApi/mapApiError';
import type {
  AuthCredentials,
  DeleteNotificationResponse,
  GetStateInstanceResponse,
  ReceiveNotificationResponse,
  SendMessagePayload,
  SendMessageResponse,
} from 'src/modules/common/api/greenApi/types';

const buildInstanceUrl = (credentials: AuthCredentials, method: string, pathSuffix = ''): string => {
  const { idInstance, apiTokenInstance, apiUrl } = credentials;

  return `${apiUrl}/waInstance${idInstance}/${method}/${apiTokenInstance}${pathSuffix}`;
};

const request = async (url: string, init: RequestInit): Promise<Response> => {
  try {
    return await fetch(url, init);
  } catch (error) {
    if (checkIsAbortError(error)) {
      throw error;
    }

    throw new GreenApiNetworkError();
  }
};

const readErrorMessage = async (response: Response): Promise<string> => {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('text/html')) {
    return response.statusText || `HTTP ${response.status}`;
  }

  const text = await response.text();
  const trimmed = text.trim();

  if (!trimmed) {
    return response.statusText || `HTTP ${response.status}`;
  }

  try {
    const payload: unknown = JSON.parse(trimmed);

    if (typeof payload === 'string' && payload.trim()) {
      return truncateErrorMessage(payload);
    }

    if (payload && typeof payload === 'object' && 'message' in payload) {
      const message = payload.message;

      if (typeof message === 'string' && message.trim()) {
        return truncateErrorMessage(message);
      }
    }

    return truncateErrorMessage(trimmed);
  } catch {
    return truncateErrorMessage(trimmed);
  }
};

const ensureOk = async (response: Response): Promise<void> => {
  if (response.ok) {
    return;
  }

  const message = await readErrorMessage(response);
  throw new Error(mapHttpStatusError(response.status, message));
};

export const getStateInstance = async (
  credentials: AuthCredentials,
  signal?: AbortSignal,
): Promise<GetStateInstanceResponse> => {
  const response = await request(buildInstanceUrl(credentials, 'getStateInstance'), {
    method: 'GET',
    signal,
  });

  await ensureOk(response);

  return (await response.json()) as GetStateInstanceResponse;
};

export const sendMessage = async (
  credentials: AuthCredentials,
  payload: SendMessagePayload,
  signal?: AbortSignal,
): Promise<SendMessageResponse> => {
  const response = await request(buildInstanceUrl(credentials, 'sendMessage'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal,
  });

  await ensureOk(response);

  return (await response.json()) as SendMessageResponse;
};

export const receiveNotification = async (
  credentials: AuthCredentials,
  receiveTimeout = 20,
  signal?: AbortSignal,
): Promise<ReceiveNotificationResponse | null> => {
  const url = `${buildInstanceUrl(credentials, 'receiveNotification')}?receiveTimeout=${receiveTimeout}`;
  const response = await request(url, {
    method: 'GET',
    signal,
  });

  await ensureOk(response);

  const text = await response.text();
  const trimmed = text.trim();

  if (!trimmed || trimmed === 'null') {
    return null;
  }

  return JSON.parse(trimmed) as ReceiveNotificationResponse;
};

export const deleteNotification = async (
  credentials: AuthCredentials,
  receiptId: number,
  signal?: AbortSignal,
): Promise<DeleteNotificationResponse> => {
  const response = await request(buildInstanceUrl(credentials, 'deleteNotification', `/${receiptId}`), {
    method: 'DELETE',
    signal,
  });

  await ensureOk(response);

  return (await response.json()) as DeleteNotificationResponse;
};
