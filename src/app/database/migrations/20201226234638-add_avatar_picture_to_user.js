'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    // logic for transforming into the new state
    return queryInterface.addColumn(
      'users',
      'picture_avatar_id',
      {
        type: Sequelize.INTEGER, 
        allowNull: true,
        references: {
          model: 'app_pictures',  
          key: 'id' 
        },
        onUpdate: 'CASCADE'
      }
    );

  },

  down: function(queryInterface, Sequelize) {
    // logic for reverting the changes
    return queryInterface.removeColumn(
      'users',
      'picture_avatar_id'
    );
  }

}
