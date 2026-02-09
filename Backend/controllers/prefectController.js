const Prefect = require('../models/Prefect');
const Student = require('../models/Student');  // Make sure this path matches your Student model

// Get all prefects with student details
exports.getAllPrefects = async (req, res) => {
  try {
    const prefects = await Prefect.find()
      .populate('studentId')  // This will populate all student fields
      .sort({ appointedDate: -1 });

    // Format response to match frontend expectation
    const formattedPrefects = prefects.map(prefect => ({
      _id: prefect._id,
      student: {
        _id: prefect.studentId._id,
        name: prefect.studentId.name,
        grade: prefect.studentId.grade,
        phonenumber: prefect.studentId.phonenumber,
        guardiansName: prefect.studentId.guardiansName,
        address: prefect.studentId.address
      },
      position: prefect.position,
      startDate: prefect.startDate,
      endDate: prefect.endDate,
      responsibilities: prefect.responsibilities,
      status: prefect.status,
      createdAt: prefect.createdAt,
      updatedAt: prefect.updatedAt
    }));

    res.status(200).json(formattedPrefects);
  } catch (error) {
    console.error('Error fetching prefects:', error);
    res.status(500).json({ 
      message: 'Error fetching prefects', 
      error: error.message 
    });
  }
};

// Get single prefect by ID
exports.getPrefectById = async (req, res) => {
  try {
    const prefect = await Prefect.findById(req.params.id)
      .populate('studentId');  // Populate all student fields

    if (!prefect) {
      return res.status(404).json({ message: 'Prefect not found' });
    }

    const formattedPrefect = {
      _id: prefect._id,
      student: prefect.studentId,
      position: prefect.position,
      startDate: prefect.startDate,
      endDate: prefect.endDate,
      responsibilities: prefect.responsibilities,
      status: prefect.status,
      createdAt: prefect.createdAt,
      updatedAt: prefect.updatedAt
    };

    res.status(200).json(formattedPrefect);
  } catch (error) {
    console.error('Error fetching prefect:', error);
    res.status(500).json({ 
      message: 'Error fetching prefect', 
      error: error.message 
    });
  }
};

// Create new prefect
exports.createPrefect = async (req, res) => {
  try {
    const { studentId, position, startDate, endDate, responsibilities } = req.body;

    // Check if student exists (studentId is a String in your model)
    const student = await Student.findOne({ _id: studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if student is already a prefect
    const existingPrefect = await Prefect.findOne({ studentId });
    if (existingPrefect) {
      return res.status(400).json({ 
        message: 'This student is already a prefect',
        existingPosition: existingPrefect.position
      });
    }

    // Create new prefect
    const newPrefect = new Prefect({
      studentId,
      position,
      startDate,
      endDate: endDate || null,  // Set to null if not provided
      responsibilities,
      status: 'Active'
    });

    const savedPrefect = await newPrefect.save();

    // Populate student data before sending response
    await savedPrefect.populate('studentId');

    res.status(201).json({
      message: 'Prefect created successfully',
      prefect: savedPrefect
    });
  } catch (error) {
    console.error('Error creating prefect:', error);
    res.status(500).json({ 
      message: 'Error creating prefect', 
      error: error.message 
    });
  }
};

// Update prefect
exports.updatePrefect = async (req, res) => {
  try {
    const { position, startDate, endDate, responsibilities, status } = req.body;

    const updatedPrefect = await Prefect.findByIdAndUpdate(
      req.params.id,
      { position, startDate, endDate, responsibilities, status },
      { new: true, runValidators: true }
    ).populate('studentId');

    if (!updatedPrefect) {
      return res.status(404).json({ message: 'Prefect not found' });
    }

    res.status(200).json({
      message: 'Prefect updated successfully',
      prefect: updatedPrefect
    });
  } catch (error) {
    console.error('Error updating prefect:', error);
    res.status(500).json({ 
      message: 'Error updating prefect', 
      error: error.message 
    });
  }
};

// Delete prefect
exports.deletePrefect = async (req, res) => {
  try {
    const deletedPrefect = await Prefect.findByIdAndDelete(req.params.id);

    if (!deletedPrefect) {
      return res.status(404).json({ message: 'Prefect not found' });
    }

    res.status(200).json({
      message: 'Prefect deleted successfully',
      prefect: deletedPrefect
    });
  } catch (error) {
    console.error('Error deleting prefect:', error);
    res.status(500).json({ 
      message: 'Error deleting prefect', 
      error: error.message 
    });
  }
};

// Get prefects by position
exports.getPrefectsByPosition = async (req, res) => {
  try {
    const { position } = req.params;
    
    const prefects = await Prefect.find({ position, status: 'Active' })
      .populate('studentId')
      .sort({ appointedDate: -1 });

    res.status(200).json(prefects);
  } catch (error) {
    console.error('Error fetching prefects by position:', error);
    res.status(500).json({ 
      message: 'Error fetching prefects', 
      error: error.message 
    });
  }
};

// Get active prefects only
exports.getActivePrefects = async (req, res) => {
  try {
    const prefects = await Prefect.find({ status: 'Active' })
      .populate('studentId')
      .sort({ appointedDate: -1 });

    const formattedPrefects = prefects.map(prefect => ({
      _id: prefect._id,
      student: prefect.studentId,
      position: prefect.position,
      startDate: prefect.startDate,
      endDate: prefect.endDate,
      responsibilities: prefect.responsibilities,
      status: prefect.status
    }));

    res.status(200).json(formattedPrefects);
  } catch (error) {
    console.error('Error fetching active prefects:', error);
    res.status(500).json({ 
      message: 'Error fetching active prefects', 
      error: error.message 
    });
  }
};
