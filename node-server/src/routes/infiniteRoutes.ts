import express from "express";
import * as infiniteController from "../controllers/infiniteController";
import { authenticateToken } from "@/middleware/auth.middleware";

const router = express.Router();

// 1. 커서 기반 인피니티 스크롤 데이터 조회
// GET /infinite/items?cursor=0&limit=5
router.get("/items", authenticateToken,infiniteController.getInfiniteData);

export default router;
