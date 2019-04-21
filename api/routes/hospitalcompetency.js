const express = require('express');
const HospitalCompetencyController = require('../controllers/hospitalcompetencies.js');

const router = express.Router();

router.get('/', HospitalCompetencyController.findAll);
router.get('/:hospitalDepartmentId', HospitalCompetencyController.findOne);
router.post('/', HospitalCompetencyController.create);
router.put('/:hospitalDepartmentId', HospitalCompetencyController.update);
router.delete('/:hospitalDepartmentId', HospitalCompetencyController.destroy);

module.exports = router;
