import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      marginTop: 'auto',
      background: '#ffffff',
      borderTop: '1px solid var(--border-subtle)',
      padding: '48px 0 24px 0'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '36px',
          marginBottom: '36px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.5rem' }}>🌿</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.3rem', color: '#78350f' }}>
                Cinnamon
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Hệ thống học tiếng Anh ứng dụng Gamification hiện đại, giúp bạn làm chủ từ vựng, ngữ pháp và tự tin giao tiếp mỗi ngày.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', color: '#0f172a' }}>Khóa Học</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <Link to="/courses?level=A1">Nền Tảng Cho Người Mới (A1)</Link>
              <Link to="/courses?level=A2">Giao Tiếp Thực Chiến (A2)</Link>
              <Link to="/courses?level=B1">Tiếng Anh Công Sở (B1)</Link>
              <Link to="/courses?level=B2">Luyện Đọc & Viết Nâng Cao (B2)</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', color: '#0f172a' }}>Hệ Thống</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <Link to="/leaderboard">Bảng Xếp Hạng Tuần</Link>
              <Link to="/dashboard">Tiến Trình Học Tập</Link>
              <a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noreferrer">API Documentation</a>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', color: '#0f172a' }}>Tài Khoản Demo</h4>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.7', background: 'var(--bg-page)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
              <div>🎓 <b>Học viên:</b> student@cinnamon.com / student123</div>
              <div>👩‍🏫 <b>Giáo viên:</b> teacher@cinnamon.com / teacher123</div>
              <div>👑 <b>Admin:</b> admin@cinnamon.com / admin123</div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.82rem',
          color: 'var(--text-light)'
        }}>
          <div>
            © {new Date().getFullYear()} Cinnamon Learning Platform. Spring Boot & React MVC Architecture.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 10px',
              borderRadius: '999px',
              background: '#ecfdf5',
              color: '#059669',
              fontSize: '0.75rem',
              fontWeight: 600,
              border: '1px solid #a7f3d0'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              API v1.0.0 • UP
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              Made with <Heart size={14} color="#ef4444" fill="#ef4444" /> by Cinnamon Team
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
