import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  setUser: (user) => set({ user }),
  signIn: async (email, password) => {
    // Mock authentication
    set({
      user: {
        id: '1',
        email,
        fullName: 'Demo User',
      },
    });
  },
  signUp: async (email, password, fullName) => {
    // Mock authentication
    set({
      user: {
        id: '1',
        email,
        fullName,
      },
    });
  },
  signOut: () => set({ user: null }),
}));