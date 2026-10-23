import React, { useState, useEffect } from 'react';
import { Volume2, ChevronLeft, ChevronRight, RotateCw, Lightbulb } from 'lucide-react';

export const Flashcard = ({ vocabularies = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentVocab = vocabularies[currentIndex];

  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  const handleSpeak = (e, text) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNext = () => {
    if (currentIndex < vocabularies.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(vocabularies.length - 1);
    }
  };

  if (!vocabularies || vocabularies.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
        Không có từ vựng nào trong bài học này.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* 3D Flip Card Container */}
      <div className="flashcard-scene" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`flashcard-inner ${isFlipped ? 'is-flipped' : ''}`}>
          
          {/* Front Face: Word & Pronunciation */}
          <div className="flashcard-face">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="pill pill-cinnamon">Flashcard</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>
                {currentIndex + 1} / {vocabularies.length}
              </span>
            </div>

            <div style={{ textAlign: 'center', margin: 'auto 0' }}>
              <h2 style={{ fontSize: '2.5rem', color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.5px' }}>
                {currentVocab.word}
              </h2>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.15rem', color: 'var(--cinnamon-700)', fontWeight: 500, fontFamily: 'serif' }}>
                  {currentVocab.pronunciation || '/.../'}
                </span>
                <button
                  onClick={(e) => handleSpeak(e, currentVocab.word)}
                  style={{
                    padding: '8px',
                    borderRadius: '50%',
                    background: 'var(--cinnamon-100)',
                    color: 'var(--cinnamon-700)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title="Nghe phát âm chuẩn"
                >
                  <Volume2 size={18} />
                </button>
              </div>

              {currentVocab.imageUrl && (
                <div style={{ marginTop: '16px' }}>
                  <img
                    src={currentVocab.imageUrl}
                    alt={currentVocab.word}
                    style={{ maxHeight: '110px', maxWidth: '80%', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--text-light)', fontSize: '0.85rem' }}>
              <RotateCw size={14} />
              <span>Chạm để lật xem định nghĩa & ví dụ</span>
            </div>
          </div>

          {/* Back Face: Definition & Example */}
          <div className="flashcard-face flashcard-back">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="pill pill-cinnamon">Định nghĩa & Ví dụ</span>
              <button
                onClick={(e) => handleSpeak(e, currentVocab.exampleSentence || currentVocab.definition)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: '#ffffff',
                  border: '1px solid var(--cinnamon-200)',
                  color: 'var(--cinnamon-700)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Volume2 size={14} />
                Nghe câu
              </button>
            </div>

            <div style={{ margin: 'auto 0' }}>
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--cinnamon-700)', fontWeight: 700, marginBottom: '4px' }}>
                  Ý Nghĩa
                </p>
                <p style={{ fontSize: '1.15rem', color: '#1e293b', fontWeight: 600 }}>
                  {currentVocab.definition}
                </p>
              </div>

              {currentVocab.exampleSentence && (
                <div style={{
                  background: 'rgba(255,255,255,0.7)',
                  borderLeft: '4px solid var(--cinnamon-500)',
                  padding: '12px 16px',
                  borderRadius: '0 var(--radius-sm) var(--radius-sm) 0'
                }}>
                  <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '2px' }}>
                    Ví Dụ Thực Tế
                  </p>
                  <p style={{ fontStyle: 'italic', color: '#334155', fontSize: '0.95rem' }}>
                    "{currentVocab.exampleSentence}"
                  </p>
                </div>
              )}
            </div>

            <div style={{ textAlign: 'center', color: 'var(--text-light)', fontSize: '0.85rem' }}>
              <span>Chạm để lật lại từ vựng</span>
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginTop: '24px' }}>
        <button
          onClick={handlePrev}
          className="btn-secondary"
          style={{ padding: '10px 18px' }}
        >
          <ChevronLeft size={18} />
          Từ trước
        </button>

        <span style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          {currentIndex + 1} / {vocabularies.length}
        </span>

        <button
          onClick={handleNext}
          className="btn-primary"
          style={{ padding: '10px 22px' }}
        >
          Từ tiếp theo
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
