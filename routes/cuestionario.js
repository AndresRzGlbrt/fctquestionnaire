'use strict'

var express = require('express');
var CuestionarioController = require ('../controllers/cuestionario');
var api = express.Router();
var md_auth = require ('../middlewares/authenticated');

api.post('/guardarCuestionario', md_auth.ensureAuth, CuestionarioController.guardarCuestionario);
api.get('/mostrarCuestionario/:id', md_auth.ensureAuth, CuestionarioController.mostrarCuestionario);
api.get('/mostrarCuestionariosAsignados/:idUserAsignado', md_auth.ensureAuth, CuestionarioController.mostrarCuestionariosUser);
api.get('/mostrarNumCuestionariosValoracion/:idValoracion', md_auth.ensureAuth, CuestionarioController.mostrarNumCuestionariosValoracion);
api.get('/mostrarCuestionariosRespondidos/:idAdminCreador', md_auth.ensureAuth, CuestionarioController.mostrarCuestionariosAdminUserRespondido);
api.get('/mostrarCuestionariosModeloAdmin/:idAdminCreador', md_auth.ensureAuth, CuestionarioController.mostrarCuestionariosModeloAdmin);
api.get('/mostrarCuestionariosRespondidosPorUser/:idUserAsignado', md_auth.ensureAuth, CuestionarioController.mostrarCuestionariosUserRespondido);
api.put('/updateCuestionario/:id', md_auth.ensureAuth, CuestionarioController.updateCuestionario);
api.put('/updateCuestionarioARespondido/:id', md_auth.ensureAuth, CuestionarioController.updateCuestionarioARespondido);
api.delete('/borrarCuestionario/:id', md_auth.ensureAuth, CuestionarioController.deleteCuestionario);

module.exports = api;