import type { AuthCredentials } from 'src/modules/auth/types/AuthCredentials';

export const checkIsAuthenticated = (credentials: AuthCredentials): boolean =>
  Boolean(credentials.idInstance && credentials.apiTokenInstance && credentials.apiUrl);
