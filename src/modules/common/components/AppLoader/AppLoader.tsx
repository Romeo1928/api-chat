import styles from 'src/modules/common/components/AppLoader/AppLoader.module.css';

type AppLoaderProps = {
  label?: string;
};

export const AppLoader = ({ label = 'Загрузка…' }: AppLoaderProps) => (
  <div className={styles.root} role="status" aria-live="polite" aria-busy="true">
    <div className={styles.spinner} aria-hidden="true" />
    <p className={styles.label}>{label}</p>
  </div>
);
