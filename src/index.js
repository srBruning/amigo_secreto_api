require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

const express = require('express');

const app = express();

require('./app/database');

const routes = require('./routes');

app.use(express.json());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization, x-access-token');
    next();
  });

app.use(routes);

app.listen(3636);
