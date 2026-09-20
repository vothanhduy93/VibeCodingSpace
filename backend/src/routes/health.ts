import { FastifyInstance } from 'fastify';
import { prisma } from '../db/prisma.js';

export async function healthRoutes(app: FastifyInstance) {
  // Root landing route GET /
  app.get('/', async (request, reply) => {
    const isHtml = request.headers.accept?.includes('text/html');

    if (isHtml) {
      reply.type('text/html; charset=utf-8');
      return reply.send(`
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>VibeSpace Backend API</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f0f4ff 0%, #fae8ff 50%, #fef3c7 100%);
      color: #1e293b;
      padding: 20px;
    }
    .card {
      max-width: 620px;
      width: 100%;
      background: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.8);
      border-radius: 24px;
      padding: 36px;
      box-shadow: 0 20px 40px -15px rgba(100, 116, 139, 0.15);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #ecfdf5;
      color: #047857;
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      border: 1px solid #a7f3d0;
      margin-bottom: 16px;
    }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; }
    h1 { font-size: 26px; font-weight: 800; color: #0f172a; margin-bottom: 8px; letter-spacing: -0.5px; }
    p.subtitle { color: #64748b; font-size: 14px; margin-bottom: 24px; line-height: 1.5; }
    .status-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
    .status-item { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px; }
    .status-label { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #94a3b8; letter-spacing: 0.5px; }
    .status-value { font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 4px; }
    .endpoints-title { font-size: 12px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
    .endpoint { display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 12px; margin-bottom: 6px; }
    .method { font-family: monospace; font-weight: 800; padding: 2px 6px; border-radius: 6px; font-size: 10px; }
    .get { background: #e0f2fe; color: #0369a1; }
    .post { background: #dcfce7; color: #15803d; }
    .path { font-family: monospace; color: #334155; font-weight: 600; }
    .desc { color: #94a3b8; font-size: 11px; margin-left: auto; }
    .actions { margin-top: 24px; display: flex; gap: 12px; }
    .btn {
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 12px 18px;
      border-radius: 14px;
      font-size: 13px;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-primary { background: #7c3aed; color: white; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25); }
    .btn-primary:hover { background: #6d28d9; }
    .btn-secondary { background: #ffffff; color: #334155; border: 1px solid #cbd5e1; }
    .btn-secondary:hover { background: #f8fafc; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">
      <span class="dot"></span> ĐANG HOẠT ĐỘNG
    </div>
    <h1>🚀 VibeSpace Backend Server</h1>
    <p class="subtitle">Máy chủ API Fastify & Prisma ORM hỗ trợ xác thực tài khoản, đồng bộ đám mây và bản đồ nhiệt tập trung cho VibeSpace.</p>

    <div class="status-grid">
      <div class="status-item">
        <div class="status-label">Cơ Sở Dữ Liệu</div>
        <div class="status-value">SQLite (dev.db) 🟢 Đã kết nối</div>
      </div>
      <div class="status-item">
        <div class="status-label">Cổng Phục Vụ (Port)</div>
        <div class="status-value">4000 (0.0.0.0)</div>
      </div>
    </div>

    <div class="endpoints-title">Các Điểm Cuối API Sẵn Sàng (API Endpoints):</div>
    <div class="endpoint">
      <span class="method get">GET</span>
      <span class="path">/health</span>
      <span class="desc">Kiểm tra kết nối DB</span>
    </div>
    <div class="endpoint">
      <span class="method post">POST</span>
      <span class="path">/api/v1/auth/google</span>
      <span class="desc">Đăng nhập Google</span>
    </div>
    <div class="endpoint">
      <span class="method post">POST</span>
      <span class="path">/api/v1/auth/magic-link</span>
      <span class="desc">Gửi liên kết ma thuật</span>
    </div>
    <div class="endpoint">
      <span class="method post">POST</span>
      <span class="path">/api/v1/sync/merge-local</span>
      <span class="desc">Hợp nhất dữ liệu khách</span>
    </div>
    <div class="endpoint">
      <span class="method get">GET</span>
      <span class="path">/api/v1/analytics/stats</span>
      <span class="desc">Bản đồ nhiệt 90 ngày</span>
    </div>

    <div class="actions">
      <a href="http://localhost:3000" target="_blank" class="btn btn-primary">🌐 Mở Giao Diện Web (Local 3000)</a>
      <a href="/health" class="btn btn-secondary">🔍 Xem JSON Health Check</a>
    </div>
  </div>
</body>
</html>
      `);
    }

    return reply.send({
      service: 'vibespace-backend',
      version: '1.0.0',
      status: 'operational',
      database: 'connected',
      endpoints: {
        health: 'GET /health',
        googleAuth: 'POST /api/v1/auth/google',
        magicLink: 'POST /api/v1/auth/magic-link',
        verifyMagicLink: 'GET /api/v1/auth/verify-magic-link',
        currentUser: 'GET /api/v1/auth/me',
        syncMerge: 'POST /api/v1/sync/merge-local',
        syncPull: 'GET /api/v1/sync/pull',
        syncPush: 'POST /api/v1/sync/push',
        analyticsStats: 'GET /api/v1/analytics/stats',
      },
      frontendUrl: 'http://localhost:3000',
    });
  });

  app.get('/health', async (_request, reply) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return reply.send({
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'connected',
        uptime: process.uptime(),
      });
    } catch (err) {
      return reply.status(503).send({
        status: 'degraded',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: (err as Error).message,
      });
    }
  });

  app.get('/api/v1/health', async (_request, reply) => {
    return reply.send({
      service: 'vibespace-backend',
      version: '1.0.0',
      status: 'operational',
      mode: process.env.NODE_ENV || 'development',
    });
  });
}
