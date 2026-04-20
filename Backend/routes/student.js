const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware,studentController.createStudent);
router.get('/', authMiddleware,studentController.getAllStudent);
router.get('/:id', authMiddleware,studentController.getSelectedStudent);
router.put('/:id', authMiddleware,studentController.updateStudent);
router.delete('/:id', authMiddleware,studentController.deleteStudent);
router.get('/grade/:grade', authMiddleware,studentController.getStudentsByGrade);

module.exports = router;
