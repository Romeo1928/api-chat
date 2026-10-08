import type { IncomingNotificationBody } from 'src/modules/common/api/greenApi/types';

export const getNotificationText = (body: IncomingNotificationBody): string | undefined => {
  const textMessage = body.messageData?.textMessageData?.textMessage?.trim();

  if (textMessage) {
    return textMessage;
  }

  const extendedText = body.messageData?.extendedTextMessageData?.text?.trim();

  if (extendedText) {
    return extendedText;
  }

  return undefined;
};
