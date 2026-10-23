import React, { useCallback, useEffect, useState } from 'react';
import { courseApi } from '../api/courseApi';
import { useAuth } from '../context/AuthContext';
import { CourseManager } from '../components/teacher/CourseManager';
import { LessonManager } from '../components/teacher/LessonManager';
import { VocabularyManager } from '../components/teacher/VocabularyManager';
import { QuizManager } from '../components/teacher/QuizManager';
import { TeacherAnalytics } from '../components/teacher/TeacherAnalytics';
import { BookOpen, Layers, Languages, HelpCircle, BarChart3, CheckCircle, AlertCircle } from 'lucide-react';

const TABS = [
  { key: 'COURSES', label: 'Khóa Học', icon: BookOpen },
  { key: 'LESSONS', label: 'Bài Học', icon: Layers },
  { key: 'VOCABULARY', label: 'Từ Vựng', icon: Languages },
  { key: 'QUIZZES', label: 'Soạn Quiz', icon: HelpCircle },
  { key: 'ANALYTICS', label: 'Thống Kê Lớp', icon: BarChart3 },
];

export const TeacherPage = () => {
  const { isTeacher } = useAuth();
  const [activeTab, setActiveTab] = useState('COURSES');
  const [courses, setCourses] = useState([]);
  const [alert, setAlert] = useState(null);

  const notify = useCallback((type, text) => setAlert({ type, text }), []);

  const reloadCourses = useCallback(async () => {
    try {
      const res = await courseApi.getMyCourses();
      setCourses(res.data || []);
    } catch {
      try {
        const fallback = await courseApi.getAll(null, 100);
        setCourses(fallback.data?.content || []);
      } catch (err) {
        notify('error', err.message || 'Không tải được danh sách khóa học');
      }
    }
  }, [notify]);

  useEffect(() => {
    reloadCourses();
  }, [reloadCourses]);

  if (!isTeacher) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Bạn không có quyền truy cập trang Quản lý Giáo viên</h2>
      </div>
    );
  }

  const switchTab = (key) => {
    setActiveTab(key);
    setAlert(null);
  };

  return (
    <div className="container" style={{ padding: '40px 24px 80px 24px', maxWidth: '900px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span className="pill pill-cinnamon" style={{ marginBottom: '10px' }}>TEACHER DASHBOARD</span>
        <h1 style={{ fontSize: '2.2rem', color: '#0f172a', marginBottom: '8px' }}>
          Quản Lý Nội Dung Giảng Dạy
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Tạo và chỉnh sửa khóa học, bài học, từ vựng cho học viên Cinnamon.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '28px', flexWrap: 'wrap' }}>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => switchTab(tab.key)}
              className={activeTab === tab.key ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '10px 20px' }}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Alert Messages */}
      {alert && (
        <div
          style={{
            background: alert.type === 'success' ? 'var(--success-bg)' : 'var(--error-bg)',
            color: alert.type === 'success' ? 'var(--success)' : 'var(--error)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px',
          }}
        >
          {alert.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{alert.text}</span>
        </div>
      )}

      {activeTab === 'COURSES' && (
        <CourseManager courses={courses} reloadCourses={reloadCourses} notify={notify} />
      )}

      {activeTab === 'LESSONS' && <LessonManager courses={courses} notify={notify} />}

      {activeTab === 'VOCABULARY' && <VocabularyManager courses={courses} notify={notify} />}

      {activeTab === 'QUIZZES' && <QuizManager courses={courses} notify={notify} />}

      {activeTab === 'ANALYTICS' && <TeacherAnalytics notify={notify} />}
    </div>
  );
};
