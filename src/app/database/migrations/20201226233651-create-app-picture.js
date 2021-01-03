'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('app_pictures', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      url: {
        type: Sequelize.STRING(400)
      },
      key: {
        type: Sequelize.STRING(200)
      },
      original_name: {
        type: Sequelize.STRING(200)
      },
      created_at: {
        type: Sequelize.DATE, 
        allowNull: false,

      },
      updated_at: {
        type: Sequelize.DATE, 
        allowNull: false,

      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('app_pictures');
  }
};