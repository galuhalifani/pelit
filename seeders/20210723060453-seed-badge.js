'use strict';
const data = require('./data/badges.json')

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
   await queryInterface.bulkInsert('Badges', [{
        name: "Achiever",
        description: "Hit your monthly spending target",
        imgUrl: "https://img.icons8.com/bubbles/2x/medal.png",
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        name: "Super Saver",
        description: "Hit your monthly spending target by 20% or more!",
        imgUrl: "https://pics.freeicons.io/uploads/icons/png/16176769221547545110-512.png",
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        name: "Spender",
        description: "Overspend and miss your monthly spending target",
        imgUrl: "https://i.pinimg.com/originals/41/08/b8/4108b827c442845661a8ec8b14df14cb.png",
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        name: "Big Spender",
        description: "Overspend on your monthly spending target by 20% or more",
        imgUrl: "https://image.flaticon.com/icons/png/512/1999/1999238.png",
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        name: "Soon Bankrupt",
        description: "Overspend on your monthly spending target by 50% or more",
        imgUrl: "https://www.pngitem.com/pimgs/m/172-1725046_happy-man-poor-png-beggar-png-transparent-png.png",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('Badges', null, {})
  }
};
