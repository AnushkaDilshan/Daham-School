import React, { useState, useEffect } from 'react';
import { 
  Search, UserPlus, Edit2, Trash2, Award, User, Phone, Calendar, X, Shield
} from 'lucide-react';
import * as prefectService from '../services/prefectService';

// Helper component for Add Modal - moved outside to prevent re-renders
const AddPrefectModal = ({ 
  show, 
  onClose, 
  formData, 
  setFormData, 
  students, 
  prefectPositions,
  onSubmit,
  studentSearchTerm,
  setStudentSearchTerm,
  showStudentDropdown,
  setShowStudentDropdown
}) => {
  if (!show) return null;

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
    student._id?.toLowerCase().includes(studentSearchTerm.toLowerCase())
  );

  const selectedStudent = students.find(s => s._id === formData.studentId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield size={28} />
            <h2 className="text-2xl font-bold">Add New Prefect</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search and Select Student <span className="text-red-500">*</span>
            </label>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name or student ID..."
                value={studentSearchTerm}
                onChange={(e) => {
                  setStudentSearchTerm(e.target.value);
                  setShowStudentDropdown(true);
                }}
                onFocus={() => setShowStudentDropdown(true)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            {showStudentDropdown && (
              <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg mb-2 bg-white">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map(student => (
                    <button
                      key={student._id}
                      type="button"
                      onClick={() => {
                        setFormData({...formData, studentId: student._id});
                        setShowStudentDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-purple-50 transition-colors border-b last:border-b-0 ${
                        formData.studentId === student._id ? 'bg-purple-100' : ''
                      }`}
                    >
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-gray-600">{student._id} - Grade {student.grade}</div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-center text-gray-500">
                    No students found matching "{studentSearchTerm}"
                  </div>
                )}
              </div>
            )}
            {formData.studentId && !showStudentDropdown && (
              <div className="text-sm text-gray-600 mb-2">
                Selected: <span className="font-medium">{selectedStudent?.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({...formData, studentId: ''});
                    setStudentSearchTerm('');
                  }}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {selectedStudent && (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">Selected Student Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <span className="ml-2 font-medium">{selectedStudent.name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Grade:</span>
                  <span className="ml-2 font-medium">{selectedStudent.grade}</span>
                </div>
                <div>
                  <span className="text-gray-600">ID:</span>
                  <span className="ml-2 font-medium">{selectedStudent._id}</span>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <span className="ml-2 font-medium">{selectedStudent.phonenumber}</span>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prefect Position <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">-- Select Position --</option>
              {prefectPositions.map(position => (
                <option key={position} value={position}>{position}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date (Optional)
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              min={formData.startDate}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty if currently serving. Status will automatically become "Inactive" after this date.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsibilities <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.responsibilities}
              onChange={(e) => setFormData({...formData, responsibilities: e.target.value})}
              placeholder="Enter main responsibilities..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Shield size={18} />
              Add Prefect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for Edit Modal - moved outside to prevent re-renders
const EditPrefectModal = ({ 
  show, 
  onClose, 
  selectedPrefect,
  editFormData, 
  setEditFormData, 
  prefectPositions,
  onSubmit,
}) => {
  if (!show || !selectedPrefect) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Edit2 size={28} />
            <div>
              <h2 className="text-2xl font-bold">Edit Prefect</h2>
              <p className="text-blue-100 text-sm">{selectedPrefect.student?.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Student Information</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <span className="ml-2 font-medium">{selectedPrefect.student?.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Grade:</span>
                <span className="ml-2 font-medium">{selectedPrefect.student?.grade}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">ID:</span>
                <span className="ml-2 font-medium">{selectedPrefect.student?._id}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prefect Position <span className="text-red-500">*</span>
            </label>
            <select
              value={editFormData.position}
              onChange={(e) => setEditFormData({...editFormData, position: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Select Position --</option>
              {prefectPositions.map(position => (
                <option key={position} value={position}>{position}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={editFormData.startDate}
              onChange={(e) => setEditFormData({...editFormData, startDate: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date (Optional)
            </label>
            <input
              type="date"
              value={editFormData.endDate}
              onChange={(e) => setEditFormData({...editFormData, endDate: e.target.value})}
              min={editFormData.startDate}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty if currently serving. Status will automatically become "Inactive" after this date.
            </p>
            {editFormData.endDate && (
              <p className="text-xs font-medium mt-1" style={{
                color: prefectService.getStatusBasedOnDate(editFormData.endDate) === 'Active' ? 'green' : 'red'
              }}>
                Status will be: {prefectService.getStatusBasedOnDate(editFormData.endDate)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Responsibilities <span className="text-red-500">*</span>
            </label>
            <textarea
              value={editFormData.responsibilities}
              onChange={(e) => setEditFormData({...editFormData, responsibilities: e.target.value})}
              placeholder="Enter main responsibilities..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Edit2 size={18} />
              Update Prefect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const PrefectManagement = () => {
  const [prefects, setPrefects] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrefect, setSelectedPrefect] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [formData, setFormData] = useState({
    studentId: '',
    position: '',
    startDate: '',
    endDate: '',
    responsibilities: ''
  });
  const [editFormData, setEditFormData] = useState({
    position: '',
    startDate: '',
    endDate: '',
    responsibilities: '',
    status: ''
  });

  const prefectPositions = [
    'Head Prefect',
    'Deputy Head Prefect',
    'Sports Prefect',
    'Library Prefect',
    'Discipline Prefect',
    'Cultural Prefect',
    'Academic Prefect',
    'Social Service Prefect'
  ];

  const fetchPrefects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await prefectService.getAllPrefects();
      setPrefects(data);
    } catch (error) {
      console.error('Error fetching prefects:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const data = await prefectService.getAllStudents();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchPrefects();
    fetchStudents();
  }, []);

  const handleAddPrefect = async () => {
    if (!formData.studentId || !formData.position || !formData.startDate || !formData.responsibilities) {
      alert('Please fill all required fields');
      return;
    }

    try {
      await prefectService.createPrefect(formData);
      alert('Prefect added successfully!');
      setShowAddModal(false);
      setFormData({ studentId: '', position: '', startDate: '', endDate: '', responsibilities: '' });
      setStudentSearchTerm('');
      setShowStudentDropdown(false);
      fetchPrefects();
    } catch (error) {
      console.error('Error adding prefect:', error);
      alert(error.message || 'Failed to add prefect. Please try again.');
    }
  };

  const handleUpdatePrefect = async () => {
    if (!editFormData.position || !editFormData.startDate || !editFormData.responsibilities) {
      alert('Please fill all required fields');
      return;
    }

    try {
      await prefectService.updatePrefect(selectedPrefect._id, editFormData);
      alert('Prefect updated successfully!');
      setShowEditModal(false);
      setSelectedPrefect(null);
      fetchPrefects();
    } catch (error) {
      console.error('Error updating prefect:', error);
      alert(error.message || 'Failed to update prefect. Please try again.');
    }
  };

  const handleDelete = async (prefectId, studentName) => {
    if (window.confirm(`Are you sure you want to remove ${studentName} from prefects?`)) {
      try {
        await prefectService.deletePrefect(prefectId);
        setPrefects(prefects.filter(p => p._id !== prefectId));
        alert('Prefect removed successfully!');
      } catch (error) {
        console.error('Error deleting prefect:', error);
        alert(error.message || 'Failed to delete prefect. Please try again.');
      }
    }
  };

  const handleView = (prefect) => {
    setSelectedPrefect(prefect);
    setShowModal(true);
  };

  const handleEdit = (prefect) => {
    setSelectedPrefect(prefect);
    setEditFormData({
      position: prefect.position,
      startDate: prefect.startDate ? prefect.startDate.split('T')[0] : '',
      endDate: prefect.endDate ? prefect.endDate.split('T')[0] : '',
      responsibilities: prefect.responsibilities,
      status: prefect.status
    });
    setShowEditModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setStudentSearchTerm('');
    setShowStudentDropdown(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedPrefect(null);
  };

  const filteredPrefects = prefects.filter(prefect =>
    prefect.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prefect.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prefect.student?._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activePrefects = filteredPrefects.filter(p => p.status === 'Active');
  const inactivePrefects = filteredPrefects.filter(p => p.status === 'Inactive');

  const getDisplayedPrefects = () => {
    if (activeTab === 'active') return activePrefects;
    if (activeTab === 'inactive') return inactivePrefects;
    return filteredPrefects;
  };

  const displayedPrefects = getDisplayedPrefects();

  const PrefectDetailModal = () => {
    if (!selectedPrefect) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield size={28} />
                <h2 className="text-2xl font-bold">{selectedPrefect.student?.name}</h2>
              </div>
              <p className="text-purple-100">{selectedPrefect.position}</p>
              <p className="text-purple-200 text-sm">ID: {selectedPrefect.student?._id}</p>
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
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Student Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Student ID</p>
                  <p className="text-gray-800 font-medium">{selectedPrefect.student?._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Grade</p>
                  <p className="text-gray-800 font-medium">{selectedPrefect.student?.grade}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="text-gray-800 font-medium">{selectedPrefect.student?.phonenumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Guardian</p>
                  <p className="text-gray-800 font-medium">{selectedPrefect.student?.guardiansName}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Prefect Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Position</p>
                  <p className="text-gray-800 font-medium">{selectedPrefect.position}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="text-gray-800 font-medium">{prefectService.formatDate(selectedPrefect.startDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="text-gray-800 font-medium">
                    {selectedPrefect.endDate ? prefectService.formatDate(selectedPrefect.endDate) : 'Currently Serving'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedPrefect.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedPrefect.status}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Responsibilities</p>
                  <p className="text-gray-800 font-medium">{selectedPrefect.responsibilities}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  handleEdit(selectedPrefect);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Edit2 size={18} />
                Edit Prefect
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  handleDelete(selectedPrefect._id, selectedPrefect.student?.name);
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Trash2 size={18} />
                Remove Prefect
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading prefects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchPrefects}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Shield className="text-purple-600" size={32} />
                School Prefects Management
              </h1>
              <p className="text-gray-600 text-sm md:text-base mt-1">
                Total Prefects: <span className="font-semibold text-purple-600">{prefects.length}</span>
                {' • '}
                Active: <span className="font-semibold text-green-600">
                  {prefects.filter(p => p.status === 'Active').length}
                </span>
                {' • '}
                Inactive: <span className="font-semibold text-gray-600">
                  {prefects.filter(p => p.status === 'Inactive').length}
                </span>
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg"
            >
              <UserPlus size={20} />
              <span className="font-medium">Add New Prefect</span>
            </button>
          </div>

          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, position, or student ID..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Tab Navigation */}
          <div className="mt-4 flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeTab === 'all'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              All ({filteredPrefects.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeTab === 'active'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Active ({activePrefects.length})
            </button>
            <button
              onClick={() => setActiveTab('inactive')}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeTab === 'inactive'
                  ? 'border-gray-600 text-gray-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Inactive ({inactivePrefects.length})
            </button>
          </div>
        </div>

        {displayedPrefects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Shield className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-gray-500 text-lg">No prefects found</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Student ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Grade</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Position</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Start Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">End Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayedPrefects.map((prefect) => (
                    <tr key={prefect._id} className="hover:bg-purple-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-semibold text-purple-600">{prefect.student?._id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleView(prefect)}
                          className="text-sm font-medium text-gray-900 hover:text-purple-600 transition-colors text-left"
                        >
                          {prefect.student?.name}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{prefect.student?.grade}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                          <Award size={14} />
                          {prefect.position}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{prefectService.formatDate(prefect.startDate)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">
                          {prefect.endDate ? prefectService.formatDate(prefect.endDate) : '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          prefect.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {prefect.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleView(prefect)}
                            className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-100 rounded-lg transition-all"
                            title="View Details"
                          >
                            <User size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(prefect)}
                            className="text-green-600 hover:text-green-800 p-2 hover:bg-green-100 rounded-lg transition-all"
                            title="Edit Prefect"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(prefect._id, prefect.student?.name)}
                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-100 rounded-lg transition-all"
                            title="Remove Prefect"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200">
              {displayedPrefects.map((prefect) => (
                <div key={prefect._id} className="p-4 hover:bg-purple-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <button
                        onClick={() => handleView(prefect)}
                        className="text-base font-semibold text-gray-900 hover:text-purple-600 transition-colors text-left"
                      >
                        {prefect.student?.name}
                      </button>
                      <p className="text-sm text-purple-600 font-medium mt-1">{prefect.student?._id}</p>
                      <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                        <Award size={12} />
                        {prefect.position}
                      </span>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      prefect.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {prefect.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-medium">Grade:</span>
                      <span>{prefect.student?.grade}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} className="text-gray-400" />
                      <span>Start: {prefectService.formatDate(prefect.startDate)}</span>
                    </div>
                    {prefect.endDate && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} className="text-gray-400" />
                        <span>End: {prefectService.formatDate(prefect.endDate)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(prefect)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <User size={16} />
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(prefect)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(prefect._id, prefect.student?.name)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showModal && <PrefectDetailModal />}

      <AddPrefectModal
        show={showAddModal}
        onClose={handleCloseAddModal}
        formData={formData}
        setFormData={setFormData}
        students={students}
        prefectPositions={prefectPositions}
        onSubmit={handleAddPrefect}
        studentSearchTerm={studentSearchTerm}
        setStudentSearchTerm={setStudentSearchTerm}
        showStudentDropdown={showStudentDropdown}
        setShowStudentDropdown={setShowStudentDropdown}
      />

      <EditPrefectModal
        show={showEditModal}
        onClose={handleCloseEditModal}
        selectedPrefect={selectedPrefect}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        prefectPositions={prefectPositions}
        onSubmit={handleUpdatePrefect}
      />
    </div>
  );
};

export default PrefectManagement;