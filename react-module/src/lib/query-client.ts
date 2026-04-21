import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 인증 확인 등은 실패 시 바로 에러 처리하도록 retry를 0으로 설정
      retry: 0,
      staleTime: 1000 * 60 * 5, // 5분
    },
  },
});
