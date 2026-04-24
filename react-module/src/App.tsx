import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { checkAuth } from '@/features/auth/utils/checkAuth';
import { router } from '@/routes/router';

function App() {
  useEffect(() => {
    // 💡 앱 진입 시 딱 1번만 세션 체크
    checkAuth();
  }, []);


  // ✅ 초기화가 끝난 후에만 라우터 활성화
  return <RouterProvider router={router} />;
}

export default App;

