import { getPhoneFromChatId } from 'src/modules/chat/helpers/getPhoneFromChatId';

export const formatChatTitle = (chatId: string, chatName?: string): string => {
  const name = chatName?.trim();

  if (name) {
    return name;
  }

  const phone = getPhoneFromChatId(chatId);

  return phone ? `+${phone}` : chatId;
};
