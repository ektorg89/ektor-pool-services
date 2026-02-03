import api from './api';

const invoiceService = {
  getAll: async (filters = {}) => {
    const response = await api.get('/api/v1/invoices', { params: filters });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/v1/invoices/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/api/v1/invoices', data);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/api/v1/invoices/${id}/status?status=${status}`);
    return response.data;
  },
};

export default invoiceService;