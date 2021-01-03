require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AmGrupo = require('../models/AmGrupo');
const UserGrupo = require('../models/UserGrupo');
const AppPicture = require('../models/AppPicture');

const aws = require('aws-sdk');
const s3 = aws.s3();
 

class PictureController { 
}


module.exports = new UserController();