import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // 💡 개발 도구 임포트
import { queryClient } from '@/lib/query-client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} /> {/* 💡 브라우저 우측 하단에서 확인 가능 */}
    </QueryClientProvider>
  // </StrictMode>
);
