// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Rehydrate from token on refresh
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const { jwtDecode } = require('jwt-decode');
        return jwtDecode(token); // ← decode full object on load
      }
    } catch (e) {}
    return null;
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);