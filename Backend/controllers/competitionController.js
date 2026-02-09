// controllers/competitionController.js
const Competition = require('../models/Competition');

// Get all competitions
exports.getAllCompetitions = async (req, res) => {
  try {
    const competitions = await Competition.find().sort({ year: -1, date: -1 });
    res.json(competitions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching competitions', error: error.message });
  }
};

// Get competitions by year
exports.getCompetitionsByYear = async (req, res) => {
  try {
    const { year } = req.params;
    const competitions = await Competition.find({ year: parseInt(year) }).sort({ date: -1 });
    res.json(competitions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching competitions', error: error.message });
  }
};

// Get single competition
exports.getCompetitionById = async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id);
    if (!competition) {
      return res.status(404).json({ message: 'Competition not found' });
    }
    res.json(competition);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching competition', error: error.message });
  }
};

// Create new competition
exports.createCompetition = async (req, res) => {
  try {
    const { category, venue, date } = req.body;
    
    const competition = new Competition({
      category,
      venue,
      date,
      year: new Date(date).getFullYear(),
      participants: []
    });

    const savedCompetition = await competition.save();
    res.status(201).json(savedCompetition);
  } catch (error) {
    res.status(400).json({ message: 'Error creating competition', error: error.message });
  }
};

// Update competition
exports.updateCompetition = async (req, res) => {
  try {
    const { category, venue, date } = req.body;
    
    const updateData = { category, venue, date };
    if (date) {
      updateData.year = new Date(date).getFullYear();
    }
    
    const competition = await Competition.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!competition) {
      return res.status(404).json({ message: 'Competition not found' });
    }
    
    res.json(competition);
  } catch (error) {
    res.status(400).json({ message: 'Error updating competition', error: error.message });
  }
};

// Delete competition
exports.deleteCompetition = async (req, res) => {
  try {
    const competition = await Competition.findByIdAndDelete(req.params.id);
    
    if (!competition) {
      return res.status(404).json({ message: 'Competition not found' });
    }
    
    res.json({ message: 'Competition deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting competition', error: error.message });
  }
};

// Add student to competition
exports.addParticipant = async (req, res) => {
  try {
    const { competitionId } = req.params;
    const { studentId, studentName, grade } = req.body;

    const competition = await Competition.findById(competitionId);
    
    if (!competition) {
      return res.status(404).json({ message: 'Competition not found' });
    }

    // Check if student already registered
    const existingParticipant = competition.participants.find(
      p => p.studentId === studentId
    );
    
    if (existingParticipant) {
      return res.status(400).json({ message: 'Student already registered for this competition' });
    }

    competition.participants.push({
      studentId,
      studentName,
      grade,
      addedDate: new Date()
    });

    await competition.save();
    res.json(competition);
  } catch (error) {
    res.status(400).json({ message: 'Error adding participant', error: error.message });
  }
};

// Remove student from competition
exports.removeParticipant = async (req, res) => {
  try {
    const { competitionId, studentId } = req.params;

    const competition = await Competition.findById(competitionId);
    
    if (!competition) {
      return res.status(404).json({ message: 'Competition not found' });
    }

    competition.participants = competition.participants.filter(
      p => p.studentId !== studentId
    );

    await competition.save();
    res.json(competition);
  } catch (error) {
    res.status(500).json({ message: 'Error removing participant', error: error.message });
  }
};

// Get all years that have competitions
exports.getCompetitionYears = async (req, res) => {
  try {
    const years = await Competition.distinct('year');
    res.json(years.sort((a, b) => b - a));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching years', error: error.message });
  }
};