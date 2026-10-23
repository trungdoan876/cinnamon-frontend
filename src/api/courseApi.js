import axiosClient from './axiosClient';

export const courseApi = {
  getAll: (level, size) => {
    const params = {};
    if (level) params.level = level;
    if (size) params.size = size;
    return axiosClient.get('/courses', { params });
  },
  getById: (id) => axiosClient.get(`/courses/${id}`),
  getMyCourses: () => axiosClient.get('/courses/teacher/my-courses'),
  create: (data) => axiosClient.post('/courses', data),
  update: (id, data) => axiosClient.put(`/courses/${id}`, data),
  delete: (id) => axiosClient.delete(`/courses/${id}`),
};
