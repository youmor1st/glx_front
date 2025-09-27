# 🔐 Frontend Authentication System

## Обзор

Система аутентификации для Telegram Mini App с поддержкой двух сценариев входа:
1. **Первый вход** - с username и password (привязывает Telegram ID)
2. **Быстрый вход** - только через Telegram Init Data

## 🚀 Быстрый старт

### 1. Импорт и инициализация

```typescript
import { useAuthStore } from '@/store/authStore';
import { initTelegramWebApp, getTelegramUser } from '@/utils/telegram';

// Инициализация Telegram WebApp
useEffect(() => {
  initTelegramWebApp();
}, []);
```

### 2. Первый вход (привязка Telegram ID)

```typescript
const { login, isLoading, error } = useAuthStore();

const handleFirstLogin = async () => {
  try {
    await login('student1', 'password123');
    // Telegram ID автоматически извлекается из X-Telegram-Init-Data
    console.log('Успешный вход!');
  } catch (error) {
    console.error('Ошибка входа:', error);
  }
};
```

### 3. Быстрый вход (только Telegram)

```typescript
const { telegramLogin } = useAuthStore();

const handleQuickLogin = async () => {
  try {
    await telegramLogin();
    // Использует только Telegram Init Data
    console.log('Быстрый вход выполнен!');
  } catch (error) {
    console.error('Ошибка входа:', error);
  }
};
```

## 📋 API Endpoints

### POST /auth/login
**Первый вход с привязкой Telegram ID**

```typescript
// Headers
Content-Type: application/json
X-Telegram-Init-Data: {telegram_init_data}

// Body
{
  "username": "student1",
  "password": "password123"
}

// Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "role": "student",
  "user_id": 1,
  "username": "student1",
  "first_name": "Алексей",
  "last_name": "Петров",
  "telegram_id": 123456789,
  "telegram_linked": true
}
```

### POST /auth/telegram-login
**Быстрый вход через Telegram Init Data**

```typescript
// Headers
Content-Type: application/json

// Body
{
  "init_data": "user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22John%22%7D&auth_date=1234567890&hash=..."
}

// Response (аналогичен /auth/login)
```

## 🛠 Утилиты Telegram

### Основные функции

```typescript
import { 
  getTelegramWebApp,
  isTelegramWebApp,
  getTelegramInitData,
  getTelegramUser,
  getTelegramUserId,
  hasTelegramUser,
  initTelegramWebApp,
  showTelegramAlert,
  showTelegramConfirm,
  triggerHapticFeedback,
  closeTelegramWebApp
} from '@/utils/telegram';

// Проверка доступности Telegram WebApp
const isAvailable = isTelegramWebApp();

// Получение данных пользователя
const user = getTelegramUser();
const userId = getTelegramUserId();

// Получение Init Data
const initData = getTelegramInitData();

// Инициализация
initTelegramWebApp();

// Уведомления
await showTelegramAlert('Сообщение');
const confirmed = await showTelegramConfirm('Подтвердить?');

// Тактильная обратная связь
triggerHapticFeedback('impact', 'medium');
triggerHapticFeedback('notification', 'success');

// Закрытие приложения
closeTelegramWebApp();
```

## 🔧 Zustand Store

### Состояние

```typescript
interface AuthState {
  user: User | null;                    // Данные пользователя
  isAuthenticated: boolean;             // Статус аутентификации
  isLoading: boolean;                   // Состояние загрузки
  error: string | null;                 // Ошибка
  telegramId: number | null;            // Telegram ID
  isTelegramAvailable: boolean;         // Доступность Telegram WebApp
}
```

### Методы

```typescript
const {
  // Аутентификация
  login,                    // Первый вход (username + password)
  telegramLogin,           // Быстрый вход (только Telegram)
  logout,                  // Выход
  
  // Управление состоянием
  setUser,                 // Установить пользователя
  setLoading,              // Установить загрузку
  setError,                // Установить ошибку
  clearError,              // Очистить ошибку
  checkAuth,               // Проверить аутентификацию
  setTelegramId,           // Установить Telegram ID
  checkTelegramAvailability // Проверить доступность Telegram
} = useAuthStore();
```

## 🎯 Предустановленные аккаунты

### Студенты (пароль: password123)
- `student1` - Алексей Петров (11A)
- `student2` - Мария Иванова (11A)
- `student3` - Дмитрий Сидоров (11B)
- `student4` - Анна Козлова (11B)
- `student5` - Иван Морозов (10A)

### Учителя (пароль: password123)
- `teacher1` - Елена Васильева
- `teacher2` - Сергей Николаев
- `teacher3` - Ольга Смирнова

### Администраторы (пароль: password123)
- `admin1` - Админ Главный
- `admin2` - Заместитель Админа

## 🔒 Безопасность

- Telegram ID привязывается к аккаунту только один раз
- Один Telegram ID не может быть привязан к нескольким аккаунтам
- Токены действуют 24 часа
- Все запросы требуют Bearer токен в заголовке Authorization
- Telegram Init Data валидируется на сервере

## 📱 Примеры использования

### Полный пример компонента

```typescript
import React, { useEffect } from 'react';
import { Button, Text } from '@telegram-apps/telegram-ui';
import { useAuthStore } from '@/store/authStore';
import { initTelegramWebApp, getTelegramUser } from '@/utils/telegram';

export function LoginComponent() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error, 
    login, 
    telegramLogin, 
    logout 
  } = useAuthStore();

  useEffect(() => {
    initTelegramWebApp();
  }, []);

  const handleFirstLogin = async () => {
    try {
      await login('student1', 'password123');
    } catch (error) {
      console.error('Ошибка входа:', error);
    }
  };

  const handleQuickLogin = async () => {
    try {
      await telegramLogin();
    } catch (error) {
      console.error('Ошибка входа:', error);
    }
  };

  return (
    <div>
      {!isAuthenticated ? (
        <div>
          <Button onClick={handleFirstLogin} disabled={isLoading}>
            Первый вход
          </Button>
          <Button onClick={handleQuickLogin} disabled={isLoading}>
            Быстрый вход
          </Button>
        </div>
      ) : (
        <div>
          <Text>Добро пожаловать, {user?.first_name}!</Text>
          <Button onClick={logout}>Выйти</Button>
        </div>
      )}
    </div>
  );
}
```

### Обработка ошибок

```typescript
const { error, clearError } = useAuthStore();

useEffect(() => {
  if (error) {
    // Показать уведомление об ошибке
    showTelegramAlert(error);
    clearError();
  }
}, [error, clearError]);
```

## 🚨 Коды ошибок

- `400 Bad Request` - Telegram ID уже привязан к другому пользователю
- `401 Unauthorized` - Неверный username/password
- `404 Not Found` - Пользователь не найден (для telegram-login)

## 📚 Дополнительные ресурсы

- [Telegram WebApp API](https://core.telegram.org/bots/webapps)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [React Hook Form](https://react-hook-form.com/)

## 🔄 Workflow

1. **Первый запуск приложения:**
   - Инициализация Telegram WebApp
   - Проверка доступности Telegram
   - Получение данных пользователя

2. **Первый вход:**
   - Пользователь вводит username и password
   - Отправляется запрос с X-Telegram-Init-Data
   - Сервер привязывает Telegram ID к аккаунту

3. **Последующие входы:**
   - Используется только Telegram Init Data
   - Сервер находит пользователя по Telegram ID
   - Выдается токен доступа

4. **Выход:**
   - Очистка токена и данных пользователя
   - Сброс состояния аутентификации
