// teacherService.js
// Service layer for teacher-related API calls

const API_URL = process.env.REACT_APP_API_URL/'teachers' || 'http://localhost:5000/api/teachers';

/**
 * Fetch all teachers from the API
 * @returns {Promise<Array>} Array of teacher objects
 */
export const getAllTeachers = async () => {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching teachers:', error);
    throw new Error('Failed to fetch teachers. Please check your connection.');
  }
};

/**
 * Create a new teacher
 * @param {Object} teacherData - Teacher data object
 * @returns {Promise<Object>} Created teacher object
 */
export const createTeacher = async (teacherData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teacherData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to create teacher');
    }

    return data;
  } catch (error) {
    console.error('Error creating teacher:', error);
    throw error;
  }
};

/**
 * Update an existing teacher
 * @param {string} teacherId - Teacher's database ID (_id)
 * @param {Object} teacherData - Updated teacher data
 * @returns {Promise<Object>} Updated teacher object
 */
export const updateTeacher = async (teacherId, teacherData) => {
  try {
    const response = await fetch(`${API_URL}/${teacherId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teacherData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to update teacher');
    }

    return data;
  } catch (error) {
    console.error('Error updating teacher:', error);
    throw error;
  }
};

/**
 * Delete a teacher
 * @param {string} teacherId - Teacher's database ID (_id)
 * @returns {Promise<Object>} Response from server
 */
export const deleteTeacher = async (teacherId) => {
  try {
    const response = await fetch(`${API_URL}/${teacherId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to delete teacher');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting teacher:', error);
    throw error;
  }
};

/**
 * Get a single teacher by ID
 * @param {string} teacherId - Teacher's database ID (_id)
 * @returns {Promise<Object>} Teacher object
 */
export const getTeacherById = async (teacherId) => {
  try {
    const response = await fetch(`${API_URL}/${teacherId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching teacher:', error);
    throw new Error('Failed to fetch teacher details.');
  }
};

/**
 * Search teachers by query
 * @param {string} query - Search query string
 * @returns {Promise<Array>} Filtered array of teachers
 */
export const searchTeachers = async (query) => {
  try {
    const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching teachers:', error);
    // Fallback to client-side filtering if search endpoint doesn't exist
    throw error;
  }
};

/**
 * Clean teacher data before submission
 * Removes empty strings and undefined values
 * @param {Object} data - Raw form data
 * @param {string} mode - 'add' or 'edit' mode
 * @returns {Object} Cleaned data object
 */
export const cleanTeacherData = (data, mode = 'add') => {
  const cleanedData = { ...data };
  
  // Remove empty strings and convert to undefined
  Object.keys(cleanedData).forEach(key => {
    if (cleanedData[key] === '') {
      cleanedData[key] = undefined;
    }
  });
  
  // For edit mode, remove teacherId and empty password
  if (mode === 'edit') {
    delete cleanedData.teacherId;
    if (!cleanedData.password) {
      delete cleanedData.password;
    }
  }
  
  // Remove undefined values
  return Object.fromEntries(
    Object.entries(cleanedData).filter(([_, v]) => v !== undefined)
  );
};

export default {
  getAllTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherById,
  searchTeachers,
  cleanTeacherData,
};