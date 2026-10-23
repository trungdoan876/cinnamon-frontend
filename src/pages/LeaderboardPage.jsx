import React, { useState, useEffect } from 'react';
import { studyApi } from '../api/studyApi';
import { Trophy, Flame, Sparkles, Award } from 'lucide-react';

export const LeaderboardPage = () => {
  const [tab, setTab] = useState('WEEKLY'); // 'WEEKLY' | 'ALL_TIME'
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [tab]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = tab === 'WEEKLY'
        ? await studyApi.getLeaderboardWeekly(15)
        : await studyApi.getLeaderboardAllTime(15);

      if (res && res.data) {
        setLeaderboard(res.data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];
  const rest = leaderboard.slice(3);

  return (
    <div className="container" style={{ padding: '48px 24px 80px 24px', maxWidth: '850px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto',
          color: '#ffffff',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <Trophy size={32} />
        </div>
        <h1 style={{ fontSize: '2.4rem', color: '#0f172a', marginBottom: '8px' }}>
          Bảng Xếp Hạng Chiến Binh
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Vinh danh những học viên chăm chỉ và đạt điểm kinh nghiệm cao nhất tuần này.
        </p>

        {/* Tab Switcher */}
        <div style={{
          display: 'inline-flex',
          gap: '6px',
          background: 'var(--border-subtle)',
          padding: '4px',
          borderRadius: 'var(--radius-full)',
          marginTop: '24px'
        }}>
          <button
            onClick={() => setTab('WEEKLY')}
            style={{
              padding: '8px 20px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.88rem',
              background: tab === 'WEEKLY' ? '#ffffff' : 'transparent',
              color: tab === 'WEEKLY' ? 'var(--cinnamon-800)' : 'var(--text-muted)',
              boxShadow: tab === 'WEEKLY' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Bảng Xếp Hạng Tuần
          </button>
          <button
            onClick={() => setTab('ALL_TIME')}
            style={{
              padding: '8px 20px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.88rem',
              background: tab === 'ALL_TIME' ? '#ffffff' : 'transparent',
              color: tab === 'ALL_TIME' ? 'var(--cinnamon-800)' : 'var(--text-muted)',
              boxShadow: tab === 'ALL_TIME' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Mọi Thời Đại
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>Đang tải bảng xếp hạng...</div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {leaderboard.length >= 3 && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: '16px',
              marginBottom: '48px',
              paddingTop: '30px'
            }}>
              {/* 2nd Place */}
              <div style={{ textAlign: 'center', flex: 1, maxWidth: '180px' }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '8px' }}>
                  <img
                    src={top2.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=user2'}
                    alt={top2.fullName}
                    style={{ width: '64px', height: '64px', borderRadius: '50%', border: '3px solid #94a3b8' }}
                  />
                  <span style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: '#94a3b8', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    2
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>{top2.fullName}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--cinnamon-700)', fontWeight: 800 }}>{top2.xp} XP</div>
                <div style={{
                  height: '100px',
                  background: 'linear-gradient(180deg, #e2e8f0 0%, #cbd5e1 100%)',
                  borderRadius: '12px 12px 0 0',
                  marginTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  color: '#475569',
                  fontSize: '1.4rem'
                }}>
                  🥈
                </div>
              </div>

              {/* 1st Place (Winner) */}
              <div style={{ textAlign: 'center', flex: 1, maxWidth: '200px' }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '8px' }}>
                  <div style={{ fontSize: '1.4rem', marginBottom: '2px' }}>👑</div>
                  <img
                    src={top1.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=user1'}
                    alt={top1.fullName}
                    style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid #f59e0b', boxShadow: 'var(--shadow-glow)' }}
                  />
                  <span style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: '#f59e0b', color: '#fff', borderRadius: '50%', width: '26px', height: '26px', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    1
                  </span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>{top1.fullName}</div>
                <div style={{ fontSize: '0.95rem', color: 'var(--cinnamon-600)', fontWeight: 800 }}>{top1.xp} XP</div>
                <div style={{
                  height: '140px',
                  background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 100%)',
                  borderRadius: '16px 16px 0 0',
                  marginTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  color: '#b45309',
                  fontSize: '1.8rem',
                  border: '1px solid #fcd34d'
                }}>
                  🥇
                </div>
              </div>

              {/* 3rd Place */}
              <div style={{ textAlign: 'center', flex: 1, maxWidth: '180px' }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '8px' }}>
                  <img
                    src={top3.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=user3'}
                    alt={top3.fullName}
                    style={{ width: '64px', height: '64px', borderRadius: '50%', border: '3px solid #d97706' }}
                  />
                  <span style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: '#d97706', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    3
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>{top3.fullName}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--cinnamon-700)', fontWeight: 800 }}>{top3.xp} XP</div>
                <div style={{
                  height: '75px',
                  background: 'linear-gradient(180deg, #ffedd5 0%, #fed7aa 100%)',
                  borderRadius: '12px 12px 0 0',
                  marginTop: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  color: '#9a3412',
                  fontSize: '1.4rem'
                }}>
                  🥉
                </div>
              </div>
            </div>
          )}

          {/* Ranking List Table */}
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '60px 1fr 100px 120px',
              padding: '14px 20px',
              background: 'var(--bg-page)',
              borderBottom: '1px solid var(--border-subtle)',
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--text-muted)'
            }}>
              <span>HẠNG</span>
              <span>HỌC VIÊN</span>
              <span>STREAK</span>
              <span style={{ textAlign: 'right' }}>ĐIỂM XP</span>
            </div>

            {leaderboard.map((item) => (
              <div
                key={item.userId}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr 100px 120px',
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--border-subtle)',
                  transition: 'background 0.15s'
                }}
              >
                <div style={{ fontWeight: 800, color: item.rank <= 3 ? 'var(--cinnamon-600)' : 'var(--text-muted)' }}>
                  #{item.rank}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={item.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${item.username}`}
                    alt={item.fullName}
                    style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--bg-page)' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>{item.fullName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cấp {item.level}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ea580c', fontWeight: 700, fontSize: '0.88rem' }}>
                  <Flame size={16} fill="#ea580c" />
                  <span>{item.streakDays}d</span>
                </div>

                <div style={{ textAlign: 'right', fontWeight: 800, color: 'var(--cinnamon-600)', fontSize: '0.95rem' }}>
                  {item.xp} XP
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
