'use strict';
module.exports = function(sequelize, DataTypes) {
  var HospitalCompetency = sequelize.define('HospitalCompetency', {
    score: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  HospitalCompetency.associate = function (models) {
    HospitalCompetency.belongsTo(models.Hospital, { onDelete: 'restrict' });
    HospitalCompetency.belongsTo(models.Competency, { onDelete: 'restrict' });
  };

  return HospitalCompetency;
};
