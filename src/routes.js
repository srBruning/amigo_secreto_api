const jwt = require('jsonwebtoken');
const Router  = require('express');
const multer = require('multer');
const routes = new Router();

const UserControllers = require('./app/Controllers/UserControllers');
const GroupControllers = require('./app/Controllers/GroupControllers'); 
const UserGroupControllers = require('./app/Controllers/UserGroupControllers'); 
const multerConfig = require('./config/multer');
 
function verifyJWT(req, res, next){
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err ) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
   
      // se tudo estiver ok, salva no request para uso posterior
      req.userId = decoded.id;
      req.decoded = decoded;
      next();
    });
}


routes.post('/api/user/avatar', verifyJWT, multer(multerConfig).single('file'), (req, res) => {
  console.log(req.file);
  UserControllers.updateAvatar(req, res);
});

routes.post('/api/user', UserControllers.store);
routes.post('/api/singin',  UserControllers.login);
routes.get('/api/users',verifyJWT,  UserControllers.index);
routes.get('/api/users/show', verifyJWT,  UserControllers.show);
routes.get('/api/users/:id', verifyJWT,  UserControllers.show);
routes.get('/api/auth/refresh', verifyJWT,  UserControllers.refresh);

routes.post('/groups', verifyJWT, GroupControllers.store);
routes.get('/groups',verifyJWT,  GroupControllers.index);
routes.get('/groups/:id',verifyJWT,  GroupControllers.show);

routes.post('/user_group', verifyJWT, UserGroupControllers.store);
routes.get('/user_group',verifyJWT,  UserGroupControllers.index);
routes.get('/user_group/:grupo_id',verifyJWT,  UserGroupControllers.byGrupId);
routes.get('/draw/:grupo_id',verifyJWT,  UserGroupControllers.draw);


routes.get('/', verifyJWT, (req, res) => {
  res.json({message: "hello word "+req.userId});
});



module.exports = routes;