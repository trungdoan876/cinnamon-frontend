import React, { useEffect, useState } from 'react';
import { studyApi } from '../../api/studyApi';
import { Users, BookOpen, Layers, HelpCircle, Award, TrendingUp } from 'lucide-react';

export const TeacherAnalytics = ({ notify }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await studyApi.getTeacherAnalytics();
        setData(res.data);
      } catch (err) {
        notify('error', err.message || 'Không tải được số liệu thống kê');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [notify]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Đang tải số liệu...</div>;
  }

  if (!data) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 4 Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
      }}>
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0ea5e9', marginBottom: '6px' }}>
            <Users size={20} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>HỌC VIÊN ĐÃ HỌC</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{data.totalStudents}</div>
        </div>

        <div style={{ background: '#ffffff', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', marginBottom: '6px' }}>
            <BookOpen size={20} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>TỔNG KHÓA HỌC</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{data.totalCourses}</div>
        </div>

        <div style={{ background: '#ffffff', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', marginBottom: '6px' }}>
            <Layers size={20} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>TỔNG BÀI HỌC</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{data.totalLessons}</div>
        </div>

        <div style={{ background: '#ffffff', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8b5cf6', marginBottom: '6px' }}>
            <Award size={20} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>ĐIỂM QUIZ TB</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{data.averageQuizScore}%</div>
        </div>
      </div>

      {/* Course breakdown table */}
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={20} color="var(--cinnamon-700)" />
          Chi Tiết Tiến Độ Theo Khóa Học
        </h3>

        {data.courseStats?.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Chưa có khóa học nào để thống kê.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 14px' }}>Khóa Học</th>
                  <th style={{ padding: '12px 14px' }}>Cấp Độ</th>
                  <th style={{ padding: '12px 14px' }}>Số Bài Học</th>
                  <th style={{ padding: '12px 14px' }}>Lượt Hoàn Thành</th>
                </tr>
              </thead>
              <tbody>
                {data.courseStats.map((cs) => (
                  <tr key={cs.courseId} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '14px', fontWeight: 600, color: '#0f172a' }}>{cs.courseTitle}</td>
                    <td style={{ padding: '14px' }}>
                      <span className="badge-level" style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                        {cs.level}
                      </span>
                    </td>
                    <td style={{ padding: '14px' }}>{cs.lessonsCount} bài</td>
                    <td style={{ padding: '14px', fontWeight: 700, color: '#10b981' }}>{cs.completedCount} lượt</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
