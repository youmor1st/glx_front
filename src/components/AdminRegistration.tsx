import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Text } from '@telegram-apps/telegram-ui';
import { authAPI } from '@/services/api';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
const adminSchema = z.object({
  username: z.string().min(3, 'Имя пользователя должно содержать минимум 3 символа'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  first_name: z.string().min(1, 'Имя обязательно'),
  last_name: z.string().optional(),
  telegram_id: z.number().optional().nullable(),
});

type AdminFormData = z.infer<typeof adminSchema>;

interface AdminRegistrationProps {
  onSuccess: () => void;
  onBackToLogin: () => void;
}

export function AdminRegistration({ onSuccess, onBackToLogin }: AdminRegistrationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usernameCheck, setUsernameCheck] = useState<{ available: boolean; message: string } | null>(null);
  const [telegramUser, setTelegramUser] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
  });

  const username = watch('username');

  useEffect(() => {
    const launchParams = retrieveLaunchParams();
    const isInTelegram = launchParams.tgWebAppData && typeof launchParams.tgWebAppData === 'string' && (launchParams.tgWebAppData as string).length > 0;

    if (isInTelegram && typeof launchParams.tgWebAppData === 'string') {
      try {
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

  const checkUsernameAvailability = async () => {
    if (!username || username.length < 3) return;
    
    try {
      const response = await authAPI.checkUsernameAvailability(username);
      setUsernameCheck(response);
    } catch (error) {
      console.error('Error checking username:', error);
    }
  };

  const onSubmit = async (data: AdminFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Include Telegram ID if available
      const adminData = {
        ...data,
        telegram_id: telegramUser?.id || null,
      };
      
      await authAPI.registerAdmin(adminData);
      onSuccess();
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Ошибка при регистрации админа');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#FFFFFF', marginBottom: '8px' }}>Регистрация админа</h1>
        <p style={{ color: '#C7C7F0', fontSize: '14px' }}>
          Создайте аккаунт администратора для управления системой
        </p>
        {telegramUser && (
          <div style={{
            background: 'rgba(0, 122, 255, 0.1)',
            border: '1px solid #007AFF',
            borderRadius: '8px',
            padding: '12px',
            marginTop: '16px'
          }}>
            <Text style={{ color: '#007AFF', fontSize: '14px', fontWeight: '600' }}>
              Telegram ID: {telegramUser.id}
            </Text>
            <Text style={{ color: '#C7C7F0', fontSize: '12px', marginTop: '4px' }}>
              {telegramUser.first_name} {telegramUser.last_name || ''}
            </Text>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Username Field */}
        <div>
          <Text style={{ color: '#FFFFFF', marginBottom: '8px', fontSize: '14px' }}>
            Имя пользователя *
          </Text>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Input
              {...register('username')}
              placeholder="Введите имя пользователя"
              style={{ flex: 1 }}
              onBlur={checkUsernameAvailability}
            />
            <Button
              type="button"
              onClick={checkUsernameAvailability}
              style={{ 
                background: '#007AFF',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '12px'
              }}
            >
              Проверить
            </Button>
          </div>
          {errors.username && (
            <Text style={{ color: '#FF3B30', fontSize: '12px', marginTop: '4px' }}>
              {errors.username.message}
            </Text>
          )}
          {usernameCheck && (
            <Text style={{ 
              color: usernameCheck.available ? '#34C759' : '#FF3B30', 
              fontSize: '12px', 
              marginTop: '4px' 
            }}>
              {usernameCheck.message}
            </Text>
          )}
        </div>

        {/* Password Field */}
        <div>
          <Text style={{ color: '#FFFFFF', marginBottom: '8px', fontSize: '14px' }}>
            Пароль *
          </Text>
          <Input
            {...register('password')}
            type="password"
            placeholder="Введите пароль"
          />
          {errors.password && (
            <Text style={{ color: '#FF3B30', fontSize: '12px', marginTop: '4px' }}>
              {errors.password.message}
            </Text>
          )}
        </div>

        {/* First Name Field */}
        <div>
          <Text style={{ color: '#FFFFFF', marginBottom: '8px', fontSize: '14px' }}>
            Имя *
          </Text>
          <Input
            {...register('first_name')}
            placeholder="Введите имя"
          />
          {errors.first_name && (
            <Text style={{ color: '#FF3B30', fontSize: '12px', marginTop: '4px' }}>
              {errors.first_name.message}
            </Text>
          )}
        </div>

        {/* Last Name Field */}
        <div>
          <Text style={{ color: '#FFFFFF', marginBottom: '8px', fontSize: '14px' }}>
            Фамилия
          </Text>
          <Input
            {...register('last_name')}
            placeholder="Введите фамилию (необязательно)"
          />
          {errors.last_name && (
            <Text style={{ color: '#FF3B30', fontSize: '12px', marginTop: '4px' }}>
              {errors.last_name.message}
            </Text>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(255, 59, 48, 0.1)',
            border: '1px solid #FF3B30',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px'
          }}>
            <Text style={{ color: '#FF3B30', fontSize: '14px' }}>
              {error}
            </Text>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || (usernameCheck ? !usernameCheck.available : false)}
          style={{
            background: '#007AFF',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1
          }}
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрировать админа'}
        </Button>

        {/* Back to Login Button */}
        <Button
          type="button"
          onClick={onBackToLogin}
          style={{
            background: 'transparent',
            color: '#C7C7F0',
            border: '1px solid #C7C7F0',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Вернуться к входу
        </Button>
      </form>
    </div>
  );
}
