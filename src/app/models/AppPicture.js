'use strict';
const Sequelize = require('sequelize');

class AppPicture extends Sequelize.Model {
  
  static init(sequelize){
    super.init({
      url: Sequelize.STRING,
      key: Sequelize.STRING,
      original_name: Sequelize.STRING
    }, {
      sequelize,
      modelName: 'AppPicture',
      tableName: 'app_pictures'
    });
    return this;
  }
};

module.exports = AppPicture;