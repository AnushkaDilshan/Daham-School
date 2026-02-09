const Student = require('../models/Student');
const getNextDsId = require('../utils/generateDsId');
//insert 
// exports.createStudent = async (req, res) => {
//   try {
//     const student = new Student(req.body);
//     await student.save(); // save to database
//     res.status(201).json(student); // return created student
//   } catch (error) {
//     res.status(400).json({ error: error.message || 'Invalid student data' });
//   }
// };

const Prefect = require('../models/Prefect');       // <-- Add this
const Competition = require('../models/Competition');
exports.createStudent = async (req, res) => {
  try {
    // Generate custom ID for _id
    const customId = await getNextDsId();

    // Create student with custom _id
    const student = new Student({
      _id: customId,
      ...req.body
    });

    await student.save(); // save to database
    res.status(201).json(student); // return created student
  } catch (error) {
    res.status(400).json({ error: error.message || 'Invalid student data' });
  }
};

//get all the task
exports.getAllStudent = async (req, res) => {
  try {
    const student = await Student.find();
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
//specific task get
exports.getSelectedStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'student not found' });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

//update the task
exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
//delete the task
exports.deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;

    // 1. Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // 2. Delete related Prefect record
    await Prefect.deleteOne({ studentId });

    // 3. Remove student from all competition participant lists
    await Competition.updateMany(
      { 'participants.studentId': studentId },
      { $pull: { participants: { studentId } } }
    );

    // 4. Delete student record
    await Student.findByIdAndDelete(studentId);

    res.status(200).json({ message: 'Student and related records deleted successfully' });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.getStudentsByGrade = async (req, res) => {
  try {
    const { grade } = req.params;
    const students = await Student.find({ grade }).sort({ name: 1 });
    
    if (students.length === 0) {
      return res.status(404).json({ error: 'No students found in this grade' });
    }
    
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
