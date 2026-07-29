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
- **Заголовок/описание.** `title`/`og:title`/`twitter:title` + 3 `description` в `index.html` → «Orbit Market — Your coolest NFT Market in Telegram». Передеплой 200.
- **Фича: блокировка входа из браузера (403-гейт).** `src/lib/telegram.ts` — чистая
  `isInTelegram()` (platform !== 'unknown' / initData / user); `components/BrowserGate.tsx`
  — экран с лого, «Ошибка 403», текстом и округлой сине-голубой кнопкой «Открыть в Telegram»
  (Lottie-иконка `open-in-telegram.json`) → `t.me/Orbit_mrkt_bot/market`; стили `.gate-*`
  в `index.css`; врезка в `App.tsx` (`if(!isInTelegram()) return <BrowserGate/>`, ранний
  return после хуков). Лого PNG(2.16МБ)→SVG(14.7КБ) везде, старый png удалён. Тесты:
  `vitest` (`vitest.config.ts`, отдельный от vite.config), `telegram.test.ts` — 12/12 зелёные.
  Build ок, деплой `orbitmrkt.vercel.app` 200. Прим.: 2 пред-существующих ошибки typecheck
  (svgr `?react`, `speed` у Lottie) — не мои, на vite build/деплой не влияют.
- **Адаптив market bar.** `index.css`: `min-width:0` на `.msb-search`/`.msb-input` (search сжимается, row1 не вылезает), `flex-wrap:wrap` на `.msb-row2` (чипы переносятся), `.main-content` `max-width:480px; margin:auto` (ПК). Build ок, деплой 200.
- **Адаптация под тему Telegram (light/dark).** `src/lib/theme.ts`: `resolveColorScheme()`
  (tg.colorScheme → фолбэк prefers-color-scheme) + хук `useTelegramTheme()` (ставит
  `data-theme` на `<html>`, слушает `themeChanged`). В `index.css` заведены семантические
  токены `--app-bg/-surface/-elevate*/-text*/-border/-accent*` (тёмные по умолчанию +
  блок `[data-theme='light']`), захардкоженные цвета в `.main-screen/.brand/.trw/.nav/.msb/.gate`
  переведены на них. Удалён мёртвый `.msb-filter-btn`. Тесты `theme.test.ts` (8) — всего 20 зелёных.
  Обновлён `AGENTS.md` (правило «тёмная тема зафиксирована» → «тема адаптивная, красить токенами»).
  Известный нюанс: белые ассеты (иконки дока — svg/Lottie, сплеш загрузки, лого на гейте)
  не инвертируются под светлую тему — нужен отдельный проход по ассетам.
- **Тема: привязка к цветам Telegram.** Токены `--app-*` теперь ссылаются на `--tg-theme-*` (bg/text/hint/button/secondary-bg) с фолбэком на нашу палитру; хук `useTelegramTheme()` проставляет `--tg-theme-*` из `themeParams`. Реальная тема клиента (напр. зелёная) проступает: фон/текст/акцент. Синие иконки баланса → на `--app-accent`. Лого поднято (62→50).
- **Адаптивность логотипа 403-экрана, снятие readOnly с поиска и декомпозиция компонентов.** (1) В `BrowserGate.tsx` и `index.css` добавлена автоадаптация фильтра логотипа под тему браузера/клиента (`brightness(0)` для светлой темы, `brightness(0) invert(1)` для тёмной). (2) В `MarketSearchBar` снят атрибут `readOnly`, добавлено состояние управляемого ввода и haptic-отклик. (3) Выделены компоненты страниц `MarketPage`, `GiftsPage`, `ProfilePage` в `src/pages/` и `MarketSearchBar` в `src/components/`. (4) Добавлен `src/vite-env.d.ts` для разрешения SVG-импортов и исправлены ошибки типов TS. Проведены Vitest тесты (20/20) и сборка проекта.
- **Приоритет темы устройства вне Telegram + meta theme-color.** (1) В `src/lib/theme.ts` переписан `resolveColorScheme`: при запуске вне Telegram тема определяется строго по системным настройкам устройства (`window.matchMedia('(prefers-color-scheme: dark)')`). (2) Добавлено автообновление `<meta name="theme-color">` под цвет фона браузера/устройства. (3) В `index.css` добавлен CSS медиа-запрос `(prefers-color-scheme: dark)` для моментального отклика логотипа 403-экрана до гидратации. Обновлены Vitest тесты (`theme.test.ts`).
- **Исправление сборки Vercel (дефолтные значение PORT/BASE_PATH).** В `artifacts/tg-mini-app/vite.config.ts` убраны блокировки `throw new Error` и заданы значения по умолчанию (`process.env.PORT || '5000'`, `process.env.BASE_PATH || '/'`) для бесшовной работы автоматических сборок на Vercel.



