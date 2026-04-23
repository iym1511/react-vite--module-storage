import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useInfiniteQuery } from '@tanstack/react-query'
import { ArrowLeft, RefreshCcw, Loader2 } from 'lucide-react'
import { fetchInfiniteItemsFromApi } from '@/fetchData/fetch-infinite'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'

/**
 * 📝 InfiniteTestPage
 * useInfiniteQuery를 활용한 인피니티 스크롤 테스트용 페이지입니다.
 */
export default function InfiniteTestPage() {
    const navigate = useNavigate()

    // TanStack Query 라이브러리가 메모리(캐시) 상의 pages 배열을 통해 자동으로 관리 ⭐
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError, refetch } = useInfiniteQuery({
        queryKey: ['infinite-items'],
        initialPageParam: 0,
        queryFn: ({ pageParam }: { pageParam: number }) => fetchInfiniteItemsFromApi({ pageParam }),
        getNextPageParam: ({ nextCursor }) => nextCursor ?? undefined, // null/undefined만 체크
    })

    const { ref: loadMoreRef } = useInfiniteScroll({
        fetchNextPage,
    })

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            {/* 헤더 영역 */}
            <div className="mb-8 flex items-center justify-between border-b border-slate-700 pb-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="rounded-full p-2 hover:bg-slate-800 transition-colors text-slate-300"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Infinite Scroll Test</h1>
                </div>
                <button
                    onClick={() => refetch()}
                    className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
                >
                    <RefreshCcw className="h-4 w-4" />
                    데이터 리프레시
                </button>
            </div>

            {/* 리스트 영역 */}
            <div className="space-y-4">
                {isPending ? ( // 💡 status === 'pending' 대신 사용
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                        <p className="text-slate-400">데이터를 불러오는 중입니다...</p>
                    </div>
                ) : isError ? ( // 💡 status === 'error' 대신 사용
                    <div className="rounded-lg border border-red-900 bg-red-900/20 p-8 text-center">
                        <p className="text-red-400 font-medium">데이터 로딩 중 오류가 발생했습니다.</p>
                        <button
                            onClick={() => refetch()}
                            className="mt-4 text-sm text-red-400 underline hover:text-red-300"
                        >
                            다시 시도하기
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4">
                            {data?.pages.map((page, i) => (
                                <React.Fragment key={i}>
                                    {page.data.map((item) => (
                                        <div
                                            key={item.id}
                                            className="group rounded-xl border border-slate-800 bg-slate-900 p-6 transition-all hover:border-slate-700 hover:bg-slate-800/50"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                                                        {item.title}
                                                    </h3>
                                                    <p className="mt-2 text-slate-400 leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                </div>
                                                <span className="text-xs font-mono text-slate-600 bg-slate-950 px-2 py-1 rounded">
                                                    ID: {item.id}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* 하단 관찰 영역 */}
                        <div ref={hasNextPage ? loadMoreRef : undefined} className="mt-8 flex justify-center py-8">
                            {isFetchingNextPage ? (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="relative">
                                        <div className="h-10 w-10 rounded-full border-2 border-slate-800"></div>
                                        <div className="absolute top-0 h-10 w-10 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                                    </div>
                                    <p className="text-sm font-medium text-blue-400">다음 페이지 로딩 중...</p>
                                </div>
                            ) : hasNextPage ? (
                                <div className="h-1 bg-slate-800 w-32 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500/20 w-full animate-pulse"></div>
                                </div>
                            ) : (
                                <div className="rounded-full bg-slate-800/50 px-6 py-2 border border-slate-700/50">
                                    <p className="text-sm text-slate-400 font-medium">✨ 모든 데이터를 확인했습니다</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
