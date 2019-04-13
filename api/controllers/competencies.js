const models = require('../models');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findAll = function findAll(req, res) {
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  const limit = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage, 10) : 1;
  const offset = (currentPage - 1) * limit;
  models.Competency.findAndCountAll({
    where: {
      $or: [
        { code: { $ilike: searchText } },
        { name: { $ilike: searchText } },
      ],
    },
    include: [
      { model: models.Department },
    ],
    limit,
    offset,
  })
  .then((competencys) => {
    res.json(competencys);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.findOne = function findOne(req, res) {
  models.Competency.findOne({
    where: { id: req.params.competencyId },
  })
  .then((competency) => {
    res.json(competency);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.create = function create(req, res) {
  const competencyForm = req.body;
  const departmentId = parseInt(competencyForm.department, 10);
  competencyForm.DepartmentId = departmentId;
  models.Competency.create(competencyForm)
  .then((competency) => {
    res.json(competency);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.update = function update(req, res) {
  const competencyForm = req.body;
  const departmentId = parseInt(competencyForm.department, 10);
  competencyForm.DepartmentId = departmentId;
  models.Competency.update(
    competencyForm,
    {
      where: { id: req.params.competencyId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.Competency.destroy(
    {
      where: { id: req.params.competencyId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};
