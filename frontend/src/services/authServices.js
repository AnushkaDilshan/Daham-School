import axios from 'axios';
import { use } from 'react';


const API_URL = `${process.env.REACT_APP_API_URL}` || 'http://localhost:5000/api';
console.log('API_URL:', API_URL);
const signup = (userData) => {
  return axios.post(`${API_URL}/auth/signup`, userData);
};

const login = (userData) => {
  return axios.post(`${API_URL}/auth/login`, userData);
 
};

const authService = { signup, login };
export default authService;
