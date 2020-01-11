const {Router} = require('express');
const AppControler = require('./controllers/AppController');

const routes = new Router();

routes.get('/playlist',AppControler.index);

module.exports = routes;