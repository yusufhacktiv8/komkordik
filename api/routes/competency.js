const express = require('express');
const CompetencyController = require('../controllers/competencies.js');
const { isAuthorizedAs } = require('../helpers/AuthUtils');

const router = express.Router();

router.get('/', isAuthorizedAs('ADMIN'), CompetencyController.findAll);
router.get('/:competencyId', isAuthorizedAs('ADMIN'), CompetencyController.findOne);
router.post('/', isAuthorizedAs('ADMIN'), CompetencyController.create);
router.put('/:competencyId', isAuthorizedAs('ADMIN'), CompetencyController.update);
router.delete('/:competencyId', isAuthorizedAs('ADMIN'), CompetencyController.destroy);

module.exports = router;
