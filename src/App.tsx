import { LoginScreen } from 'src/modules/auth/components/LoginScreen';
import { checkIsAuthenticated } from 'src/modules/auth/helpers/checkIsAuthenticated';
import { useAuthStoreHydration } from 'src/modules/auth/hooks/useAuthStoreHydration';
import { useAuthStore } from 'src/modules/auth/stores/authStore';
import { AuthenticatedShell } from 'src/modules/chat/components/AuthenticatedShell';
import { AppLoader } from 'src/modules/common/components/AppLoader';

export const App = () => {
  const hasHydrated = useAuthStoreHydration();
  const isAuthenticated = useAuthStore(checkIsAuthenticated);

  if (!hasHydrated) {
    return <AppLoader label="Загрузка…" />;
  }

  return isAuthenticated ? <AuthenticatedShell /> : <LoginScreen />;
};
