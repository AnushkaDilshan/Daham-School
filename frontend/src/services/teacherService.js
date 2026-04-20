// teacherService.js
// Service layer for teacher-related API calls

const API_URL = `${process.env.REACT_APP_API_URL}/teachers` || 'http://localhost:5000/api/teachers';

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


export const getAllTeachers = async () => {
  try {
    const response = await fetch(API_URL,{
      headers: getAuthHeaders(),
    }
  );
      handleUnauthorized(response.status);
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


export const createTeacher = async (teacherData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
       headers: getAuthHeaders(),
      body: JSON.stringify(teacherData),
    });
handleUnauthorized(response.status);
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

export const updateTeacher = async (teacherId, teacherData) => {
  try {
    const response = await fetch(`${API_URL}/${teacherId}`, {
      method: 'PUT',
     headers: getAuthHeaders(),
      body: JSON.stringify(teacherData),
    });
handleUnauthorized(response.status);
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


export const deleteTeacher = async (teacherId) => {
  try {
    const response = await fetch(`${API_URL}/${teacherId}`, {
      method: 'DELETE',
       headers: getAuthHeaders(),
    });
    handleUnauthorized(response.status);
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


export const getTeacherById = async (teacherId) => {
  try {
    const response = await fetch(`${API_URL}/${teacherId}`, {
      headers: getAuthHeaders(),
    });
    handleUnauthorized(response.status);
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


export const searchTeachers = async (query) => {
  try {
    const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`, {
      headers: getAuthHeaders(),
    });
    handleUnauthorized(response.status);

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