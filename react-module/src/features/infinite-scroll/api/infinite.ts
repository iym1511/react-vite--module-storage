import { api } from '@/api/ky'
import { INFINITE_ERROR_MESSAGES } from '@/lib/constants/error-messages'

export interface InfiniteItem {
    id: number
    title: string
    description: string
}

export interface FetchInfiniteResult {
    data: InfiniteItem[]
    nextCursor: number | undefined
}

export const fetchInfiniteItemsFromApi = async ({
    pageParam = 0,
}: {
    pageParam: number
}): Promise<FetchInfiniteResult> => {
    try {
        const result = await api
            .get('api/infinite/items', {
                searchParams: {
                    cursor: pageParam,
                    limit: 7,
                },
            })
            .json<FetchInfiniteResult>()

        return result
    } catch (error) {
        console.error(`❌ ${INFINITE_ERROR_MESSAGES.FETCH_FAILED}`, error)
        throw error
    }
}
