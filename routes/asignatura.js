'use strict'

var express = require('express');
var AsignaturaController = require ('../controllers/asignatura');
var api = express.Router();
var md_auth = require ('../middlewares/authenticated');

api.post('/guardarAsignatura', md_auth.ensureAuth, AsignaturaController.guardarAsignatura);
api.get('/mostrarAsignatura/:id', md_auth.ensureAuth, AsignaturaController.mostrarAsignatura);
api.get('/mostrarAsignaturasCuestionario/:idCuestionarioAsignado', md_auth.ensureAuth, AsignaturaController.mostrarAsignaturasCuestionario);
api.put('/updateAsignatura/:id', md_auth.ensureAuth, AsignaturaController.updateAsignatura);
api.delete('/borrarAsignatura/:id', md_auth.ensureAuth, AsignaturaController.deleteAsignatura);

module.exports = api;