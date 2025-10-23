import { useState } from 'react';
import { Button, Input, Text } from '@telegram-apps/telegram-ui';
import { useAuthStore } from '@/store/authStore';
import { getTelegramUser, isTelegramWebApp, getTelegramInitData } from '@/utils/telegram';

export function LoginDemo() {
  const { 
    login, 
    quickLogin,
    telegramLogin,
    loginJson,
    isLoading, 
    error, 
    clearError,
    user,
    isAuthenticated
  } = useAuthStore();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showResults, setShowResults] = useState(false);

  const telegramUser = getTelegramUser();
  const initData = getTelegramInitData();

  const handleLogin = async (type: 'first-time' | 'quick' | 'telegram' | 'json') => {
    try {
      clearError();
      setShowResults(true);
      
      switch (type) {
        case 'first-time':
          await login(username, password);
          break;
        case 'quick':
          await quickLogin();
          break;
        case 'telegram':
          await telegramLogin();
          break;
        case 'json':
          await loginJson(username, password);
          break;
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = () => {
    useAuthStore.getState().logout();
    setShowResults(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#FFFFFF', marginBottom: '8px' }}>Login System Demo</h1>
        <p style={{ color: '#C7C7F0', fontSize: '14px' }}>
          Тестирование различных методов входа в систему
        </p>
      </div>

      {/* Telegram Info */}
      {isTelegramWebApp() && (
        <div style={{ 
          background: 'rgba(0, 123, 255, 0.1)', 
          border: '1px solid rgba(0, 123, 255, 0.3)', 
          borderRadius: '8px', 
          padding: '16px', 
          marginBottom: '20px' 
        }}>
          <Text style={{ color: '#007bff', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
            Telegram WebApp Info
          </Text>
          <div style={{ color: '#FFFFFF', fontSize: '12px' }}>
            <p>Available: {isTelegramWebApp() ? 'Yes' : 'No'}</p>
            <p>User: {telegramUser ? `${telegramUser.first_name} ${telegramUser.last_name || ''}` : 'None'}</p>
            <p>Init Data: {initData ? 'Available' : 'None'}</p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={{
          background: 'rgba(236, 57, 66, 0.1)',
          border: '1px solid rgba(236, 57, 66, 0.3)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px',
          color: '#ec3942',
          fontSize: '14px',
        }}>
          {error}
        </div>
      )}

      {/* Login Forms */}
      <div style={{ display: 'grid', gap: '20px' }}>
        
        {/* First-time Login */}
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '8px', 
          padding: '16px' 
        }}>
          <Text style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>
            1. Первый вход (First-time Login)
          </Text>
          <Text style={{ color: '#C7C7F0', fontSize: '12px', marginBottom: '16px' }}>
            Вход с именем пользователя и паролем + привязка Telegram ID
          </Text>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              style={{ flex: 1 }}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              style={{ flex: 1 }}
            />
          </div>
          <Button
            onClick={() => handleLogin('first-time')}
            disabled={isLoading || !username || !password}
            style={{ width: '100%' }}
          >
            {isLoading ? 'Loading...' : 'First-time Login'}
          </Button>
        </div>

        {/* Quick Login */}
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '8px', 
          padding: '16px' 
        }}>
          <Text style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>
            2. Быстрый вход (Quick Login)
          </Text>
          <Text style={{ color: '#C7C7F0', fontSize: '12px', marginBottom: '16px' }}>
            Вход только через Telegram для уже привязанных аккаунтов
          </Text>
          <Button
            onClick={() => handleLogin('quick')}
            disabled={isLoading || !isTelegramWebApp()}
            style={{ width: '100%' }}
          >
            {isLoading ? 'Loading...' : 'Quick Login'}
          </Button>
        </div>

        {/* Telegram Login */}
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '8px', 
          padding: '16px' 
        }}>
          <Text style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>
            3. Telegram Login
          </Text>
          <Text style={{ color: '#C7C7F0', fontSize: '12px', marginBottom: '16px' }}>
            Вход через валидированные Telegram initData
          </Text>
          <Button
            onClick={() => handleLogin('telegram')}
            disabled={isLoading || !isTelegramWebApp()}
            style={{ width: '100%' }}
          >
            {isLoading ? 'Loading...' : 'Telegram Login'}
          </Button>
        </div>

        {/* JSON Login */}
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '8px', 
          padding: '16px' 
        }}>
          <Text style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>
            4. JSON Login (Admin)
          </Text>
          <Text style={{ color: '#C7C7F0', fontSize: '12px', marginBottom: '16px' }}>
            Вход без Telegram ID (для администраторов)
          </Text>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              style={{ flex: 1 }}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              style={{ flex: 1 }}
            />
          </div>
          <Button
            onClick={() => handleLogin('json')}
            disabled={isLoading || !username || !password}
            style={{ width: '100%' }}
          >
            {isLoading ? 'Loading...' : 'JSON Login'}
          </Button>
        </div>
      </div>

      {/* Results */}
      {showResults && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ 
            background: 'rgba(40, 167, 69, 0.1)', 
            border: '1px solid rgba(40, 167, 69, 0.3)', 
            borderRadius: '8px', 
            padding: '16px' 
          }}>
            <Text style={{ color: '#28a745', fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>
              Login Results
            </Text>
            <div style={{ color: '#FFFFFF', fontSize: '12px' }}>
              <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
              {user && (
                <>
                  <p>User ID: {user.id}</p>
                  <p>Username: {user.username}</p>
                  <p>Name: {user.first_name} {user.last_name || ''}</p>
                  <p>Role: {user.role}</p>
                  <p>Telegram ID: {user.telegram_id || 'Not linked'}</p>
                </>
              )}
            </div>
            {isAuthenticated && (
              <Button
                onClick={handleLogout}
                style={{ 
                  marginTop: '12px', 
                  background: 'rgba(220, 53, 69, 0.8)',
                  border: 'none'
                }}
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      )}

      {/* API Endpoints Info */}
      <div style={{ marginTop: '20px' }}>
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '8px', 
          padding: '16px' 
        }}>
          <Text style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>
            Backend API Endpoints
          </Text>
          <div style={{ color: '#C7C7F0', fontSize: '12px', fontFamily: 'monospace' }}>
            <p>POST /auth/login - First-time login with Telegram binding</p>
            <p>POST /auth/quick - Quick login for linked accounts</p>
            <p>POST /auth/telegram-login - Login with validated initData</p>
            <p>POST /auth/login-json - JSON login without Telegram</p>
            <p>GET /auth/me - Get current user profile</p>
          </div>
        </div>
      </div>
    </div>
  );
}
