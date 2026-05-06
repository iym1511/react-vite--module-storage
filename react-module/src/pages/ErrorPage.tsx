import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  let errorMessage = '예상치 못한 에러가 발생했습니다.';

  if (isRouteErrorResponse(error)) {
    // 404, 401 등 HTTP 에러 응답 처리
    errorMessage = `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    // 일반적인 JS 에러 처리
    errorMessage = error.message;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-12 text-center">
      <h1 className="mb-4 text-4xl font-bold">Oops!</h1>
      <p className="mb-2 text-notion-slate">죄송합니다. 요청하신 작업을 처리하는 중 문제가 발생했습니다.</p>
      <p className="mb-8 italic text-notion-steel">
        {errorMessage}
      </p>
      <Link to="/" className="text-notion-link-blue hover:text-notion-link-blue-pressed font-medium underline transition-colors">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
