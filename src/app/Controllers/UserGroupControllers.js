require("dotenv-safe").config();
const jwt = require("jsonwebtoken");
const UserGrupo = require("../models/UserGrupo");
const User = require("../models/User");
const AmGrupo = require("../models/AmGrupo");
const AppPicture = require("../models/AppPicture");

class UserGroupController {
  async store(req, res) {
    try {
      const listGrupo = await AmGrupo.findAll({
        where: {
          chave: req.params.key,
        },
      });

      if (listGrupo.length != 1) {
        res.status(404).send({ message: "Nenhum grupo encontrado" });
        return;
      }
      let user_grup = { grupo_id: listGrupo[0].id, user_id: req.userId };

      const response = await UserGrupo.create(user_grup);
      return res.json(response);
    } catch (err) {
      if (err.name === "SequelizeForeignKeyConstraintError") {
        if (err.fields[0] == "user_id")
          return res.status(400).send({
            message: "Usuário não encontrado",
            fields_errors: err.errors,
          });

        if (err.fields[0] == "grupo_id")
          return res.status(400).send({
            message: "Grupo não encontrado",
            fields_errors: err.errors,
          });
      }

      if (err.name === "SequelizeUniqueConstraintError")
        return res
          .status(400)
          .send({ message: "Voce ja pertence a esse grupo" });

      if (err.name === "SequelizeValidationError")
        return res.status(400).send({ fields_errors: err.errors });

      res.status(500).send({
        message: err.message,
        stack: err.stack,
        fields_errors: err.errors,
      });
    }
  }

  async index(req, res) {
    try {
      const user_grupo = await UserGrupo.findAll({
        where: {
          user_id: req.userId,
        },
        include: [
          {
            model: AmGrupo,
            as: "grupo",
          },
        ],
      });

      return res.json(user_grupo);
    } catch (err) {
      res
        .status(500)
        .send({ error: err, message: err.message, stack: err.stack });
    }
  }

  async byGrupId(req, res) {
    try {
      const user_grupo = await UserGrupo.findAll({
        where: {
          grupo_id: req.params.grupo_id,
          user_id: req.userId,
        },
        include: [
          { model: User.scope("withoutPassword"), as: "friend",  include: { model: AppPicture, as: "picture_avatar" } },
          {
            model: AmGrupo,
            as: "grupo",
            include: [
              {
                model: UserGrupo.scope("withoutFriend"),
                as: "membros",
                include: [
                  {
                    model: User.scope("withoutPassword"),
                    as: "user",
                    include: { model: AppPicture, as: "picture_avatar" },
                  },
                ],
              },
            ],
          },
        ],
     });
      if (user_grupo == undefined || user_grupo.length == 0) {
        return null;
      }
	const lst = user_grupo.map((node) => node.get({ plain: true }));
      const ret =lst[0];
      ret.is_dono= (req.userId ==ret.grupo.id_dono);

      return res.json(ret);
    } catch (err) {
      res
        .status(500)
        .send({ error: err, message: err.message, stack: err.stack });
    }
  }

  async draw(req, res) {
    try {
      const grupo = await AmGrupo.findByPk(req.params.grupo_id);
      if (!grupo) {
        res.status(404).send({ message: "Nenhum grupo encontrado" });
      }
      if (grupo.id_dono != req.userId) {
        res
          .status(400)
          .send({
            message: "Somente o administador do grupo pode gerar o sorteio",
          });
      }
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
      let aux = list[list.length - 1];
      for (let index = 0; index < list.length; index++) {
        const userGrup = list[index];
        userGrup.drawn_user_id = aux.user_id;
        aux = userGrup;
        await userGrup.save();
      }
      grupo.drawn_at = Date.now();
      await grupo.save();
      return res.json(list);
    } catch (err) {
      res
        .status(500)
        .send({ error: err, message: err.message, stack: err.stack });
    }
  }
}
function shuffle(array) {
  let m = array.length,
    t,
    i;

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
