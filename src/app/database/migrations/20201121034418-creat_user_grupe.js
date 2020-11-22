'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_grupo', {
      id: {
        type: Sequelize.INTEGER, 
        allowNull: false,
        autoIncrement: true,
        primaryKey: true

      },
      grupo_id: {
        type: Sequelize.INTEGER, 
        allowNull: false,
        unique: 'usergrupoindex',
        references: {
          model: 'am_grupo',  
          key: 'id' 
        },
        onUpdate: 'CASCADE'

      },
      user_id: {
        type: Sequelize.INTEGER, 
        allowNull: false,
        unique: 'usergrupoindex',
        references: {
          model: 'users',  
          key: 'id' 
        },
        onUpdate: 'CASCADE'

      },
      drawn_user_id: {
        type: Sequelize.INTEGER, 
        allowNull: true,
        references: {
          model: 'users',  
          key: 'id' 
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'

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
  return queryInterface.dropTable('user_grupo');
}
};
