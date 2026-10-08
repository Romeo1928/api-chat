import { useShallow } from 'zustand/react/shallow';

import { useAuthStore } from 'src/modules/auth/stores/authStore';

import styles from 'src/modules/chat/components/AuthenticatedShell/AuthenticatedShell.module.css';

export const AuthenticatedShell = () => {
  const { idInstance, logout } = useAuthStore(
    useShallow((state) => ({
      idInstance: state.idInstance,
      logout: state.logout,
    })),
  );

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>GREEN-API Chat</h1>
          <p className={styles.meta}>Instance {idInstance}</p>
        </div>
        <button className={styles.logout} type="button" onClick={logout}>
          Выйти
        </button>
      </header>
      <main className={styles.main}>
        <p className={styles.placeholder}>Следующий шаг: список чатов и отправка сообщений</p>
      </main>
    </div>
  );
};
