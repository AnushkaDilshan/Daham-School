import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, X, Check } from 'lucide-react';
import * as teacherService from '../services/teacherService';

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  
  const [formData, setFormData] = useState({
    teacherId: '',
    name: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    phoneNumber: '',
    city: '',
    postalcode: '',
    policeName: '',
    email: '',
    password: '',
    qualification: '',
    experience: '',
    subject: '',
    joinedDate: '',
    employmentType: '',
    salary: '',
    nic: '',
    bankName: '',
    bankNumber: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    const filtered = teachers.filter(teacher =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.teacherId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTeachers(filtered);
  }, [searchTerm, teachers]);

  const fetchTeachers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await teacherService.getAllTeachers();
      setTeachers(data);
      setFilteredTeachers(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      teacherId: '',
      name: '',
      dateOfBirth: '',
      gender: '',
      address: '',
      phoneNumber: '',
      city: '',
      postalcode: '',
      policeName: '',
      email: '',
      password: '',
      qualification: '',
      experience: '',
      subject: '',
      joinedDate: '',
      employmentType: '',
      salary: '',
      nic: '',
      bankName: '',
      bankNumber: '',
      status: 'Active'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const openModal = (mode, teacher = null) => {
    setModalMode(mode);
    setSelectedTeacher(teacher);
    
    if (mode === 'add') {
      resetForm();
    } else if (teacher) {
      setFormData({
        teacherId: teacher.teacherId || '',
        name: teacher.name || '',
        dateOfBirth: teacher.dateOfBirth ? teacher.dateOfBirth.split('T')[0] : '',
        gender: teacher.gender || '',
        address: teacher.address || '',
        phoneNumber: teacher.phoneNumber || '',
        city: teacher.city || '',
        postalcode: teacher.postalcode || '',
        policeName: teacher.policeName || '',
        email: teacher.email || '',
        password: '',
        qualification: teacher.qualification || '',
        experience: teacher.experience || '',
        subject: teacher.subject || '',
        joinedDate: teacher.joinedDate ? teacher.joinedDate.split('T')[0] : '',
        employmentType: teacher.employmentType || '',
        salary: teacher.salary || '',
        nic: teacher.nic || '',
        bankName: teacher.bankName || '',
        bankNumber: teacher.bankNumber || '',
        status: teacher.status || 'Active'
      });
    }
    
    setShowModal(true);
    setError('');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTeacher(null);
    resetForm();
    setError('');
    setValidationErrors({});
  };

  const validateForm = () => {
    const errors = {};

    // Teacher ID validation
    if (modalMode === 'add' && !formData.teacherId.trim()) {
      errors.teacherId = 'Teacher ID is required';
    } else if (formData.teacherId && !/^[A-Za-z0-9-_]+$/.test(formData.teacherId)) {
      errors.teacherId = 'Teacher ID can only contain letters, numbers, hyphens, and underscores';
    }

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s.]+$/.test(formData.name)) {
      errors.name = 'Name can only contain letters, spaces, and dots';
    }

    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber.replace(/[\s-]/g, ''))) {
      errors.phoneNumber = 'Phone number must be 10 digits';
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    // City validation
    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }

    // Postal code validation
    if (!formData.postalcode.trim()) {
      errors.postalcode = 'Postal code is required';
    } else if (!/^[0-9]{5}$/.test(formData.postalcode)) {
      errors.postalcode = 'Postal code must be 5 digits';
    }

    // Police name validation
    if (!formData.policeName.trim()) {
      errors.policeName = 'Police name is required';
    }

    // Password validation (only for add mode)
    if (modalMode === 'add') {
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(formData.password)) {
        errors.password = 'Password must contain uppercase, lowercase, and number';
      }
    }

    // Subject validation
    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    // Experience validation
    if (formData.experience !== '' && formData.experience !== null) {
      const exp = Number(formData.experience);
      if (isNaN(exp) || exp < 0 || exp > 50) {
        errors.experience = 'Experience must be between 0 and 50 years';
      }
    }

    // Salary validation
    if (formData.salary !== '' && formData.salary !== null) {
      const sal = Number(formData.salary);
      if (isNaN(sal) || sal < 0) {
        errors.salary = 'Salary cannot be negative';
      }
    }

    // NIC validation
    if (formData.nic && !/^[0-9]{9}[vVxX]|[0-9]{12}$/.test(formData.nic)) {
      errors.nic = 'Invalid NIC format (9 digits + V/X or 12 digits)';
    }

    // Bank account validation
    if (formData.bankNumber && !/^[0-9]{10,16}$/.test(formData.bankNumber)) {
      errors.bankNumber = 'Bank account must be 10-16 digits';
    }

    // Date of birth validation
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 18) {
        errors.dateOfBirth = 'Teacher must be at least 18 years old';
      }
      if (age > 80) {
        errors.dateOfBirth = 'Please enter a valid date of birth';
      }
    }

    // Joined date validation
    if (formData.joinedDate) {
      const joinDate = new Date(formData.joinedDate);
      const today = new Date();
      if (joinDate > today) {
        errors.joinedDate = 'Joined date cannot be in the future';
      }
    }

    return errors;
  };

  const handleSubmit = async () => {
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError('Please fix the validation errors');
      return;
    }

    setLoading(true);
    setError('');
    setValidationErrors({});

    try {
      const cleanedData = teacherService.cleanTeacherData(formData, modalMode);

      if (modalMode === 'add') {
        await teacherService.createTeacher(cleanedData);
      } else {
        await teacherService.updateTeacher(selectedTeacher._id, cleanedData);
      }

      await fetchTeachers();
      closeModal();
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (teacher) => {
    if (!window.confirm(`Are you sure you want to delete ${teacher.name}?`)) {
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await teacherService.deleteTeacher(teacher._id);
      await fetchTeachers();
    } catch (err) {
      setError(err.message || 'Failed to delete teacher');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Teacher Management</h1>
            <button
              onClick={() => openModal('add')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <Plus size={20} />
              Add Teacher
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, ID, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading && teachers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      Loading teachers...
                    </td>
                  </tr>
                ) : filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No teachers found
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map((teacher) => (
                    <tr key={teacher._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{teacher.teacherId}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{teacher.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{teacher.subject}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{teacher.phoneNumber}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          teacher.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {teacher.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal('view', teacher)}
                            className="text-blue-600 hover:text-blue-800"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => openModal('edit', teacher)}
                            className="text-green-600 hover:text-green-800"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(teacher)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {modalMode === 'add' && 'Add New Teacher'}
                {modalMode === 'edit' && 'Edit Teacher'}
                {modalMode === 'view' && 'Teacher Details'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teacher ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="teacherId"
                    value={formData.teacherId}
                    onChange={handleInputChange}
                    disabled={modalMode !== 'add'}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${
                      validationErrors.teacherId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    readOnly={modalMode === 'view'}
                  />
                  {validationErrors.teacherId && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.teacherId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    readOnly={modalMode === 'view'}
                  />
                  {validationErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                    }`}
                    readOnly={modalMode === 'view'}
                  />
                  {validationErrors.dateOfBirth && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.dateOfBirth}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={modalMode === 'view'}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    readOnly={modalMode === 'view'}
                  />
                  {validationErrors.phoneNumber && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.phoneNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    readOnly={modalMode === 'view'}
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    readOnly={modalMode === 'view'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    readOnly={modalMode === 'view'}
                  />
                  {validationErrors.city && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="postalcode"
                    value={formData.postalcode}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.postalcode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    readOnly={modalMode === 'view'}
                  />
                  {validationErrors.postalcode && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.postalcode}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Police Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="policeName"
                    value={formData.policeName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.policeName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    readOnly={modalMode === 'view'}
                  />
                  {validationErrors.policeName && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.policeName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NIC
                  </label>
                  <input
                    type="text"
                    name="nic"
                    value={formData.nic}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.nic ? 'border-red-500' : 'border-gray-300'
                    }`}
                    readOnly={modalMode === 'view'}
                  />
                  {validationErrors.nic && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.nic}</p>
                  )}
                </div>

                {modalMode === 'add' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      minLength="6"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {validationErrors.password && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Qualification
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    readOnly={modalMode === 'view'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience (years)
                  </label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.experience ? 'border-red-500' : 'border-gray-300'
                    }`}
                    readOnly={modalMode === 'view'}
                  />
                  {validationErrors.experience && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.experience}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.subject ? 'border-red-500' : 'border-gray-300'
                    }`}
                    readOnly={modalMode === 'view'}
                  />
                  {validationErrors.subject && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.subject}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Joined Date
                  </label>
                  <input
                    type="date"
                    name="joinedDate"
                    value={formData.joinedDate}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.joinedDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    readOnly={modalMode === 'view'}
                  />
                  {validationErrors.joinedDate && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.joinedDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employment Type
                  </label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={modalMode === 'view'}
                  >
                    <option value="">Select Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Visiting">Visiting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.salary ? 'border-red-500' : 'border-gray-300'
                    }`}
                    readOnly={modalMode === 'view'}
                  />
                  {validationErrors.salary && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.salary}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    readOnly={modalMode === 'view'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    name="bankNumber"
                    value={formData.bankNumber}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.bankNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    readOnly={modalMode === 'view'}
                  />
                  {validationErrors.bankNumber && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.bankNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={modalMode === 'view'}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {modalMode !== 'view' && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
                  >
                    <Check size={20} />
                    {loading ? 'Saving...' : modalMode === 'add' ? 'Add Teacher' : 'Update Teacher'}
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;