'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('archivo', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      mime: {
        type: Sequelize.STRING,
        allowNull: false
      },
      size:{
        type: Sequelize.INTEGER,
        allowNull: false
      },
      indb:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      datos: {
        type: Sequelize.BLOB('long'),
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('archivo');
  }
};