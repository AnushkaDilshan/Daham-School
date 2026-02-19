// competitionService.js
// Service layer for competition-related API calls

const API_URL = `${process.env.REACT_APP_API_URL}` || 'http://localhost:5000/api';
const COMPETITIONS_URL = `${API_URL}/competitions`;
const STUDENTS_URL = `${API_URL}/students`;

/**
 * Fetch all competitions from the API
 * @returns {Promise<Array>} Array of competition objects
 */
export const getAllCompetitions = async () => {
  try {
    const response = await fetch(COMPETITIONS_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching competitions:', error);
    throw new Error('Failed to fetch competitions. Please check your connection.');
  }
};

/**
 * Fetch all available years for competitions
 * @returns {Promise<Array>} Array of year values
 */
export const getCompetitionYears = async () => {
  try {
    const response = await fetch(`${COMPETITIONS_URL}/years`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching competition years:', error);
    throw new Error('Failed to fetch competition years.');
  }
};

/**
 * Fetch all students from the API
 * @returns {Promise<Array>} Array of student objects
 */
export const getAllStudents = async () => {
  try {
    const response = await fetch(STUDENTS_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching students:', error);
    throw new Error('Failed to fetch students. Please check your connection.');
  }
};

/**
 * Create a new competition
 * @param {Object} competitionData - { category, venue, date }
 * @returns {Promise<Object>} Created competition object
 */
export const createCompetition = async (competitionData) => {
  try {
    const response = await fetch(COMPETITIONS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: competitionData.category,
        venue: competitionData.venue,
        date: competitionData.date,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || data.error || 'Failed to create competition');
    return data;
  } catch (error) {
    console.error('Error creating competition:', error);
    throw error;
  }
};

/**
 * Update an existing competition
 * @param {string} competitionId - Competition's database ID (_id)
 * @param {Object} competitionData - { category, venue, date }
 * @returns {Promise<Object>} Updated competition object
 */
export const updateCompetition = async (competitionId, competitionData) => {
  try {
    const response = await fetch(`${COMPETITIONS_URL}/${competitionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: competitionData.category,
        venue: competitionData.venue,
        date: competitionData.date,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || data.error || 'Failed to update competition');
    return data;
  } catch (error) {
    console.error('Error updating competition:', error);
    throw error;
  }
};

/**
 * Delete a competition
 * @param {string} competitionId - Competition's database ID (_id)
 * @returns {Promise<Object>} Response from server
 */
export const deleteCompetition = async (competitionId) => {
  try {
    const response = await fetch(`${COMPETITIONS_URL}/${competitionId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to delete competition');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting competition:', error);
    throw error;
  }
};

/**
 * Add a participant to a competition
 * @param {string} competitionId - Competition's database ID (_id)
 * @param {Object} student - Student object { _id, name, grade }
 * @returns {Promise<Object>} Response from server
 */
export const addParticipant = async (competitionId, student) => {
  try {
    const response = await fetch(`${COMPETITIONS_URL}/${competitionId}/participants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: student._id,
        studentName: student.name,
        grade: student.grade,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to add participant');
    return data;
  } catch (error) {
    console.error('Error adding participant:', error);
    throw error;
  }
};

/**
 * Add multiple participants to a competition
 * @param {string} competitionId - Competition's database ID (_id)
 * @param {Array} studentIds - Array of student IDs to add
 * @param {Array} students - Full list of students to look up details from
 * @returns {Promise<void>}
 */
export const addMultipleParticipants = async (competitionId, studentIds, students) => {
  try {
    for (const studentId of studentIds) {
      const student = students.find(s => s._id === studentId);
      if (student) {
        await addParticipant(competitionId, student);
      }
    }
  } catch (error) {
    console.error('Error adding multiple participants:', error);
    throw error;
  }
};

/**
 * Remove a participant from a competition
 * @param {string} competitionId - Competition's database ID (_id)
 * @param {string} studentId - Student's ID
 * @returns {Promise<Object>} Response from server
 */
export const removeParticipant = async (competitionId, studentId) => {
  try {
    const response = await fetch(
      `${COMPETITIONS_URL}/${competitionId}/participants/${studentId}`,
      { method: 'DELETE' }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to remove participant');
    }

    return await response.json();
  } catch (error) {
    console.error('Error removing participant:', error);
    throw error;
  }
};

/**
 * Format a date string to a readable format (e.g. 12 Jan 2025)
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default {
  getAllCompetitions,
  getCompetitionYears,
  getAllStudents,
  createCompetition,
  updateCompetition,
  deleteCompetition,
  addParticipant,
  addMultipleParticipants,
  removeParticipant,
  formatDate,
};