import { MESSAGE_DIRECTIONS, MESSAGE_STATUSES } from 'src/modules/chat/constants/chatMessage';
import type { ChatMessage } from 'src/modules/chat/types/ChatMessage';

import styles from 'src/modules/chat/components/AuthenticatedShell/elements/ChatThread/units/MessageBubble/MessageBubble.module.css';

type MessageBubbleProps = {
  message: ChatMessage;
};

const formatTime = (timestamp: number): string =>
  new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp);

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isOutgoing = message.direction === MESSAGE_DIRECTIONS.outgoing;
  const rowClassName = isOutgoing ? `${styles.messageRow} ${styles.messageRowOutgoing}` : styles.messageRow;
  const bubbleClassName = isOutgoing ? `${styles.bubble} ${styles.bubbleOutgoing}` : styles.bubble;

  return (
    <div className={rowClassName}>
      <div className={bubbleClassName}>
        <p className={styles.messageText}>{message.text}</p>
        <div className={styles.messageMeta}>
          <span>{formatTime(message.timestamp)}</span>
          {message.status === MESSAGE_STATUSES.sending ? <span>отправка…</span> : null}
          {message.status === MESSAGE_STATUSES.error ? <span className={styles.statusError}>ошибка</span> : null}
        </div>
      </div>
    </div>
  );
};
