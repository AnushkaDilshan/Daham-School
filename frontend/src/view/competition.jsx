import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Edit2, Trash2, ChevronDown, ChevronUp, Calendar, 
  MapPin, Users, X, UserPlus, UserMinus
} from 'lucide-react';

const CompetitionManagement = () => {
  const [competitions, setCompetitions] = useState([]);
  const [students, setStudents] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [expandedYears, setExpandedYears] = useState({});

  const API_URL = 'http://localhost:5000/api';

  const [formData, setFormData] = useState({
    category: '',
    venue: '',
    date: '',
    selectedStudents: [] // Add this for selected students
  });

  useEffect(() => {
    fetchCompetitions();
    fetchStudents();
    fetchYears();
  }, []);

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/competitions`);
      if (!response.ok) throw new Error('Failed to fetch competitions');
      const data = await response.json();
      setCompetitions(data);
      
      // Auto expand all years
      const yearsExpanded = {};
      const uniqueYears = [...new Set(data.map(c => c.year))];
      uniqueYears.forEach(year => {
        yearsExpanded[year] = true;
      });
      setExpandedYears(yearsExpanded);
    } catch (error) {
      console.error('Error fetching competitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      console.log('Fetching students from:', `${API_URL}/students`);
      const response = await fetch(`${API_URL}/students`);
      console.log('Response status:', response.status);
      
      if (!response.ok) throw new Error('Failed to fetch students');
      
      const data = await response.json();
      console.log('Students loaded:', data);
      console.log('Number of students:', data.length);
      
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Could not load students. Error: ' + error.message);
    }
  };

  const fetchYears = async () => {
    try {
      const response = await fetch(`${API_URL}/competitions/years`);
      if (!response.ok) throw new Error('Failed to fetch years');
      const data = await response.json();
      setYears(data);
    } catch (error) {
      console.error('Error fetching years:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // First create the competition
      const url = modalMode === 'create' 
        ? `${API_URL}/competitions`
        : `${API_URL}/competitions/${selectedCompetition._id}`;
      
      const method = modalMode === 'create' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: formData.category,
          venue: formData.venue,
          date: formData.date
        })
      });

      if (!response.ok) throw new Error('Failed to save competition');
      
      const savedCompetition = await response.json();
      
      // If creating new competition and students are selected, add them
      if (modalMode === 'create' && formData.selectedStudents.length > 0) {
        for (const studentId of formData.selectedStudents) {
          const student = students.find(s => s._id === studentId);
          if (student) {
            await fetch(`${API_URL}/competitions/${savedCompetition._id}/participants`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                studentId: student._id,
                studentName: student.name,
                grade: student.grade
              })
            });
          }
        }
      }
      
      alert(`Competition ${modalMode === 'create' ? 'created' : 'updated'} successfully!`);
      setShowModal(false);
      resetForm();
      fetchCompetitions();
      fetchYears();
    } catch (error) {
      alert('Error saving competition: ' + error.message);
    }
  };

  const handleDelete = async (competitionId) => {
    if (window.confirm('Are you sure you want to delete this competition?')) {
      try {
        const response = await fetch(`${API_URL}/competitions/${competitionId}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete competition');
        alert('Competition deleted successfully!');
        fetchCompetitions();
        fetchYears();
      } catch (error) {
        alert('Error deleting competition: ' + error.message);
      }
    }
  };

  const handleAddStudent = async (student) => {
    try {
      const response = await fetch(`${API_URL}/competitions/${selectedCompetition._id}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student._id,
          studentName: student.name,
          grade: student.grade
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      
      alert('Student added successfully!');
      fetchCompetitions();
      setShowAddStudentModal(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRemoveStudent = async (competitionId, studentId, studentName) => {
    if (window.confirm(`Remove ${studentName} from this competition?`)) {
      try {
        const response = await fetch(
          `${API_URL}/competitions/${competitionId}/participants/${studentId}`,
          { method: 'DELETE' }
        );
        if (!response.ok) throw new Error('Failed to remove student');
        alert('Student removed successfully!');
        fetchCompetitions();
      } catch (error) {
        alert('Error removing student: ' + error.message);
      }
    }
  };

  const handleEdit = (competition) => {
    setSelectedCompetition(competition);
    setFormData({
      category: competition.category,
      venue: competition.venue,
      date: competition.date.split('T')[0],
      selectedStudents: []
    });
    setModalMode('edit');
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      category: '',
      venue: '',
      date: '',
      selectedStudents: []
    });
    setSelectedCompetition(null);
  };

  const groupedByYear = competitions.reduce((acc, comp) => {
    const year = comp.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(comp);
    return acc;
  }, {});

  const filteredGroupedByYear = Object.keys(groupedByYear).reduce((acc, year) => {
    const filtered = groupedByYear[year].filter(comp =>
      comp.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.participants.some(p => 
        p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    
    if (selectedYear === 'All' || year === selectedYear) {
      if (filtered.length > 0) {
        acc[year] = filtered;
      }
    }
    return acc;
  }, {});

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading competitions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                🏆 Daham School Competitions
              </h1>
              <p className="text-gray-600 text-sm md:text-base mt-1">
                Total Competitions: <span className="font-semibold text-purple-600">{competitions.length}</span>
              </p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setModalMode('create');
                setShowModal(true);
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg"
            >
              <Plus size={20} />
              <span className="font-medium">Add Competition</span>
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by category, venue, or student..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="All">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Competitions Grouped by Year */}
        {Object.keys(filteredGroupedByYear).length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">No competitions found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.keys(filteredGroupedByYear).sort((a, b) => b - a).map((year) => (
              <div key={year} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => setExpandedYears(prev => ({
                    ...prev,
                    [year]: !prev[year]
                  }))}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-5 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">📅</span>
                    <div className="text-left">
                      <span className="text-2xl font-bold">Year {year}</span>
                      <p className="text-purple-100 text-sm">
                        {filteredGroupedByYear[year].length} {filteredGroupedByYear[year].length === 1 ? 'Competition' : 'Competitions'}
                      </p>
                    </div>
                  </div>
                  {expandedYears[year] ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
                </button>

                {expandedYears[year] && (
                  <div className="p-6 space-y-4">
                    {filteredGroupedByYear[year].map((competition) => (
                      <div key={competition._id} className="border-2 border-purple-100 rounded-lg p-5 hover:border-purple-300 transition-all">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-3">
                              <span className="text-3xl">🎯</span>
                              <div>
                                <h3 className="text-xl font-bold text-gray-800">{competition.category}</h3>
                                <div className="flex flex-col gap-2 mt-2">
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar size={16} className="text-purple-600" />
                                    <span className="text-sm font-medium">{formatDate(competition.date)}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin size={16} className="text-purple-600" />
                                    <span className="text-sm">{competition.venue}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(competition)}
                              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(competition._id)}
                              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        {/* Participants Section */}
                        <div className="bg-purple-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                              <Users size={18} className="text-purple-600" />
                              Participants ({competition.participants.length})
                            </h4>
                            <button
                              onClick={() => {
                                setSelectedCompetition(competition);
                                setShowAddStudentModal(true);
                              }}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
                            >
                              <UserPlus size={16} />
                              Add Student
                            </button>
                          </div>
                          
                          {competition.participants.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-4">No participants yet</p>
                          ) : (
                            <div className="space-y-2">
                              {competition.participants.map((participant, index) => (
                                <div
                                  key={participant.studentId}
                                  className="bg-white rounded-lg p-3 flex items-center justify-between hover:shadow-md transition-shadow"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                                      {index + 1}
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-800">{participant.studentName}</p>
                                      <p className="text-xs text-gray-600">ID: {participant.studentId} | Grade: {participant.grade}</p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveStudent(competition._id, participant.studentId, participant.studentName)}
                                    className="text-red-600 hover:text-red-800 p-2 hover:bg-red-100 rounded-lg transition-colors"
                                    title="Remove"
                                  >
                                    <UserMinus size={18} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Competition Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex justify-between items-center rounded-t-lg">
              <h2 className="text-xl font-bold">
                {modalMode === 'create' ? 'Add New Competition' : 'Edit Competition'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="e.g., Science Quiz, Essay Writing"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Venue *</label>
                <input
                  type="text"
                  required
                  value={formData.venue}
                  onChange={(e) => setFormData({...formData, venue: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="e.g., School Hall, Main Ground"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Student Selection Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Students {modalMode === 'create' && '(Optional)'}
                </label>
                <div className="border border-gray-300 rounded-lg p-3 max-h-60 overflow-y-auto">
                  {students.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">No students available</p>
                  ) : (
                    <div className="space-y-2">
                      <div className="mb-2">
                        <input
                          type="text"
                          placeholder="Search students..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      {students
                        .filter(student => 
                          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student._id.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map(student => (
                          <label
                            key={student._id}
                            className="flex items-center gap-3 p-2 hover:bg-purple-50 rounded-lg cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={formData.selectedStudents.includes(student._id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({
                                    ...formData,
                                    selectedStudents: [...formData.selectedStudents, student._id]
                                  });
                                } else {
                                  setFormData({
                                    ...formData,
                                    selectedStudents: formData.selectedStudents.filter(id => id !== student._id)
                                  });
                                }
                              }}
                              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{student.name}</p>
                              <p className="text-xs text-gray-500">ID: {student._id} | Grade: {student.grade}</p>
                            </div>
                          </label>
                        ))}
                    </div>
                  )}
                </div>
                {formData.selectedStudents.length > 0 && (
                  <p className="text-sm text-purple-600 mt-2">
                    {formData.selectedStudents.length} student(s) selected
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  {modalMode === 'create' ? 'Create' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudentModal && selectedCompetition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex justify-between items-center sticky top-0">
              <h2 className="text-xl font-bold">Add Student to Competition</h2>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search students by name or ID..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Show loading or error state */}
              {students.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">No students available</p>
                  <p className="text-sm text-gray-400">Make sure students are registered in the system</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {students
                    .filter(student => 
                      !selectedCompetition.participants.some(p => p.studentId === student._id) &&
                      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       student._id.toLowerCase().includes(searchTerm.toLowerCase()))
                    )
                    .map(student => (
                      <div
                        key={student._id}
                        className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all"
                      >
                        <div>
                          <p className="font-semibold text-gray-800">{student.name}</p>
                          <p className="text-sm text-gray-600">ID: {student._id} | Grade: {student.grade}</p>
                        </div>
                        <button
                          onClick={() => handleAddStudent(student)}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
                        >
                          <UserPlus size={16} />
                          Add
                        </button>
                      </div>
                    ))}
                  {students.filter(student => 
                    !selectedCompetition.participants.some(p => p.studentId === student._id) &&
                    (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     student._id.toLowerCase().includes(searchTerm.toLowerCase()))
                  ).length === 0 && students.length > 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>All students are already added to this competition</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompetitionManagement;