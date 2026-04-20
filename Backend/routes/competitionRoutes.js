// routes/competitionRoutes.js
const express = require('express');
const router = express.Router();
const competitionController = require('../controllers/competitionController');
const authMiddleware = require('../middleware/authMiddleware');

// Competition CRUD routes
router.get('/competitions', authMiddleware,competitionController.getAllCompetitions);
router.get('/competitions/years',authMiddleware, competitionController.getCompetitionYears);
router.get('/competitions/year/:year', authMiddleware,competitionController.getCompetitionsByYear);
router.get('/competitions/:id',authMiddleware, competitionController.getCompetitionById);
router.post('/competitions', authMiddleware,competitionController.createCompetition);
router.put('/competitions/:id', authMiddleware,competitionController.updateCompetition);
router.delete('/competitions/:id', authMiddleware,competitionController.deleteCompetition);

// Participant management routes
router.post('/competitions/:competitionId/participants', authMiddleware,competitionController.addParticipant);
router.delete('/competitions/:competitionId/participants/:studentId', authMiddleware,competitionController.removeParticipant);

module.exports = router;

// Add this to your main app.js or server.js:
// const competitionRoutes = require('./routes/competitionRoutes');
// app.use('/api', competitionRoutes);