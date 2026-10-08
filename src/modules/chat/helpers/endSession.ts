import { useAuthStore } from 'src/modules/auth/stores/authStore';
import { useChatsStore } from 'src/modules/chat/stores/chatsStore';

export const endSession = () => {
  useChatsStore.getState().reset();
  useAuthStore.getState().logout();
};
