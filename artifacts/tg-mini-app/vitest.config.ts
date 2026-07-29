import { defineConfig } from 'vitest/config';

// Отдельный конфиг для тестов: не тянет vite.config.ts (тот требует PORT/BASE_PATH).
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
