import { api } from '@/lib/ky';

export interface InfiniteItem {
    id: number;
    title: string;
    description: string;
}

export interface FetchInfiniteResult {
    data: InfiniteItem[];
    nextCursor: number | undefined;
}

export const fetchInfiniteItemsFromApi = async ({
    pageParam = 0,
}: {
    pageParam: number;
}): Promise<FetchInfiniteResult> => {
    try {
        const result = await api
            .get('api/infinite/items', {
                searchParams: {
                    cursor: pageParam,
                    limit: 5,
                },
            })
            .json<FetchInfiniteResult>();

        return result;
    } catch (error) {
        console.error('❌ Infinite API 요청 실패:', error);
        throw error;
    }
};
