'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('am_grupo', {
      id: {
        type: Sequelize.INTEGER, 
        allowNull: false,
        autoIncrement: true,
        primaryKey: true

      },
      name: {
        type: Sequelize.STRING(50), 
        allowNull: false,

      },
      drawn_at: {
        type: Sequelize.DATE,
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
  return queryInterface.dropTable('am_grupo');
}
};
