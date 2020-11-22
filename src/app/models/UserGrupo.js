const Sequelize = require('sequelize');

class UserGrupo extends Sequelize.Model {
    static init(sequelize){
        super.init({
            
      grupo_id: {
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: {
          model: 'am_grupo',  
          key: 'id' 
        }
      },
      user_id: {
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: {
          model: 'users',  
          key: 'id' 
        }
      },
      drawn_user_id: {
        type: Sequelize.INTEGER, 
        allowNull: true,
        references: {
          model: 'users',  
          key: 'id' 
        }

      },    
        }, {
            sequelize,
            modelName: 'UserGrupo',
            tableName: 'user_grupo',
            scopes: {
                withoutFriend: {
                  attributes: { exclude: ['drawn_user_id'] },
                }
              }
        });

        return this;
    }
}


module.exports = UserGrupo;