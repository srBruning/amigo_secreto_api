'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return  queryInterface.addConstraint('user_grupo', {
      fields: ['grupo_id', 'drawn_user_id'],
      type: 'unique',
      name: 'usergrupo_drawn_uk'
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
