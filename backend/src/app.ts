import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import jwt from '@fastify/jwt';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';

import { env } from './config/env.js';
import { healthRoutes } from './routes/health.js';
import { authRoutes } from './routes/auth.routes.js';
import { syncRoutes } from './routes/sync.routes.js';
import { analyticsRoutes } from './routes/analytics.routes.js';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: env.NODE_ENV === 'development',
  });

  // Security Headers via Helmet
  await app.register(helmet, {
    contentSecurityPolicy: false, // Managed separately or for SPA compatibility
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  });

  // CORS Configuration
  const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());
  await app.register(cors, {
    origin: (origin, cb) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return cb(null, true);
      }
      return cb(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Cookies
  await app.register(cookie, {
    secret: env.COOKIE_SECRET,
    parseOptions: {},
  });

  // Rate Limiting (TASK-707: Security Hardening)
  await app.register(rateLimit, {
    max: 120, // 120 requests per minute
    timeWindow: '1 minute',
    errorResponseBuilder: () => ({
      statusCode: 429,
      error: 'TOO_MANY_REQUESTS',
      message: 'Rate limit exceeded. Please slow down.',
    }),
  });

  // JWT
  await app.register(jwt, {
    secret: env.JWT_SECRET,
  });

  // Authentication Decorator (Dual Token support: Cookie + Bearer header)
  app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // 1. Try Cookie first
      const cookieToken = request.cookies.vibespace_token;
      if (cookieToken) {
        const decoded = app.jwt.verify<{ id: string; email: string }>(cookieToken);
        request.user = decoded;
        return;
      }

      // 2. Try Bearer header
      const authHeader = request.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const decoded = app.jwt.verify<{ id: string; email: string }>(token);
        request.user = decoded;
        return;
      }

      return reply.status(401).send({
        error: 'UNAUTHORIZED',
        message: 'Authentication required. No valid session cookie or token found.',
      });
    } catch {
      return reply.status(401).send({
        error: 'INVALID_TOKEN',
        message: 'Invalid or expired authentication token.',
      });
    }
  });

  // Global Error Handler
  app.setErrorHandler((error: any, _request, reply) => {
    if (error.statusCode === 429) {
      return reply.status(429).send({
        error: 'TOO_MANY_REQUESTS',
        message: error.message,
      });
    }

    if (error.validation) {
      return reply.status(400).send({
        error: 'VALIDATION_ERROR',
        message: error.message,
      });
    }

    // Never leak stack trace in production (Security Best Practice)
    const isDev = env.NODE_ENV === 'development';
    return reply.status(error.statusCode || 500).send({
      error: error.name || 'INTERNAL_SERVER_ERROR',
      message: isDev ? error.message : 'An unexpected server error occurred.',
    });
  });

  // Register Routes
  await app.register(healthRoutes);
  await app.register(authRoutes);
  await app.register(syncRoutes);
  await app.register(analyticsRoutes);

  return app;
}
