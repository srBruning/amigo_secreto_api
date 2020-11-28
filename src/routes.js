const jwt = require('jsonwebtoken');
const Router  = require('express');

const routes = new Router();

const UserControllers = require('./app/Controllers/UserControllers');
const GroupControllers = require('./app/Controllers/GroupControllers'); 
const UserGroupControllers = require('./app/Controllers/UserGroupControllers'); 

 
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


routes.post('/user', UserControllers.store);
routes.post('/singin',  UserControllers.login);
routes.get('/users',verifyJWT,  UserControllers.index);
routes.get('/users/perfil', verifyJWT,  UserControllers.show);
routes.get('/users/:id', verifyJWT,  UserControllers.show);
routes.get('/auth/refresh', verifyJWT,  UserControllers.refresh);

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