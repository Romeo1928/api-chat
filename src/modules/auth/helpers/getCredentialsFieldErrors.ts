import type { AuthCredentials } from 'src/modules/auth/types/AuthCredentials';

const ID_INSTANCE_PATTERN = /^\d+$/;
const REQUIRED_FIELD_ERROR = 'Обязательное поле';

export type CredentialsFieldName = keyof AuthCredentials;

export type CredentialsFieldErrors = Partial<Record<CredentialsFieldName, string>>;

const CREDENTIALS_FIELD_NAMES = ['idInstance', 'apiTokenInstance', 'apiUrl'] as const;

const getIdInstanceError = (idInstance: string): string | undefined => {
  if (!idInstance) {
    return REQUIRED_FIELD_ERROR;
  }

  if (!ID_INSTANCE_PATTERN.test(idInstance)) {
    return 'Только цифры';
  }

  return undefined;
};

const getApiTokenInstanceError = (apiTokenInstance: string): string | undefined =>
  apiTokenInstance ? undefined : REQUIRED_FIELD_ERROR;

const getApiUrlError = (apiUrl: string): string | undefined => {
  if (!apiUrl) {
    return REQUIRED_FIELD_ERROR;
  }

  const url = URL.parse(apiUrl);

  if (!url) {
    return 'Некорректный apiUrl';
  }

  if (url.protocol !== 'https:') {
    return 'Должен начинаться с https://';
  }

  return undefined;
};

const FIELD_VALIDATORS = {
  idInstance: getIdInstanceError,
  apiTokenInstance: getApiTokenInstanceError,
  apiUrl: getApiUrlError,
} as const;

/** Expects already normalized value. */
export const getCredentialsFieldError = (fieldName: CredentialsFieldName, value: string): string | undefined =>
  FIELD_VALIDATORS[fieldName](value);

/** Expects already normalized credentials. */
export const getCredentialsFieldErrors = (credentials: AuthCredentials): CredentialsFieldErrors => ({
  idInstance: getIdInstanceError(credentials.idInstance),
  apiTokenInstance: getApiTokenInstanceError(credentials.apiTokenInstance),
  apiUrl: getApiUrlError(credentials.apiUrl),
});

export const getFirstInvalidFieldName = (fieldErrors: CredentialsFieldErrors): CredentialsFieldName | undefined =>
  CREDENTIALS_FIELD_NAMES.find((fieldName) => fieldErrors[fieldName]);
