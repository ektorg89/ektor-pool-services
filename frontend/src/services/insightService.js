import api from './api';

const insightService = {
  getDashboardInsights: async () => {
    const response = await api.get('/api/v1/insights/dashboard');
    return response.data;
  },
}

export default insightService;
