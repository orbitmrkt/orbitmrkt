# DEVLOG — Orbit Market

Человекочитаемый журнал согласованных шагов.

## 2026-07-30

- **Профиль — Фаза A: шапка + инфраструктура значков (уровень/премиум).** Дизайн — вариант 3
  без glow (по выбору justidev). `ProfilePage`: круглый аватар (реальный `photo_url` из
  `initDataUnsafe.user`, фолбэк — инициалы), имя + **премиум-значок** (анимированный TGS,
  показывается по реальному `is_premium`), значок уровня **слева от `@username`**. Новый
  `getTelegramUser()` в `lib/telegram.ts`. Значки — кастом-эмодзи Telegram (18 уровней +
  премиум), присланные justidev как несжатый Lottie JSON → `src/assets/emoji/*.json`,
  рендер через `lottie-react` (`EmojiLottie`/`PremiumBadge`/`LevelBadge`). Логика уровня
  `lib/levelBadge.ts` (чистая, тесты): 1–9 точный эмодзи; 10–99 — форма десятка (10+…90+,
  у каждого своя фигура) + **дорисованное число** (белая «заплатка» скрывает вшитое число,
  щиты внутри белые; поверх — реальное число); 100+ → форма 90 + полное число; edge
  0/отриц/NaN → null. Значки **адаптивны под тему**: в светлой `filter: invert(1)`
  (тёмная фигура + светлое число). Уровень пока `null` (скрыт) — **Фаза B**: бэкенд
  `getChat → ChatFullInfo.rating` (Bot API отдаёт `UserRating`, проверено в доках), нужен
  `BOT_TOKEN` в Vercel env. Тесты `levelBadge.test.ts` — всего vitest 77/77, build ок.
  Реализовано саб-агентом по детальному спеку, проверено. Подход «рисования числа» заранее
  провалидирован рендером (headless chromium + lottie-web).
- **Фича: корзина подарков (MVP, без экрана оплаты).** Общее состояние вместо локального
  toggle у карточки. Новые файлы: `lib/cartMath.ts` (чистые `cartTotal`/`formatGram`/
  `pluralizeGifts` рус.склонение/`addItem`/`removeItem`/`toggleItem`) + `cartMath.test.ts`
  (27 тестов: дубли, удаление несуществующего, точность суммы 0.1+0.2, склонение 11/21/114);
  `lib/cart.tsx` (`CartProvider`/`useCart` — items/count/total/has/add/remove/toggle/clear);
  `components/icons.tsx` (вынес `GramIcon`/`BasketIcon` из GiftCard, экспортируемые);
  `components/CartButton.tsx` (плавающая кнопка справа-снизу над доком, видна при count>0,
  сумма GRAM + склонённое кол-во); `components/CartSheet.tsx` (bottom-sheet: backdrop-fade +
  slide-up, список картинка/имя/#номер/цена, удаление ×, пустое состояние). Правки:
  `GiftCard.tsx` (локальный `useState` → `useCart().has/toggle`, иконки из `./icons`),
  `App.tsx` (обёртка `<CartProvider>` вокруг `MainScreen`, рендер `CartButton`/`CartSheet`,
  state `cartOpen`), стили `.cart-fab`/`.cart-sheet*`/`.cart-item*` в `index.css` (на токенах,
  адаптивно). Всё на токенах темы. vitest 62/62 (35→62), build ок. Реализовано саб-агентом
  (sonnet) по детальному спеку, проверено git diff + тесты + сборка. Отдельным шагом (позже) —
  экран оплаты (выделение/удаление пачкой, вознаграждение, «Оплатите с помощью GRAM»).
- **Корзина: анимации + блюр + высота поп-апа.** (1) Кнопка `.cart-fab`: entrance теперь
  выезжает СБОКУ (`translateX(100%+24px)`→0) вместо снизу; добавлена exit-анимация
  (`@keyframes cart-fab-out` + `.is-leaving`). В `CartButton.tsx` придержка размонтирования
  на 280мс (`mounted`/`leaving` state) + снапшот последних count/total, чтобы при уходе не
  мигал «0». (2) Backdrop поп-апа — `backdrop-filter: blur(4px)` вместе с затемнением.
  (3) Поп-ап открывается на `height: 60dvh` (было content-height/max 74vh); `.cart-sheet__list`
  получил `flex:1; min-height:0` для скролла внутри фикс-высоты. Файлы: `CartButton.tsx`,
  `index.css`. vitest 62/62, build ок. Push + deploy.
- **Корзина: фикс лага ухода + круглее/выше окно.** (1) `CartButton.tsx`: `leaving` теперь
  вычисляется СИНХРОННО в рендере (`rendered && count===0`), а не в useEffect — exit-анимация
  стартует в том же кадре, лага/пустого кадра нет; `EXIT_MS` 280→300 под длительность анимации.
  (2) `.cart-sheet`: высота `60→74dvh`, скругление верхних углов `22→30px`; `cart-fab-out`
  0.28→0.3s. Файлы: `CartButton.tsx`, `index.css`. vitest 62/62, build ок. Push + deploy.
- **Корзина сохраняется между заходами (Telegram CloudStorage).** По выбору justidev —
  не localStorage, а серверный `tg.CloudStorage` (кросс-девайс, Bot API 6.9+). Новый
  `lib/cartStorage.ts`: ключ `orbit_cart_v1`, чистые `parseStoredCart` (устойчиво к
  null/undefined/пустой/битому JSON/не-массиву → []; отсев кривых записей строгой
  `isValidGift`) + `serializeCart`. В `CartProvider`: загрузка через `getItem` на старте +
  сохранение через `setItem` на изменениях, с флагом `hydrated` (useRef) — пустой старт не
  затирает облако до загрузки; вне Telegram (нет CloudStorage) — тихий no-op. Тесты
  `cartStorage.test.ts` (10) — всего vitest 72/72, build ок. Файлы: `lib/cartStorage.ts`(+тест),
  `lib/cart.tsx`. Push + deploy.
- **Иконка-алмаз баланса в корзине (вместо «GRAM»/GramIcon).** Coin-svg из баланса вынесен
  в общий `DiamondIcon` (`components/icons.tsx`), баланс (`App.tsx` TopRightWidget) переведён
  на него (`<span class="trw-icon-blue trw-coin"><DiamondIcon/>`). В кнопке корзины убран текст
  «GRAM» → добавлена иконка `.cart-fab__coin` (accent). В поп-апе корзины иконка цены
  `GramIcon`→`DiamondIcon`. `GramIcon` остался для карточек маркета. Стили `.cart-fab__coin`/
  `.trw-coin`, `.cart-fab__sum`→inline-flex. Файлы: `icons.tsx`, `App.tsx`, `CartButton.tsx`,
  `CartSheet.tsx`, `index.css`. vitest 72/72, build ок. Push + deploy.
- **Включён обратно 403-гейт.** `GATE_ENABLED` в `App.tsx` `false→true` (по просьбе) — вход
  только из Telegram, в браузере снова показывается `BrowserGate` (403). build ок. Push + deploy.

- **Фростед-header + адаптивные лого/баланс + чуть светлее док.** (1) `.main-header`
  переведён в фиксированный полупрозрачный бар на всю ширину (`position:fixed; top:0`,
  `z-index:20`, фон `--app-header-bg` + `backdrop-filter: blur(20px)`) — карточки
  размываются, проезжая под ним; `.main-content` со `margin:68px auto 0` переведён на
  `padding-top:150px` (компенсация фиксированного header, старт контента сохранён).
  (2) Фон лого-пилюли `.brand-pill` и кнопки баланса `.trw-balance` уведён с
  сине-серого `--app-surface-blur` на новый адаптивный токен `--app-chip-bg`
  (`color-mix` от `--tg-theme-secondary-bg-color`) — серый под тему TG, без синего,
  выделяется на фростед-header. (3) Новые токены `--app-header-bg`/`--app-chip-bg`
  заведены один раз в `:root` через `color-mix` от `--app-bg`/`--app-surface` (сами
  меняются per-theme). (4) Затемнение дока `--app-dock-bg` 0.45→0.35 (dark+light).
  Правки — только `index.css` (саб-агент Haiku, проверено git diff). vitest 25/25, build ок.
  Пуш `366df5f..6f8482f` в GitHub; `vercel deploy --prod` (deployment `orbitmrkt-40frd3h7y`),
  `orbitmrkt.vercel.app` = HTTP 200.
- **Header чуть выше.** `.main-header` `padding-bottom` 12→26px, `.main-content`
  `padding-top` 150→164px (синхронно, без прыжка контента). Только `index.css`, build ок.
- **Header ещё выше + адаптивная позиция баланса под safe-area Telegram.** (A) `.main-header`
  `padding-bottom` 26→44px, `.main-content` `padding-top` 164→182px. (B) Кнопка баланса
  больше не хардкодом `top:98px`: новый `src/lib/insets.ts` — `useTelegramInsets()` +
  чистая `applyInsets()`, читают `safeAreaInset.top`+`contentSafeAreaInset.top` (Bot API 8.0),
  пишут `--tg-content-top` на `<html>`, слушают `safeAreaChanged`/`contentSafeAreaChanged`.
  Хук подключён в `App.tsx`. `.trw-root top` → `calc(var(--tg-content-top, 98px) + 6px)`
  (фолбэк 98px в браузере) — баланс садится впритык под шапку ТГ на любом соотношении
  экрана (1260×2800 и пр.), без костыля-медиазапроса. Тесты `insets.test.ts` (5) —
  всего vitest 30/30, build ок. Файлы: `lib/insets.ts`(+тест), `App.tsx`, `index.css`.
- **Header выше (итерация).** `.main-header padding-bottom` 44→70px, `.main-content
  padding-top` 182→208px. Только `index.css`, build ок. Push + vercel prod deploy.
- **Растушёвка нижнего края header.** В `.main-header` добавлен `mask-image:
  linear-gradient(to bottom, #000 58%, transparent 100%)` (+ `-webkit-`) — фон и блюр
  плавно уходят в прозрачность, без жёсткой линии обрыва. Только `index.css`. Push + deploy.
- **Баланс уходит ЗА header и скроллится с контентом (не плавает).** `<TopRightWidget/>`
  перенесён из прямого ребёнка `.main-screen` внутрь `.main-content` (первым). `.trw-root`
  `position: fixed`→`absolute`, `z-index` 100→1; `.main-content` получил `position: relative`
  (контекст позиционирования). Теперь баланс приклеен к странице, при скролле уезжает под
  фиксированный фростед-header и размывается его `backdrop-filter`, а не висит фиксированно
  поверх. Позиция под шапку ТГ сохранена (`--tg-content-top`). Файлы: `App.tsx`, `index.css`.
  vitest 30/30, build ок. Push + deploy.
- **Header проявляется при прокрутке (reveal-on-scroll).** Вверху фростед-header скрыт
  (`opacity:0; pointer-events:none`), плавно проявляется (`transition .25s`) при скролле
  вниз к карточкам. Порог вынесен в тестируемый `src/lib/scroll.ts` (`isHeaderRevealed`,
  `HEADER_REVEAL_THRESHOLD=96`; overscroll с отрицательным scrollTop → скрыт). `App.tsx`:
  state `headerShown` + `onScroll` на `.main-content` → класс `.is-visible`. Тесты
  `scroll.test.ts` (5) — всего vitest 35/35, build ок. Файлы: `lib/scroll.ts`(+тест),
  `App.tsx`, `index.css`. Push + deploy.
- **Лого-пилюля видна всегда + иконки дока под тему.** (1) Фростед-фон/блюр/маску header'а
  вынес из самого `.main-header` в `.main-header::before` (opacity 0→1 по `.is-visible`) —
  теперь пилюля «Orbit Market» видна всегда, а на прокрутке проявляется только фон. (2) Иконки
  дока (`logo-navbar.svg` #fff + Lottie) были захардкожены белыми → добавлен тема-зависимый
  `filter` на `.nav-item .nav-icon-wrap`: тёмная `brightness(0) invert(1)` (белый), светлая
  `[data-theme='light']` → `brightness(0)` (чёрный). Работает и для SVG, и для Lottie.
  Только `index.css`, build ок. Push + deploy.
- **Header меньше + адаптация экрана загрузки под тему.** (1) `.main-header padding-bottom`
  70→40px, `.main-content padding-top` 208→168px. (2) LoadingScreen был захардкожен тёмным →
  привязан к токенам: фон `hsl(220,13%,13%)`→`var(--app-bg)`, звёзды `white`→
  `var(--app-text-strong)`, трек прогресс-бара `rgba(255,255,255,0.08)`→`var(--app-elevate)`,
  лого — класс `.load-logo` с тема-зависимым `filter` (dark `brightness(0) invert(1)` /
  light `brightness(0)`). Файлы: `App.tsx`, `index.css`. vitest 35/35, build ок. Push + deploy.
- **Тень под эмодзи экрана загрузки.** Центральной Lottie добавлен `filter:
  drop-shadow(0 6px 18px rgba(0,0,0,0.18))` — мягкая тень (заметна на светлой теме).
  Только `App.tsx`, build ок. Push + deploy.
- **Фикс «плавающего» баланса при скролле + прозрачнее док.** (1) Экран переведён на
  паттерн внутреннего скролл-контейнера: `.main-screen` → `height:100dvh; overflow:hidden`
  (убран `padding-bottom:79px`), скролл ушёл внутрь `.main-content` (`min-height:0;
  overflow-y:auto; -webkit-overflow-scrolling:touch; padding-bottom 0→100px под док`).
  Теперь вьюпорт неподвижен → `fixed`-элементы (баланс `.trw-root`, док, `.dock-scrim`)
  и хедер-пилюля перестают дрейфить/дёргаться в вебвью Telegram (в отличие от прошлых
  sticky-на-документе попыток, что откатывались). (2) Док прозрачнее: заведён отдельный
  токен `--app-dock-bg` (dark `rgba(28,32,40,0.45)` / light `rgba(255,255,255,0.45)`),
  `.nav-bar-wrapper` переведён на него, блюр 18→24px. `.trw-balance` и `.brand-pill`
  оставлены на `--app-surface-blur` (их прозрачность не менялась). Правки — только
  `index.css` (саб-агент Haiku, проверено git diff). Тесты vitest 25/25 зелёные,
  `vite build` ок.
- **Пуш на GitHub.** `main` `1d8843a..366df5f` в `github.com/orbitmrkt/orbitmrkt`
  через SSH (алиас `github-orbitmrkt`, ключ `id_ed25519_orbitmrkt`), fast-forward.
- **Деплой на Vercel.** `vercel deploy --prod` (проект `orbit-market`/`orbitmrkt`),
  deployment `dpl_99caXQN2sTkLsQt6pYxjvG1QjuJU`, READY. Публичный `orbitmrkt.vercel.app`
  = HTTP 200. (Голый deploy-URL 302 — Deployment Protection, как и раньше.)

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



- **Favicon.** Из `IMG_9544.PNG` (аватар) сгенерированы `public/favicon.png` (192) и `public/apple-touch-icon.png` (180); в `index.html` ссылка `favicon.svg` → `favicon.png` + apple-touch. Build ок, деплой (Vercel CLI) 200, отдаётся `image/png`.
- **Карточки товаров (фаза 1 — рандом).** `src/lib/mockGifts.ts` — генератор `randomGifts(n)` из выверенного пула 25 реальных гифтов (картинки `nft.fragment.com`, все 200), рандом цена GRAM [0.5..250]. `src/components/GiftCard.tsx` — карточка по макету из `gift-card-export.zip` (фото → имя → `#номер · Minted` → price-pill с GRAM-иконкой + кнопка корзины), на токенах темы + per-card акцент `--gift-accent`; корзина = рабочий toggle, тапы = haptic. `src/lib/haptics.ts` — общий хук. Сетка `.gift-grid` в `MarketPage` (`repeat(auto-fill, minmax(104px,1fr))` → 3–4 в ряд), 24 карточки. Тесты `mockGifts.test.ts` (5) — всего 25 зелёных. typecheck 0, build ок. Фаза 2 (позже): парсинг моделей по ссылке → фон/узоры/Lottie.
