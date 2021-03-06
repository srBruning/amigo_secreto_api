require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
const UserGrupo = require('../models/UserGrupo');
const User = require('../models/User');
const AmGrupo = require('../models/AmGrupo');

class UserGroupController {
    async store(req, res){
       
        try{ 
            let user_grup = req.body;
            user_grup.user_id = req.userId ; 
            const response = await UserGrupo.create(user_grup)
            return res.json(response); 
        }catch(err){
            if(err.name === 'SequelizeForeignKeyConstraintError'){
                if(err.fields[0] == 'user_id')
                    return res.status(400).send({message: "Usuário não encontrado", fields_errors: err.errors});
            
                if(err.fields[0] == 'grupo_id')
                    return res.status(400).send({message: "Grupo não encontrado", fields_errors: err.errors});
            }

            if(err.name === 'SequelizeUniqueConstraintError')
                return res.status(400).send({message: "Voce ja pertence a esse grupo"});
            
            if(err.name === 'SequelizeValidationError')
                return res.status(400).send({fields_errors: err.errors});
            
            res.status(500).send({ message: err.message, stack: err.stack , fields_errors: err.errors});
        }
    }

    async index(req, res){
        try{ 
            const user_grupo = await UserGrupo.findAll({
                where: {
                    user_id: req.userId
                }, 
                include:"friend"
              });
            return res.json(user_grupo); 
        }catch(err){
            res.status(500).send({ error: err, message: err.message, stack: err.stack});
        }
    }

    async byGrupId(req, res){
        try{
            const user_grupo = await UserGrupo.scope('withoutFriend').findAll({
                where: {
                    grupo_id: req.params.grupo_id
                }
              });
            return res.json(user_grupo); 
        }catch(err){
            res.status(500).send({ error: err, message: err.message, stack: err.stack});
        }
    }

    async draw(req, res){
        try{
            let list = await UserGrupo.findAll({
                where: {
                    grupo_id: req.params.grupo_id
                }
            });

            for (let index = 0; index < list.length; index++) {
                const userGrup = list[index];
                userGrup.drawn_user_id = null;
                await userGrup.save();
            }
            list = shuffle(list);
            let aux = list[list.length-1];
            for (let index = 0; index < list.length; index++) {
                const userGrup = list[index];
                userGrup.drawn_user_id = aux.user_id;
                aux = userGrup;
                await userGrup.save();
            }
            const grupo = await AmGrupo.findByPk(req.params.grupo_id);
            grupo.drawn_at = Date.now();
            await grupo.save();
            return res.json(list); 
        }catch(err){
            res.status(500).send({ error: err, message: err.message, stack: err.stack});
        }
    }
}
function shuffle(array) {
    let m = array.length, t, i;
  
    // While there remain elements to shuffle…
    while (m) {
  
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
  
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
  
    return array;
  }

module.exports = new UserGroupController();