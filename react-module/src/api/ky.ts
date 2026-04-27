import ky from 'ky'
import { useAuthStore } from '@/features/auth/store/useAuthStore'

/**
 * 🔥 cache: 'no-store'
 *
 * React (Vite) 환경에서는 fetch 요청이 브라우저에서 직접 나가기 때문에
 * 기본적으로 HTTP 캐시(ETag, 304 Not Modified)가 자동으로 동작한다.
 *
 * 이 상태에서 인피니티 스크롤 / 페이지네이션을 구현하면
 * 브라우저가 이전 응답을 재사용하면서 304 응답이 발생하고,
 * 실제로는 새로운 데이터를 못 받아오는 문제가 생길 수 있다.
 *
 * 따라서 브라우저 캐시를 완전히 비활성화하고
 * 항상 서버로부터 fresh 데이터를 받도록 강제한다.
 *
 * 👉 Next.js(Server Fetch)에서는 프레임워크가 캐시를 제어해주지만,
 *    React(Client Fetch)에서는 반드시 수동으로 설정해야 한다.
 *
 * 👉 데이터 캐싱은 React Query(useQuery, useInfiniteQuery)로 따로 관리하는게 정석
 */

/**
 * 🔄 중복 리프레시 방지를 위한 변수
 */
let refreshPromise: Promise<string> | null = null

/**
 * 🔓 authApi: 로그인, 회원가입 등 '비인증' 혹은 '인증 관리' 자체를 위한 인스턴스
 */
export const authApi = ky.create({
    prefix: '/ptc/',
    credentials: 'include',
    retry: 0,
    cache: 'no-store',
})

/**
 * 🔐 api: 일반적인 데이터 요청을 위한 '인증 기반' 인스턴스
 */
export const api = ky.create({
    prefix: '/ptc/',
    credentials: 'include',
    retry: 0,
    cache: 'no-store',
    hooks: {
        beforeRequest: [
            ({ request }) => {
                const { accessToken } = useAuthStore.getState()
                if (accessToken) {
                    // 📝 일반 데이터 api 요청 시 액세스토큰 검증이 필요하기 때문에 헤더에 삽입.
                    request.headers.set('Authorization', `Bearer ${accessToken}`)
                }
            },
        ],
        afterResponse: [
            async ({ request, options, response }) => {
                if (response && response.status === 401 && !options?.context?.retryAfterRefresh) {
                    const { setAccessToken, logout } = useAuthStore.getState()

                    try {
                        // 1️⃣ 이미 리프레시가 진행 중이라면, 새로운 요청을 보내지 않고 기존 Promise가 끝나길 기다림
                        if (!refreshPromise) {
                            console.log('[Auth] 첫 번째 401 감지, 리프레시 시작...')
                            refreshPromise = (async () => {
                                try {
                                    const res = await authApi.post('api/auth/refresh').json<{ accessToken: string }>()
                                    return res.accessToken
                                } finally {
                                    refreshPromise = null
                                }
                            })()
                        } else {
                            console.log('[Auth] 리프레시 진행 중, 대기열 합류...')
                        }

                        // 2️⃣ 리프레시 결과 대기 (새로운 토큰을 받음)
                        const newAccessToken = await refreshPromise

                        // 3️⃣ 새 토큰 저장 및 원래 요청 재시도
                        setAccessToken(newAccessToken)

                        // request.clone() 후 재시도 → body 포함 정상 전송 (POST, PUT 고려)✅
                        const clonedRequest = request.clone()
                        clonedRequest.headers.set('Authorization', `Bearer ${newAccessToken}`)

                        return api(clonedRequest, {
                            ...options,
                            context: { ...options?.context, retryAfterRefresh: true },
                        })
                    } catch (error) {
                        console.error('[Auth] 세션 복구 실패, 로그아웃 처리:', error)
                        logout()
                        return response
                    }
                }

                return response
            },
        ],
    },
})

// import ky from 'ky'
// import { useAuthStore } from '@/features/auth/store/useAuthStore'

// /**
//  * 🔓 authApi: 로그인, 회원가입 등 '비인증' 혹은 '인증 관리' 자체를 위한 인스턴스
//  */
// export const authApi = ky.create({
//     prefix: '/ptc/',
//     credentials: 'include',
//     retry: 0,
//     cache: 'no-store',
// })

// /**
//  * 🔐 api: 일반적인 데이터 요청을 위한 '인증 기반' 인스턴스
//  */
// export const api = ky.create({
//     prefix: '/ptc/',
//     credentials: 'include',
//     retry: 0,
//     /**
//      * 🔥 cache: 'no-store'
//      *
//      * React (Vite) 환경에서는 fetch 요청이 브라우저에서 직접 나가기 때문에
//      * 기본적으로 HTTP 캐시(ETag, 304 Not Modified)가 자동으로 동작한다.
//      *
//      * 이 상태에서 인피니티 스크롤 / 페이지네이션을 구현하면
//      * 브라우저가 이전 응답을 재사용하면서 304 응답이 발생하고,
//      * 실제로는 새로운 데이터를 못 받아오는 문제가 생길 수 있다.
//      *
//      * 따라서 브라우저 캐시를 완전히 비활성화하고
//      * 항상 서버로부터 fresh 데이터를 받도록 강제한다.
//      *
//      * 👉 Next.js(Server Fetch)에서는 프레임워크가 캐시를 제어해주지만,
//      *    React(Client Fetch)에서는 반드시 수동으로 설정해야 한다.
//      *
//      * 👉 데이터 캐싱은 React Query(useQuery, useInfiniteQuery)로 따로 관리하는게 정석
//      */
//     cache: 'no-store',
//     hooks: {
//         beforeRequest: [
//             ({ request }) => {
//                 // 💡 Zustand 스토어에서 최신 액세스 토큰을 가져와 헤더에 주입
//                 const { accessToken } = useAuthStore.getState()
//                 if (accessToken) {
//                     request.headers.set('Authorization', `Bearer ${accessToken}`)
//                 }
//             },
//         ],
//         afterResponse: [
//             async ({ request, options, response }) => {
//                 // 💡 401 에러(토큰 만료 등) 발생 시 자동으로 리프레시 시도
//                 if (response && response.status === 401 && !options?.context?.retryAfterRefresh) {
//                     const { setAccessToken, logout } = useAuthStore.getState()

//                     try {
//                         console.log('[Auth] 토큰 만료 감지, 리프레시 시도 중...')

//                         // 1. 리프레시 API 호출 (HttpOnly 쿠키 기반 인증 가정)
//                         const refreshRes = await authApi.post('api/auth/refresh')

//                         if (refreshRes.ok) {
//                             const { accessToken } = await refreshRes.json<{ accessToken: string }>()

//                             // 2. Zustand 메모리에 새 토큰 저장
//                             setAccessToken(accessToken)

//                             console.log('[Auth] 세션 복구 성공, 원래 요청 재시도...')

//                             // 3. 새 토큰을 헤더에 수동으로 업데이트하고 재요청
//                             request.headers.set('Authorization', `Bearer ${accessToken}`)

//                             return api(request, {
//                                 ...options,
//                                 context: { ...options?.context, retryAfterRefresh: true },
//                             })
//                         }
//                     } catch (error) {
//                         console.error('[Auth] 자동 세션 복구 실패:', error)
//                         logout()
//                     }
//                 }

//                 return response
//             },
//         ],
//     },
// })
