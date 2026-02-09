const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.post('/', studentController.createStudent);
router.get('/', studentController.getAllStudent);
router.get('/:id', studentController.getSelectedStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);
router.get('/grade/:grade', studentController.getStudentsByGrade);

module.exports = router;
