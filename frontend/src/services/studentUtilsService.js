// studentUtilsService.js
// Utility functions for student data processing

/**
 * Group students by grade
 * @param {Array} students - Array of student objects
 * @returns {Object} Object with grades as keys and arrays of students as values
 */
export const groupStudentsByGrade = (students) => {
  return students.reduce((acc, student) => {
    const grade = student.grade || 'Unassigned';
    if (!acc[grade]) {
      acc[grade] = [];
    }
    acc[grade].push(student);
    return acc;
  }, {});
};

/**
 * Filter students by search term
 * @param {Array} students - Array of student objects
 * @param {string} searchTerm - Search query
 * @returns {Array} Filtered array of students
 */
export const filterStudents = (students, searchTerm) => {
  if (!searchTerm) return students;
  
  const lowerSearch = searchTerm.toLowerCase();
  return students.filter(student =>
    student.name.toLowerCase().includes(lowerSearch) ||
    student._id.toLowerCase().includes(lowerSearch) ||
    student.phonenumber.includes(searchTerm)
  );
};

/**
 * Filter grouped students by search term
 * @param {Object} groupedStudents - Object with grades as keys
 * @param {string} searchTerm - Search query
 * @returns {Object} Filtered grouped students object
 */
export const filterGroupedStudents = (groupedStudents, searchTerm) => {
  if (!searchTerm) return groupedStudents;
  
  return Object.keys(groupedStudents).reduce((acc, grade) => {
    const filtered = filterStudents(groupedStudents[grade], searchTerm);
    if (filtered.length > 0) {
      acc[grade] = filtered;
    }
    return acc;
  }, {});
};

/**
 * Format date to localized string
 * @param {string} dateString - ISO date string
 * @param {string} locale - Locale string (default: 'en-GB')
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, locale = 'en-GB') => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Calculate age from date of birth
 * @param {string} dateOfBirth - Date of birth string
 * @returns {number|string} Age in years or 'N/A'
 */
export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return 'N/A';
  
  try {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    console.error('Error calculating age:', error);
    return 'N/A';
  }
};

/**
 * Increment grade number by 1
 * @param {string} currentGrade - Current grade string (e.g., "Grade 8")
 * @returns {string} Incremented grade string
 */
export const incrementGrade = (currentGrade) => {
  const gradeMatch = currentGrade.match(/(\d+)/);
  if (gradeMatch) {
    const gradeNumber = parseInt(gradeMatch[0]);
    return currentGrade.replace(/\d+/, gradeNumber + 1);
  }
  return currentGrade;
};

/**
 * Create grade update summary for confirmation
 * @param {Array} students - Array of student objects
 * @returns {string} Summary string
 */
export const createGradeUpdateSummary = (students) => {
  return students.map(s => 
    `${s.name}: ${s.grade} → ${incrementGrade(s.grade)}`
  ).join('\n');
};

/**
 * Initialize expanded grades state
 * @param {Array} students - Array of student objects
 * @returns {Object} Object with all grades set to true (expanded)
 */
export const initializeExpandedGrades = (students) => {
  const grades = {};
  students.forEach(student => {
    grades[student.grade] = true;
  });
  return grades;
};

/**
 * Sort grades in natural order (Grade 1, Grade 2, ..., Grade 12, Unassigned)
 * @param {Array} gradeKeys - Array of grade strings
 * @returns {Array} Sorted array of grade strings
 */
export const sortGrades = (gradeKeys) => {
  return gradeKeys.sort((a, b) => {
    // Handle "Unassigned" - put it at the end
    if (a === 'Unassigned') return 1;
    if (b === 'Unassigned') return -1;
    
    // Extract numbers from grade strings
    const numA = parseInt(a.match(/\d+/)?.[0] || 0);
    const numB = parseInt(b.match(/\d+/)?.[0] || 0);
    
    return numA - numB;
  });
};

/**
 * Get statistics from student data
 * @param {Array} students - Array of student objects
 * @returns {Object} Statistics object
 */
export const getStudentStatistics = (students) => {
  const grouped = groupStudentsByGrade(students);
  
  return {
    totalStudents: students.length,
    totalGrades: Object.keys(grouped).length,
    studentsByGrade: Object.keys(grouped).reduce((acc, grade) => {
      acc[grade] = grouped[grade].length;
      return acc;
    }, {}),
    averageStudentsPerGrade: students.length / Object.keys(grouped).length || 0
  };
};

/**
 * Validate grade format
 * @param {string} grade - Grade string to validate
 * @returns {boolean} True if valid grade format
 */
export const isValidGrade = (grade) => {
  if (!grade) return false;
  if (grade === 'Unassigned') return true;
  
  const gradeMatch = grade.match(/Grade\s+(\d+)/i);
  if (!gradeMatch) return false;
  
  const gradeNumber = parseInt(gradeMatch[1]);
  return gradeNumber >= 1 && gradeNumber <= 13;
};

export default {
  groupStudentsByGrade,
  filterStudents,
  filterGroupedStudents,
  formatDate,
  calculateAge,
  incrementGrade,
  createGradeUpdateSummary,
  initializeExpandedGrades,
  sortGrades,
  getStudentStatistics,
  isValidGrade
};