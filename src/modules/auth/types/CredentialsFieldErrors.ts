import type { AuthCredentials } from 'src/modules/auth/types/AuthCredentials';

export type CredentialsFieldName = keyof AuthCredentials;

export type CredentialsFieldErrors = Partial<Record<CredentialsFieldName, string>>;
