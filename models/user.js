"use strict";
const { passwordHash } = require("../helpers/passwordBcrypt");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Badge, { through: "Achievement" });
      User.hasMany(models.Achievement, { foreignKey: "UserId" });
      User.hasMany(models.Target, { foreignKey: "UserId" });
      User.hasMany(models.Transaction, { foreignKey: "UserId" });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Email must be unique",
        },
        validate: {
          notEmpty: {
            msg: "Email cannot be empty",
          },
          notNull: {
            msg: "Email cannot be null",
          },
          isEmail: {
            msg: "Should be email type",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Password cannot be empty",
          },
          notNull: {
            msg: "Password cannot be null",
          },
          isLength(password) {
            if (password.length < 5) {
              throw new Error("Password should be minimal 5 characters");
            }
          },
        },
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Full name cannot be empty",
          },
          notNull: {
            msg: "Full name cannot be null",
          },
        },
      },
      photoProfile: DataTypes.STRING,
      balance: DataTypes.FLOAT,
      pushToken: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  User.beforeCreate((user) => {
    user.password = passwordHash(user.password);
  });
  User.beforeUpdate((user) => {
    user.password = passwordHash(user.password);
  });
  return User;
};
