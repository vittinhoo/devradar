const { Router } = require('express');

const DevController = require('./controllers/DevController');
const SeachController = require('./controllers/SearchController');

const routes = Router();

routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);

routes.get('/search', SeachController.index);

module.exports = routes;


// Métodos HTTP: GET, POST, PUT, DELETE

// Tipos de parâmetros:

// Query params (GET): request.query (filtros, ordenação, paginação, etc)
// Route params (PUT, DELETE): request.params (identificar um recurso na alteração ou remoção) 
// Body (POST, PUT): request.body (dados para criação ou alteração de um registro)

// MongoDB (Não relacional)