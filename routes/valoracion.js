'use strict'

var express = require('express');
var ValoracionController = require ('../controllers/valoracion');
var api = express.Router();
var md_auth = require ('../middlewares/authenticated');

api.post('/guardarValoracion', md_auth.ensureAuth, ValoracionController.guardarValoracion);
api.get('/mostrarValoracion/:id', md_auth.ensureAuth, ValoracionController.mostrarValoracion);
api.get('/mostrarValoraciones/:page?', md_auth.ensureAuth, ValoracionController.mostrarValoraciones);
api.put('/updateValoracion/:id', md_auth.ensureAuth, ValoracionController.updateValoracion);
api.delete('/borrarValoracion/:id', md_auth.ensureAuth, ValoracionController.deleteValoracion);

module.exports = api;