import { createQueryKeyStore } from '@lukemorales/query-key-factory';

/**
 * 프로젝트 전체의 React Query 키와 페칭 함수(queryFn)를 중앙에서 관리하는 팩토리 객체.
 */
export const queryKeys = createQueryKeyStore({
    // 홈 화면(Demo) 도메인 - 인피니티 스크롤, 페이지네이션 등
    home: {
        infinite: null,
        paginated: (page: number) => [page],
    },
});
