'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('user_grupo', {
      fields:['grupo_id', 'user_id'],
      type: 'unique',
      name: 'usergrupo_uk'
    });
   
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
