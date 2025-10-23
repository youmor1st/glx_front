import { Button, Text } from '@telegram-apps/telegram-ui';

interface HomePageProps {
  onAdminRegistration: () => void;
  onLogin: () => void;
  onLoginDemo: () => void;
  onTelegramDebug: () => void;
}

export function HomePage({ onAdminRegistration, onLogin, onLoginDemo, onTelegramDebug }: HomePageProps) {
  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ color: '#FFFFFF', marginBottom: '8px', fontSize: '24px' }}>
          Система баллов
        </h1>
        <p style={{ color: '#C7C7F0', fontSize: '16px', lineHeight: '1.5' }}>
          Добро пожаловать в систему управленdfydия баллами для студентов
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Admin Registration Button */}
        <Button
          onClick={onAdminRegistration}
          style={{
            background: '#007AFF',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            padding: '20px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <Text style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '600' }}>
              Регистрация админа
            </Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
              Создать аккаунт администратора
            </Text>
          </div>
        </Button>

        {/* Login Button */}
        <Button
          onClick={onLogin}
          style={{
            background: 'transparent',
            color: '#C7C7F0',
            border: '2px solid #C7C7F0',
            borderRadius: '12px',
            padding: '20px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <Text style={{ color: '#C7C7F0', fontSize: '16px', fontWeight: '600' }}>
              Войти в систему
            </Text>
            <Text style={{ color: 'rgba(199, 199, 240, 0.8)', fontSize: '14px' }}>
              Войти с существующим аккаунтом
            </Text>
          </div>
        </Button>

        {/* Login Demo Button */}
        <Button
          onClick={onLoginDemo}
          style={{
            background: 'rgba(255, 193, 7, 0.2)',
            color: '#FFC107',
            border: '2px solid #FFC107',
            borderRadius: '12px',
            padding: '20px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <Text style={{ color: '#FFC107', fontSize: '16px', fontWeight: '600' }}>
              Демо входа
            </Text>
            <Text style={{ color: 'rgba(255, 193, 7, 0.8)', fontSize: '14px' }}>
              Тестирование различных методов входа
            </Text>
          </div>
        </Button>

        {/* Telegram Debug Button */}
        <Button
          onClick={onTelegramDebug}
          style={{
            background: 'rgba(255, 87, 34, 0.2)',
            color: '#FF5722',
            border: '2px solid #FF5722',
            borderRadius: '12px',
            padding: '20px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <Text style={{ color: '#FF5722', fontSize: '16px', fontWeight: '600' }}>
              Telegram Debug
            </Text>
            <Text style={{ color: 'rgba(255, 87, 34, 0.8)', fontSize: '14px' }}>
              Отладка Telegram WebApp данных
            </Text>
          </div>
        </Button>
      </div>

      <div style={{ 
        marginTop: '32px', 
        padding: '16px', 
        background: 'rgba(255, 255, 255, 0.05)', 
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <Text style={{ color: '#C7C7F0', fontSize: '14px', lineHeight: '1.5', textAlign: 'center' }}>
          Если вы администратор и впервые используете систему, нажмите "Регистрация админа". 
          Если у вас уже есть аккаунт, нажмите "Войти в систему".
        </Text>
      </div>
    </div>
  );
}
