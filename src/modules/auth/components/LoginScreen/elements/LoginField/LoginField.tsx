import type { ChangeEvent, FocusEvent } from 'react';
import { useId, useState } from 'react';

import styles from 'src/modules/auth/components/LoginScreen/elements/LoginField/LoginField.module.css';

type LoginFieldProps = {
  label: string;
  name: string;
  value: string;
  error?: string;
  type?: 'text' | 'password';
  inputMode?: 'text' | 'numeric' | 'tel' | 'email' | 'url';
  autoComplete?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
};

export const LoginField = ({
  label,
  name,
  value,
  error,
  type = 'text',
  inputMode,
  autoComplete,
  placeholder,
  disabled,
  onChange,
  onBlur,
}: LoginFieldProps) => {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = type === 'password';
  const inputType = isPasswordField && isPasswordVisible ? 'text' : type;

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className={styles.root}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <div className={styles.inputWrap}>
        <input
          className={isPasswordField ? styles.inputWithToggle : styles.input}
          id={inputId}
          name={name}
          type={inputType}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={onChange}
          onBlur={onBlur}
        />
        {isPasswordField ? (
          <button
            className={styles.toggle}
            type="button"
            disabled={disabled}
            aria-label={isPasswordVisible ? 'Скрыть токен' : 'Показать токен'}
            aria-pressed={isPasswordVisible}
            onClick={handleTogglePasswordVisibility}
          >
            {isPasswordVisible ? (
              <svg className={styles.toggleIcon} viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M2.1 3.51 3.51 2.1l18.38 18.39-1.41 1.41-3.27-3.27A11.8 11.8 0 0 1 12 19.5C7.24 19.5 3.27 16.38 2 12c.55-1.9 1.6-3.57 2.97-4.86L2.1 3.51ZM12 7.5c.7 0 1.37.12 2 .34l-1.56 1.56A2.99 2.99 0 0 0 9.6 12.28L8.04 13.84A4.5 4.5 0 0 1 12 7.5Zm0-3c4.76 0 8.73 3.12 10 7.5-.46 1.6-1.3 3.03-2.42 4.2l-1.45-1.45A8.9 8.9 0 0 0 19.8 12C18.55 8.7 15.52 6.5 12 6.5c-.8 0-1.58.1-2.32.3L8.1 5.22A11.7 11.7 0 0 1 12 4.5Z"
                />
              </svg>
            ) : (
              <svg className={styles.toggleIcon} viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 4.5c4.76 0 8.73 3.12 10 7.5-1.27 4.38-5.24 7.5-10 7.5S3.27 16.38 2 12c1.27-4.38 5.24-7.5 10-7.5Zm0 2C8.48 6.5 5.45 8.7 4.2 12c1.25 3.3 4.28 5.5 7.8 5.5s6.55-2.2 7.8-5.5C18.55 8.7 15.52 6.5 12 6.5Zm0 2a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z"
                />
              </svg>
            )}
          </button>
        ) : null}
      </div>
      {error ? (
        <p className={styles.error} id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
};
