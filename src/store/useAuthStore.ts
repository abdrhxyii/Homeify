// src/store/useAuthStore.ts
import { create } from 'zustand';
import { parseCookies, destroyCookie } from 'nookies';

interface AuthState {
  isAuthenticated: boolean;
  profileImage?: string;
  checkAuthStatus: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  profileImage: undefined,
  
  checkAuthStatus: () => {
    const cookies = parseCookies();
    const token = cookies.token;
    const profileImage = cookies.profileImage; 

    set({
      isAuthenticated: !!token,
      profileImage: profileImage ?? '/userdefault.jpg',
    });
  },

  logout: () => {
    destroyCookie(null, 'token');
    destroyCookie(null, 'profileImage');
    destroyCookie(null, 'user');
    set({
      isAuthenticated: false,
      profileImage: '/userdefault.jpg',
    });
  },
}));
