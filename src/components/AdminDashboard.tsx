import { useState, useEffect } from 'react';
import { Button, Section, Title, Text } from '@telegram-apps/telegram-ui';
import { useAuthStore } from '@/store/authStore';
import { adminAPI, type PointHistory } from '@/services/api';

export function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const [pointHistory, setPointHistory] = useState<PointHistory[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [historyData, leaderboardData] = await Promise.all([
        adminAPI.getAllPointHistory(),
        adminAPI.getLeaderboard()
      ]);
      setPointHistory(historyData);
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div style={{ padding: '16px' }}>
      {/* Admin Info */}
      <div style={{
        marginBottom: '16px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '16px'
      }}>
        <Title style={{ color: '#FFFFFF', marginBottom: '8px' }}>
          Админ панель
        </Title>
        <Text style={{ color: '#C7C7F0', marginBottom: '8px' }}>
          Добро пожаловать, {user?.first_name} {user?.last_name || ''}
        </Text>
        <Text style={{ color: '#C7C7F0', fontSize: '14px', marginBottom: '16px' }}>
          @{user?.username}
        </Text>
        <Button size="s" onClick={handleLogout} style={{ background: 'rgba(255, 59, 48, 0.2)', color: '#FF3B30' }}>
          Выйти
        </Button>
      </div>

      {/* Admin Actions */}
      <Section header="Управление">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Button size="l" style={{ background: 'rgba(0, 122, 255, 0.2)', color: '#007AFF' }}>
            Управление студентами
          </Button>
          <Button size="l" style={{ background: 'rgba(52, 199, 89, 0.2)', color: '#34C759' }}>
            Назначить баллы
          </Button>
          <Button size="l" style={{ background: 'rgba(255, 149, 0, 0.2)', color: '#FF9500' }}>
            Статистика
          </Button>
        </div>
      </Section>

      {/* Points History */}
      <Section header="История баллов">
        {isLoading ? (
          <Text style={{ color: '#C7C7F0', textAlign: 'center' }}>Загрузка...</Text>
        ) : pointHistory.length === 0 ? (
          <Text style={{ color: '#C7C7F0', textAlign: 'center' }}>История пуста</Text>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {pointHistory.slice(0, 5).map((entry, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <Text style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600' }}>
                    {entry.rule_name}
                  </Text>
                  <Text style={{ color: '#C7C7F0', fontSize: '12px' }}>
                    {entry.comment}
                  </Text>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Text style={{ 
                    color: entry.points_changed > 0 ? '#34C759' : '#FF3B30', 
                    fontSize: '14px', 
                    fontWeight: '600' 
                  }}>
                    {entry.points_changed > 0 ? '+' : ''}{entry.points_changed}
                  </Text>
                  <Text style={{ color: '#C7C7F0', fontSize: '12px' }}>
                    {formatDate(entry.created_at)}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Leaderboard */}
      <Section header="Топ студентов">
        {isLoading ? (
          <Text style={{ color: '#C7C7F0', textAlign: 'center' }}>Загрузка...</Text>
        ) : leaderboard.length === 0 ? (
          <Text style={{ color: '#C7C7F0', textAlign: 'center' }}>Рейтинг пуст</Text>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {leaderboard.slice(0, 5).map((student, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#FFFFFF'
                  }}>
                    {index + 1}
                  </div>
                  <Text style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600' }}>
                    {student.first_name} {student.last_name || ''}
                  </Text>
                </div>
                <Text style={{ color: '#34C759', fontSize: '14px', fontWeight: '600' }}>
                  {student.points || 0} баллов
                </Text>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
