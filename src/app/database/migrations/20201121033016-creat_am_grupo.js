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
      id_dono: {
        type: Sequelize.INTEGER, 
        allowNull: false, 
        references: {
          model: 'users',  
          key: 'id' 
        },

      },
      name: {
        type: Sequelize.STRING(50), 
        allowNull: false,

      },
      chave: {
        type: Sequelize.STRING(50), 
        allowNull: false,
        unique: true

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
