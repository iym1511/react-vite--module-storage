import { createBrowserRouter, Navigate } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';
import ErrorPage from '@/pages/ErrorPage';
import LoginPage from '@/pages/LoginPage';
import MainPage from '@/pages/MainPage';
import DashboardPage from '@/pages/DashboardPage';
import RegisterPage from '@/pages/RegisterPage';
import RouteGuard from './RouteGuard'; // 🛡️ 통합된 가드 컴포넌트
import InfiniteTestPage from '@/pages/InfiniteTestPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      // 🔓 [공개 그룹] - 비인증 사용자 전용
      {
        element: <RouteGuard type="guest" />,
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <RegisterPage /> },
        ],
      },
      // 🔐 [보호 그룹] - 인증 사용자 전용
      {
        element: <RouteGuard type="auth" />,
        children: [
          { index: true, element: <MainPage /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'infinite-test', element: <InfiniteTestPage /> },
        ],
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      }
    ],
  },
]);