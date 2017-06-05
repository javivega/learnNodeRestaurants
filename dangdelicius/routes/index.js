const express = require('express');
const router = express.Router();
const miController = require('../controllers/micontroller');

// Do work here
router.get('/', miController.micontroller);

module.exports = router;
