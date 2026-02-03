import api from './api';

const customerService = {
  getAll: async () => {
    const response = await api.get('/api/v1/customers');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/v1/customers/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/api/v1/customers', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`/api/v1/customers/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/api/v1/customers/${id}`);
  },
};

export default customerService;
