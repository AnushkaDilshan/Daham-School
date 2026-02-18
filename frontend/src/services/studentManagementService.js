// studentManagementService.js
// Service layer for student management operations

const API_BASE = process.env.REACT_APP_STUDENT_API_URL;
const API_URL = API_BASE && API_BASE.startsWith('http') 
  ? API_BASE 
  : 'http://localhost:5000/api/students';

/**
 * Fetch all students from the API
 * @returns {Promise<Array>} Array of student objects
 */
export const getAllStudents = async () => {
  try {
    const response = await fetch(API_URL);
    
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

/**
 * Delete a student by ID
 * @param {string} studentId - Student's database ID
 * @returns {Promise<Object>} Response from server
 */
export const deleteStudent = async (studentId) => {
  try {
    const response = await fetch(`${API_URL}/${studentId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Failed to delete student');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};

/**
 * Update a student's information
 * @param {string} studentId - Student's database ID
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

/**
 * Get a single student by ID
 * @param {string} studentId - Student's database ID
 * @returns {Promise<Object>} Student object
 */
export const getStudentById = async (studentId) => {
  try {
    const response = await fetch(`${API_URL}/${studentId}`);
    
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