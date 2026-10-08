import type { ComponentProps } from 'react';
import { useId } from 'react';

import styles from 'src/modules/auth/components/LoginField/LoginField.module.css';

type LoginFieldProps = Omit<ComponentProps<'input'>, 'id' | 'className' | 'aria-invalid' | 'aria-describedby'> & {
  label: string;
  error?: string;
};

export const LoginField = ({ label, error, ...inputProps }: LoginFieldProps) => {
  const inputId = useId();
  const errorId = `${inputId}-error`;

  return (
    <div className={styles.root}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <input
        {...inputProps}
        className={styles.input}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      />
      {error ? (
        <p className={styles.error} id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
};
