import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCcw } from 'lucide-react';

/**
 * 📝 InfiniteTestPage (Placeholder)
 * useInfiniteQuery를 활용한 인피니티 스크롤 테스트용 페이지입니다.
 */
export default function InfiniteTestPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-8">
      {/* 헤더 영역 */}
      <div className="mb-8 flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="rounded-full p-2 hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-3xl font-bold tracking-tight text-white">Infinite Scroll Test</h1>
        </div>
        <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
          <RefreshCcw className="h-4 w-4" />
          데이터 리셋
        </button>
      </div>

      {/* 테스트 영역 (로직 구현 예정지) */}
      <div className="rounded-lg border-2 border-dashed border-muted p-12 text-center">
        <p className="text-muted-foreground mb-4">
          여기에 TanStack Query의 <code className="bg-muted px-1 rounded text-primary">useInfiniteQuery</code> 로직이 구현될 예정입니다.
        </p>
        <div className="flex justify-center">
          <div className="h-64 w-full max-w-md bg-muted/20 animate-pulse rounded-md" />
        </div>
      </div>
    </div>
  );
}
