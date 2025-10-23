import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Text } from '@telegram-apps/telegram-ui';
import { useAuthStore } from '@/store/authStore';
import { getTelegramUser, isTelegramWebApp, initTelegramWebApp } from '@/utils/telegram';

const loginSchema = z.object({
  username: z.string().min(1, 'Введите имя пользователя'),
  password: z.string().min(1, 'Введите пароль'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginPageProps {
  onSuccess: () => void;
}

export function LoginPage({ onSuccess }: LoginPageProps) {
  const { 
    login, 
    quickLogin,
    telegramLogin,
    loginJson,
    isLoading, 
    error, 
    clearError, 
    isTelegramAvailable,
    checkTelegramAvailability 
  } = useAuthStore();
  const [telegramUser, setTelegramUser] = useState<any>(null);
  const [loginMode, setLoginMode] = useState<'first-time' | 'quick' | 'json'>('first-time');
  const [isCheckingQuickLogin, setIsCheckingQuickLogin] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    // Initialize Telegram WebApp
    initTelegramWebApp();
    
    // Check Telegram availability
    checkTelegramAvailability();
    
    // Get Telegram user data
    const user = getTelegramUser();
    setTelegramUser(user);
    
    // Auto-attempt quick login first if in Telegram WebApp
    if (isTelegramWebApp() && user) {
      attemptQuickLogin();
    }
  }, [checkTelegramAvailability]);

  const attemptQuickLogin = async () => {
    try {
      setIsCheckingQuickLogin(true);
      clearError();
      await quickLogin();
      onSuccess();
    } catch (error) {
      // Quick login failed, show first-time login form
      console.log('Quick login failed, showing first-time login form');
      setLoginMode('first-time');
    } finally {
      setIsCheckingQuickLogin(false);
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError();
      if (loginMode === 'json') {
        await loginJson(data.username, data.password);
      } else {
        await login(data.username, data.password);
      }
      onSuccess();
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleQuickLogin = async () => {
    if (!isTelegramWebApp()) return;

    try {
      clearError();
      await quickLogin();
      onSuccess();
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleRetryQuickLogin = async () => {
    await attemptQuickLogin();
  };

  const handleTelegramLogin = async () => {
    if (!isTelegramWebApp()) return;

    try {
      clearError();
      await telegramLogin();
      onSuccess();
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#FFFFFF', marginBottom: '8px' }}>Вход в систему</h1>
        <p style={{ color: '#C7C7F0', fontSize: '14px' }}>
          {isCheckingQuickLogin
            ? 'Проверка быстрого входа...'
            : loginMode === 'quick' 
            ? 'Быстрый вход через Telegram'
            : loginMode === 'json'
            ? 'Вход для администраторов'
            : 'Войдите в свой аккаунт для доступа к системе баллов'
          }
        </p>
      </div>

      {/* Quick Login Check Loading */}
      {isCheckingQuickLogin && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: '40px 20px',
          marginBottom: '20px'
        }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(255,255,255,0.3)',
              borderTop: '3px solid #6932EB',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <p style={{ 
            margin: '0 0 0 16px', 
            color: '#C7C7F0',
            fontSize: '14px'
          }}>
            Проверяем быстрый вход...
          </p>
        </div>
      )}

      {/* Login Mode Selector - Hidden during quick login check */}
      {!isCheckingQuickLogin && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: '8px', 
            padding: '4px',
            marginBottom: '16px'
          }}>
            <button
              onClick={() => setLoginMode('first-time')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                background: loginMode === 'first-time' ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: '#FFFFFF',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Первый вход
            </button>
            <button
              onClick={() => setLoginMode('quick')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                background: loginMode === 'quick' ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: '#FFFFFF',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Быстрый вход
            </button>
            <button
              onClick={() => setLoginMode('json')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '6px',
                border: 'none',
                background: loginMode === 'json' ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: '#FFFFFF',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              JSON вход
            </button>
          </div>
        </div>
      )}

      {error && !isCheckingQuickLogin && (
        <div
          style={{
            background: 'rgba(236, 57, 66, 0.1)',
            border: '1px solid rgba(236, 57, 66, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
            color: '#ec3942',
            fontSize: '14px',
          }}
        >
          {error}
        </div>
      )}

      {/* Quick Login Mode - Hidden during quick login check */}
      {!isCheckingQuickLogin && loginMode === 'quick' && isTelegramAvailable && telegramUser && (
        <div style={{ marginBottom: '20px' }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: '14px', marginBottom: '8px', fontWeight: '500' }}>
              Telegram аккаунт
            </Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                {telegramUser.first_name?.[0] || 'U'}
              </div>
              <div>
                <Text style={{ color: '#FFFFFF', fontSize: '14px', margin: '0' }}>
                  {telegramUser.first_name} {telegramUser.last_name || ''}
                </Text>
                {telegramUser.username && (
                  <Text style={{ color: '#C7C7F0', fontSize: '12px', margin: '0' }}>
                    @{telegramUser.username}
                  </Text>
                )}
              </div>
            </div>
          </div>
          <Button
            onClick={handleQuickLogin}
            size="l"
            disabled={isLoading}
            style={{ width: '100%' }}
          >
            {isLoading ? 'Вход...' : 'Быстрый вход'}
          </Button>
        </div>
      )}

      {/* Username/Password Login Mode - Hidden during quick login check */}
      {!isCheckingQuickLogin && (loginMode === 'first-time' || loginMode === 'json') && (
        <form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <Text style={{ marginBottom: '8px', color: '#FFFFFF', fontSize: '14px', fontWeight: '500' }}>
              Имя пользователя
            </Text>
            <Input
              {...register('username')}
              placeholder="Введите имя пользователя"
              disabled={isLoading}
            />
            {errors.username && (
              <Text style={{ color: '#ec3942', fontSize: '12px', marginTop: '4px' }}>
                {errors.username.message}
              </Text>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <Text style={{ marginBottom: '8px', color: '#FFFFFF', fontSize: '14px', fontWeight: '500' }}>
              Пароль
            </Text>
            <Input
              {...register('password')}
              type="password"
              placeholder="Введите пароль"
              disabled={isLoading}
            />
            {errors.password && (
              <Text style={{ color: '#ec3942', fontSize: '12px', marginTop: '4px' }}>
                {errors.password.message}
              </Text>
            )}
          </div>

          <Button
            type="submit"
            size="l"
            disabled={isLoading}
            style={{ width: '100%' }}
          >
            {isLoading ? 'Вход...' : loginMode === 'first-time' ? 'Войти и привязать Telegram' : 'Войти'}
          </Button>
        </form>
      )}

      {/* Retry Quick Login Button - Show when first-time login is shown */}
      {!isCheckingQuickLogin && loginMode === 'first-time' && isTelegramWebApp() && telegramUser && (
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Button
            onClick={handleRetryQuickLogin}
            size="m"
            disabled={isLoading}
            style={{ 
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#C7C7F0'
            }}
          >
            Попробовать быстрый вход снова
          </Button>
        </div>
      )}

      {/* Additional Telegram Login Option - Hidden during quick login check */}
      {!isCheckingQuickLogin && loginMode !== 'quick' && isTelegramAvailable && telegramUser && (
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ color: '#C7C7F0', fontSize: '14px', marginBottom: '12px', textAlign: 'center' }}>
            Или войдите через Telegram
          </p>
          <Button
            onClick={handleTelegramLogin}
            size="l"
            disabled={isLoading}
            style={{ width: '100%' }}
          >
            {isLoading ? 'Вход...' : 'Войти через Telegram'}
          </Button>
        </div>
      )}

      {!isCheckingQuickLogin && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ color: '#9EA0C8', fontSize: '12px' }}>
            {loginMode === 'first-time' && isTelegramWebApp()
              ? 'После первого входа ваш Telegram ID будет привязан к аккаунту'
              : loginMode === 'quick'
              ? 'Быстрый вход доступен только для уже привязанных аккаунтов'
              : 'Войдите с помощью имени пользователя и пароля'
            }
          </p>
        </div>
      )}
    </div>
  );
}
