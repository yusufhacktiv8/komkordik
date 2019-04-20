const express = require('express');

const router = express.Router();
const CompetencyController = require('../controllers/competencies.js');

router.get('/', CompetencyController.all);

module.exports = router;
