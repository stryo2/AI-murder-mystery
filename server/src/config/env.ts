// Load server/.env if present (Node's built-in loader; no dotenv needed).
try {
  process.loadEnvFile();
} catch {
  // No .env file: rely on the real environment (e.g. in production).
}

export const env = {
  PORT: Number(process.env.PORT ?? 3001),
  LLM_API_KEY: process.env.LLM_API_KEY ?? '',
  LLM_MODEL: process.env.LLM_MODEL ?? '',
};
