import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const ROLES = ['admin', 'teacher', 'student'];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [editingRole, setEditingRole] = useState(null); // userId being edited

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { setUsers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const res = await fetch(`${API_URL}/users/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      setUsers(prev => prev.map(u => u._id === id ? { ...u, status: newStatus } : u));
      showMessage(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
    }
  };

  const updateRole = async (id, newRole) => {
    const res = await fetch(`${API_URL}/users/${id}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role: newRole })
    });
    if (res.ok) {
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role: newRole } : u));
      setEditingRole(null);
      showMessage(`Role updated to "${newRole}" successfully`);
    } else {
      showMessage('Failed to update role', 'error');
    }
  };

  const initials = name => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  );

  const active = users.filter(u => u.status === 'active').length;

  const roleColors = {
    admin:   'bg-purple-100 text-purple-700',
    teacher: 'bg-blue-100 text-blue-700',
    student: 'bg-amber-100 text-amber-700',
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">User Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage registered accounts, roles, and login access</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Users', val: users.length, color: 'text-gray-800' },
          { label: 'Active', val: active, color: 'text-green-600' },
          { label: 'Inactive', val: users.length - active, color: 'text-red-500' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-semibold ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${
          message.type === 'error'
            ? 'bg-red-100 text-red-700'
            : 'bg-green-100 text-green-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Search */}
      <input
        className="w-full mb-4 px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
        placeholder="Search by name, email or role..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <p className="p-6 text-center text-gray-400 text-sm">Loading users...</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['User', 'Role', 'Phone', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">

                  {/* User info */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-medium flex-shrink-0">
                        {initials(u.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Role — inline dropdown or badge */}
                  <td className="px-4 py-3">
                    {editingRole === u._id ? (
                      <div className="flex items-center gap-2">
                        <select
                          defaultValue={u.role}
                          onChange={e => updateRole(u._id, e.target.value)}
                          onBlur={() => setEditingRole(null)}
                          autoFocus
                          className="text-xs border border-blue-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                          {ROLES.map(r => (
                            <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => setEditingRole(null)}
                          className="text-xs text-gray-400 hover:text-gray-600"
                        >✕</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${roleColors[u.role] || 'bg-gray-100 text-gray-600'}`}>
                          {u.role}
                        </span>
                        <button
                          onClick={() => setEditingRole(u._id)}
                          title="Change role"
                          className="text-gray-300 hover:text-blue-500 transition-colors text-xs"
                        >
                          ✏️
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-3 text-sm text-gray-600">{u.phone}</td>

                  {/* Status badge */}
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      u.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-500'
                    }`}>
                      {u.status}
                    </span>
                  </td>

                  {/* Activate / Deactivate */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStatus(u._id, u.status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        u.status === 'active'
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {u.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserManagement;