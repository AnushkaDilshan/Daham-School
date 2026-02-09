// validationService.js
// Validation service for form data

/**
 * Validate student registration form data
 * @param {Object} formData - Form data to validate
 * @returns {Object} Object containing validation errors
 */
export const validateStudentForm = (formData) => {
  const errors = {};
  
  // Name validation
  if (!formData.name?.trim()) {
    errors.name = 'Name is required';
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (!/^[a-zA-Z\s.]+$/.test(formData.name)) {
    errors.name = 'Name can only contain letters, spaces, and dots';
  }
  
  // Date of birth validation
  if (!formData.dateBirth) {
    errors.dateBirth = 'Date of birth is required';
  } else {
    const birthDate = new Date(formData.dateBirth);
    const today = new Date();
    
    if (birthDate >= today) {
      errors.dateBirth = 'Date of birth must be in the past';
    }
    
    // Check if student is too young (less than 3 years old)
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) 
      ? age - 1 
      : age;
    
    if (actualAge < 3) {
      errors.dateBirth = 'Student must be at least 3 years old';
    }
    
    if (actualAge > 25) {
      errors.dateBirth = 'Please enter a valid date of birth';
    }
  }
  
  // Address validation
  if (!formData.address?.trim()) {
    errors.address = 'Address is required';
  } else if (formData.address.trim().length < 10) {
    errors.address = 'Please enter a complete address (minimum 10 characters)';
  }
  
  // Guardian name validation
  if (!formData.guardiansName?.trim()) {
    errors.guardiansName = 'Guardian name is required';
  } else if (formData.guardiansName.trim().length < 2) {
    errors.guardiansName = 'Guardian name must be at least 2 characters';
  }
  
  // Phone number validation
  if (!formData.phonenumber?.trim()) {
    errors.phonenumber = 'Phone number is required';
  } else {
    const cleanPhone = formData.phonenumber.replace(/[\s\-\(\)]/g, '');
    if (!/^\d{10,15}$/.test(cleanPhone)) {
      errors.phonenumber = 'Please enter a valid phone number (10-15 digits)';
    }
  }
  
  // Grade validation
  if (!formData.grade?.trim()) {
    errors.grade = 'Grade is required';
  }
  
  // Gender validation
  if (!formData.gender?.trim()) {
    errors.gender = 'Gender is required';
  }
  
  // Mother's name validation (optional but if provided, should be valid)
  if (formData.motherName && formData.motherName.trim().length > 0) {
    if (formData.motherName.trim().length < 2) {
      errors.motherName = 'Mother\'s name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s.]+$/.test(formData.motherName)) {
      errors.motherName = 'Mother\'s name can only contain letters, spaces, and dots';
    }
  }
  
  // Father's name validation (optional but if provided, should be valid)
  if (formData.fatherName && formData.fatherName.trim().length > 0) {
    if (formData.fatherName.trim().length < 2) {
      errors.fatherName = 'Father\'s name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s.]+$/.test(formData.fatherName)) {
      errors.fatherName = 'Father\'s name can only contain letters, spaces, and dots';
    }
  }
  
  // Registration date validation
  if (formData.rejisteredDate) {
    const regDate = new Date(formData.rejisteredDate);
    const today = new Date();
    
    if (regDate > today) {
      errors.rejisteredDate = 'Registration date cannot be in the future';
    }
  }
  
  return errors;
};

/**
 * Check if there are any validation errors
 * @param {Object} errors - Errors object
 * @returns {boolean} True if there are errors, false otherwise
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

/**
 * Clean and format phone number
 * @param {string} phone - Phone number to clean
 * @returns {string} Cleaned phone number
 */
export const cleanPhoneNumber = (phone) => {
  return phone.replace(/[\s\-\(\)]/g, '');
};

/**
 * Format date to YYYY-MM-DD
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Calculate age from date of birth
 * @param {string} dateOfBirth - Date of birth
 * @returns {number} Age in years
 */
export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return 0;
  
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export default {
  validateStudentForm,
  hasErrors,
  cleanPhoneNumber,
  formatDate,
  calculateAge
};