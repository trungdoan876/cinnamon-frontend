import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseApi } from '../api/courseApi';
import { lessonApi } from '../api/lessonApi';
import { BookOpen, CheckCircle2, Circle, Sparkles, ArrowRight, ChevronRight, Layers, Volume2, Mic, FileText } from 'lucide-react';

export const CourseDetailPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseAndLessons();
  }, [id]);

  const fetchCourseAndLessons = async () => {
    setLoading(true);
    try {
      const [courseRes, lessonsRes] = await Promise.all([
        courseApi.getById(id),
        lessonApi.getByCourse(id),
      ]);
      if (courseRes && courseRes.data) setCourse(courseRes.data);
      if (lessonsRes && lessonsRes.data) setLessons(lessonsRes.data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'VOCABULARY': return <Layers size={18} color="var(--cinnamon-600)" />;
      case 'GRAMMAR': return <FileText size={18} color="#3b82f6" />;
      case 'SPEAKING': return <Mic size={18} color="#10b981" />;
      case 'LISTENING': return <Volume2 size={18} color="#8b5cf6" />;
      default: return <BookOpen size={18} color="var(--cinnamon-600)" />;
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '80px 0' }}>Đang tải khóa học...</div>;
  }

  if (!course) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <h2>Không tìm thấy khóa học</h2>
        <Link to="/courses" className="btn-primary" style={{ marginTop: '16px' }}>Về danh sách khóa học</Link>
      </div>
    );
  }

  const completedCount = lessons.filter(l => l.isCompleted).length;
  const progressPercent = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  return (
    <div className="container" style={{ padding: '40px 24px 80px 24px' }}>
      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
        <Link to="/courses">Khóa Học</Link>
        <ChevronRight size={16} />
        <span style={{ color: '#0f172a', fontWeight: 600 }}>{course.title}</span>
      </div>

      {/* Course Hero Banner */}
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '36px',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-md)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '36px',
        alignItems: 'center',
        marginBottom: '40px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span className={`badge-level badge-${course.level}`}>{course.level}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Giảng viên: <b>{course.teacherName}</b></span>
          </div>

          <h1 style={{ fontSize: '2.2rem', color: '#0f172a', marginBottom: '12px' }}>
            {course.title}
          </h1>

          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
            {course.description}
          </p>

          {/* Progress bar */}
          <div style={{ maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              <span>Tiến độ học</span>
              <span style={{ color: 'var(--cinnamon-700)' }}>{completedCount} / {lessons.length} bài ({progressPercent}%)</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--cinnamon-500), var(--cinnamon-600))', transition: 'width 0.3s ease' }} />
            </div>
          </div>
        </div>

        <div>
          <img
            src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60'}
            alt={course.title}
            style={{ width: '100%', maxHeight: '240px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
          />
        </div>
      </div>

      {/* Syllabus / Lesson List */}
      <div>
        <h2 style={{ fontSize: '1.5rem', color: '#0f172a', marginBottom: '20px' }}>
          Danh Sách Bài Học ({lessons.length} bài)
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {lessons.map((lesson, idx) => (
            <div
              key={lesson.id}
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-md)',
                padding: '20px 24px',
                border: lesson.isCompleted ? '1px solid #bbf7d0' : '1px solid var(--border-subtle)',
                boxShadow: varCssShadow(lesson.isCompleted),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                transition: 'var(--transition)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {lesson.isCompleted ? (
                  <CheckCircle2 size={24} color="#10b981" />
                ) : (
                  <Circle size={24} color="var(--text-light)" />
                )}

                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'var(--bg-page)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {getLessonIcon(lesson.type)}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      BÀI {idx + 1}
                    </span>
                    <span className="pill pill-cinnamon" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                      {lesson.type}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', color: '#0f172a' }}>
                    {lesson.title}
                  </h3>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span className="pill pill-xp">
                  <Sparkles size={14} />
                  +{lesson.xpReward || 15} XP
                </span>

                <Link
                  to={`/lessons/${lesson.id}`}
                  className="btn-primary"
                  style={{ padding: '8px 18px', fontSize: '0.88rem' }}
                >
                  {lesson.isCompleted ? 'Ôn Tập' : 'Bắt Đầu Học'}
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const varCssShadow = (isCompleted) => {
  return isCompleted ? '0 2px 8px rgba(16, 185, 129, 0.08)' : 'var(--shadow-sm)';
};
