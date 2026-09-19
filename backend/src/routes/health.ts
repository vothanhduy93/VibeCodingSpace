import { FastifyInstance } from 'fastify';
import { prisma } from '../db/prisma.js';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/health', async (_request, reply) => {
    try {
      // Check database connection
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
