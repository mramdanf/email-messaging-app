'use strict';

const { faker } = require('@faker-js/faker');
const momentTz = require('moment-timezone');

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
      [...Array(100)].map(() => ({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        location: 'Asia/Jakarta',
        birthDayDate: `1994-${momentTz().tz('Asia/Jakarta').format('MM-DD')}`
      })),
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
