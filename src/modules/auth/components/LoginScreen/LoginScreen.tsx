import type { SubmitEvent } from 'react';
import { useState } from 'react';

import { LoginField } from 'src/modules/auth/components/LoginField';
import type { CredentialsFieldErrors, CredentialsFieldName } from 'src/modules/auth/helpers/getCredentialsFieldErrors';
import {
  getCredentialsFieldError,
  getCredentialsFieldErrors,
  getFirstInvalidFieldName,
} from 'src/modules/auth/helpers/getCredentialsFieldErrors';
import { getInstanceStateError } from 'src/modules/auth/helpers/getInstanceStateError';
import { normalizeCredentials } from 'src/modules/auth/helpers/normalizeCredentials';
import { useAuthStore } from 'src/modules/auth/stores/authStore';
import type { AuthCredentials } from 'src/modules/auth/types/AuthCredentials';
import { getStateInstance } from 'src/modules/common/api/greenApi/greenApi';
import { mapCaughtApiError } from 'src/modules/common/api/greenApi/mapApiError';

import styles from 'src/modules/auth/components/LoginScreen/LoginScreen.module.css';

const INITIAL_VALUES: AuthCredentials = {
  idInstance: '',
  apiTokenInstance: '',
  apiUrl: '',
};

const EMPTY_FIELD_ERRORS: CredentialsFieldErrors = {};

const focusField = (form: HTMLFormElement, fieldName: CredentialsFieldName) => {
  const field = form.elements.namedItem(fieldName);

  if (field instanceof HTMLInputElement) {
    field.focus();
  }
};

export const LoginScreen = () => {
  const setCredentials = useAuthStore((state) => state.setCredentials);

  const [values, setValues] = useState<AuthCredentials>(INITIAL_VALUES);
  const [fieldErrors, setFieldErrors] = useState<CredentialsFieldErrors>(EMPTY_FIELD_ERRORS);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (fieldName: CredentialsFieldName, value: string) => {
    setValues((prev) => ({ ...prev, [fieldName]: value }));
    setFieldErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    setFormError('');
  };

  const handleFieldBlur = (fieldName: CredentialsFieldName) => {
    const value = normalizeCredentials(values)[fieldName];

    // пустое поле подсвечиваем только на сабмите
    if (!value) {
      return;
    }

    setFieldErrors((prev) => ({ ...prev, [fieldName]: getCredentialsFieldError(fieldName, value) }));
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const credentials = normalizeCredentials(values);
    const nextFieldErrors = getCredentialsFieldErrors(credentials);
    const firstInvalidFieldName = getFirstInvalidFieldName(nextFieldErrors);

    if (firstInvalidFieldName) {
      setFieldErrors(nextFieldErrors);
      setFormError('');
      focusField(event.currentTarget, firstInvalidFieldName);
      return;
    }

    setFieldErrors(EMPTY_FIELD_ERRORS);
    setFormError('');
    setIsSubmitting(true);

    try {
      const { stateInstance } = await getStateInstance(credentials);
      const stateError = getInstanceStateError(stateInstance);

      if (stateError) {
        setFormError(stateError);
        return;
      }

      setCredentials(credentials);
    } catch (caughtError) {
      setFormError(mapCaughtApiError(caughtError, 'Не удалось проверить инстанс'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.root}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.header}>
          <h1 className={styles.title}>GREEN-API Chat</h1>
          <p className={styles.hint}>Данные инстанса из кабинета GREEN-API</p>
        </div>

        <LoginField
          label="idInstance"
          name="idInstance"
          inputMode="numeric"
          autoComplete="off"
          placeholder="710722760418"
          disabled={isSubmitting}
          value={values.idInstance}
          error={fieldErrors.idInstance}
          onChange={(event) => handleFieldChange('idInstance', event.target.value)}
          onBlur={() => handleFieldBlur('idInstance')}
        />

        <LoginField
          label="apiTokenInstance"
          name="apiTokenInstance"
          type="password"
          autoComplete="off"
          placeholder="token from cabinet"
          disabled={isSubmitting}
          value={values.apiTokenInstance}
          error={fieldErrors.apiTokenInstance}
          onChange={(event) => handleFieldChange('apiTokenInstance', event.target.value)}
          onBlur={() => handleFieldBlur('apiTokenInstance')}
        />

        <LoginField
          label="apiUrl"
          name="apiUrl"
          autoComplete="off"
          placeholder="https://7107.api.greenapi.com"
          disabled={isSubmitting}
          value={values.apiUrl}
          error={fieldErrors.apiUrl}
          onChange={(event) => handleFieldChange('apiUrl', event.target.value)}
          onBlur={() => handleFieldBlur('apiUrl')}
        />

        {formError ? (
          <p className={styles.formError} role="alert">
            {formError}
          </p>
        ) : null}

        <button className={styles.submit} type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Проверка…' : 'Войти'}
        </button>
      </form>
    </div>
  );
};
