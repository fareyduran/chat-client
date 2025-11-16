import { defineStore } from 'pinia';
import type { User } from '@/types/user';
import { getOrCreateUser } from '@/services/api/user.api';

interface State {
  user: User | null;
}

export const useUserStore = defineStore('user', {
  state: (): State => ({
    user: null,
  }),
  actions: {
    async login(name: string) {
      const user = await getOrCreateUser(name);
      this.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');
    },
    loadUserFromStorage() {
      const stored = localStorage.getItem('user');
      if (stored) {
        this.user = JSON.parse(stored) as User;
      }
    }
  }
})