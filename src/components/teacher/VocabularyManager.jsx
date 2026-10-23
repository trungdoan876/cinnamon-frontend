import React, { useCallback, useEffect, useState } from 'react';
import { lessonApi } from '../../api/lessonApi';
import { studyApi } from '../../api/studyApi';
import { Languages, PlusCircle, Pencil, Trash2, X } from 'lucide-react';

const EMPTY_FORM = {
  word: '',
  pronunciation: '',
  definition: '',
  exampleSentence: '',
  imageUrl: '',
  audioUrl: '',
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

/**
 * Thêm từ vựng vào một bài học và xem danh sách từ vựng hiện có.
 */
export const VocabularyManager = ({ courses, notify }) => {
  const [courseId, setCourseId] = useState('');
  const [lessonId, setLessonId] = useState('');
  const [lessons, setLessons] = useState([]);
  const [vocabList, setVocabList] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);

  // Giữ khóa học đang chọn luôn hợp lệ
  useEffect(() => {
    if (!courses.some((c) => c.id === courseId)) {
      setCourseId(courses.length > 0 ? courses[0].id : '');
    }
  }, [courses, courseId]);

  // Tải bài học của khóa đang chọn
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
    return () => {
      cancelled = true;
    };
  }, [courseId, notify]);

  const loadVocabularies = useCallback(async () => {
    if (!lessonId) {
      setVocabList([]);
      return;
    }
    setListLoading(true);
    try {
      const res = await studyApi.getVocabularies(lessonId);
      setVocabList(res.data || []);
    } catch (err) {
      notify('error', err.message || 'Không tải được danh sách từ vựng');
    } finally {
      setListLoading(false);
    }
  }, [lessonId, notify]);

  useEffect(() => {
    loadVocabularies();
  }, [loadVocabularies]);

  const [editingId, setEditingId] = useState(null);

  const openEdit = (vocab) => {
    setEditingId(vocab.id);
    setForm({
      word: vocab.word || '',
      pronunciation: vocab.pronunciation || '',
      definition: vocab.definition || '',
      exampleSentence: vocab.exampleSentence || '',
      imageUrl: vocab.imageUrl || '',
      audioUrl: vocab.audioUrl || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleDelete = async (vocab) => {
    if (!window.confirm(`Xóa từ "${vocab.word}"?`)) return;
    try {
      await studyApi.deleteVocabulary(vocab.id);
      notify('success', `Đã xóa từ "${vocab.word}"`);
      await loadVocabularies();
    } catch (err) {
      notify('error', err.message || 'Không xóa được từ vựng');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await studyApi.updateVocabulary(editingId, { ...form, lessonId: Number(lessonId) });
        notify('success', `Đã cập nhật từ "${form.word}"`);
        setEditingId(null);
      } else {
        await studyApi.addVocabulary({ ...form, lessonId: Number(lessonId) });
        notify('success', `Đã thêm từ "${form.word}" vào bài học`);
      }
      setForm(EMPTY_FORM);
      await loadVocabularies();
    } catch (err) {
      notify('error', err.message || 'Không lưu được từ vựng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
          <div style={panelStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Languages size={18} />
                {editingId ? `Sửa từ vựng #${editingId}` : 'Thêm từ vựng mới'}
              </h3>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                  <X size={15} /> Hủy sửa
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Từ tiếng Anh</label>
                  <input
                    type="text"
                    required
                    value={form.word}
                    onChange={(e) => setForm({ ...form, word: e.target.value })}
                    placeholder="Ví dụ: cinnamon"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Phiên âm IPA</label>
                  <input
                    type="text"
                    value={form.pronunciation}
                    onChange={(e) => setForm({ ...form, pronunciation: e.target.value })}
                    placeholder="/ˈsɪnəmən/"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Nghĩa tiếng Việt</label>
                <textarea
                  rows={2}
                  value={form.definition}
                  onChange={(e) => setForm({ ...form, definition: e.target.value })}
                  placeholder="Ví dụ: quế, cây quế"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Câu ví dụ</label>
                <textarea
                  rows={2}
                  value={form.exampleSentence}
                  onChange={(e) => setForm({ ...form, exampleSentence: e.target.value })}
                  placeholder="Ví dụ: I love the smell of cinnamon in the morning."
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>URL ảnh minh hoạ</label>
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="https://..."
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>URL file âm thanh</label>
                  <input
                    type="url"
                    value={form.audioUrl}
                    onChange={(e) => setForm({ ...form, audioUrl: e.target.value })}
                    placeholder="https://..."
                    style={inputStyle}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '13px', marginTop: '6px' }}>
                <PlusCircle size={18} />
                {loading ? 'Đang lưu...' : editingId ? 'Lưu Thay Đổi Từ Vựng' : 'Thêm Từ Vựng'}
              </button>
            </form>
          </div>

          <div>
            <h3 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: '12px' }}>
              Từ vựng hiện có ({vocabList.length})
            </h3>

            {listLoading && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Đang tải...</p>}

            {!listLoading && vocabList.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Bài học này chưa có từ vựng nào.</p>
            )}

            <div style={{ display: 'grid', gap: '10px' }}>
              {vocabList.map((vocab) => (
                <div
                  key={vocab.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    padding: '14px 18px',
                    background: '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 700, color: '#0f172a' }}>
                      {vocab.word}
                      {vocab.pronunciation && (
                        <span style={{ fontWeight: 400, color: 'var(--text-muted)', marginLeft: '8px', fontSize: '0.85rem' }}>
                          {vocab.pronunciation}
                        </span>
                      )}
                    </p>
                    {vocab.definition && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--cinnamon-700)', marginTop: '2px' }}>{vocab.definition}</p>
                    )}
                    {vocab.exampleSentence && (
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '4px' }}>
                        {vocab.exampleSentence}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button
                      onClick={() => openEdit(vocab)}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                    >
                      <Pencil size={14} /> Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(vocab)}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.82rem', color: 'var(--error)', borderColor: 'var(--error)' }}
                    >
                      <Trash2 size={14} /> Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Chọn một khóa học có bài học để bắt đầu thêm từ vựng.
        </p>
      )}
    </div>
  );
};
