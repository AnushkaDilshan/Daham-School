const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

// Authentication
router.post('/login', teacherController.loginTeacher);

// Get all teachers
router.get('/', teacherController.getAllTeachers);

// Get teachers by subject
router.get('/subject/:subject', teacherController.getTeachersBySubject);

// Get teacher by teacherId (string ID like T001)
router.get('/teacher-id/:teacherId', teacherController.getTeacherByTeacherId);

// Get single teacher by MongoDB _id
router.get('/:id', teacherController.getTeacherById);

// Create new teacher
router.post('/', teacherController.createTeacher);

// Update teacher
router.put('/:id', teacherController.updateTeacher);

// Update teacher password
router.put('/:id/password', teacherController.updatePassword);

// Delete teacher
router.delete('/:id', teacherController.deleteTeacher);

module.exports = router;
