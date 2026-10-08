import type { MESSAGE_DIRECTIONS, MESSAGE_STATUSES } from 'src/modules/chat/constants/chatMessage';

export type MessageDirection = (typeof MESSAGE_DIRECTIONS)[keyof typeof MESSAGE_DIRECTIONS];

export type MessageStatus = (typeof MESSAGE_STATUSES)[keyof typeof MESSAGE_STATUSES];

export type ChatMessage = {
  id: string;
  chatId: string;
  text: string;
  direction: MessageDirection;
  timestamp: number;
  status: MessageStatus;
};
