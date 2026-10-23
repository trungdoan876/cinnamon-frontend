import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { studyApi } from '../api/studyApi';
import { Flame, Sparkles, Award, BookOpen, Shield, Trophy, CheckCircle2 } from 'lucide-react';

export const DashboardPage = () => {
  const { user, stats, refreshStats } = useAuth();
  const [badges, setBadges] = useState([]);
  const [loadingBadges, setLoadingBadges] = useState(true);

  useEffect(() => {
    refreshStats();
    const loadBadges = async () => {
      setLoadingBadges(true);
      try {
        const res = await studyApi.getMyBadges();
        setBadges(res.data || []);
      } catch {
        // Fallback
      } finally {
        setLoadingBadges(false);
      }
    };
    loadBadges();
  }, []);

  const streak = stats?.streakDays || user?.streakDays || 1;
  const xp = stats?.totalXp || 0;
  const level = stats?.level || 1;
  const completedLessons = stats?.completedLessonsCount || 0;
  const xpToNext = stats?.xpToNextLevel || 40;
  const currentLevelProgress = 100 - xpToNext;

  return (
    <div className="container" style={{ padding: '40px 24px 80px 24px', maxWidth: '900px' }}>
      {/* Profile Header Card */}
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '36px',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img
            src={user?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username || 'user'}`}
            alt={user?.fullName}
            style={{ width: '84px', height: '84px', borderRadius: '50%', background: 'var(--cinnamon-100)', border: '3px solid var(--cinnamon-300)', objectFit: 'cover' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '1.8rem', color: '#0f172a' }}>{user?.fullName}</h1>
              <span className="pill pill-cinnamon" style={{ fontSize: '0.75rem' }}>{user?.role}</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user?.email} • @{user?.username}</p>
            <div style={{ marginTop: '8px' }}>
              <a href="/profile" className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
                ✏️ Cập nhật hồ sơ
              </a>
            </div>
          </div>
        </div>

        {/* Level Emblem */}
        <div style={{
          textAlign: 'center',
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          padding: '16px 24px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid #fcd34d'
        }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#92400e', textTransform: 'uppercase' }}>CẤP ĐỘ</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#78350f', lineHeight: 1.1 }}>Level {level}</div>
        </div>
      </div>

      {/* 4 Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{ background: '#ffffff', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ea580c', marginBottom: '8px' }}>
            <Flame size={24} fill="#ea580c" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>CHUỖI NGÀY</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{streak} ngày</div>
        </div>

        <div style={{ background: '#ffffff', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--cinnamon-600)', marginBottom: '8px' }}>
            <Sparkles size={24} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>TỔNG XP</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{xp} XP</div>
        </div>

        <div style={{ background: '#ffffff', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981', marginBottom: '8px' }}>
            <BookOpen size={24} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>BÀI HOÀN THÀNH</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{completedLessons} bài</div>
        </div>

        <div style={{ background: '#ffffff', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#8b5cf6', marginBottom: '8px' }}>
            <Trophy size={24} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>XP LÊN CẤP</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{xpToNext} XP</div>
        </div>
      </div>

      {/* Level Progress Bar Card */}
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 32px',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '36px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Tiến trình tới Level {level + 1}</span>
          <span style={{ fontWeight: 700, color: 'var(--cinnamon-700)', fontSize: '0.9rem' }}>
            {currentLevelProgress}% (Cần thêm {xpToNext} XP)
          </span>
        </div>
        <div style={{ width: '100%', height: '12px', background: 'var(--bg-page)', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{
            width: `${currentLevelProgress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--cinnamon-500) 0%, var(--cinnamon-600) 100%)',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* Badges Collection */}
      <div>
        <h2 style={{ fontSize: '1.4rem', color: '#0f172a', marginBottom: '16px' }}>
          Bộ Sưu Tập Huy Hiệu
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          {badges.map((b) => (
            <div
              key={b.id}
              style={{
                background: b.unlocked ? '#ffffff' : 'var(--bg-page)',
                opacity: b.unlocked ? 1 : 0.75,
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                border: b.unlocked ? '1.5px solid var(--cinnamon-300)' : '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: b.unlocked ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  fontSize: '2rem',
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: b.unlocked ? 'var(--cinnamon-100)' : '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {b.icon || '🏅'}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.98rem', color: '#0f172a', marginBottom: '2px' }}>{b.name}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.description}</p>
                </div>
              </div>

              {/* Progress and status */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>
                  <span style={{ color: b.unlocked ? '#10b981' : 'var(--text-muted)' }}>
                    {b.unlocked ? '✓ Đã mở khóa' : `Tiến độ: ${b.currentProgress} / ${b.targetProgress}`}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>{b.progressPercent}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${b.progressPercent}%`,
                    height: '100%',
                    background: b.unlocked ? '#10b981' : 'var(--cinnamon-500)',
                    transition: 'width 0.3s'
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
