const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware: admin only
const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all users
router.get('/', adminAuth, async (req, res) => {
  const users = await User.find({}, '-password');
  res.json(users);
});

// Toggle active/inactive
router.patch('/:id/status', adminAuth, async (req, res) => {
  const { status } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, select: '-password' }
  );
  res.json(user);
});

// Update role
router.patch('/:id/role', adminAuth, async (req, res) => {
  const { role } = req.body;
  const validRoles = ['admin', 'teacher', 'student'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, select: '-password' }
  );
  res.json(user);
});

module.exports = router;