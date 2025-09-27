import { useState, useEffect } from 'react';
import { Button, Section, Title, Text, Input, FormItem } from '@telegram-apps/telegram-ui';
import { adminAPI, type StudentCreate, type StudentProfile, type User } from '@/services/api';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const studentSchema = z.object({
  username: z.string().min(3, 'Имя пользователя должно содержать минимум 3 символа'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  first_name: z.string().min(1, 'Имя обязательно'),
  last_name: z.string().optional(),
  class_name: z.string().min(1, 'Класс обязателен'),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentManagementProps {
  onBack: () => void;
}

export function StudentManagement({ onBack }: StudentManagementProps) {
  const [students, setStudents] = useState<{ [className: string]: User[] }>({});
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
  });

  // Generate class list from 6 to 12
  const classList = Array.from({ length: 7 }, (_, i) => `${i + 6} класс`);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setIsLoading(true);
    try {
      const allStudents = await adminAPI.getAllStudents();
      const studentsByClass: { [className: string]: User[] } = {};
      
      // Group students by class
      allStudents.forEach(student => {
        const className = student.class_name || 'Без класса';
        if (!studentsByClass[className]) {
          studentsByClass[className] = [];
        }
        studentsByClass[className].push(student);
      });

      // Sort students within each class by name
      Object.keys(studentsByClass).forEach(className => {
        studentsByClass[className].sort((a, b) => 
          `${a.first_name} ${a.last_name || ''}`.localeCompare(`${b.first_name} ${b.last_name || ''}`)
        );
      });

      setStudents(studentsByClass);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Ошибка загрузки студентов');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProfile = async (studentId: number) => {
    try {
      const profile = await adminAPI.getStudentProfile(studentId);
      setSelectedStudent(profile);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Ошибка загрузки профиля');
    }
  };

  const handleDeleteStudent = async (studentId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этого студента?')) {
      return;
    }

    try {
      await adminAPI.deleteStudent(studentId);
      await loadStudents(); // Reload the list
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Ошибка удаления студента');
    }
  };

  const onSubmit = async (data: StudentFormData) => {
    try {
      const studentData: StudentCreate = {
        ...data,
        telegram_id: null,
      };
      
      await adminAPI.createStudent(studentData);
      await loadStudents(); // Reload the list
      setShowAddForm(false);
      reset();
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Ошибка создания студента');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (selectedStudent) {
    return (
      <div style={{ padding: '16px' }}>
        <div style={{ marginBottom: '16px' }}>
          <Button size="s" onClick={() => setSelectedStudent(null)} style={{ marginBottom: '12px' }}>
            ← Назад к списку
          </Button>
          <Title style={{ color: '#FFFFFF', marginBottom: '8px' }}>
            Профиль студента
          </Title>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <Text style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            {selectedStudent.first_name} {selectedStudent.last_name || ''}
          </Text>
          <Text style={{ color: '#C7C7F0', marginBottom: '4px' }}>
            @{selectedStudent.username}
          </Text>
          <Text style={{ color: '#C7C7F0', marginBottom: '4px' }}>
            Класс: {selectedStudent.class_name}
          </Text>
          <Text style={{ color: '#C7C7F0', marginBottom: '4px' }}>
            Баллы: {selectedStudent.points}
          </Text>
          <Text style={{ color: '#C7C7F0', marginBottom: '4px' }}>
            Статус: {selectedStudent.status}
          </Text>
          <Text style={{ color: '#C7C7F0', marginBottom: '4px' }}>
            Telegram ID: {selectedStudent.telegram_id || 'Не привязан'}
          </Text>
          <Text style={{ color: '#C7C7F0', fontSize: '12px' }}>
            Зарегистрирован: {formatDate(selectedStudent.created_at)}
          </Text>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Button 
            size="l" 
            onClick={() => handleDeleteStudent(selectedStudent.id)}
            style={{ background: 'rgba(255, 59, 48, 0.2)', color: '#FF3B30', flex: 1 }}
          >
            Удалить студента
          </Button>
        </div>
      </div>
    );
  }

  if (showAddForm) {
    return (
      <div style={{ padding: '16px' }}>
        <div style={{ marginBottom: '16px' }}>
          <Button size="s" onClick={() => setShowAddForm(false)} style={{ marginBottom: '12px' }}>
            ← Назад к списку
          </Button>
          <Title style={{ color: '#FFFFFF', marginBottom: '8px' }}>
            Добавить студента
          </Title>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FormItem>
              <Input
                {...register('username')}
                placeholder="Имя пользователя"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
              />
              {errors.username && (
                <Text style={{ color: '#FF3B30', fontSize: '12px', marginTop: '4px' }}>
                  {errors.username.message}
                </Text>
              )}
            </FormItem>

            <FormItem>
              <Input
                {...register('password')}
                type="password"
                placeholder="Пароль"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
              />
              {errors.password && (
                <Text style={{ color: '#FF3B30', fontSize: '12px', marginTop: '4px' }}>
                  {errors.password.message}
                </Text>
              )}
            </FormItem>

            <FormItem>
              <Input
                {...register('first_name')}
                placeholder="Имя"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
              />
              {errors.first_name && (
                <Text style={{ color: '#FF3B30', fontSize: '12px', marginTop: '4px' }}>
                  {errors.first_name.message}
                </Text>
              )}
            </FormItem>

            <FormItem>
              <Input
                {...register('last_name')}
                placeholder="Фамилия (необязательно)"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
              />
            </FormItem>

            <FormItem>
              <select
                {...register('class_name')}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  padding: '12px',
                  width: '100%',
                  fontSize: '16px'
                }}
              >
                <option value="">Выберите класс</option>
                {classList.map(className => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </select>
              {errors.class_name && (
                <Text style={{ color: '#FF3B30', fontSize: '12px', marginTop: '4px' }}>
                  {errors.class_name.message}
                </Text>
              )}
            </FormItem>

            {error && (
              <Text style={{ color: '#FF3B30', textAlign: 'center', marginBottom: '8px' }}>
                {error}
              </Text>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                type="button"
                size="l"
                onClick={() => setShowAddForm(false)}
                style={{ background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', flex: 1 }}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                size="l"
                style={{ background: 'rgba(52, 199, 89, 0.2)', color: '#34C759', flex: 1 }}
              >
                Создать
              </Button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Button size="s" onClick={onBack} style={{ marginBottom: '12px' }}>
          ← Назад к панели
        </Button>
        <Title style={{ color: '#FFFFFF', marginBottom: '8px' }}>
          Управление студентами
        </Title>
        <Button 
          size="l" 
          onClick={() => setShowAddForm(true)}
          style={{ 
            background: 'rgba(52, 199, 89, 0.2)', 
            color: '#34C759',
            marginBottom: '16px'
          }}
        >
          + Добавить студента
        </Button>
      </div>

      {error && (
        <Text style={{ color: '#FF3B30', textAlign: 'center', marginBottom: '16px' }}>
          {error}
        </Text>
      )}

      {isLoading ? (
        <Text style={{ color: '#C7C7F0', textAlign: 'center' }}>Загрузка...</Text>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {classList.map(className => {
            const classStudents = students[className] || [];
            if (classStudents.length === 0) return null;

            return (
              <Section key={className} header={className}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {classStudents.map((student) => (
                    <div
                      key={student.id}
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
                          {student.first_name} {student.last_name || ''}
                        </Text>
                        <Text style={{ color: '#C7C7F0', fontSize: '12px' }}>
                          @{student.username} • {student.points || 0} баллов
                        </Text>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                          size="s"
                          onClick={() => handleViewProfile(student.id)}
                          style={{ background: 'rgba(0, 122, 255, 0.2)', color: '#007AFF' }}
                        >
                          Профиль
                        </Button>
                        <Button
                          size="s"
                          onClick={() => handleDeleteStudent(student.id)}
                          style={{ background: 'rgba(255, 59, 48, 0.2)', color: '#FF3B30' }}
                        >
                          Удалить
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            );
          })}
        </div>
      )}
    </div>
  );
}
