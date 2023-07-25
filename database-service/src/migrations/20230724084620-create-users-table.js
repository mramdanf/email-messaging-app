'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      firstName: Sequelize.STRING,
      lastName: Sequelize.STRING,
      email: Sequelize.STRING(100),
      birthDayDate: Sequelize.DATEONLY,
      location: Sequelize.STRING(100)
    });
  },

  async down(queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     */
    await queryInterface.dropTable('users');
  }
};
