import app from './app';
import { initDatabase } from './util/init-db';

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    // 1. DB 초기화 (Schema & Tables)
    await initDatabase();

    // 2. 서버 실행
    app.listen(PORT, () => {
      console.log(`
  🚀 Auth Server is running!
  📡 URL: http://localhost:${PORT}
  🛠️  Mode: ${process.env.NODE_ENV || 'development'}
      `);
    });
  } catch (err) {
    console.error('❌ Server start failed:', err);
    process.exit(1);
  }
};

startServer();
