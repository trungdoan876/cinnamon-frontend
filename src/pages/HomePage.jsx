import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Flame, Trophy, Layers, Award, CheckCircle, ArrowRight, BookOpen } from 'lucide-react';

export const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(180deg, #fffbeb 0%, #faf8f5 100%)',
        padding: '72px 0 80px 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          alignItems: 'center'
        }}>
          {/* Left Text */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fef3c7', padding: '6px 14px', borderRadius: 'var(--radius-full)', color: '#92400e', fontWeight: 700, fontSize: '0.82rem', marginBottom: '20px' }}>
              <Sparkles size={16} />
              <span>NỀN TẢNG TIẾNG ANH GAMIFICATION THẾ HỆ MỚI</span>
            </div>

            <h1 style={{ fontSize: '3.2rem', color: '#0f172a', lineHeight: '1.15', marginBottom: '20px' }}>
              Chinh Phục Tiếng Anh Thật Tự Nhiên Với <span style={{ color: 'var(--cinnamon-600)' }}>Cinnamon</span>
            </h1>

            <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '32px' }}>
              Học từ vựng qua <b>Flashcard 3D</b>, ngữ pháp thực chiến, làm quiz tương tác và duy trì ngọn lửa <b>Streak</b> mỗi ngày để thăng hạng bảng xếp hạng toàn quốc.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '36px' }}>
              {isAuthenticated ? (
                <Link to="/courses" className="btn-primary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
                  Tiếp Tục Học Ngay
                  <ArrowRight size={20} />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
                    Bắt Đầu Miễn Phí
                    <ArrowRight size={20} />
                  </Link>
                  <Link to="/courses" className="btn-secondary" style={{ padding: '14px 24px', fontSize: '1.05rem' }}>
                    Khám Phá Khóa Học
                  </Link>
                </>
              )}
            </div>

            {/* Quick trust metrics */}
            <div style={{ display: 'flex', gap: '24px', borderTop: '1px solid var(--border-subtle)', paddingTop: '24px' }}>
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>A1 → C2</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Chuẩn khung CEFR</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '24px' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>100% Free</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mở toàn bộ bài học</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '24px' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--cinnamon-600)' }}>XP & Badge</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gamification hứng khởi</div>
              </div>
            </div>
          </div>

          {/* Right Visual Card */}
          <div style={{ position: 'relative' }}>
            <div style={{
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-subtle)',
              position: 'relative',
              zIndex: 2
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
                </div>
                <span className="pill pill-streak">🔥 14 Ngày Streak</span>
              </div>

              {/* Preview Flashcard Box */}
              <div style={{
                background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                borderRadius: 'var(--radius-md)',
                padding: '28px',
                textAlign: 'center',
                border: '1px solid #fde68a',
                marginBottom: '20px'
              }}>
                <span className="pill pill-cinnamon" style={{ marginBottom: '12px' }}>Vocabulary of the Day</span>
                <h3 style={{ fontSize: '2rem', color: '#78350f', marginBottom: '6px' }}>Enthusiastic</h3>
                <p style={{ fontStyle: 'italic', color: '#92400e', marginBottom: '12px' }}>/ɪnˌθjuː.ziˈæs.tɪk/</p>
                <p style={{ fontSize: '0.92rem', color: '#451a03', fontWeight: 500 }}>
                  "Hào hứng, nhiệt huyết khi tiếp thu tri thức mới."
                </p>
              </div>

              {/* Stats Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-page)', padding: '14px 18px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="var(--cinnamon-600)" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Cộng ngay +25 XP</span>
                </div>
                <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>Level Up!</span>
              </div>
            </div>

            {/* Background Glow */}
            <div style={{
              position: 'absolute',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background: 'rgba(245, 158, 11, 0.25)',
              filter: 'blur(70px)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1
            }} />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '80px 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 56px auto' }}>
            <span className="pill pill-cinnamon" style={{ marginBottom: '12px' }}>TÍNH NĂNG VƯỢT TRỘI</span>
            <h2 style={{ fontSize: '2.4rem', color: '#0f172a', marginBottom: '16px' }}>
              Phương Pháp Học Khoa Học & Gamification
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Cinnamon kết hợp kỹ thuật lặp lại ngắt quãng (Spaced Repetition) với cơ chế thưởng điểm để tạo động lực học tập bền bỉ.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '28px'
          }}>
            {/* Feature 1 */}
            <div style={{
              background: 'var(--bg-page)',
              padding: '32px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)',
              transition: 'var(--transition)'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Layers size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Flashcard 3D Thông Minh</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                Ghi nhớ từ vựng sâu sắc với phát âm chuẩn Audio IPA, hình ảnh minh họa sống động và câu ví dụ ngữ cảnh cụ thể.
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{
              background: 'var(--bg-page)',
              padding: '32px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ffedd5', color: '#c2410c', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Flame size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Streak & Cày Điểm XP</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                Mỗi ngày học là một ngày thắp sáng ngọn lửa thói quen. Nhận XP sau mỗi bài học và nâng cấp bậc Level học viên.
              </p>
            </div>

            {/* Feature 3 */}
            <div style={{
              background: 'var(--bg-page)',
              padding: '32px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Checkpoint Quiz Tương Tác</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                Kiểm tra kiến thức tức thì với trắc nghiệm bấm giờ, chấm điểm tự động và nhận hiệu ứng pháo hoa khi vượt mốc.
              </p>
            </div>

            {/* Feature 4 */}
            <div style={{
              background: 'var(--bg-page)',
              padding: '32px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Trophy size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Bảng Xếp Hạng Hàng Tuần</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                Cạnh tranh lành mạnh với hàng ngàn học viên khác trên Leaderboard tuần và vinh danh trên bục Podium Top 3.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{
        padding: '72px 0',
        background: 'linear-gradient(135deg, #78350f 0%, #451a03 100%)',
        color: '#ffffff',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 style={{ fontSize: '2.4rem', color: '#ffffff', marginBottom: '16px' }}>
            Sẵn Sàng Làm Chủ Tiếng Anh Hôm Nay?
          </h2>
          <p style={{ fontSize: '1.05rem', opacity: 0.85, marginBottom: '32px' }}>
            Gia nhập cộng đồng Cinnamon và bắt đầu bài học đầu tiên chỉ trong 30 giây. Hoàn toàn miễn phí!
          </p>
          <Link to="/courses" className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem', background: '#ffffff', color: '#78350f', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
            Khám Phá Các Khóa Học Ngay
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};
