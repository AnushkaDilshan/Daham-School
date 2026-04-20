// competitionService.js
// Service layer for competition-related API calls

const API_URL = `${process.env.REACT_APP_API_URL}` || 'http://localhost:5000/api';
const COMPETITIONS_URL = `${API_URL}/competitions`;
const STUDENTS_URL = `${API_URL}/students`;
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
export const getAllCompetitions = async () => {
  try {
    const response = await fetch(COMPETITIONS_URL,{
      headers: getAuthHeaders(),
    });
      handleUnauthorized(response.status);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching competitions:', error);
    throw new Error('Failed to fetch competitions. Please check your connection.');
  }
};


export const getCompetitionYears = async () => {
  try {
    const response = await fetch(`${COMPETITIONS_URL}/years`,{
       headers: getAuthHeaders(),
    });
      handleUnauthorized(response.status);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching competition years:', error);
    throw new Error('Failed to fetch competition years.');
  }
};


export const getAllStudents = async () => {
  try {
    const response = await fetch(STUDENTS_URL, {
      headers: getAuthHeaders(),
    });
    handleUnauthorized(response.status);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching students:', error);
    throw new Error('Failed to fetch students. Please check your connection.');
  }
};


export const createCompetition = async (competitionData) => {
  try {
    const response = await fetch(COMPETITIONS_URL, {
      method: 'POST',
    headers: getAuthHeaders(),
      body: JSON.stringify({
        category: competitionData.category,
        venue: competitionData.venue,
        date: competitionData.date,
      }),
    });
  handleUnauthorized(response.status);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || data.error || 'Failed to create competition');
    return data;
  } catch (error) {
    console.error('Error creating competition:', error);
    throw error;
  }
};


export const updateCompetition = async (competitionId, competitionData) => {
  try {
    const response = await fetch(`${COMPETITIONS_URL}/${competitionId}`, {
      method: 'PUT',
  headers: getAuthHeaders(),
      body: JSON.stringify({
        category: competitionData.category,
        venue: competitionData.venue,
        date: competitionData.date,
      }),
    });
  handleUnauthorized(response.status);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || data.error || 'Failed to update competition');
    return data;
  } catch (error) {
    console.error('Error updating competition:', error);
    throw error;
  }
};


export const deleteCompetition = async (competitionId) => {
  try {
    const response = await fetch(`${COMPETITIONS_URL}/${competitionId}`, {
      method: 'DELETE',
  headers: getAuthHeaders(),
    });
 handleUnauthorized(response.status);
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


export const addParticipant = async (competitionId, student) => {
  try {
    const response = await fetch(`${COMPETITIONS_URL}/${competitionId}/participants`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        studentId: student._id,
        studentName: student.name,
        grade: student.grade,
      }),
    });
 handleUnauthorized(response.status);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to add participant');
    return data;
  } catch (error) {
    console.error('Error adding participant:', error);
    throw error;
  }
};


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


export const removeParticipant = async (competitionId, studentId) => {
  try {
    const response = await fetch(
      `${COMPETITIONS_URL}/${competitionId}/participants/${studentId}`,
      { method: 'DELETE' ,headers: getAuthHeaders(),}
    );
 handleUnauthorized(response.status);
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