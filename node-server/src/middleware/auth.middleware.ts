import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface DecodedUser extends JwtPayload {
  email: string;
  name?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedUser;
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 💡 이제 쿠키가 아닌 Authorization Header에서 Bearer 토큰을 가져옵니다.
    let token = "";
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        error: "NO_TOKEN",
        message: "인증 토큰이 없습니다.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;
    req.user = decoded;
    next(); // next()를 호출하면 "내 처리는 끝났으니 다음 미들웨어로 넘겨라" 라는 신호입니다.
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        error: "TOKEN_EXPIRED",
        message: "토큰이 만료되었습니다.",
      });
    }
    return res.status(403).json({
      error: "INVALID_TOKEN",
      message: "유효하지 않은 토큰입니다.",
    });
  }
};
