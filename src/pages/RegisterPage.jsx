import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { UserPlus, AlertCircle, CheckCircle2, Clock, Mail } from 'lucide-react';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
  });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  // Đếm ngược thời gian được phép gửi lại mã OTP
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Đổi email thì phải xác thực lại OTP của email mới
    if (name === 'email' && otpSent) {
      setOtpSent(false);
      setOtp('');
      setResendCooldown(0);
      setMessage('');
      setError('');
    }
  };

  // Bước 1: Gửi mã OTP tới email người dùng nhập
  const handleSendOtp = async () => {
    if (!formData.email) {
      setError('Vui lòng nhập địa chỉ email trước khi lấy mã xác thực');
      return;
    }
    setError('');
    setMessage('');
    setSendingOtp(true);
    try {
      const res = await authApi.sendOtp({ email: formData.email, purpose: 'REGISTER' });
      setOtpSent(true);
      setResendCooldown(60);
      setMessage(res.message || 'Mã OTP đã được gửi tới email của bạn. Vui lòng kiểm tra hộp thư (hoặc mục Spam).');
    } catch (err) {
      setError(err.message || 'Không thể gửi mã OTP. Vui lòng thử lại.');
    } finally {
      setSendingOtp(false);
    }
  };

  // Bước 2: Xác thực OTP và tạo tài khoản
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpSent) {
      setError('Vui lòng lấy mã OTP từ email trước khi đăng ký');
      return;
    }
    if (otp.length !== 6) {
      setError('Vui lòng nhập đủ mã OTP 6 chữ số');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register({ ...formData, otp });
      navigate('/courses');
    } catch (err) {
      setError(err.message || 'Lỗi đăng ký tài khoản');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-subtle)',
    fontSize: '0.95rem',
  };

  const labelStyle = { display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px' };

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
        padding: '40px',
        width: '100%',
        maxWidth: '460px',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
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
          <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '6px' }}>Tạo Tài Khoản Cinnamon</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Nhập email và xác thực mã OTP để hoàn tất đăng ký
          </p>
        </div>

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

        {message && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--success-bg)',
            color: 'var(--success)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.88rem',
            marginBottom: '20px'
          }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Email</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="vana@example.com"
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={sendingOtp || resendCooldown > 0}
                className="btn-secondary"
                style={{
                  padding: '10px 14px',
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap',
                  opacity: resendCooldown > 0 ? 0.6 : 1
                }}
              >
                {resendCooldown > 0 ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} />
                    {resendCooldown}s
                  </span>
                ) : otpSent ? (
                  'Gửi lại'
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Mail size={14} />
                    Gửi mã
                  </span>
                )}
              </button>
            </div>
          </div>

          {otpSent && (
            <div>
              <label style={labelStyle}>Mã OTP 6 chữ số (trong email)</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '2px solid var(--cinnamon-500)',
                  fontSize: '1.4rem',
                  letterSpacing: '8px',
                  textAlign: 'center',
                  fontWeight: 700,
                  background: '#fffbeb',
                  color: 'var(--cinnamon-900)'
                }}
              />
            </div>
          )}

          <div>
            <label style={labelStyle}>Họ và tên</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Tên đăng nhập (Username)</label>
            <input
              type="text"
              name="username"
              required
              minLength={3}
              value={formData.username}
              onChange={handleChange}
              placeholder="nguyenvana"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Mật khẩu (Tối thiểu 6 ký tự)</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !otpSent}
            className="btn-primary"
            style={{
              width: '100%',
              marginTop: '6px',
              padding: '13px',
              opacity: !otpSent ? 0.6 : 1,
              cursor: !otpSent ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Đang tạo tài khoản...' : 'Xác Thực & Đăng Ký'}
            <UserPlus size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Đã có tài khoản?{' '}
          <Link to="/login" style={{ color: 'var(--cinnamon-600)', fontWeight: 700 }}>
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};
