import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authServices';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '../context/UserContext';

const Login = () => {
  const { setUser } = useUser();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.login(form);

      const token = res.data.token;
      localStorage.setItem('token', token);
      const user = jwtDecode(token);
      setUser(user.id);
      console.log(user.id);

      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/studentView');
      } else {
        navigate('/user-dashboard');
      }

    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Login
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate('/signup')}
          className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium"
        >
          Signup
        </button>

        <button
          type="button"
          onClick={() => navigate('/mongo')}
          className="w-full mt-3 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
        >
          Mongo
        </button>

        {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
