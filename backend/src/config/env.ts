import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default('0.0.0.0'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().default('file:./dev.db'),
  JWT_SECRET: z.string().min(16).default('vibespace-super-secret-jwt-key-for-development-change-in-prod'),
  COOKIE_SECRET: z.string().min(16).default('vibespace-super-secret-cookie-sign-key-change-in-prod'),
  CORS_ORIGIN: z.string().default('http://localhost:3000,http://localhost:5173,https://vothanhduy93.github.io'),
  GOOGLE_CLIENT_ID: z.string().default('mock-google-client-id'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
