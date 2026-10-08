import { LoginScreen } from 'src/modules/auth/components/LoginScreen';
import { checkIsAuthenticated } from 'src/modules/auth/helpers/checkIsAuthenticated';
import { useAuthStoreHydration } from 'src/modules/auth/hooks/useAuthStoreHydration';
import { useAuthStore } from 'src/modules/auth/stores/authStore';
import { AuthenticatedShell } from 'src/modules/chat/components/AuthenticatedShell';

export const App = () => {
  const hasHydrated = useAuthStoreHydration();
  const isAuthenticated = useAuthStore(checkIsAuthenticated);

  if (!hasHydrated) {
    return null;
  }

  return isAuthenticated ? <AuthenticatedShell /> : <LoginScreen />;
};
