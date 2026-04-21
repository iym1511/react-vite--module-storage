import { create } from 'zustand';

interface User {
  id?: string;
  email: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isInitializing: boolean; // 💡 초기값 true (라우터 로더 및 가드에서 화면 보호용)
  accessToken: string | null;
  user: User | null;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  setInitializing: (isInitializing: boolean) => void;
  setAccessToken: (token: string | null) => void;
}

/**
 * 💡 새로고침 시에도 쿠키 기반 자동 로그인이 보장되도록
 * 로직을 단순화하고 초기화 상태 관리에 집중합니다.
 */
export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isInitializing: true, // 👈 앱 초기 진입 시 항상 true로 시작합니다.
  accessToken: null,
  user: null,
  
  login: (user, accessToken) => 
    set({ 
      isAuthenticated: true, 
      user, 
      accessToken, 
      isInitializing: false // 💡 로그인 성공 시 초기화 종료
    }),
    
  logout: () => 
    set({ 
      isAuthenticated: false, 
      user: null, 
      accessToken: null, 
      isInitializing: false // 💡 로그아웃 확정 시 초기화 종료
    }),
    
  setInitializing: (isInitializing) => set({ isInitializing }),
  setAccessToken: (accessToken) => set({ accessToken }),
}));
