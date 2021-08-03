'use strict';

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
    await queryInterface.bulkInsert('User', {
      "email": "galuh.adika@gmail.com",
      "password": "$2a$10$MbgfUyjJ4e0\/jh1sPTjrq.UKuHaZaADWlfj97DLaDw5u3vNWL2UCS",
      "fullName": "Galuh Adika Alifani",
      "photoProfile": "https:\/\/ik.imagekit.io\/77pzczg37zw\/Alifani_G.jpg?updatedAt=1625136098428",
      "balance": 2.3724E7,
      "pushToken": "ExponentPushToken[mF7feDNTtEhWIfu-SdOwG9]"
    }
    )
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
