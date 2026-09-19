import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db/prisma.js';

const logPomodoroSchema = z.object({
  duration: z.number().positive(), // in seconds
  mode: z.enum(['pomodoro', 'shortBreak', 'longBreak']).default('pomodoro'),
  completedAt: z.string().optional(),
});

export async function analyticsRoutes(app: FastifyInstance) {
  // Record completed pomodoro session
  app.post('/api/v1/analytics/pomodoro-complete', { preHandler: [app.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = logPomodoroSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        error: 'VALIDATION_ERROR',
        details: parseResult.error.flatten(),
      });
    }

    const { duration, mode, completedAt } = parseResult.data;
    const userId = request.user.id;
    const completedDate = completedAt ? new Date(completedAt) : new Date();
    const dateStr = completedDate.toISOString().split('T')[0];

    const log = await prisma.pomodoroLog.create({
      data: {
        userId,
        duration,
        mode,
        completedAt: completedDate,
        date: dateStr,
      },
    });

    return reply.send({
      success: true,
      log,
    });
  });

  // Get focus statistics and heatmap data
  app.get('/api/v1/analytics/stats', { preHandler: [app.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = request.user.id;

    // Fetch all pomodoro logs for this user
    const logs = await prisma.pomodoroLog.findMany({
      where: { userId, mode: 'pomodoro' },
      orderBy: { completedAt: 'asc' },
    });

    const totalSessions = logs.length;
    const totalSeconds = logs.reduce((sum, log) => sum + log.duration, 0);
    const totalMinutes = Math.round(totalSeconds / 60);

    // Group by date for heatmap
    const dateMap = new Map<string, { count: number; minutes: number }>();
    for (const log of logs) {
      const existing = dateMap.get(log.date) || { count: 0, minutes: 0 };
      existing.count += 1;
      existing.minutes += Math.round(log.duration / 60);
      dateMap.set(log.date, existing);
    }

    // Convert map to sorted array
    const heatmap = Array.from(dateMap.entries()).map(([date, data]) => ({
      date,
      count: data.count,
      minutes: data.minutes,
    }));

    // Calculate daily focus streak
    let streakDays = 0;
    const uniqueDates = Array.from(dateMap.keys()).sort().reverse();
    if (uniqueDates.length > 0) {
      const todayStr = new Date().toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      // Streak is active if user focused today or yesterday
      let checkDate = uniqueDates[0] === todayStr ? new Date() : yesterday;
      let checkDateStr = checkDate.toISOString().split('T')[0];

      if (uniqueDates.includes(checkDateStr)) {
        for (let i = 0; i < 365; i++) {
          const expectedStr = checkDate.toISOString().split('T')[0];
          if (dateMap.has(expectedStr)) {
            streakDays += 1;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
      }
    }

    return reply.send({
      stats: {
        totalMinutes,
        totalSessions,
        streakDays,
        heatmap,
      },
    });
  });
}
