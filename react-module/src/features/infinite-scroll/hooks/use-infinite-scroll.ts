import { useEffect } from 'react'
import { type IntersectionOptions, useInView } from 'react-intersection-observer'

interface UseInfiniteScrollOptions extends IntersectionOptions {
    hasNextPage?: boolean
    isFetchingNextPage?: boolean
    fetchNextPage: () => void
}

/**
 * 🚀 최적화된 무한 스크롤 훅
 * @param hasNextPage 다음 페이지 존재 여부
 * @param isFetchingNextPage 현재 로딩 중 여부
 * @param fetchNextPage 다음 페이지를 가져오는 함수
 */
export function useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    ...options
}: UseInfiniteScrollOptions) {
    const { ref, inView } = useInView({
        threshold: 0.5, // 50% 보이는 순간 다음 페이지 fetch
        // 💡 더 이상 데이터가 없으면 관찰(Observation) 자체를 하지 않음
        skip: !hasNextPage,
        ...options,
    })

    useEffect(() => {
        // 💡 화면에 보이고 + 다음 데이터가 있고 + 현재 로딩 중이 아닐 때만 실행
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

    return { ref }
}
