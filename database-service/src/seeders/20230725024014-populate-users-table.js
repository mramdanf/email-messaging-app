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
      'users',
      [
        {
          firstName: 'Mohamad Ramdan',
          lastName: 'Firdaus',
          email: 'asdf@gmail.com',
          birthDayDate: '1997-06-04',
          location: 'Asia/Jakarta'
        },
        {
          firstName: 'lisda',
          lastName: 'adistiani',
          email: 'ldis@gmail.com',
          birthDayDate: '1999-03-20',
          location: 'Asia/Makassar'
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
    await queryInterface.bulkDelete('users', null, {});
  }
};
