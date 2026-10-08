import { useAuthStore } from 'src/modules/auth/stores/authStore';
import type { AuthCredentials } from 'src/modules/auth/types/AuthCredentials';

export const getAuthCredentials = (): AuthCredentials => {
  const { idInstance, apiTokenInstance, apiUrl } = useAuthStore.getState();

  return {
    idInstance,
    apiTokenInstance,
    apiUrl,
  };
};
