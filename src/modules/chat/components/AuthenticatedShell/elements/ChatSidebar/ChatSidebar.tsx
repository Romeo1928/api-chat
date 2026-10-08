import type { SubmitEvent } from 'react';
import { useId, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { checkIsValidPhone, normalizePhoneInput } from 'src/modules/chat/helpers/normalizePhoneInput';
import { toChatId } from 'src/modules/chat/helpers/toChatId';
import { useChatsStore } from 'src/modules/chat/stores/chatsStore';

import styles from 'src/modules/chat/components/AuthenticatedShell/elements/ChatSidebar/ChatSidebar.module.css';

export const ChatSidebar = () => {
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const phoneInputId = useId();
  const phoneErrorId = useId();
  const { chatIds, chatsById, selectedChatId, ensureChat, selectChat } = useChatsStore(
    useShallow((state) => ({
      chatIds: state.chatIds,
      chatsById: state.chatsById,
      selectedChatId: state.selectedChatId,
      ensureChat: state.ensureChat,
      selectChat: state.selectChat,
    })),
  );

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    setPhoneError(null);
  };

  const handleCreateChat = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const digits = normalizePhoneInput(phone);

    if (!checkIsValidPhone(digits)) {
      setPhoneError('Введите номер: 10–15 цифр');
      return;
    }

    const chatId = toChatId(digits);

    ensureChat({ chatId });
    selectChat(chatId);
    setPhone('');
    setPhoneError(null);
  };

  const handleSelectChat = (chatId: string) => {
    selectChat(chatId);
  };

  return (
    <aside className={styles.root}>
      <form className={styles.newChat} onSubmit={handleCreateChat}>
        <label className={styles.label} htmlFor={phoneInputId}>
          Новый чат
        </label>
        <div className={styles.row}>
          <input
            id={phoneInputId}
            className={styles.input}
            type="tel"
            inputMode="tel"
            autoComplete="off"
            placeholder="79001234567"
            value={phone}
            aria-invalid={phoneError ? true : undefined}
            aria-describedby={phoneError ? phoneErrorId : undefined}
            onChange={(event) => handlePhoneChange(event.target.value)}
          />
          <button className={styles.addButton} type="submit" aria-label="Добавить чат">
            <svg className={styles.addIcon} viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" />
            </svg>
          </button>
        </div>
        {phoneError ? (
          <p id={phoneErrorId} className={styles.error}>
            {phoneError}
          </p>
        ) : null}
      </form>

      <div className={styles.list}>
        {chatIds.length === 0 ? (
          <p className={styles.empty}>Добавьте чат по номеру телефона</p>
        ) : (
          chatIds.map((chatId) => {
            const chat = chatsById[chatId];
            const isSelected = chatId === selectedChatId;

            return (
              <button
                key={chatId}
                className={isSelected ? `${styles.chatItem} ${styles.chatItemSelected}` : styles.chatItem}
                type="button"
                aria-current={isSelected ? 'true' : undefined}
                onClick={() => handleSelectChat(chatId)}
              >
                <span className={styles.chatTitle}>{chat.title}</span>
                <span className={styles.chatId}>{chat.chatId}</span>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
};
