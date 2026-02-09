// routes/competitionRoutes.js
const express = require('express');
const router = express.Router();
const competitionController = require('../controllers/competitionController');

// Competition CRUD routes
router.get('/competitions', competitionController.getAllCompetitions);
router.get('/competitions/years', competitionController.getCompetitionYears);
router.get('/competitions/year/:year', competitionController.getCompetitionsByYear);
router.get('/competitions/:id', competitionController.getCompetitionById);
router.post('/competitions', competitionController.createCompetition);
router.put('/competitions/:id', competitionController.updateCompetition);
router.delete('/competitions/:id', competitionController.deleteCompetition);

// Participant management routes
router.post('/competitions/:competitionId/participants', competitionController.addParticipant);
router.delete('/competitions/:competitionId/participants/:studentId', competitionController.removeParticipant);

module.exports = router;

// Add this to your main app.js or server.js:
// const competitionRoutes = require('./routes/competitionRoutes');
// app.use('/api', competitionRoutes);