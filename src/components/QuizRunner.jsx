import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { studyApi } from '../api/studyApi';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, XCircle, Award, Sparkles, Clock, RefreshCw, ArrowRight } from 'lucide-react';

export const QuizRunner = ({ quiz, onComplete }) => {
  const { refreshStats } = useAuth();
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimitSeconds || 180);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const questions = quiz.questions || [];
  const currentQuestion = questions[currentQIndex];

  // Timer countdown
  useEffect(() => {
    if (result) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [result]);

  const handleSelectOption = (questionId, optionId) => {
    if (result) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    if (submitting || result) return;
    setSubmitting(true);
    try {
      const res = await studyApi.submitQuiz(quiz.id, selectedAnswers);
      const resData = res.data;
      setResult(resData);
      await refreshStats();

      if (resData.passed) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#d97706', '#10b981', '#6366f1'],
        });
      }
      if (onComplete) onComplete(resData);
    } catch (err) {
      alert(err.message || 'Lỗi khi nộp bài');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  if (!questions || questions.length === 0) {
    return <div style={{ textAlign: 'center', padding: '30px' }}>Không có câu hỏi trong bài quiz này.</div>;
  }

  // Result Screen
  if (result) {
    return (
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '40px',
        maxWidth: '650px',
        margin: '0 auto',
        textAlign: 'center',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: result.passed ? '#ecfdf5' : '#fef2f2',
          color: result.passed ? '#10b981' : '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto'
        }}>
          {result.passed ? <Award size={48} /> : <XCircle size={48} />}
        </div>

        <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '8px' }}>
          {result.passed ? 'Xuất Sắc! Bạn Đã Vượt Qua Quiz' : 'Chưa Đạt Điểm Yêu Cầu'}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
          {result.passed
            ? 'Bạn đã hoàn thành xuất sắc bài kiểm tra và nhận được điểm thưởng XP!'
            : 'Hãy xem lại các câu chưa chính xác và thử lại nhé! Cần đạt tối thiểu 60%.'}
        </p>

        {/* Score cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{ background: 'var(--bg-page)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ĐIỂM SỐ</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: result.passed ? '#10b981' : '#ef4444' }}>
              {result.score}%
            </div>
          </div>
          <div style={{ background: 'var(--bg-page)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>ĐÚNG</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>
              {result.correctCount} / {result.totalQuestions}
            </div>
          </div>
          <div style={{ background: 'var(--cinnamon-50)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--cinnamon-700)', fontWeight: 600 }}>XP NHẬN ĐƯỢC</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--cinnamon-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Sparkles size={20} />
              +{result.xpEarned}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
          <button
            onClick={() => {
              setResult(null);
              setSelectedAnswers({});
              setCurrentQIndex(0);
              setTimeLeft(quiz.timeLimitSeconds || 180);
            }}
            className="btn-secondary"
          >
            <RefreshCw size={16} />
            Làm lại bài
          </button>
        </div>
      </div>
    );
  }

  // Active Quiz View
  return (
    <div style={{
      background: '#ffffff',
      borderRadius: 'var(--radius-lg)',
      padding: '36px',
      maxWidth: '680px',
      margin: '0 auto',
      boxShadow: 'var(--shadow-md)',
      border: '1px solid var(--border-subtle)'
    }}>
      {/* Quiz Header: Title, Timer, Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <span className="pill pill-cinnamon">Câu hỏi {currentQIndex + 1} / {questions.length}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: timeLeft < 30 ? 'var(--error)' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.95rem' }}>
          <Clock size={18} />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '8px', background: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden', marginBottom: '28px' }}>
        <div style={{
          width: `${((currentQIndex + 1) / questions.length) * 100}%`,
          height: '100%',
          background: 'linear-gradient(90deg, var(--cinnamon-500), var(--cinnamon-600))',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Question Text */}
      <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '24px', lineHeight: '1.5' }}>
        {currentQuestion?.questionText}
      </h3>

      {/* Option choices */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
        {currentQuestion?.options?.map((opt, idx) => {
          const isSelected = selectedAnswers[currentQuestion.id] === opt.id;
          const letter = String.fromCharCode(65 + idx); // A, B, C, D

          return (
            <button
              key={opt.id}
              onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
                border: isSelected ? '2px solid var(--cinnamon-500)' : '1px solid var(--border-subtle)',
                background: isSelected ? 'var(--cinnamon-50)' : '#ffffff',
                color: isSelected ? 'var(--cinnamon-900)' : 'var(--text-main)',
                fontWeight: isSelected ? 600 : 500,
                textAlign: 'left',
                fontSize: '0.98rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: isSelected ? 'var(--cinnamon-500)' : 'var(--bg-page)',
                color: isSelected ? '#ffffff' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.9rem',
                flexShrink: 0
              }}>
                {letter}
              </div>
              <span style={{ flex: 1 }}>{opt.optionText}</span>
            </button>
          );
        })}
      </div>

      {/* Question Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentQIndex === 0}
          className="btn-secondary"
          style={{ opacity: currentQIndex === 0 ? 0.4 : 1, cursor: currentQIndex === 0 ? 'not-allowed' : 'pointer' }}
        >
          Câu trước
        </button>

        {currentQIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentQIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            className="btn-primary"
          >
            Câu tiếp theo
            <ArrowRight size={18} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary"
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
          >
            {submitting ? 'Đang chấm điểm...' : 'Nộp Bài Quiz'}
            <CheckCircle2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
