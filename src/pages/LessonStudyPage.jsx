import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { lessonApi } from '../api/lessonApi';
import { studyApi } from '../api/studyApi';
import { useAuth } from '../context/AuthContext';
import { Flashcard } from '../components/Flashcard';
import { QuizRunner } from '../components/QuizRunner';
import { ChevronLeft, Layers, BookOpen, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';

export const LessonStudyPage = () => {
  const { id } = useParams();
  const { refreshStats } = useAuth();

  const [lesson, setLesson] = useState(null);
  const [vocabularies, setVocabularies] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('VOCAB'); // 'VOCAB' | 'CONTENT' | 'QUIZ'
  const [completed, setCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [completeError, setCompleteError] = useState('');

  useEffect(() => {
    fetchLessonData();
  }, [id]);

  const fetchLessonData = async () => {
    setLoading(true);
    try {
      const [lessonRes, vocabRes, quizRes] = await Promise.all([
        lessonApi.getById(id),
        studyApi.getVocabularies(id),
        studyApi.getQuizzes(id),
      ]);

      if (lessonRes && lessonRes.data) {
        setLesson(lessonRes.data);
        setCompleted(lessonRes.data.isCompleted || false);
      }
      if (vocabRes && vocabRes.data) {
        setVocabularies(vocabRes.data);
        if (vocabRes.data.length > 0) {
          setActiveTab('VOCAB');
        } else {
          setActiveTab('CONTENT');
        }
      }
      if (quizRes && quizRes.data) {
        setQuizzes(quizRes.data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteLesson = async () => {
    if (completed || completing) return;
    setCompleting(true);
    setCompleteError('');
    try {
      await lessonApi.complete(id);
      setCompleted(true);
      await refreshStats();

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#d97706', '#10b981'],
      });
    } catch (err) {
      setCompleteError(err.message || 'Không thể lưu tiến trình. Vui lòng thử lại.');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '80px 0' }}>Đang tải nội dung bài học...</div>;
  }

  if (!lesson) {
    return <div style={{ textAlign: 'center', padding: '80px 0' }}>Không tìm thấy bài học</div>;
  }

  const activeQuiz = quizzes.length > 0 ? quizzes[0] : null;

  return (
    <div style={{ background: '#faf8f5', minHeight: 'calc(100vh - 72px)', paddingBottom: '60px' }}>
      {/* Top sticky action header */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '16px 0',
        position: 'sticky',
        top: '72px',
        zIndex: 50
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              to={`/courses/${lesson.courseId}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.88rem'
              }}
            >
              <ChevronLeft size={20} />
              Quay lại khóa học
            </Link>
            <span style={{ color: 'var(--border-subtle)' }}>|</span>
            <h2 style={{ fontSize: '1.15rem', color: '#0f172a' }}>{lesson.title}</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span className="pill pill-xp">
              <Sparkles size={14} />
              +{lesson.xpReward || 15} XP
            </span>

            <button
              onClick={handleCompleteLesson}
              disabled={completed || completing}
              className="btn-primary"
              style={{
                padding: '8px 18px',
                fontSize: '0.88rem',
                background: completed ? '#10b981' : undefined
              }}
            >
              <CheckCircle2 size={16} />
              {completed ? 'Đã hoàn thành' : completing ? 'Đang lưu...' : 'Hoàn thành bài'}
            </button>

            {completeError && (
              <span style={{ fontSize: '0.8rem', color: 'var(--error)', fontWeight: 600 }}>
                {completeError}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '32px' }}>
        {/* Study Navigation Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '36px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('VOCAB')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.92rem',
              background: activeTab === 'VOCAB' ? 'var(--cinnamon-600)' : '#ffffff',
              color: activeTab === 'VOCAB' ? '#ffffff' : 'var(--text-muted)',
              border: activeTab === 'VOCAB' ? '1px solid var(--cinnamon-600)' : '1px solid var(--border-subtle)',
              boxShadow: activeTab === 'VOCAB' ? '0 4px 12px rgba(217,119,6,0.3)' : 'var(--shadow-sm)',
              cursor: 'pointer'
            }}
          >
            <Layers size={18} />
            Flashcard Từ Vựng {vocabularies.length > 0 ? `(${vocabularies.length})` : ''}
          </button>

          <button
            onClick={() => setActiveTab('CONTENT')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.92rem',
              background: activeTab === 'CONTENT' ? 'var(--cinnamon-600)' : '#ffffff',
              color: activeTab === 'CONTENT' ? '#ffffff' : 'var(--text-muted)',
              border: activeTab === 'CONTENT' ? '1px solid var(--cinnamon-600)' : '1px solid var(--border-subtle)',
              boxShadow: activeTab === 'CONTENT' ? '0 4px 12px rgba(217,119,6,0.3)' : 'var(--shadow-sm)',
              cursor: 'pointer'
            }}
          >
            <BookOpen size={18} />
            Lý Thuyết & Nội Dung
          </button>

          <button
            onClick={() => setActiveTab('QUIZ')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.92rem',
              background: activeTab === 'QUIZ' ? 'var(--cinnamon-600)' : '#ffffff',
              color: activeTab === 'QUIZ' ? '#ffffff' : 'var(--text-muted)',
              border: activeTab === 'QUIZ' ? '1px solid var(--cinnamon-600)' : '1px solid var(--border-subtle)',
              boxShadow: activeTab === 'QUIZ' ? '0 4px 12px rgba(217,119,6,0.3)' : 'var(--shadow-sm)',
              cursor: 'pointer'
            }}
          >
            <HelpCircle size={18} />
            Checkpoint Quiz {activeQuiz ? `(${activeQuiz.questions?.length || 0} câu)` : ''}
          </button>
        </div>

        {/* Tab 1: Flashcards */}
        {activeTab === 'VOCAB' && (
          <div>
            {vocabularies.length > 0 ? (
              <Flashcard vocabularies={vocabularies} />
            ) : (
              <div style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: '50px 30px',
                textAlign: 'center',
                maxWidth: '650px',
                margin: '0 auto',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎴</div>
                <h3 style={{ color: '#0f172a', marginBottom: '8px', fontSize: '1.25rem' }}>
                  Chưa có thẻ Flashcard từ vựng cho bài học này
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '22px' }}>
                  Bài học này chú trọng vào phần lý thuyết và bài tập ngữ pháp. Bạn có thể xem tab <b>Lý Thuyết & Nội Dung</b> hoặc làm bài <b>Checkpoint Quiz</b> ngay bên cạnh.
                </p>
                <button
                  onClick={() => setActiveTab('CONTENT')}
                  className="btn-primary"
                  style={{ padding: '10px 22px', fontSize: '0.9rem' }}
                >
                  <BookOpen size={16} />
                  Xem Lý Thuyết Bài Học
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Lesson Content */}
        {activeTab === 'CONTENT' && (
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '40px',
            maxWidth: '750px',
            margin: '0 auto',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span className="pill pill-cinnamon">{lesson.type}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Thời lượng ước tính: 10 phút</span>
            </div>

            <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '20px' }}>
              {lesson.title}
            </h2>

            <div style={{
              fontSize: '1.05rem',
              lineHeight: '1.8',
              color: '#334155',
              whiteSpace: 'pre-line',
              borderLeft: '4px solid var(--cinnamon-500)',
              paddingLeft: '20px',
              marginBottom: '32px'
            }}>
              {lesson.content || 'Nội dung chi tiết của bài học đang được cập nhật.'}
            </div>

            {/* Quick check tip */}
            <div style={{
              background: 'var(--cinnamon-50)',
              border: '1px solid var(--cinnamon-200)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start'
            }}>
              <Sparkles size={24} color="var(--cinnamon-700)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ color: 'var(--cinnamon-900)', fontSize: '0.98rem', marginBottom: '4px' }}>
                  Bí quyết học hiệu quả với Cinnamon
                </h4>
                <p style={{ color: '#78350f', fontSize: '0.9rem' }}>
                  Sau khi đọc kỹ phần lý thuyết, hãy chuyển sang tab <b>Flashcard</b> để luyện tập từ vựng và làm <b>Quiz</b> để ghi nhớ kiến thức và nhận ngay XP lên cấp!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Interactive Quiz */}
        {activeTab === 'QUIZ' && (
          <div>
            {activeQuiz ? (
              <QuizRunner
                quiz={activeQuiz}
                onComplete={() => {
                  setCompleted(true);
                }}
              />
            ) : (
              <div style={{
                background: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: '50px 30px',
                textAlign: 'center',
                maxWidth: '650px',
                margin: '0 auto',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎯</div>
                <h3 style={{ color: '#0f172a', marginBottom: '8px', fontSize: '1.25rem' }}>
                  Chưa có bài kiểm tra trắc nghiệm cho bài học này
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '22px' }}>
                  Hãy học kỹ phần lý thuyết và nhấn nút <b>Hoàn thành bài</b> ở góc trên bên phải để nhận điểm thưởng +XP!
                </p>
                <button
                  onClick={() => setActiveTab('CONTENT')}
                  className="btn-primary"
                  style={{ padding: '10px 22px', fontSize: '0.9rem' }}
                >
                  <BookOpen size={16} />
                  Học Lý Thuyết & Nhận XP
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
