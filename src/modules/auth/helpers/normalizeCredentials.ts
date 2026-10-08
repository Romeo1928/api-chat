import type { AuthCredentials } from 'src/modules/auth/types/AuthCredentials';

export const normalizeCredentials = (credentials: AuthCredentials): AuthCredentials => ({
  idInstance: credentials.idInstance.trim(),
  apiTokenInstance: credentials.apiTokenInstance.trim(),
  apiUrl: credentials.apiUrl.trim().replace(/\/+$/, ''),
});
