// prefectService.js
// Service layer for prefect-related API calls

const API_URL = `${process.env.REACT_APP_API_URL}/prefects` || 'http://localhost:5000/api/prefects';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

const handleUnauthorized = (status) => {
  if (status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/';
  }
};
/**
 * Check if end date has passed and return appropriate status
 * @param {string} endDate - ISO date string
 * @returns {string} 'Active' or 'Inactive'
 */
export const getStatusBasedOnDate = (endDate) => {
  if (!endDate) return 'Active';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  return end < today ? 'Inactive' : 'Active';
};

/**
 * Fetch all prefects from the API
 * @returns {Promise<Array>} Array of prefect objects with computed status
 */
export const getAllPrefects = async () => {
  try {
    const response = await fetch(API_URL,{
      headers: getAuthHeaders(),
    });
handleUnauthorized(response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Update status based on end date
    return data.map(prefect => ({
      ...prefect,
      status: getStatusBasedOnDate(prefect.endDate),
    }));
  } catch (error) {
    console.error('Error fetching prefects:', error);
    throw new Error('Failed to fetch prefects. Please check your connection.');
  }
};


export const getAllStudents = async () => {
  try {
    const studentsUrl = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api') + '/students';
    const response = await fetch(studentsUrl, {
      headers: getAuthHeaders(),
    });
    handleUnauthorized(response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching students:', error);
    throw new Error('Failed to fetch students. Please check your connection.');
  }
};


export const createPrefect = async (prefectData) => {
  try {
    const status = getStatusBasedOnDate(prefectData.endDate);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ...prefectData, status }),
    });
handleUnauthorized(response.status);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to add prefect');
    }

    return data;
  } catch (error) {
    console.error('Error creating prefect:', error);
    throw error;
  }
};


export const updatePrefect = async (prefectId, prefectData) => {
  try {
    const status = getStatusBasedOnDate(prefectData.endDate);

    const response = await fetch(`${API_URL}/${prefectId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ...prefectData, status }),
    });
    handleUnauthorized(response.status);  
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to update prefect');
    }

    return data;
  } catch (error) {
    console.error('Error updating prefect:', error);
    throw error;
  }
};


export const deletePrefect = async (prefectId) => {
  try {
    const response = await fetch(`${API_URL}/${prefectId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
handleUnauthorized(response.status);
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to delete prefect');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting prefect:', error);
    throw error;
  }
};


export const getPrefectById = async (prefectId) => {
  try {
    const response = await fetch(`${API_URL}/${prefectId}`, {
      headers: getAuthHeaders(),
    });
    handleUnauthorized(response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching prefect:', error);
    throw new Error('Failed to fetch prefect details.');
  }
};

/**
 * Format a date string to en-GB locale (DD/MM/YYYY)
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date or 'N/A'
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB');
};

export default {
  getAllPrefects,
  getAllStudents,
  createPrefect,
  updatePrefect,
  deletePrefect,
  getPrefectById,
  getStatusBasedOnDate,
  formatDate,
};