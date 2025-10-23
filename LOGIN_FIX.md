# Исправление проблемы с логином

## Проблема
Сервер возвращал ошибку `400: Invalid init_data: No hash found in init_data` при попытке входа через `/auth/login` endpoint без Telegram данных.

## Причина
- Endpoint `/auth/login` ожидает Telegram Init Data для валидации
- Когда пользователь не в Telegram WebApp, мы все равно пытались использовать этот endpoint
- Нужно использовать разные endpoints в зависимости от контекста

## Решение

### 1. Обновлена логика выбора endpoint

```typescript
// В authStore.ts
if (telegramInitData && isTelegramWebApp()) {
  // Используем /auth/login с Telegram данными
  response = await authAPI.loginForm({ username, password }, telegramInitData);
} else {
  // Используем /auth/login-json без Telegram данных
  response = await authAPI.loginJson({ username, password });
}
```

### 2. Обновлена логика в LoginPage

```typescript
// В LoginPage.tsx
if (loginMode === 'json') {
  await loginJson(data.username, data.password);
} else if (loginMode === 'first-time' && isTelegramWebApp()) {
  // Используем обычный login с Telegram данными
  await login(data.username, data.password);
} else {
  // Используем JSON login для не-Telegram окружений
  await loginJson(data.username, data.password);
}
```

### 3. Автоматическое определение режима

```typescript
// Если не в Telegram WebApp, автоматически переключаемся на JSON режим
if (!isTelegramWebApp()) {
  setLoginMode('json');
}
```

## Результат

Теперь система правильно выбирает endpoint:

- **В Telegram WebApp**: `/auth/login` с Telegram Init Data
- **В браузере**: `/auth/login-json` без Telegram данных
- **Quick Login**: `/auth/quick` для уже привязанных аккаунтов
- **Telegram Login**: `/auth/telegram-login` для валидированных данных

## Тестирование

Используйте LoginDemo компонент для тестирования всех методов входа:
- Первый вход в Telegram WebApp
- JSON вход в браузере
- Quick вход для привязанных аккаунтов
- Telegram вход с валидацией
