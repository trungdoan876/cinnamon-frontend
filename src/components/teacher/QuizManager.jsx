import React, { useCallback, useEffect, useState } from 'react';
import { lessonApi } from '../../api/lessonApi';
import { studyApi } from '../../api/studyApi';
import { HelpCircle, PlusCircle, Pencil, Trash2, X, Check, Clock, Sparkles } from 'lucide-react';

const EMPTY_QUESTION = () => ({
  questionText: '',
  options: [
    { optionText: '', isCorrect: true },
    { optionText: '', isCorrect: false },
    { optionText: '', isCorrect: false },
    { optionText: '', isCorrect: false },
  ],
});

const EMPTY_QUIZ = {
  title: '',
  timeLimitSeconds: 180,
  xpReward: 20,
  questions: [EMPTY_QUESTION()],
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-subtle)',
};

const labelStyle = { display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px' };

const panelStyle = {
  background: '#ffffff',
  borderRadius: 'var(--radius-lg)',
  padding: '28px',
  border: '1px solid var(--border-subtle)',
  boxShadow: 'var(--shadow-md)',
};

export const QuizManager = ({ courses, notify }) => {
  const [courseId, setCourseId] = useState('');
  const [lessonId, setLessonId] = useState('');
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [form, setForm] = useState(EMPTY_QUIZ);
  const [editingId, setEditingId] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);

  useEffect(() => {
    if (!courses.some((c) => c.id === courseId)) {
      setCourseId(courses.length > 0 ? courses[0].id : '');
    }
  }, [courses, courseId]);

  useEffect(() => {
    let cancelled = false;
    const loadLessons = async () => {
      if (!courseId) {
        setLessons([]);
        return;
      }
      try {
        const res = await lessonApi.getByCourse(courseId);
        if (cancelled) return;
        const list = res.data || [];
        setLessons(list);
        setLessonId(list.length > 0 ? list[0].id : '');
      } catch (err) {
        if (!cancelled) notify('error', err.message || 'Không tải được danh sách bài học');
      }
    };
    loadLessons();
    return () => { cancelled = true; };
  }, [courseId, notify]);

  const loadQuizzes = useCallback(async () => {
    if (!lessonId) {
      setQuizzes([]);
      return;
    }
    setListLoading(true);
    try {
      const res = await studyApi.getTeacherQuizzes(lessonId);
      setQuizzes(res.data || []);
    } catch (err) {
      notify('error', err.message || 'Không tải được danh sách quiz');
    } finally {
      setListLoading(false);
    }
  }, [lessonId, notify]);

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  const openCreate = () => {
    setForm(EMPTY_QUIZ);
    setEditingId(null);
    setOpenForm(true);
  };

  const openEdit = (quiz) => {
    setForm({
      title: quiz.title || '',
      timeLimitSeconds: quiz.timeLimitSeconds || 180,
      xpReward: quiz.xpReward || 20,
      questions: quiz.questions?.map((q) => ({
        id: q.id,
        questionText: q.questionText || '',
        options: q.options?.map((opt) => ({
          id: opt.id,
          optionText: opt.optionText || '',
          isCorrect: !!opt.isCorrect,
        })) || [
          { optionText: '', isCorrect: true },
          { optionText: '', isCorrect: false },
        ],
      })) || [EMPTY_QUESTION()],
    });
    setEditingId(quiz.id);
    setOpenForm(true);
  };

  const closeForm = () => {
    setOpenForm(false);
    setEditingId(null);
    setForm(EMPTY_QUIZ);
  };

  const handleAddQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [...prev.questions, EMPTY_QUESTION()],
    }));
  };

  const handleRemoveQuestion = (qIdx) => {
    if (form.questions.length <= 1) {
      notify('error', 'Quiz cần có tối thiểu 1 câu hỏi');
      return;
    }
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, idx) => idx !== qIdx),
    }));
  };

  const handleQuestionTextChange = (qIdx, text) => {
    setForm((prev) => {
      const updated = [...prev.questions];
      updated[qIdx] = { ...updated[qIdx], questionText: text };
      return { ...prev, questions: updated };
    });
  };

  const handleOptionTextChange = (qIdx, optIdx, text) => {
    setForm((prev) => {
      const updatedQ = [...prev.questions];
      const updatedOpts = [...updatedQ[qIdx].options];
      updatedOpts[optIdx] = { ...updatedOpts[optIdx], optionText: text };
      updatedQ[qIdx] = { ...updatedQ[qIdx], options: updatedOpts };
      return { ...prev, questions: updatedQ };
    });
  };

  const handleSelectCorrectOption = (qIdx, optIdx) => {
    setForm((prev) => {
      const updatedQ = [...prev.questions];
      const updatedOpts = updatedQ[qIdx].options.map((opt, i) => ({
        ...opt,
        isCorrect: i === optIdx,
      }));
      updatedQ[qIdx] = { ...updatedQ[qIdx], options: updatedOpts };
      return { ...prev, questions: updatedQ };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate each question has at least 1 correct answer
    for (let i = 0; i < form.questions.length; i++) {
      const q = form.questions[i];
      if (!q.questionText.trim()) {
        notify('error', `Câu hỏi ${i + 1} chưa có nội dung`);
        return;
      }
      const hasCorrect = q.options.some((opt) => opt.isCorrect && opt.optionText.trim());
      if (!hasCorrect) {
        notify('error', `Câu hỏi ${i + 1} phải có ít nhất 1 đáp án đúng đã nhập nội dung`);
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        lessonId: Number(lessonId),
        title: form.title,
        timeLimitSeconds: Number(form.timeLimitSeconds),
        xpReward: Number(form.xpReward),
        questions: form.questions,
      };

      if (editingId) {
        await studyApi.updateQuiz(editingId, payload);
        notify('success', `Đã cập nhật quiz "${form.title}"`);
      } else {
        await studyApi.createQuiz(payload);
        notify('success', `Đã tạo quiz mới "${form.title}"`);
      }
      closeForm();
      await loadQuizzes();
    } catch (err) {
      notify('error', err.message || 'Không lưu được quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (quiz) => {
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xoá quiz "${quiz.title}"?`);
    if (!confirmed) return;
    try {
      await studyApi.deleteQuiz(quiz.id);
      notify('success', `Đã xoá quiz "${quiz.title}"`);
      await loadQuizzes();
    } catch (err) {
      notify('error', err.message || 'Không xoá được quiz');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Course & Lesson select */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={labelStyle}>Chọn khóa học</label>
          <select
            value={courseId}
            onChange={(e) => setCourseId(Number(e.target.value))}
            style={{ ...inputStyle, background: '#fff' }}
            disabled={courses.length === 0}
          >
            {courses.length === 0 && <option value="">Chưa có khóa học</option>}
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                [{c.level}] {c.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Chọn bài học</label>
          <select
            value={lessonId}
            onChange={(e) => setLessonId(Number(e.target.value))}
            style={{ ...inputStyle, background: '#fff' }}
            disabled={lessons.length === 0}
          >
            {lessons.length === 0 && <option value="">Bài học trống</option>}
            {lessons.map((l) => (
              <option key={l.id} value={l.id}>
                Bài {l.orderIndex}: {l.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {lessonId ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a' }}>
              Danh sách Quiz ({quizzes.length})
            </h3>
            {!openForm && (
              <button onClick={openCreate} className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.88rem' }}>
                <PlusCircle size={16} />
                Thêm Quiz Mới
              </button>
            )}
          </div>

          {openForm && (
            <div style={panelStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HelpCircle size={20} />
                  {editingId ? `Chỉnh sửa Quiz #${editingId}` : 'Soạn Quiz Mới'}
                </h3>
                <button type="button" onClick={closeForm} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                  <X size={16} />
                  Đóng
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Tiêu đề Quiz</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Ví dụ: Kiểm tra nhanh từ vựng Unit 1"
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Thời gian làm bài (giây)</label>
                    <input
                      type="number"
                      min="30"
                      max="1800"
                      required
                      value={form.timeLimitSeconds}
                      onChange={(e) => setForm({ ...form, timeLimitSeconds: e.target.value })}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={labelStyle}>Thưởng kinh nghiệm (XP)</label>
                    <input
                      type="number"
                      min="5"
                      max="200"
                      required
                      value={form.xpReward}
                      onChange={(e) => setForm({ ...form, xpReward: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* Questions builder */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '1rem', color: '#0f172a' }}>Danh sách câu hỏi ({form.questions.length})</h4>
                    <button type="button" onClick={handleAddQuestion} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
                      <PlusCircle size={15} />
                      Thêm câu hỏi
                    </button>
                  </div>

                  {form.questions.map((q, qIdx) => (
                    <div
                      key={qIdx}
                      style={{
                        background: 'var(--bg-page)',
                        borderRadius: 'var(--radius-md)',
                        padding: '18px',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#78350f' }}>
                          Câu hỏi {qIdx + 1}
                        </span>
                        {form.questions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(qIdx)}
                            style={{ color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', cursor: 'pointer' }}
                          >
                            <Trash2 size={14} /> Xoá câu
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        required
                        value={q.questionText}
                        onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                        placeholder={`Nhập nội dung câu hỏi ${qIdx + 1}...`}
                        style={inputStyle}
                      />

                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>
                          Đáp án lựa chọn (chọn nút tròn để đánh dấu đáp án ĐÚNG):
                        </span>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          {q.options.map((opt, optIdx) => (
                            <div
                              key={optIdx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: opt.isCorrect ? '#ecfdf5' : '#ffffff',
                                border: opt.isCorrect ? '1.5px solid #10b981' : '1px solid var(--border-subtle)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '6px 10px',
                              }}
                            >
                              <input
                                type="radio"
                                name={`correct_q_${qIdx}`}
                                checked={opt.isCorrect}
                                onChange={() => handleSelectCorrectOption(qIdx, optIdx)}
                                style={{ cursor: 'pointer' }}
                              />
                              <input
                                type="text"
                                required
                                value={opt.optionText}
                                onChange={(e) => handleOptionTextChange(qIdx, optIdx, e.target.value)}
                                placeholder={`Lựa chọn ${String.fromCharCode(65 + optIdx)}`}
                                style={{
                                  border: 'none',
                                  background: 'transparent',
                                  width: '100%',
                                  fontSize: '0.88rem',
                                  outline: 'none',
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '13px', marginTop: '8px' }}>
                  {loading ? 'Đang lưu...' : editingId ? 'Lưu Thay Đổi Quiz' : 'Tạo Quiz Mới'}
                </button>
              </form>
            </div>
          )}

          {/* List of quizzes */}
          <div style={{ display: 'grid', gap: '12px' }}>
            {listLoading && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Đang tải danh sách quiz...</p>}

            {!listLoading && quizzes.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Bài học này chưa có quiz nào.</p>
            )}

            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  padding: '16px 20px',
                  background: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#0f172a', marginBottom: '4px' }}>{quiz.title}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>{quiz.questions?.length || 0} câu hỏi</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} /> {quiz.timeLimitSeconds}s
                    </span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--cinnamon-700)' }}>
                      <Sparkles size={13} /> +{quiz.xpReward} XP
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => openEdit(quiz)}
                    className="btn-secondary"
                    style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                  >
                    <Pencil size={15} /> Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(quiz)}
                    className="btn-secondary"
                    style={{ padding: '8px 14px', fontSize: '0.82rem', color: 'var(--error)', borderColor: 'var(--error)' }}
                  >
                    <Trash2 size={15} /> Xoá
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Chọn khóa học có bài học để quản lý quiz.
        </p>
      )}
    </div>
  );
};
