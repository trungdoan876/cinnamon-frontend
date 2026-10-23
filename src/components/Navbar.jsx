import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Flame, Trophy, BookOpen, User, LogOut, PlusCircle, LayoutDashboard, Shield } from 'lucide-react';

export const Navbar = () => {
  const { user, stats, isAuthenticated, isTeacher, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const streak = stats?.streakDays || user?.streakDays || 1;
  const xp = stats?.totalXp || 0;
  const level = stats?.level || 1;

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.25rem',
            boxShadow: '0 4px 12px rgba(217, 119, 6, 0.35)'
          }}>
            🌿
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '1.35rem',
              color: '#78350f',
              letterSpacing: '-0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              Cinnamon
            </div>
            <div style={{ fontSize: '0.68rem', color: '#92400e', fontWeight: 600, letterSpacing: '0.04em' }}>
              ENGLISH MASTERY
            </div>
          </div>
        </Link>

        {/* Navigation links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link
            to="/courses"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: isActive('/courses') ? 'var(--cinnamon-700)' : 'var(--text-muted)',
              background: isActive('/courses') ? 'var(--cinnamon-100)' : 'transparent',
              transition: 'var(--transition)'
            }}
          >
            <BookOpen size={18} />
            Khóa Học
          </Link>

          <Link
            to="/leaderboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.95rem',
              color: isActive('/leaderboard') ? 'var(--cinnamon-700)' : 'var(--text-muted)',
              background: isActive('/leaderboard') ? 'var(--cinnamon-100)' : 'transparent',
              transition: 'var(--transition)'
            }}
          >
            <Trophy size={18} />
            Bảng Xếp Hạng
          </Link>

          {isTeacher && (
            <Link
              to="/teacher"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '0.95rem',
                color: isActive('/teacher') ? '#8b5cf6' : 'var(--text-muted)',
                background: isActive('/teacher') ? '#f3e8ff' : 'transparent',
                transition: 'var(--transition)'
              }}
            >
              <PlusCircle size={18} />
              Quản Lý Khóa Học
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '0.95rem',
                color: isActive('/admin') ? '#dc2626' : 'var(--text-muted)',
                background: isActive('/admin') ? '#fee2e2' : 'transparent',
                transition: 'var(--transition)'
              }}
            >
              <Shield size={18} />
              Quản Trị Hệ Thống
            </Link>
          )}
        </nav>

        {/* Right Auth / Status section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {isAuthenticated ? (
            <>
              {/* Streak Pill */}
              <div className="pill pill-streak" title="Chuỗi ngày học liên tục">
                <Flame size={16} fill="#ea580c" color="#ea580c" />
                <span>{streak} ngày</span>
              </div>

              {/* XP Pill */}
              <div className="pill pill-xp" title="Điểm kinh nghiệm hiện tại">
                <Sparkles size={16} color="#d97706" />
                <span>{xp} XP <span style={{ opacity: 0.7 }}>(Lv.{level})</span></span>
              </div>

              {/* User Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 8px 4px 4px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border-subtle)',
                    background: '#ffffff'
                  }}
                >
                  <img
                    src={user?.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username || 'user'}`}
                    alt="avatar"
                    style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--cinnamon-100)' }}
                  />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                    {user?.fullName?.split(' ')[0] || user?.username}
                  </span>
                </button>

                {dropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '46px',
                      width: '210px',
                      background: '#ffffff',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-xl)',
                      border: '1px solid var(--border-subtle)',
                      padding: '8px',
                      zIndex: 200
                    }}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '4px' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{user?.fullName}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.88rem',
                        fontWeight: 500,
                        color: 'var(--text-main)',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--cinnamon-50)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <LayoutDashboard size={16} />
                      Tiến Trình Cá Nhân
                    </Link>

                    <Link
                      to="/profile"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.88rem',
                        fontWeight: 500,
                        color: 'var(--text-main)',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--cinnamon-50)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <User size={16} />
                      Hồ Sơ & Mật Khẩu
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        navigate('/');
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.88rem',
                        fontWeight: 500,
                        color: 'var(--error)',
                        transition: 'background 0.15s',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--error-bg)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <LogOut size={16} />
                      Đăng Xuất
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.9rem' }}>
                Đăng Nhập
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
                Học Miễn Phí
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
