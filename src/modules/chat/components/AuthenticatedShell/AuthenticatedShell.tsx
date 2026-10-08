import { useAuthStore } from 'src/modules/auth/stores/authStore';
import { ChatSidebar } from 'src/modules/chat/components/AuthenticatedShell/elements/ChatSidebar';
import { ChatThread } from 'src/modules/chat/components/AuthenticatedShell/elements/ChatThread';
import { endSession } from 'src/modules/chat/helpers/endSession';
import { useNotificationsPoll } from 'src/modules/chat/hooks/useNotificationsPoll';
import { useChatsStore } from 'src/modules/chat/stores/chatsStore';

import styles from 'src/modules/chat/components/AuthenticatedShell/AuthenticatedShell.module.css';

export const AuthenticatedShell = () => {
  const idInstance = useAuthStore((state) => state.idInstance);
  const selectedChatId = useChatsStore((state) => state.selectedChatId);

  useNotificationsPoll();

  const handleLogout = () => {
    endSession();
  };

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>GREEN-API Chat</h1>
          <p className={styles.meta}>Instance {idInstance}</p>
        </div>
        <button className={styles.logout} type="button" onClick={handleLogout}>
          Выйти
        </button>
      </header>
      <main className={styles.main}>
        <div className={styles.sidebar}>
          <ChatSidebar />
        </div>
        <div className={styles.thread}>
          <ChatThread key={selectedChatId ?? 'empty'} />
        </div>
      </main>
    </div>
  );
};
