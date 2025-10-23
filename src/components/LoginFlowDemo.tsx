import { useState } from 'react';
import { Button, Text } from '@telegram-apps/telegram-ui';

export function LoginFlowDemo() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const simulateQuickLogin = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    
    // Simulate quick login failure
    setStep(2);
  };

  const simulateFirstTimeLogin = () => {
    setStep(3);
  };

  const reset = () => {
    setStep(1);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#FFFFFF', marginBottom: '8px' }}>Демо логики входа</h1>
        <p style={{ color: '#C7C7F0', fontSize: '14px' }}>
          Пошаговая демонстрация новой логики аутентификации
        </p>
      </div>

      {/* Step 1: Quick Login Check */}
      {step === 1 && (
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '8px', 
          padding: '20px',
          marginBottom: '20px'
        }}>
          <Text style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>
            Шаг 1: Автоматическая проверка Quick Login
          </Text>
          <Text style={{ color: '#C7C7F0', fontSize: '14px', marginBottom: '16px' }}>
            Система автоматически пытается войти через Telegram для уже привязанных аккаунтов
          </Text>
          
          {isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid #6932EB',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '12px'
                }}
              />
              <Text style={{ color: '#C7C7F0', fontSize: '14px' }}>
                Проверяем быстрый вход...
              </Text>
            </div>
          ) : (
            <Button onClick={simulateQuickLogin} style={{ width: '100%' }}>
              Симулировать проверку Quick Login
            </Button>
          )}
        </div>
      )}

      {/* Step 2: Quick Login Failed */}
      {step === 2 && (
        <div style={{ 
          background: 'rgba(255, 193, 7, 0.1)', 
          border: '1px solid rgba(255, 193, 7, 0.3)',
          borderRadius: '8px', 
          padding: '20px',
          marginBottom: '20px'
        }}>
          <Text style={{ color: '#FFC107', fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>
            Шаг 2: Quick Login не удался
          </Text>
          <Text style={{ color: '#C7C7F0', fontSize: '14px', marginBottom: '16px' }}>
            Пользователь не найден или не привязан к Telegram. Показываем форму для первого входа.
          </Text>
          
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: '8px', 
            padding: '16px',
            marginBottom: '16px'
          }}>
            <Text style={{ color: '#FFFFFF', fontSize: '14px', marginBottom: '8px' }}>
              Форма "Первый вход":
            </Text>
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '6px', 
              padding: '12px',
              marginBottom: '8px'
            }}>
              <Text style={{ color: '#C7C7F0', fontSize: '12px' }}>Username: [поле ввода]</Text>
            </div>
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '6px', 
              padding: '12px',
              marginBottom: '8px'
            }}>
              <Text style={{ color: '#C7C7F0', fontSize: '12px' }}>Password: [поле ввода]</Text>
            </div>
            <Button 
              onClick={simulateFirstTimeLogin}
              style={{ 
                background: '#6932EB',
                width: '100%',
                marginTop: '8px'
              }}
            >
              Войти и привязать Telegram
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: First Time Login Success */}
      {step === 3 && (
        <div style={{ 
          background: 'rgba(40, 167, 69, 0.1)', 
          border: '1px solid rgba(40, 167, 69, 0.3)',
          borderRadius: '8px', 
          padding: '20px',
          marginBottom: '20px'
        }}>
          <Text style={{ color: '#28a745', fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>
            Шаг 3: Успешный вход и привязка Telegram
          </Text>
          <Text style={{ color: '#C7C7F0', fontSize: '14px', marginBottom: '16px' }}>
            ✅ Пользователь успешно вошел в систему
            ✅ Telegram ID привязан к аккаунту
            ✅ В следующий раз будет работать Quick Login
          </Text>
          
          <div style={{ 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: '8px', 
            padding: '16px'
          }}>
            <Text style={{ color: '#FFFFFF', fontSize: '14px', marginBottom: '8px' }}>
              Результат:
            </Text>
            <Text style={{ color: '#C7C7F0', fontSize: '12px', margin: '4px 0' }}>
              • User ID: 123
            </Text>
            <Text style={{ color: '#C7C7F0', fontSize: '12px', margin: '4px 0' }}>
              • Username: student1
            </Text>
            <Text style={{ color: '#C7C7F0', fontSize: '12px', margin: '4px 0' }}>
              • Telegram ID: 987654321
            </Text>
            <Text style={{ color: '#C7C7F0', fontSize: '12px', margin: '4px 0' }}>
              • Role: student
            </Text>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <Button 
          onClick={reset}
          style={{ 
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#C7C7F0'
          }}
        >
          Сбросить демо
        </Button>
      </div>

      {/* Summary */}
      <div style={{ marginTop: '20px' }}>
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '8px', 
          padding: '16px' 
        }}>
          <Text style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '500', marginBottom: '12px' }}>
            Преимущества новой логики:
          </Text>
          <div style={{ color: '#C7C7F0', fontSize: '12px' }}>
            <p>✅ Автоматическая проверка Quick Login</p>
            <p>✅ Бесшовный пользовательский опыт</p>
            <p>✅ Привязка Telegram ID при первом входе</p>
            <p>✅ Быстрый вход для возвращающихся пользователей</p>
            <p>✅ Понятные сообщения об ошибках</p>
          </div>
        </div>
      </div>
    </div>
  );
}
