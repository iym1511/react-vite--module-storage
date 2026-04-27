import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { ArrowLeft, RefreshCcw, Loader2, User as UserIcon } from 'lucide-react'
import { fetchInfiniteItemsFromApi } from '@/features/infinite-scroll/api/infinite'
import { useInfiniteScroll } from '@/features/infinite-scroll/hooks/use-infinite-scroll'
import { authService } from '@/features/auth/api/auth'

/**
 * 📝 InfiniteTestPage
 * useInfiniteQuery를 활용한 인피니티 스크롤 테스트용 페이지입니다.
 */
export default function InfiniteTestPage() {
    const navigate = useNavigate()

    // 💡 현재 로그인한 사용자 정보 조회 (실무 패턴: me API 호출)
    const { data: userData, isLoading: isUserLoading } = useQuery({
        queryKey: ['me'],
        queryFn: authService.me,
        // retry: false, // 인증 실패 시 반복 시도 금지
    })

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError, refetch } = useInfiniteQuery({
        queryKey: ['infinite-items'],
        initialPageParam: 0,
        queryFn: ({ pageParam }: { pageParam: number }) => fetchInfiniteItemsFromApi({ pageParam }),
        getNextPageParam: ({ nextCursor }) => nextCursor ?? undefined,
    })

    const { ref: loadMoreRef } = useInfiniteScroll({
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    })

    return (
        <div className="container mx-auto p-8 max-w-4xl bg-background text-foreground min-h-screen">
            {/* 사용자 정보 표시 (상단 추가) */}
            {userData?.user && (
                <div className="mb-6 flex items-center gap-3 rounded-2xl bg-accent/50 p-4 border border-border shadow-sm">
                    <div className="rounded-full bg-primary/10 p-2">
                        <UserIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-foreground">{userData.user.name} 님, 안녕하세요!</p>
                        <p className="text-xs text-muted-foreground">{userData.user.email}</p>
                    </div>
                </div>
            )}

            {/* 헤더 영역 */}
            <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="rounded-full p-2 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Infinite Scroll Test</h1>
                </div>
                <button
                    onClick={() => refetch()}
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                    <RefreshCcw className="h-4 w-4" />
                    데이터 리프레시
                </button>
            </div>

            {/* 리스트 영역 */}
            <div className="space-y-4">
                {isPending ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-muted-foreground">데이터를 불러오는 중입니다...</p>
                    </div>
                ) : isError ? (
                    <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-8 text-center">
                        <p className="text-destructive font-medium">데이터 로딩 중 오류가 발생했습니다.</p>
                        <button
                            onClick={() => refetch()}
                            className="mt-4 text-sm text-destructive underline hover:opacity-80"
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
                                            className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                                                        {item.title}
                                                    </h3>
                                                    <p className="mt-2 text-muted-foreground leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                </div>
                                                <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded-md border border-border">
                                                    ID: {item.id}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* 하단 관찰 영역 */}
                        <div ref={loadMoreRef} className="mt-8 flex justify-center py-8">
                            {isFetchingNextPage ? (
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    <p className="text-sm font-medium text-primary">다음 페이지 로딩 중...</p>
                                </div>
                            ) : !hasNextPage && (
                                <div className="rounded-full bg-muted/50 px-6 py-2 border border-border">
                                    <p className="text-sm text-muted-foreground font-medium">
                                        ✨ 모든 데이터를 확인했습니다
                                    </p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
