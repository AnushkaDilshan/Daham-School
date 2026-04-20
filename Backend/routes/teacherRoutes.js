const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const authMiddleware = require('../middleware/authMiddleware');
// Authentication
router.post('/login', teacherController.loginTeacher);

// Get all teachers
router.get('/', authMiddleware,teacherController.getAllTeachers);

// Get teachers by subject
router.get('/subject/:subject', authMiddleware,teacherController.getTeachersBySubject);

// Get teacher by teacherId (string ID like T001)
router.get('/teacher-id/:teacherId',authMiddleware,teacherController.getTeacherByTeacherId);

// Get single teacher by MongoDB _id
router.get('/:id', authMiddleware, teacherController.getTeacherById);

// Create new teacher
router.post('/', authMiddleware, teacherController.createTeacher);

// Update teacher
router.put('/:id', authMiddleware,teacherController.updateTeacher);

// Update teacher password
router.put('/:id/password', authMiddleware,teacherController.updatePassword);

// Delete teacher
router.delete('/:id', authMiddleware,teacherController.deleteTeacher);

module.exports = router;
