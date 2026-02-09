import React, { useState, useEffect } from 'react';
import { 
  Search, UserPlus, Edit2, Trash2, ChevronDown, ChevronUp, Phone, User, Calendar, X, ArrowUp
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import * as studentService from '../services/studentManagementService';
import * as utilsService from '../services/studentUtilsService';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGrades, setExpandedGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await studentService.getAllStudents();
      setStudents(data);
      
      // Initialize expanded grades
      const grades = utilsService.initializeExpandedGrades(data);
      setExpandedGrades(grades);
      
    } catch (error) {
      console.error('Error fetching students:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (studentId, studentName) => {
    if (window.confirm(`Are you sure you want to delete ${studentName}?`)) {
      try {
        await studentService.deleteStudent(studentId);
        setStudents(students.filter(s => s._id !== studentId));
        alert('Student deleted successfully!');
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Failed to delete student. Please try again.');
      }
    }
  };

  const handleView = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const toggleStudentSelection = (studentId) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const toggleSelectAll = (gradeStudents) => {
    const newSelected = new Set(selectedStudents);
    const allSelected = gradeStudents.every(s => newSelected.has(s._id));
    
    if (allSelected) {
      gradeStudents.forEach(s => newSelected.delete(s._id));
    } else {
      gradeStudents.forEach(s => newSelected.add(s._id));
    }
    setSelectedStudents(newSelected);
  };

  const handleBulkGradeUpdate = async () => {
    if (selectedStudents.size === 0) {
      alert('Please select at least one student');
      return;
    }

    const selectedStudentsList = students.filter(s => selectedStudents.has(s._id));
    const updateSummary = utilsService.createGradeUpdateSummary(selectedStudentsList);

    if (window.confirm(`Update grades for ${selectedStudents.size} student(s)?\n\n${updateSummary}`)) {
      try {
        const updatedStudents = selectedStudentsList.map(student => ({
          ...student,
          grade: utilsService.incrementGrade(student.grade)
        }));

        await studentService.bulkUpdateGrades(updatedStudents);
        
        alert('Grades updated successfully!');
        setSelectedStudents(new Set());
        setSelectionMode(false);
        fetchStudents();
      } catch (error) {
        console.error('Error updating grades:', error);
        alert('Failed to update grades. Please try again.');
      }
    }
  };

  const groupedStudents = utilsService.groupStudentsByGrade(students);
  const filteredGroupedStudents = utilsService.filterGroupedStudents(groupedStudents, searchTerm);

  const toggleGrade = (grade) => {
    setExpandedGrades(prev => ({
      ...prev,
      [grade]: !prev[grade]
    }));
  };

  const StudentModal = () => {
    if (!selectedStudent) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{selectedStudent.name}</h2>
              <p className="text-blue-100">ID: {selectedStudent._id}</p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="text-gray-800 font-medium">{utilsService.formatDate(selectedStudent.dateBirth)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="text-gray-800 font-medium">{utilsService.calculateAge(selectedStudent.dateBirth)} years</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-800 font-medium">{selectedStudent.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Grade</p>
                  <p className="text-gray-800 font-medium">{selectedStudent.grade}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="text-gray-800 font-medium">{selectedStudent.gender || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Registered Date</p>
                  <p className="text-gray-800 font-medium">{selectedStudent.rejisteredDate}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Parent Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Mother's Name</p>
                  <p className="text-gray-800 font-medium">{selectedStudent.motherName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mother's Occupation</p>
                  <p className="text-gray-800 font-medium">{selectedStudent.mJobs || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Father's Name</p>
                  <p className="text-gray-800 font-medium">{selectedStudent.fatherName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Father's Occupation</p>
                  <p className="text-gray-800 font-medium">{selectedStudent.fJobs || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Guardian & Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Guardian's Name</p>
                  <p className="text-gray-800 font-medium">{selectedStudent.guardiansName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact Number</p>
                  <p className="text-gray-800 font-medium">{selectedStudent.phonenumber}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                <Edit2 size={18} />
                Edit Student
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  handleDelete(selectedStudent._id, selectedStudent.name);
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Trash2 size={18} />
                Delete Student
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchStudents}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                🏫 Daham School Student Management
              </h1>
              <p className="text-gray-600 text-sm md:text-base mt-1">
                Total Students: <span className="font-semibold text-blue-600">{students.length}</span> | 
                Grades: <span className="font-semibold text-blue-600">{Object.keys(groupedStudents).length}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectionMode(!selectionMode);
                  setSelectedStudents(new Set());
                }}
                className={`${
                  selectionMode 
                    ? 'bg-orange-600 hover:bg-orange-700' 
                    : 'bg-purple-600 hover:bg-purple-700'
                } text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg`}
              >
                <ArrowUp size={20} />
                <span className="font-medium">
                  {selectionMode ? 'Cancel Selection' : 'Bulk Grade Update'}
                </span>
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg"
                onClick={() => navigate("/studentregistation")}
              >
                <UserPlus size={20} />
                <span className="font-medium">Add New Student</span>
              </button>
            </div>
          </div>

          {selectionMode && selectedStudents.size > 0 && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-green-800 font-medium">
                  {selectedStudents.size} student(s) selected
                </p>
                <p className="text-green-600 text-sm">
                  Click "Update Grades" to increment selected students' grades by 1
                </p>
              </div>
              <button
                onClick={handleBulkGradeUpdate}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <ArrowUp size={18} />
                Update Grades
              </button>
            </div>
          )}

          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, ID, or phone number..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {Object.keys(filteredGroupedStudents).length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">No students found matching your search</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {utilsService.sortGrades(Object.keys(filteredGroupedStudents)).map((grade) => (
              <div key={grade} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => toggleGrade(grade)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-4 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    {selectionMode && (
                      <input
                        type="checkbox"
                        checked={filteredGroupedStudents[grade].every(s => selectedStudents.has(s._id))}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleSelectAll(filteredGroupedStudents[grade]);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-5 h-5 rounded cursor-pointer"
                      />
                    )}
                    <span className="text-lg md:text-xl font-semibold">{grade}</span>
                    <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                      {filteredGroupedStudents[grade].length} {filteredGroupedStudents[grade].length === 1 ? 'Student' : 'Students'}
                    </span>
                  </div>
                  {expandedGrades[grade] ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </button>

                {expandedGrades[grade] && (
                  <>
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                          <tr>
                            {selectionMode && (
                              <th className="px-4 py-3 text-center w-12"></th>
                            )}
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student ID</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Guardian</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone Number</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Registered</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredGroupedStudents[grade].map((student) => (
                            <tr key={student._id} className={`hover:bg-blue-50 transition-colors ${selectedStudents.has(student._id) ? 'bg-green-50' : ''}`}>
                              {selectionMode && (
                                <td className="px-4 py-3 text-center">
                                  <input
                                    type="checkbox"
                                    checked={selectedStudents.has(student._id)}
                                    onChange={() => toggleStudentSelection(student._id)}
                                    className="w-5 h-5 rounded cursor-pointer"
                                  />
                                </td>
                              )}
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className="text-sm font-semibold text-blue-600">{student._id}</span>
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => !selectionMode && handleView(student)}
                                  className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors text-left"
                                  disabled={selectionMode}
                                >
                                  {student.name}
                                </button>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm text-gray-600">{student.guardiansName}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm text-gray-600">{student.phonenumber}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm text-gray-600">{student.rejisteredDate}</span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                {!selectionMode && (
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => handleView(student)}
                                      className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-100 rounded-lg transition-all"
                                      title="View Details"
                                    >
                                      <User size={18} />
                                    </button>
                                    <button
                                      className="text-green-600 hover:text-green-800 p-2 hover:bg-green-100 rounded-lg transition-all"
                                      title="Edit Student"
                                    >
                                      <Edit2 size={18} />
                                    </button>
                                    <button 
                                      onClick={() => handleDelete(student._id, student.name)}
                                      className="text-red-600 hover:text-red-800 p-2 hover:bg-red-100 rounded-lg transition-all"
                                      title="Delete Student"
                                    >
                                      <Trash2 size={18} />
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="md:hidden divide-y divide-gray-200">
                      {filteredGroupedStudents[grade].map((student) => (
                        <div key={student._id} className={`p-4 hover:bg-blue-50 transition-colors ${selectedStudents.has(student._id) ? 'bg-green-50' : ''}`}>
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-start gap-3 flex-1">
                              {selectionMode && (
                                <input
                                  type="checkbox"
                                  checked={selectedStudents.has(student._id)}
                                  onChange={() => toggleStudentSelection(student._id)}
                                  className="w-5 h-5 rounded cursor-pointer mt-1"
                                />
                              )}
                              <div>
                                <button
                                  onClick={() => !selectionMode && handleView(student)}
                                  className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors text-left"
                                  disabled={selectionMode}
                                >
                                  {student.name}
                                </button>
                                <p className="text-sm text-blue-600 font-medium mt-1">{student._id}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mb-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User size={16} className="text-gray-400" />
                              <span>{student.guardiansName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone size={16} className="text-gray-400" />
                              <span>{student.phonenumber}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar size={16} className="text-gray-400" />
                              <span>{student.rejisteredDate}</span>
                            </div>
                          </div>

                          {!selectionMode && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleView(student)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                              >
                                <User size={16} />
                                View
                              </button>
                              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                <Edit2 size={16} />
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDelete(student._id, student.name)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <StudentModal />}
    </div>
  );
};

export default StudentManagement;