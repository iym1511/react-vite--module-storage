# Vite + React 19 SPA 프론트엔드 아키텍처 가이드

## 🛠️ 기술 스택

- **프레임워크:** Vite + React 19
- **컴파일러:** React Compiler (자동 메모이제이션 적용)
- **언어:** TypeScript
- **스타일링:** Tailwind CSS 4
- **통신:** ky (HTTP 클라이언트)
- **상태 관리:** Zustand (UI/Auth), TanStack Query v5 (Server State)
- **라우팅:** React Router 7 (RouteGuard 기반)

---

## 📦 라이브러리 구성 (Dependencies)

### 1. 코어 및 상태 관리

- **@tanstack/react-query (v5):** 비동기 서버 상태 관리 및 캐싱.
- **zustand:** 가볍고 직관적인 클라이언트 전역 상태 관리 (인증 토큰 저장).
- **ky:** fetch 기반의 모던 HTTP 클라이언트 (인터셉터 기능 활용).

### 2. 폼 및 유효성 검사

- **react-hook-form:** 비제어 컴포넌트 기반의 고성능 폼 핸들링.
- **zod:** 스키마 기반의 타입 안전한 데이터 유효성 검사.
- **@hookform/resolvers:** react-hook-form과 zod를 연결하는 어댑터.

### 3. 스타일링 및 UI

- **tailwindcss (v4):** 최신 유틸리티 퍼스트 CSS 프레임워크.
- **lucide-react:** 일관된 디자인의 고품질 아이콘 라이브러리.
- **clsx & tailwind-merge:** 조건부 클래스 결합 및 Tailwind 클래스 충돌 방지.
- **@radix-ui/react-slot:** shadcn/ui 패턴(`asChild`) 구현을 위한 기본 프리미티브.
- **next-themes:** 다크 모드 및 테마 전환 관리.

### 4. 기타 유틸리티

- **react-intersection-observer:** 무한 스크롤 구현을 위한 요소 가시성 감지.
- **@lukemorales/query-key-factory:** TanStack Query의 쿼리 키를 체계적으로 관리.

---

## 🚦 라우팅 및 인증 리다이렉트 로직 (Routing & Redirection)

### 1. 전역 인증 초기화 (App.tsx & checkAuth)
- 앱 진입 시 `checkAuth` 함수를 딱 한 번 실행하여 HttpOnly 쿠키를 통한 세션 복구를 시도합니다.
- 초기화 중에는 라우터 진입을 막거나 로딩 상태를 유지하여 잘못된 리다이렉트를 방지합니다.

```ts
// src/features/auth/utils/checkAuth.ts
export const checkAuth = async () => {
  const { login, logout, setInitializing } = useAuthStore.getState();
  try {
    const response = await authApi.post('api/auth/refresh').json<{ accessToken: string; user: User }>();
    login(response.user, response.accessToken);
  } catch {
    logout();
  } finally {
    setInitializing(false); // 초기화 완료 플래그 해제 (가장 중요)
  }
};
```

### 2. 선제적 가드 컴포넌트 (RouteGuard)
- `isAuthenticated`와 `isInitializing` 상태를 구독하여 권한에 맞지 않는 접근을 즉시 차단합니다.
- **auth 타입:** 인증 사용자만 접근 가능 (비인증 시 `/login` 이동).
- **guest 타입:** 비인증 사용자 전용 (인증 시 `/` 이동).

```tsx
// src/routes/RouteGuard.tsx
export default function RouteGuard({ type }: { type: 'auth' | 'guest' }) {
  const { isAuthenticated, isInitializing } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitializing) {
      if (type === 'auth' && !isAuthenticated) navigate('/login', { replace: true });
      if (type === 'guest' && isAuthenticated) navigate('/', { replace: true });
    }
  }, [isAuthenticated, isInitializing, type, navigate]);

  if (isInitializing) return <LoadingSpinner />;
  
  // 찰나의 순간에 잘못된 UI 노출 방지
  if (type === 'auth' && !isAuthenticated) return null;
  if (type === 'guest' && isAuthenticated) return null;

  return <Outlet />;
}
```

### 3. 선언적 라우터 설정 (router.tsx)
- 그룹화된 라우트 전체를 `RouteGuard`로 감싸서 계층적으로 권한을 관리합니다.

```tsx
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        element: <RouteGuard type="guest" />, // 비인증 그룹
        children: [{ path: 'login', element: <LoginPage /> }],
      },
      {
        element: <RouteGuard type="auth" />, // 인증 그룹
        children: [{ index: true, element: <MainPage /> }],
      }
    ],
  },
]);
```

---

## 🛠️ 라이브러리 활용 패턴 (Implementation Guide)

### 1. HTTP 통신 (ky Interceptor)

- **헤더 주입:** `beforeRequest`에서 Zustand 스토어의 `accessToken`을 가져와 `Authorization` 헤더에 삽입.
- **자동 리프레시:** `afterResponse`에서 401 발생 시 `refreshPromise`를 이용해 중복 요청을 방지하며 토큰 갱신.

### 2. 서버 상태 관리 (TanStack Query v5)

- **구조 분해 패턴:** `const { mutate, isPending } = useMutation({...})` 처럼 결과값을 직접 분해하여 가독성 확보.
- **키 관리:** `query-key-factory`를 사용하여 도메인별 쿼리 키를 중앙에서 관리.
- **무한 스크롤:** `initialPageParam: 0`과 `getNextPageParam`을 이용한 커서 기반 페이징 처리.

---

## 🔐 인증 및 API 아키텍처 (JWT SPA)

### 1. 토큰 관리 전략

- **Access Token:** 보안을 위해 Zustand 메모리에만 유지.
- **Refresh Token:** HttpOnly 쿠키로 관리 (백엔드 설정).
- **자동 갱신:** 401 에러 감지 시 `ky` 인터셉터가 자동으로 `/refresh`를 호출하여 세션 복구.

### 2. `ky` 인터셉터 (중복 리프레시 방지)

여러 개의 API가 동시에 401을 발생시킬 때, 단 한 번의 리프레시 요청만 보내도록 `refreshPromise`를 활용합니다.

```ts
// src/api/ky.ts
let refreshPromise: Promise<string> | null = null;

export const api = ky.create({
  prefix: "/ptc/",
  credentials: "include",
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      async ({ request, options, response }) => {
        if (response.status === 401 && !options?.context?.retryAfterRefresh) {
          const { setAccessToken, logout } = useAuthStore.getState();
          try {
            if (!refreshPromise) {
              refreshPromise = (async () => {
                const res = await authApi
                  .post("api/auth/refresh")
                  .json<{ accessToken: string }>();
                return res.accessToken;
              })();
            }
            const newAccessToken = await refreshPromise;
            setAccessToken(newAccessToken);

            // 원래 요청 재시도
            const clonedRequest = request.clone();
            clonedRequest.headers.set(
              "Authorization",
              `Bearer ${newAccessToken}`,
            );
            return api(clonedRequest, {
              ...options,
              context: { ...options?.context, retryAfterRefresh: true },
            });
          } catch (error) {
            logout();
            throw error;
          } finally {
            refreshPromise = null;
          }
        }
        return response;
      },
    ],
  },
});
```

---

## 🔄 데이터 페칭 패턴

### 1. TanStack Query (객체 구조 분해)

`useMutation` 사용 시 변수에 담는 대신 직접 구조 분해하여 사용합니다.

```tsx
const { mutate: loginMutate, isPending } = useMutation({
  mutationFn: authService.login,
  onSuccess: (data) => {
    /* ... */
  },
});
```

### 2. 무한 스크롤 (Infinite Scroll)

`useInfiniteQuery`와 `react-intersection-observer`를 조합하여 구현합니다.

```tsx
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  useInfiniteQuery({
    queryKey: ["items"],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => fetchItems({ pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

const { ref } = useInfiniteScroll({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
});

return (
  <div>
    {data.pages.map((page) =>
      page.data.map((item) => <Item key={item.id} {...item} />),
    )}
    <div ref={ref} />
  </div>
);
```

---

## 🎨 스타일링 및 테마 시스템 (Styling & Theme System)

### 1. 중앙 집중식 테마 관리 (index.css)
- 모든 브랜드 색상과 시맨틱 색상은 `src/index.css`의 `:root`와 `.dark` 섹션에서 CSS 변수로 관리합니다.
- 하드코딩된 색상값 대신 이 변수들을 참조하여 다크 모드와 테마 변경에 유연하게 대응합니다.

### 2. Tailwind CSS 4 테마 매핑
- `@theme` 블록에서 CSS 변수를 Tailwind 유틸리티(`notion-primary`, `notion-orange`, `destructive` 등)로 매핑하여 사용합니다.

```css
/* src/index.css */
:root {
  --notion-primary: #5645d4;
  --destructive: #e03131;
  /* ... */
}

@theme {
  --color-notion-primary: var(--notion-primary);
  --color-destructive: var(--destructive);
}
```

### 3. 컴포넌트 내 사용 원칙
- **하드코딩 금지:** 컴포넌트 내부에서 `#ffffff`나 `bg-red-500`과 같은 직접적인 색상 지정을 지양합니다.
- **테마 유틸리티 사용:** 반드시 `bg-background`, `text-foreground`, `text-notion-primary`, `bg-destructive` 등 테마에 정의된 유틸리티를 사용합니다.
- **상수화된 색상:** 특정 도메인에서 반복되는 색상은 CSS 변수화 후 테마에 등록하여 사용합니다.

---

## 🎨 UI 컴포넌트 패턴 (Custom Shadcn)

### 1. 원칙

- `src/components/ui`에 직접 구현하여 소유권 확보.
- `cn` 유틸리티(`clsx` + `tailwind-merge`) 필수 사용.
- `Button`, `Input`, `Card` 등 핵심 UI 요소 표준화.

### 2. Button 컴포넌트 (Shadcn 스타일)

```tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default:
        "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20",
      ghost: "hover:bg-accent hover:text-accent-foreground",
    };
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-xl transition-all active:scale-[0.98]",
          variants[variant],
          sizes[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
```

---

## 🚨 에러 핸들링 (상수화)

- **에러 메시지 중앙화:** `src/lib/constants/error-messages.ts`에서 도메인별로 관리합니다.

```ts
export const AUTH_ERROR_MESSAGES = {
  LOGIN_FAILED: "로그인에 실패했습니다. 정보를 다시 확인해주세요.",
} as const;

export const INFINITE_ERROR_MESSAGES = {
  FETCH_FAILED: "목록을 가져오지 못했습니다. 다시 시도해 주세요.",
} as const;
```

---

## 📂 폴더 구조 (Feature-based)

```
src/
├── api/             # ky 인스턴스, QueryClient
├── components/
│   ├── ui/          # 커스텀 UI (Button, Input, Card)
│   └── providers/   # Theme, Query providers
├── features/        # 도메인별 로직 (auth, infinite-scroll)
│   ├── api/         # 서비스 함수
│   ├── store/       # Zustand 스토어
│   └── schemas/     # Zod 스키마
├── pages/           # 페이지 컴포넌트
├── routes/          # 라우팅 설정 (RouteGuard)
└── utils/           # cn 유틸리티
```
