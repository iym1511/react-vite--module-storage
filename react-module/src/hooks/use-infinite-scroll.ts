import { useEffect } from 'react';
import {type IntersectionOptions, useInView } from 'react-intersection-observer';

interface UseInfiniteScrollOptions extends IntersectionOptions {
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage: () => void;
}

/**
 * react-intersection-observer를 사용한 무한 스크롤 훅
 * @param fetchNextPage 다음 페이지를 가져오는 함수
 * @param options IntersectionObserver 옵션
 */
export function useInfiniteScroll({ fetchNextPage, ...options }: UseInfiniteScrollOptions) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    ...options,
  });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return { ref };
}
