# DEVLOG — Orbit Market

Человекочитаемый журнал согласованных шагов.

## 2026-07-29

- **Настройка деплоя на Vercel (тестовый стенд).** Добавлен корневой `vercel.json`:
  install через pnpm (frozen lockfile), build статики фронтенда через фильтр
  `@workspace/tg-mini-app`, output `artifacts/tg-mini-app/dist/public`, SPA-rewrite
  на `index.html` (роутинг wouter). Код проекта не менялся; переменные `PORT`/`BASE_PATH`,
  которые требует `vite.config.ts`, прокидываются флагами `-b` при `vercel deploy`.
  Файлы: `vercel.json`, `DEVLOG.md`. Способ деплоя — Vercel CLI (без GitHub).
- **Фикс загрузки.** Добавлен `.vercelignore` (исключены `attached_assets`, `.git`,
  `.local`) — у файлов в `attached_assets` битые кириллические имена (mojibake ещё
  с распаковки zip), из-за чего Vercel CLI падал на `lstat`. Так как `.vercelignore`
  применяется после обхода дерева, при деплое папка временно выносилась из дерева
  и возвращалась обратно (без удаления данных).
- **Деплой выполнен.** Проект Vercel `orbit-market` (аккаунт `orbitmrktsupport-1425`),
  прод-URL `https://orbit-market-iota.vercel.app` (HTTP 200, отдаётся Mini App).
  В сборку вошли несохранённые правки `index.css` из архива (overflow-x/max-width).
- **Смена URL на `orbitmrkt.vercel.app`.** По просьбе — переименован проект Vercel
  `orbit-market → orbitmrkt`, добавлен домен `orbitmrkt.vercel.app` в проект и
  привязан к прод-деплою (`vercel domains add` + `vercel alias set`). Публичный 200.
  Нюанс: голый alias без add domain уходил на Vercel SSO — исправлено через add domain.
- **Полное удаление Replit.** (1) Удалены `.replit`, `.replitignore`, `replit.md`,
  `.local/` (572 МБ), `scripts/post-merge.sh` — репо 609→37 МБ. (2) Убраны все `@replit/*`
  депы: `connectors-sdk` (корень), vite-плагины cartographer/dev-banner/runtime-error-modal
  (tg-mini-app, mockup-sandbox), catalog-записи и allowlist в `pnpm-workspace.yaml`, плюс
  блок esbuild-`overrides` (для портируемости). (3) Из 2× `vite.config.ts` убраны
  `runtimeErrorOverlay` и мёртвый блок cartographer/dev-banner (условие `REPL_ID`);
  `index.html` мета «built on Replit» → «Orbit Market — Telegram Mini App marketplace»;
  сняты комментарии `// @replit` в `badge.tsx`/`button.tsx`. Правки 2–3 делал саб-агент
  на Haiku, проверено grep-ом (0 упоминаний). (4) Пересобран `pnpm-lock.yaml` через
  pnpm@9 (0 `@replit`). (5) Проверка: `pnpm install` + `vite build` tg-mini-app — успешно.
  (6) Передеплой: `orbitmrkt.vercel.app` = 200, новая мета в проде.
- **Удалён `attached_assets`.** По просьбе выкинута вся папка (29 файлов, ~11 МБ,
  вложения Replit, кодом не использовалась) + мёртвый alias `@assets` в
  `tg-mini-app/vite.config.ts` + её строка из `.vercelignore`. Сборка проверена
  (`vite build` ок), передеплой 200. Побочно: деплой больше не требует временного
  выноса папки (битых кириллических имён в дереве не осталось).
