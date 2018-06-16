'use strict'

var express = require('express');
var ItemController = require ('../controllers/item');
var api = express.Router();
var md_auth = require ('../middlewares/authenticated');

api.post('/guardarItem', md_auth.ensureAuth, ItemController.guardarItem);
api.get('/mostrarItem/:id', md_auth.ensureAuth, ItemController.mostrarItem);
api.get('/mostrarItemsAsignados/:idAsignaturaAsignada', md_auth.ensureAuth, ItemController.mostrarItemsAsignatura);
api.put('/updateItem/:id', md_auth.ensureAuth, ItemController.updateItem);
api.put('/cambiarValoracionItem/:id', md_auth.ensureAuth, ItemController.updateItemValoracion);
api.delete('/borrarItem/:id', md_auth.ensureAuth, ItemController.deleteItem);

module.exports = api;