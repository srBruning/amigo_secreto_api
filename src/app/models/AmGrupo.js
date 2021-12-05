const Sequelize = require('sequelize');

class AmGrupo extends Sequelize.Model {
    static init(sequelize){
        super.init({
            id_dono: {
                type: Sequelize.INTEGER,
                allowNull: false
            },

            name: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'Por favor entre com o nome'
                      },
                    notEmpty: true,  
                    len: [2,40],  
                }
            },

            chave: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'Por favor entre com a chave'
                      },
                    notEmpty: true,  
                    len: [5,40],  
                }
            },
            drawn_at: {
              type: Sequelize.DATE,
              allowNull: true,
      
            }
        }, {
            sequelize,
            modelName: 'AmGrupo',
            tableName: 'am_grupo'
        });

        return this;
    }
}


module.exports = AmGrupo;