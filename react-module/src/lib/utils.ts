import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 🛠️ cn (Class Name) 유틸리티
 * 조건부 클래스 결합(clsx)과 Tailwind 클래스 충돌 방지(tailwind-merge)를 한 번에 처리합니다.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
