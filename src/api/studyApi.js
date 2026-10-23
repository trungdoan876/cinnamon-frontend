import axiosClient from './axiosClient';

export const studyApi = {
  getVocabularies: (lessonId) => axiosClient.get(`/lessons/${lessonId}/vocabulary`),
  addVocabulary: (data) => axiosClient.post('/vocabulary', data),
  updateVocabulary: (id, data) => axiosClient.put(`/vocabulary/${id}`, data),
  deleteVocabulary: (id) => axiosClient.delete(`/vocabulary/${id}`),

  getQuizzes: (lessonId) => axiosClient.get(`/lessons/${lessonId}/quizzes`),
  getTeacherQuizzes: (lessonId) => axiosClient.get(`/teacher/lessons/${lessonId}/quizzes`),
  getQuizById: (quizId) => axiosClient.get(`/quizzes/${quizId}`),
  createQuiz: (data) => axiosClient.post('/quizzes', data),
  updateQuiz: (id, data) => axiosClient.put(`/quizzes/${id}`, data),
  deleteQuiz: (id) => axiosClient.delete(`/quizzes/${id}`),
  submitQuiz: (quizId, answers) => axiosClient.post(`/quizzes/${quizId}/submit`, { quizId, answers }),

  getLeaderboardWeekly: (limit = 10) => axiosClient.get('/leaderboard/weekly', { params: { limit } }),
  getLeaderboardAllTime: (limit = 10) => axiosClient.get('/leaderboard/all-time', { params: { limit } }),
  getUserStats: () => axiosClient.get('/users/me/stats'),

  getTeacherAnalytics: () => axiosClient.get('/teacher/analytics'),
  getMyBadges: () => axiosClient.get('/users/me/badges'),
  updateProfile: (data) => axiosClient.put('/users/me', data),
  changePassword: (data) => axiosClient.put('/users/me/password', data),

  uploadFile: (file, folder = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post(`/upload?folder=${encodeURIComponent(folder)}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
