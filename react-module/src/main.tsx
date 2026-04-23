import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // 💡 개발 도구 임포트
import { queryClient } from '@/lib/query-client';
import { ThemeProvider } from '@/lib/theme-provider';
import App from './App';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} /> {/* 💡 브라우저 우측 하단에서 확인 가능 */}
    </QueryClientProvider>
  </ThemeProvider>
  // </StrictMode>
);
