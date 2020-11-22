require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
const AmGrupo = require('../models/AmGrupo');
const UserGrupo = require('../models/UserGrupo');


class GroupController {
    async store(req, res){
       
        try{ 
            const groupo = await AmGrupo.create(req.body);
            return res.json(groupo); 
        }catch(err){
            if(err.name === 'SequelizeUniqueConstraintError')
                return res.status(400).send({message: "nome de grpo ja está em uso"});
            
            if(err.name === 'SequelizeValidationError')
                return res.status(400).send({fields_errors: err.errors});
            
            res.status(500).send({ error: err });
        }
    }

    async index(req, res){
        try{
            const grupos = await AmGrupo.findAll();
            return res.json(grupos); 
        }catch(err){
            res.status(500).send({ error: err, message: err.message, stack: err.stack});
        }
    }

    async show(req, res){
        try{
            const grupo = await AmGrupo
                .findByPk(req.params.id, 
                { 
                    include:[{
                        model: UserGrupo.scope('withoutFriend'), as: "membros",
                        include:"user"
                    } ]
                });
            return res.json(grupo); 
        }catch(err){
            res.status(500).send({ error: err.message });
        }
    }
}


module.exports = new GroupController();