'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User, {foreignKey: 'UserId'})
    }
  };
  Transaction.init({
    title: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    category: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    fullDate: DataTypes.DATE,
    date: DataTypes.INTEGER,
    month: DataTypes.INTEGER,
    year: DataTypes.INTEGER,
    receiptImage: DataTypes.STRING,
    note: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};