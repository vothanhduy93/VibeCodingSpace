import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log('✅ SQLite Database connected via Prisma');
  } catch (err) {
    console.error('❌ Failed to connect to Database:', err);
    throw err;
  }
}

export async function disconnectDB() {
  await prisma.$disconnect();
}
