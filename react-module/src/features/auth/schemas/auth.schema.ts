import { z } from 'zod'

/**
 * 🔐 로그인 스키마
 */
export const loginSchema = z.object({
    email: z.string().min(1, '이메일을 입력해주세요').email('올바른 이메일 형식이 아닙니다'),
    password: z.string().min(1, '비밀번호를 입력해주세요').min(5, '비밀번호는 최소 5자 이상이어야 합니다'),
})

/**
 * 📝 회원가입 스키마
 */
export const signupSchema = z
    .object({
        name: z.string().min(1, '이름을 입력해주세요').max(20, '이름은 20자 이내로 입력해주세요'),
        email: z.string().min(1, '이메일을 입력해주세요').email('올바른 이메일 형식이 아닙니다'),
        password: z.string().min(1, '비밀번호를 입력해주세요').min(5, '비밀번호는 최소 5자 이상이어야 합니다'),
        confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: '비밀번호가 일치하지 않습니다',
        path: ['confirmPassword'],
    })

export type LoginFormValues = z.infer<typeof loginSchema>
export type SignupFormValues = z.infer<typeof signupSchema>
