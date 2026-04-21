import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import pool from '../util/db';
import redis from '../redis/redis';

/**
 * 회원가입
 */
export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    const userCheck = await pool.query('SELECT id FROM auth.users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'EMAIL_EXISTS', message: '이미 가입된 이메일입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();

    await pool.query(
      'INSERT INTO auth.users (id, email, password_hash, name) VALUES ($1, $2, $3, $4)',
      [id, email, hashedPassword, name]
    );

    return res.status(201).json({ message: '회원가입 성공' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'SERVER_ERROR', message: '서버 내부 오류가 발생했습니다.' });
  }
};

/**
 * 로그인 (Token 발급 + Cookie 설정)
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query('SELECT * FROM auth.users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: '이메일 또는 비밀번호가 틀립니다.' });
    }

    const tokenId = uuidv4();
    const accessToken = jwt.sign(
      { email: user.email, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { email: user.email, name: user.name, tokenId },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );

    // Redis에 리프레시 토큰 식별자 저장
    await redis.setex(`refresh_token:${user.email}`, 7 * 24 * 60 * 60, tokenId);

    // Refresh Token만 Cookie 설정 (httpOnly)
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    return res.status(200).json({
      message: '로그인 성공',
      accessToken, // 💡 액세스 토큰을 바디에 포함
      user: { email: user.email, name: user.name }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'SERVER_ERROR' });
  }
};

/**
 * 토큰 갱신
 */
export const refresh = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refresh_token;
    if (!token) return res.status(401).json({ error: 'NO_REFRESH_TOKEN' });
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as any;
    const storedTokenId = await redis.get(`refresh_token:${decoded.email}`);

    if (!storedTokenId || storedTokenId !== decoded.tokenId) {
      return res.status(401).json({ error: 'INVALID_REFRESH_TOKEN' });
    }

    const accessToken = jwt.sign(
      { email: decoded.email, name: decoded.name },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ 
      message: '토큰 갱신 성공',
      accessToken, // 💡 갱신된 액세스 토큰 반환
      user: { email: decoded.email, name: decoded.name }
    });
  } catch (err) {
    return res.status(401).json({ error: 'REFRESH_EXPIRED' });
  }
};

/**
 * 로그아웃
 */
export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refresh_token;
  if (token) {
    const decoded = jwt.decode(token) as any;
    if (decoded?.email) {
      await redis.del(`refresh_token:${decoded.email}`);
    }
  }

  res.clearCookie('refresh_token', { path: '/' });
  return res.status(200).json({ message: '로그아웃 성공' });
};

/**
 * 현재 사용자 정보 조회
 */
export const me = async (req: Request, res: Response) => {
  return res.status(200).json({ user: req.user });
};
