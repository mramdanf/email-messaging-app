'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
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
      'messages',
      [
        {
          messageType: 'birth-day',
          messages: 'Happy birth day {name} whish you all the best'
        },
        {
          messageType: 'anniversary-day',
          messages: 'Happy anniversary day whish you all the best'
        }
      ],
      {}
    );
  },

  async down(queryInterface) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('messages', null, {});
  }
};
