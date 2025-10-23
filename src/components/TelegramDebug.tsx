import { useState, useEffect } from 'react';
import { Button, Text } from '@telegram-apps/telegram-ui';
import { getTelegramWebApp, getTelegramInitData, getTelegramUser, isTelegramWebApp } from '@/utils/telegram';

export function TelegramDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const webApp = getTelegramWebApp();
    const initData = getTelegramInitData();
    const user = getTelegramUser();
    const isTelegram = isTelegramWebApp();

    setDebugInfo({
      isTelegramWebApp: isTelegram,
      webApp: webApp ? 'Available' : 'Not available',
      initData: initData || 'Not available',
      user: user || 'Not available',
      rawInitData: typeof window !== 'undefined' && window.Telegram?.WebApp?.initData || 'Not available',
    });
  }, []);

  const testLogin = async () => {
    const initData = getTelegramInitData();
    console.log('🔍 Testing login with initData:', initData);
    
    if (initData) {
      // Test the login with Telegram data
      try {
        const response = await fetch('https://dem-1-w8zo.onrender.com/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Telegram-Init-Data': initData,
          },
          body: JSON.stringify({
            username: 'adilet',
            password: 'adilet'
          })
        });
        
        const result = await response.text();
        console.log('🔍 Login test result:', result);
      } catch (error) {
        console.error('🔍 Login test error:', error);
      }
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#FFFFFF', marginBottom: '8px' }}>Telegram WebApp Debug</h1>
        <p style={{ color: '#C7C7F0', fontSize: '14px' }}>
          Отладочная информация для Telegram WebApp
        </p>
      </div>

      {debugInfo && (
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '8px', 
          padding: '20px',
          marginBottom: '20px'
        }}>
          <Text style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>
            Debug Information
          </Text>
          
          <div style={{ color: '#C7C7F0', fontSize: '12px', fontFamily: 'monospace' }}>
            <p><strong>Is Telegram WebApp:</strong> {debugInfo.isTelegramWebApp ? 'Yes' : 'No'}</p>
            <p><strong>WebApp Available:</strong> {debugInfo.webApp}</p>
            <p><strong>InitData:</strong> {debugInfo.initData}</p>
            <p><strong>Raw InitData:</strong> {debugInfo.rawInitData}</p>
            <p><strong>User:</strong> {typeof debugInfo.user === 'object' ? JSON.stringify(debugInfo.user, null, 2) : debugInfo.user}</p>
          </div>
        </div>
      )}

      <div style={{ 
        background: 'rgba(255,255,255,0.05)', 
        borderRadius: '8px', 
        padding: '20px',
        marginBottom: '20px'
      }}>
        <Text style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>
          Test Login
        </Text>
        <Text style={{ color: '#C7C7F0', fontSize: '14px', marginBottom: '16px' }}>
          Тестирование входа с Telegram данными
        </Text>
        
        <Button
          onClick={testLogin}
          style={{ width: '100%' }}
        >
          Test Login with Telegram Data
        </Button>
      </div>

      <div style={{ 
        background: 'rgba(255,255,255,0.05)', 
        borderRadius: '8px', 
        padding: '20px'
      }}>
        <Text style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>
          Instructions
        </Text>
        <div style={{ color: '#C7C7F0', fontSize: '12px' }}>
          <p>1. Откройте консоль разработчика (F12)</p>
          <p>2. Проверьте логи инициализации Telegram WebApp</p>
          <p>3. Убедитесь, что initData содержит данные с hash</p>
          <p>4. Попробуйте тестовый вход</p>
        </div>
      </div>
    </div>
  );
}
