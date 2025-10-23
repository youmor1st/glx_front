# Инструкции по отладке Telegram WebApp

## Проблема
Сервер возвращает ошибку `400: Invalid init_data: No hash found in init_data` при попытке входа.

## Решение
Нужно убедиться, что Telegram WebApp правильно инициализирован и передает корректные initData.

## Инструкции по тестированию

### 1. Откройте приложение в Telegram Mini App
- Убедитесь, что приложение запущено именно в Telegram, а не в браузере
- Откройте консоль разработчика (если доступна)

### 2. Проверьте инициализацию
В консоли должны появиться логи:
```
🚀 Initializing Telegram WebApp...
✅ Telegram WebApp ready and expanded
📋 InitData: user=%7B%22id%22%3A123456%2C%22first_name%22%3A%22Adilet%22%7D&auth_date=1729700400&hash=abcd1234...
✅ Telegram WebApp initialized
✅ Telegram initData: user=%7B%22id%22%3A123456%2C%22first_name%22%3A%22Adilet%22%7D&auth_date=1729700400&hash=abcd1234...
✅ Telegram user: {id: 123456, first_name: "Adilet"}
```

### 3. Используйте Telegram Debug компонент
- Нажмите кнопку "Telegram Debug" на главной странице
- Проверьте, что все поля заполнены корректно
- Нажмите "Test Login with Telegram Data" для тестирования

### 4. Проверьте initData
initData должен содержать:
- `user` - данные пользователя в JSON формате
- `auth_date` - время авторизации
- `hash` - подпись для валидации

Пример корректного initData:
```
user=%7B%22id%22%3A123456%2C%22first_name%22%3A%22Adilet%22%7D&auth_date=1729700400&hash=abcd1234...
```

### 5. Тестирование входа
- Используйте логин: `adilet`
- Используйте пароль: `adilet`
- Система должна автоматически использовать `/auth/login` с Telegram данными

## Возможные проблемы

### Проблема 1: initData пустой или отсутствует
**Решение**: Убедитесь, что приложение запущено в Telegram Mini App, а не в браузере

### Проблема 2: hash отсутствует в initData
**Решение**: Проверьте, что приложение правильно настроено в BotFather

### Проблема 3: Все еще используется /auth/login-json
**Решение**: Проверьте логи в консоли, убедитесь что `isTelegramWebApp()` возвращает `true`

## Логи для отладки

Добавлены следующие логи:
- `🚀 Initializing Telegram WebApp...`
- `✅ Telegram WebApp ready and expanded`
- `📋 InitData: [данные]`
- `🔍 API.login called with: { hasTelegramData: boolean }`
- `🔍 Using /auth/login with Telegram data`
- `🔍 Using /auth/login-json without Telegram data`
