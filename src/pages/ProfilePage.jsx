import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { studyApi } from '../api/studyApi';
import { User, Lock, Upload, CheckCircle, AlertCircle, Camera } from 'lucide-react';

export const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [uploading, setUploading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState(null);

  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setProfileMsg({ type: 'error', text: 'Kích thước ảnh tối đa là 5MB' });
      return;
    }

    setUploading(true);
    try {
      const res = await studyApi.uploadFile(file, 'avatars');
      const uploadedUrl = res.data?.url;
      // If server returns relative url like /uploads/..., construct full URL if needed
      const fullUrl = uploadedUrl?.startsWith('http')
        ? uploadedUrl
        : `http://localhost:8080${uploadedUrl}`;
      setAvatarUrl(fullUrl);
      setProfileMsg({ type: 'success', text: 'Tải ảnh đại diện thành công. Nhớ nhấn "Lưu Thay Đổi"!' });
    } catch (err) {
      setProfileMsg({ type: 'error', err: err.message || 'Lỗi khi tải ảnh lên' });
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);
    try {
      const res = await studyApi.updateProfile({ fullName, avatarUrl });
      const updatedUser = res.data;
      if (setUser) {
        setUser((prev) => ({ ...prev, ...updatedUser }));
      }
      localStorage.setItem('cinnamon_user', JSON.stringify({ ...user, ...updatedUser }));
      setProfileMsg({ type: 'success', text: 'Cập nhật thông tin cá nhân thành công!' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message || 'Không thể cập nhật hồ sơ' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Mật khẩu xác nhận không khớp' });
      return;
    }

    setPasswordLoading(true);
    setPasswordMsg(null);
    try {
      await studyApi.changePassword({ oldPassword, newPassword });
      setPasswordMsg({ type: 'success', text: 'Đổi mật khẩu thành công!' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.message || 'Lỗi khi đổi mật khẩu' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border-subtle)',
  };

  return (
    <div className="container" style={{ padding: '40px 24px 80px 24px', maxWidth: '780px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '6px' }}>Hồ Sơ Cá Nhân</h1>
        <p style={{ color: 'var(--text-muted)' }}>Cập nhật thông tin tài khoản và bảo mật mật khẩu của bạn</p>
      </div>

      {/* Profile Info Form */}
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '32px',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '28px',
      }}>
        <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={20} color="var(--cinnamon-700)" />
          Thông Tin Chung
        </h3>

        {profileMsg && (
          <div style={{
            background: profileMsg.type === 'success' ? 'var(--success-bg)' : 'var(--error-bg)',
            color: profileMsg.type === 'success' ? 'var(--success)' : 'var(--error)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
            fontSize: '0.9rem',
          }}>
            {profileMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{profileMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Avatar Upload Preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username || 'user'}`}
                alt="avatar"
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid var(--cinnamon-300)',
                  background: 'var(--cinnamon-50)',
                }}
              />
              <label
                htmlFor="avatar-upload"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  background: 'var(--cinnamon-600)',
                  color: '#ffffff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                }}
                title="Tải ảnh mới"
              >
                <Camera size={16} />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarFile}
                style={{ display: 'none' }}
              />
            </div>

            <div>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', color: '#0f172a', marginBottom: '2px' }}>
                Ảnh đại diện
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {uploading ? 'Đang tải file lên máy chủ...' : 'Định dạng PNG, JPG hoặc GIF. Tối đa 5MB.'}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px' }}>
                Tên đăng nhập
              </label>
              <input
                type="text"
                disabled
                value={user?.username || ''}
                style={{ ...inputStyle, background: '#f1f5f9', cursor: 'not-allowed' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px' }}>
                Email đăng ký
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                style={{ ...inputStyle, background: '#f1f5f9', cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px' }}>
              Họ và tên hiển thị
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={profileLoading}
            className="btn-primary"
            style={{ padding: '12px 24px', alignSelf: 'flex-start' }}
          >
            {profileLoading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
          </button>
        </form>
      </div>

      {/* Change Password Form */}
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '32px',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lock size={20} color="var(--cinnamon-700)" />
          Đổi Mật Khẩu
        </h3>

        {passwordMsg && (
          <div style={{
            background: passwordMsg.type === 'success' ? 'var(--success-bg)' : 'var(--error-bg)',
            color: passwordMsg.type === 'success' ? 'var(--success)' : 'var(--error)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
            fontSize: '0.9rem',
          }}>
            {passwordMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{passwordMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px' }}>
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px' }}>
                Mật khẩu mới
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px' }}>
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                style={inputStyle}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            className="btn-primary"
            style={{ padding: '12px 24px', alignSelf: 'flex-start', marginTop: '6px' }}
          >
            {passwordLoading ? 'Đang cập nhật...' : 'Đổi Mật Khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
};
