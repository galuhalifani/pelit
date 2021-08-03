'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Achievement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Achievement.belongsTo(models.User, {foreignKey: 'UserId'})
      Achievement.belongsTo(models.Badge, {foreignKey: 'BadgeId'})
    }
  };
  Achievement.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    UserId: DataTypes.INTEGER,
    BadgeId: DataTypes.INTEGER,
    date: DataTypes.INTEGER,
    month: DataTypes.INTEGER,
    year: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Achievement',
  });
  return Achievement;
};