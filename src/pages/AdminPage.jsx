import React, { useEffect, useState, useCallback } from 'react';
import { adminApi } from '../api/adminApi';
import { useAuth } from '../context/AuthContext';
import { Shield, Users, BookOpen, Layers, HelpCircle, CheckCircle, AlertCircle, Search, Lock, Unlock } from 'lucide-react';

export const AdminPage = () => {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const notify = (type, text) => {
    setAlert({ type, text });
    setTimeout(() => setAlert(null), 4000);
  };

  const loadStats = useCallback(async () => {
    try {
      const res = await adminApi.getStats();
      setStats(res.data);
    } catch (err) {
      notify('error', err.message || 'Không tải được thống kê hệ thống');
    }
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size: 10 };
      if (roleFilter) params.role = roleFilter;
      if (search.trim()) params.keyword = search.trim();
      const res = await adminApi.getUsers(params);
      setUsers(res.data?.content || []);
      setTotalPages(res.data?.totalPages || 1);
    } catch (err) {
      notify('error', err.message || 'Không tải được danh sách người dùng');
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, search]);

  useEffect(() => {
    if (isAdmin) {
      loadStats();
      loadUsers();
    }
  }, [isAdmin, loadStats, loadUsers]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminApi.updateRole(userId, newRole);
      notify('success', `Đã cập nhật vai trò thành công sang ${newRole}`);
      await loadUsers();
      await loadStats();
    } catch (err) {
      notify('error', err.message || 'Lỗi khi cập nhật vai trò');
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    const nextStatus = !currentStatus;
    const actionText = nextStatus ? 'mở khóa' : 'khóa';
    if (!window.confirm(`Bạn có chắc muốn ${actionText} tài khoản này?`)) return;

    try {
      await adminApi.updateStatus(userId, nextStatus);
      notify('success', `Đã ${actionText} tài khoản thành công`);
      await loadUsers();
    } catch (err) {
      notify('error', err.message || 'Lỗi khi cập nhật trạng thái tài khoản');
    }
  };

  if (!isAdmin) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Bạn không có quyền truy cập trang Quản Trị Hệ Thống</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 24px 80px 24px', maxWidth: '1050px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span className="pill pill-cinnamon" style={{ marginBottom: '10px' }}>ADMINISTRATION</span>
        <h1 style={{ fontSize: '2.2rem', color: '#0f172a', marginBottom: '6px' }}>Bảng Quản Trị Hệ Thống</h1>
        <p style={{ color: 'var(--text-muted)' }}>Quản lý người dùng, phân quyền giáo viên và giám sát vận hành</p>
      </div>

      {alert && (
        <div style={{
          background: alert.type === 'success' ? 'var(--success-bg)' : 'var(--error-bg)',
          color: alert.type === 'success' ? 'var(--success)' : 'var(--error)',
          padding: '12px 18px',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '24px',
          fontSize: '0.9rem',
        }}>
          {alert.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{alert.text}</span>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0ea5e9', marginBottom: '6px' }}>
              <Users size={20} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>TỔNG USER</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{stats.totalUsers}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {stats.totalStudents} học viên • {stats.totalTeachers} giáo viên
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', marginBottom: '6px' }}>
              <BookOpen size={20} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>KHÓA HỌC</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{stats.totalCourses}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {stats.totalLessons} bài học trực tuyến
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', marginBottom: '6px' }}>
              <HelpCircle size={20} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>BÀI QUIZ</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{stats.totalQuizzes}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {stats.totalCompletedLessons} lượt hoàn thành bài
            </div>
          </div>
        </div>
      )}

      {/* User Management Panel */}
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '28px',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={22} color="var(--cinnamon-700)" />
            Quản Lý Tài Khoản Người Dùng
          </h3>

          {/* Search & Filter */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input
                type="text"
                placeholder="Tìm tên, email, username..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                style={{
                  padding: '8px 12px 8px 36px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.88rem',
                  width: '220px',
                }}
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(0);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.88rem',
                background: '#fff',
              }}
            >
              <option value="">Tất cả vai trò</option>
              <option value="STUDENT">STUDENT</option>
              <option value="TEACHER">TEACHER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 14px' }}>Người Dùng</th>
                <th style={{ padding: '12px 14px' }}>Email</th>
                <th style={{ padding: '12px 14px' }}>Vai Trò (Phân Quyền)</th>
                <th style={{ padding: '12px 14px' }}>Trạng Thái</th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={u.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.username || 'user'}`}
                        alt={u.fullName}
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', background: 'var(--cinnamon-100)' }}
                      />
                      <div>
                        <p style={{ fontWeight: 600, color: '#0f172a' }}>{u.fullName}</p>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>@{u.username}</p>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                    {u.email}
                  </td>

                  <td style={{ padding: '12px 14px' }}>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        background: u.role === 'ADMIN' ? '#fce7f3' : u.role === 'TEACHER' ? '#f3e8ff' : '#ecfdf5',
                        color: u.role === 'ADMIN' ? '#be185d' : u.role === 'TEACHER' ? '#7e22ce' : '#047857',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="STUDENT">STUDENT</option>
                      <option value="TEACHER">TEACHER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>

                  <td style={{ padding: '12px 14px' }}>
                    {u.isActive ? (
                      <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} /> Hoạt động
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} /> Đã khóa
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleStatusToggle(u.id, u.isActive)}
                      className="btn-secondary"
                      style={{
                        padding: '6px 12px',
                        fontSize: '0.8rem',
                        color: u.isActive ? 'var(--error)' : '#10b981',
                        borderColor: u.isActive ? 'var(--error)' : '#10b981',
                      }}
                    >
                      {u.isActive ? (
                        <>
                          <Lock size={14} /> Khóa
                        </>
                      ) : (
                        <>
                          <Unlock size={14} /> Mở khóa
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Trang {page + 1} / {totalPages}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.82rem', opacity: page === 0 ? 0.4 : 1 }}
            >
              Trang trước
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.82rem', opacity: page >= totalPages - 1 ? 0.4 : 1 }}
            >
              Trang sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
