import { Request, Response } from "express";

// 1. 가상의 DB (20개 데이터)
const ORIGINAL_DB = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Backend Item ${i + 1}`,
  description: `This is item ${i + 1} from Node.js backend`,
}));

// 2. 커서 기반 인피니티 스크롤 컨트롤러
export const getInfiniteData = async (req: Request, res: Response) => {
  try {
    const cursor = parseInt(req.query.cursor as string, 10) || 0;
    const limit = parseInt(req.query.limit as string, 10) || 5;

    const filteredData = ORIGINAL_DB.filter((item) => item.id > cursor);
    const data = filteredData.slice(0, limit);

    const nextCursor =
      data.length === limit ? data[data.length - 1].id : undefined;

    return res.status(200).json({
      data,
      nextCursor,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};
