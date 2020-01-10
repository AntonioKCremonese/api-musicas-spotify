const {Router} = require('express');
const AppControler = require('./controllers/AppController');

const routes = new Router();

routes.get('/musicas',AppControler.index);

module.exports = routes;