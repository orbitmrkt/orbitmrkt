# Orbit Market

Telegram Mini App — маркетплейс внутри Telegram с тёмной темой, нижней навигацией и Lottie-анимациями.

## Run & Operate

- `pnpm --filter @workspace/tg-mini-app run dev` — запустить фронтенд (управляется workflow `artifacts/tg-mini-app: web`)
- `pnpm run typecheck` — полная проверка типов по всем пакетам
- `pnpm run build` — typecheck + сборка всех пакетов

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite 7 + Tailwind CSS 4
- Telegram SDK: `@telegram-apps/sdk-react`
- Анимации: `lottie-react`
- Роутинг: `wouter`
- UI: shadcn/ui (Radix UI)

## Where things live

- `artifacts/tg-mini-app/src/App.tsx` — корневой компонент, LoadingScreen, NavBar, MainScreen
- `artifacts/tg-mini-app/src/index.css` — CSS-переменные темы Orbit Market (не менять на заглушки)
- `artifacts/tg-mini-app/src/assets/` — SVG-логотипы, Lottie JSON анимации
- `artifacts/tg-mini-app/src/pages/` — страницы приложения

## Architecture decisions

- Тёмная тема зафиксирована: фон `hsl(220, 13%, 13%)`, акцент `#0088ff` — не переключается.
- Telegram WebApp API вызывается через нативный `window.Telegram.WebApp` (не через SDK) для максимальной совместимости.
- Обфускация JS включается только при `NODE_ENV=production` через `vite-plugin-javascript-obfuscator`.
- SVG иконки подключаются как React-компоненты через `vite-plugin-svgr` (суффикс `?react`).

## Product

Orbit Market — Telegram Mini App (маркетплейс):
- Загрузочный экран с Lottie-анимацией и прогресс-баром
- Нижняя навигация (Маркет / Мои подарки / Профиль) с Lottie-иконками и capsule-индикатором
- Виджет баланса в правом верхнем углу

## User preferences

- Все UI-элементы должны быть рабочими (см. AGENTS.md)
- Тёмная тема Orbit Market — не менять
- Шрифт Inter / -apple-system

## Gotchas

- `vite.config.ts` требует переменных `PORT` и `BASE_PATH` — без них упадёт при запуске напрямую.
- SVG-файлы импортируются с `?react` суффиксом для использования как JSX-компоненты.
- `javascript-obfuscator` — тяжёлая зависимость, только для production-сборки.

## Поinters

- AGENTS.md — обязательные правила разработки для всех агентов
- Workflow: `artifacts/tg-mini-app: web`
