const Sequelize = require('sequelize');

class User extends Sequelize.Model {
    static init(sequelize){
        super.init({
            user_name: {
                type: Sequelize.STRING,
                allowNull: false,  
                validate: {
                    notNull: {
                        msg: 'Por favor entre com um username'
                      },
                    not: /[`~,.<>;':"/[\]|{}()=_+-]/,
                    not: /(\s)/,
                    notEmpty: true,  
                    len: [3,30]
                }
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'Por favor entre com seu nome'
                      },
                    notEmpty: true,  
                    len: [2,40],  
                }
            },  
            password: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notNull: {
                        msg: 'Por favor entre com uma senha'
                      },
                    notEmpty: true,  
                    len: [5,40],  
                }
            },  
            wishlist: Sequelize.STRING
        }, {
            sequelize,
            scopes: {
                withoutPassword: {
                  attributes: { exclude: ['password'] },
                }
              },
            model: "users"
        });

        return this;
    }
}


module.exports = User;