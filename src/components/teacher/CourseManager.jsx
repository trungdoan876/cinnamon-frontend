import React, { useState } from 'react';
import { courseApi } from '../../api/courseApi';
import { BookOpen, Pencil, Trash2, PlusCircle, X } from 'lucide-react';

const LEVELS = [
  { value: 'A1', label: 'A1 - Căn bản / Mất gốc' },
  { value: 'A2', label: 'A2 - Sơ cấp' },
  { value: 'B1', label: 'B1 - Trung cấp' },
  { value: 'B2', label: 'B2 - Trung cao cấp' },
  { value: 'C1', label: 'C1 - Cao cấp' },
  { value: 'C2', label: 'C2 - Thông thạo' },
];

const LEVEL_COLORS = {
  A1: '#10b981',
  A2: '#0ea5e9',
  B1: '#6366f1',
  B2: '#8b5cf6',
  C1: '#f59e0b',
  C2: '#ef4444',
};

const EMPTY_FORM = {
  title: '',
  description: '',
  level: 'A1',
  thumbnailUrl: '',
  isPublished: true,
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
 * Quản lý khóa học: tạo mới, sửa thông tin, xoá.
 */
export const CourseManager = ({ courses, reloadCourses, notify }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setOpenForm(true);
  };

  const openEdit = (course) => {
    setForm({
      title: course.title || '',
      description: course.description || '',
      level: course.level || 'A1',
      thumbnailUrl: course.thumbnailUrl || '',
      isPublished: course.isPublished !== false,
    });
    setEditingId(course.id);
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
      if (editingId) {
        await courseApi.update(editingId, form);
        notify('success', `Đã cập nhật khóa học "${form.title}"`);
      } else {
        await courseApi.create(form);
        notify('success', `Đã tạo khóa học "${form.title}"`);
      }
      closeForm();
      await reloadCourses();
    } catch (err) {
      notify('error', err.message || 'Không lưu được khóa học');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (course) => {
    const confirmed = window.confirm(
      `Xoá khóa học "${course.title}"?\n\nToàn bộ bài học, từ vựng, quiz và tiến độ học viên của khóa này cũng bị xoá vĩnh viễn.`
    );
    if (!confirmed) return;

    try {
      await courseApi.delete(course.id);
      notify('success', `Đã xoá khóa học "${course.title}"`);
      await reloadCourses();
    } catch (err) {
      notify('error', err.message || 'Không xoá được khóa học');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', color: '#0f172a' }}>Danh sách khóa học ({courses.length})</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Sửa thông tin hoặc xoá khóa học khỏi hệ thống.
          </p>
        </div>
        {!openForm && (
          <button onClick={openCreate} className="btn-primary" style={{ padding: '10px 18px' }}>
            <PlusCircle size={18} />
            Tạo khóa học mới
          </button>
        )}
      </div>

      {openForm && (
        <div style={panelStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} />
              {editingId ? `Sửa khóa học #${editingId}` : 'Tạo khóa học mới'}
            </h3>
            <button type="button" onClick={closeForm} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
              <X size={16} />
              Đóng
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={labelStyle}>Tên khóa học</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ví dụ: English for Beginners: A1 Foundations"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Mô tả khóa học</label>
              <textarea
                rows={3}
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Mô tả nội dung, mục tiêu đầu ra và đối tượng học viên..."
                style={inputStyle}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Cấp độ CEFR</label>
                <select
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                  style={{ ...inputStyle, background: '#fff' }}
                >
                  {LEVELS.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>URL ảnh bìa (Thumbnail)</label>
                <input
                  type="url"
                  value={form.thumbnailUrl}
                  onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  style={inputStyle}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '13px', marginTop: '6px' }}>
              {loading ? 'Đang lưu...' : editingId ? 'Lưu Thay Đổi' : 'Xuất Bản Khóa Học'}
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gap: '12px' }}>
        {courses.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Chưa có khóa học nào.</p>
        )}

        {courses.map((course) => (
          <div
            key={course.id}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
              {course.thumbnailUrl ? (
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0 }}
                />
              ) : (
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '1.3rem',
                }}>
                  📘
                </div>
              )}

              <div style={{ minWidth: 0 }}>
                <p style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{course.title}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span style={{
                    background: LEVEL_COLORS[course.level] || '#64748b',
                    color: '#fff',
                    padding: '1px 8px',
                    borderRadius: '999px',
                    fontWeight: 700,
                  }}>
                    {course.level}
                  </span>
                  <span>{course.totalLessons} bài học</span>
                  {!course.isPublished && <span>· Bản nháp</span>}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <button
                onClick={() => openEdit(course)}
                className="btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.82rem' }}
              >
                <Pencil size={15} />
                Sửa
              </button>
              <button
                onClick={() => handleDelete(course)}
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
