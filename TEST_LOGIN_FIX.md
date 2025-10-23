# Тест исправления логина

## Проблема
Сервер возвращал ошибку `400: Invalid init_data: No hash found in init_data` при попытке входа.

## Исправления

### 1. Обновлен метод `authAPI.login`
```typescript
login: async (credentials, telegramInitData?) => {
  if (telegramInitData) {
    // Используем /auth/login с Telegram данными
    return await api.post('/auth/login', credentials, { headers });
  } else {
    // Используем /auth/login-json без Telegram данных
    return await authAPI.loginJson(credentials);
  }
}
```

### 2. Обновлена логика в authStore
```typescript
if (telegramInitData && isTelegramWebApp()) {
  response = await authAPI.login({ username, password }, telegramInitData);
} else {
  response = await authAPI.loginJson({ username, password });
}
```

### 3. Упрощена логика в LoginPage
```typescript
if (loginMode === 'json') {
  await loginJson(data.username, data.password);
} else {
  await login(data.username, data.password); // Умный выбор endpoint
}
```

## Ожидаемое поведение

### В браузере (не Telegram WebApp):
- `isTelegramWebApp()` возвращает `false`
- `getTelegramInitData()` возвращает `null`
- Используется `/auth/login-json` endpoint
- Отправляется JSON: `{"username": "adilet", "password": "adilet"}`

### В Telegram WebApp:
- `isTelegramWebApp()` возвращает `true`
- `getTelegramInitData()` возвращает Telegram данные
- Используется `/auth/login` endpoint с заголовками Telegram

## Логирование
Добавлены console.log для отладки:
- `🔍 API.login called with: { hasTelegramData: boolean }`
- `🔍 Using /auth/login with Telegram data`
- `🔍 Using /auth/login-json without Telegram data`
