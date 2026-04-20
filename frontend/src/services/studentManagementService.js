// studentManagementService.js
// Service layer for student management operations

const API_BASE = process.env.REACT_APP_STUDENT_API_URL;
const API_URL = API_BASE && API_BASE.startsWith('http') 
  ? API_BASE 
  : 'https://daham-school.onrender.com/api/students';



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
      throw new Error('Failed to fetch students');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching students:', error);
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
      throw new Error('Failed to delete student');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting student:', error);
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
      throw new Error('Failed to update student');
    }
    if (!response.ok) {
      throw new Error('Failed to update student');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

/**
 * Update multiple students' grades in bulk
 * @param {Array} students - Array of student objects to update
 * @returns {Promise<Array>} Array of update results
 */
export const bulkUpdateGrades = async (students) => {
  try {
    const updatePromises = students.map(student => 
      updateStudent(student._id, student)
    );

    const results = await Promise.all(updatePromises);
    return results;
  } catch (error) {
    console.error('Error in bulk grade update:', error);
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
      throw new Error('Failed to fetch student');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching student:', error);
    throw error;
  }
};

export default {
  getAllStudents,
  deleteStudent,
  updateStudent,
  bulkUpdateGrades,
  getStudentById
};