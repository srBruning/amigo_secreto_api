'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    return queryInterface.createTable('users', {
        id: {
          type: Sequelize.INTEGER, 
          allowNull: false,
          autoIncrement: true,
          primaryKey: true

        },
        user_name: {
          type: Sequelize.STRING(50), 
          allowNull: false,
          unique: true
        },
        name: {
          type: Sequelize.STRING(50), 
          allowNull: false,

        },
        password: {
          type: Sequelize.STRING(50), 
          allowNull: false,

        },
        wishlist: {
          type: Sequelize.STRING(500), 
          allowNull: true,

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
    return queryInterface.dropTable('users');
  }
};
