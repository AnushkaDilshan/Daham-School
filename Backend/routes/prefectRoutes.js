const express = require('express');
const router = express.Router();
const prefectController = require('../controllers/prefectController');

// Get all prefects
router.get('/', prefectController.getAllPrefects);

// Get active prefects only
router.get('/active', prefectController.getActivePrefects);

// Get prefects by position
router.get('/position/:position', prefectController.getPrefectsByPosition);

// Get single prefect by ID
router.get('/:id', prefectController.getPrefectById);

// Create new prefect
router.post('/', prefectController.createPrefect);

// Update prefect
router.put('/:id', prefectController.updatePrefect);

// Delete prefect
router.delete('/:id', prefectController.deletePrefect);

module.exports = router;

