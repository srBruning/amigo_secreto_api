require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AmGrupo = require('../models/AmGrupo');
const UserGrupo = require('../models/UserGrupo');

async function  _login(res, user){
            
    if (user){
        const token = await jwt.sign({ id: user.id }, process.env.SECRET, {
            expiresIn: 10000 
        });
        return res.json({id:user.id, token: token}); 
    }
    return res.status(404).send({ message: "não autorizado" });
}

class UserController {
    async store(req, res){
       
        try{
            const user = await User.create(req.body);
            const token = await jwt.sign({ id: user.id }, process.env.SECRET, {
                expiresIn: 10000 // expires in 5min
            });
            user.password = undefined;
            return res.json({id:user.id, token: token}); 
        }catch(err){
            if(err.name === 'SequelizeUniqueConstraintError')
                return res.status(400).send({message: "nome de usuário ja esta em uso"});
            
            if(err.name === 'SequelizeValidationError')
                return res.status(400).send({fields_errors: err.errors});
            
            res.status(500).send({ error: err });
        }
    }

    async index(req, res){
        try{
            const users = await User.scope('withoutPassword').findAll();
            return res.json(users); 
        }catch(err){
            res.status(500).send({ error: err });
        }
    }

    async show(req, res){
        try{
            const id = (req.params && req.params.id) ? req.params.id : req.userId;
            const modelUserGrup = (req.params && req.params.id) ? UserGrupo.scope('withoutFriend') 
                : UserGrupo;
            const users = await User.scope('withoutPassword')
                .findByPk(id, 
                    { 
                        include:[{
                            model: modelUserGrup, as: "grupos",
                            include:[{model: AmGrupo, as: "grupo"},
                                     {model: User.scope('withoutPassword'), as: "friend"}]
                        } ]
                    });
            return res.json(users); 
        }catch(err){
            res.status(500).send({ error: err.message, stack: err.stack });
        }
    }

    async login(req, res){
        try{
            const users = await User
                .findAll({
                    where: {
                        user_name: req.body.user_name,
                        password: req.body.password
                    }
                  });
            return await _login(res, (users ? users[0]: null));
        }catch(err){
            return res.status(500).send({ error: err.message, stack: err.stack });
        }
    }

    async refresh(req, res){
       
        try{            
            const user = await User.findByPk(req.userId);
            return await _login(res, user);
        }catch(err){
            res.status(500).send({ error: err });
        }
    }
}


module.exports = new UserController();