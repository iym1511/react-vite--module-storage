import express from "express";
import * as infiniteController from "../controllers/infiniteController";
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();

// 1. 커서 기반 인피니티 스크롤 데이터 조회
// GET /infinite/items?cursor=0&limit=5
// 🔒 authenticateToken 미들웨어를 추가하여 인증된 사용자만 접근 가능하게 설정
router.get("/items", authenticateToken, infiniteController.getInfiniteData);

export default router;
