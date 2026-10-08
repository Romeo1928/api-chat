import type { KeyboardEvent, SubmitEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { getAuthCredentials } from 'src/modules/auth/helpers/getAuthCredentials';
import { MessageBubble } from 'src/modules/chat/components/AuthenticatedShell/elements/ChatThread/units/MessageBubble';
import { MAX_MESSAGE_LENGTH, MESSAGE_DIRECTIONS, MESSAGE_STATUSES } from 'src/modules/chat/constants/chatMessage';
import { useChatsStore } from 'src/modules/chat/stores/chatsStore';
import type { ChatMessage } from 'src/modules/chat/types/ChatMessage';
import { sendMessage } from 'src/modules/common/api/greenApi/greenApi';
import { mapCaughtApiError } from 'src/modules/common/api/greenApi/mapApiError';

import styles from 'src/modules/chat/components/AuthenticatedShell/elements/ChatThread/ChatThread.module.css';

const EMPTY_MESSAGES: ChatMessage[] = [];

export const ChatThread = () => {
  const [draft, setDraft] = useState('');
  const [sendError, setSendError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { selectedChatId, chat, messages, addMessage, updateMessage } = useChatsStore(
    useShallow((state) => {
      const selectedChatId = state.selectedChatId;

      return {
        selectedChatId,
        chat: selectedChatId ? state.chatsById[selectedChatId] : undefined,
        messages: selectedChatId ? (state.messagesByChatId[selectedChatId] ?? EMPTY_MESSAGES) : EMPTY_MESSAGES,
        addMessage: state.addMessage,
        updateMessage: state.updateMessage,
      };
    }),
  );

  const handleDraftChange = (value: string) => {
    setDraft(value);
  };

  const handleComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // isComposing: Enter confirms an IME candidate (CJK input) and must not send the message.
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) {
      return;
    }

    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  };

  const handleSend = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedChatId || !chat) {
      return;
    }

    const text = draft.trim();

    if (!text || isSending) {
      return;
    }

    if (text.length > MAX_MESSAGE_LENGTH) {
      setSendError(`Максимум ${MAX_MESSAGE_LENGTH} символов`);
      return;
    }

    const localId = crypto.randomUUID();
    const timestamp = Date.now();

    addMessage({
      id: localId,
      chatId: selectedChatId,
      text,
      direction: MESSAGE_DIRECTIONS.outgoing,
      timestamp,
      status: MESSAGE_STATUSES.sending,
    });
    setDraft('');
    setSendError(null);
    setIsSending(true);

    try {
      const response = await sendMessage(getAuthCredentials(), {
        chatId: selectedChatId,
        message: text,
      });

      updateMessage(selectedChatId, localId, {
        id: response.idMessage,
        status: MESSAGE_STATUSES.sent,
      });
    } catch (error) {
      updateMessage(selectedChatId, localId, {
        status: MESSAGE_STATUSES.error,
      });
      setSendError(mapCaughtApiError(error, 'Не удалось отправить сообщение'));
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (!selectedChatId || !chat) {
    return (
      <section className={styles.emptyRoot}>
        <p className={styles.emptyText}>Выберите чат или создайте новый</p>
      </section>
    );
  }

  return (
    <section className={styles.root}>
      <header className={styles.header}>
        <h2 className={styles.title}>{chat.title}</h2>
        <p className={styles.meta}>{chat.chatId}</p>
      </header>

      <div className={styles.messages}>
        {messages.length === 0 ? (
          <p className={styles.threadEmpty}>Напишите первое сообщение</p>
        ) : (
          messages.map((message) => <MessageBubble key={message.id} message={message} />)
        )}
        <div ref={bottomRef} />
      </div>

      <form className={styles.composer} onSubmit={handleSend}>
        {sendError ? <p className={styles.sendError}>{sendError}</p> : null}
        <div className={styles.composerRow}>
          <textarea
            className={styles.textarea}
            rows={1}
            aria-label="Сообщение"
            placeholder="Сообщение"
            maxLength={MAX_MESSAGE_LENGTH}
            value={draft}
            onChange={(event) => handleDraftChange(event.target.value)}
            onKeyDown={handleComposerKeyDown}
          />
          <button className={styles.sendButton} type="submit" disabled={!draft.trim() || isSending}>
            Отправить
          </button>
        </div>
      </form>
    </section>
  );
};
