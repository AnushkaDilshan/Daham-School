const Teacher = require('../models/Teacher');

// Get all teachers (exclude password from response)
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ 
      message: 'Error fetching teachers', 
      error: error.message 
    });
  }
};

// Get single teacher by ID
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).select('-password');

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.status(200).json(teacher);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ 
      message: 'Error fetching teacher', 
      error: error.message 
    });
  }
};

// Get teacher by teacherId (for login or lookup)
exports.getTeacherByTeacherId = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ teacherId: req.params.teacherId })
      .select('-password');

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.status(200).json(teacher);
  } catch (error) {
    console.error('Error fetching teacher:', error);
    res.status(500).json({ 
      message: 'Error fetching teacher', 
      error: error.message 
    });
  }
};

// Create new teacher
exports.createTeacher = async (req, res) => {
  try {
    // Log the incoming request body for debugging
    console.log('Received request body:', req.body);

    const { 
      teacherId, name, dateOfBirth, gender, address, phoneNumber, 
      city, postalcode, policeName,  // ADDED
      email, password, qualification, experience, subject, 
      joinedDate, employmentType, salary,
      nic, bankName, bankNumber  // ADDED
    } = req.body;

    // Check if teacherId already exists
    const existingTeacher = await Teacher.findOne({ teacherId });
    if (existingTeacher) {
      return res.status(400).json({ 
        message: 'Teacher ID already exists' 
      });
    }

    // Check if email already exists (if email provided)
    if (email) {
      const existingEmail = await Teacher.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ 
          message: 'Email already registered' 
        });
      }
    }

    // Create new teacher with all fields
    const newTeacher = new Teacher({
      teacherId,
      name,
      dateOfBirth,
      gender,
      address,
      phoneNumber,
      city,          // ADDED
      postalcode,    // ADDED
      policeName,    // ADDED
      email,
      password,
      qualification,
      experience,
      subject,
      joinedDate,
      employmentType,
      salary,
      nic,           // ADDED
      bankName,      // ADDED
      bankNumber,    // ADDED
      status: 'Active'
    });

    console.log('Teacher object before save:', newTeacher);

    const savedTeacher = await newTeacher.save();

    // Remove password from response
    const teacherResponse = savedTeacher.toObject();
    delete teacherResponse.password;

    res.status(201).json({
      message: 'Teacher created successfully',
      teacher: teacherResponse
    });
  } catch (error) {
    console.error('Error creating teacher:', error);
    console.error('Error details:', error.errors); // Log validation errors
    res.status(500).json({ 
      message: 'Error creating teacher', 
      error: error.message 
    });
  }
};

// Update teacher
exports.updateTeacher = async (req, res) => {
  try {
    const { 
      name, dateOfBirth, gender, address, phoneNumber, 
      city, postalcode, policeName,  // ADDED
      email, qualification, experience, subject, 
      joinedDate, employmentType, salary, 
      nic, bankName, bankNumber,  // ADDED
      status 
    } = req.body;

    // Don't allow updating teacherId or password through this endpoint
    const updateData = {
      name, 
      dateOfBirth, 
      gender, 
      address, 
      phoneNumber, 
      city,          // ADDED
      postalcode,    // ADDED
      policeName,    // ADDED
      email, 
      qualification, 
      experience, 
      subject, 
      joinedDate, 
      employmentType, 
      salary, 
      nic,           // ADDED
      bankName,      // ADDED
      bankNumber,    // ADDED
      status
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.status(200).json({
      message: 'Teacher updated successfully',
      teacher: updatedTeacher
    });
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({ 
      message: 'Error updating teacher', 
      error: error.message 
    });
  }
};

// Update teacher password
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ 
        message: 'Please provide both old and new password' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'New password must be at least 6 characters long' 
      });
    }

    // Find teacher with password field
    const teacher = await Teacher.findById(req.params.id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Verify old password
    const isMatch = await teacher.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect old password' });
    }

    // Update password (will be hashed by pre-save hook)
    teacher.password = newPassword;
    await teacher.save();

    res.status(200).json({
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ 
      message: 'Error updating password', 
      error: error.message 
    });
  }
};

// Delete teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!deletedTeacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.status(200).json({
      message: 'Teacher deleted successfully',
      teacher: { _id: deletedTeacher._id, name: deletedTeacher.name }
    });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({ 
      message: 'Error deleting teacher', 
      error: error.message 
    });
  }
};

// Teacher login
exports.loginTeacher = async (req, res) => {
  try {
    const { teacherId, password } = req.body;

    if (!teacherId || !password) {
      return res.status(400).json({ 
        message: 'Please provide teacher ID and password' 
      });
    }

    // Find teacher by teacherId (include password for verification)
    const teacher = await Teacher.findOne({ teacherId });

    if (!teacher) {
      return res.status(401).json({ 
        message: 'Invalid teacher ID or password' 
      });
    }

    // Check if teacher is active
    if (teacher.status !== 'Active') {
      return res.status(403).json({ 
        message: 'Your account is inactive. Please contact administrator.' 
      });
    }

    // Verify password
    const isMatch = await teacher.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Invalid teacher ID or password' 
      });
    }

    // Remove password from response
    const teacherResponse = teacher.toObject();
    delete teacherResponse.password;

    res.status(200).json({
      message: 'Login successful',
      teacher: teacherResponse
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ 
      message: 'Error during login', 
      error: error.message 
    });
  }
};

// Get teachers by subject
exports.getTeachersBySubject = async (req, res) => {
  try {
    const { subject } = req.params;
    
    const teachers = await Teacher.find({ subject, status: 'Active' })
      .select('-password')
      .sort({ name: 1 });

    res.status(200).json(teachers);
  } catch (error) {
    console.error('Error fetching teachers by subject:', error);
    res.status(500).json({ 
      message: 'Error fetching teachers', 
      error: error.message 
    });
  }
};