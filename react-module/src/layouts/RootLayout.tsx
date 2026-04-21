import { Outlet, ScrollRestoration } from 'react-router-dom';

/**
 * 💡 모든 페이지의 기본 뼈대가 되는 레이아웃
 * 헤더, 푸터 등을 여기에 추가할 수 있습니다.
 */
export default function RootLayout() {
  return (
    <div className="root-layout">
      {/* 필요 시 공통 헤더/내비게이션 추가 */}
      <main>
        {/* 하위 라우트가 이곳에 렌더링됨 */}
        <Outlet />
      </main>
      
      {/* 페이지 이동 시 스크롤 위치 초기화 */}
      <ScrollRestoration />
    </div>
  );
}
