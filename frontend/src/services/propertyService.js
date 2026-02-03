import api from './api';

const propertyService = {
  getAll: async (customerId = null) => {
    const params = customerId ? { customer_id: customerId } : {};
    const response = await api.get('/api/v1/properties', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/v1/properties/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/api/v1/properties', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`/api/v1/properties/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/api/v1/properties/${id}`);
  },
};

export default propertyService;
