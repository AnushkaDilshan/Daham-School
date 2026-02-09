// studentService.js
// Service layer for student-related API calls

const API_URL = process.env.REACT_APP_STUDENT_API_URL/'students' || 'http://localhost:5000/api/students';

/**
 * Fetch all students from the API
 * @returns {Promise<Array>} Array of student objects
 */
export const getAllStudents = async () => {
  try {
    const response = await fetch(API_URL);
    
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

/**
 * Create a new student
 * @param {Object} studentData - Student data object
 * @returns {Promise<Object>} Created student object
 */
export const createStudent = async (studentData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData)
    });
    
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

/**
 * Update an existing student
 * @param {string} studentId - Student's database ID (_id)
 * @param {Object} studentData - Updated student data
 * @returns {Promise<Object>} Updated student object
 */
export const updateStudent = async (studentId, studentData) => {
  try {
    const response = await fetch(`${API_URL}/${studentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData)
    });
    
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

/**
 * Delete a student
 * @param {string} studentId - Student's database ID (_id)
 * @returns {Promise<Object>} Response from server
 */
export const deleteStudent = async (studentId) => {
  try {
    const response = await fetch(`${API_URL}/${studentId}`, {
      method: 'DELETE'
    });
    
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

/**
 * Get a single student by ID
 * @param {string} studentId - Student's database ID (_id)
 * @returns {Promise<Object>} Student object
 */
export const getStudentById = async (studentId) => {
  try {
    const response = await fetch(`${API_URL}/${studentId}`);
    
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

/**
 * Search students by query
 * @param {string} query - Search query string
 * @returns {Promise<Array>} Filtered array of students
 */
export const searchStudents = async (query) => {
  try {
    const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
    
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