# GREEN-API Chat

Тестовое задание: веб-чат на React + [GREEN-API](https://green-api.com) (WhatsApp).  
Отправка и получение текстовых сообщений. UI в духе [web.max.ru](https://web.max.ru/).

## Стек

- Vite
- React 19
- TypeScript
- Zustand
- CSS Modules
- oxlint + Prettier (без ESLint, без TanStack Query)

## Подготовка GREEN-API

1. Зарегистрируйся на [green-api.com](https://green-api.com) → инстанс **WhatsApp**.
2. Авторизуй инстанс через QR в кабинете.
3. Из карточки инстанса скопируй `idInstance`, `apiTokenInstance`, `apiUrl`.
4. В настройках **Уведомления** ([HTTP API](https://green-api.com/docs/api/receiving/technology-http-api/)):
   - URL отправки уведомлений (`webhookUrl`) — **пустой**
   - «Получать уведомления о входящих сообщениях и файлах» — **Да**

Токены в репозиторий не коммить — вводятся в форму логина приложения.

При успешном входе credentials сохраняются в **`sessionStorage`** (ключ `green-api-auth`):  
пережили reload вкладки, сбрасываются при закрытии вкладки/браузера.  
Перед сохранением приложение вызывает `getStateInstance` и пускает дальше только при `authorized`.  
Если во время работы GREEN-API ответит 401/403, сессия завершается и открывается форма логина.

Чаты и сообщения хранятся **только в памяти** (Zustand без persist): после reload логин сохраняется,  
а список чатов пуст — новые сообщения снова придут через `receiveNotification`.

Отправка: [`SendMessage`](https://green-api.com/docs/api/sending/SendMessage/) (`chatId` + `message`, лимит 4000 символов).  
Приём: `receiveNotification` → обработка текста → `deleteNotification`.

## Запуск

```bash
pnpm install
pnpm dev
```

Сборка:

```bash
pnpm build
pnpm preview
```

Проверки:

```bash
pnpm typecheck
pnpm lint
pnpm prettier
pnpm prettier:fix
```

## Деплой (Vercel)

1. Импортируй репозиторий в [Vercel](https://vercel.com).
2. Framework Preset: **Vite**, Build Command: `pnpm build`, Output: `dist`.
3. `vercel.json` уже содержит SPA rewrite на `index.html`.

Либо CLI:

```bash
npx vercel
```

## Структура

```
src/
  modules/
    auth/                 # логин, credentials
      components/LoginScreen(+ elements/LoginField)
      helpers/ hooks/ stores/ types/
    chat/                 # список чатов, переписка, polling уведомлений
      components/AuthenticatedShell(+ elements/ChatSidebar, ChatThread(+ units/MessageBubble))
      constants/ helpers/ hooks/ stores/ types/
    common/               # shared GREEN-API client, AppLoader
      api/greenApi/
      components/AppLoader/
  App.tsx
  main.tsx
```
