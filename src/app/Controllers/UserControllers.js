require("dotenv-safe").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AmGrupo = require("../models/AmGrupo");
const UserGrupo = require("../models/UserGrupo");
const AppPicture = require("../models/AppPicture");
const pictureService = require("../services/PictureSevice");

async function _login(res, user) {
  if (user) {
    const token = await jwt.sign({ id: user.id }, process.env.SECRET, {
      expiresIn: 10000,
    });
    return res.json({ id: user.id, token: token });
  }
  return res.status(404).send({ message: "não autorizado" });
}

class UserController {
  async store(req, res) {
    try {
      const _user = req.body;
      if (!_user.password || _user.password.length < 5) {
        return res
          .status(400)
          .send({ error: "the password must contain at least 5 characters" });
      }

      const user = await User.create(req.body);
      const token = await jwt.sign({ id: user.id }, process.env.SECRET, {
        expiresIn: 10000,
      });
      user.password = undefined;
      return res.json({ id: user.id, token: token });
    } catch (err) {
      if (err.name === "SequelizeUniqueConstraintError")
        return res
          .status(400)
          .send({ message: "nome de usuário ja esta em uso" });

      if (err.name === "SequelizeValidationError")
        return res.status(400).send({ fields_errors: err.errors });

      res.status(500).send({ error: err });
    }
  }

  async update(req, res) {
    try {
      if (req.params.id != req.userId)
        return res
          .status(401)
          .send({ error: "Usuario não tem permição para alterar" });

      const _user = req.body;
      if (_user.password && _user.password.length < 5) {
        return res.status(400).send({ error: "Senha muito pequena" });
      }

      _user.user_name = undefined;

      const user = await User.findByPk(req.userId);
      if (user == null) return res.status(404);

      user.update(_user);

      user.save();
      user.password = undefined;
      return res.json(user);
    } catch (err) {
      if (err.name === "SequelizeUniqueConstraintError")
        return res
          .status(400)
          .send({ message: "nome de usuário ja esta em uso" });

      if (err.name === "SequelizeValidationError")
        return res.status(400).send({ fields_errors: err.errors });

      res.status(500).send({ error: err });
    }
  }

  async index(req, res) {
    try {
      const users = await User.scope("withoutPassword").findAll();
      return res.json(users);
    } catch (err) {
      res.status(500).send({ error: err });
    }
  }

  async show(req, res) {
    try {
      const id = req.params && req.params.id ? req.params.id : req.userId;
      const modelUserGrup =
        req.params && req.params.id
          ? UserGrupo.scope("withoutFriend")
          : UserGrupo;
      const users = await User.scope("withoutPassword").findByPk(id, {
        include: [
          {
            model: modelUserGrup,
            as: "grupos",
            include: [
              { model: AmGrupo, as: "grupo" },
              { model: User.scope("withoutPassword"), as: "friend" },
            ],
          },
          { model: AppPicture, as: "picture_avatar" },
        ],
      });
      return res.json(users);
    } catch (err) {
      res.status(500).send({ error: err.message, stack: err.stack });
    }
  }

  async updateAvatar(req, res) {
    try {
      if (!req.file.Location) {
        if (req.file.xs) {
          req.file.Key = req.file.key;
          req.file.Location = req.file.xs.Location;
        } else
          req.file.Location = `${process.env.APP_URL}/files/${req.file.Key}`;
      }

      const user = await User.findByPk(req.userId, {
        include: { model: AppPicture, as: "picture_avatar" },
      });

      const current_picture_avatar = user.picture_avatar;

      user.picture_avatar = await AppPicture.create({
        url: req.file.Location,
        key: req.file.Key,
        original_name: req.file.originalname,
      });
      user.picture_avatar_id = user.picture_avatar.id;
      user.save();

      if (current_picture_avatar)
        try {
          pictureService.deletePicture(current_picture_avatar);
        } catch (error) {
          console.log("Erro ao deletar imagem antiga", error);
        }

      return res.json({ id: user.id, picture_avatar: user.picture_avatar });
    } catch (err) {
      res.status(500).send({ error: err.message, stack: err.stack });
    }
  }

  async login(req, res) {
    try {
      const users = await User.findAll({
        where: {
          user_name: req.body.user_name,
          password: req.body.password,
        },
      });
      return await _login(res, users ? users[0] : null);
    } catch (err) {
      return res.status(500).send({ error: err.message, stack: err.stack });
    }
  }

  async refresh(req, res) {
    try {
      const user = await User.findByPk(req.userId);
      return await _login(res, user);
    } catch (err) {
      res.status(500).send({ error: err });
    }
  }
}

module.exports = new UserController();
