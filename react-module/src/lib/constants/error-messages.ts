/**
 * 🚨 프런트엔드 공통 에러 및 안내 메시지 상수
 */

// 1. 유효성 검사 메시지 (Form Validation)
export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: "이메일을 입력해주세요",
  EMAIL_INVALID: "올바른 이메일 형식이 아닙니다",
  PASSWORD_REQUIRED: "비밀번호를 입력해주세요",
  PASSWORD_MIN: "비밀번호는 최소 6자 이상이어야 합니다",
  NAME_REQUIRED: "이름을 입력해주세요",
  NAME_MAX: "이름은 20자 이내로 입력해주세요",
  CONFIRM_PASSWORD_REQUIRED: "비밀번호 확인을 입력해주세요",
  PASSWORDS_NOT_MATCH: "비밀번호가 일치하지 않습니다",
} as const;

// 2. 인증 관련 에러 메시지 (Auth Domain)
export const AUTH_ERROR_MESSAGES = {
  LOGIN_FAILED: "로그인에 실패했습니다. 이메일과 비밀번호를 확인해 주세요.",
  SIGNUP_FAILED: "회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  SESSION_EXPIRED: "세션이 만료되었습니다. 다시 로그인해주세요.",
  UNAUTHORIZED: "접근 권한이 없습니다. 로그인 후 이용해주세요.",
} as const;

// 3. 무한 스크롤 관련 에러 메시지 (Infinite Scroll Domain)
export const INFINITE_ERROR_MESSAGES = {
  FETCH_FAILED: "목록을 가져오지 못했습니다. 네트워크 상태를 확인하고 다시 시도해 주세요.",
  NO_MORE_DATA: "모든 데이터를 확인했습니다.",
} as const;

// 4. 시스템 공통 에러 메시지 (Common/System)
export const SYSTEM_ERROR_MESSAGES = {
  SERVER_ERROR: "서버와의 통신 중 알 수 없는 오류가 발생했습니다.",
  UNKNOWN_ERROR: "일시적인 오류가 발생했습니다. 페이지를 새로고침 해주세요.",
} as const;
