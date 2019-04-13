'use strict';
module.exports = function(sequelize, DataTypes) {
  var Competency = sequelize.define('Competency', {
    code: { type: DataTypes.STRING, unique: true },
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  Competency.associate = function (models) {
    Competency.belongsTo(models.Department, { onDelete: 'restrict' });
  };

  return Competency;
};
