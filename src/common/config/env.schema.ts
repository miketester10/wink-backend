import { z } from 'zod';
import { config } from 'dotenv';
config({ quiet: true });

const envSchema = z.object({
  DATABASE_URL: z.string().trim().nonempty('DATABASE_URL is required.'),
  JWT_SECRET: z.string().trim().nonempty('JWT_SECRET is required.'),
  JWT_EXPIRES_IN: z
    .string()
    .trim()
    .nonempty('JWT_EXPIRES_IN is required.')
    .transform(Number),
  API_PREFIX: z.string().trim().nonempty().default('api/v1'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().trim().nonempty('PORT is required.').transform(Number),
});

const envParsed = envSchema.safeParse(process.env);

if (!envParsed.success) {
  console.error("❌ Variabili d'ambiente non valide:");

  for (const issue of envParsed.error.issues) {
    console.error(`- ${issue.path.join('.')}: ${issue.message}`);
  }

  throw new Error(
    "Variabili d'ambiente non valide. Controlla la console per i dettagli.",
  );
}
type envType = z.infer<typeof envSchema>;
export const env: envType = envParsed.data;
export const isDevelopment = env.NODE_ENV !== 'production';
