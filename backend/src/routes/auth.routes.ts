import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import crypto from 'node:crypto';
import { prisma } from '../db/prisma.js';
import { env } from '../config/env.js';

const googleAuthSchema = z.object({
  credential: z.string().optional(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  avatar: z.string().url().optional().or(z.string()),
});

const magicLinkRequestSchema = z.object({
  email: z.string().email(),
});

const magicLinkVerifySchema = z.object({
  token: z.string().min(16),
});

// Helper to set auth cookie
export function setAuthCookie(reply: FastifyReply, token: string) {
  const isProd = env.NODE_ENV === 'production';
  reply.setCookie('vibespace_token', token, {
    path: '/',
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax', // 'none' needed for cross-site cookie in prod if frontend is on github.io
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });
}

export async function authRoutes(app: FastifyInstance) {
  // Google OAuth Login / Registration
  app.post('/api/v1/auth/google', async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = googleAuthSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'VALIDATION_ERROR',
        details: parseResult.error.flatten(),
      });
    }

    const { credential, email: bodyEmail, name: bodyName, avatar: bodyAvatar } = parseResult.data;

    let userEmail: string;
    let userName: string | undefined = bodyName;
    let userAvatar: string | undefined = bodyAvatar;

    // Decode Google JWT if credential provided
    if (credential) {
      try {
        const parts = credential.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
          userEmail = payload.email;
          userName = payload.name || userName;
          userAvatar = payload.picture || userAvatar;
        } else {
          userEmail = bodyEmail || '';
        }
      } catch {
        userEmail = bodyEmail || '';
      }
    } else if (bodyEmail) {
      userEmail = bodyEmail;
    } else {
      return reply.status(400).send({ error: 'EMAIL_REQUIRED', message: 'Email or Google credential is required' });
    }

    if (!userEmail) {
      return reply.status(400).send({ error: 'INVALID_CREDENTIAL', message: 'Could not extract email from credential' });
    }

    // Upsert User
    const user = await prisma.user.upsert({
      where: { email: userEmail },
      update: {
        name: userName || undefined,
        avatar: userAvatar || undefined,
      },
      create: {
        email: userEmail,
        name: userName || userEmail.split('@')[0],
        avatar: userAvatar || null,
        authProvider: 'google',
        settings: {
          create: {
            wallpaper: 'lofi-cafe',
            language: 'vi',
            soundVolumes: '{}',
            pomodoroSettings: JSON.stringify({ workTime: 25, shortBreak: 5, longBreak: 15 }),
          },
        },
      },
      include: {
        settings: true,
      },
    });

    const jwtToken = app.jwt.sign({ id: user.id, email: user.email });
    setAuthCookie(reply, jwtToken);

    return reply.send({
      success: true,
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        authProvider: user.authProvider,
        createdAt: user.createdAt,
      },
      settings: user.settings,
    });
  });

  // Request Magic Link
  app.post('/api/v1/auth/magic-link', async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = magicLinkRequestSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'VALIDATION_ERROR',
        details: parseResult.error.flatten(),
      });
    }

    const { email } = parseResult.data;
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await prisma.magicLinkToken.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });

    const verifyUrl = `${env.FRONTEND_URL}?magic_token=${token}`;

    return reply.send({
      success: true,
      message: 'Magic link generated successfully.',
      // Always return token/verifyUrl in response for instant local use & testing
      token,
      verifyUrl,
      expiresInMinutes: 15,
    });
  });

  // Verify Magic Link
  app.get('/api/v1/auth/verify-magic-link', async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = magicLinkVerifySchema.safeParse(request.query);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'INVALID_TOKEN',
        message: 'Magic link token is invalid or missing',
      });
    }

    const { token } = parseResult.data;

    const record = await prisma.magicLinkToken.findUnique({
      where: { token },
    });

    if (!record || record.used || record.expiresAt < new Date()) {
      return reply.status(400).send({
        error: 'EXPIRED_OR_USED_TOKEN',
        message: 'This magic link has expired or has already been used',
      });
    }

    // Mark token as used
    await prisma.magicLinkToken.update({
      where: { id: record.id },
      data: { used: true },
    });

    // Upsert User
    const user = await prisma.user.upsert({
      where: { email: record.email },
      update: {},
      create: {
        email: record.email,
        name: record.email.split('@')[0],
        authProvider: 'magic-link',
        settings: {
          create: {
            wallpaper: 'lofi-cafe',
            language: 'vi',
            soundVolumes: '{}',
            pomodoroSettings: JSON.stringify({ workTime: 25, shortBreak: 5, longBreak: 15 }),
          },
        },
      },
      include: {
        settings: true,
      },
    });

    const jwtToken = app.jwt.sign({ id: user.id, email: user.email });
    setAuthCookie(reply, jwtToken);

    return reply.send({
      success: true,
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        authProvider: user.authProvider,
        createdAt: user.createdAt,
      },
      settings: user.settings,
    });
  });

  // Get current authenticated user profile
  app.get('/api/v1/auth/me', { preHandler: [app.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
      include: { settings: true },
    });

    if (!user) {
      return reply.status(404).send({ error: 'USER_NOT_FOUND', message: 'User does not exist' });
    }

    return reply.send({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        authProvider: user.authProvider,
        createdAt: user.createdAt,
      },
      settings: user.settings,
    });
  });

  // Logout
  app.post('/api/v1/auth/logout', async (_request: FastifyRequest, reply: FastifyReply) => {
    reply.clearCookie('vibespace_token', { path: '/' });
    return reply.send({ success: true, message: 'Logged out successfully' });
  });
}
