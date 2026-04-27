import { z } from 'zod'
import { VALIDATION_MESSAGES } from '@/lib/constants/error-messages'

/**
 * 🔐 로그인 스키마
 */
export const loginSchema = z.object({
    email: z.string().min(1, VALIDATION_MESSAGES.EMAIL_REQUIRED).email(VALIDATION_MESSAGES.EMAIL_INVALID),
    password: z.string().min(1, VALIDATION_MESSAGES.PASSWORD_REQUIRED).min(5, VALIDATION_MESSAGES.PASSWORD_MIN),
})

/**
 * 📝 회원가입 스키마
 */
export const signupSchema = z
    .object({
        name: z.string().min(1, VALIDATION_MESSAGES.NAME_REQUIRED).max(20, VALIDATION_MESSAGES.NAME_MAX),
        email: z.string().min(1, VALIDATION_MESSAGES.EMAIL_REQUIRED).email(VALIDATION_MESSAGES.EMAIL_INVALID),
        password: z.string().min(1, VALIDATION_MESSAGES.PASSWORD_REQUIRED).min(4, VALIDATION_MESSAGES.PASSWORD_MIN),
        confirmPassword: z.string().min(1, VALIDATION_MESSAGES.CONFIRM_PASSWORD_REQUIRED),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: VALIDATION_MESSAGES.PASSWORDS_NOT_MATCH,
        path: ['confirmPassword'],
    })

export type LoginFormValues = z.infer<typeof loginSchema>
export type SignupFormValues = z.infer<typeof signupSchema>
