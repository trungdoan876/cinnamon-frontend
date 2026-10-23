import axiosClient from './axiosClient';

export const lessonApi = {
  getByCourse: (courseId) => axiosClient.get(`/courses/${courseId}/lessons`),
  getById: (id) => axiosClient.get(`/lessons/${id}`),
  create: (data) => axiosClient.post('/lessons', data),
  update: (id, data) => axiosClient.put(`/lessons/${id}`, data),
  delete: (id) => axiosClient.delete(`/lessons/${id}`),
  complete: (id) => axiosClient.post(`/lessons/${id}/complete`),
};
