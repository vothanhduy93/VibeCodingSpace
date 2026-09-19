import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db/prisma.js';

const mergeLocalSchema = z.object({
  todos: z.array(z.object({
    id: z.string(),
    text: z.string(),
    completed: z.boolean(),
    order: z.number().optional().default(0),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })).optional().default([]),
  settings: z.object({
    wallpaper: z.string().optional(),
    customWallpaperUrl: z.string().nullable().optional(),
    soundVolumes: z.record(z.string(), z.number()).optional(),
    language: z.string().optional(),
    pomodoroSettings: z.any().optional(),
  }).optional(),
  pomodoroHistory: z.array(z.object({
    duration: z.number(),
    mode: z.string().optional().default('pomodoro'),
    completedAt: z.string(),
    date: z.string().optional(),
  })).optional().default([]),
});

const pushSyncSchema = z.object({
  todos: z.array(z.object({
    id: z.string(),
    text: z.string(),
    completed: z.boolean(),
    order: z.number().optional().default(0),
    updatedAt: z.string(),
    deleted: z.boolean().optional().default(false),
  })).optional().default([]),
  settings: z.object({
    wallpaper: z.string().optional(),
    customWallpaperUrl: z.string().nullable().optional(),
    soundVolumes: z.record(z.string(), z.number()).optional(),
    language: z.string().optional(),
    pomodoroSettings: z.any().optional(),
    updatedAt: z.string().optional(),
  }).optional(),
});

export async function syncRoutes(app: FastifyInstance) {
  // Merge local guest data into cloud account upon first login
  app.post('/api/v1/sync/merge-local', { preHandler: [app.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = mergeLocalSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'VALIDATION_ERROR',
        details: parseResult.error.flatten(),
      });
    }

    const { todos, settings, pomodoroHistory } = parseResult.data;
    const userId = request.user.id;

    // 1. Merge Todos (upsert each local todo)
    for (const todo of todos) {
      const existing = await prisma.todoItem.findUnique({
        where: { id: todo.id },
      });

      const createdAt = todo.createdAt ? new Date(todo.createdAt) : new Date();
      const updatedAt = todo.updatedAt ? new Date(todo.updatedAt) : new Date();

      if (!existing) {
        await prisma.todoItem.create({
          data: {
            id: todo.id,
            userId,
            text: todo.text,
            completed: todo.completed,
            order: todo.order,
            createdAt,
            updatedAt,
          },
        });
      } else if (existing.userId === userId) {
        // If it belongs to this user and local is newer
        if (updatedAt >= existing.updatedAt) {
          await prisma.todoItem.update({
            where: { id: todo.id },
            data: {
              text: todo.text,
              completed: todo.completed,
              order: todo.order,
              updatedAt,
            },
          });
        }
      }
    }

    // 2. Merge Settings
    if (settings) {
      const userSettings = await prisma.userSettings.findUnique({
        where: { userId },
      });

      const updateData: Record<string, any> = {};
      if (settings.wallpaper) updateData.wallpaper = settings.wallpaper;
      if (settings.customWallpaperUrl !== undefined) updateData.customWallpaperUrl = settings.customWallpaperUrl;
      if (settings.language) updateData.language = settings.language;
      if (settings.soundVolumes) updateData.soundVolumes = JSON.stringify(settings.soundVolumes);
      if (settings.pomodoroSettings) updateData.pomodoroSettings = JSON.stringify(settings.pomodoroSettings);

      if (userSettings) {
        await prisma.userSettings.update({
          where: { userId },
          data: updateData,
        });
      } else {
        await prisma.userSettings.create({
          data: {
            userId,
            wallpaper: settings.wallpaper || 'lofi-cafe',
            customWallpaperUrl: settings.customWallpaperUrl || null,
            language: settings.language || 'vi',
            soundVolumes: settings.soundVolumes ? JSON.stringify(settings.soundVolumes) : '{}',
            pomodoroSettings: settings.pomodoroSettings
              ? JSON.stringify(settings.pomodoroSettings)
              : JSON.stringify({ workTime: 25, shortBreak: 5, longBreak: 15 }),
          },
        });
      }
    }

    // 3. Merge Pomodoro History
    for (const log of pomodoroHistory) {
      const completedAt = new Date(log.completedAt);
      const dateStr = log.date || completedAt.toISOString().split('T')[0];

      // Check if duplicate exists for this user at the same completedAt
      const existing = await prisma.pomodoroLog.findFirst({
        where: {
          userId,
          completedAt,
        },
      });

      if (!existing) {
        await prisma.pomodoroLog.create({
          data: {
            userId,
            duration: log.duration,
            mode: log.mode,
            completedAt,
            date: dateStr,
          },
        });
      }
    }

    // Fetch unified state
    const allTodos = await prisma.todoItem.findMany({
      where: { userId, deletedAt: null },
      orderBy: { order: 'asc' },
    });

    const currentSettings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    return reply.send({
      success: true,
      message: 'Local data merged successfully',
      todos: allTodos,
      settings: currentSettings,
    });
  });

  // Pull delta changes
  app.get('/api/v1/sync/pull', { preHandler: [app.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.id;
    const { since } = request.query as { since?: string };

    let todosQuery: any = { userId };
    if (since) {
      const sinceDate = new Date(since);
      if (!isNaN(sinceDate.getTime())) {
        todosQuery.updatedAt = { gte: sinceDate };
      }
    } else {
      // If full pull, only active (non-deleted) todos
      todosQuery.deletedAt = null;
    }

    const todos = await prisma.todoItem.findMany({
      where: todosQuery,
      orderBy: { order: 'asc' },
    });

    const settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    return reply.send({
      todos,
      settings,
      serverTime: new Date().toISOString(),
    });
  });

  // Push delta changes (LWW conflict resolution)
  app.post('/api/v1/sync/push', { preHandler: [app.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = pushSyncSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'VALIDATION_ERROR',
        details: parseResult.error.flatten(),
      });
    }

    const { todos, settings } = parseResult.data;
    const userId = request.user.id;

    for (const todo of todos) {
      const clientUpdatedAt = new Date(todo.updatedAt);
      const existing = await prisma.todoItem.findUnique({
        where: { id: todo.id },
      });

      if (!existing) {
        if (!todo.deleted) {
          await prisma.todoItem.create({
            data: {
              id: todo.id,
              userId,
              text: todo.text,
              completed: todo.completed,
              order: todo.order,
              createdAt: clientUpdatedAt,
              updatedAt: clientUpdatedAt,
            },
          });
        }
      } else if (existing.userId === userId) {
        // Last-Write-Wins: Client timestamp is greater or equal to server timestamp
        if (clientUpdatedAt >= existing.updatedAt) {
          if (todo.deleted) {
            await prisma.todoItem.update({
              where: { id: todo.id },
              data: {
                deletedAt: new Date(),
                updatedAt: clientUpdatedAt,
              },
            });
          } else {
            await prisma.todoItem.update({
              where: { id: todo.id },
              data: {
                text: todo.text,
                completed: todo.completed,
                order: todo.order,
                deletedAt: null, // restore if undeleted
                updatedAt: clientUpdatedAt,
              },
            });
          }
        }
      }
    }

    // Sync settings if provided
    if (settings) {
      const updateData: Record<string, any> = {};
      if (settings.wallpaper) updateData.wallpaper = settings.wallpaper;
      if (settings.customWallpaperUrl !== undefined) updateData.customWallpaperUrl = settings.customWallpaperUrl;
      if (settings.language) updateData.language = settings.language;
      if (settings.soundVolumes) updateData.soundVolumes = JSON.stringify(settings.soundVolumes);
      if (settings.pomodoroSettings) updateData.pomodoroSettings = JSON.stringify(settings.pomodoroSettings);

      await prisma.userSettings.upsert({
        where: { userId },
        update: updateData,
        create: {
          userId,
          wallpaper: settings.wallpaper || 'lofi-cafe',
          customWallpaperUrl: settings.customWallpaperUrl || null,
          language: settings.language || 'vi',
          soundVolumes: settings.soundVolumes ? JSON.stringify(settings.soundVolumes) : '{}',
          pomodoroSettings: settings.pomodoroSettings
            ? JSON.stringify(settings.pomodoroSettings)
            : JSON.stringify({ workTime: 25, shortBreak: 5, longBreak: 15 }),
        },
      });
    }

    return reply.send({
      success: true,
      serverTime: new Date().toISOString(),
    });
  });
}
