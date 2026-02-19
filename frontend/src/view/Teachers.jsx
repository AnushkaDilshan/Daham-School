import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, X, Check, GraduationCap, BookOpen, User } from 'lucide-react';
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
    teacherId: '', name: '', dateOfBirth: '', gender: '', address: '',
    phoneNumber: '', city: '', postalcode: '', policeName: '', email: '',
    password: '', qualification: '', experience: '', subject: '',
    joinedDate: '', employmentType: '', salary: '', nic: '',
    bankName: '', bankNumber: '', status: 'Active'
  });

  useEffect(() => { fetchTeachers(); }, []);

  useEffect(() => {
    const filtered = teachers.filter(teacher =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.teacherId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTeachers(filtered);
  }, [searchTerm, teachers]);

  const fetchTeachers = async () => {
    setLoading(true); setError('');
    try {
      const data = await teacherService.getAllTeachers();
      setTeachers(data); setFilteredTeachers(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch teachers');
    } finally { setLoading(false); }
  };

  const emptyForm = {
    teacherId: '', name: '', dateOfBirth: '', gender: '', address: '',
    phoneNumber: '', city: '', postalcode: '', policeName: '', email: '',
    password: '', qualification: '', experience: '', subject: '',
    joinedDate: '', employmentType: '', salary: '', nic: '',
    bankName: '', bankNumber: '', status: 'Active'
  };

  const resetForm = () => setFormData(emptyForm);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (validationErrors[name]) setValidationErrors(prev => ({ ...prev, [name]: '' }));
  };

  const openModal = (mode, teacher = null) => {
    setModalMode(mode);
    setSelectedTeacher(teacher);
    if (mode === 'add') { resetForm(); }
    else if (teacher) {
      setFormData({
        teacherId: teacher.teacherId || '', name: teacher.name || '',
        dateOfBirth: teacher.dateOfBirth ? teacher.dateOfBirth.split('T')[0] : '',
        gender: teacher.gender || '', address: teacher.address || '',
        phoneNumber: teacher.phoneNumber || '', city: teacher.city || '',
        postalcode: teacher.postalcode || '', policeName: teacher.policeName || '',
        email: teacher.email || '', password: '',
        qualification: teacher.qualification || '', experience: teacher.experience || '',
        subject: teacher.subject || '',
        joinedDate: teacher.joinedDate ? teacher.joinedDate.split('T')[0] : '',
        employmentType: teacher.employmentType || '', salary: teacher.salary || '',
        nic: teacher.nic || '', bankName: teacher.bankName || '',
        bankNumber: teacher.bankNumber || '', status: teacher.status || 'Active'
      });
    }
    setShowModal(true); setError('');
  };

  const closeModal = () => {
    setShowModal(false); setSelectedTeacher(null);
    resetForm(); setError(''); setValidationErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (modalMode === 'add' && !formData.teacherId.trim()) errors.teacherId = 'Teacher ID is required';
    else if (formData.teacherId && !/^[A-Za-z0-9-_]+$/.test(formData.teacherId)) errors.teacherId = 'Only letters, numbers, hyphens, underscores';
    if (!formData.name.trim()) errors.name = 'Name is required';
    else if (formData.name.trim().length < 2) errors.name = 'Min 2 characters';
    else if (!/^[a-zA-Z\s.]+$/.test(formData.name)) errors.name = 'Only letters, spaces, dots';
    if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';
    else if (!/^[0-9]{10}$/.test(formData.phoneNumber.replace(/[\s-]/g, ''))) errors.phoneNumber = 'Must be 10 digits';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email format';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.postalcode.trim()) errors.postalcode = 'Postal code is required';
    else if (!/^[0-9]{5}$/.test(formData.postalcode)) errors.postalcode = 'Must be 5 digits';
    if (!formData.policeName.trim()) errors.policeName = 'Police name is required';
    if (modalMode === 'add') {
      if (!formData.password) errors.password = 'Password is required';
      else if (formData.password.length < 6) errors.password = 'Min 6 characters';
      else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(formData.password)) errors.password = 'Need uppercase, lowercase & number';
    }
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (formData.experience !== '' && formData.experience !== null) {
      const exp = Number(formData.experience);
      if (isNaN(exp) || exp < 0 || exp > 50) errors.experience = 'Must be 0–50 years';
    }
    if (formData.salary !== '' && formData.salary !== null) {
      const sal = Number(formData.salary);
      if (isNaN(sal) || sal < 0) errors.salary = 'Cannot be negative';
    }
    if (formData.nic && !/^[0-9]{9}[vVxX]|[0-9]{12}$/.test(formData.nic)) errors.nic = 'Invalid NIC format';
    if (formData.bankNumber && !/^[0-9]{10,16}$/.test(formData.bankNumber)) errors.bankNumber = 'Must be 10–16 digits';
    if (formData.dateOfBirth) {
      const age = new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear();
      if (age < 18) errors.dateOfBirth = 'Must be at least 18 years old';
      if (age > 80) errors.dateOfBirth = 'Please enter a valid date';
    }
    if (formData.joinedDate && new Date(formData.joinedDate) > new Date()) errors.joinedDate = 'Cannot be in the future';
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) { setValidationErrors(errors); setError('Please fix the validation errors'); return; }
    setLoading(true); setError(''); setValidationErrors({});
    try {
      const cleanedData = teacherService.cleanTeacherData(formData, modalMode);
      if (modalMode === 'add') await teacherService.createTeacher(cleanedData);
      else await teacherService.updateTeacher(selectedTeacher._id, cleanedData);
      await fetchTeachers(); closeModal();
    } catch (err) { setError(err.message || 'An error occurred'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (teacher) => {
    if (!window.confirm(`Are you sure you want to delete ${teacher.name}?`)) return;
    setLoading(true); setError('');
    try { await teacherService.deleteTeacher(teacher._id); await fetchTeachers(); }
    catch (err) { setError(err.message || 'Failed to delete teacher'); }
    finally { setLoading(false); }
  };

  // Subject → color mapping for visual variety
  const subjectColors = {
    default:  { bg: 'bg-slate-100',   text: 'text-slate-700',   dot: 'bg-slate-400'   },
    math:     { bg: 'bg-blue-100',    text: 'text-blue-700',    dot: 'bg-blue-500'    },
    science:  { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    english:  { bg: 'bg-violet-100',  text: 'text-violet-700',  dot: 'bg-violet-500'  },
    history:  { bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
    art:      { bg: 'bg-pink-100',    text: 'text-pink-700',    dot: 'bg-pink-500'    },
    music:    { bg: 'bg-rose-100',    text: 'text-rose-700',    dot: 'bg-rose-500'    },
    pe:       { bg: 'bg-orange-100',  text: 'text-orange-700',  dot: 'bg-orange-500'  },
  };

  const getSubjectColor = (subject = '') => {
    const s = subject.toLowerCase();
    if (s.includes('math')) return subjectColors.math;
    if (s.includes('science') || s.includes('bio') || s.includes('chem') || s.includes('physics')) return subjectColors.science;
    if (s.includes('english') || s.includes('literature')) return subjectColors.english;
    if (s.includes('history') || s.includes('social')) return subjectColors.history;
    if (s.includes('art') || s.includes('draw')) return subjectColors.art;
    if (s.includes('music')) return subjectColors.music;
    if (s.includes('pe') || s.includes('sport') || s.includes('physical')) return subjectColors.pe;
    return subjectColors.default;
  };

  // Avatar initials
  const getInitials = (name = '') => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const avatarGradients = [
    'from-blue-500 to-indigo-600', 'from-emerald-500 to-teal-600',
    'from-violet-500 to-purple-600', 'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600', 'from-cyan-500 to-sky-600',
  ];
  const getGradient = (name = '') => {
    const idx = name.charCodeAt(0) % avatarGradients.length;
    return avatarGradients[idx] || avatarGradients[0];
  };

  /* ─── Shared input classes ─── */
  const baseInput = (hasErr) =>
    `w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition ${
      hasErr ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
    }`;
  const baseLabel = 'block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1';

  const sectionHeader = (title, color = 'indigo') => (
    <div className={`col-span-2 flex items-center gap-2 mt-4 mb-1`}>
      <div className={`h-1 w-6 rounded-full bg-${color}-500`} />
      <span className={`text-xs font-bold uppercase tracking-widest text-${color}-600`}>{title}</span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px);} to { opacity:1; transform:none;} }
        .fade-up { animation: fadeUp 0.35s ease both; }
        .row-hover { transition: background 0.15s, box-shadow 0.15s; }
        .row-hover:hover { background: linear-gradient(90deg,#eef2ff 0%,#f0fdf4 100%); box-shadow: inset 3px 0 0 #6366f1; }
      `}</style>

      <div className="max-w-7xl mx-auto">

        {/* ── Header card ── */}
        <div className="fade-up bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                <GraduationCap className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Teacher Management</h1>
                <p className="text-sm text-gray-400 mt-0.5">
                  {teachers.length} teacher{teachers.length !== 1 ? 's' : ''} · {' '}
                  <span className="text-emerald-600 font-medium">{teachers.filter(t => t.status === 'Active').length} active</span>
                  {' · '}
                  <span className="text-red-400 font-medium">{teachers.filter(t => t.status !== 'Active').length} inactive</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => openModal('add')}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold shadow-md shadow-indigo-200 transition-all hover:shadow-lg hover:scale-[1.02] active:scale-95"
            >
              <Plus size={18} />
              Add Teacher
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input
              type="text"
              placeholder="Search by name, ID, or subject…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-300 focus:border-transparent text-sm outline-none transition"
            />
          </div>
        </div>

        {error && (
          <div className="fade-up bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
            {error}
          </div>
        )}

        {/* ── Table card ── */}
        <div className="fade-up bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white">
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-widest">Teacher</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-widest">ID</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-widest">Subject</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-widest">Phone</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-widest">Status</th>
                  <th className="px-5 py-3.5 text-center text-xs font-bold uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading && teachers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400 text-sm">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400 mx-auto mb-3" />
                      Loading teachers…
                    </td>
                  </tr>
                ) : filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400 text-sm">
                      <BookOpen className="mx-auto mb-2 text-gray-200" size={40} />
                      No teachers found
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map((teacher) => {
                    const sc = getSubjectColor(teacher.subject);
                    const grad = getGradient(teacher.name);
                    return (
                      <tr key={teacher._id} className="row-hover">
                        {/* Name + avatar */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm`}>
                              {getInitials(teacher.name)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-sm leading-tight">{teacher.name}</p>
                              <p className="text-xs text-gray-400">{teacher.email || '—'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{teacher.teacherId}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${sc.bg} ${sc.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                            {teacher.subject}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-600">{teacher.phoneNumber}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            teacher.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-red-50 text-red-600 border border-red-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${teacher.status === 'Active' ? 'bg-emerald-500' : 'bg-red-400'}`} />
                            {teacher.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => openModal('view', teacher)}
                              className="p-2 text-sky-500 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition"
                              title="View"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => openModal('edit', teacher)}
                              className="p-2 text-amber-500 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(teacher)}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ══════════════════ MODAL ══════════════════ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100 fade-up">

            {/* Modal header */}
            <div className={`sticky top-0 z-10 flex justify-between items-center px-6 py-4 rounded-t-2xl border-b border-gray-100 ${
              modalMode === 'add'  ? 'bg-gradient-to-r from-indigo-600 to-violet-600' :
              modalMode === 'edit' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                                     'bg-gradient-to-r from-sky-500 to-cyan-500'
            }`}>
              <div className="flex items-center gap-3 text-white">
                {modalMode === 'add'  && <Plus size={22} />}
                {modalMode === 'edit' && <Edit2 size={22} />}
                {modalMode === 'view' && <Eye size={22} />}
                <h2 className="text-lg font-bold">
                  {modalMode === 'add' && 'Add New Teacher'}
                  {modalMode === 'edit' && `Edit — ${selectedTeacher?.name}`}
                  {modalMode === 'view' && selectedTeacher?.name}
                </h2>
              </div>
              <button onClick={closeModal} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1.5 transition">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* ── Personal Info ── */}
                {sectionHeader('Personal Information', 'indigo')}

                <div>
                  <label className={baseLabel}>Teacher ID {modalMode === 'add' && <span className="text-red-400">*</span>}</label>
                  <input type="text" name="teacherId" value={formData.teacherId} onChange={handleInputChange}
                    disabled={modalMode !== 'add'} readOnly={modalMode === 'view'}
                    className={baseInput(validationErrors.teacherId) + (modalMode !== 'add' ? ' opacity-60' : '')} />
                  {validationErrors.teacherId && <p className="text-red-500 text-xs mt-1">{validationErrors.teacherId}</p>}
                </div>

                <div>
                  <label className={baseLabel}>Full Name <span className="text-red-400">*</span></label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} readOnly={modalMode === 'view'}
                    className={baseInput(validationErrors.name)} />
                  {validationErrors.name && <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>}
                </div>

                <div>
                  <label className={baseLabel}>Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} readOnly={modalMode === 'view'}
                    className={baseInput(validationErrors.dateOfBirth)} />
                  {validationErrors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{validationErrors.dateOfBirth}</p>}
                </div>

                <div>
                  <label className={baseLabel}>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleInputChange} disabled={modalMode === 'view'}
                    className={baseInput(false)}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className={baseLabel}>NIC</label>
                  <input type="text" name="nic" value={formData.nic} onChange={handleInputChange} readOnly={modalMode === 'view'}
                    className={baseInput(validationErrors.nic)} />
                  {validationErrors.nic && <p className="text-red-500 text-xs mt-1">{validationErrors.nic}</p>}
                </div>

                {modalMode === 'add' && (
                  <div>
                    <label className={baseLabel}>Password <span className="text-red-400">*</span></label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} minLength="6"
                      className={baseInput(validationErrors.password)} />
                    {validationErrors.password && <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>}
                  </div>
                )}

                {/* ── Contact Info ── */}
                {sectionHeader('Contact & Address', 'violet')}

                <div>
                  <label className={baseLabel}>Phone Number <span className="text-red-400">*</span></label>
                  <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} readOnly={modalMode === 'view'}
                    className={baseInput(validationErrors.phoneNumber)} />
                  {validationErrors.phoneNumber && <p className="text-red-500 text-xs mt-1">{validationErrors.phoneNumber}</p>}
                </div>

                <div>
                  <label className={baseLabel}>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} readOnly={modalMode === 'view'}
                    className={baseInput(validationErrors.email)} />
                  {validationErrors.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className={baseLabel}>Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} readOnly={modalMode === 'view'}
                    className={baseInput(false)} />
                </div>

                <div>
                  <label className={baseLabel}>City <span className="text-red-400">*</span></label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} readOnly={modalMode === 'view'}
                    className={baseInput(validationErrors.city)} />
                  {validationErrors.city && <p className="text-red-500 text-xs mt-1">{validationErrors.city}</p>}
                </div>

                <div>
                  <label className={baseLabel}>Postal Code <span className="text-red-400">*</span></label>
                  <input type="text" name="postalcode" value={formData.postalcode} onChange={handleInputChange} readOnly={modalMode === 'view'}
                    className={baseInput(validationErrors.postalcode)} />
                  {validationErrors.postalcode && <p className="text-red-500 text-xs mt-1">{validationErrors.postalcode}</p>}
                </div>

                <div>
                  <label className={baseLabel}>Police Station Name <span className="text-red-400">*</span></label>
                  <input type="text" name="policeName" value={formData.policeName} onChange={handleInputChange} readOnly={modalMode === 'view'}
                    className={baseInput(validationErrors.policeName)} />
                  {validationErrors.policeName && <p className="text-red-500 text-xs mt-1">{validationErrors.policeName}</p>}
                </div>

                {/* ── Professional Info ── */}
                {sectionHeader('Professional Details', 'emerald')}

                <div>
                  <label className={baseLabel}>Subject <span className="text-red-400">*</span></label>
                  <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} readOnly={modalMode === 'view'}
                    className={baseInput(validationErrors.subject)} />
                  {validationErrors.subject && <p className="text-red-500 text-xs mt-1">{validationErrors.subject}</p>}
                </div>

                <div>
                  <label className={baseLabel}>Qualification</label>
                  <input type="text" name="qualification" value={formData.qualification} onChange={handleInputChange} readOnly={modalMode === 'view'}
                    className={baseInput(false)} />
                </div>

                <div>
                  <label className={baseLabel}>Experience (years)</label>
                  <input type="number" name="experience" value={formData.experience} onChange={handleInputChange} readOnly={modalMode === 'view'}
                    className={baseInput(validationErrors.experience)} />
                  {validationErrors.experience && <p className="text-red-500 text-xs mt-1">{validationErrors.experience}</p>}
                </div>

                <div>
                  <label className={baseLabel}>Joined Date</label>
                  <input type="date" name="joinedDate" value={formData.joinedDate} onChange={handleInputChange} readOnly={modalMode === 'view'}
                    className={baseInput(validationErrors.joinedDate)} />
                  {validationErrors.joinedDate && <p className="text-red-500 text-xs mt-1">{validationErrors.joinedDate}</p>}
                </div>

                <div>
                  <label className={baseLabel}>Employment Type</label>
                  <select name="employmentType" value={formData.employmentType} onChange={handleInputChange} disabled={modalMode === 'view'}
                    className={baseInput(false)}>
                    <option value="">Select Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Visiting">Visiting</option>
                  </select>
                </div>

                <div>
                  <label className={baseLabel}>Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} disabled={modalMode === 'view'}
                    className={baseInput(false)}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* ── Financial Info ── */}
                {sectionHeader('Financial Information', 'amber')}

                <div>
                  <label className={baseLabel}>Salary</label>
                  <input type="number" name="salary" value={formData.salary} onChange={handleInputChange} readOnly={modalMode === 'view'}
                    className={baseInput(validationErrors.salary)} />
                  {validationErrors.salary && <p className="text-red-500 text-xs mt-1">{validationErrors.salary}</p>}
                </div>

                <div>
                  <label className={baseLabel}>Bank Name</label>
                  <input type="text" name="bankName" value={formData.bankName} onChange={handleInputChange} readOnly={modalMode === 'view'}
                    className={baseInput(false)} />
                </div>

                <div>
                  <label className={baseLabel}>Bank Account Number</label>
                  <input type="text" name="bankNumber" value={formData.bankNumber} onChange={handleInputChange} readOnly={modalMode === 'view'}
                    className={baseInput(validationErrors.bankNumber)} />
                  {validationErrors.bankNumber && <p className="text-red-500 text-xs mt-1">{validationErrors.bankNumber}</p>}
                </div>
              </div>

              {/* ── Action buttons ── */}
              {modalMode !== 'view' && (
                <div className="flex gap-3 mt-8">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`flex-1 text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all shadow-md disabled:opacity-50 ${
                      modalMode === 'add'
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-indigo-200'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-200'
                    }`}
                  >
                    <Check size={18} />
                    {loading ? 'Saving…' : modalMode === 'add' ? 'Add Teacher' : 'Update Teacher'}
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-semibold transition"
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