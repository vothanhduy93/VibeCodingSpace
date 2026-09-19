import { buildApp } from './app.js';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './db/prisma.js';

async function start() {
  try {
    await connectDB();
    const app = await buildApp();

    const address = await app.listen({
      port: env.PORT,
      host: env.HOST,
    });

    console.log(`🚀 VibeSpace Backend running at: ${address}`);
    console.log(`🌐 Allowed CORS: ${env.CORS_ORIGIN}`);

    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
    for (const signal of signals) {
      process.on(signal, async () => {
        console.log(`\n🛑 Received ${signal}, gracefully shutting down...`);
        await app.close();
        await disconnectDB();
        process.exit(0);
      });
    }
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

start();
