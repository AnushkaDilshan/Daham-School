import React, { useState } from 'react';
import { User, Calendar, MapPin, Phone, GraduationCap, Users, Briefcase, Save, Loader, VenetianMask } from 'lucide-react';
import * as studentService from '../services/studentService';
import * as validationService from '../services/validationService';

const StudentRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    dateBirth: '',
    address: '',
    motherName: '',
    mJobs: '',
    fatherName: '',
    fJobs: '',
    guardiansName: '',
    phonenumber: '',
    rejisteredDate: new Date().toISOString().split('T')[0],
    grade: '',
    gender: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form using validation service
    const validationErrors = validationService.validateStudentForm(formData);
    
    if (validationService.hasErrors(validationErrors)) {
      setErrors(validationErrors);
      setSubmitStatus({ type: 'error', message: 'Please fix the errors below' });
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      await studentService.createStudent(formData);
      setSubmitStatus({ type: 'success', message: 'Student registered successfully!' });
      
      // Reset form after successful submission
      resetForm();
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: error.message || 'Failed to register student. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      dateBirth: '',
      address: '',
      motherName: '',
      mJobs: '',
      fatherName: '',
      fJobs: '',
      guardiansName: '',
      phonenumber: '',
      rejisteredDate: new Date().toISOString().split('T')[0],
      grade: '',
      gender: ''
    });
    setErrors({});
    setSubmitStatus(null);
  };

  const renderField = ({ 
    name, 
    label, 
    type = 'text', 
    placeholder, 
    icon: Icon, 
    required = false,
    options = null 
  }) => (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-gray-700">
        {Icon && <Icon className="w-4 h-4 mr-2" />}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {type === 'select' ? (
        <select
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors[name] ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        >
          <option value="">{placeholder}</option>
          {options?.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          placeholder={placeholder}
          rows={3}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
            errors[name] ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors[name] ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
      )}
      
      {errors[name] && (
        <p className="text-red-500 text-sm flex items-center">
          <span className="w-4 h-4 mr-1">⚠</span>
          {errors[name]}
        </p>
      )}
    </div>
  );

  const gradeOptions = [
    { value: 'Grade 1', label: 'Grade 1' },
    { value: 'Grade 2', label: 'Grade 2' },
    { value: 'Grade 3', label: 'Grade 3' },
    { value: 'Grade 4', label: 'Grade 4' },
    { value: 'Grade 5', label: 'Grade 5' },
    { value: 'Grade 6', label: 'Grade 6' },
    { value: 'Grade 7', label: 'Grade 7' },
    { value: 'Grade 8', label: 'Grade 8' },
    { value: 'Grade 9', label: 'Grade 9' },
    { value: 'Grade 10', label: 'Grade 10' },
    { value: 'Grade 11', label: 'Grade 11' },
    { value: 'Grade 12', label: 'Grade 12' }
  ]; 
  
  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 sm:px-8 py-6">
            <div className="flex items-center">
              <GraduationCap className="w-8 h-8 text-white mr-3" />
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Student Registration</h1>
            </div>
            <p className="text-blue-100 mt-2">Fill in the details to register a new student</p>
          </div>

          {/* Status Messages */}
          {submitStatus && (
            <div className={`mx-6 sm:mx-8 mt-6 p-4 rounded-lg ${
              submitStatus.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {submitStatus.message}
            </div>
          )}

          {/* Registration Form */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Section */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Personal Information
                </h2>
              </div>
              
              {renderField({
                name: 'name',
                label: 'Full Name',
                placeholder: 'Enter student\'s full name',
                icon: User,
                required: true
              })}
              
              {renderField({
                name: 'dateBirth',
                label: 'Date of Birth',
                type: 'date',
                icon: Calendar,
                required: true
              })}
              
              <div className="md:col-span-2">
                {renderField({
                  name: 'address',
                  label: 'Address',
                  type: 'textarea',
                  placeholder: 'Enter complete address',
                  icon: MapPin,
                  required: true
                })}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                {renderField({
                  name: 'phonenumber',
                  label: 'Phone Number',
                  placeholder: 'Enter contact number',
                  icon: Phone,
                  required: true
                })}
                
                {renderField({
                  name: 'grade',
                  label: 'Grade',
                  type: 'select',
                  placeholder: 'Select grade',
                  icon: GraduationCap,
                  required: true,
                  options: gradeOptions
                })}
                
                {renderField({
                  name: 'gender',
                  label: 'Gender',
                  type: 'select',
                  placeholder: 'Select Gender',
                  icon: VenetianMask,
                  required: true,
                  options: genderOptions
                })}
              </div>

              {/* Family Information Section */}
              <div className="md:col-span-2 mt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Family Information
                </h2>
              </div>
              
              {renderField({
                name: 'motherName',
                label: 'Mother\'s Name',
                placeholder: 'Enter mother\'s name',
                icon: User
              })}
              
              {renderField({
                name: 'mJobs',
                label: 'Mother\'s Occupation',
                placeholder: 'Enter mother\'s occupation',
                icon: Briefcase
              })}
              
              {renderField({
                name: 'fatherName',
                label: 'Father\'s Name',
                placeholder: 'Enter father\'s name',
                icon: User
              })}
              
              {renderField({
                name: 'fJobs',
                label: 'Father\'s Occupation',
                placeholder: 'Enter father\'s occupation',
                icon: Briefcase
              })}
              
              {renderField({
                name: 'guardiansName',
                label: 'Guardian\'s Name',
                placeholder: 'Enter guardian\'s name',
                icon: Users,
                required: true
              })}
              
              {renderField({
                name: 'rejisteredDate',
                label: 'Registration Date',
                type: 'date',
                icon: Calendar,
                required: true
              })}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Reset Form
              </button>
              
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Register Student
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistrationForm;