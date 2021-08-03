'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Target extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Target.belongsTo(models.User, {foreignKey: 'UserId'})
    }
  };
  Target.init({
    UserId: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    monthlyTarget: DataTypes.FLOAT,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Target',
  });
  return Target;
};