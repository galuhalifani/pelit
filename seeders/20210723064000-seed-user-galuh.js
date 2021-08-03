'use strict';
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}

const { passwordHash } = require("../helpers/passwordBcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: "galuh.alifani@gmail.com",
      password: passwordHash('password123'),
      fullName: 'Galuh Adika Alifani',
      photoProfile: null,
      balance: 10000000,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ])
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
