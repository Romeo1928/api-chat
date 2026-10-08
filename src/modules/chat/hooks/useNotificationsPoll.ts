import { useEffect } from 'react';

import { getAuthCredentials } from 'src/modules/auth/helpers/getAuthCredentials';
import { MESSAGE_DIRECTIONS, MESSAGE_STATUSES } from 'src/modules/chat/constants/chatMessage';
import { endSession } from 'src/modules/chat/helpers/endSession';
import { getNotificationText } from 'src/modules/chat/helpers/getNotificationText';
import { useChatsStore } from 'src/modules/chat/stores/chatsStore';
import { WEBHOOK_TYPES } from 'src/modules/common/api/greenApi/constants';
import { checkIsAbortError, checkIsUnauthorizedError } from 'src/modules/common/api/greenApi/errors';
import { deleteNotification, receiveNotification } from 'src/modules/common/api/greenApi/greenApi';
import type { IncomingNotificationBody } from 'src/modules/common/api/greenApi/types';

const RECEIVE_TIMEOUT_SEC = 20;
const RETRY_DELAY_MS = 2000;
/** Fallback when API returns null without holding the long-poll. */
const EMPTY_POLL_DELAY_MS = 1000;

const TEXT_WEBHOOK_TYPES = new Set<string>([
  WEBHOOK_TYPES.incomingMessageReceived,
  WEBHOOK_TYPES.outgoingMessageReceived,
  WEBHOOK_TYPES.outgoingAPIMessageReceived,
]);

const delay = (ms: number, signal: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason instanceof DOMException ? signal.reason : new DOMException('Aborted', 'AbortError'));
      return;
    }

    const timeoutId = window.setTimeout(() => {
      signal.removeEventListener('abort', handleAbort);
      resolve();
    }, ms);

    const handleAbort = () => {
      window.clearTimeout(timeoutId);
      signal.removeEventListener('abort', handleAbort);
      reject(signal.reason instanceof DOMException ? signal.reason : new DOMException('Aborted', 'AbortError'));
    };

    signal.addEventListener('abort', handleAbort);
  });

const checkIsOutgoingWebhook = (typeWebhook: string): boolean =>
  typeWebhook === WEBHOOK_TYPES.outgoingMessageReceived || typeWebhook === WEBHOOK_TYPES.outgoingAPIMessageReceived;

const handleNotification = (body: IncomingNotificationBody) => {
  const chatId = body.senderData?.chatId;
  const text = getNotificationText(body);

  if (!chatId || !text || !TEXT_WEBHOOK_TYPES.has(body.typeWebhook)) {
    return;
  }

  const { addMessage, ensureChat } = useChatsStore.getState();
  const isOutgoing = checkIsOutgoingWebhook(body.typeWebhook);
  // For outgoing messages senderName is the instance owner, not the chat partner.
  const chatTitle = isOutgoing ? body.senderData?.chatName : body.senderData?.chatName || body.senderData?.senderName;
  const timestamp = body.timestamp * 1000;

  ensureChat({ chatId, title: chatTitle, timestamp });
  addMessage({
    id: body.idMessage,
    chatId,
    text,
    direction: isOutgoing ? MESSAGE_DIRECTIONS.outgoing : MESSAGE_DIRECTIONS.incoming,
    timestamp,
    status: MESSAGE_STATUSES.sent,
  });
};

export const useNotificationsPoll = () => {
  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const poll = async () => {
      while (!signal.aborted) {
        try {
          const notification = await receiveNotification(getAuthCredentials(), RECEIVE_TIMEOUT_SEC, signal);

          // Logout may have happened while the request was resolving.
          if (signal.aborted) {
            return;
          }

          if (!notification) {
            await delay(EMPTY_POLL_DELAY_MS, signal);
            continue;
          }

          handleNotification(notification.body);

          await deleteNotification(getAuthCredentials(), notification.receiptId, signal);
        } catch (error) {
          if (checkIsAbortError(error) || signal.aborted) {
            return;
          }

          if (checkIsUnauthorizedError(error)) {
            endSession();
            return;
          }

          try {
            await delay(RETRY_DELAY_MS, signal);
          } catch {
            return;
          }
        }
      }
    };

    void poll();

    return () => {
      abortController.abort();
    };
  }, []);
};
