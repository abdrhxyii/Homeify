import { create } from 'zustand';
import { parseCookies, destroyCookie } from 'nookies';

interface AuthState {
  isAuthenticated: boolean;
  role?: string;
  currentLoggedInUserId?: string | null,
  checkAuthStatus: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  role: undefined,
  currentLoggedInUserId: null,
  
  checkAuthStatus: () => {
    const cookies = parseCookies();
    const token = cookies.token;
    const user = cookies.user ? JSON.parse(cookies.user) : null;
    set({
      isAuthenticated: !!token,
      role: user?.role,
      currentLoggedInUserId: user?.id || user?._id,
    });
  },

  logout: () => {
    destroyCookie(null, 'token');
    destroyCookie(null, 'user');
    set({
      isAuthenticated: false,
      role: undefined,
    });
  },
}));
