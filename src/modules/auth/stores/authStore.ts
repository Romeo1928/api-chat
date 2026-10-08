import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { normalizeCredentials } from 'src/modules/auth/helpers/normalizeCredentials';
import type { AuthCredentials } from 'src/modules/auth/types/AuthCredentials';

type AuthStore = AuthCredentials & {
  setCredentials: (credentials: AuthCredentials) => void;
  logout: () => void;
};

const EMPTY_CREDENTIALS: AuthCredentials = {
  idInstance: '',
  apiTokenInstance: '',
  apiUrl: '',
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...EMPTY_CREDENTIALS,
      setCredentials: (credentials) => {
        set(normalizeCredentials(credentials));
      },
      logout: () => {
        set(EMPTY_CREDENTIALS);
      },
    }),
    {
      name: 'green-api-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        idInstance: state.idInstance,
        apiTokenInstance: state.apiTokenInstance,
        apiUrl: state.apiUrl,
      }),
    },
  ),
);
