const express = require('express');
const router = express.Router();
const prefectController = require('../controllers/prefectController');
const authMiddleware = require('../middleware/authMiddleware');
// Get all prefects
router.get('/', authMiddleware, prefectController.getAllPrefects);

// Get active prefects only
router.get('/active', prefectController.getActivePrefects);

// Get prefects by position
router.get('/position/:position', authMiddleware,prefectController.getPrefectsByPosition);

// Get single prefect by ID
router.get('/:id',authMiddleware, prefectController.getPrefectById);

// Create new prefect
router.post('/',authMiddleware, prefectController.createPrefect);

// Update prefect
router.put('/:id',authMiddleware, prefectController.updatePrefect);

// Delete prefect
router.delete('/:id',authMiddleware, prefectController.deletePrefect);

module.exports = router;

