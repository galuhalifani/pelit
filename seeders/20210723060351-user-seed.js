const { passwordHash } = require("../helpers/passwordBcrypt");

("use strict");
const data = require("./data/users.json");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "Users",
      data.map((ele) => {
        ele.createdAt = new Date();
        ele.updatedAt = new Date();
        ele.password = passwordHash(ele.password);
        return ele;
      })
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {});
  },
};
