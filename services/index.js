import api from './api';

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

export const studentService = {
  getAll: (params) => api.get('/students', { params }),
  getById: (id) => api.get(`/students/${id}`),
  create: (data) => api.post('/students', data),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
  activate: (id) => api.patch(`/students/${id}/activate`),
  deactivate: (id) => api.patch(`/students/${id}/deactivate`),
  uploadAadhaar: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/students/${id}/aadhaar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getProfile: () => api.get('/students/profile/me'),
  updateProfile: (data) => api.put('/students/profile/me', data),
};

export const attendanceService = {
  getAll: (params) => api.get('/attendance', { params }),
  getByStudent: (studentId) => api.get(`/attendance/student/${studentId}`),
  create: (data) => api.post('/attendance', data),
  update: (id, data) => api.put(`/attendance/${id}`, data),
  delete: (id) => api.delete(`/attendance/${id}`),
};

export const menuService = {
  getAll: () => api.get('/menus'),
  getById: (id) => api.get(`/menus/${id}`),
  getByDate: (date) => api.get(`/menus/date/${date}`),
  getWeekly: (startDate) => api.get('/menus/weekly', { params: { startDate } }),
  create: (data) => api.post('/menus', data),
  update: (id, data) => api.put(`/menus/${id}`, data),
  delete: (id) => api.delete(`/menus/${id}`),
};

export const orderService = {
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  place: (data) => api.post('/orders', data),
  updateStatus: (id, orderStatus) => api.put(`/orders/${id}`, { orderStatus }),
  cancel: (id) => api.patch(`/orders/${id}/cancel`),
  delete: (id) => api.delete(`/orders/${id}`),
};

export const dashboardService = {
  getAdmin: () => api.get('/dashboard/admin'),
  getStudent: () => api.get('/dashboard/student'),
};

export const reportService = {
  exportStudents: () => api.get('/reports/students/pdf', { responseType: 'blob' }),
  exportAttendance: () => api.get('/reports/attendance/pdf', { responseType: 'blob' }),
};
