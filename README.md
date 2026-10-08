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

1. Зарегистрируйся на [green-api.com](https://green-api.com) → «Работать бесплатно».
2. Создай инстанс **WhatsApp**, авторизуй через QR.
3. Из карточки инстанса скопируй `idInstance`, `apiTokenInstance`, `apiUrl`.
4. В настройках **Уведомления**:
   - URL отправки уведомлений — **пустой**
   - «Получать уведомления о входящих сообщениях и файлах» — **Да**

Токены в репозиторий не коммить — вводятся в форму логина приложения.

При успешном входе credentials сохраняются в **`sessionStorage`** (ключ `green-api-auth`):  
пережили reload вкладки, сбрасываются при закрытии вкладки/браузера.  
Перед сохранением приложение вызывает `getStateInstance` и пускает дальше только при `authorized`.

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

## Структура

Модульная архитектура (как в BotConversa):

```
src/
  modules/
    auth/                 # логин, credentials
      components/
      helpers/
      hooks/
      stores/
      types/
    chat/                 # чат UI, toChatId
      components/
      helpers/
    common/               # shared GREEN-API client
      api/greenApi/
  App.tsx
  main.tsx
```
