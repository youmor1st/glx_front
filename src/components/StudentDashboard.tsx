import { useState, useEffect } from 'react';
import { Button, Section, Title, Text, Cell } from '@telegram-apps/telegram-ui';
import { useAuthStore } from '@/store/authStore';
import { studentsAPI, type PointHistory } from '@/services/api';

export function StudentDashboard() {
  const { user, logout } = useAuthStore();
  const [history, setHistory] = useState<PointHistory[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [historyData, leaderboardData] = await Promise.all([
        studentsAPI.getHistory(),
        studentsAPI.getLeaderboard(),
      ]);
      setHistory(historyData);
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
      minute: '2-digit',
    });
  };

  const getPointsColor = (points: number) => {
    if (points > 0) return '#4ade80';
    if (points < 0) return '#f87171';
    return '#9ca3af';
  };

  return (
    <div style={{ padding: '16px' }}>
      {/* User Info */}
      <div style={{ 
        marginBottom: '16px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6932EB 0%, #9266FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: '#FFFFFF',
            }}
          >
            {user?.first_name?.[0] || 'U'}
          </div>
          <div>
            <Title style={{ margin: '0 0 4px 0', fontSize: '18px' }}>
              {user?.first_name} {user?.last_name}
            </Title>
            <Text style={{ margin: '0', color: '#9ca3af', fontSize: '14px' }}>
              {user?.class_name} • {user?.points || 0} баллов
            </Text>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            size="s"
            onClick={loadData}
            disabled={isLoading}
          >
            Обновить
          </Button>
          <Button
            size="s"
            onClick={logout}
            style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
          >
            Выйти
          </Button>
        </div>
      </div>

      {/* Points History */}
      <Section header="История баллов">
        {isLoading ? (
          <Text style={{ textAlign: 'center', color: '#9ca3af' }}>Загрузка...</Text>
        ) : history.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#9ca3af' }}>
            История баллов пуста
          </Text>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {history.slice(0, 10).map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <Text style={{ margin: '0', fontSize: '14px', fontWeight: '500' }}>
                    {item.rule_name}
                  </Text>
                  <Text
                    style={{
                      margin: '0',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: getPointsColor(item.points_changed),
                    }}
                  >
                    {item.points_changed > 0 ? '+' : ''}{item.points_changed}
                  </Text>
                </div>
                <Text style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#9ca3af' }}>
                  {item.comment}
                </Text>
                <Text style={{ margin: '0', fontSize: '11px', color: '#6b7280' }}>
                  {formatDate(item.created_at)}
                </Text>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Leaderboard */}
      <Section header="Рейтинг класса" style={{ marginTop: '16px' }}>
        {isLoading ? (
          <Text style={{ textAlign: 'center', color: '#9ca3af' }}>Загрузка...</Text>
        ) : leaderboard.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#9ca3af' }}>
            Рейтинг пуст
          </Text>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {leaderboard.slice(0, 10).map((student, index) => (
              <div
                key={student.id}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: index < 3 ? '#fbbf24' : '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#000000',
                  }}
                >
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <Text style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: '500' }}>
                    {student.first_name} {student.last_name}
                  </Text>
                  <Text style={{ margin: '0', fontSize: '12px', color: '#9ca3af' }}>
                    {student.class_name}
                  </Text>
                </div>
                <Text style={{ margin: '0', fontSize: '14px', fontWeight: '600', color: '#4ade80' }}>
                  {student.points}
                </Text>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
