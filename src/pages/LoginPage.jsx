import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle Login with Password
  const handleLoginPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/courses');
    } catch (err) {
      setError(err.message || 'Email hoặc mật khẩu không chính xác');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (quickEmail, quickPass) => {
    setEmail(quickEmail);
    setPassword(quickPass);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 160px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'linear-gradient(180deg, #fffbeb 0%, #faf8f5 100%)'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '36px',
        width: '100%',
        maxWidth: '460px',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--border-subtle)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
            color: '#fff',
            fontSize: '1.4rem'
          }}>
            🌿
          </div>
          <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '6px' }}>Chào Mừng Đến Cinnamon</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Đăng nhập để duy trì ngọn lửa Streak của bạn!
          </p>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--error-bg)',
            color: 'var(--error)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.88rem',
            marginBottom: '20px'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLoginPassword} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tenban@email.com"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px' }}>
              Mật khẩu
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '13px' }}
          >
            {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
            <LogIn size={18} />
          </button>
        </form>

        {/* Quick Demo Accounts */}
        <div style={{ marginTop: '28px', borderTop: '1px solid var(--border-subtle)', paddingTop: '18px' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '10px', fontWeight: 600 }}>
            TÀI KHOẢN TRẢI NGHIỆM NHANH (MẬT KHẨU):
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('student@cinnamon.com', 'student123')}
              style={{ fontSize: '0.78rem', padding: '6px 10px', background: 'var(--bg-page)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}
            >
              🎓 Học viên
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('teacher@cinnamon.com', 'teacher123')}
              style={{ fontSize: '0.78rem', padding: '6px 10px', background: 'var(--bg-page)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}
            >
              👩‍🏫 Giáo viên
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@cinnamon.com', 'admin123')}
              style={{ fontSize: '0.78rem', padding: '6px 10px', background: 'var(--bg-page)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}
            >
              👑 Admin
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Chưa có tài khoản?{' '}
          <Link to="/register" style={{ color: 'var(--cinnamon-600)', fontWeight: 700 }}>
            Đăng ký miễn phí
          </Link>
        </div>
      </div>
    </div>
  );
};
