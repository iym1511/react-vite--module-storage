-- 1. 스키마 생성
CREATE SCHEMA IF NOT EXISTS auth;

-- 2. UUID 확장 활성화 (필요한 경우)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Users 테이블 생성
CREATE TABLE IF NOT EXISTS auth.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. 인덱스 설정 (이메일 검색 최적화)
CREATE INDEX IF NOT EXISTS idx_users_email ON auth.users(email);

-- 5. 업데이트 시간 자동 갱신 트리거 (선택 사항)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at') THEN
        CREATE TRIGGER set_updated_at
        BEFORE UPDATE ON auth.users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
