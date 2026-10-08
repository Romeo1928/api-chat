import { create } from 'zustand';

import { formatChatTitle } from 'src/modules/chat/helpers/formatChatTitle';
import type { Chat } from 'src/modules/chat/types/Chat';
import type { ChatMessage } from 'src/modules/chat/types/ChatMessage';

type EnsureChatParams = {
  chatId: string;
  title?: string;
  timestamp?: number;
};

type ChatsState = {
  chatsById: Record<string, Chat>;
  chatIds: string[];
  messagesByChatId: Record<string, ChatMessage[]>;
  selectedChatId: string | null;
};

type ChatsStore = ChatsState & {
  selectChat: (chatId: string | null) => void;
  ensureChat: (params: EnsureChatParams) => void;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (chatId: string, messageId: string, patch: Partial<ChatMessage>) => void;
  reset: () => void;
};

// Factory, not a shared constant: every reset gets fresh objects.
const createEmptyState = (): ChatsState => ({
  chatsById: {},
  chatIds: [],
  messagesByChatId: {},
  selectedChatId: null,
});

const sortChatIds = (chatsById: Record<string, Chat>, chatIds: string[]): string[] =>
  [...chatIds].sort((leftId, rightId) => chatsById[rightId].lastMessageAt - chatsById[leftId].lastMessageAt);

/** Returns the updated chats slice, or null when nothing changed. */
const upsertChat = (
  state: ChatsState,
  { chatId, title, timestamp }: EnsureChatParams,
): Pick<ChatsState, 'chatsById' | 'chatIds'> | null => {
  const existingChat = state.chatsById[chatId];
  const trimmedTitle = title?.trim();

  if (!existingChat) {
    const chatsById = {
      ...state.chatsById,
      [chatId]: {
        chatId,
        title: trimmedTitle || formatChatTitle(chatId),
        lastMessageAt: timestamp ?? Date.now(),
      },
    };

    return { chatsById, chatIds: sortChatIds(chatsById, [...state.chatIds, chatId]) };
  }

  const nextTitle = trimmedTitle || existingChat.title;
  const nextLastMessageAt = Math.max(existingChat.lastMessageAt, timestamp ?? 0);

  if (nextTitle === existingChat.title && nextLastMessageAt === existingChat.lastMessageAt) {
    return null;
  }

  const chatsById = {
    ...state.chatsById,
    [chatId]: { ...existingChat, title: nextTitle, lastMessageAt: nextLastMessageAt },
  };

  return { chatsById, chatIds: sortChatIds(chatsById, state.chatIds) };
};

export const useChatsStore = create<ChatsStore>((set, get) => ({
  ...createEmptyState(),
  selectChat: (chatId) => {
    set({ selectedChatId: chatId });
  },
  ensureChat: (params) => {
    const chatsPatch = upsertChat(get(), params);

    if (chatsPatch) {
      set(chatsPatch);
    }
  },
  addMessage: (message) => {
    const state = get();
    const messages = state.messagesByChatId[message.chatId] ?? [];

    if (messages.some((item) => item.id === message.id)) {
      return;
    }

    set({
      ...upsertChat(state, { chatId: message.chatId, timestamp: message.timestamp }),
      messagesByChatId: {
        ...state.messagesByChatId,
        [message.chatId]: [...messages, message],
      },
    });
  },
  updateMessage: (chatId, messageId, patch) => {
    const state = get();
    const messages = state.messagesByChatId[chatId];

    if (!messages) {
      return;
    }

    // The webhook may deliver an outgoing message before sendMessage resolves;
    // in that case drop the optimistic copy instead of creating a duplicate id.
    const isAlreadyDelivered =
      patch.id !== undefined && patch.id !== messageId && messages.some((message) => message.id === patch.id);

    set({
      messagesByChatId: {
        ...state.messagesByChatId,
        [chatId]: isAlreadyDelivered
          ? messages.filter((message) => message.id !== messageId)
          : messages.map((message) => (message.id === messageId ? { ...message, ...patch } : message)),
      },
    });
  },
  reset: () => {
    set(createEmptyState());
  },
}));
