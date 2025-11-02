const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const phisheyeApi = {
  async scanUrl(url) {
    try {
      const response = await fetch(`${API_BASE_URL}/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      if (!response.ok) throw new Error('Scan failed');
      return await response.json();
    } catch (error) {
      console.error('Scan error:', error);
      throw error;
    }
  },

  async getStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      return await response.json();
    } catch (error) {
      console.error('Stats error:', error);
      throw error;
    }
  }
};