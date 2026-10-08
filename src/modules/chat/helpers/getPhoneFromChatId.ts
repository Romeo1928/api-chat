export const getPhoneFromChatId = (chatId: string): string => chatId.replace(/@c\.us$/i, '');
