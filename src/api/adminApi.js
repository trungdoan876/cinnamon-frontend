import axiosClient from './axiosClient';

export const adminApi = {
  getStats: () => axiosClient.get('/admin/stats'),
  getUsers: (params) => axiosClient.get('/admin/users', { params }),
  updateRole: (id, role) => axiosClient.put(`/admin/users/${id}/role`, { role }),
  updateStatus: (id, isActive) => axiosClient.put(`/admin/users/${id}/status`, { isActive }),
};
