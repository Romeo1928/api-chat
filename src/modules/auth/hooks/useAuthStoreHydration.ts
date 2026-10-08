import { useSyncExternalStore } from 'react';

import { useAuthStore } from 'src/modules/auth/stores/authStore';

const subscribe = (onStoreChange: () => void) => useAuthStore.persist.onFinishHydration(onStoreChange);

const getSnapshot = () => useAuthStore.persist.hasHydrated();

const getServerSnapshot = () => false;

export const useAuthStoreHydration = (): boolean => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
