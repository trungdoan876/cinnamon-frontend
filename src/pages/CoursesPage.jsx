import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { courseApi } from '../api/courseApi';
import { BookOpen, Search, User, Sparkles, ArrowRight } from 'lucide-react';

const CEFR_LEVELS = ['ALL', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const CoursesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const levelParam = searchParams.get('level') || 'ALL';

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, [levelParam]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const level = levelParam === 'ALL' ? null : levelParam;
      const res = await courseApi.getAll(level);
      if (res && res.data) {
        setCourses(res.data.content || []);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLevel = (lvl) => {
    if (lvl === 'ALL') {
      searchParams.delete('level');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ level: lvl });
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container" style={{ padding: '48px 24px 80px 24px' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px auto' }}>
        <span className="pill pill-cinnamon" style={{ marginBottom: '12px' }}>LỘ TRÌNH BÀI BẢN</span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '12px', color: '#0f172a' }}>
          Khám Phá Các Khóa Học Tiếng Anh
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Học theo khung chuẩn Châu Âu CEFR từ mất gốc đến thông thạo giao tiếp và công sở.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '36px'
      }}>
        {/* CEFR Level Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {CEFR_LEVELS.map((lvl) => {
            const isSelected = levelParam === lvl;
            return (
              <button
                key={lvl}
                onClick={() => handleSelectLevel(lvl)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: isSelected ? '1px solid var(--cinnamon-600)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'var(--cinnamon-600)' : '#ffffff',
                  color: isSelected ? '#ffffff' : 'var(--text-main)',
                  transition: 'all 0.15s ease'
                }}
              >
                {lvl === 'ALL' ? 'Tất cả cấp độ' : lvl}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: '#ffffff',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-full)',
          padding: '8px 16px',
          width: '100%',
          maxWidth: '300px'
        }}>
          <Search size={18} color="var(--text-light)" />
          <input
            type="text"
            placeholder="Tìm kiếm khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '0.9rem' }}
          />
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          Đang tải danh sách khóa học...
        </div>
      ) : filteredCourses.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)'
        }}>
          <BookOpen size={48} color="var(--cinnamon-400)" style={{ margin: '0 auto 16px auto' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Chưa tìm thấy khóa học phù hợp</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Vui lòng thử chọn cấp độ khác hoặc tìm kiếm với từ khóa khác.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '28px'
        }}>
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              {/* Thumbnail Image */}
              <div style={{ position: 'relative', height: '190px', background: 'var(--bg-page)' }}>
                <img
                  src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=60'}
                  alt={course.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '14px', left: '14px' }}>
                  <span className={`badge-level badge-${course.level}`}>
                    {course.level}
                  </span>
                </div>
              </div>

              {/* Course Info */}
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '8px', lineHeight: '1.4' }}>
                  {course.title}
                </h3>
                <p style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.88rem',
                  lineHeight: '1.5',
                  marginBottom: '20px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {course.description}
                </p>

                <div style={{
                  marginTop: 'auto',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <BookOpen size={16} />
                    <span>{course.totalLessons} bài học</span>
                  </div>

                  <Link
                    to={`/courses/${course.id}`}
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: '0.88rem' }}
                  >
                    Vào Học
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
