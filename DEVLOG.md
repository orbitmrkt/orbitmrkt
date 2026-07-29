# DEVLOG — Orbit Market

Человекочитаемый журнал согласованных шагов.

## 2026-07-29

- **Настройка деплоя на Vercel (тестовый стенд).** Добавлен корневой `vercel.json`:
  install через pnpm (frozen lockfile), build статики фронтенда через фильтр
  `@workspace/tg-mini-app`, output `artifacts/tg-mini-app/dist/public`, SPA-rewrite
  на `index.html` (роутинг wouter). Код проекта не менялся; переменные `PORT`/`BASE_PATH`,
  которые требует `vite.config.ts`, прокидываются флагами `-b` при `vercel deploy`.
  Файлы: `vercel.json`, `DEVLOG.md`. Способ деплоя — Vercel CLI (без GitHub).
