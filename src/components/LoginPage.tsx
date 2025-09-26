import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Text } from '@telegram-apps/telegram-ui';
import { useAuthStore } from '@/store/authStore';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

const loginSchema = z.object({
  username: z.string().min(1, 'Введите имя пользователя'),
  password: z.string().min(1, 'Введите пароль'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginPageProps {
  onSuccess: () => void;
}

export function LoginPage({ onSuccess }: LoginPageProps) {
  const { login, isLoading, error, clearError } = useAuthStore();
  const [isTelegramAvailable, setIsTelegramAvailable] = useState(false);
  const [telegramUser, setTelegramUser] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    // Check if we're in Telegram environment
    const launchParams = retrieveLaunchParams();
    const isInTelegram = launchParams.tgWebAppData && typeof launchParams.tgWebAppData === 'string' && (launchParams.tgWebAppData as string).length > 0;
    setIsTelegramAvailable(!!isInTelegram);

    if (isInTelegram && typeof launchParams.tgWebAppData === 'string') {
      try {
        // Parse Telegram user data from init data
        const urlParams = new URLSearchParams(launchParams.tgWebAppData);
        const userParam = urlParams.get('user');
        if (userParam) {
          const user = JSON.parse(userParam);
          setTelegramUser(user);
        }
      } catch (error) {
        console.error('Error parsing Telegram user data:', error);
      }
    }
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError();
      await login(data.username, data.password);
      onSuccess();
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleTelegramLogin = async () => {
    if (!telegramUser) return;

    try {
      clearError();
      const launchParams = retrieveLaunchParams();
      
      if (typeof launchParams.tgWebAppData === 'string') {
        const urlParams = new URLSearchParams(launchParams.tgWebAppData);
        
        const telegramData = {
          id: telegramUser.id,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name || '',
          username: telegramUser.username || '',
          auth_date: parseInt(urlParams.get('auth_date') || '0'),
          hash: urlParams.get('hash') || '',
        };

        await login(telegramData.username, 'telegram_auth');
        onSuccess();
      }
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#FFFFFF', marginBottom: '8px' }}>Вход в ewqeсистему</h1>
        <p style={{ color: '#C7C7F0', fontSize: '14px' }}>
          Войдите в свой аккаунт для доступа к системе баллов asdd
        </p>
      </div>

      {error && (
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
          {isLoading ? 'Вход...' : 'Войти'}
        </Button>
      </form>

      {isTelegramAvailable && telegramUser && (
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ color: '#C7C7F0', fontSize: '14px', marginBottom: '12px', textAlign: 'center' }}>
            Или войдите через Telegram
          </p>
          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '12px',
            }}
          >
            <p style={{ color: '#FFFFFF', fontSize: '14px', margin: '0 0 4px 0' }}>
              {telegramUser.first_name} {telegramUser.last_name || ''}
            </p>
            {telegramUser.username && (
              <p style={{ color: '#C7C7F0', fontSize: '12px', margin: '0' }}>
                @{telegramUser.username}
              </p>
            )}
          </div>
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

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p style={{ color: '#9EA0C8', fontSize: '12px' }}>
          После входа ваш Telegram ID будет привязан к аккаунту
        </p>
      </div>
    </div>
  );
}
