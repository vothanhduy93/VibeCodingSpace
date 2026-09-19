import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app.js';
import { prisma, connectDB, disconnectDB } from '../src/db/prisma.js';

describe('VibeSpace Backend End-to-End Integration Suite', () => {
  let app: FastifyInstance;
  let testUserToken: string;
  let testUserId: string;

  beforeAll(async () => {
    await connectDB();
    // Clean up test data
    await prisma.pomodoroLog.deleteMany();
    await prisma.todoItem.deleteMany();
    await prisma.userSettings.deleteMany();
    await prisma.magicLinkToken.deleteMany();
    await prisma.user.deleteMany();

    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
    await disconnectDB();
  });

  describe('1. Health Checks & Security Headers', () => {
    it('GET /health should return 200 and database connected status', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/health',
      });

      expect(res.statusCode).toBe(200);
      const json = JSON.parse(res.payload);
      expect(json.status).toBe('ok');
      expect(json.database).toBe('connected');
    });

    it('GET /api/v1/health should return operational metadata', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/v1/health',
      });

      expect(res.statusCode).toBe(200);
      const json = JSON.parse(res.payload);
      expect(json.service).toBe('vibespace-backend');
      expect(json.status).toBe('operational');
    });

    it('should include Helmet security headers', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/health',
      });

      expect(res.headers['x-content-type-options']).toBe('nosniff');
      expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    });
  });

  describe('2. Authentication Module (TASK-702)', () => {
    it('POST /api/v1/auth/google should register new user & issue JWT + cookie', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/google',
        payload: {
          email: 'testuser@vibespace.dev',
          name: 'Vibe Master',
          avatar: 'https://example.com/avatar.png',
        },
      });

      expect(res.statusCode).toBe(200);
      const json = JSON.parse(res.payload);
      expect(json.success).toBe(true);
      expect(json.user.email).toBe('testuser@vibespace.dev');
      expect(json.user.name).toBe('Vibe Master');
      expect(json.token).toBeDefined();

      testUserToken = json.token;
      testUserId = json.user.id;

      // Check cookie
      const setCookie = res.headers['set-cookie'];
      expect(setCookie).toBeDefined();
      expect(setCookie?.toString()).toContain('vibespace_token');
    });

    it('POST /api/v1/auth/magic-link & GET /api/v1/auth/verify-magic-link flow', async () => {
      // 1. Request magic link
      const reqRes = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/magic-link',
        payload: { email: 'magic@vibespace.dev' },
      });

      expect(reqRes.statusCode).toBe(200);
      const reqJson = JSON.parse(reqRes.payload);
      expect(reqJson.token).toBeDefined();
      const magicToken = reqJson.token;

      // 2. Verify magic link
      const verifyRes = await app.inject({
        method: 'GET',
        url: `/api/v1/auth/verify-magic-link?token=${magicToken}`,
      });

      expect(verifyRes.statusCode).toBe(200);
      const verifyJson = JSON.parse(verifyRes.payload);
      expect(verifyJson.user.email).toBe('magic@vibespace.dev');
      expect(verifyJson.token).toBeDefined();

      // 3. Trying to reuse token should fail
      const reuseRes = await app.inject({
        method: 'GET',
        url: `/api/v1/auth/verify-magic-link?token=${magicToken}`,
      });
      expect(reuseRes.statusCode).toBe(400);
    });

    it('GET /api/v1/auth/me should return user data when authorized', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/v1/auth/me',
        headers: {
          authorization: `Bearer ${testUserToken}`,
        },
      });

      expect(res.statusCode).toBe(200);
      const json = JSON.parse(res.payload);
      expect(json.user.id).toBe(testUserId);
      expect(json.settings).toBeDefined();
    });

    it('GET /api/v1/auth/me should return 401 when unauthorized', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/v1/auth/me',
      });

      expect(res.statusCode).toBe(401);
    });

    it('POST /api/v1/auth/logout should clear cookie', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/auth/logout',
      });

      expect(res.statusCode).toBe(200);
      const setCookie = res.headers['set-cookie'];
      expect(setCookie?.toString()).toContain('vibespace_token=;');
    });
  });

  describe('3. Smart Local-to-Cloud Merge (TASK-704)', () => {
    it('POST /api/v1/sync/merge-local should merge guest items without data loss', async () => {
      const localGuestTodos = [
        { id: 'guest-todo-1', text: 'Build backend API', completed: true, order: 0 },
        { id: 'guest-todo-2', text: 'Relax with lofi music', completed: false, order: 1 },
      ];

      const localGuestSettings = {
        wallpaper: 'cyberpunk-neon',
        language: 'vi',
        soundVolumes: { rain: 0.8, lofi: 0.6 },
      };

      const localPomodoroHistory = [
        { duration: 1500, mode: 'pomodoro', completedAt: new Date().toISOString() },
      ];

      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/sync/merge-local',
        headers: { authorization: `Bearer ${testUserToken}` },
        payload: {
          todos: localGuestTodos,
          settings: localGuestSettings,
          pomodoroHistory: localPomodoroHistory,
        },
      });

      expect(res.statusCode).toBe(200);
      const json = JSON.parse(res.payload);
      expect(json.success).toBe(true);
      expect(json.todos).toHaveLength(2);
      expect(json.settings.wallpaper).toBe('cyberpunk-neon');
    });
  });

  describe('4. Two-Way Delta Sync Engine (TASK-705)', () => {
    it('GET /api/v1/sync/pull should return all active items', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/v1/sync/pull',
        headers: { authorization: `Bearer ${testUserToken}` },
      });

      expect(res.statusCode).toBe(200);
      const json = JSON.parse(res.payload);
      expect(json.todos.length).toBeGreaterThanOrEqual(2);
      expect(json.settings).toBeDefined();
      expect(json.serverTime).toBeDefined();
    });

    it('POST /api/v1/sync/push should update and delete items using LWW', async () => {
      const now = new Date().toISOString();
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/sync/push',
        headers: { authorization: `Bearer ${testUserToken}` },
        payload: {
          todos: [
            // Modify existing item
            { id: 'guest-todo-2', text: 'Relax with jazz and tea', completed: true, updatedAt: now },
            // Add new item
            { id: 'client-new-3', text: 'Read book', completed: false, updatedAt: now },
            // Soft-delete item
            { id: 'guest-todo-1', text: 'Build backend API', completed: true, updatedAt: now, deleted: true },
          ],
          settings: {
            wallpaper: 'ghibli-nature',
            updatedAt: now,
          },
        },
      });

      expect(res.statusCode).toBe(200);

      // Verify pull now reflects the changes
      const pullRes = await app.inject({
        method: 'GET',
        url: '/api/v1/sync/pull',
        headers: { authorization: `Bearer ${testUserToken}` },
      });

      const pullJson = JSON.parse(pullRes.payload);
      expect(pullJson.todos.find((t: any) => t.id === 'guest-todo-1')).toBeUndefined(); // deleted
      expect(pullJson.todos.find((t: any) => t.id === 'guest-todo-2')?.text).toBe('Relax with jazz and tea');
      expect(pullJson.todos.find((t: any) => t.id === 'client-new-3')).toBeDefined();
      expect(pullJson.settings.wallpaper).toBe('ghibli-nature');
    });
  });

  describe('5. Focus Analytics & Heatmap (TASK-706)', () => {
    it('POST /api/v1/analytics/pomodoro-complete should record pomodoro log', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/v1/analytics/pomodoro-complete',
        headers: { authorization: `Bearer ${testUserToken}` },
        payload: {
          duration: 1500, // 25 minutes
          mode: 'pomodoro',
        },
      });

      expect(res.statusCode).toBe(200);
      const json = JSON.parse(res.payload);
      expect(json.success).toBe(true);
      expect(json.log.duration).toBe(1500);
    });

    it('GET /api/v1/analytics/stats should compute total focus time, streak, and heatmap', async () => {
      const res = await app.inject({
        method: 'GET',
        url: '/api/v1/analytics/stats',
        headers: { authorization: `Bearer ${testUserToken}` },
      });

      expect(res.statusCode).toBe(200);
      const json = JSON.parse(res.payload);
      expect(json.stats.totalSessions).toBeGreaterThanOrEqual(2);
      expect(json.stats.totalMinutes).toBeGreaterThanOrEqual(50);
      expect(json.stats.streakDays).toBeGreaterThanOrEqual(1);
      expect(Array.isArray(json.stats.heatmap)).toBe(true);
      expect(json.stats.heatmap.length).toBeGreaterThanOrEqual(1);
    });
  });
});
