const models = require('../models');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findAll = function findAll(req, res) {
  // const hospitalId = req.params.hospitalId;
  models.HospitalCompetency.findAll({
    where: {},
    include: [
      {
        model: models.Hospital,
      },
      {
        model: models.Competency,
      },
    ],
  })
  .then((hospitalCompetencies) => {
    res.json(hospitalCompetencies);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.findOne = function findOne(req, res) {
  models.HospitalCompetency.findOne({
    where: { id: req.params.hospitalCompetencyId },
  })
  .then((hospitalCompetency) => {
    res.json(hospitalCompetency);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.create = function create(req, res) {
  const { hospital, competency, score } = req.body;
  models.HospitalCompetency.create({
    HospitalId: hospital,
    CompetencyId: competency,
    score,
  })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.update = function update(req, res) {
  const { hospital, competency, score } = req.body;
  models.HospitalCompetency.update({
      HospitalId: hospital,
      CompetencyId: competency,
      score,
    },
    {
      where: { id: req.params.hospitalCompetencyId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.HospitalCompetency.destroy(
    {
      where: { id: req.params.hospitalCompetencyId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};
