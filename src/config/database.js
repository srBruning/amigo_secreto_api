require("dotenv-safe").config(); 

module.exports = {
  "username": process.env.USERNMAE_DB,
  "password": process.env.PASSWORD_DB,
  "database": "amigo_secreto",
  "host": "127.0.0.1",
  "dialect": "mysql",
  "define":{
    "timestamps": true,
    "underscored": true,
    "underscoredAll":true
  }
}