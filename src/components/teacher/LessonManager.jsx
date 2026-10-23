import React, { useCallback, useEffect, useState } from 'react';
import { lessonApi } from '../../api/lessonApi';
import { Layers, Pencil, Trash2, PlusCircle, X } from 'lucide-react';

const LESSON_TYPES = [
  { value: 'VOCABULARY', label: 'Từ Vựng (VOCAB)' },
  { value: 'GRAMMAR', label: 'Ngữ Pháp (GRAMMAR)' },
  { value: 'SPEAKING', label: 'Luyện Nói (SPEAKING)' },
  { value: 'LISTENING', label: 'Luyện Nghe (LISTENING)' },
  { value: 'WRITING', label: 'Luyện Viết (WRITING)' },
  { value: 'READING', label: 'Đọc Hiểu (READING)' },
];

const EMPTY_FORM = {
  title: '',
  type: 'VOCABULARY',
  content: '',
  xpReward: 20,
  orderIndex: 1,
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
 * Quản lý bài học theo khóa học: xem danh sách, tạo mới, sửa, xoá.
 */
export const LessonManager = ({ courses, notify }) => {
  const [courseId, setCourseId] = useState('');
  const [lessons, setLessons] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Giữ khóa học đang chọn luôn hợp lệ khi danh sách khóa học thay đổi
  useEffect(() => {
    if (!courses.some((c) => c.id === courseId)) {
      setCourseId(courses.length > 0 ? courses[0].id : '');
    }
  }, [courses, courseId]);

  const loadLessons = useCallback(async () => {
    if (!courseId) {
      setLessons([]);
      return;
    }
    setListLoading(true);
    try {
      const res = await lessonApi.getByCourse(courseId);
      setLessons(res.data || []);
    } catch (err) {
      notify('error', err.message || 'Không tải được danh sách bài học');
    } finally {
      setListLoading(false);
    }
  }, [courseId, notify]);

  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  const openCreate = () => {
    setForm({ ...EMPTY_FORM, orderIndex: lessons.length + 1 });
    setEditingId(null);
    setOpenForm(true);
  };

  const openEdit = (lesson) => {
    setForm({
      title: lesson.title || '',
      type: lesson.type || 'VOCABULARY',
      content: lesson.content || '',
      xpReward: lesson.xpReward ?? 20,
      orderIndex: lesson.orderIndex ?? 1,
    });
    setEditingId(lesson.id);
    setOpenForm(true);
  };

  const closeForm = () => {
    setOpenForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        courseId: Number(courseId),
        title: form.title,
        type: form.type,
        content: form.content,
        xpReward: Number(form.xpReward),
        orderIndex: Number(form.orderIndex),
      };

      if (editingId) {
        await lessonApi.update(editingId, payload);
        notify('success', `Đã cập nhật bài học "${form.title}"`);
      } else {
        await lessonApi.create(payload);
        notify('success', `Đã thêm bài học "${form.title}"`);
      }
      closeForm();
      await loadLessons();
    } catch (err) {
      notify('error', err.message || 'Không lưu được bài học');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (lesson) => {
    const confirmed = window.confirm(
      `Xoá bài học "${lesson.title}"?\n\nTừ vựng, quiz và tiến độ học viên của bài này cũng bị xoá vĩnh viễn.`
    );
    if (!confirmed) return;

    try {
      await lessonApi.delete(lesson.id);
      notify('success', `Đã xoá bài học "${lesson.title}"`);
      await loadLessons();
    } catch (err) {
      notify('error', err.message || 'Không xoá được bài học');
    }
  };

  if (courses.length === 0) {
    return (
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        Bạn cần tạo khóa học trước khi thêm bài học.
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <label style={labelStyle}>Chọn khóa học</label>
          <select
            value={courseId}
            onChange={(e) => {
              setCourseId(Number(e.target.value));
              closeForm();
            }}
            style={{ ...inputStyle, background: '#fff' }}
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                [{c.level}] {c.title}
              </option>
            ))}
          </select>
        </div>
        {!openForm && (
          <button onClick={openCreate} className="btn-primary" style={{ padding: '10px 18px' }}>
            <PlusCircle size={18} />
            Thêm bài học mới
          </button>
        )}
      </div>

      {openForm && (
        <div style={panelStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} />
              {editingId ? `Sửa bài học #${editingId}` : 'Thêm bài học mới'}
            </h3>
            <button type="button" onClick={closeForm} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
              <X size={16} />
              Đóng
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={labelStyle}>Tiêu đề bài học</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ví dụ: Unit 1: Chào hỏi và làm quen"
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Loại bài</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  style={{ ...inputStyle, background: '#fff' }}
                >
                  {LESSON_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Thứ tự bài</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={form.orderIndex}
                  onChange={(e) => setForm({ ...form, orderIndex: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Thưởng XP</label>
                <input
                  type="number"
                  min="5"
                  required
                  value={form.xpReward}
                  onChange={(e) => setForm({ ...form, xpReward: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Nội dung bài học</label>
              <textarea
                rows={6}
                required
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Soạn nội dung lý thuyết, cấu trúc ngữ pháp, ví dụ mẫu..."
                style={inputStyle}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '13px', marginTop: '6px' }}>
              {loading ? 'Đang lưu...' : editingId ? 'Lưu Thay Đổi' : 'Lưu Bài Học Mới'}
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gap: '12px' }}>
        {listLoading && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Đang tải bài học...</p>}

        {!listLoading && lessons.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Khóa học này chưa có bài học nào.</p>
        )}

        {lessons.map((lesson) => (
          <div
            key={lesson.id}
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
            <div style={{ minWidth: 0 }}>
              <p style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                Bài {lesson.orderIndex}: {lesson.title}
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {lesson.type} · +{lesson.xpReward} XP
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <button
                onClick={() => openEdit(lesson)}
                className="btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.82rem' }}
              >
                <Pencil size={15} />
                Sửa
              </button>
              <button
                onClick={() => handleDelete(lesson)}
                className="btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.82rem', color: 'var(--error)', borderColor: 'var(--error)' }}
              >
                <Trash2 size={15} />
                Xoá
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
