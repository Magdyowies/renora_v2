import api from './api';

const getUserStats = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/stats/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user stats for user ${userId}:`, error);
    throw error;
  }
};

const userStatsService = {
  getUserStats,
};

export default userStatsService;
