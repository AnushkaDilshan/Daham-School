// studentService.js
// Service layer for student-related API calls



const API_URL = process.env.REACT_APP_STUDENT_API_URL;

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

export const getAllStudents = async () => {
  try {
    const response = await fetch(API_URL,{
      headers: getAuthHeaders(),
    });
    handleUnauthorized(response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching students:', error);
    throw new Error('Failed to fetch students. Please check your connection.');
  }
};


export const createStudent = async (studentData) => {
  try {
    const response = await fetch(`${API_URL}/students`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(studentData)
    });
handleUnauthorized(response.status);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
};


export const updateStudent = async (studentId, studentData) => {
  try {
    const response = await fetch(`${API_URL}/${studentId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(studentData)
    });
    handleUnauthorized(response.status);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};


export const deleteStudent = async (studentId) => {
  try {
    const response = await fetch(`${API_URL}/${studentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),

    });
    handleUnauthorized(response.status);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete student');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};


export const getStudentById = async (studentId) => {
  try {
    const response = await fetch(`${API_URL}/${studentId}`, {
      headers: getAuthHeaders(),
    });
    handleUnauthorized(response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching student:', error);
    throw new Error('Failed to fetch student details.');
  }
};


export const searchStudents = async (query) => {
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
    console.error('Error searching students:', error);
    throw error;
  }
};

export default {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentById,
  searchStudents
};