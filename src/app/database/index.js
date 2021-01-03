const Sequelize = require('sequelize');

const User = require('../models/User');
const AmGrupo = require('../models/AmGrupo');
const UserGrupo = require('../models/UserGrupo');
const databaseConfig = require('../../config/database');
const AppPicture = require('../models/AppPicture');

const models = [User, AmGrupo, UserGrupo, AppPicture];

class Database {
    constructor(){
        this.init();
    }

    init(){
        this.connection = new Sequelize(databaseConfig);

        models
        .map(model => model.init(this.connection))
        .map(model => model.associate && model.associate(this.connection.models) );

        UserGrupo.belongsTo(User, {as: 'user'});
        UserGrupo.belongsTo(User,  {foreignKey: 'drawn_user_id', as: 'friend'});
        UserGrupo.belongsTo(AmGrupo, {foreignKey: 'grupo_id', as: 'grupo'});
        User.hasMany(UserGrupo, { foreignKey: 'user_id', as:"grupos" });
        User.hasMany(UserGrupo, { foreignKey: 'drawn_user_id' });
        User.belongsTo(AppPicture, { foreignKey: 'picture_avatar_id', as: "picture_avatar" });
        AmGrupo.hasMany(UserGrupo, { foreignKey: 'grupo_id', as: 'membros' });
        //AmGrupo.belongsToMany(User, { through: 'UserGrupo', as: 'mebros', foreignKey: 'grupo_id'  });

    }

}

module.exports = new Database();