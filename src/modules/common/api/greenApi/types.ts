import type { InstanceState, WebhookType } from 'src/modules/common/api/greenApi/constants';

export type AuthCredentials = {
  idInstance: string;
  apiTokenInstance: string;
  apiUrl: string;
};

export type GetStateInstanceResponse = {
  stateInstance: InstanceState;
};

export type SendMessagePayload = {
  chatId: string;
  message: string;
};

export type SendMessageResponse = {
  idMessage: string;
};

export type DeleteNotificationResponse = {
  result: boolean;
  reason: string;
};

export type IncomingNotificationBody = {
  // GREEN-API шлёт и другие типы (incomingCall, quotaExceeded, …) — оставляем открытым
  typeWebhook: WebhookType | (string & {});
  timestamp: number;
  idMessage: string;
  senderData?: {
    chatId: string;
    sender?: string;
    senderName?: string;
    chatName?: string;
  };
  messageData?: {
    typeMessage: string;
    textMessageData?: {
      textMessage: string;
    };
    extendedTextMessageData?: {
      text: string;
    };
  };
};

export type ReceiveNotificationResponse = {
  receiptId: number;
  body: IncomingNotificationBody;
};
